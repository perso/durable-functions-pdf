import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { Product } from "../shared/models";
import Report from "./report";
import { Readable, PassThrough } from "stream";

export default (products: Product[]): Readable => {
    const htmlStream = ReactDOMServer.renderToStaticNodeStream(
        <Report title="Super Duper Report" products={products} />,
    );
    const stream = new PassThrough();
    stream.push("<!DOCTYPE html>");
    htmlStream.pipe(stream);
    return stream;
};
