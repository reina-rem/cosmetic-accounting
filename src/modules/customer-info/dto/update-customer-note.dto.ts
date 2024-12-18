import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateCustomerNoteDto {
  @ApiProperty({ example: 'Male, 30 y.o.' })
  @IsString()
  note!: string
}
