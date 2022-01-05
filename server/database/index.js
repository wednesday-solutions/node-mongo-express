import db from './models';
import endpoints from './endpoints';

module.exports = app => {
  endpoints(app);
};
