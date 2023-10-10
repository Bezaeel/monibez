import { IsDateString, IsEmail, IsString } from 'class-validator';
import { User } from '../user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsDateString()
  dob: Date;

  ToEntity() {
    const it = new User();
    it.first_name = this.first_name;
    it.last_name = this.last_name;
    it.dob = this.dob;
    it.email = this.email;
    it.username = this.username;
    return it;
  }
}
