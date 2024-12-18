import { Body, Controller, Post, Put, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Response } from 'express'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UserId } from './user-id.decorator'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UserInfoDto } from './dto/user-info.dto'
import { ChangeEmailDto } from './dto/change-email.dto'
import { Roles } from './roles-guard.decorator'
import { userRoles } from '../../entities/user.entity'

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({ summary: 'Log in as an existing user' })
  @ApiResponse({ status: 201, type: UserInfoDto })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
  ): Promise<Response<UserInfoDto>> {
    const userInfo = await this.service.login(dto)
    return this.service.setTokenInCookie(res, userInfo)
  }

  @ApiOperation({ summary: 'Log out' })
  @ApiResponse({ status: 201, type: String })
  @Roles(userRoles)
  @Post('logout')
  logout(
    @Res() res: Response,
  ): Response<string> {
    this.service.deleteTokenFromCookie(res)
    return res.send('Logout successful')
  }

  @ApiOperation({ summary: 'Change the account email on behalf of the current user' })
  @Roles(userRoles)
  @Put('email')
  async changeEmail(
    @Body() dto: ChangeEmailDto,
    @UserId() userId: number,
  ): Promise<void> {
    return this.service.changeEmail(dto, userId)
  }

  @ApiOperation({ summary: 'Change the account password on behalf of the current user' })
  @Roles(userRoles)
  @Put('change-password')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @UserId() userId: number,
  ): Promise<void> {
    return this.service.changePassword(dto, userId)
  }
  
  @ApiOperation({ summary: 'Reset the account password on behalf of the current user' })
  @Roles(userRoles)
  @Put('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    return this.service.resetPassword(dto)
  }
}
