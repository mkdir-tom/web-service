import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class RegisterDto {
  @ApiProperty({
    type: String,
    example: 'chara',
  })
  @IsString()
  username: string
}
