// Mobile menu button 
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

// API Endpoints
const API = {
    allPlants: 'https://openapi.programming-hero.com/api/plants',
    allCategories: 'https://openapi.programming-hero.com/api/categories',
    plantsByCategory: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
    plantDetails: (id) => `https://openapi.programming-hero.com/api/plant/${id}`
};

// DOM Elements
const categoriesContainer = document.querySelector('.categories-container');
const treesContainer = document.querySelector('.trees-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const treeModal = document.getElementById('tree-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const categoriesSpinner = document.querySelector('.categories-spinner');
const treesSpinner = document.querySelector('.trees-spinner');

// Cart data
let cart = [];
let activeCategory = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAllTrees();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', () => {
        treeModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside the modal content
    treeModal.addEventListener('click', (e) => {
        if (e.target === treeModal) {
            treeModal.classList.add('hidden');
        }
    });
}

// Load all categories
async function loadCategories() {
    try {
        categoriesSpinner.classList.remove('hidden');
        
        const response = await fetch(API.allCategories);
        const data = await response.json();
        
        if (data.status) {
            displayCategories(data.categories);
        } else {
            throw new Error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesContainer.innerHTML = `<p class="text-red-500">Error loading categories. Please try again.</p>`;
    } finally {
        categoriesSpinner.classList.add('hidden');
    }
}

// Display categories
function displayCategories(categories) {
    const allCategoriesBtn = document.createElement('button');
    allCategoriesBtn.className = 'category-btn w-full text-left py-2 px-3 mb-2 rounded hover:bg-green-250 active';
    allCategoriesBtn.textContent = 'All Trees';
    allCategoriesBtn.addEventListener('click', () => {
        setActiveCategory(null);
        loadAllTrees();
    });
    
    categoriesContainer.innerHTML = '';
    categoriesContainer.appendChild(allCategoriesBtn);
    
    categories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-btn w-full text-left py-2 px-3 mb-2 rounded hover:bg-green-500';
        categoryBtn.textContent = category.category_name;
        categoryBtn.dataset.categoryId = category.id;
        
        categoryBtn.addEventListener('click', () => {
            setActiveCategory(category.id);
            loadTreesByCategory(category.id);
        });
        
        categoriesContainer.appendChild(categoryBtn);
    });
}

// Set active category
function setActiveCategory(categoryId) {
    activeCategory = categoryId;
    
    // Update active class on category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (
            (categoryId === null && btn.textContent === 'All Trees') ||
            (btn.dataset.categoryId === categoryId?.toString())
        ) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Load all trees
async function loadAllTrees() {
    try {
        showTreesSpinner();
        
        const response = await fetch(API.allPlants);
        const data = await response.json();
        
        if (data.status) {
            displayTrees(data.plants);
        } else {
            throw new Error('Failed to load trees');
        }
    } catch (error) {
        console.error('Error loading trees:', error);
        treesContainer.innerHTML = `<p class="text-red-500 col-span-3">Error loading trees. Please try again.</p>`;
    } finally {
        hideTreesSpinner();
    }
}

// Load trees by category
async function loadTreesByCategory(categoryId) {
    try {
        showTreesSpinner();
        
        const response = await fetch(API.plantsByCategory(categoryId));
        const data = await response.json();
        
        if (data.status) {
            if (data.plants && data.plants.length > 0) {
                displayTrees(data.plants);
            } else {
                treesContainer.innerHTML = `<p class="text-gray-500 col-span-3 text-center">No trees found in this category.</p>`;
            }
        } else {
            throw new Error('Failed to load trees for this category');
        }
    } catch (error) {
        console.error('Error loading trees by category:', error);
        treesContainer.innerHTML = `<p class="text-red-500 col-span-3">Error loading trees. Please try again.</p>`;
    } finally {
        hideTreesSpinner();
    }
}

