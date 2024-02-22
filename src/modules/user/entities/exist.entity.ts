import { ApiProperty } from '@nestjs/swagger'

export default class ExistEntity {
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isExist: boolean
}
