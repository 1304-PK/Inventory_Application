const express = require('express')
require('dotenv').config()
const app = express()
const db = require('./db')

// VARIABLES
categories = []

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.post("/new_category", async (req, res) => {
    try{
        const val = req.body.category_name
        await db.query(`INSERT INTO categories_table (category) VALUES ("${val}")`)
        res.redirect("/categories")
    } catch(err){
        if (err.errno==1062){
            res.send("Entered category value already exists")
        }
    }
})

app.post("/add-new-product",async (req, res) => {
    const prod = req.body
    try{
        let cat_id
        const [data] = await db.query("SELECT * FROM categories_table")
        categories = data
        data.forEach(item => {
            if (item.category==prod.prod_category){
                cat_id = item.category_id
            }
        })
        await db.query(`INSERT INTO products (category_id, name, price, image_url, amount)
            VALUES ("${cat_id}", "${prod.prod_name}", "${prod.prod_price}", "${prod.prod_img_url}",
             "${prod.prod_amount}")`)
        res.redirect("/products")
    } catch(err){
        console.log(err)
        res.send()
    }
})

app.get("/new-product",async (req, res) => {
    try{
        const [data] = await db.query("SELECT * FROM categories_table")
        categories = data
        res.render("new-product.ejs", {categories})
    } catch(err){
        res.status(500).send(err)
    }
})

app.get("/products", async (req, res)=>{
    try{
        const [rows] = await db.query('SELECT * FROM products')
        res.render('products.ejs', {products_list:rows})
    } catch(err){
        res.status(500).send('Error')
    }
})

app.get("/category/:cat_index", async (req, res) => {
    const [data] = await db.query("SELECT * FROM categories_table")
    cat_exists = false
    cat_index = Number(req.params.cat_index)
    let cat_id
    data.forEach((item, i) => {
        if (cat_index === i){
            cat_exists = true
            cat_id = item.category_id
        }
    })
    if (cat_exists){
        db.query(`SELECT * FROM products WHERE category_id = ${cat_id}`)
        .then(data => res.render('selected_category.ejs', {category_name: "yeah", category_items: data[0]}))
        .catch(err => console.log(err))
    }
    else{
        res.send("Entered category doesn't exist")
    }
})

app.get("/categories", async (req, res)=>{
    try{
        const [rows] = await db.query('SELECT * FROM categories_table')
        categories = rows
        res.render('categories.ejs', {categories: categories})
    } catch(err){
        res.status(500).send("Error")
    }
})

app.listen(process.env.PORT, (err)=>{
    if (err){
        throw err
    }
    console.log(`Server listening at port ${process.env.PORT}`)
})