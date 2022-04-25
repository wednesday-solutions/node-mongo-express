import { v4 as uuid } from 'uuid';
import log from 'utils/logger';

function InjectRequestId(options, requestId) {
    this.log = options.log.child({ requestId });
}

const injectRequestId = () => (_request, _response, next) => {
    const requestId = uuid();
    const requestLogger = new InjectRequestId({ log }, requestId);
    global.log = requestLogger.log;
    next();
};

module.exports = injectRequestId;
