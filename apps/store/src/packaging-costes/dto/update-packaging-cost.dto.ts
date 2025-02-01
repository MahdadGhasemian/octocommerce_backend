import { PartialType } from '@nestjs/swagger';
import { CreatePackagingCostDto } from './create-packaging-cost.dto';

export class UpdatePackagingCostDto extends PartialType(
  CreatePackagingCostDto,
) {}
