import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isIranMobilePhone', async: false })
export class IranMobilePhoneValidation implements ValidatorConstraintInterface {
  validate(mobile_phone: string) {
    const pattern = /^\+98\d{10}$/;
    return pattern.test(mobile_phone);
  }

  defaultMessage() {
    return 'Mobile Phone should start with +98 and have 10 numbers!';
  }
}
