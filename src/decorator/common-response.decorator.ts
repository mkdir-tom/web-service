import { ApiProperty, ApiTags, ApiResponse } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export class ResponseBadRequest {
  @ApiProperty({
    type: Number,
    example: 400,
  })
  statusCode: number

  @ApiProperty({
    type: String,
    example: 'Bad Request',
  })
  message: string

  @ApiProperty({
    type: Object,
    example: {},
  })
  data: Record<string, any>
}

export class ResponseInternalError {
  @ApiProperty({
    type: Number,
    example: 500,
  })
  statusCode: number

  @ApiProperty({
    type: String,
    example: 'Internal Error',
  })
  message: string

  @ApiProperty({
    type: Object,
    example: {},
  })
  data: Record<string, any>
}

export const CommonResponse = (
  name: string,
  options: { successType: any },
): any => {
  return applyDecorators(
    ApiTags(name),
    ApiResponse({
      status: 200,
      description: 'Success',
      type: options.successType,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      type: ResponseBadRequest,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Error',
      type: ResponseInternalError,
    }),
  )
}
