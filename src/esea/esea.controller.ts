import { Controller } from '@nestjs/common';
import { EseaService } from './esea.service';

@Controller('esea')
export class EseaController {
  constructor(private readonly eseaService: EseaService) {}
}
