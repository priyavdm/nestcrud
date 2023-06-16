import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Put } from '@nestjs/common';
import { UserdetailsService } from './userdetails.service';
import { CreateUserdetailDto } from './dto/create-userdetail.dto';
import { UpdateUserdetailDto } from './dto/update-userdetail.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { nodemailerService } from 'src/nodemailer.service';


@Controller('userdetails')
export class UserdetailsController {
  constructor(private readonly userdetailsService: UserdetailsService,public nodemail:nodemailerService) {}

  @Post('/insert')
  async create(@Req() req:Request, @Res() res:Response, @Body() createUserdetailDto: any) {
    
    try{
      let name=createUserdetailDto.name
      let email=createUserdetailDto.email
      let password=createUserdetailDto.password
      let phone=createUserdetailDto.phone
      let gender=createUserdetailDto.gender

      let getuser=await this.userdetailsService.findOne(email)
      console.log(getuser);

      if(getuser){
        res.json({
          message:'user already exists'
        })
      }
      else{
        const hashpassword=await bcrypt.hash(password,10);
        createUserdetailDto.password=hashpassword;

        let verifyOtp=this.nodemail.generateVerificationCode();
        await this.nodemail.sendMail(email,verifyOtp);
        createUserdetailDto.otp=verifyOtp;

        await this.userdetailsService.create(createUserdetailDto);
        res.status(HttpStatus.OK).json({
          message:"User details inserted successfully"
        })
     }
  }
     // // await this.userdetailsService.create(createUserdetailDto);
    // //  res.status(HttpStatus.OK).json({
    // //       message:"User details inserted successfully"
    // //   })
    // }
   catch(error){
      console.log(error);
      
      res.json({
          message:"Something went wrong"
      })
    }
  }

  @Post('/verifyotp')
  async verifyotp(@Req() req:Request, @Res() res:Response, @Body() createUserdetailDto: any) {
      try{
        const email=createUserdetailDto.email;
        console.log(email);

        const otp=parseInt(createUserdetailDto.otp);
        console.log(otp);

        const data:any=await this.userdetailsService.findOne(email);
        console.log(data.otp);
        if(!data){
          res.json({
            message:"User not found"
          })
        }
        else{
          if(otp==data.otp){
            await this.userdetailsService.update(data.id,{isVerified:true});
            res.json({
              message:"OTP verified successfully"
            })
          }
          else{
            res.json({
              message:"Invalid OTP"
            })
          }
        }    
      }
      catch(error){
        console.log(error);
        res.json({
          message:"Something went wrong"
        })
      }
  }
  @Post('/login')
  async login(@Req() req:Request, @Res() res:Response, @Body() createUserdetailDto: any) {
    try{
      console.log('LLLLLLLLLLLLLLLLLL',createUserdetailDto);
      
      const email=createUserdetailDto.email;
      const password=createUserdetailDto.password;
      const data:any=await this.userdetailsService.findOne(email);
      console.log(data.email,'email...........................');
      
      if(data){
        if(await bcrypt.compare(password,data.password)){
          if(data.isVerified==true){
            res.json({
              message:"Login successfully"
            })
          }
          else{
            let email=data.email;
            console.log(email,'email');
            
            let verifyOtp=this.nodemail.generateVerificationCode();
            // console.log(verifyOtp+"gfhfryughjbkjg");
            
            await this.userdetailsService.update(email,verifyOtp);
              await this.nodemail.sendMail(email,verifyOtp);
            res.json({
              message:"Please verify your email"
            })
          }
      }
      else{
        res.json({
          message:"Invalid password"
        })
      }
    }
    else{
      res.json({
        message:"User not found"
      })
    }
      
  }
  catch(error){
    console.log(error);
    res.json({
      message:"Something went wrong"
    })
  }
}

@Post('forgetpassword')
async forgetpassword(@Req() req:Request, @Res() res:Response, @Body() createUserdetailDto: any) {
  let data=await this.userdetailsService.findOne(createUserdetailDto.email);
  try{
   if(data){
      let code=this.nodemail.generateVerificationCode();
      await this.userdetailsService.update(data.email,code);
      await this.nodemail.sendMail(createUserdetailDto.email,code);
    
      res.json({
        message:"OTP sent your email"
      })
      return;
   }
   else{
      res.json({
        message:"User not exists"
      })
   }

    
  }
  catch(error){
    console.log(error);
    res.json({
      message:"Something went wrong"
    })
}
}
@Put('verifyforgototp')
async verifyforgetotp(@Req() req:Request, @Res() res:Response, @Body() createUserdetailDto: any) {
    
  try{
    let data=await this.userdetailsService.findOne(createUserdetailDto.email);
    console.log(data.email);
    
    if(data){
      if(data.otp==createUserdetailDto.otp){
        res.json({
          message:"OTP verified successfully"
        })
      }
      else{
        res.json({
          message:"Invalid OTP"
        })
      }
    }
  }
  catch(error){
    console.log(error);
    res.json({
      message:"Something went wrong"
    })
  }
}

@Post('resetpassword')
async resetpassword(@Req() req:Request, @Res() res:Response, @Body() createUserdetailDto: any) {
  let data=await this.userdetailsService.findOne(createUserdetailDto.email);
  try{
    if(data){
      let hashpassword=await bcrypt.hash(createUserdetailDto.password,10);
      createUserdetailDto.password=hashpassword;
      await this.userdetailsService.resetPassword({id:data.id},{password:hashpassword});
      res.json({
        message:"Password reset successfully"
      })
      return;
      }
      else{
        res.json({
          message:"User not found"
        })
      }
  }
  catch(error){
    console.log(error);
    res.json({
      message:"Something went wrong"
    })
  }
}



  @Get()
  findAll() {
    return this.userdetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userdetailsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserdetailDto: UpdateUserdetailDto) {
    return this.userdetailsService.update(id, updateUserdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userdetailsService.remove(+id);
  }
}
  

    function elseif(arg0: boolean) {
      throw new Error('Function not implemented.');
    }