// Display trees
function displayTrees(trees) {
    treesContainer.innerHTML = '';
    
    trees.forEach(tree => {
        const treeCard = document.createElement('div');
        treeCard.className = 'tree-card bg-white rounded-xl shadow overflow-hidden';
        
        treeCard.innerHTML = `
            <img src="${tree.image}" alt="${tree.name}" class="w-full h-48 p-2 object-cover rounded-xl">
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 tree-name">${tree.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${tree.description.substring(0, 50)}...</p>
                <div class="flex justify-between items-center mb-3">
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${tree.category}</span>
                    <span class="font-bold">₹${tree.price}</span>
                </div>
                <button class="add-to-cart-btn w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-3xl"
                        data-tree-id="${tree.id}"
                        data-tree-name="${tree.name}"
                        data-tree-price="${tree.price}">
                    Add to Cart
                </button>
            </div>
        `;
        
        // Add event listener for tree name click to open modal
        const treeName = treeCard.querySelector('.tree-name');
        treeName.addEventListener('click', () => {
            openTreeModal(tree.id);
        });
        
        // Add event listener for Add to Cart button
        const addToCartBtn = treeCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            addToCart({
                id: tree.id,
                name: tree.name,
                price: tree.price
            });
        });
        
        treesContainer.appendChild(treeCard);
    });
}

// Open tree modal with details
async function openTreeModal(treeId) {
    try {
        modalContent.innerHTML = `
            <div class="flex justify-center items-center p-8">
                <div class="loading-spinner"></div>
            </div>
        `;
        treeModal.classList.remove('hidden');
        
        const response = await fetch(API.plantDetails(treeId));
        const data = await response.json();
        
        if (data.status && data.plants) {
            const tree = data.plants;
            
            modalTitle.textContent = tree.name;
            modalContent.innerHTML = `
                <img src="${tree.image}" alt="${tree.name}" class="w-full h-64 object-cover rounded mb-4">
                <p class="text-gray-700 mb-4">${tree.description}</p>
                <div class="flex justify-between items-center">
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded">${tree.category}</span>
                    <span class="font-bold text-xl">₹${tree.price}</span>
                </div>
                <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-3xl mt-4"
                        onclick="addToCart({id: ${tree.id}, name: '${tree.name}', price: ${tree.price}})">
                    Add to Cart
                </button>
            `;
        } else {
            modalContent.innerHTML = `<p class="text-red-500">Error loading tree details. Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error loading tree details:', error);
        modalContent.innerHTML = `<p class="text-red-500">Error loading tree details. Please try again.</p>`;
    }
}

// Add tree to cart
function addToCart(tree) {
    // Check if tree is already in cart
    const existingTree = cart.find(item => item.id === tree.id);
    
    if (existingTree) {
        // Increment quantity if tree already exists in cart
        existingTree.quantity += 1;
    } else {
        // Add new tree to cart
        cart.push({
            id: tree.id,
            name: tree.name,
            price: tree.price,
            quantity: 1
        });
    }
    
    updateCart();
}

// Remove tree from cart
function removeFromCart(treeId) {
    cart = cart.filter(item => item.id !== treeId);
    updateCart();
}

// Update cart display
function updateCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center">Your cart is empty</p>`;
    } else {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p class="text-sm text-gray-500">₹${item.price} × ${item.quantity}</p>
                </div>
                <span class="remove-btn" data-tree-id="${item.id}">❌</span>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            
            // Add event listener for remove button
            const removeBtn = cartItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                removeFromCart(item.id);
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `₹${total}`;
}

// Show trees loading spinner
function showTreesSpinner() {
    treesContainer.innerHTML = '';
    treesSpinner.classList.remove('hidden');
    treesContainer.appendChild(treesSpinner);
}

// Hide trees loading spinner
function hideTreesSpinner() {
    treesSpinner.classList.add('hidden');
}

// Make addToCart function available globally for the modal
window.addToCart = addToCart;