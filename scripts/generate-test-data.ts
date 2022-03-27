import { faker } from "@faker-js/faker";
import { Product } from "../shared/models";
import { range } from "lodash";
import { writeFileSync } from "fs";
import { resolve } from "path";

const PRODUCT_COUNT = 65_327;

const makeFakeProduct = (): Product => {
    return {
        productCode: faker.random.alphaNumeric(8).toUpperCase(),
        productName: faker.commerce.productName(),
        manufacturer: `${faker.company.companyName()} ${faker.company.companySuffix()}`,
        color: faker.random.arrayElement(["green", "blue", "red", "yellow", "pink"]),
        inStock: faker.datatype.number(100),
        unitPrice: parseFloat(faker.commerce.price(5, 200, 2)),
    };
};

(() => {
    const fakeProducts = range(0, PRODUCT_COUNT).map(makeFakeProduct);
    writeFileSync(resolve(process.cwd(), "./generated/fake-products.json"), JSON.stringify(fakeProducts));
})();
