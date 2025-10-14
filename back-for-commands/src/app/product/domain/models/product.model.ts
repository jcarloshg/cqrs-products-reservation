import { ModelError } from "@/app/shared/domain/errors/models.error";
import { z } from "zod";

const ProductSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    description: z.string(),
    sku: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

// ─────────────────────────────────────
// Create
// ─────────────────────────────────────
const ProductToCreateScheme = z.object({
    uuid: z.uuid(),
    name: z.string(),
    description: z.string(),
    sku: z.string(),
})
const ProductToCreate = ProductToCreateScheme.omit({ uuid: true })
export type ProductToCreate = z.infer<typeof ProductToCreate>;
const ProductToCreateRepo = ProductToCreateScheme;
export type ProductToCreateRepo = z.infer<typeof ProductToCreateRepo>;


// ─────────────────────────────────────
// Create
// ─────────────────────────────────────
export type ProductToRead = Product;
export type ProductToUpdate = Product;
export type ProductToDelete = Product;

export class ProductValidator {
    public static toCreate(data: { [key: string]: any }): ProductToCreate {
        const parsed = ProductToCreateScheme.safeParse(data);
        if (parsed.success === false) throw new ModelError("Product", parsed.error);
        return parsed.data;
    }

    public static toRead(data: { [key: string]: any }): ProductToRead {
        const parsed = ProductSchema.safeParse(data);
        if (parsed.success === false) throw new ModelError("Product", parsed.error);
        return parsed.data;
    }

    public static toUpdate(data: { [key: string]: any }): ProductToUpdate {
        const parsed = ProductSchema.safeParse(data);
        if (parsed.success === false) throw new ModelError("Product", parsed.error);
        return parsed.data;
    }

    public static toDelete(data: { [key: string]: any }): ProductToDelete {
        const parsed = ProductSchema.safeParse(data);
        if (parsed.success === false) throw new ModelError("Product", parsed.error);
        return parsed.data;
    }

}
