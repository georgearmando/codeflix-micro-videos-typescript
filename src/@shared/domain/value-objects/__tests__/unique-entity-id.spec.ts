import InvalidUUIDError from "../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id";

/* function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, "validate");
} */

describe("Unique Entity ID test", () => {
  /* beforeEach(() => {
    jest.clearAllMocks();
  }); */

  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

  /* beforeEach(() => {
    validateSpy.mockClear();
  }); */

  it("should throw error when id is invalid", () => {
    //const validateSpy = spyValidateMethod();
    expect(() => new UniqueEntityId("invalid")).toThrowError(new InvalidUUIDError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should accept a valid uuid in constructor", () => {
    //const validateSpy = spyValidateMethod();
    const uuid = "8d67a0d2-5f8f-4d10-ba5a-0a5c3b7b5aaf";
    const uniqueEntityId = new UniqueEntityId(uuid);
    expect(uniqueEntityId.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should create a valid uuid when id is not provided", () => {
    //const validateSpy = spyValidateMethod();
    const uniqueEntityId = new UniqueEntityId();
    expect(uniqueEntityId.value).toBeDefined();
    expect(validateSpy).toHaveBeenCalled();
  });
});