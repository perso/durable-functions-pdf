/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

import * as df from "durable-functions";

const orchestrator = df.orchestrator(function* (context) {
    //const generationId = context.df.newGuid(context.df.instanceId);
    const generationId = context.df.instanceId;

    const htmlBlobs = yield context.df.callActivity("RenderHTML", { generationId });

    const tasks = htmlBlobs.map((htmlBlob) => {
        return context.df.callActivity("RenderPDF", {
            generationId,
            htmlBlob,
        });
    });

    const pdfBlobs = yield context.df.Task.all(tasks);

    const zipBlob = yield context.df.callActivity("CreateArchive", { generationId, pdfBlobs });

    return zipBlob.url;
});

export default orchestrator;
