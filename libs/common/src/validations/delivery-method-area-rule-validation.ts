import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class UniqueAreaNameConstraint implements ValidatorConstraintInterface {
  validate(value: any[], args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return true; // Not an array, skip validation.
    }
    const areaNames = value.map((rule) => rule.area_name);
    const uniqueAreaNames = new Set(areaNames);
    return areaNames.length === uniqueAreaNames.size; // Check if all area_names are unique.
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each area_name must be unique.';
  }
}

export function UniqueAreaName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueAreaNameConstraint,
    });
  };
}
