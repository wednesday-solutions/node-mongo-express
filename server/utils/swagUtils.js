import path from 'path';
import pluralize from 'pluralize';
import m2s from 'mongoose-to-swagger';
import kebabCase from 'lodash/kebabCase';
import swaggerUi from 'swagger-ui-express';
import { REQUEST_TYPES } from 'api/customApisMapper';
import Pack from '../../package.json';
import { getModelFiles } from '.';
import customSwaggerDoc from '../../swagger.json';
import { getStacks } from './routeLister';

const SWAGGER_DOCUMENT = {
    swagger: '2.0',
    info: {
        title: 'Parcel Node Mongo Express Documentation',
        version: Pack.version
    },
    tags: [],
    paths: {},
    definitions: {}
};

export const REQUEST_METHODS = {
    [REQUEST_TYPES.create]: 'post',
    [REQUEST_TYPES.update]: 'patch',
    [REQUEST_TYPES.fetchOne]: 'get',
    [REQUEST_TYPES.fetchAll]: 'get',
    [REQUEST_TYPES.remove]: 'delete'
};
export const SWAGGER_DOCS_PATH = '/api-docs/swagger.json';

export const DEFAULT_DEFINITIONS = {
    deleteResponse: {
        type: 'object',
        properties: {
            deletedCount: {
                type: 'integer',
                format: 'int64',
                example: 1
            }
        }
    }
};

/**
 * @typedef CustomSwagger
 * @type {object}
 * @property {Array|object} tags
 * @property {object} paths
 * @property {object} definitions
 */

/**
 *
 * @param {any} app
 * @param {CustomSwagger} customSwagger
 */
export const registerSwagger = app => {
    const options = {
        swaggerOptions: {
            url: SWAGGER_DOCS_PATH
        }
    };
    populateModelsSwagger(app);
    appendToSwaggerDoc(SWAGGER_DOCUMENT, customSwaggerDoc);
    app.get(SWAGGER_DOCS_PATH, (_, res) => res.json(SWAGGER_DOCUMENT));
    app.use(
        '/api-docs',
        swaggerUi.serveFiles(null, options),
        swaggerUi.setup(null, options)
    );
};

export const populateModelsSwagger = app => {
    const modelsFolderPath = path.join(__dirname, '../database/models/');
    const fileArray = getModelFiles(modelsFolderPath);
    fileArray.forEach(f => {
        const { model } = require(modelsFolderPath + f);
        const name = f.split('.')[0];
        const registeredMethodTypes = getModelMethods(app, name);

        const { swaggerPaths, swaggerDefs } = swagGeneratorFactory(
            name,
            model,
            registeredMethodTypes
        );
        appendToSwaggerDoc({
            paths: swaggerPaths,
            definitions: swaggerDefs,
            tags: {
                name,
                description: `${name} related endpoints`
            }
        });
    });
};

export const getModelMethods = (app, modelName) =>
    getStacks(app)
        .filter(stack => {
            if (!stack.route) return false;
            if (stack.routerPath === `/${kebabCase(modelName)}/`) {
                return true;
            }
            return false;
        })
        .map(stack => {
            const method = Object.keys(stack.route.methods)[0];
            switch (method) {
                case 'get':
                    if (stack.route.path === '/:_id')
                        return REQUEST_TYPES.fetchOne;
                    return REQUEST_TYPES.fetchAll;
                case 'post':
                    return REQUEST_TYPES.create;
                case 'patch':
                    return REQUEST_TYPES.update;
                case 'delete':
                    return REQUEST_TYPES.remove;
            }
        });

/**
 *
 * @param {CustomSwagger} swaggerData
 */
export const appendToSwaggerDoc = swaggerData => {
    const { paths, definitions, tags } = swaggerData;
    if (Array.isArray(tags)) {
        SWAGGER_DOCUMENT.tags.push(...tags);
    } else {
        SWAGGER_DOCUMENT.tags.push(tags);
    }
    SWAGGER_DOCUMENT.paths = {
        ...SWAGGER_DOCUMENT.paths,
        ...paths
    };
    SWAGGER_DOCUMENT.definitions = {
        ...SWAGGER_DOCUMENT.definitions,
        ...definitions
    };
};

export const swagGeneratorFactory = (name, model, types) => {
    const swaggerPaths = {};
    const swaggerDefs = {
        ...DEFAULT_DEFINITIONS
    };
    appendSwagDefs(name, model, swaggerDefs);
    types.forEach(type => appendSwagPaths(type, name, swaggerPaths));
    return { swaggerPaths, swaggerDefs };
};

export const appendSwagPaths = (type, name, swaggerPaths) => {
    const routeName = `/${kebabCase(name)}`;
    const method = REQUEST_METHODS[type];
    const lowerType = type.toLowerCase();
    const isPluralEnity = type === REQUEST_TYPES.fetchAll;
    const hasPathParam = ![
        REQUEST_TYPES.create,
        REQUEST_TYPES.fetchAll
    ].includes(type);
    const entityName = isPluralEnity ? name : pluralize.singular(name);
    const summary = `${lowerType} ${entityName}`;
    const parameters = hasPathParam
        ? [
              {
                  name: '_id',
                  in: 'path',
                  description: `ID of ${pluralize.singular(
                      name
                  )} to ${lowerType}`,
                  required: true,
                  type: 'string'
              }
          ]
        : {};
    const responses = {
        200: {
            type: 'object',
            description: `${lowerType} ${entityName} is success`,
            schema: {
                type: 'object',
                properties: {
                    data: isPluralEnity
                        ? {
                              type: 'array',
                              items: { $ref: `#/definitions/${name}` }
                          }
                        : type === REQUEST_TYPES.remove
                        ? { $ref: '#/definitions/deleteResponse' }
                        : { $ref: `#/definitions/${name}` }
                }
            }
        },
        400: {
            type: 'object',
            description: `${lowerType} ${entityName} is failed`,
            schema: {
                type: 'object',
                required: ['error'],
                properties: {
                    error: {
                        type: 'string',
                        example: `unable to ${lowerType} ${entityName}`
                    }
                }
            }
        }
    };
    const pathKey = !hasPathParam ? routeName : `${routeName}/{_id}`;
    swaggerPaths[pathKey] = {
        ...(swaggerPaths[pathKey] || {}),
        [method]: {
            tags: [name],
            summary,
            produces: ['application/json'],
            parameters,
            responses
        }
    };
};

export const appendSwagDefs = (name, model, swaggerDefs) => {
    const modelSchema = m2s(model);
    swaggerDefs[name] = {
        type: 'object',
        ...modelSchema,
        title: undefined
    };
};
