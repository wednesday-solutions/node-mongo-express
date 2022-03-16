import fs from 'fs';
import path from 'path';
import express from 'express';
import {
    generatePostRequest,
    generateDeleteRequest,
    generatePatchRequest,
    generateFetchAllRequest,
    generateFetchOneRequest
} from '@api/requestGenerators';
import { mongoConnector } from '@middlewares/mongo';

import { customApisMapper, REQUEST_TYPES } from '@api/customApisMapper';

mongoConnector();
export default app => {
    const modelsFolderPath = path.join(__dirname, '../../models/');
    const fileArray = fs
        .readdirSync(modelsFolderPath)
        .filter(file => fs.lstatSync(modelsFolderPath + file).isFile());
    fileArray.forEach(f => {
        const { model } = require(modelsFolderPath + f);
        const name = f.split('.')[0];

        apiGeneratorFactory(app, name, model);
    });
};

const apiGeneratorFactory = (app, name, model) => {
    const router = express.Router();
    Object.values(REQUEST_TYPES).forEach(type => {
        if (!customApisMapper[name]?.methods.map(m => m.type).includes(type)) {
            // auto generate api
            switch (type) {
                case REQUEST_TYPES.create:
                    generatePostRequest(router, model);
                    break;
                case REQUEST_TYPES.update:
                    generatePatchRequest(router, model);
                    break;
                case REQUEST_TYPES.fetchOne:
                    generateFetchOneRequest(router, model);
                    break;
                case REQUEST_TYPES.fetchAll:
                    generateFetchAllRequest(router, model);
                    break;
                case REQUEST_TYPES.remove:
                    generateDeleteRequest(router, model);
                    break;
            }
        } else {
            customApisMapper[name]?.methods
                .find(m => m.type === type)
                ?.handler(router, model);
        }
    });
    app.use(`/${name}`, router);
};
