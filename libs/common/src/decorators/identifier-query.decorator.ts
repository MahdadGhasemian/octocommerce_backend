import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../entities';
import { IdentifierQuery } from '../interfaces';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const Identifier = createParamDecorator(
  (_data: unknown, context: ExecutionContext): IdentifierQuery => {
    const user = getCurrentUserByContext(context);

    const is_internal_user = !!user?.accesses?.find(
      (item: { is_internal_user?: boolean }) => item.is_internal_user,
    );

    return is_internal_user ? {} : { user_id: user.id };
  },
);
