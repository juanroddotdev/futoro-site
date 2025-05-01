import { validate } from 'vee-validate';
import { required, min, max, email, regex } from '@vee-validate/rules';
import type { FormData } from '../types/FormTypes';
import type { FormValidator, ValidationResult, ValidationSchema } from './types';

export class VeeValidateAdapter implements FormValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  private convertToVeeValidateSchema(schema: ValidationSchema) {
    const veeSchema: Record<string, any> = {};
    
    Object.entries(schema).forEach(([field, rules]) => {
      console.log('field', field);
      console.log('rules', rules);
      if (!rules) return;
      
      const fieldRules: Record<string, any> = {};
      
      if (rules.required) {
        fieldRules.required = required;
      }
      
      if (rules.min !== undefined) {
        fieldRules.min = (value: any) => min(value, { length: rules.min! });
      }
      
      if (rules.max !== undefined) {
        fieldRules.max = (value: any) => max(value, { length: rules.max! });
      }
      
      if (rules.email) {
        fieldRules.email = email;
      }
      
      if (rules.regex) {
        fieldRules.regex = (value: any) => regex(value, { regex: rules.regex! });
      }
      
      if (rules.custom) {
        fieldRules.custom = rules.custom;
      }
      
      veeSchema[field] = fieldRules;
    });
    
    return veeSchema;
  }

  private validateCustomRule(value: any, rule: (value: any) => boolean | string): string | boolean {
    const result = rule(value);
    if (typeof result === 'string') {
      return result;
    }
    if (typeof result === 'boolean') {
      return result ? true : 'Invalid value';
    }
    return 'Validation failed';
  }

  async validateField(field: keyof FormData, value: any): Promise<ValidationResult> {
    const veeSchema = this.convertToVeeValidateSchema(this.schema);
    const fieldRules = veeSchema[field];
    
    if (!fieldRules) {
      return { valid: true, errors: { [field]: '' } };
    }

    try {
      const result = await validate(value, fieldRules);
      
      // Handle custom validation if it exists
      if (this.schema[field]?.custom) {
        const customResult = this.validateCustomRule(value, this.schema[field]!.custom!);
        if (typeof customResult === 'string') {
          return { valid: false, errors: { [field]: customResult } };
        }
      }
      
      return {
        valid: result.valid,
        errors: { [field]: Array.isArray(result.errors) ? result.errors[0] || '' : '' }
      };
    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, errors: { [field]: 'Validation failed' } };
    }
  }

  async validateStep(step: string, values: Partial<FormData>): Promise<ValidationResult> {
    const stepFields = this.getStepFields(step);
    const veeSchema = this.convertToVeeValidateSchema(this.schema);
    const stepSchema: Record<string, any> = {};
    const stepValues: Record<string, any> = {};
    
    stepFields.forEach(field => {
      if (veeSchema[field]) {
        stepSchema[field] = veeSchema[field];
        stepValues[field] = values[field];
      }
    });

    try {
      const result = await validate(stepValues, stepSchema);
      
      // Handle custom validation for each field
      const customErrors: Record<string, string> = {};
      for (const field of stepFields) {
        if (this.schema[field]?.custom) {
          const customResult = this.validateCustomRule(values[field], this.schema[field]!.custom!);
          if (typeof customResult === 'string') {
            customErrors[field] = customResult;
          }
        }
      }
      
      return {
        valid: result.valid && Object.keys(customErrors).length === 0,
        errors: {
          ...Object.fromEntries(
            Object.entries(result.errors || {}).map(([key, value]) => [key, Array.isArray(value) ? value[0] || '' : ''])
          ),
          ...customErrors
        }
      };
    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, errors: {} };
    }
  }

  async validateForm(values: Partial<FormData>): Promise<ValidationResult> {
    const veeSchema = this.convertToVeeValidateSchema(this.schema);
    
    try {
      const result = await validate(values, veeSchema);
      
      // Handle custom validation for each field
      const customErrors: Record<string, string> = {};
      Object.entries(this.schema).forEach(([field, rules]) => {
        if (rules?.custom) {
          const customResult = this.validateCustomRule(values[field as keyof FormData], rules.custom);
          if (typeof customResult === 'string') {
            customErrors[field] = customResult;
          }
        }
      });
      
      return {
        valid: result.valid && Object.keys(customErrors).length === 0,
        errors: {
          ...Object.fromEntries(
            Object.entries(result.errors || {}).map(([key, value]) => [key, Array.isArray(value) ? value[0] || '' : ''])
          ),
          ...customErrors
        }
      };
    } catch (error) {
      console.error('Validation error:', error);
      return { valid: false, errors: {} };
    }
  }

  private getStepFields(step: string): Array<keyof FormData> {
    const stepFields: Record<string, Array<keyof FormData>> = {
      about: ['businessName', 'businessDescription', 'targetAudience', 'primaryGoals'],
      design: ['hasLogo', 'hasBrandColors', 'hasBrandFonts', 'aestheticStyle'],
      functionality: ['essentialPages', 'desiredFeatures'],
      logistics: ['timeline', 'budgetTier']
    };

    return stepFields[step] || [];
  }
} 