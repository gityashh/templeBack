const express = require('express');
const router = express.Router();
const cors = require('cors')
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const isLoggedIn = require('../middlewares/isLoggedIn');


router.get('/',isLoggedIn,async (req,res)=>{
    const email = req.user.email
    let user = await userModel.findOne({ email: email });
    res.json({user:user});
})

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user) return res.json("Sorry you already have account, please login.");

        if (process.env.JWT_SECRET) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    let createduser = await userModel.create({
                        email,
                        password: hash,
                    });

                    let token = jwt.sign(
                        { email, id: createduser._id },
                        process.env.JWT_SECRET
                    );

                    res.cookie("token", token);
                    res.send("login");
                });
            });
        } else {
            res.json("you forgot the env variables");
        }
    } catch (err) {
        res.send(err.message);
    }
})

router.post('/adminsign', async (req, res) => {
    try {
        const { email, password, isAdmin} = req.body;

        let user = await userModel.findOne({ email });
        if (user) return res.json("Sorry you already have account, please login.");

        if (process.env.JWT_SECRET) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    let createduser = await userModel.create({
                        email,
                        isAdmin,
                        password: hash,
                    });

                    let token = jwt.sign(
                        { email, id: createduser._id },
                        process.env.JWT_SECRET
                    );
                    res.json(token);
                });
            });
        } else {
            res.json("you forgot the env variables");
        }
    } catch (err) {
        res.send(err.message);
    }
})

router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (!user) return res.send("email or password did not match");

        if (process.env.JWT_SECRET) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET);
                    res.cookie("token", token);
                    res.json("login");
                } else {
                    res.json("koi gadbad");
                }
            });
        } else {
            res.json("you dnt have env variables setup");
        }
    } catch (err) {
        res.json(err.message);
    }

});

router.post('/logout', (req, res) => {
    res.clearCookie('token'); // or however you manage your auth tokens
    res.status(200).send('Logged out');
});
  

module.exports = router;