import { InternalServerErrorException, PipeTransform } from '@nestjs/common'

import { isEmpty, tryit } from 'radash'

import { UserService } from '../user.service'

import { CWLogger } from '../../logger/cwlogger.service'

export default class ValidateUsernamePipe implements PipeTransform {
  private readonly logger = new CWLogger(ValidateUsernamePipe.name)

  constructor(private readonly userService: UserService) {}

  async transform(username: string): Promise<boolean> {
    const [err, user] = await tryit(this.userService.getUser)(username)
    if (err) {
      const errMsg = err.message ?? JSON.stringify(err)
      this.logger.error(`catch on error create user: ${errMsg}`)
      throw new InternalServerErrorException({
        message: errMsg,
      })
    }
    return isEmpty(user)
  }
}
