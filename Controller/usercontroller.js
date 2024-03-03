// Import necessary modules
const { Sequelize, DataTypes, Op } = require('sequelize');
const User = require('../models/UserModel');
const crypto = require("crypto");
const flash = require('express-flash');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'avikasaxena1923@gmail.com',
        pass: 'ozgj qrjy vhwe nwkh'
    }
});

async function sendPasswordResetEmail(email, token) {
    try {
        await transporter.sendMail({
            from: 'avikasaxena1923@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `http://localhost:5000/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}
// Define controller methods
const UserController = {
    async createUser(req, res) {
        try {
            const { username, email, password, role } = req.body;

            var useremail = await User.findOne({ where: { email: email } });
            if (useremail) {
                req.flash("error", "Email already exist");
                return res.redirect('/userregister');
            }

            const newuser = await User.create({
                username,
                email,
                password,
                role
            });
            res.redirect("/userlogin");
        } catch (error) {
            console.log("error found ,error", error);
        }

    },

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email: email } });
            if (user) {
                const isPasswordValid = (password == user.password);
                if (isPasswordValid) {
                    req.session.isAuthenticated = true;
                    req.session.email = user.email;
                    req.session.username = user.username;
                    req.session.role = user.role;
                    user.last_login = new Date();
                    await user.save();
                    res.redirect('/profile');
                } else {
                    req.session.isAuthenticated = false;
                    req.flash("error", "Incorrect password or email")
                    res.redirect("/userlogin");
                }
            }
        } catch (error) {
            console.log("error : ", error);
        }
    },

    async updateUser(req, res) {
        try {
            // Assuming you have already authenticated the user and obtained their username and email
            const { username, email } = req.session;
            const { newusername, newemail } = req.body;
            const user = await User.findOne({ where: { username, email } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (newusername) {
                user.username = newusername;
                await user.save();
            }

            if (newemail) {
                user.email = newemail;
                await user.save();
            }

            req.session.username = user.username;
            req.session.email = user.email;

            res.redirect("/profile");
        } catch (error) {
            console.log('Error updating username:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteaccount(req, res) {
        try {
            const { username, email } = req.session;
            const user = await User.findOne({ where: { username, email } });
            await user.destroy();
            res.redirect("/thankyou");
        } catch (err) {
            console.log("error : ", err);
        }
    },

    async forgotpassword(req, res) {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        await sendPasswordResetEmail(email, token);
        res.redirect("/linksent");

    },

    async passwordreset(req, res) {
        const { changepassword, confirmpassword } = req.body;

        // Find user by reset token
        const user = await User.findOne({
            where: {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    [Op.gt]: Date.now()
                }
            }
        });
        if (!user) {
            return res.status(400).send('expired reset token');
        }

        // Reset password
        if (changepassword === confirmpassword) {
            user.password = changepassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
        } else
            res.send("wrong password");

        res.redirect('/userlogin');

    }
}

module.exports = UserController;