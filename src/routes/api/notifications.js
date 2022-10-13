const {CookieValidation} = require("../../middlewares/authentication");
const express = require('express');
const Router = express.Router();

Router.put('/', webCookieValidator, async function (req, res) {

})

module.exports = Router;