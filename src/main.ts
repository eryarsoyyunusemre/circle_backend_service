import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as requestIp from 'request-ip';
import * as cors from 'cors';
import * as config from 'config';

const ServerConfig = config.get('server');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Circle Servis Backend')
    .setDescription('API dökümantasyonu')
    .setVersion('3.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(cors());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(requestIp.mw());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Veri tipi degisimi yapabilmemiz icin aktif edildi.
      disableErrorMessages: false, // Hata mesajlarinda anlamli metin donmesini saglar/
      whitelist: true, // Whitelist acmazsak asagidaki iki kurali kullanamayiz.
      forbidNonWhitelisted: true, //  Alttaki kurali yazmama izin veriyor
      forbidUnknownValues: true, // POST,GET,PATCH,DELETE bilinmeyten deger gelmesini engelller.
    }),
  );

  await app.listen(ServerConfig.port).then((res) => {
    console.log('NODE_ENV: ', process.env.NODE_ENV);
    console.log('Start PORT: ', ServerConfig.port);
  });
}
bootstrap();
