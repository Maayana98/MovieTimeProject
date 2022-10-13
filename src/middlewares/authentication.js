const JWT = require("jsonwebtoken");
const Clients = require("../db/models/clients");

const CookieValidation = async (req,res,next) => {
    try{
        const token = req.cookies.authorization
        if(token == null)
            return res.sendStatus(401);
        JWT.verify(token ,process.env.JWT_SECRET.toString() , {} , (err) => {
            if(err) {
                console.log(`[FAIL] Token failure ${err.message}`);
                return res.sendStatus(403);
            }
            Clients.findOne({ sessionKey: req.cookies.authorization }, function(err, user) {
                if (err) {
                    console.log(`[FAIL] Client not found, ${err}`)
                    res.sendStatus(401)
                } else {
                    if (user) {
                        res.auth = true
                        res.userId = user.userId
                        next();
                    } else {
                        console.log(`[FAIL] No Client matched with the token: ${token}`)
                        res.sendStatus(401)
                    }
                }
            })
        })
    } catch (err) {
        console.log(`[FAIL] Client authentication failure, ${err}`)
        res.sendStatus(401)
    }
};

const loginValidation = async(req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const email = req.body.email
        if ((username || email) && password) {
            const client = await Clients.findOne({ $or: [{ username: username, password: password }, { email: email, password: password }] }).exec()
            if (client !== null) {
                console.log(`[SUCCESS] Authenticating login credentials for client: ${username || email}`)
                next();
            } else {
                console.log('Client not found')
                res.status(401).json("Client not found")
            }
        } else {
            console.log(`[FAIL] Wrong login information provided`)
            res.sendStatus(401)
        }
    } catch (err) {
        console.log(`[FAIL] Error parsing login request ${err}`);
        res.sendStatus(400)
    }
}

module.exports = { CookieValidation, loginValidation };