import { PartialType } from '@nestjs/mapped-types';
import { CreateMicroareaDto } from './create-microarea.dto';

export class UpdateMicroareaDto extends PartialType(CreateMicroareaDto) {}
