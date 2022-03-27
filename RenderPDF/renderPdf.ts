import puppeteer from "puppeteer";
import { PassThrough, Readable } from "stream";

export default async (url: string): Promise<Readable> => {
    const browser = await puppeteer.launch({
        pipe: true,
        args: [
            "--headless",
            "--disable-gpu",
            "--full-memory-crash-report",
            "--unlimited-storage",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    });
    const page = await browser.newPage();

    // page.setDefaultNavigationTimeout(60000);
    // page.setDefaultTimeout(60000);

    await page.emulateMediaType("print");
    await page.goto(url, { waitUntil: "load" });

    const pdfStream = await page.createPDFStream({
        format: "a4",
        timeout: 300000,
    });

    const stream = new PassThrough();
    pdfStream.pipe(stream);
    pdfStream.on("end", async () => {
        await browser.close();
    });

    return stream;
};
