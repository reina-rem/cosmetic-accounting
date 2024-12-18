import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number => {
    const user = context.switchToHttp().getRequest().user
    if (!user) {
      throw new UnauthorizedException('Token is malformed or expired')
    }

    return user.id
  }
)
