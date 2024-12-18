import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log(
      new Date().toISOString(), 
      req.method, 
      req.originalUrl,
      // req.headers,
      // req.query,
      // req.body,
    )

    next()
  }

  // Feature: Save logs into quick database
}
