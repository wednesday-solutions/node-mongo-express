import path from 'path';
import express from 'express';
import kebab from 'lodash/kebabCase';
import { generateRequest } from 'api/requestGenerators';
import { mongoConnector } from 'middlewares/mongo';
import { customApisMapper, REQUEST_TYPES } from 'api/customApisMapper';
import customRoutes from 'server/api/routes';
import { getModelFiles, isTestEnv } from 'utils';
import { registerSwagger } from 'utils/swagUtils';

/* istanbul ignore next */
if (!isTestEnv()) {
    mongoConnector();
}

export default app => {
    autoGenerateApisFromModels(app);
    // Custom api
    app.use('/', customRoutes);
    registerSwagger(app);
};

const autoGenerateApisFromModels = app => {
    const modelsFolderPath = path.join(__dirname, '../../server/models/');
    const fileArray = getModelFiles(modelsFolderPath);
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
            generateRequest(type, router, model);
        } else {
            const customApi = customApisMapper[name].methods.find(
                m => m.type === type
            );
            if (customApi.handler) {
                customApi.handler(router, model, customApi.validator);
            }
        }
    });
    app.use(`/${kebab(name)}`, router);
};
