'use strict'
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AuthVerified = require('../middleware/AuthVerified');

dotenv.config({
    path: '../../config/config.env'
})




/**
 * Method: POST
 * Action :Signup
 */


router.post('/signup', async (req, res, next) => {
    const { name, email, phone, password, conformPassword } = req.body;
    try {
        const existUser = await User.findOne({
            email: email.toLowerCase(),

        });

        if (existUser) {
            return res.status(302).json({
                success: true,
                message: "user already exists"

            })
        }

        else {
            var isMatchPassword = (password === conformPassword);
            if (!isMatchPassword) {
                return res.status(402).json({
                    success: true,
                    error: 'password does not match'
                });
            }
            else {
                bcryptjs.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(404).json({
                            success: true,
                            msg: err.message
                        })
                    }

                    let newUser = new User({
                        _id: new mongoose.Types.ObjectId,
                        name: name.toLowerCase(),
                        email: email.toLowerCase(),
                        phone: phone,
                        password: hash,

                    });
                    // console.log("new user", newUser);

                    newUser.save()
                        .then((result) => {
                            res.status(201).json({
                                success: true,
                                msg: "User Register Successfully",
                                data: result
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                msg: "User Register Failed!"
                            })
                        });
                });
            }
        }

    } catch (error) {
        res.json(500).json({
            success: false,
            msg: "Server Failed"
        });
        next(error);
    }
});




/**
 * Method: POST
 * Action :Signin
 */



router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (password == null) {
            return res.status(404).json({
                success: false,
                msg: "Please Provide Password!!"
            });
        }
        const existUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (!existUser) {
            return res.status(402).json({
                success: true,
                message: "No User Exist!!"

            });
        }
        else {
            bcryptjs.compare(req.body.password, existUser.password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        msg: "Server Error"
                    });

                }
                if (result) {
                    // create Token
                    const payload = {
                        existUser: {
                            id: existUser._id,
                            name: existUser.name,
                            email: existUser.email,
                            phone: existUser.phone,
                        }
                    };
                    jwt.sign(payload, process.env.JWTTOKENKEY, {
                        expiresIn: '24h'
                    }, (err, token) => {
                        if (err) {
                            res.status(404).json({
                                success: false,
                                error: "Anuthorized Person"
                            });
                        }
                        existUser.token = token;
                        res.status(200).json({
                            success: true,
                            message: "Login Successfully !!",
                            userId: existUser._id,
                            token: token
                        })

                    })

                } else {
                    return res.status(404).json({ success: false, message: 'passwords do not match' });
                }

            });
        }
    }
    catch (err) {
        res.json(500).json({
            success: false,
            msg: "Server Failed"
        })
    }
});



/**
 * Method: GET
 * Action: Fetch All Data
 * Function : Admin can get all User information
 */


router.get('/get', AuthVerified, async (req, res, next) => {
    try {
        const allUser = await User.find().select('-password');

        const len = allUser.length;
        if (!allUser) {
            return res.status(404).json({
                success: false,
                msg: "No Data Exist In Database"
            })
        };

        res.status(200).json({
            sucess: true,

            msg: "Users Data Successfully Found",
            length: 'Total User in database ' + len,
            Data: allUser
        });
    } catch (error) {
        console.log("Server or Database Error");
        res.status(404).json({
            success: false,
            error: "Error in User get api"
        });
        next(error);
    }
});


/**
 * Method : GET
 * Action: Fetch All Data
 * Function : Admin can get single User information
 */

router.get('/getemail', AuthVerified, async (req, res, next) => {
    const { email } = req.body;
    try {
        let existUser = await User.findOne({
            email: email.toLowerCase()
        }).select('-password');
        if (!existUser) {
            return res.status(401).json({
                success: true,
                msg: 'Unauthorize Email Please Register First'
            });
        }
        res.status(200).json({
            success: true,
            msg: "User Found Successfully",
            data: existUser
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            error: "Error in User get api"
        });
        next(error);
    }
});



module.exports = router; 