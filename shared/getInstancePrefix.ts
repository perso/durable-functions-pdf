import dayjs from "dayjs";

export default (generationId: string): string => {
    return `${dayjs().format("YYYY-MM-DD")}/${generationId}`;
};
