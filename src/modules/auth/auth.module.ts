import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: '24h'
      }
    }),

    TypeOrmModule.forFeature([User]),

    UsersModule,
  ],
  exports: [
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {}
