import { GetUserByUuidPostgress } from "@/app/stock/create-reservation-stock/infra/postgres/get-user-by-uuid.postgres";
import { User } from "@/app/stock/create-reservation-stock/domain/entities/user.entity";
import {
    UserAttributes,
    UserFromDB,
} from "@/app/shared/infrastructure/repository/postgres/models.sequelize";

describe("get-user-by-uuid.postgres.integration.test.ts", () => {
    let userForTest: UserAttributes | null = null;
    const mockUserData = {
        uuid: "b02148ba-d3f1-472f-9eef-2c87956318a3",
        username: "testuser",
        password: "testpass",
    };

    beforeEach(async () => {
        userForTest = (await UserFromDB.create(mockUserData)).dataValues;
    });

    afterEach(async () => {
        // Delete user after test
        if (userForTest)
            await UserFromDB.destroy({ where: { uuid: userForTest.uuid } });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return User when user exists", async () => {
        // Arrange
        const repo = new GetUserByUuidPostgress();

        // Act
        const result = await repo.findById(mockUserData.uuid);
        console.log(`result: `, result);

        // Assert
        expect(result).toBeInstanceOf(User);
        const props = result?.getProps();
        expect(props?.uuid).toBe(mockUserData.uuid);
        expect(props?.username).toBe(mockUserData.username);
        expect(props?.password).toBe(mockUserData.password);
    });

    it("should return null when user does not exist", async () => {
        // Arrange
        const repo = new GetUserByUuidPostgress();

        // Act
        const result = await repo.findById("non-existent-uuid");

        // Assert
        expect(result).toBeNull();
    });

    it("should return null when userRaw has no dataValues", async () => {
        // Arrange
        const repo = new GetUserByUuidPostgress();

        // Act
        const result = await repo.findById("another-uuid");

        // Assert
        expect(result).toBeNull();
    });

    it("should handle errors thrown by UserFromDB.findOne", async () => {
        // Arrange
        jest
            .spyOn(UserFromDB, "findOne")
            .mockRejectedValueOnce(new Error("DB error"));
        const repo = new GetUserByUuidPostgress();
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

        // Act
        const result = await repo.findById("error-uuid");

        // Assert
        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error in GetUserByUuidPostgress:",
            "DB error"
        );
        consoleErrorSpy.mockRestore();
    });
});
