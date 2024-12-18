import type { UserRole } from '../../entities/user.entity'

export type { ChangeEmailDto } from './dto/change-email.dto'
export type { ChangePasswordDto } from './dto/change-password.dto'
export type { LoginDto } from './dto/login.dto'
export type { ResetPasswordDto } from './dto/reset-password.dto'
export type { UserInfoDto } from './dto/user-info.dto'

export type UserSession = {
  id: number
  roles: UserRole[]
}
