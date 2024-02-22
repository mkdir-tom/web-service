import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, Logger } from '@nestjs/common'

import compression from 'compression'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { AppModule } from './modules/app/app.module'
import { setupSwagger } from './swagger'

dayjs.extend(utc)
dayjs.extend(timezone)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const port = config.get('port')
  const swaggerEnable = config.get('swaggerEnable')
  const logger = new Logger()
  app.use(compression())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  if (swaggerEnable === '1') {
    setupSwagger(app)
  }

  await app.listen(port, () => {
    logger.log(`
      Application Web Service started port: ${port}
      Local Timezone guess: ${dayjs.tz.guess()}
      Local Date:    ${dayjs().toDate().toISOString()} ~ ${dayjs().format(
        'YYYY-MM-DD HH:mm:ss',
      )}
    `)
  })
}

bootstrap()
