const {default:mongoose} = require("mongoose")

 const dbConnect = ()=>{

    const url = process.env.MONGOBD_URL;
    
    mongoose.connect(url)
      .then(() => console.log('Connected to MongoDB'))
      .catch((error) => console.error('Error connecting to MongoDB:', error.message));
    
}

module.exports = dbConnect;
