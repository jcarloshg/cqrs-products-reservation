import { CrudRepository } from "./crud.repository";

export interface UserDataFromDB {
    uuid: string;
    username: string;
    password: string;

}

export class UserCrudRepo implements CrudRepository<UserDataFromDB> {
    constructor() { }

    create(item: UserDataFromDB): Promise<UserDataFromDB | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<UserDataFromDB[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<UserDataFromDB | null> {
        throw new Error("Method not implemented.");
    }
    findByFields(fields: Partial<UserDataFromDB>): Promise<UserDataFromDB | null> {
        throw new Error("Method not implemented.");
    }
    update(id: string, item: Partial<UserDataFromDB>): Promise<UserDataFromDB | null> {
        throw new Error("Method not implemented.");
    }
    softDelete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    destroy(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}