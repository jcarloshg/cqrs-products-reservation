import { PostgresManager } from "@/app/shared/infrastructure/postgres/postgres-manager"

describe('postgres-manager.test', () => {
    it('should connect to the database', async () => {
        const a = PostgresManager.getInstance()
        await a.connect()
        expect(a.isConnectionActive()).toBe(true)
        await a.disconnect()
        expect(a.isConnectionActive()).toBe(false)
    })
})