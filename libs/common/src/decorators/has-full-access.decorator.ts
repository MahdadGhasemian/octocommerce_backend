import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../entities';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const HasFullAccess = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const user = getCurrentUserByContext(context);

    return !!user?.accesses?.find(
      (item: { has_full_access?: boolean }) => item.has_full_access,
    );
  },
);
