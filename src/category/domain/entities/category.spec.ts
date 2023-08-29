import { omit } from "../../../@shared/domain/helper/omit-object-property";
import { Category, CategoryProps } from "./category";
import UniqueEntityId from '../../../@shared/domain/value-objects/unique-entity-id';

describe("Category Tests", () => {
  describe("Constructor tests", () => {
    beforeEach(() => {
      Category.validate = jest.fn(); // Criar um mock para sobrescrever o validate
    });
    it("should create a category with all fields", () => { 
      let created_at = new Date();
      const category = new Category({
        name: 'Movie',
        description: 'description',
        is_active: false,
        created_at: new Date(),
      });

      expect(Category.validate).toHaveBeenCalled();

      expect(category.props).toStrictEqual({
        name: 'Movie',
        description: 'description',
        is_active: false,
        created_at,
      })
    });

    it("should create a category with name only", () => {
      let category = new Category({name: 'Movie'});
      let props = omit(category.props, 'created_at');

      expect(Category.validate).toHaveBeenCalled();
      expect(props).toStrictEqual({
        name: 'Movie',
        description: null,
        is_active: true,
      });
      expect(category.props.created_at).toBeInstanceOf(Date);
    });

    it("should create a category with name and description", () => {
      let category = new Category({
        name: 'Movie',
        description: 'description',
      });

      expect(Category.validate).toHaveBeenCalled();
      expect(category.props).toMatchObject({
        name: 'Movie',
        description: 'description',
      })
      expect(category.props.is_active).toBe(true);
      expect(category.props.created_at).toBeInstanceOf(Date);
    });

    it("should create a category with name and is_active", () => {
      let category = new Category({
        name: 'Movie',
        is_active: false,
      });

      expect(Category.validate).toHaveBeenCalled();
      expect(category.props).toMatchObject({
        name: 'Movie',
        is_active: false,
      })
      expect(category.props.description).toBe(null);
      expect(category.props.created_at).toBeInstanceOf(Date);
    });

    it("should create a category with name and created_at", () => {
      let category = new Category({
        name: 'Movie',
        created_at: new Date()
      });
      let created_at = new Date();

      expect(Category.validate).toHaveBeenCalled();
      expect(category.props).toMatchObject({
        name: 'Movie',
        created_at,
      })
      expect(category.props.description).toBe(null);
      expect(category.props.is_active).toBe(true);
    });

    it("should create an UUID", () => {
      type CategoryData = { props: CategoryProps; id?: UniqueEntityId; };
      const data: CategoryData[] = [
        { props: { name: 'Movie' } },
        { props: { name: 'Movie' }, id: null },
        { props: { name: 'Movie' }, id: undefined },
        { props: { name: 'Movie' }, id: new UniqueEntityId() },
      ];

      data.forEach((item) => {
        const category = new Category(item.props, item.id);
        expect(Category.validate).toHaveBeenCalled();
        expect(category.id).not.toBeNull();
        //expect(category.id).toBeInstanceOf(UniqueEntityId);
      })
      /* let category = new Category({ name: 'Movie' });
      expect(category.id).not.toBeNull();

      category = new Category({ name: 'Movie' }, null);
      expect(category.id).not.toBeNull();

      category = new Category({ name: 'Movie' }, undefined);
      expect(category.id).not.toBeNull();

      const uuid = '8d67a0d2-5f8f-4d10-ba5a-0a5c3b7b5aaf'
      category = new Category({ name: 'Movie' }, uuid);
      expect(category.id).not.toBeNull();
      expect(category.id).toBe(uuid); */
    });
  });

  describe("getter and setter tests", () => {
    it("should get name", () => {
      const category = new Category({
        name: 'Movie',
      });
      expect(category.name).toBe('Movie');
    });

    it("should get description", () => {
      let category = new Category({
        name: 'Movie',
      });
      expect(category.description).toBeNull();

      category = new Category({
        name: 'Movie',
        description: 'description',
      });
      expect(category.description).toBe('description');
    });

    it("should set description", () => {
      let category = new Category({
        name: 'Movie',
      });
      category['description'] = 'other description';
      expect(category.description).toBe('other description');

      category['description'] = undefined;
      expect(category.description).toBeNull();

      category['description'] = null;
      expect(category.description).toBeNull();
    });

    it("should get is_active", () => {
      let category = new Category({
        name: 'Movie',
      });
      expect(category.is_active).toBeTruthy();

      category = new Category({
        name: 'Movie',
        is_active: true,
      });
      expect(category.is_active).toBeTruthy();

      category = new Category({
        name: 'Movie',
        is_active: false,
      });
      expect(category.is_active).toBeFalsy();
    });

    it("should set is_active", () => {
      let category = new Category({
        name: 'Movie',
      });

      category['is_active'] = true;
      expect(category.is_active).toBeTruthy();

      category['is_active'] = false;
      expect(category.is_active).toBeFalsy();
    });

    it("should get created_at", () => {
      let category = new Category({
        name: 'Movie',
      });

      expect(category.created_at).toBeInstanceOf(Date);

      let created_at = new Date();
      category = new Category({
        name: 'Movie',
        created_at,
      });
      expect(category.created_at).toBe(created_at);
    })
  });

  it("should update a category", () => {
    const category = new Category({ name: "Movie" });
    category.update("Documentary", "some description");
    expect(Category.validate).toHaveBeenCalledTimes(2);
    expect(category.name).toBe("Documentary");
    expect(category.description).toBe("some description");
  });

  it("should active a category", () => {
    const category = new Category({
      name: "Filmes",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  it("should disable a category", () => {
    const category = new Category({
      name: "Filmes",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });
});