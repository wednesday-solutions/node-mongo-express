import http from 'http';
import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import cors from 'cors';
import bodyParser from 'body-parser';
import { apiSuccess } from 'utils/apiUtils';
import apis from 'api';
import { list } from 'utils/routeLister';
import log from 'utils/logger';
import { isTestEnv } from 'utils';
import { initQueues } from 'utils/queue';
import { injectRequestId } from 'middlewares/injectRequestId';
import { middleware as contextMiddleware } from 'express-http-context';

/**
 * Create express server
 */

const app = express();
app.use(responseTime());
app.set('port', process.env.PORT || 9000);
app.use(helmet());
app.use(cors());
app.use(injectRequestId());

app.use(express.json());
// get information from html forms
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// used for getting and setting request-scoped context anywhere
app.use(contextMiddleware);

// setup database
apis(app);
/* istanbul ignore next */
if (!isTestEnv()) {
    initQueues();
}

app.get('/', (req, res) => {
    apiSuccess(res, 'node-express-mongo server at your service🖖');
});
list(app);

if (process.env.NODE_ENV !== 'test') {
    const server = http.createServer(app);
    server.listen(app.get('port'), () => {
        log.info('Server is running at port %s', app.get('port'));
    });
}

export default app;
