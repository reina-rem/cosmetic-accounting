import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import bcrypt from 'bcryptjs'
import { LoginDto } from './dto/login.dto'
import { UserSession } from './auth.types'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { User } from '../../entities/user.entity'
import { UserInfoDto } from './dto/user-info.dto'
import { TOKEN_COOKIE_KEY } from './session.middleware'
import { ChangeEmailDto } from './dto/change-email.dto'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

const SALT_ROUNDS = 10
const SECRET = process.env.PRIVATE_KEY

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async login(dto: LoginDto): Promise<UserInfoDto> {
    type IUser = Pick<User, (
      'id' | 'roles' | 'passwordHash'
    )>

    const user: IUser | null = await this.userRepository.findOne({
      where: { 
        email: dto.email,
      }, 
      select: { 
        id: true,
        roles: true,
        passwordHash: true,
      } 
    })

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException()
    }

    await this.verifyPassword(dto.password, dto.email, user.passwordHash)

    return this.createUserInfo(user)
  }

  async changeEmail(
    { oldEmail, newEmail, password }: ChangeEmailDto,
    userId: number,
  ): Promise<void> {
    type IUser = Pick<User, 'passwordHash'>
    const user: IUser = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
        email: oldEmail,
      },
      select: {
        passwordHash: true,
      },
    }).catch(
      () => Promise.reject(new NotFoundException())
    )

    if (!user.passwordHash) {
      throw new UnauthorizedException('Use reset-password to confirm your account')
    }

    await this.verifyPassword(password, oldEmail, user.passwordHash)

    // Feature: Send the confirmation to the email and wait for the link to be followed

    const newPasswordHash = await this.encryptPassword(password, newEmail)
    const result = await this.userRepository.update(
      { id: userId },
      { 
        email: newEmail,
        passwordHash: newPasswordHash,
      },
    )

    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }

  async changePassword(
    { newPassword, oldPassword }: ChangePasswordDto,
    userId: number,
  ): Promise<void> {
    type IUser = Pick<User, 'passwordHash' | 'email'>
    const user: IUser = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
      select: {
        passwordHash: true,
        email: true,
      }
    }).catch(() => Promise.reject(new NotFoundException()))

    if (!user.passwordHash) {
      throw new UnauthorizedException('Use reset-password to confirm your account')
    }

    await this.verifyPassword(oldPassword, user.email, user.passwordHash)

    const newPasswordHash = await this.encryptPassword(newPassword, user.email)

    await this.userRepository.update(
      { id: userId },
      { passwordHash: newPasswordHash }
    )

    // Feature: Send an email notification about the password change
  }

  async resetPassword(
    { passwordKey, password, email }: ResetPasswordDto,
  ): Promise<void> {
    const passwordHash = await this.encryptPassword(password, email)
    const result = await this.userRepository.update({ passwordKey }, { passwordHash, passwordKey: null })

    if (result.affected === 0) {
      throw new UnauthorizedException('Invalid password key')
    }

    // Feature: Send an email notification to the user about the password change
  }

  setTokenInCookie(
    res: Response, 
    userInfo: UserInfoDto
  ): Response<UserInfoDto> {
    return res.cookie(TOKEN_COOKIE_KEY, userInfo.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    }).send(userInfo)
  }

  deleteTokenFromCookie(res: Response): void {
    res.clearCookie(TOKEN_COOKIE_KEY)
  }

  createUserInfo(
    { id, roles }: Pick<User, 'id' | 'roles'>
  ): UserInfoDto {
    return {
      id,
      roles,
      token: this.jwtService.sign({
        id,
        roles,
      } satisfies UserSession)
    }
  }

  async verifyPassword(password: string, email: string, hash: string): Promise<void> {
    const passwordsEqual = await bcrypt.compare(email + password + SECRET, hash)

    if (!passwordsEqual) {
      throw new UnauthorizedException()
    }
  }

  private async encryptPassword(password: string, email: string): Promise<string> {
    return bcrypt.hash(email + password + SECRET, SALT_ROUNDS)
  }
}
