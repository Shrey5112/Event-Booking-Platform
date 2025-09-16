import dataUriParser from "datauri/parser.js";
import path from "path";

const parser = new dataUriParser();

interface File {
    originalname: string;
    buffer: Buffer;
}

const getDataUri = (file: File | undefined): string | undefined => {
    if (!file) return;
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};

export default getDataUri;
