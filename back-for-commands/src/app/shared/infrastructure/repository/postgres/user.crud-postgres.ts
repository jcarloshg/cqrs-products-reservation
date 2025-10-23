
import { UserCrudRepo, UserDataFromDB } from "@/app/shared/domain/repository/user.crud-repo";
import { UserFromDB } from "./models.sequelize";

export class UserCrudPostgres implements UserCrudRepo {
    constructor() { }

    // ─────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────
    async create(item: UserDataFromDB): Promise<UserDataFromDB | null> {
        try {
            const created = await UserFromDB.create(item);
            return created?.dataValues as UserDataFromDB;
        } catch (error) {
            return null;
        }
    }

    // ─────────────────────────────────────
    // READ
    // ─────────────────────────────────────
    async findAll(): Promise<UserDataFromDB[]> {
        try {
            const results = await UserFromDB.findAll();
            return results.map((r: any) => r.dataValues as UserDataFromDB);
        } catch (error) {
            return [];
        }
    }

    async findById(id: string): Promise<UserDataFromDB | null> {
        try {
            const found = await UserFromDB.findByPk(id);
            return found ? (found.dataValues as UserDataFromDB) : null;
        } catch (error) {
            return null;
        }
    }

    async findByFields(fields: Partial<UserDataFromDB>): Promise<UserDataFromDB | null> {
        try {
            const found = await UserFromDB.findOne({ where: fields });
            return found ? (found.dataValues as UserDataFromDB) : null;
        } catch (error) {
            return null;
        }
    }

    // ─────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────
    async update(id: string, item: Partial<UserDataFromDB>): Promise<UserDataFromDB | null> {
        try {
            const found = await UserFromDB.findByPk(id);
            if (!found) return null;
            const updated = await found.update(item);
            return updated.dataValues as UserDataFromDB;
        } catch (error) {
            return null;
        }
    }

    // ─────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────
    async softDelete(id: string): Promise<boolean> {
        throw new Error("softDelete - Method not implemented yet.");
    }

    async destroy(id: string): Promise<boolean> {
        try {
            const deleted = await UserFromDB.destroy({ where: { uuid: id } });
            return deleted > 0;
        } catch (error) {
            return false;
        }
    }
}