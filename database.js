
const MongoStore = require("connect-mongo");

const MongoLink = "mongodb://127.0.0.1:27017/cookiesDB";
const MongoConURL = "mongodb://127.0.0.1:27017/SessionDB";
const sessionStore = MongoStore.create({
    mongoUrl:MongoConURL,
    collectionName:"sessions",
    
});

module.exports={
    MongoURL:MongoLink,
    sessionStore:sessionStore
};

