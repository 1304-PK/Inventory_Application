const express = require('express')
require('dotenv').config()
const app = express()
const db = require('./db')

app.use(express.static('public'))

app.get("/", (req, res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.get("/products", async (req, res)=>{
    try{
        const [rows] = await db.query('SELECT * FROM products')
        res.render('products.ejs', {products_list:rows})
    } catch(err){
        res.status(500).send('Error')
    }
})

app.get("/categories", (req, res)=>{
    res.send()
})

app.listen(process.env.PORT, (err)=>{
    if (err){
        throw err
    }
    console.log(`Server listening at port ${process.env.PORT}`)
})