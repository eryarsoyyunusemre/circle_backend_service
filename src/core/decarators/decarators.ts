import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Level = (...levels: string[]) => {
  return SetMetadata('levels', levels);
};

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
