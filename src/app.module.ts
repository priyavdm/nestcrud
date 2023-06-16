import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserdetailsModule } from './userdetails/userdetails.module';
import { ConfigModule } from "@nestjs/config";
import { type } from 'os';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nodemailerService } from 'src/nodemailer.service';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
      }
      ),
      TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      }),

    UserdetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService,nodemailerService],
})
export class AppModule {}
