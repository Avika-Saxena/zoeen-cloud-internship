var express = require('express');
var router = express.Router();
const { Sequelize, DataTypes, Op } = require('sequelize');
var sequelize = new Sequelize("mysql://root:radharamanlal@localhost:3306");
var UserController = require('../Controller/usercontroller');
var UserModel = require("../models/UserModel");
var session = require('express-session');
const { userInfo } = require('os');

//DataBase creation

(async function createDatabase() {
    try {
        await sequelize.query("CREATE DATABASE IF NOT EXISTS EcommerceDB;");
        console.log("Database created successfully");
    } catch (error) {
        console.error("Error encountered", error);
    }
})();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/*User register page */

router.get('/userregister', function(req, res) {
    res.render("userregister");
});

// Handle form submission
router.post('/createUser', UserController.createUser);

/*User Login page */

router.get('/userlogin', function(req, res) {
    res.render("userlogin");
});

router.post('/loginuser', UserController.loginUser);

router.get('/profile', isAuthenticated, function(req, res, next) {
    const username = req.session.username;
    const role = req.session.role;
    res.render('profile', { username: username, role: role });
});

router.post('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/userlogin');
});


function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect('/userlogin');
}

router.get('/editprofile', function(req, res) {
    const username = req.session.username;
    const email = req.session.email;
    res.render("editprofile", { username: username, email: email });
});

router.post('/update', UserController.updateUser);
router.post('/delete', UserController.deleteaccount);

router.get('/thankyou', function(req, res) {
    const username = req.session.username;
    res.render("thankyou", { username: username });
});

router.get('/forgotpassword', function(req, res) {
    res.render("forgotpassword");
});

router.get("/reset/:token", function(req, res) {
    const token = req.params.token;
    res.render("reset", { token });
});

router.get("/linksent", function(req, res) {
    res.render("linksent");
})

router.post("/resetpassword", UserController.forgotpassword);
router.post("/changepassword/:token", UserController.passwordreset);
module.exports = router;