import { Product } from "../shared/models";
import { chunk } from "lodash";

const BUNDLE_SIZE = 5_000;

export type ProductBundle = {
    bundleIndex: number;
    products: Product[];
};

export default (products: Product[]): ProductBundle[] => {
    const chunks = chunk(products, BUNDLE_SIZE);
    return chunks.map((products, idx) => ({
        bundleIndex: idx,
        products,
    }));
};
