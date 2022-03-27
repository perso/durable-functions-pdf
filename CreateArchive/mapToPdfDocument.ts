import { DownloadedBlob } from "../shared/storageClient";
import { PdfDocument } from "./zipPDF";

export default (blob: DownloadedBlob): PdfDocument => ({
    filename: blob.filename,
    content: blob.buffer,
    contentType: blob.contentType,
});
