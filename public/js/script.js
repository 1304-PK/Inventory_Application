const prod_btn = document.getElementById("all-products-btn")
const cat_btn = document.getElementById("all-categories-btn")

prod_btn.addEventListener("click", () => {
    console.log("hello")
    window.location.href = '/products'
})

cat_btn.addEventListener("click", () => {
    window.location.href = '/categories'
})