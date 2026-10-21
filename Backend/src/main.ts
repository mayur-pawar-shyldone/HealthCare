import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

function resolveFrontendDist() {
  const candidates = [
    join(__dirname, '..', 'public'),
    join(__dirname, '..', '..', 'Frontend', 'dist'),
    join(process.cwd(), 'Frontend', 'dist'),
    join(process.cwd(), 'public'),
  ];
  return candidates.find((dir) => existsSync(join(dir, 'index.html')));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.getHttpAdapter().getInstance().set('etag', false);
  app.setGlobalPrefix('api');
  const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({
    origin: corsOrigins?.length ? corsOrigins : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('HealthCart API')
    .setDescription('Healthcare, laboratory & membership platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const frontendDist = resolveFrontendDist();
  if (frontendDist) {
    app.useStaticAssets(frontendDist);
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();
      if (req.path.includes('.')) return next();
      res.sendFile(join(frontendDist, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`HealthCart API running on http://localhost:${port}/api`);
}

bootstrap();
