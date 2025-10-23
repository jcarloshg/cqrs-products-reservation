export class CrudRepository<T> {
    constructor() { }

    create(item: T): Promise<T | null> {
        throw new Error("CrudRepository[create] - Method not implemented.");
    }

    findAll(): Promise<T[]> {
        throw new Error("CrudRepository[findAll] - Method not implemented.");
    }

    findById(id: string): Promise<T | null> {
        throw new Error("CrudRepository[findById] - Method not implemented.");
    }

    findByFields(fields: Partial<T>): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    update(id: string, item: Partial<T>): Promise<T | null> {
        throw new Error("CrudRepository[update] - Method not implemented.");
    }

    softDelete(id: string): Promise<boolean> {
        throw new Error("CrudRepository[softDelete] - Method not implemented.");
    }

    destroy(id: string): Promise<boolean> {
        throw new Error("CrudRepository[destroy] - Method not implemented.");
    }

}
