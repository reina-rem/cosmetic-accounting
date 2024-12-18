import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import path from 'node:path'
import express from 'express'

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  const publicPath = path.join(process.cwd(), 'public')

  app.use('/static', express.static(publicPath, {
    index: false,
  }))

  app.use((req, res, next) => {
    const url = req.originalUrl

    if (url.startsWith('/api') || url.startsWith('/docs')) {
      return next()
    }

    if (url.startsWith('/static')) {
      return next()
    }

    res.sendFile(path.join(publicPath, 'index.html'))
  })

  const documentConfig = new DocumentBuilder()
    .setTitle('Cosmetic Accounting')
    .setDescription('Junior backend typescript project')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, documentConfig)
  SwaggerModule.setup('/docs', app, document)

  app.enableCors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )

  app.use(cookieParser())

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}
bootstrap()
