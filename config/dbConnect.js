const {default:mongoose} = require("mongoose")

 const dbConnect = ()=>{
    const mongo_url = process.env.MONGOBD_URL

    console.log('====================================');
    console.log({mongo_url});
    console.log('====================================');
    try {
        const conn = mongoose.connect(mongo_url)
     
    } catch (error) {
      
    }
}

module.exports = dbConnect;
