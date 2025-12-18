const express = require('express')
require('dotenv').config()
const app = express()

app.use(express.static('public'))

app.get("/", (req, res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.listen(process.env.PORT, (err)=>{
    if (err){
        throw err
    }
    console.log(`Server listening at port ${process.env.PORT}`)
})