export default class Environment {
    public getPropertyFromEnv(propertyName: string): string | undefined {
        if (process.env && process.env[propertyName]) {
            return process.env[propertyName] as string;
        }
        return undefined;
    }

    public getRequiredPropertyFromEnv(propertyName: string): string {
        if (process.env && process.env[propertyName]) {
            return process.env[propertyName] as string;
        }
        throw new Error(`Required property ${propertyName} is missing`);
    }

    public getStorageConnectionString(): string {
        return this.getRequiredPropertyFromEnv("AzureWebJobsStorage");
    }
}
