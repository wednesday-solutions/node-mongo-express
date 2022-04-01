export const isTestEnv = () =>
    process.env.ENVIRONMENT_NAME === 'test' || process.env.NODE_ENV === 'test';
