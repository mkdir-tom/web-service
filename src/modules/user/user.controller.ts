import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common'
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'

import { tryit } from 'radash'

import RegisterDto from './dto/register.dto'
import { UserService } from './user.service'
import ExistEntity from './entities/exist.entity'
import ValidateUsernamePipe from './pipe/validate-username.pipe'

import { CWLogger } from '../logger/cwlogger.service'

import { CommonResponse } from '../../decorator/common-response.decorator'

@Controller('user')
export class UserController {
  private readonly logger = new CWLogger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiBasicAuth()
  @Get('me')
  async me(): Promise<any> {
    return
  }

  @CommonResponse('Users', { successType: RegisterDto })
  @ApiOperation({ summary: 'สร้างผู้ใช้งาน / register user' })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<any> {
    const [err, response] = await tryit(this.userService.createUser)(body)
    if (err) {
      const errMsg = err.message ?? JSON.stringify(err)
      this.logger.error(`catch on error create user: ${errMsg}`)
      throw new InternalServerErrorException({
        message: errMsg,
      })
    }
    return response
  }

  @ApiParam({
    name: 'username',
    type: String,
    example: 'unique',
  })
  @ApiOperation({
    summary: 'เช็คชื่อผู้ใช้งาน / Check the username already exists',
  })
  @CommonResponse('Users', { successType: ExistEntity })
  @Get(':username/exist')
  async usernameExist(
    @Param('username', ValidateUsernamePipe) isExist: boolean,
  ): Promise<ExistEntity> {
    return { isExist }
  }
}
