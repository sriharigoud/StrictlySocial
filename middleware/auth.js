const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({msg: "No token, Unauthorize access"});
    }

    try {
       const decoded = jwt.verify(token, config.get('jwtsecret')); 
       req.user = decoded.user;
       next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({msg: "Unauthorize access"});
    }

}