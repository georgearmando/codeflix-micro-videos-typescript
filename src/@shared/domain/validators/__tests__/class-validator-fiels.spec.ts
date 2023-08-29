import { ClassValidatorFields } from "../class-validator";
import * as libClassValidator from "class-validator";

class StubClassValidatorFields extends ClassValidatorFields<{field: string}>{}

describe("ClassValidatorFields Unit Tests", () => {
  it("should initialize errors and validatedDate variables with null", () => {
    const validator = new StubClassValidatorFields();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with erros", () => {
    // Vamos simular a chamada do validateSync do class-validator usando a propria lib
    // e tambem mockar o valor de retorno desta chamada
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([
      { property: "field", constraints: { isRequired: "some error"} }
    ]);

    const validator = new StubClassValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.errors).toStrictEqual({field: ["some error"]});
    expect(validator.validatedData).toBeNull();
  });

  it("should validate with erros", () => {
    // Vamos simular a chamada do validateSync do class-validator usando a propria lib
    // e tambem mockar o valor de retorno desta chamada
    const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
    spyValidateSync.mockReturnValue([]);

    const validator = new StubClassValidatorFields();
    expect(validator.validate({field: "value"})).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(validator.validatedData).toStrictEqual({field: "value"});
    expect(validator.errors).toBeNull();
  });
});