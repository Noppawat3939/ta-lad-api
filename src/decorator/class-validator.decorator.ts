import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

@ValidatorConstraint({ async: false })
class IsNotEmptyStringConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (typeof value !== 'string') return false

    return value.trim().length > 0
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args.property} should have at least 1 character`
  }
}

export const IsNotEmptyString = (options: ValidationOptions) => {
  return (obj: Object, name: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName: name,
      options,
      constraints: [],
      validator: IsNotEmptyStringConstraint,
    })
  }
}
