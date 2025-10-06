const form = document.getElementById("itemForm");
const itemsContainer = document.getElementById("itemsContainer");
const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");

let items = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newItem = {
    name: document.getElementById("itemName").value,
    price: document.getElementById("itemPrice").value,
    image: document.getElementById("itemImage").value || "https://via.placeholder.com/200",
    desc: document.getElementById("itemDesc").value,
    category: document.getElementById("itemCategory").value,
    email: document.getElementById("sellerEmail").value
  };

  items.push(newItem);
  form.reset();
  displayItems(items);
});

function displayItems(filteredItems) {
  itemsContainer.innerHTML = "";
  filteredItems.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p><strong>$${item.price}</strong></p>
      <span class="category">Category: ${item.category}</span><br>
      <a class="contact-btn" href="mailto:${item.email}?subject=Interested in your ${item.name}">Contact Seller</a>
    `;
    itemsContainer.appendChild(div);
  });
}

// Search filter
searchBar.addEventListener("input", () => {
  const searchText = searchBar.value.toLowerCase();
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchText) ||
    item.desc.toLowerCase().includes(searchText)
  );
  displayItems(filtered);
});

// Category filter
categoryFilter.addEventListener("change", () => {
  const category = categoryFilter.value;
  if (category === "all") {
    displayItems(items);
  } else {
    const filtered = items.filter(item => item.category === category);
    displayItems(filtered);
  }
});
