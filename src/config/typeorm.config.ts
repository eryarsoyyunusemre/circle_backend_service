import * as config from 'config';
const dbConfig = config.get('db');

import { TypeOrmModule } from '@nestjs/typeorm';


export const databaseProviders = [
  TypeOrmModule.forRoot({
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    charset: dbConfig.charset,
    schema: dbConfig.schema,
    entities: [
      __dirname + '/../*.entity{.ts,.js}',
      __dirname + '/../**/*.entity{.ts,.js}',
      __dirname + '/../**/**/*.entity{.ts,.js}',
    ],
    subscribers: [
      // subscriber alacagi klasor
      __dirname + '/../**/**/**/*.subscriber.{js, ts}',
      __dirname + '/../**/**/*.subscriber.{js, ts}',
    ],
    synchronize: dbConfig.synchronize,
  }),
];
