import request from 'supertest';
import app from '../server';
import { should, expect } from 'chai';
import mongoose from 'mongoose';
import mdb from '../server/database/models';

let db;
// let mongo_uri = 'mongodb://localhost:27017/testDB';
// const Mockgoose = require('mockgoose').Mockgoose;
// const mockgoose = new Mockgoose(mongoose);
describe('User', () => {
    it('create user', async done => {
        const res = await request(app)
            .post('/create')
            .send({
                name: 'Almera',
                password: 'almera',
                email: 'almera@example.com'
            })
            .then(res => {
                const body = res.body;
                console.log('body: ', body);
            });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name', 'Almera');
    });
});

// describe('User', async () => {
//   before(async done => {
//     console.log('before');

//     mongoose.connect('mongodb://localhost:27017/testDB', { useCreateIndex: true, useNewUrlParser: true });
//     db = mongoose.connection;
//     db.once('open', () => {
//       log.info('mongo connection successfully connected');
//       done();
//     });
//     // done();
//   });

//   after(done => {
//     console.log('after');
//     mongoose.connection.close();
//     done();
//   });

//   beforeEach(done => {
//     console.log('beforeEach');
//     let user = new mdb.User({
//       name: 'Almera',
//       password: 'almera',
//       email: 'almera@example.com',
//     });

//     console.log('user: ', user);

//     // user.save(err => {
//     //   if (err) console.log('error: ', err.message);
//     //   else console.log('no error');
//     //   done();
//     // });
//     user.save()
//       .then(() => done());
//   });

//   it('find user by username', done => {
//     console.log('it');
//     mdb.User.findOne({ name: 'Almera' }, (err, user) => {
//       user.name.should.equal('Almera');
//       user.password.should.equal('almera');
//       user.email.should.equal('almera@example.com');
//       console.log('username: ', user.name);
//       done();
//     });
//   });

//   afterEach(done => {
//     console.log('afterEach');
//     mdb.User.deleteOne({ name: 'Almera' }, () => done());
//   });
// });
