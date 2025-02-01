import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOne', async: false })
class AtLeastOneConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const { parent_id, parent_name, parent_external_category_sellers_name } =
      args.object as any;
    return (
      !!parent_id || !!parent_name || !!parent_external_category_sellers_name
    );
  }

  defaultMessage() {
    return 'At least one of the fields: parent_id, parent_name, or parent_external_category_sellers_name must be provided';
  }
}

export function AtLeastOne(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneConstraint,
    });
  };
}
