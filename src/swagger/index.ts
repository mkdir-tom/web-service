import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export const setupSwagger = (app: INestApplication): void => {
  const configOpenApi = new DocumentBuilder()
    .setTitle('web api anime example')
    .setDescription('The Anime API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('')
    .addServer('/api')
    .build()

  const document = SwaggerModule.createDocument(app, configOpenApi)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}
