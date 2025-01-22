let mealElement = document.getElementById("mealElement");
let searchByCategory = document.getElementById("searchByCategory");
let cartNo = document.getElementById("cartNo");
let cartModal = document.getElementById("cartModal")
let findElement = document.getElementById("findElement")
let productArray = [];
let catProduct = [];
let mealList = [];
let cartProduct = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

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
    for (let i = 0; i < list.length; i++) {
        const fullDescription = list[i].strCategoryDescription;
        const shortDescription = fullDescription.slice(0, 100);

        htmlData += `
            <div class="col-md-6 col-lg-4 p-3">
                <div class="card p-2" style="height: auto;">
                    <img src="${list[i].strCategoryThumb}" class="card-img-top" style="height: 10rem;" alt="${list[i].strCategory}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">${list[i].strCategory}</h5>
                           <button class="btn p-0 heart-btn" 
        id="wishlistBtn-${i}" 
        data-bs-toggle="tooltip" 
        data-bs-placement="left" 
        title="Add to Wishlist"
        onclick="toggleWishlist(${i})">
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
                                    onclick="AddToCart(${i});">
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


// Function to toggle button text
function toggleButtonText(index) {
    const button = document.getElementById(`toggleBtn-${index}`);
    const collapseElement = document.getElementById(`fullDesc-${index}`);

    if (collapseElement.classList.contains("show")) {
        button.textContent = "See More";
    } else {
        button.textContent = "See Less";
    }
}
function AddToCart(index) {
    console.log(`Item ${index} added to the cart.`);
}

function toggleWishlist(index) {
    const heartIcon = document.getElementById(`wishlistBtn-${index}`).querySelector('i');
    const mealName = mealList[index].strCategory; // Get meal name or ID
    const itemIndex = wishlist.indexOf(mealName);

    if (itemIndex === -1) {
        wishlist.push(mealName);
        heartIcon.classList.add('active'); 
    } else {
        wishlist.splice(itemIndex, 1);
        heartIcon.classList.remove('active'); 
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function highlightWishlistItems() {
    wishlist.forEach((mealName) => {
        const index = mealList.findIndex((meal) => meal.strCategory === mealName);

        if (index !== -1) {
            const heartIcon = document.getElementById(`wishlistBtn-${index}`).querySelector('i');
            heartIcon.classList.add('active');
        }
    });
}
getMeals(options).then(() => {
    highlightWishlistItems();
});




