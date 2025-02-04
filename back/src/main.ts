import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Efrei Movie API')
  .setDescription('API pour la gestion des films')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`\nServer run on : http://localhost:${port}\n`);
  console.log(`Swagger documentation on : http://localhost:${port}/api\n`);
}
bootstrap();
