let mealElement = document.getElementById("mealElement");
let cartNo = document.getElementById("cartNo");
let wishlistNo = document.getElementById("wishlistNo");
let productArray = JSON.parse(localStorage.getItem('cart')) || [];  
let mealList = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let wishlistItems=JSON.parse(localStorage.getItem('wishlistItems')) || [];
let cartModel=document.getElementById('cartModel');
let payElements = document.getElementById("payElements");
let wishListModal=document.getElementById("wishListModal");
const toastElement = document.getElementById('cartToast');

let presentItems = [];
let itemQuantity=[];
// const totalEle = document.getElementById("total");


// productArray = [];
// wishlist = [];
// wishlistItems = [];
// localStorage.setItem('cart', JSON.stringify(productArray));
// localStorage.setItem('wishlist', JSON.stringify(wishlist));
// localStorage.setItem('cart', JSON.stringify(productArray));
// localStorage.setItem('wishlist', JSON.stringify(wishlistItems));


let url = "https://www.themealdb.com/api/json/v1/1/categories.php";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
};

async function getMeals(obj) {
    try {
        let response = await fetch(url, obj);
        if (response.ok) {
            let mealArray = await response.json();
            mealList = mealArray.categories;
            viewMeals(mealList);  
            highlightWishlistItems(); 
        } else {
            console.error("Error: ", response.status);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}


getMeals(options);

function viewMeals(list) {
    let htmlData = "";
    var price = 10;

    for (let i = 0; i < list.length; i++) {
        const fullDescription = list[i].strCategoryDescription;
        const shortDescription = fullDescription.slice(0, 100);

        htmlData += `
            <div class="col-md-6 col-lg-4 p-3">
                <div class="card p-2" style="height: auto;">
                    <img src="${list[i].strCategoryThumb}" class="card-img-top" style="height: 10rem;" alt="${list[i].strCategory}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">
                                ${list[i].strCategory}
                                <span class="badge bg-warning ms-2">${price++} $</span>
                            </h5>
                           <button class="btn p-0 heart-btn" 
                            id="wishlistBtn-${i}" 
                            data-bs-toggle="tooltip" 
                            data-bs-placement="left" 
                            title="Add to Wishlist"
                            onclick="toggleWishlist(${i});">
                            <i class="bi bi-heart"></i>
                            </button>

                        </div>
                        <p class="card-text">
                            <span id="shortDesc-${i}">${shortDescription}...</span>
                            <span class="collapse" id="fullDesc-${i}">${fullDescription}</span>
                        </p>
                        <div class="d-flex justify-content-between mt-3">
                            <a class="btn btn-link p-0 text-decoration-none" 
                               data-bs-toggle="collapse" 
                               href="#fullDesc-${i}" 
                               role="button" 
                               aria-expanded="false" 
                               aria-controls="fullDesc-${i}" 
                               id="toggleBtn-${i}" 
                               onclick="toggleButtonText(${i})">
                                See More
                            </a>
                             <button class="btn btn-primary btn-sm addToCartBtn" 
                                    id="addToCartBtn-${i}" 
                                    data-added="false"
                                    onclick="AddToCart(${i}); showToastMessage();">
                                Add to Cart
                            </button>
                     
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    mealElement.innerHTML = htmlData;
}

function searchMealByName() {
    let searchText = document.getElementById("searchInput").value;

    let filteredMeals = mealList.filter((item) => 
        searchText === "" ? true : item.strCategory.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredMeals.length === 0) {
        document.getElementById("mealElement").innerHTML = `<p class="no-meals-message"> No meals found with this name. Please try again.</p>`;
    } else {
        viewMeals(filteredMeals);
    }
}

function toggleButtonText(index) {
    const button = document.getElementById(`toggleBtn-${index}`);
    const collapseElement = document.getElementById(`fullDesc-${index}`);

    if (collapseElement.classList.contains("show")) {
        button.textContent = "See More";
    } else {
        button.textContent = "See Less";
    }
}

function AddToCart(i) {
        productArray.push(mealList[i]);
        cartNo.innerText = productArray.length;
        localStorage.setItem('cart', JSON.stringify(productArray));
    }

    function addToWishList(i) {
        wishlist.push(mealList[i]);
        wishlistNo.innerText = wishlist.length;
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function viewCart(list) {
        let htmlData = '';
        var price = 10;
         presentItems = [];
         itemQuantity=[];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let itemCount = 0;
            if (presentItems.includes(item.strCategory)) {
            continue;
            }
            for (let j = 0; j < list.length; j++) {
                if (list[j].strCategory === item.strCategory) {
                    itemCount++;
                }
            }
            itemQuantity.push(itemCount);
            presentItems.push(item.strCategory);
            htmlData += `
            <div class="col-md-6 col-lg-4 p-3">
                <div class="card p-2" style="height: auto;">
                    <img src="${item.strCategoryThumb}" class="card-img-top" style="height: 10rem;" alt="${item.strCategory}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">
                                ${item.strCategory}
                                <span class="badge bg-warning ms-2">${price++} $</span>
                            </h5>
                        </div>
                        <div class="mb-2 d-flex align-items-center">
                            <p class="mb-0 me-3">Quantity:</p>
                            <button class="btn btn-outline-secondary btn-sm me-2" onclick="decreaseQuantity('${item.strCategory}')">-</button>
                            <span id="quantity-${item.strCategory}" class="badge bg-secondary">${itemCount}</span>
                            <button class="btn btn-outline-secondary btn-sm ms-2" onclick="increaseQuantity('${item.strCategory}')">+</button>
                        </div>
                        <a href="#" class="btn btn-dark rounded-pill mt-2" onclick="delFromCart('${item.strCategory}')">Delete</a>
                    </div>
                </div>
            </div>`
            ;
        }
    
        cartModel.innerHTML = htmlData;
        localStorage.setItem('cart', JSON.stringify(productArray));
    }
    
    
    function increaseQuantity(category) {
        const item = productArray.find(item => item.strCategory === category);
        if (item) {
            productArray.push(item); 
            viewCart(productArray); 
        cartNo.innerText = productArray.length;
        localStorage.setItem('cart', JSON.stringify(productArray));
        }
    }
    function decreaseQuantity(category) {
        const index = productArray.findIndex(item => item.strCategory === category);
        if (index !== -1) {
            productArray.splice(index, 1); 
            cartNo.innerText = productArray.length;

            viewCart(productArray);
        }
    }



    function delFromCart(category) {
        let index;
        let found = true;
            while (found) {
            index = productArray.findIndex(item => item.strCategory === category);
    
            if (index !== -1) {
                productArray.splice(index, 1);
            } else {
                found = false;
            }
        }
            cartNo.innerText = productArray.length;
        viewCart(productArray);
        localStorage.setItem('cart', JSON.stringify(productArray));
    }
    
    
function removeFromWishlist(i){
    wishlist.splice(i,1);
    wishlistNo.innerText=wishlist.length;
    viewWishList(wishlist);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

}

function viewWishList() {
    let htmlData = '';
    let price = 10; 
    let presentItems = [];
    let itemQuantity = [];
    for (let i = 0; i < wishlist.length; i++) {
        let item = wishlist[i]; 
        let itemCount = 0;

        if (presentItems.includes(item.strCategory)) {
            continue;
        }
         presentItems.push(item);

        for (let j = 0; j < wishlist.length; j++) {
            if (wishlist[j].strCategory === item.strCategory) {
                itemCount++;
            }
        }
        itemQuantity.push(itemCount);
        const fullDescription = item.strCategoryDescription || "No description available";
        const shortDescription = fullDescription.slice(0, 100);
        
        // console.log("wishlist",wishlist);
        let mealIndex = mealList.findIndex(meal => meal.strCategory === item.strCategory);



        htmlData += `
            <div class="col-md-6 col-lg-4 p-3">
                <div class="card p-2" style="height: auto;">
                    <img src="${item.strCategoryThumb}" class="card-img-top" style="height: 10rem;" alt="${item.strCategory}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">
                                ${item.strCategory}
                                <span class="badge bg-warning ms-2">${price++} $</span>
                            </h5>
                        </div>
                        <p class="card-text">
                            <span id="shortDesc-${i}">${fullDescription}...</span>
                            <span class="collapse" id="fullDesc-${i}">${shortDescription}</span>
                        </p>
                        <div class="d-flex justify-content-between mt-3">
                            <a class="btn btn-link p-0 text-decoration-none" 
                               data-bs-toggle="collapse" 
                               href="#fullDesc-${i}" 
                               role="button" 
                               aria-expanded="false" 
                               aria-controls="fullDesc-${i}" 
                               id="toggleBtn-${i}" 
                               onclick="toggleButtonText(${i})">
                                See More
                            </a>
                            <button class="btn btn-primary btn-sm addToCartBtn" 
                                    id="addToCartBtn-${i}" 
                                    data-added="false"
                                    onclick="AddToCart(${mealIndex});showToastMessage();">
                                Add to Cart
                            </button>
                             <button class="btn btn-primary btn-sm removeFromWishList" 
                                    id="addToCartBtn-${i}" 
                                    data-added="false"
                                    onclick="removeFromWishlist(${i})">
                                Remove from wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    wishListModal.innerHTML = htmlData;

    localStorage.setItem('wishlist', JSON.stringify(presentItems));
}



function toggleWishlist(index) {
    const heartIcon = document.getElementById(`wishlistBtn-${index}`).querySelector('i');
    const meal = mealList[index]; 
    const itemIndex = wishlist.findIndex(item => item.strCategory === meal.strCategory);

    if (itemIndex === -1) {
        wishlist.push(meal);
        heartIcon.classList.add('active');
    } else {
        wishlist.splice(itemIndex, 1);
        heartIcon.classList.remove('active');
    }

    wishlistNo.innerText = wishlist.length;
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}


function highlightWishlistItems() {
    wishlist.forEach((meal) => { 
        const index = mealList.findIndex((m) => m.strCategory === meal.strCategory); 

        if (index !== -1) { 
            const heartIcon = document.getElementById(`wishlistBtn-${index}`)?.querySelector('i');
            if (heartIcon) {
                heartIcon.classList.add('active');
            }
        }
    });
}


function initializeCounters() {
    wishlistNo.innerText = wishlist.length;
    cartNo.innerText = productArray.length;
}
function showToastMessage() {
    const popSound = new Audio('./audio/digital-beeping-151921.mp3');
    popSound.play();
    
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }

function checkNetworkStatus() {
    const loading = document.getElementById("loading");

    if (!navigator.onLine) {
        loading.classList.remove("d-none");
    } else {
        loading.classList.add("d-none");
    }
}


window.addEventListener("online", checkNetworkStatus);
window.addEventListener("offline", checkNetworkStatus);

checkNetworkStatus();

getMeals(options).then(() => {
    highlightWishlistItems();
    initializeCounters(); 
});
