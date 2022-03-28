import {
    generateCreateUserRequest,
    generateCreateRoleRequest
} from 'api/requestGenerators';

export const createUser = (app, model, validator) => {
    generateCreateUserRequest(app, model, validator);
};

export const createUserRole = (app, model, validator) => {
    generateCreateRoleRequest(app, model, validator);
};
// export const createLoginRequest = (app, model, validator) => {
//     generateUserLoginRequest(app, model, validator);
// };
