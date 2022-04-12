import fs from 'fs';

export const isTestEnv = () =>
    process.env.ENVIRONMENT_NAME === 'test' || process.env.NODE_ENV === 'test';

export const getModelFiles = modelsFolderPath => {
    if (typeof modelsFolderPath !== 'string') {
        throw new Error('modelPathString is invalid');
    }
    return fs
        .readdirSync(modelsFolderPath)
        .filter(file => fs.lstatSync(modelsFolderPath + file).isFile());
};
