import { PartialType } from '@nestjs/mapped-types';
import { CreateEseaDto } from './create-esea.dto';

export class UpdateEseaDto extends PartialType(CreateEseaDto) {}
