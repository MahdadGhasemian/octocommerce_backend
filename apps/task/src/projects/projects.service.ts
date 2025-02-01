import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { PROJECT_PAGINATION_CONFIG } from './pagination-config';
import { Project, User } from '@app/task';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const user_ids = [...new Set(createProjectDto?.user_ids?.concat(user.id))];

    const project = new Project({
      ...createProjectDto,
      owned_by: new User({ id: user.id }),
      users: user_ids?.map((user_id) => new User({ id: user_id })),
    });

    const result = await this.projectsRepository.create(project);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.projectsRepository.entityRepository,
      PROJECT_PAGINATION_CONFIG,
    );
  }

  async findOne(projectDto: Omit<GetProjectDto, 'users' | 'owned_by'>) {
    return this.projectsRepository.findOne(projectDto, {
      users: true,
      owned_by: true,
    });
  }

  async read(projectDto: GetProjectDto) {
    return this.projectsRepository.findOne(projectDto);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsRepository.findOne(
      { id },
      {
        users: true,
      },
    );

    // Update main properties
    project.title = updateProjectDto.title ?? project.title;
    project.description = updateProjectDto.description ?? project.description;

    // Update users
    if (updateProjectDto.user_ids) {
      project.users = [
        ...project.users,
        ...updateProjectDto.user_ids?.map((id) => new User({ id: id })),
      ];
    }

    // Save the updated Board entity
    const result = await this.projectsRepository.save(project);

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.projectsRepository.findOneAndDelete({ id });
  }
}
