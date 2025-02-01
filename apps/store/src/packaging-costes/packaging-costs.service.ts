import { Injectable } from '@nestjs/common';
import { CreatePackagingCostDto } from './dto/create-packaging-cost.dto';
import { GetPackagingCostDto } from './dto/get-packaging-cost.dto';
import { UpdatePackagingCostDto } from './dto/update-packaging-cost.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { PackagingCost } from '@app/store';
import { PackagingCostsRepository } from './packaging-costs.repository';
import { PACKAGING_COST_PAGINATION_CONFIG } from './pagination-config';

@Injectable()
export class PackagingCostsService {
  constructor(
    private readonly packagingCostsRepository: PackagingCostsRepository,
  ) {}

  async create(createPackagingCostDto: CreatePackagingCostDto) {
    const packagingcost = new PackagingCost({
      ...createPackagingCostDto,
    });

    const result = await this.packagingCostsRepository.create(packagingcost);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.packagingCostsRepository.entityRepository,
      PACKAGING_COST_PAGINATION_CONFIG,
    );
  }

  async findOne(packagingcostDto: GetPackagingCostDto) {
    return this.packagingCostsRepository.findOne({
      ...packagingcostDto,
    });
  }

  async findOneNoCheck(packagingcostDto: GetPackagingCostDto) {
    return this.packagingCostsRepository.findOneNoCheck({
      ...packagingcostDto,
    });
  }

  async update(id: number, updatePackagingCostDto: UpdatePackagingCostDto) {
    const updateData: Partial<PackagingCost> = {
      ...updatePackagingCostDto,
    };

    const result = await this.packagingCostsRepository.findOneAndUpdate(
      { id },
      { ...updateData },
    );

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.packagingCostsRepository.findOneAndDelete({ id });
  }
}
