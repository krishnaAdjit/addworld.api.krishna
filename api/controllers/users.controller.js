const User = require('../models/users.model')
const Store = require('../models/store')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

exports.userRegister = async (req, res) => {
    try {
        var { username, email, password } = req.body;
        if (!email) {
            return res.status(200).json({ msg: "Enter email ", status: false });
        } else {
            var user = await User.find({ email: email })
            if (user.length === 0) {
                let hashedPass = await bcrypt.hash(password, 10);
                var newuser = await new User({
                    username: username,
                    email: email,
                    password: hashedPass,
                })
                await newuser.save();

                res.status(201).json({ status: true, msg: "Registration complete", data: newuser });
            } else {
                return res.status(200).json({ msg: "Email id is already registered", status: false });
            }
        }

    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

exports.userLogin = async (req, res) => {
    try {
        var { email, password } = req.body
        if (!email || !password) {
            return res.status(200).json({ msg: "Enter email and password", status: false });
        } else {
            var userdb = await User.find({ email: email })
            if (userdb.length > 0) {
                let user = { ...userdb[0]._doc };
                let cmp_pass = await bcrypt.compare(password, user.password);
                if (!cmp_pass) {
                    return res.status(200).json({ msg: "Password did not match.", status: false });
                } else {
                    return res.status(200).json({ msg: "Login Successfull.", status: true, data: user[0] });
                }
            } else {
                return res.status(200).json({ msg: "Email does not registered", status: false });
            }
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}
/************************************************************************************************************************** */



exports.sendUserMailOtp = async (req, res) => {
    try {
        var { email } = req.body
        if (!email) {
            return res.status(200).json({ msg: "Enter email ", status: false });
        } else {
            var otp = random(4);
            var userdb = await User.find({ email: email })
            if (userdb.length === 0) {
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
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(200).json({ msg: error, status: false })
                    } else {
                        console.log('Email sent: ' + info.response);
                        User.updateOne({ _id: userdb[0].id }, {
                            $set: {
                                otp: otp
                            }
                        }).then(() => {
                            res.status(200).json({ msg: "otp sent", data: userdb[0].id, tatus: true });
                        })
                    }
                })
            }
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

exports.verifyUserOtp = async (req, res) => {
    try {
        var { otp, user_id } = req.body
        if (!otp) {
            return res.status(200).json({ msg: "Enter otp", status: false });
        } else {
            var userdb = await User.find({ _id: user_id })
            if (!userdb) {
                res.status(200).json({ msg: "User not found " + err, status: false });
            } else {
                if (otp == userdb[0].otp) {
                    User.updateOne({ _id: user_id }, {
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

exports.changeUserPassword = async (req, res) => {
    try {
        var { user_id, password } = req.body
        if (!user_id || !password) {
            return res.status(200).json({ msg: "Enter store_id and password", status: false });
        } else {
            var userdb = await User.findById(user_id)
            if (!userdb) {
                return res.status(200).json({ msg: "Enter email and password", status: false });
            } else {
                let hashedPass = await bcrypt.hash(password, 10);
                User.updateOne({ _id: user_id }, {
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

exports.searchStoreByCategory = async (req, res) => {
    try {
        var category = req.params.category
        var store = await Store.find({
            category: category
        }, { password: 0 })
        if (store.length == 0) {
            return res.status(200).json({ msg: "No stores found with this category", data: store, status: true });
        } else {
            return res.status(200).json({ msg: `stores of ${category}`, data: store, status: true });
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}

exports.searchStore = async (req, res) => {
    try {
        var keyword = req.params.searchKey
        var storesdb = await Store.aggregate([{
            $match: {
                $or:[
                {store_name: { $regex: keyword,$options:'i'}},
                { street_address: { $regex:keyword,$options:'i'}},
                { city: { $regex:keyword,$options:'i'}}
            ]
            }
        }, {
            $project: {
                "_id": 1, "email": 1, "banner_image": 1, "store_name": 1, "street_address": 1,
                "state": 1, "zip": 1, "city": 1, "country": 1, "phone": 1, "watsapp": 1, "slogan": 1,
                "website_url": 1, "founded": 1, "gallery": 1
            }
        }])
        if (storesdb.length > 0) {
            return res.status(200).json({ msg: "Stores data", data: storesdb, status: true });
        } else {
            return res.status(200).json({ msg: "No stores found", data: storesdb, status: true });
        }
    } catch (err) {
        return res.status(200).json({ msg: "Error occured, " + err, status: false });
    }
}