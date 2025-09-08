import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whitelist = [
    'https://bail-app-66c5a.web.app',
    'https://bail-app-66c5a.firebaseapp.com',
    'http://localhost:4200',
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Autorise les clients non navigateurs (Postman, curl) qui n’envoient pas d’origin
      if (!origin) return callback(null, true);
      if (whitelist.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin non autorisée: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  });

  await app.listen(8080);
}
bootstrap();
