import { ValueObject } from "../value-object";

// Como uma classe abstracta nao pode ser instanciada
// entao usamos o conceito de Stub que implementa o comortamento de uma class
// diferente do mock que simula o comportamento de uma class
class StubValueObject extends ValueObject{}

describe("ValueObject Unit Tests", () => {
  it("should create a value object setting a value", () => {
    const vo = new StubValueObject("any_value");
    expect(vo.value).toBe("any_value");
  });

  it("should create a value object setting an object", () => {
    const vo = new StubValueObject({ any: "value" });
    expect(vo.value).toStrictEqual({ any: "value" });
  });

  it("should convert to string", () => {
    const date = new Date();
    const arrange = [
      {received: 0, expected: "0"},
      {received: 1, expected: "1"},
      {received: true, expected: "true"},
      {received: false, expected: "false"},
      {received: "", expected: ""},
      {received: "any", expected: "any"},
      {received: date, expected: date.toString()},
      {received: {}, expected: "{}"},
      {
        received: { prop1: "value1" }, 
        expected: JSON.stringify({ prop1: "value1" })
      }
    ];

    arrange.forEach(value => {
      const vo = new StubValueObject(value.received);
      expect(vo + "").toBe(value.expected);
    });
  });

  it("should be a immutable object", () => {
    const obj = {
      prop1: "value1",
      deep: { prop2: "value2", prop3: new Date() },
    };
    const vo = new StubValueObject(obj);

    expect(() => {
      (vo as any).value.prop1 = "test";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => {
      (vo as any).value.deep.prop2 = "test";
    }).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});