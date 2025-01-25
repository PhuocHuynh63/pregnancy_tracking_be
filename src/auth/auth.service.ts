import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { comparePasswordHelper } from 'src/utils/util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await comparePasswordHelper(password, user.password);
    if (!isMatch) {
      return undefined;
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, fullname: user.fullname, role: user.role, image: user.image, };
    return {
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        image: user.image,
      },
      access_token: this.jwtService.sign(payload),
    }
  }


  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.userService.handleRegister(registerDto);
  }

}