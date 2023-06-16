import { Module } from '@nestjs/common';
import { UserdetailsService } from './userdetails.service';
import { UserdetailsController } from './userdetails.controller';
import { Userdetail } from './entities/userdetail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nodemailerService } from 'src/nodemailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Userdetail]),
  ],
  controllers: [UserdetailsController],
  providers: [UserdetailsService,nodemailerService]
})
export class UserdetailsModule {}
