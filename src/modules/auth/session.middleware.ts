import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UserSession } from './auth.types'
import { JwtService } from '@nestjs/jwt'

export type SessionRequest = Request & { user: UserSession }
export const TOKEN_COOKIE_KEY = 'token'

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: SessionRequest, _res: Response, next: NextFunction) {
    try {
      const token = this.extractToken(req)
      if (token) {
        req.user = this.jwtService.verify<UserSession>(token)
      }
    } finally {
      return next()
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization
 
    if (!authHeader) {
      return req.cookies[TOKEN_COOKIE_KEY]
    }

    const splittedAuthHeader = authHeader.split(' ')
    const bearer = splittedAuthHeader[0]
    const token = splittedAuthHeader[1]

    if (bearer !== 'Bearer' || !token) {
      return null
    }

    return token
  }
}