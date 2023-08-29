import { FieldsErrors } from "@shared/domain/validators/validator-field-interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R;
    }
  }
}

export {}