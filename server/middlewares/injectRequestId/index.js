import { v4 as uuid } from 'uuid';
import log from 'utils/logger';

function RequestIdInjectedLogger(options, requestId) {
    this.log = options.log.child({ requestId });
}

export const injectRequestId = () => (_request, _response, next) => {
    const requestId = uuid();
    const logger = new RequestIdInjectedLogger({ log }, requestId);
    global.log = logger.log;
    next();
};
