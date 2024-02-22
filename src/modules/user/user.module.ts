import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'

import { UserService } from './user.service'
import { UserController } from './user.controller'

import configuration from '../../config/configuration'
import { makeRMQClient, makeTCPClient } from '../../microservice'
import {
  QUEUE_USER_SERVICE,
  RMQ_USER_SERVICE,
  TCP_USER_SERVICE,
} from '../../constants'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ClientsModule.register([
      makeRMQClient(RMQ_USER_SERVICE, QUEUE_USER_SERVICE),
    ]),
  ],
  providers: [UserService, makeTCPClient(TCP_USER_SERVICE)],
  controllers: [UserController],
})
export class UserModule {}
