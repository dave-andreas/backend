const jwt = require ('jsonwebtoken');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, "pulomas", { expiresIn : '2h' })
    },
    createJWTTokenemail(payload){
        return jwt.sign(payload, "pulomas", { expiresIn : '120000' })
    },
}