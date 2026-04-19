import { PartialType } from '@nestjs/mapped-types';
import { CreateRemedyDto } from './create-remedy.dto';

export class UpdateRemedyDto extends PartialType(CreateRemedyDto) {}
