export class CrudRepository<T> {
    constructor() { }

    create(item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }

    findAll(): Promise<T[]> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    update(id: string, item: T): Promise<T | null> {
        throw new Error("Method not implemented.");
    }

    softDelete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    destroy(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}
