import DataUriParser from 'datauri/Parser.js';
import path from 'path';

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const exName = path.extname(file.originalname).toString();
    return parser.format(exName, file.buffer);
}
export default getDataUri;
