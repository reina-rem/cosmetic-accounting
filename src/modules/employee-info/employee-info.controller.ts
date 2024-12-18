import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../auth/roles-guard.decorator'
import { EmployeeInfoService } from './employee-info.service'
import { EmployeeInfoDto } from './dto/employee-info.dto'
import { UpdateEmployeeInfoDto } from './dto/update-employee-info.dto'
import { CreateEmployeeAccountDto } from './dto/create-employee-account.dto'
import { UserInfoDto } from '../auth/dto/user-info.dto'
import { UserId } from '../auth/user-id.decorator'

@ApiTags('Employee Info')
@Controller('employee-info')
export class EmployeeInfoController {
  constructor(private service: EmployeeInfoService) {}

  @ApiOperation({ summary: 'Registrate a new employee account' })
  @ApiResponse({ status: 201, type: UserInfoDto })
  @Roles(['owner'])
  @Post()
  async registrateEmployeeAccount(
    @Body() dto: CreateEmployeeAccountDto,
  ): Promise<UserInfoDto> {
    return this.service.registrateEmployeeAccount(dto)
  }

  @ApiOperation({ summary: 'Delete the existing employee account' })
  @Roles(['owner'])
  @Delete(':employee_id')
  async deleteEmployeeAccount(
    @UserId() ownerId: number,
    @Param('employee_id') employeeId: number,
  ): Promise<void> {
    return this.service.deleteEmployeeAccount(ownerId, employeeId)
  }
  
  @ApiOperation({ summary: 'Get all the employee infos' })
  @ApiResponse({ status: 200, type: [EmployeeInfoDto] })
  @Roles(['owner'])
  @Get()
  async getAll(): Promise<EmployeeInfoDto[]> {
    return this.service.getAll()
  }

  @ApiOperation({ summary: 'Get the employee info by id' })
  @ApiResponse({ status: 200, type: EmployeeInfoDto })
  @Roles(['owner'])
  @Get(':employee_id')
  async getById(
    @Param('employee_id') employeeId: number,
  ): Promise<EmployeeInfoDto> {
    return this.service.getById(employeeId)
  }

  @ApiOperation({ summary: 'Update the employee info by id' })
  @Roles(['owner'])
  @Put(':employee_id')
  async update(
    @Param('employee_id') employeeId: number,
    @Body() dto: UpdateEmployeeInfoDto,
  ): Promise<void> {
    return this.service.update(employeeId, dto)
  }
}
