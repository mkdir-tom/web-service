import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

import { RMQ_USER_SERVICE, TCP_USER_SERVICE } from '../../constants'
import { CREATE_USER, GET_USER } from '../../microservice-constants'

@Injectable()
export class UserService {
  @Inject(TCP_USER_SERVICE) private readonly tcpUserService: ClientProxy
  @Inject(RMQ_USER_SERVICE) private readonly rmqUserService: ClientProxy

  createUser = async (user: Record<string, any>): Promise<any> => {
    return lastValueFrom(this.rmqUserService.send(CREATE_USER, user))
  }

  getUser = async (username: string): Promise<any> => {
    return lastValueFrom(this.tcpUserService.send(GET_USER, username))
  }
}
