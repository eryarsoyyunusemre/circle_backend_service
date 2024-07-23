import { Controller } from '@nestjs/common';
import { CircleService } from './circle.service';

@Controller('circle')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}
}
