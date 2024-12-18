import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common'
import { Response } from 'express'
import { CustomerInfoService } from './customer-info.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles-guard.decorator'
import { CustomerInfoDto } from './dto/customer-info.dto'
import { UserId } from '../auth/user-id.decorator'
import { UpdateCustomerInfoDto } from './dto/update-customer-info.dto'
import { UpdateCustomerNoteDto } from './dto/update-customer-note.dto'
import { UserInfoDto } from '../auth/dto/user-info.dto'
import { RegistrateCustomerAccountDto } from './dto/registrate-customer-account.dto'
import { AuthService } from '../auth/auth.service'
import { DeleteCustomerAccountDto } from './dto/delete-customer-account.dto'
import { FullCustomerInfoDto } from './dto/full-customer-info.dto'

@ApiTags('Customer Info')
@Controller('customer-info')
export class CustomerInfoController {
  constructor(
    private service: CustomerInfoService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Registrate a new customer account' })
  @ApiResponse({ status: 201, type: UserInfoDto })
  @Post('signup')
  async registrateCustomerAccount(
    @Body() dto: RegistrateCustomerAccountDto,
    @Res() res: Response,
  ): Promise<Response<UserInfoDto>> {
    const userInfo = await this.service.registrateCustomerAccount(dto)
    return this.authService.setTokenInCookie(res, userInfo)
  }

  @ApiOperation({ summary: 'Delete the customer account on behalf of the current user' })
  @Roles(['customer'])
  @Delete()
  async deleteCustomerAccount(
    @UserId() customerId: number,
    @Body() dto: DeleteCustomerAccountDto,
    @Res() res: Response,
  ): Promise<Response<string> | void> {
    this.authService.deleteTokenFromCookie(res)
    await this.service.deleteCustomerAccount(customerId, dto)

    return res.send('Customer account successfully deleted.')
  }

  @ApiOperation({ summary: 'Get all the customer infos' })
  @ApiResponse({ status: 200, type: [FullCustomerInfoDto] })
  @Roles(['owner', 'consultant'])
  @Get('all')
  async getAll(): Promise<FullCustomerInfoDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Get the account info on behalf of the current customer' })
  @ApiResponse({ status: 200, type: CustomerInfoDto })
  @Roles(['customer'])
  @Get('account-info')
  async getAccountInfo(
    @UserId() customerId: number,
  ): Promise<CustomerInfoDto> {
    return this.service.getAccountInfo(customerId)
  }

  @ApiOperation({ summary: 'Get the full customer info by customer id' })
  @ApiResponse({ status: 200, type: FullCustomerInfoDto })
  @Roles(['owner', 'consultant'])
  @Get(':customer_id')
  async getByCustomerId(
    @Param('customer_id') id: number,
  ): Promise<FullCustomerInfoDto> {
    return this.service.getByCustomerId(id)
  }

  @ApiOperation({ summary: 'Update the customer info on behalf of the current customer' })
  @Roles(['customer'])
  @Put('info')
  async update(
    @UserId() customerId: number,
    @Body() dto: UpdateCustomerInfoDto,
  ): Promise<void> {
    return this.service.update(customerId, dto)
  }

  @ApiOperation({ summary: 'Update the note about the customer by customer id' })
  @Roles(['consultant'])
  @Put('note/:customer_id')
  async updateNote(
    @Param('customer_id') customerId: number,
    @Body() dto: UpdateCustomerNoteDto,
  ): Promise<void> {
    return this.service.updateNote(customerId, dto)
  }
}
