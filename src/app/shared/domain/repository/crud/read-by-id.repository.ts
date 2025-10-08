export class ReadByIdRepository<EntityIdType, Entity> {
    async findById(id: EntityIdType): Promise<Entity | null> {
        throw new Error("Method not implemented.");
    }
}