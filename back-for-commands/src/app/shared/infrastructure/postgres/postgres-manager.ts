import { Sequelize } from "sequelize";
import { enviromentVariables } from "../utils/enviroment-variables";

export class PostgresManager {
    private static instance: PostgresManager;
    private sequelize: Sequelize;
    private isConnected: boolean = false;

    private constructor() {
        // Database configuration from environment variables or defaults
        const POSTGRES_ENV = enviromentVariables.POSTGRES_ENV;

        // Initialize Sequelize with PostgreSQL configuration
        this.sequelize = new Sequelize(
            POSTGRES_ENV.POSTGRES_DB,
            POSTGRES_ENV.POSTGRES_USER,
            POSTGRES_ENV.POSTGRES_PASSWORD,
            {
                host: POSTGRES_ENV.POSTGRES_HOST,
                port: parseInt(POSTGRES_ENV.POSTGRES_PORT),
                dialect: "postgres",
            }
        );
    }

    // Singleton pattern to ensure single database connection
    public static getInstance(): PostgresManager {
        if (!PostgresManager.instance) {
            PostgresManager.instance = new PostgresManager();
        }
        return PostgresManager.instance;
    }

    // Get Sequelize instance
    public getSequelize(): Sequelize {
        return this.sequelize;
    }

    // Connect to database
    public async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.isConnected = true;
            console.log("✅ PostgreSQL connection established successfully.");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.isConnected = false;
            console.error("❌ Unable to connect to PostgreSQL database:", errorMessage);
            throw new Error(`Database connection failed: ${errorMessage}`);
        }
    }

    // Disconnect from database
    public async disconnect(): Promise<void> {
        try {
            await this.sequelize.close();
            this.isConnected = false;
            console.log("✅ PostgreSQL connection closed successfully.");
        } catch (error) {
            console.error("❌ Error closing PostgreSQL connection:", error);
            throw new Error(`Database disconnection failed: ${error}`);
        }
    }

    // Check connection status
    public isConnectionActive(): boolean {
        return this.isConnected;
    }

    // Test database connection
    public async testConnection(): Promise<boolean> {
        try {
            await this.sequelize.authenticate();
            return true;
        } catch (error) {
            console.error("❌ Database connection test failed:", error);
            return false;
        }
    }

    // Sync database models (use with caution in production)
    public async syncDatabase(
        options: { force?: boolean; alter?: boolean } = {}
    ): Promise<void> {
        try {
            await this.sequelize.sync(options);
            console.log("✅ Database synchronized successfully.");
        } catch (error) {
            console.error("❌ Database synchronization failed:", error);
            throw new Error(`Database sync failed: ${error}`);
        }
    }

    // Execute raw SQL queries
    public async executeRawQuery(
        query: string,
        replacements?: any
    ): Promise<any> {
        try {
            const [results, metadata] = await this.sequelize.query(query, {
                replacements,
            });
            return results;
        } catch (error) {
            console.error("❌ Raw query execution failed:", error);
            throw new Error(`Query execution failed: ${error}`);
        }
    }

    // Get database information
    public getDatabaseInfo(): object {
        return {
            dialect: this.sequelize.getDialect(),
            database: this.sequelize.getDatabaseName(),
            host: this.sequelize.config.host,
            port: this.sequelize.config.port,
            connected: this.isConnected,
        };
    }
}
