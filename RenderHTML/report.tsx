import * as React from "react";
import { Product } from "../shared/models";

const styles = `
html {
    /*border: 1px solid green;*/
}
body, table, p {
    -webkit-print-color-adjust: exact;
    line-height: 1.2;
    font-family: Helvetica, "Microsoft Yahei", SimSun, sans-serif;
    font-size: 12px;
}
table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}
td, th {
    border: 1px solid black;
    padding: 0.1rem;
    text-align: left;
}
h1 {
    text-align: center;
    font-size: 1.5em;
}
`;

const Report = (props: { title: string; products: Product[] }) => {
    const { title, products } = props;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="description" content={title} />
                <style>{styles}</style>
            </head>
            <body>
                <h1>{title}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Product code</th>
                            <th>Product name</th>
                            <th>Manufacturer</th>
                            <th>In stock</th>
                            <th>Unit price</th>
                            <th>Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, idx) => (
                            <tr key={idx}>
                                <td>{product.productCode}</td>
                                <td>{product.productName}</td>
                                <td>{product.manufacturer}</td>
                                <td>{product.inStock}</td>
                                <td>{product.unitPrice}</td>
                                <td>{product.color}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </body>
        </html>
    );
};

export default Report;
