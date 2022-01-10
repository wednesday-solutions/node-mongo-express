import express from 'express';
import User from '../models/User';
import Post from '../models/Post';

module.exports = app => {
    const router = express.Router();

    router.post('/create', (req, res) => {
        const account = new User(req.body);
        account
            .save()
            .then(res2 => {
                log.info('user insert successfully!');
                res.status(200).send(res2);
            })
            .catch(err => res.send(err));
    });

    router.get('/query', (req, res, next) => {
        User.find((err, users) => {
            if (err) next(err);

            res.status(200).send(users);
        });
    });

    router.get('/query/:_id', (req, res, next) => {
        const { _id } = req.params;
        const query = req.query;

        Post.find({ userId: _id })
            .skip(query.post_skip)
            .limit(query.post_limit)
            .then(async posts => {
                const user = await User.findById(_id);

                user.posts = posts;
                const u = { ...user._doc, posts };
                res.status(200).send(u);
            });
    });

    router.put('/update/:_id', (req, res, next) => {
        const { _id } = req.params;
        const updateData = req.body;

        User.updateOne({ _id }, updateData, (err, user) => {
            if (err) res.send(err);

            res.status(200).send(user);
        });
    });

    router.delete('/delete/:_id', (req, res, next) => {
        const { _id } = req.params;

        User.deleteOne({ _id }, (err, user) => {
            if (err) res.send(err);

            res.status(200).send(user);
        });
    });

    app.use('/user', router);
};
