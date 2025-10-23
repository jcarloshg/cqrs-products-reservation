import { User } from "@/app/stock/create-reservation-stock/domain/entities/user.entity";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { EntityProps } from "@/app/shared/domain/model/entity";

describe("user.entity.ts", () => {
    const validProps = {
        uuid: crypto.randomUUID(),
        username: "testuser",
        password: "securepass",
    };

    it("should create a User with valid props", () => {
        // Arrange
        const props = { ...validProps };
        // Act
        const user = new User(props);
        // Assert
        expect(user.getProps()).toEqual(props);
    });

    it("should throw error for invalid uuid", () => {
        // Arrange
        const props = { ...validProps, uuid: "not-a-uuid" };
        // Act & Assert
        expect(() => new User(props)).toThrow("Invalid user data");
    });


    it("should throw error for missing username", () => {
        // Arrange
        const props: Partial<typeof validProps> = { ...validProps };
        delete props.username;
        // Act & Assert
        expect(() => new User(props as any)).toThrow("Invalid user data");
    });

    it("should throw error for missing password", () => {
        // Arrange
        const props: Partial<typeof validProps> = { ...validProps };
        delete props.password;
        // Act & Assert
        expect(() => new User(props as any)).toThrow("Invalid user data");
    });

    it("should return an AggregateRoot instance", () => {
        // Arrange
        const user = new User(validProps);
        // Act
        const aggRoot = user.getAggregateRoot();
        // Assert
        expect(aggRoot).toBeInstanceOf(AggregateRoot);
    });
});
