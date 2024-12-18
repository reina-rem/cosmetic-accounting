import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DeleteCustomerAccountDto {
  @ApiProperty({ example: 'asdf1234' })
  @IsString()
  password!: string
}
