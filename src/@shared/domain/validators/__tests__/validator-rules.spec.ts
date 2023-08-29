import { ValidationError } from "../../../domain/errors/validation.error";
import { ValidatorRules } from "./../validate-rules";

type Values = {
  value: any;
  property: string;
}

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params);
}

function assertInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected)
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected)
  }).not.toThrow(expected.error);
}

describe("ValidatorRules Unit Tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field");
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field");
  });

  test("required validation rule", () => {
    //Invalid cases
    let arrange: Values[] = [
      {value: null, property: "field"},
      {value: undefined, property: "field"},
      {value: "", property: "field"},
    ];

    /* arrange.forEach(item => {
      expect(() => {
        ValidatorRules.values(item.value, item.property).required();
      }).toThrow(new ValidationError(item.expectedError));
    }); */

    const error = new ValidationError("The field is required");
    arrange.forEach(item => {
      assertInvalid({
        value: item.value,
        property: item.property,
        rule: "required",
        error,
      });
    });

    //Valid cases
    arrange = [
      {value: "test", property: "field",},
      {value: 5, property: "field",},
      {value: false, property: "field",},
    ];

    arrange.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "required",
        error,
      });
    });
  });

  test("string validation rule", () => {
    //Invalid cases
    let arrange: Values[] = [
      {value: 5, property: "field"},
      {value: false, property: "field"},
      {value: {}, property: "field"},
    ];

    /* arrange.forEach(item => {
      expect(() => {
        ValidatorRules.values(item.value, item.property).required();
      }).toThrow(new ValidationError(item.expectedError));
    }); */

    const error = new ValidationError("The field must be a string");
    arrange.forEach(item => {
      assertInvalid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });

    //Valid cases
    arrange = [
      {value: "test", property: "field"},
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "string",
        error,
      });
    });
  });

  test("maxLength validation rule", () => {
    //Invalid cases
    let arrange: Values[] = [
      {value: "aaaaaa", property: "field"},
    ];

    const error = new ValidationError("The field must be less or equal than 5 characters");
    arrange.forEach(item => {
      assertInvalid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });

    //Valid cases
    arrange = [
      {value: "aaaaa", property: "field"},
      { value: null, property: "field" },
      { value: undefined, property: "field" },
    ];

    arrange.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "maxLength",
        error,
        params: [5],
      });
    });
  });

  test("boolean validation rule", () => {
    //Invalid cases
    let arrange: Values[] = [
      {value: 5, property: "field"},
      {value: "true", property: "field"},
      {value: "false", property: "field"},
    ];

    const error = new ValidationError("The field must be a boolean");
    arrange.forEach(item => {
      assertInvalid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });

    //Valid cases
    arrange = [
      { value: null, property: "field" },
      { value: undefined, property: "field" },
      { value: true, property: "field" },
      { value: false, property: "field" },
    ];

    arrange.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: "boolean",
        error,
      });
    });
  });

  it("should throw a validation error when combine two or more validation rules", () => {
    let validator = ValidatorRules.values(null, "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError("The field is required"));

    validator = ValidatorRules.values(5, "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(new ValidationError("The field must be a string"));

    validator = ValidatorRules.values("aaaaaa", "field");
    expect(() => {
      validator.required().string().maxLength(5);
    }).toThrow(
      new ValidationError("The field must be less or equal than 5 characters")
    );

    validator = ValidatorRules.values(null, "field");
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError("The field is required"));

    validator = ValidatorRules.values(5, "field");
    expect(() => {
      validator.required().boolean();
    }).toThrow(new ValidationError("The field must be a boolean"));
  });

  it("should valid when combine two or more validation rules", () => {
    expect.assertions(0);
    ValidatorRules.values("test", "field").required().string();
    ValidatorRules.values("aaaaa", "field").required().string().maxLength(5);

    ValidatorRules.values(true, "field").required().boolean();
    ValidatorRules.values(false, "field").required().boolean();
  });
});