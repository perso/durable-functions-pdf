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
import StorageClient, { UploadedBlob } from "../shared/storageClient";
import renderPDF from "./renderPdf";
import { parse } from "path";
import getInstancePrefix from "../shared/getInstancePrefix";

export type RenderPdfActivityParams = {
    generationId: string;
    htmlBlob: UploadedBlob;
};

process.on("warning", (e) => console.warn(e.stack));

const activityFunction: AzureFunction = async function (context: Context): Promise<UploadedBlob> {
    const { generationId, htmlBlob } = context.bindings.params as unknown as RenderPdfActivityParams;

    console.log(`Rendering HTML to PDF (${htmlBlob.filename})`);
    const pdfStream = await renderPDF(htmlBlob.url);

    const filename = `${parse(htmlBlob.filename).name}.pdf`;

    console.log(`Storing PDF to blob storage (${filename})`);
    const storageClient = new StorageClient(new Environment());
    const prefix = getInstancePrefix(generationId);
    return storageClient.uploadBlob(`${prefix}/pdf/${filename}`, pdfStream, "application/pdf");
};

export default activityFunction;
