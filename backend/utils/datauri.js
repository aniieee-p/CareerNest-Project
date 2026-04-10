import path from 'path';

const getDataUri = (file) => {
    const exName = path.extname(file.originalname).toString();
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype || `image/${exName.replace('.', '')}`;
    return { content: `data:${mimeType};base64,${base64}` };
}
export default getDataUri;
