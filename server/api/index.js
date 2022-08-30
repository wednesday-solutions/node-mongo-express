import path from 'path';
import express from 'express';
import kebab from 'lodash/kebabCase';
import { generateRequest } from 'api/requestGenerators';
import { mongoConnector } from '../database/mongo';
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
    let modelsFolderPath = path.join(
        __dirname,
        '../../server/database/models/'
    );
    const fileArray = getModelFiles(modelsFolderPath);
    fileArray.forEach(f => {
        // eslint-disable-next-line prefer-template
        const { model } = require(`server/database/models/` + f);
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
