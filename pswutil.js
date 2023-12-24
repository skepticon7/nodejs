const bcrypt = require("bcrypt");
const validpsw = async function(password , Hashedpassword){
    result = await bcrypt.compare(password , Hashedpassword);
    return result;
}

const genpsw = async function(password){
    psw = await bcrypt.hash(password , 10);
    return psw;
}

module.exports = {
    Generatepsw:genpsw,
    IsValid:validpsw
};