export class CreateRepository<DataToCreate, EntityCreated> {
    public async run(entity: DataToCreate): Promise<EntityCreated> {
        throw new Error("Method not implemented.");
    }
}