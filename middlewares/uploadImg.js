const multer = require("multer")
const sharp = require("sharp")
const path = require("path")

const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/images"))
    },
    filename:(req,file,cb)=>{
        const uniqueSuffex = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null,file.fieldname + "-" + uniqueSuffex + ".jpeg")

    },
  
})

const multerFilter = (req,file,cb)=>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'||file.mimetype == 'image/jpg'){
        cb(null,true)
    }else{
        cb({
            message:"unsport file format"
        },
        false
        )
    }
}

const prodImgResize = async (req,res,next)=>{
    if(!req.files) return next()
    
    await Promise.all(req.files.map(async (file)=>{
        await sharp(file.path)
                .resize(300,300)
                .toFormat("jpeg")
                .jpeg({quality:90})
                .toFile(`public/images/products/${file.filename}`)
                                
    }))
    next()
}

const blogImgResize = async (req,res,next)=>{

    if(!req.files) return next()
    await Promise.all(req.files.map(async (file)=>{
        await sharp(file.path)
                .resize(300,300)
                .toFormat("jpeg")
                .jpeg({quality:90})
                .toFile(`public/images/blogs/${file.filename}`)
    }))
    next()
}

const uploadPhoto = multer({
    storage:multerStorage,
    fileFilter:multerFilter,
    limits:{fieldSize:2000000}
})

module.exports = {
    prodImgResize,
    blogImgResize,
    uploadPhoto
}
