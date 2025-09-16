// DOM elements
const categoriesContainer = document.getElementById("Categories");
const cardContainer = document.getElementById("card-container");

// get categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = data.categories;
      displayCategories(categories);

      loadAllPlants();

      const allTreesLi = document.getElementById("all-trees");
      if (allTreesLi) {
        allTreesLi.classList.add("bg-[#15803D]", "text-white");
      }
    });
};

// display categories
const displayCategories = (categories) => {
  categoriesContainer.innerHTML = "";

  const allTreesLi = document.createElement("li");
  allTreesLi.id = "all-trees";
  allTreesLi.className =
    "block hover:bg-[#15803D] hover:text-white px-3 py-2 rounded text-[12px] md:text-[16px] cursor-pointer";
  allTreesLi.textContent = "All Trees";
  categoriesContainer.appendChild(allTreesLi);

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.id = cat.id;
    li.className =
      "block hover:bg-[#15803D] hover:text-white px-3 py-2 rounded text-[12px] md:text-[16px] cursor-pointer";
    li.textContent = cat.category_name;
    categoriesContainer.appendChild(li);
  });

  categoriesContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
      const allLi = categoriesContainer.querySelectorAll("li");
      allLi.forEach((li) => {
        li.classList.remove("bg-[#15803D]", "text-white");
      });

      e.target.classList.add("bg-[#15803D]", "text-white");

      if (e.target.id === "all-trees") {
        loadAllPlants();
      } else {
        loadPlants(e.target.id);
      }
    }
  });
};

// get plants by category
const loadPlants = (plantsId) => {
  showSpinner();
  fetch(`https://openapi.programming-hero.com/api/category/${plantsId}`)
    .then((res) => res.json())
    .then((data) => {
      hideSpinner();
      const plants = data.plants;
      showPlants(plants);
    });
};

const loadAllPlants = () => {
  showSpinner();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      hideSpinner();
      const plants = data.plants;
      showPlants(plants);
    });
};

// show plants
const showPlants = (plants) => {
  cardContainer.innerHTML = "";

  plants.forEach((plant) => {
    const creatCard = document.createElement("div");
    creatCard.className = "bg-white shadow rounded-xl p-4 flex flex-col";

    creatCard.innerHTML = `
      <div class="h-36 rounded-md mb-5">
        <img class="object-cover h-40 w-full rounded-md" src="${plant.image}" alt="${plant.name}" />
      </div>
      <h3 class="font-semibold text-lg cursor-pointer">${plant.name}</h3>
      <p class="text-sm text-gray-600 mb-3">${plant.description}</p>
      <div class="flex items-center justify-between mt-auto">
        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">${plant.category}</span>
        <span class="font-semibold price">৳${plant.price}</span>
      </div>
      <button class="mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-4xl cursor-pointer" id="add-cart">
        Add to Cart
      </button>
    `;
    cardContainer.appendChild(creatCard);
    // modal
    const treeName = creatCard.querySelector("h3");
    treeName.addEventListener("click", () => {
      document.getElementById("modal-title").innerText = plant.name;
      document.getElementById("modal-image").src = plant.image;
      document.getElementById("modal-description").innerText =
        plant.description;
      document.getElementById("modal-category").innerText = plant.category;
      document.getElementById("modal-price").innerText = plant.price;
      document.getElementById("tree-modal").checked = true;
    });
  });
};

// spinner functions
const showSpinner = () => {
  document.getElementById("spinner-container").classList.remove("hidden");
};

const hideSpinner = () => {
  document.getElementById("spinner-container").classList.add("hidden");
};

// add to cart part
const cartContainer = document.getElementById("cart-container");

const toalPrice = () => {
  const itemsLine = cartContainer.querySelectorAll(".cart-item");
  let total = 0;

  itemsLine.forEach((line) => {
    const price = parseInt(line.dataset.price);
    const quantity = parseInt(line.querySelector(".quantity").innerText);
    total += price * quantity;
  });

  const existingTotal = cartContainer.querySelector(".cart-total");
  if (existingTotal) existingTotal.remove();

  if (itemsLine.length > 0) {
    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = ` <div class="cart-total flex justify-between items-center border-t pt-2 mt-2 px-2 font-bold">
                                <p>Total</p>
                                <p>৳${total}</p>
                           </div>`;
    cartContainer.appendChild(totalDiv);
  }
};
// addEventListener
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "add-cart") {
    const card = e.target.closest("div");
    const name = card.querySelector("h3").innerText;
    const price = parseInt(
      card.querySelector(".price").innerText.replace("৳", "")
    );
    if (!confirm(`${name} has been added to the cart. Click OK to confirm.`)) {
      return;
    }
    let existing = cartContainer.querySelector(`[data-name="${name}"]`);
    if (existing) {
      const qtyEl = existing.querySelector(".quantity");
      qtyEl.innerText = parseInt(qtyEl.innerText) + 1;
    } else {
      const div = document.createElement("div");
      div.className =
        "cart-item flex justify-between items-center bg-[#F0FDF4] px-3 py-2 mb-2";
      div.dataset.name = name;
      div.dataset.price = price;

      div.innerHTML = `
        <div>
          <p class="font-semibold">${name}</p>
          <p>৳<span>${price}</span> x <span class="quantity">1</span></p>
        </div>
        <div class="font-semibold text-2xl cursor-pointer">×</div>
      `;

      div.querySelector("div:last-child").addEventListener("click", () => {
        div.remove();
        toalPrice();
      });

      cartContainer.appendChild(div);
    }
    toalPrice();
  }
});

// call function
loadCategories();
