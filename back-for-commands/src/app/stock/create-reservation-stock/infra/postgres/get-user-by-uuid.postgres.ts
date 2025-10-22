import { GetUserByUuidRepository } from "@/app/stock/create-reservation-stock/domain/services/repository/get-user-by-uuid.repository";
import { ReadByIdRepository } from "@/app/shared/domain/repository/crud/read-by-id.repository";
import { User, UserProps } from "@/app/stock/create-reservation-stock/domain/entities/user.entity";
import { UserFromDB } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";

export class GetUserByUuidPostgress implements GetUserByUuidRepository {

    public async findById(id: string): Promise<User | null> {
        try {
            const user = await UserFromDB.findOne({
                where: { uuid: id },
            });
            if (!user?.dataValues) throw new Error("User not found");
            const userProps: UserProps = {
                uuid: user.dataValues.uuid,
                username: user.dataValues.username,
                password: user.dataValues.password,
            }
            const userFound = new User(userProps);
            return userFound;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error in GetUserByUuidPostgress:", errorMessage);
            return null;
        }
    }

}