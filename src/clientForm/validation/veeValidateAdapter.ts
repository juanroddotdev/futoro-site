import { useForm } from 'vee-validate';
import type { FormData } from '../types/FormTypes';
import type { FormValidator, ValidationResult, ValidationSchema } from './types';

export class VeeValidateAdapter implements FormValidator {
  private schema: ValidationSchema;
  private form: ReturnType<typeof useForm>;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
    this.form = useForm({
      validationSchema: this.convertToVeeValidateSchema(schema)
    });
  }

  private convertToVeeValidateSchema(schema: ValidationSchema) {
    // Convert our generic schema to vee-validate format
    // This is where we'd implement the conversion logic
    return schema;
  }

  async validateField(field: keyof FormData, value: any): Promise<ValidationResult> {
    const result = await this.form.validateField(field);
    return {
      valid: !result.errors.length,
      errors: { [field]: result.errors[0] || '' }
    };
  }

  async validateStep(step: string, values: Partial<FormData>): Promise<ValidationResult> {
    const stepFields = this.getStepFields(step);
    const results = await Promise.all(
      stepFields.map(field => this.validateField(field, values[field]))
    );

    return results.reduce(
      (acc, result) => ({
        valid: acc.valid && result.valid,
        errors: { ...acc.errors, ...result.errors }
      }),
      { valid: true, errors: {} }
    );
  }

  async validateForm(values: Partial<FormData>): Promise<ValidationResult> {
    const result = await this.form.validate();
    return {
      valid: result.valid,
      errors: Object.fromEntries(
        Object.entries(result.errors || {}).map(([key, value]) => [key, value || ''])
      )
    };
  }

  private getStepFields(step: string): Array<keyof FormData> {
    // Define which fields belong to each step
    const stepFields: Record<string, Array<keyof FormData>> = {
      about: ['businessName', 'businessDescription', 'targetAudience', 'primaryGoals'],
      design: ['hasLogo', 'hasBrandColors', 'hasBrandFonts', 'aestheticStyle'],
      functionality: ['essentialPages', 'desiredFeatures'],
      logistics: ['timeline', 'budgetTier']
    };

    return stepFields[step] || [];
  }
} 