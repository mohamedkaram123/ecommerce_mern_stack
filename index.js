const dotenv = require("dotenv").config({ debug: true })

const bodyParser = require("body-parser")
const express = require("express")
const dbConnect  = require("./config/dbConnect")
const app = express()
const PORT = process.env.PORT || 3000
const authRouter = require("./routes/AuthRoute")
const productRouter = require("./routes/productRoute")
const morgan = require("morgan")
const {notFound, errorHandler} = require("./middlewares/HandlerError")
const cookieParser = require("cookie-parser")

dbConnect()

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use("/api/user",authRouter)
app.use("/api/product",productRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log('====================================');
    console.log(`server is listen ${PORT}`);
    console.log(process.env.PORT);

    console.log('====================================');
})