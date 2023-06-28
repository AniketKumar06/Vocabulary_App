const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({
    path: '../../config/config.env'
});


module.exports = async (req, res, next) => {
    try {

        const userToken = req.headers.authorization.split(' ')[1];
        // console.log(userToken);
        if (!userToken) {
            return res.status(404).json({
                msg: "No token,authorization denied"
            });
        }
        // let decoded;
        const verify = await jwt.verify(userToken, process.env.JWTTOKENKEY);
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: "Something Getting in Token"
        })
    }

}