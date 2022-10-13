const express = require('express');
const Router = express.Router();
const JWT = require('jsonwebtoken');
const Clients = require("../../db/models/clients");
const OrdersRouter = require("./orders");
const MoviesRouter = require("./movies");
const notificationsRouter = require("./notifications");
const {CookieValidation, loginValidation} = require("../../middlewares/authentication");


// Home route
Router.post('/login', loginValidation, async function(req, res) {
    try {
        const username = req.body.username
        const email = req.body.email
        let payload = {
            username: username,
        }
        let token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
        const ClientUpdated = await Clients.findOneAndUpdate({
            $or: [{ username: username }, { email: email }]
        }, { sessionKey: token }, {})
        console.log(`[SUCCESS] Authenticated client: ${username || email}`)
        res.cookie('authorization', token);
        res.send({ auth: true, token: token, usesrId: ClientUpdated.userId })
    } catch (err) {
        console.log(`Error updating user session key: ${err}`)
        res.sendStatus(500)
    }
})

// About route
Router.get('/logout', CookieValidation, async function(req, res) {
    await Clients.findOneAndUpdate({ userId: res.userId }, { sessionKey: '' }, {})
    console.log(`Signed user out, userID:  ${res.userId}`)
    res.send();
})


router.use('/user', userRouter)


router.use('/reservations', reservationsRouter)


router.use('/hotels', hotelsRouter)


router.use('/notifications', notificationsRouter)

module.exports = Router;









