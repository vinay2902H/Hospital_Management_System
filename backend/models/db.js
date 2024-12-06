const mongooes = require('mongooes')
const mongo_url=process.env.mongo_con;

mongooes.connect(mongo_url)
.then(() => {
   console.log("mongooes connected") 
}).catch((err) => {
    console.log("not connected")
});