'use strict'
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const bcryptjs = require('bcryptjs');
const adminUser = require('../models/adminUser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config({
    path: '../../config/config.env'
})




/**
 * Method: POST
 * Action :Signup
 */


//Signup By adminUser

router.post('/signup', async (req, res, next) => {
    const { firstName, lastName, email, phone, password, conformPassword, role, gender } = req.body;
    try {
        const existadminUser = await adminUser.findOne({
            email: email.toLowerCase(),

        });

        if (existadminUser) {
            return res.status(302).json({
                success: true,
                message: "adminUser already exists"

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

                    let newadminUser = new adminUser({
                        _id: new mongoose.Types.ObjectId,
                        firstName: firstName.toLowerCase(),
                        lastName: lastName.toLowerCase(),
                        email: email.toLowerCase(),
                        phone: phone,
                        password: hash,
                        role: role,
                        gender: gender.toLowerCase()
                    });
                    // console.log("new adminUser", newadminUser);

                    newadminUser.save()
                        .then((result) => {
                            res.status(201).json({
                                success: true,
                                msg: "adminUser Register Successfully",
                                data: result
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                success: false,
                                msg: "adminUser Register Failed!"
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

// Login By adminUser

router.post('/signin', async (req, res, next) => {
    const { firstName, lastName, email, phone, password, role, gender } = req.body;
    const name = firstName + ' ' + lastName;
    const smallEmail = email.toLowerCase();
    try {
        if (password == null) {
            return res.status(404).json({
                success: false,
                msg: "Please Provide Password!!"
            });
        }
        const existadminUser = await adminUser.findOne({
            email: smallEmail
            // 
        });

        if (!existadminUser) {
            return res.status(402).json({
                success: true,
                message: "No adminUser Exist!!"

            });
        }
        else {
            bcryptjs.compare(req.body.password, existadminUser.password, (err, result) => {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        msg: "Server Error"
                    });

                }
                if (result) {
                    // create Token
                    const payload = {
                        existadminUser: {
                            id: existadminUser._id,
                            name: `${existadminUser.firstName} ${existadminUser.lastName}`,
                            email: existadminUser.email,
                            phone: existadminUser.phone,
                            role: existadminUser.role,
                            gender: existadminUser.gender,

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
                        existadminUser.token = token;
                        res.status(200).json({
                            success: true,
                            message: "Login Successfully !!",
                            adminUserId: existadminUser._id,
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






module.exports = router;