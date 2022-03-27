/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from "@azure/functions";
import Environment from "../shared/environment";
import getInstancePrefix from "../shared/getInstancePrefix";
import StorageClient, { UploadedBlob } from "../shared/storageClient";
import bundleProducts, { ProductBundle } from "./bundleProducts";
import getProducts from "./getProducts";
import renderToHtml from "./renderHtml";

const processBundle = async (generationId: string, bundle: ProductBundle): Promise<UploadedBlob> => {
    console.log("Rendering products to HTML");
    const htmlStream = renderToHtml(bundle.products);

    console.log("Storing HTML to blob storage");
    const storageClient = new StorageClient(new Environment());
    const prefix = getInstancePrefix(generationId);
    return storageClient.uploadBlob(`${prefix}/html/report-${bundle.bundleIndex}.html`, htmlStream, "text/html");
};

const activityFunction: AzureFunction = async function (context: Context): Promise<UploadedBlob[]> {
    const { generationId } = context.bindings.params;

    const products = await getProducts();
    const productBundles = bundleProducts(products);
    const promises = productBundles.map((bundle) => processBundle(generationId, bundle));

    return await Promise.all(promises);
};

export default activityFunction;
