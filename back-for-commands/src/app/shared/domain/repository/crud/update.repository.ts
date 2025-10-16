export class UpdateRepository<IdType, DataToUpdate, EntityUpdated> {
    public async run(
        id: IdType,
        entity: DataToUpdate
    ): Promise<EntityUpdated | null> {
        throw new Error("Method not implemented.");
    }
}