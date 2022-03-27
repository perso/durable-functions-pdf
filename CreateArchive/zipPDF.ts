import archiver from "archiver";
import { PassThrough, Readable } from "stream";

export type PdfDocument = { filename: string; content: Buffer; contentType: string };
export type ZipArchive = { filename: string; content: Buffer; contentType: string };

export default (pdfs: PdfDocument[]): Readable => {
    const output = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err: Error) => {
        throw err;
    });

    archive.pipe(output);

    pdfs.forEach((pdf) => {
        archive.append(pdf.content, { name: pdf.filename });
    });

    archive.finalize();

    return output;
};
