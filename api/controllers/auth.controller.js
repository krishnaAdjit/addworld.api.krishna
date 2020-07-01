const Profile = require('../models/store')
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
exports.register = async(req, res) => {
    try {
        var { name, email, password } = req.body;
        if (!email) {
            return res.status(200).json({ msg: "Enter email ", status: false });
        } else {
            var profile = await Profile.find({ email: email })
            if (profile.length === 0) {
                let hashedPass = await bcrypt.hash(password, 10);
                var newprofile = await new Profile({
                    name: name,
                    email: email,
                    password: hashedPass,
                })
                await newprofile.save();

                res.status(201).json({ status: true, msg: "Registration complete", data: newprofile });
            } else {
                return res.status(200).json({ msg: "Email id is already registered", status: false });
            }
        }

    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

exports.login = async(req, res) => {
    try {
        var { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({ msg: "Enter email and password", status: false });
        } else {
            var profile = await Profile.find({ email: email })
            if (profile.length === 0) {
                return res.status(200).json({ msg: "Email does not registered", status: false });
            } else {
                const user = {...profile[0]._doc };
                const cmp_pass = await bcrypt.compare(password, user.password);
                if (!cmp_pass) {
                    return res.status(200).json({ msg: "Password did not match.", status: false });
                } else {
                    return res.status(200).json({ msg: "Login Successfull.", status: true, data: profile[0] });
                }
            }
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

exports.sendMailOtp = async(req, res) => {
    try {
        var { email } = req.body
        if (!email) {
            return res.status(200).json({ msg: "Enter email ", status: false });
        } else {
            var otp = random(4);
            var profile = await Profile.find({ email: email })
            if (profile.length === 0) {
                return res.status(200).json({ msg: "Email does not registered", status: false });
            } else {

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'fouronezeronine@gmail.com',
                        pass: 'Krishna@sha256'
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                });
                var mailOptions = await {
                    to: email,
                    subject: 'Otp from Add World',
                    html: `<html><body><p>Hello user your otp is</p><br><h3>` + otp + `</h3></body></html>`
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        return res.status(200).json({ msg: error, status: false })
                    } else {
                        console.log('Email sent: ' + info.response);
                        Profile.updateOne({ _id: profile[0].id }, {
                            $set: {
                                otp: otp
                            }
                        }).then(() => {
                            res.status(200).json({ msg: "otp sent", data: profile[0].id, tatus: true });
                        })
                    }
                })
            }
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

exports.verifyOtp = async(req, res) => {
    try {
        var { otp, store_id } = req.body
        if (!otp) {
            return res.status(200).json({ msg: "Enter otp", status: false });
        } else {
            var profile = await Profile.find({ _id: store_id })
            if (!profile) {
                res.status(200).json({ msg: "User not found " + err, status: false });
            } else {
                if (otp == profile[0].otp) {
                    Profile.updateOne({ _id: store_id }, {
                        $set: {
                            otp: null
                        }
                    }).then(() => {
                        res.status(200).json({ msg: "Otp verified", status: true });
                    })
                } else {
                    return res.status(200).json({ msg: "Otp not verified", status: false });
                }
            }
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

function random(length) {
    var result = '';
    let characters = '1234567890';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.changePassword = async(req, res) => {
    try {
        var { store_id, password } = req.body
        if (!store_id || !password) {
            return res.status(200).json({ msg: "Enter store_id and password", status: false });
        } else {
            var profile = await Profile.findById(store_id)
            if (!profile) {
                return res.status(200).json({ msg: "Enter email and password", status: false });
            } else {
                let hashedPass = await bcrypt.hash(password, 10);
                Profile.updateOne({ _id: store_id }, {
                    $set: {
                        password: hashedPass
                    }
                }).then(() => {
                    res.status(200).json({ msg: "Password updated.", status: true });
                })
            }
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}