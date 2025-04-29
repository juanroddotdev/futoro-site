import type { FormData } from '../types/FormTypes'

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface FormValidator {
  validateField: (field: keyof FormData, value: any) => Promise<ValidationResult>;
  validateStep: (step: string, values: Partial<FormData>) => Promise<ValidationResult>;
  validateForm: (values: Partial<FormData>) => Promise<ValidationResult>;
}

// Types for validation rules/schemas
export type ValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  email?: boolean;
  regex?: RegExp;
  custom?: (value: any) => boolean | string;
}

export type ValidationSchema = {
  [K in keyof FormData]?: ValidationRule;
} 