import user from './user';
import post from './post';

module.exports = app => {
    user(app);
    post(app);
};
