export const isLocalEnv = () => process.env.ENVIRONMENT_NAME === 'local';
export const isTestEnv = () => process.env.ENVIRONMENT_NAME === 'test';
