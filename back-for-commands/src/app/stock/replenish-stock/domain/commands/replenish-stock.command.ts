import { Command } from "@/app/shared/domain/domain-events/command";

export interface ReplenishStockCommandProps {
    product: {
        uuid: string;
        quantity: number;
    }
}

export class ReplenishStockCommand implements Command {

    public readonly props: ReplenishStockCommandProps

    constructor(props: ReplenishStockCommandProps) {
        this.props = props;
    }

    public static get COMMAND_NAME(): string {
        return "UC-002.REPLENISH_STOCK_COMMAND";
    }

    getProductUuid(): string {
        return this.props.product.uuid;
    }

    getQuantity() {
        return this.props.product.quantity;
    }
}