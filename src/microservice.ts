import {
  ClientProviderOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

export const getQueueName = (provider: string, prefix = '') => {
  if (process.env.NODE_ENV !== 'production') {
    return `${process.env.USER}-${provider}`
  }

  const q = `${provider}-${process.env.NODE_ENV}`
  if (prefix) {
    return `${prefix}-${q}`
  }
  return q
}

export const makeRMQClient = (
  name: string,
  provider: string,
  prefix = '',
): ClientProviderOptions => {
  return {
    name,
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: getQueueName(provider, prefix),
      queueOptions: {
        durable: false,
      },
    },
  }
}

export const makeTCPClient = (provider: string): any => {
  return {
    provide: provider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const mathSvcOptions = configService.get('microservice')
      return ClientProxyFactory.create(mathSvcOptions[provider])
    },
  }
}
