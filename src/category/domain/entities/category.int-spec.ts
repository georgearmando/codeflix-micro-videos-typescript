import { ValidationError } from "../../../@shared/domain/errors/validation.error";
import { Category } from "./category";

describe("Category Integration Tests", () => {
  describe("Create Category Tests", () => {
    it("should not create a category when using an invalid name", () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => new Category({ name: "" })).containsErrorMessages({
        name: [
          'name should not be empty',
        ]
      });

      expect(() => new Category({ name: 5 as any  })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => new Category({ name: "t".repeat(256)  })).containsErrorMessages({
        name: [
          'name must be shorter than or equal to 255 characters'
        ]
      });
  
      /* expect(() => new Category({ name: "" })).toThrow(
        new ValidationError("The name is required")
      ); */
    });
  
    it("should not create a category when using an invalid description", () => {
      expect(() => new Category({ description: 5 } as any)).containsErrorMessages({
        description: ['description must be a string']
      });
      /* expect(() => new Category({ name: "Movie", description: 5 as any })).toThrow(
        new ValidationError("The description must be a string")
      ); */
    });
  
    it("should not create a category when using an invalid is_active", () => {
      expect(() => new Category({ is_active: 5 } as any)).containsErrorMessages({
        is_active: ['is_active must be a boolean value']
      });
      /* expect(() => new Category({ name: "Movie", is_active: 5 as any })).toThrow(
        new ValidationError("The is_active must be a boolean")
      ); */
    });

    it("should create a category when properties are valid", () => {
      expect.assertions(0);

      new Category({ name: "Movie" });
      new Category({ name: "Movie", description: "some description" });
      new Category({ name: "Movie", description: null });

      new Category({
        name: "Movie",
        description: "some description",
        is_active: false,
      });
      new Category({
        name: "Movie",
        description: "some description",
        is_active: true,
      });
    });
  });

  describe("Update Category Tests", () => {
    it("should not update a category when using an invalid name", () => {
      const category = new Category({ name: "Movie" });
      expect(() => category.update(null, null)).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => category.update("", null)).containsErrorMessages({
        name: ['name should not be empty']
      });

      expect(() => category.update(5 as any, null)).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      });

      expect(() => category.update("t".repeat(256), null)).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters']
      });
      /* expect(() => category.update(null, null)).toThrow(
        new ValidationError("The name is required")
      ); */
    });
  
    it("should not update a category when using an invalid description", () => {
      const category = new Category({ name: "Movie" });
      expect(() => category.update("Movie", 5 as any)).containsErrorMessages({
        description: ['description must be a string']
      });
    });

    it("should a valid category", () => {
      expect.assertions(0);
      const category = new Category({ name: "Movie" });
      category.update("name changed", null);
      category.update("name changed", "some description");
    });
  });
});