import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const levels = this.reflector.get<any[]>('levels', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const level = request.user.role;

    const regex = new RegExp(level);
    if (!regex.test(levels.join()))
      throw new ForbiddenException(`Forbidden This Page!`);
    return true;
  }
}
