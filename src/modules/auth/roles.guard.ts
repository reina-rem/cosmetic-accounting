import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from './roles-guard.decorator'
import { SessionRequest } from './session.middleware'
import { UserRole } from '../users/users.types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const user = context.switchToHttp().getRequest<SessionRequest>().user

    if (!user) {
      throw new UnauthorizedException('Token is malformed or expired')
    }

    return requiredRoles.some(role => user.roles.includes(role))
  }
}