import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CWLogger } from './cwlogger.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CWLogger],
  exports: [CWLogger],
})
export class LoggerModule {}
