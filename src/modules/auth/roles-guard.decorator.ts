import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { UserRole, userRoles } from '../../entities/user.entity'

export const ROLES_KEY = 'roles'

export function Roles(roles: readonly UserRole[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiOperation({
      description: `**Requires roles:** ` + (
        userRoles.every(role => roles.includes(role))
          ? `[authenticated]`
          : roles.join(', ')
      ),
    })
  )
}
