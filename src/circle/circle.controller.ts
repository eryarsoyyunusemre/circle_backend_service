import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CircleService } from './circle.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard())
@Controller('circle')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @Post('/:uuid')
  async createCircleUser(@Param('uuid') uuid: string) {
    try {
      return await this.circleService.createCircleUser(uuid);
    } catch (error) {
      throw error;
    }
  }

  @Post('/initalize/:uuid')
  async initalizeUser(@Param('uuid') uuid: string) {
    try {
      return await this.circleService.initializeUser(uuid);
    } catch (error) {
      throw error;
    }
  }
}
