
const psw = require("../lib/pswutil");
const User = require("../models/Users");
const Verify = async function(EmailUser , password , done){
    try {
        const data = await User.findOne({email:EmailUser});
        if (!data) {
            return done(null, false);
        }
        
        const isValidPassword = psw.IsValid;
        if (isValidPassword) {
            return done(null,data);
           
        } else {
            
            return done(null, false);
        }
    } catch (error) {
        console.error(error);
        return done(error);
    }
};



module.exports = Verify;
