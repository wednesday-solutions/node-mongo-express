import CircuitBreaker from 'opossum';
import log from 'utils/logger';

const options = {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
};

export const newCircuitBreaker = (func, fallbackMsg) => {
    const breaker = new CircuitBreaker(func, options);
    breaker.fallback((params, err) => {
        log.error(
            'fallbackMsg:',
            fallbackMsg,
            'params: ',
            params,
            'error:',
            err.message
        );
        return `${fallbackMsg}. ${err.message || err}`;
    });
    return breaker;
};
