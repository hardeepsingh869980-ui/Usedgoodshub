// --- Homepage carousel ---
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel button.prev');
const nextBtn = document.querySelector('.carousel button.next');
const carouselItems = document.querySelectorAll('.carousel-item');
let slideIndex = 0;

// Auto-slide
function autoSlide() {
  slideIndex++;
  if(slideIndex >= carouselItems.length) slideIndex = 0;
  const itemWidth = carouselItems[0].offsetWidth + 20;
  track.style.transform = `translateX(-${slideIndex * itemWidth}px)`;
}
setInterval(autoSlide, 3000);

// Prev/Next buttons
prevBtn?.addEventListener('click', () => {
  slideIndex = Math.max(slideIndex-1,0);
  track.style.transform = `translateX(-${slideIndex*(carouselItems[0].offsetWidth+20)}px)`;
});
nextBtn?.addEventListener('click', () => {
  slideIndex = Math.min(slideIndex+1, carouselItems.length-1);
  track.style.transform = `translateX(-${slideIndex*(carouselItems[0].offsetWidth+20)}px)`;
});

// --- Sell Page ---
const sellForm = document.getElementById('sellForm');
sellForm?.addEventListener('submit', e=>{
  e.preventDefault();
  const newItem = {
    name: document.getElementById('itemName').value,
    price: '$'+document.getElementById('itemPrice').value,
    category: document.getElementById('itemCategory').value,
    rating: document.getElementById('itemRating').value,
    description: document.getElementById('itemDescription').value,
    images: document.getElementById('itemImages').value
  };
  const items = JSON.parse(localStorage.getItem('products')) || [];
  items.push(newItem);
  localStorage.setItem('products', JSON.stringify(items));
  alert('Item submitted successfully!');
  sellForm.reset();
});

// --- Products Page ---
const productGrid = document.querySelector('.product-grid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const modal = document.getElementById('buyModal');
const modalName = document.getElementById('modalName');
const modalImages = document.getElementById('modalImages');
const modalPrice = document.getElementById('modalPrice');
const modalRating = document.getElementById('modalRating');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.querySelector('.close');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const contactForm = document.getElementById('contactForm');
let allProducts = JSON.parse(localStorage.getItem('products')) || [];
let filteredProducts = [...allProducts];
let currentPage = 1;
const itemsPerPage = 8;

// Load products dynamically
function loadProducts() {
  productGrid.innerHTML = '';
  filteredProducts.forEach(item=>{
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.dataset.name = item.name;
    card.dataset.price = item.price;
    card.dataset.category = item.category;
    card.dataset.rating = item.rating;
    card.dataset.description = item.description;
    card.dataset.images = item.images;
    card.innerHTML = `
      <img src="${item.images.split(',')[0]}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price}</p>
      <button class="buy-btn">Buy Now</button>
      <div class="hover-info">⭐ ${'⭐'.repeat(Math.floor(item.rating))}${item.rating%1?'✩':''}<br>${item.description}</div>
    `;
    productGrid.appendChild(card);
  });
  updateBuyButtons();
}
loadProducts();

// --- Buy Now Modal ---
function updateBuyButtons() {
  const buyBtns = document.querySelectorAll('.buy-btn');
  buyBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card = btn.parentElement;
      modalName.textContent = card.dataset.name;
      modalImages.innerHTML = '';
      const images = card.dataset.images.split(',');
      images.forEach(src=>{
        const img = document.createElement('img');
        img.src = src.trim();
        modalImages.appendChild(img);
      });
      modalPrice.textContent = card.dataset.price;
      modalRating.textContent = '⭐ '.repeat(Math.floor(card.dataset.rating)) + (card.dataset.rating%1?'✩':'');
      modalDescription.textContent = card.dataset.description;
      modal.style.display = 'block';
    });
  });
}
modalClose.addEventListener('click', ()=>modal.style.display='none');
modalCloseBtn.addEventListener('click', ()=>modal.style.display='none');
window.addEventListener('click', e=>{if(e.target===modal) modal.style.display='none';});
contactForm?.addEventListener('submit', e=>{
  e.preventDefault();
  alert('Message sent to seller!');
  contactForm.reset();
});

// --- Lightbox ---
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
document.body.appendChild(lightbox);
modalImages?.addEventListener('click', e=>{
  if(e.target.tagName==='IMG'){
    lightbox.innerHTML=`<img src="${e.target.src}"/>`;
    lightbox.style.display='flex';
  }
});
lightbox.addEventListener('click', ()=>lightbox.style.display='none');

// --- Filters and Sorting ---
function applyFilter() {
  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  filteredProducts = allProducts.filter(p=>{
    const name = p.name.toLowerCase();
    return (name.includes(searchText)||searchText==='') && (category==='All'||p.category===category);
  });
  currentPage=1;
  applySort();
}
function applySort() {
  const sortValue = sortSelect.value;
  filteredProducts.sort((a,b)=>{
    switch(sortValue){
      case 'priceAsc': return parseFloat(a.price.replace('$',''))-parseFloat(b.price.replace('$',''));
      case 'priceDesc': return parseFloat(b.price.replace('$',''))-parseFloat(a.price.replace('$',''));
      case 'ratingDesc': return parseFloat(b.rating)-parseFloat(a.rating);
      case 'newest':
      default: return 0;
    }
  });
  loadProducts();
}
searchInput?.addEventListener('input', ()=>{applyFilter(); savePreferences();});
categoryFilter?.addEventListener('change', ()=>{applyFilter(); savePreferences();});
sortSelect?.addEventListener('change', ()=>{applySort(); savePreferences();});

// --- Persistent preferences ---
function savePreferences(){
  localStorage.setItem('filterCategory', categoryFilter.value);
  localStorage.setItem('searchText', searchInput.value);
  localStorage.setItem('sortOrder', sortSelect.value);
}
function loadPreferences(){
  if(localStorage.getItem('filterCategory')) categoryFilter.value=localStorage.getItem('filterCategory');
  if(localStorage.getItem('searchText')) searchInput.value=localStorage.getItem('searchText');
  if(localStorage.getItem('sortOrder')) sortSelect.value=localStorage.getItem('sortOrder');
}
loadPreferences();
applyFilter();
