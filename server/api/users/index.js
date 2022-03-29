import { generateCreateUserRequest } from 'api/requestGenerators';

export const createUser = (app, model, validator) => {
    generateCreateUserRequest(app, model, validator);
};
