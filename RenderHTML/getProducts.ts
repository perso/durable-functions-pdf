import { Product } from "../shared/models";
import fakeProducts from "../generated/fake-products.json";

export default async (): Promise<Product[]> => {
    return fakeProducts as unknown as Product[];
};
