import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CircleService } from './circle.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../core/guards/roles_guard';
import { Level } from '../core/decarators/decarators';
import { RoleEnum } from '../users/enum/enum';
import { TokenTypeEnum } from './enum/enum';
import { TransferTokenDto } from './dto/circle.dto';
@UseGuards(AuthGuard())
@Controller('circle')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @UseGuards(RolesGuard)
  @Level(RoleEnum.ADMIN)
  @Get()
  async getWallets() {
    return await this.circleService.getWallets();
  }

  @Get('/:uuid')
  async getWallet(@Param('uuid') uuid: string) {
    return await this.circleService.getWallet(uuid);
  }

  @Get('balance/:type/:uuid')
  async getWalletBalance(
    @Param('type') type: TokenTypeEnum,
    @Param('uuid') uuid: string,
  ) {
    return await this.circleService.getBalance(uuid, type);
  }

  @Post('createWallet/:uuid')
  async createWallet(@Param('uuid') uuid: string) {
    return await this.circleService.createWallet(uuid).then(() => ({
      message: 'Cüzdan başarıyla oluşturulmuştur!',
    }));
  }

  @Post('transferToken')
  async transferToken(@Body() transferToken: TransferTokenDto) {
    return await this.circleService.transferToken(transferToken);
  }
}
