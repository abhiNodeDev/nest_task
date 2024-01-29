import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/domain/user.service';
import { constantVar } from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constantVar.jwtSecret,
    });
  }

  async validate(payload) {
    const user = await this.userService.getUserbyEmail(payload.email);
    if (!user || !payload) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
