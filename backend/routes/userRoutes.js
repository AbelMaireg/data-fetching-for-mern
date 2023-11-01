const express = require('express');
const router = express.Router();
const { userSchema, userSignInSchema } = require('../models/user.js');
const { questionSchema } = require('../models/question.js');

const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect().then(() => console.log('connection established')).catch((err) => console.error(err));

const Joi = require('joi');
const crypt = require('bcryptjs');

router.post('/signup', (req, res) => {
    let p1 = new Promise((resolve, reject) => {
        const { error } = userSchema.validate(req.body);
        if (error) reject(`ERROR: ${error}`);
        else resolve(req.body);
    });

    function validateUsername(obj) {
        return new Promise(async (resolve, reject) => {
            try {
                const indbuser = await client
                    .db('db1')
                    .collection('user')
                    .aggregate([
                        {
                            '$match': {
                                'username': obj.username
                            }
                        },
                        {
                            '$project': {
                                'username': 1
                            }
                        }
                    ])
                    .toArray();

                if (indbuser.length !== 0) {
                    reject(`ERROR: the username is unavailable`);
                } else {
                    console.log(indbuser);
                    resolve(obj);
                }
            } catch (e) {
                console.error(e);
                reject(`ERROR: unable to fetch data from the database`);
            }
        });
    }


    function encryptpassword(obj) {
        return new Promise(async (resolve, reject) => {
            crypt.genSalt(10, (err, salt) => {
                crypt.hash(obj.password, salt, (err, hash) => {
                    if (err) reject(`ERROR: unable to encrypt password`);
                    else resolve({ ...obj, password: hash })
                })
            })
        })
    };

    function storedata(obj) {
        return new Promise(async (resolve, reject) => {
            let datetime = new Date();
            try {
                await client.db('db1').collection('user').insertOne({
                    username: obj.username,
                    phone: obj.phone,
                    level: 0,
                    password: obj.password,
                    created_at: datetime.toISOString()
                });
                resolve(obj);
            } catch (e) {
                console.error(e);
                reject('unable to insert data')
            }
        })
    };

    function final(obj) {
        console.log(obj)
        res.send('done');
    }

    p1.then((obj) => validateUsername(obj))
        .then((obj) => encryptpassword(obj))
        .then((obj) => storedata(obj))
        .then((obj) => final(obj))
        .catch(err => res.send(err));
});

router.get('/signin', (req, res) => {
    let p1 = new Promise((resolve, reject) => {
        const { error } = userSignInSchema.validate(req.body);
        if (error) reject(`ERROR: invalid email or password`);
        else resolve(req.body);
    });

    function fetchdatafromdb(obj) {
        return new Promise(async (resolve, reject) => {
            try {
                let doc = await client.db('db1').collection('user').find({ username: obj.username }).toArray();
                if (doc.length != 0) resolve({ user: doc[0], req: obj });
                else reject(`ERROR: invalid username`);
            } catch (e) {
                console.error(e);
                reject(`ERROR: unable to fetch data from database`);
            }
        })
    }

    function check(obj) {
        return new Promise(async (resolve, reject) => {
            crypt.compare(obj.req.password, obj.user.password, (err, res) => {
                if (err) reject('ERROR: invalid password');
                else resolve(obj);
            })
        })
    }

    function resp(obj) {
        res.send(obj.user);
    }

    p1.then((obj) => fetchdatafromdb(obj))
        .then((obj) => check(obj))
        .then((obj) => resp(obj))
        .catch(err => res.send(err));
});

router.delete('/delete', (req, res) => {
    let p1 = new Promise((resolve, reject) => {
        let { error } = userSignInSchema.validate(req.body);
        if (error) reject(`ERROR: ${error.details}`);
        else resolve(req.body);
    })

    function fetchdatafromdb(obj) {
        return new Promise(async (resolve, reject) => {
            try {
                let doc = await client.db('db1').collection('user').find({ username: obj.username }).toArray();
                if (doc.length != 0) resolve({ user: doc[0], req: obj });
                else reject(`ERROR: invalid username`);
            } catch (e) {
                console.error(e);
                reject(`ERROR: unable to fetch data from database`);
            }
        })
    }

    function check(obj) {
        return new Promise(async (resolve, reject) => {
            crypt.compare(obj.req.password, obj.user.password, (err, res) => {
                if (err) reject('ERROR: invalid password');
                else resolve(obj);
            })
        })
    }

    function deletion(obj) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await client.db('db1').collection('user').deleteOne({ username: obj.user.username });
                resolve(result);
            } catch (e) {
                console.log(e);
                reject(`ERROR: unable to delete user details`);
            }
        })
    }

    function resp(result) {
        console.log(result);
        res.send(result);
    }

    p1.then((obj) => fetchdatafromdb(obj))
        .then((obj) => check(obj))
        .then((obj) => deletion(obj))
        .then((obj) => resp(obj))
        .catch(err => res.status(400).send(err));
});

module.exports = router;