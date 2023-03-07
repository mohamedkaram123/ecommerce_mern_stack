const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const cloudUploadImg = async (fileUpload)=>{
    const res = await cloudinary.uploader.upload(fileUpload)
   return res
}

module.exports = {cloudUploadImg}
