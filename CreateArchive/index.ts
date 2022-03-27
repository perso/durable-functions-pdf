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
import mapToPdfDocument from "./mapToPdfDocument";
import zipPDF from "./zipPDF";
import getInstancePrefix from "../shared/getInstancePrefix";

export type CreateArchiveActivityParams = {
    generationId: string;
    pdfBlobs: UploadedBlob[];
};

const activityFunction: AzureFunction = async function (context: Context): Promise<UploadedBlob> {
    const { generationId, pdfBlobs } = context.bindings.params as unknown as CreateArchiveActivityParams;

    const storageClient = new StorageClient(new Environment());

    console.log("Downloading PDFs");
    const downloadedBlobs = await Promise.all(pdfBlobs.map((pdfBlob) => storageClient.downloadBlob(pdfBlob.filepath)));
    const pdfs = downloadedBlobs.map((blob) => mapToPdfDocument(blob));

    console.log("Creating ZIP archive from uploaded PDFs");
    const zipStream = zipPDF(pdfs);

    console.log("Storing ZIP to blob storage");
    const prefix = getInstancePrefix(generationId);
    return storageClient.uploadBlob(`${prefix}/report.zip`, zipStream, "application/zip");
};

export default activityFunction;
