import { Injectable, ConsoleLogger } from '@nestjs/common'
import dayjs from 'dayjs'
import chalk from 'chalk'
import * as winston from 'winston'
import WinstonCloudwatch from 'winston-cloudwatch'
import { SERVICE_NAME } from '../../constants'

const formatter = (info) => {
  return `${dayjs(info.timestamp).format('YYYY/MM/DD - hh:mm:ss.SSS A')} [${
    info.level
  }] [${chalk.green(info.context)}] ${info.message}`
}

const cloudWatchFormatter = (info) => {
  return `${dayjs(info.timestamp).format('YYYY/MM/DD - hh:mm:ss.SSS A')} [${
    info.level
  }] [${info.context}] ${info.message}`
}

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.printf((info) => formatter(info)),
)

@Injectable()
export class CWLogger extends ConsoleLogger {
  private ctx: string
  public winstonLogger: winston.Logger

  constructor(ctx = 'Logger') {
    super(ctx)
    this.setContext(ctx)
    this.winstonLogger = winston.createLogger({
      level: 'silly',
      format: customFormat,
      transports: [
        new winston.transports.Console({
          silent: process.env.NODE_ENV === 'production',
        }),
      ],
    })

    if (process.env.NODE_ENV === 'production') {
      this.winstonLogger.add(
        new WinstonCloudwatch({
          logGroupName: `${process.env.DOMAIN_NAME}/${SERVICE_NAME}`,
          logStreamName: this.ctx,
          messageFormatter: cloudWatchFormatter,
          awsOptions: {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            region: process.env.AWS_REGION ?? 'ap-southeast-1',
          },
          retentionInDays: 90,
        }),
      )
    }
  }

  public setContext(context: string): this {
    this.ctx = context
    return this
  }

  public silly(message: string): void {
    this.winstonLog(message, 'silly')
  }

  public debug(message: string): void {
    this.winstonLog(message, 'debug')
  }

  public log(message: string): void {
    this.winstonLog(message, 'info')
  }

  public warn(message: string): void {
    this.winstonLog(message, 'warn')
  }

  public error(message: string): void {
    this.winstonLog(message, 'error')
  }

  private winstonLog(
    message: string,
    level: 'silly' | 'info' | 'debug' | 'warn' | 'error',
  ) {
    const entry = {
      level,
      message,
      context: this.ctx,
    }
    this.winstonLogger.log(entry)
  }
}
