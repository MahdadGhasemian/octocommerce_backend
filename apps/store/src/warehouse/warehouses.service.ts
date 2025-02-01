import { Injectable } from '@nestjs/common';
import { WarehousesRepository } from './warehouses.repository';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { GetWarehouseDto } from './dto/get-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { WAREHOUSE_PAGINATION_CONFIG } from './pagination-config';
import { Warehouse } from '@app/store';

@Injectable()
export class WarehousesService {
  constructor(private readonly warehousesRepository: WarehousesRepository) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const warehouse = new Warehouse({
      ...createWarehouseDto,
    });

    const result = await this.warehousesRepository.create(warehouse);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.warehousesRepository.entityRepository,
      WAREHOUSE_PAGINATION_CONFIG,
    );
  }

  async findOne(warehouseDto: GetWarehouseDto) {
    return this.warehousesRepository.findOne(warehouseDto);
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const updateData: Partial<Warehouse> = {
      ...updateWarehouseDto,
    };

    const result = await this.warehousesRepository.findOneAndUpdate(
      { id },
      { ...updateData },
    );

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.warehousesRepository.findOneAndDelete({ id });
  }
}
