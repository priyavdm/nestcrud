import { Injectable } from '@nestjs/common';
import { CreateUserdetailDto } from './dto/create-userdetail.dto';
import { UpdateUserdetailDto } from './dto/update-userdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Userdetail } from './entities/userdetail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserdetailsService {
  constructor(@InjectRepository(Userdetail) private userdetailsRepository: Repository<Userdetail>) {}
  async create(createUserdetailDto: any) {
    // return 'This action adds a new userdetail';
    console.log(createUserdetailDto);
    await this.userdetailsRepository.save(createUserdetailDto);
    
  }

  findAll() {
    return `This action returns all userdetails`;
  }

  findOne(email: string) {
    // return `This action returns a #${id} userdetail`;
    return this.userdetailsRepository.findOne({where:{email:email},select:['id','email','name','password','gender','phone','otp']});
  }

  update(email:any,otp:any) {
    // return `This action updates a #${id} userdetail`;
    return this.userdetailsRepository.update({email},{otp});

  }

 async resetPassword(id:any,password:any) {
    // return `This action updates a #${id} userdetail`;
    return this.userdetailsRepository.update(id,password);
  }

  remove(id: number) {
    return `This action removes a #${id} userdetail`;
  }
}
