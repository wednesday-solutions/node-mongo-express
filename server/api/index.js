import fs from 'fs';
import { mongoConnector } from '@middlewares/mongo';
mongoConnector();
export default app => {
    const path = `${__dirname}/`;
    const foldersArray = fs
        .readdirSync(__dirname)
        .filter(file => !fs.lstatSync(path + file).isFile());
    foldersArray.forEach(f => {
        const o = require(`./${f}`);
        o.default(app);
    });
};
