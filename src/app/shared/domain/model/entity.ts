export class Entity<PropsType> {

    private readonly _props: PropsType;

    constructor(props: PropsType) {
        this._props = props;
    }

    public get props(): PropsType {
        return this._props;
    }

    public static create<T, Props>(props: Props): T {
        throw new Error("Method not implemented.");
    }

    public static parse<PropsType>(data: { [key: string]: any }): PropsType {
        throw new Error("Method not implemented.");
    }

}