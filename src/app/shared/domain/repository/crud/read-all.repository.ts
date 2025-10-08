export interface ReadAllRequest {
    page: number;
    pageSize: number;
}

export class ReadAllRepository<Entity> {
    public async run(readAllRequest: ReadAllRequest): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }
}
