import { ContainerClient, BlobServiceClient, BlobSASPermissions, SASProtocol } from "@azure/storage-blob";
import dayjs from "dayjs";
import Environment from "./environment";
import { basename } from "path";
import { Readable } from "stream";
import { streamToBuffer } from "./util";

const CONTAINER_NAME = "pdf-report-store";

export type UploadedBlob = {
    url: string;
    filepath: string;
    filename: string;
    contentType: string;
};

export type DownloadedBlob = {
    buffer: Buffer;
    filepath: string;
    filename: string;
    contentType: string;
};

export default class StorageClient {
    private blobServiceClient: BlobServiceClient;
    private containerClient: ContainerClient;

    constructor(env: Environment) {
        const connectionString = env.getStorageConnectionString();
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);
    }

    public async uploadBlob(filepath: string, content: Readable, contentType: string): Promise<UploadedBlob> {
        const blockBlobClient = this.containerClient.getBlockBlobClient(filepath);

        await blockBlobClient.uploadStream(content);

        const sasURI = await blockBlobClient.generateSasUrl({
            permissions: BlobSASPermissions.parse("r"), // Read only
            expiresOn: dayjs().add(7, "day").toDate(),
            contentType,
            protocol: SASProtocol.Https,
        });
        return {
            url: sasURI,
            filepath,
            filename: basename(filepath),
            contentType,
        };
    }

    public async downloadBlob(filepath: string): Promise<DownloadedBlob> {
        const blockBlobClient = this.containerClient.getBlockBlobClient(filepath);

        const response = await blockBlobClient.download();

        const buffer = await streamToBuffer(response.readableStreamBody);

        return { buffer, contentType: response.contentType, filepath, filename: basename(filepath) };
    }
}
