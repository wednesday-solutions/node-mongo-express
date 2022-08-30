import path from 'path';
import pluralize from 'pluralize';
import m2s from 'mongoose-to-swagger';
import kebabCase from 'lodash/kebabCase';
import swaggerUi from 'swagger-ui-express';
import { REQUEST_TYPES } from 'api/customApisMapper';
import Pack from '../../package.json';
import { getModelFiles } from '.';
import customSwaggerDoc from '../../swagger.json';

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
    const swaggerDocument = generateSwaggerDoc();
    appendToSwaggerDoc(swaggerDocument, customSwaggerDoc);
    app.get(SWAGGER_DOCS_PATH, (_, res) => res.json(swaggerDocument));
    app.use(
        '/api-docs',
        swaggerUi.serveFiles(null, options),
        swaggerUi.setup(null, options)
    );
};

export const generateSwaggerDoc = () => {
    const swaggerDocument = {
        swagger: '2.0',
        info: {
            title: 'Node Mongo Express Documentation',
            version: Pack.version
        },
        tags: [],
        paths: {},
        definitions: {}
    };
    const modelsFolderPath = path.join(
        __dirname,
        '../../server/database/models/'
    );
    const fileArray = getModelFiles(modelsFolderPath);
    fileArray.forEach(f => {
        // eslint-disable-next-line prefer-template
        const { model } = require('server/database/models/' + f);
        const name = f.split('.')[0];

        const { swaggerPaths, swaggerDefs } = swagGeneratorFactory(name, model);
        appendToSwaggerDoc(swaggerDocument, {
            paths: swaggerPaths,
            definitions: swaggerDefs,
            tags: {
                name,
                description: `${name} related endpoints`
            }
        });
    });
    return swaggerDocument;
};

/**
 *
 * @param {any} swaggerDocument
 * @param {CustomSwagger} swaggerData
 */
export const appendToSwaggerDoc = (swaggerDocument, swaggerData) => {
    const { paths, definitions, tags } = swaggerData;
    if (Array.isArray(tags)) {
        swaggerDocument.tags.push(...tags);
    } else {
        swaggerDocument.tags.push(tags);
    }
    swaggerDocument.paths = {
        ...swaggerDocument.paths,
        ...paths
    };
    swaggerDocument.definitions = {
        ...swaggerDocument.definitions,
        ...definitions
    };
};

export const swagGeneratorFactory = (name, model) => {
    const swaggerPaths = {};
    const swaggerDefs = {
        ...DEFAULT_DEFINITIONS
    };
    appendSwagDefs(name, model, swaggerDefs);
    Object.values(REQUEST_TYPES).forEach(type =>
        appendSwagPaths(type, name, swaggerPaths)
    );
    return { swaggerPaths, swaggerDefs };
};

export const appendSwagPaths = (type, name, swaggerPaths) => {
    if (type === REQUEST_TYPES.create && name === 'orders') {
        return;
    }
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
    // modify model schema properties here
    if (modelSchema.properties.purchasedProducts) {
        modelSchema.properties.purchasedProducts = {
            $ref: '#/definitions/products'
        };
    }
    swaggerDefs[name] = {
        type: 'object',
        ...modelSchema,
        title: undefined
    };
};
