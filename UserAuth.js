const User = require("../models/Users");

const UserAuth = async function(user, userID ){
    try {

        const data_id = await User.findOne({username:user});
        if(data_id._id){
            if(data_id._id.toString()===userID){
                return true;
            }
        }
        return false ;
    } catch (error) {
        console.log(error);
    }
}

module.exports=UserAuth;