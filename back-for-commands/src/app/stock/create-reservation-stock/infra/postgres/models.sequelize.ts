import { DataTypes, Model, Optional } from "sequelize";

import { PostgresManager } from "@/app/shared/infrastructure/repository/postgres/postgres-manager";


// Get the sequelize instance
const sequelize = PostgresManager.getInstance().getSequelize();

// User model interfaces
interface UserAttributes {
    uuid: string;
    username: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "uuid"> { }

// Product model interfaces
interface ProductAttributes {
    uuid: string;
    name: string;
    description: string | null;
    price: number;
}

interface ProductCreationAttributes
    extends Optional<ProductAttributes, "uuid"> { }

// Stock model interfaces
interface StockAttributes {
    uuid: string;
    product_uuid: string;
    available_quantity: number;
    reserved_quantity: number;
}

interface StockCreationAttributes extends Optional<StockAttributes, "uuid"> { }

// Reservation model interfaces
interface ReservationAttributes {
    uuid: string;
    user_uuid: string;
    product_id: string;
    quantity: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
    expires_at: Date;
}

interface ReservationCreationAttributes
    extends Optional<ReservationAttributes, "uuid"> { }

// User Model
export class UserFromDB
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public uuid!: string;
    public username!: string;
    public password!: string;
}

UserFromDB.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false,
    }
);

// Product Model
export class ProductForDB
    extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes {
    public uuid!: string;
    public name!: string;
    public description!: string | null;
    public price!: number;
}

ProductForDB.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: false,
    }
);

// Stock Model
export class StockForDB
    extends Model<StockAttributes, StockCreationAttributes>
    implements StockAttributes {
    public uuid!: string;
    public product_uuid!: string;
    public available_quantity!: number;
    public reserved_quantity!: number;
}

StockForDB.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        product_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: ProductForDB,
                key: "uuid",
            },
        },
        available_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        reserved_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "Stock",
        tableName: "stock",
        timestamps: false,
    }
);

// Reservation Model
export class Reservation
    extends Model<ReservationAttributes, ReservationCreationAttributes>
    implements ReservationAttributes {
    public uuid!: string;
    public user_uuid!: string;
    public product_id!: string;
    public quantity!: number;
    public status!: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
    public expires_at!: Date;
}

Reservation.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserFromDB,
                key: "uuid",
            },
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: ProductForDB,
                key: "uuid",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                isIn: [["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"]],
            },
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Reservation",
        tableName: "reservations",
        timestamps: false,
    }
);

// Define associations
// Product has many Stock entries
ProductForDB.hasMany(StockForDB, {
    foreignKey: "product_uuid",
    as: "stocks",
});

StockForDB.belongsTo(ProductForDB, {
    foreignKey: "product_uuid",
    as: "product",
});

// User has many Reservations
UserFromDB.hasMany(Reservation, {
    foreignKey: "user_uuid",
    as: "reservations",
});

Reservation.belongsTo(UserFromDB, {
    foreignKey: "user_uuid",
    as: "user",
});

// Product has many Reservations
ProductForDB.hasMany(Reservation, {
    foreignKey: "product_id",
    as: "reservations",
});

Reservation.belongsTo(ProductForDB, {
    foreignKey: "product_id",
    as: "product",
});

// Export a function to initialize all models
export const initializeModels = async (): Promise<void> => {
    try {
        // Sync all models with the database
        await sequelize.sync({ alter: false });
        console.log("✅ All models synchronized successfully.");
    } catch (error) {
        console.error("❌ Error synchronizing models:", error);
        throw error;
    }
};
