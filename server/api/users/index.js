import { generateCreateUserRequest } from 'api/requestGenerators';

export const createUser = (router, model, validator) => {
    generateCreateUserRequest({ router, model, validator });
};
