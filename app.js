// ============================
// variables and constants
// ============================
const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartCountInfo = document.getElementById('cart-count-info');
const cartTotalValue = document.getElementById('cart-total-value');
let cartItemID = 1;

eventListeners();
// all event listeners
function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        fetchStorApi();
        loadCart();

    });
	// show/hide cart container
	document.getElementById('cart-btn').addEventListener('click', () => {
	    cartContainer.classList.toggle('show-cart-container');
	});
    // toggle navbar when toggle button is clicked
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    });
    // add to cart
    productList.addEventListener('click', purchaseProduct);
    // delete from cart
    cartList.addEventListener('click', deleteCartItem);
}
// update cart info
function updateCartInfor(){
    let cartInfo = findCartInfo();
    // console.log(cartInfo);
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}
updateCartInfor();


// load product items content form JSON file
function fetchStorApi(){
    // fetch('furniture.json')
    fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data =>{
        // let html = '';
        let produects = data.map(product => {
            // html += `
            return  `
                <div class = "product-item">
                    <div class = "product-img">
                        <img src = "${product.image}" alt = "product image">
                        <button type = "button" class = "add-to-cart-btn">
                            <i class = "fas fa-shopping-cart"></i>Add To Cart
                        </button>
                    </div>

                    <div class = "product-content">
                        <h3 class = "product-name">${product.title}</h3>
                        <p class = "product-price">$${product.price}</p>
                        <span class = "product-category">${product.category}</span>
                    </div>
                </div>
            `;
        });
        produects = produects.join("");
        productList.innerHTML = produects;
        // productList.innerHTML = html;
    })
    .catch(error => {
        console.log(error);
        //URL scheme must be "http" or "https" for CORS request. You need to be serving your index.html locally or have your site hosted on a live server somewhere for the Fetch API to work properly.
    })
}
// purchase product
function purchaseProduct(e){
	// console.log(e.target);
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        // console.log(product);
        getProductInfo(product);
    }
}
// get product info after add to cart button click
function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }
    // console.log(productInfo);
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

// add the selected product to the cart list
function addToCartList(product){
	// console.log(product);
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-category">${product.category}</span>
            <span class = "cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

// save the product in the local storage
function saveProductInStorage(item){
    let products = getProductFromStorage();
     // console.log(products);
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}
// get all the products info if there is any in the local storage
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns empty array if there isn't any product info
}

// load carts product
function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; // if there is no any product in the local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product => addToCartList(product));

    // calculate and update UI of cart info 
    updateCartInfo();
}

// calculate totole cart price
function findCartInfo() {
    let products = getProductFromStorage();
    // console.log(products);
    let total = products.reduce((prc, product)=>{
        // remove $
        let price = parseFloat(product.price.substr(1));
        return prc += price;
    }, 0);
    // console.log(total);
    return {
        total: total.toFixed(2),
        productCount: products.length
    }    
}

// delete products form cart list
function deleteCartItem(e){
    // console.log(e.target);
    let cartItem;
    if (e.target.tagName === "BUTTON") {
        cartItem = e.target.parentElement;
        cartItem.remove();
    }else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }
    // console.log(cartItem);
    let products = getProductFromStorage();
    let updateProducts = products.filter(product =>{
        return product.id !== parseInt(cartItem.dataset.id);
    })   
    // updating the prodects list after deleteting
    localStorage.setItem('products', JSON.stringify(updateProducts));
    updateCartInfo();
}