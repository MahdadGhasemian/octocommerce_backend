import { GetUserDto } from '@app/common';
import { User } from '@app/notification';

export class CreateMessageDto {
  user_id?: number;
  user?: GetUserDto;
}

export class CreateBoardMessageDto {
  created_by_user_id: number;
  created_by: User;
  assigned_to: User;
  flow_users: User[];
}

export class UpdateBoardMessageDto extends CreateBoardMessageDto {}
