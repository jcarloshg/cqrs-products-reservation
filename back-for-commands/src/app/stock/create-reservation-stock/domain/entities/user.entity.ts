import z from "zod";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import {
    EntityDomain,
    EntityProps,
    EntityPropsRawData,
} from "@/app/shared/domain/model/entity";

const UserPropsSchema = z.object({
    uuid: z.uuid(),
    username: z.string(),
    password: z.string(),
});
export type UserProps = z.infer<typeof UserPropsSchema>;

export class User implements EntityDomain<UserProps> {
    
    private readonly _entityProps: EntityProps<UserProps>;

    constructor(props: EntityPropsRawData) {
        this._entityProps = new EntityProps<UserProps>(props, this._validData);
    }

    getProps(): Readonly<UserProps> {
        return this._entityProps.getCopy();
    }

    getAggregateRoot(): AggregateRoot {
        return this._entityProps.getAggregateRoot();
    }

    private _validData(props: EntityPropsRawData): UserProps {
        const parsed = UserPropsSchema.safeParse(props);
        if (parsed.success === false) throw new Error("Invalid user data");
        return parsed.data;
    }
}
