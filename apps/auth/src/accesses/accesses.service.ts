import { Injectable } from '@nestjs/common';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { AccessesRepository } from './accesses.repository';
import { GetAccessDto } from './dto/get-access.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { ACCESS_PAGINATION_CONFIG } from './pagination-config';
import { Access, Endpoint, EndpointData, InfoEndpointData } from '@app/auth';
import { EndpointMethodType } from '@app/common';
import { InfoEndpointAccessDto } from './dto/info-endpoint-access.dto';

@Injectable()
export class AccessesService {
  constructor(private readonly accessesRepository: AccessesRepository) {}

  async create(createAccessDto: CreateAccessDto) {
    const access = new Access({
      ...createAccessDto,
      endpoints: createAccessDto.endpoints?.map(
        (endpointDto) => new Endpoint({ ...endpointDto }),
      ),
      info_endpoints: InfoEndpointData,
    });

    return this.accessesRepository.create(access);
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.accessesRepository.entityRepository,
      ACCESS_PAGINATION_CONFIG,
    );
  }

  async findOne(accessDto: Omit<GetAccessDto, 'info_endpoints'>) {
    return this.accessesRepository.findOne(
      { ...accessDto },
      {
        endpoints: true,
      },
    );
  }

  async update(
    accessDto: Omit<GetAccessDto, 'info_endpoints'>,
    updateAccessDto: UpdateAccessDto,
  ) {
    const endpoints = await this.convertInfoEndpointToEndpoint(
      updateAccessDto.info_endpoints,
    );

    const access = await this.accessesRepository.findOne(accessDto, {
      endpoints: true,
    });

    // Update main properties
    access.title = updateAccessDto.title ?? access.title;
    access.image = updateAccessDto.image ?? access.image;
    access.color = updateAccessDto.color ?? access.color;
    access.has_full_access =
      updateAccessDto.has_full_access ?? access.has_full_access;
    access.is_internal_user =
      updateAccessDto.is_internal_user ?? access.is_internal_user;
    access.notification_order_created =
      updateAccessDto.notification_order_created ??
      access.notification_order_created;
    access.notification_payment_created =
      updateAccessDto.notification_payment_created ??
      access.notification_payment_created;
    access.notification_delivery_created =
      updateAccessDto.notification_delivery_created ??
      access.notification_delivery_created;

    // update endpoints
    access.endpoints = endpoints?.map(
      (endpointDto) => new Endpoint({ ...endpointDto }),
    );

    // update info_endpoints
    if (updateAccessDto.info_endpoints) {
      access.info_endpoints = updateAccessDto.info_endpoints;
    }

    return this.accessesRepository.save(access);
  }

  async remove(accessDto: Omit<GetAccessDto, 'info_endpoints'>) {
    return this.accessesRepository.findOneAndDelete({ ...accessDto });
  }

  async readAccesses(query: any) {
    return this.accessesRepository.findBy(query);
  }

  private async convertInfoEndpointToEndpoint(
    infoEndpoints: InfoEndpointAccessDto[],
  ): Promise<Endpoint[]> {
    const endpoints: Endpoint[] = infoEndpoints
      .map((info: InfoEndpointAccessDto) => {
        const endpointKey = EndpointData.find((item) => item.key === info.key);

        const d = [];
        if (endpointKey) {
          if (info.get) {
            d.push(
              ...endpointKey.get.map((path) => ({
                tag: info.tag,
                path,
                method: EndpointMethodType.GET,
              })),
            );
          }
          if (info.post) {
            d.push(
              ...endpointKey.post.map((path) => ({
                tag: info.tag,
                path,
                method: EndpointMethodType.POST,
              })),
            );
          }
          if (info.patch) {
            d.push(
              ...endpointKey.patch.map((path) => ({
                tag: info.tag,
                path,
                method: EndpointMethodType.PATCH,
              })),
            );
          }
          if (info.delete) {
            d.push(
              ...endpointKey.delete.map((path) => ({
                tag: info.tag,
                path,
                method: EndpointMethodType.DELETE,
              })),
            );
          }
        }

        return d;
      })
      .filter((r) => r.length)
      .flat();

    return endpoints;
  }
}
