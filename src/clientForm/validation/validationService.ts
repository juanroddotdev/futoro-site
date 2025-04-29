import type { FormValidator, ValidationSchema } from './types';
import { VeeValidateAdapter } from './veeValidateAdapter';

export class ValidationService {
  private validator: FormValidator;
  public validateField: FormValidator['validateField'];
  public validateStep: FormValidator['validateStep'];
  public validateForm: FormValidator['validateForm'];

  constructor(validator: FormValidator) {
    this.validator = validator;
    this.validateField = this.validator.validateField.bind(this.validator);
    this.validateStep = this.validator.validateStep.bind(this.validator);
    this.validateForm = this.validator.validateForm.bind(this.validator);
  }

  // Factory method to create with vee-validate
  static createWithVeeValidate(schema: ValidationSchema): ValidationService {
    return new ValidationService(new VeeValidateAdapter(schema));
  }

  // Factory method to create with a different validator in the future
  static createWithCustomValidator(validator: FormValidator): ValidationService {
    return new ValidationService(validator);
  }
} 