import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../entities';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const IsInternalUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): boolean => {
    const user = getCurrentUserByContext(context);

    const is_internal_user = !!user?.accesses?.find(
      (item: { is_internal_user?: boolean }) => item.is_internal_user,
    );

    return is_internal_user;
  },
);
