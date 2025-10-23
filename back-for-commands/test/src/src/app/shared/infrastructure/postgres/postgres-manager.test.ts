import { PostgresManager } from "@/app/shared/infrastructure/repository/postgres/postgres-manager";

describe("postgres-manager.test", () => {
    it("should connect to the database", async () => {
        const postgressConnectionInstance = PostgresManager.getInstance();
        await postgressConnectionInstance.connect();
        expect(postgressConnectionInstance.isConnectionActive()).toBe(true);
        await postgressConnectionInstance.disconnect();
        expect(postgressConnectionInstance.isConnectionActive()).toBe(false);
    });
});
