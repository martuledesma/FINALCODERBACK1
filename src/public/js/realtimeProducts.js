const socket = io();
const list = document.querySelector("#products-list");
const form = document.querySelector("#product-form");
const formTitle = document.querySelector("#form-title");
const submitButton = document.querySelector("#submit-button");
const cancelEditButton = document.querySelector("#cancel-edit");
const adminMessage = document.querySelector("#admin-message");
const productCount = document.querySelector("#product-count");
const imagePreview = document.querySelector("#image-preview");
const imageInput = form.elements.thumbnails;
let productsCache = [];
let editingProductId = null;

const formatPrice = (value) => new Intl.NumberFormat("es-AR").format(value);

const icon = {
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z"></path><path d="m14 6 4 4"></path></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M6 6l1 14h10l1-14"></path></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21H5V3h11l3 3v15Z"></path><path d="M8 21v-7h8v7"></path><path d="M8 3v5h7"></path></svg>'
};

const getProductId = (product) => product._id?.toString?.() || product._id;

const parseSizes = (value) =>
  value
    .split(",")
    .map((size) => size.trim().toUpperCase())
    .filter(Boolean);

const renderProducts = (products) => {
  productsCache = products;
  productCount.textContent = products.length;

  list.innerHTML = products
    .map(
      (product) => `
        <article class="realtime-item">
          ${
            product.thumbnails?.[0]
              ? `<img src="${product.thumbnails[0]}" alt="${product.title}">`
              : '<div class="mini-placeholder">K</div>'
          }
          <div class="realtime-info">
            <strong>${product.title}</strong>
            <span>${product.category} | $${formatPrice(product.price)} | Stock ${product.stock}</span>
            <small>${product.status ? "Visible" : "Oculto"} | ${product.code}</small>
            <small>Talles: ${product.sizes?.length ? product.sizes.join(", ") : "Sin talles"}</small>
          </div>
          <div class="admin-actions">
            <button class="icon-button" data-edit-id="${getProductId(product)}" title="Editar producto">
              ${icon.edit}
            </button>
            <button class="icon-button danger" data-delete-id="${getProductId(product)}" title="Eliminar producto">
              ${icon.trash}
            </button>
          </div>
        </article>
      `
    )
    .join("");
};

socket.on("productsUpdated", renderProducts);

const resetForm = () => {
  editingProductId = null;
  form.reset();
  form.elements.status.checked = true;
  imagePreview.src = "/images/kitana-top-brown.jpeg";
  formTitle.textContent = "Nueva prenda";
  submitButton.innerHTML = `${icon.plus} Crear producto`;
  cancelEditButton.classList.add("hidden");
  adminMessage.textContent = "";
};

const fillFormForEdit = (product) => {
  editingProductId = getProductId(product);
  form.elements.title.value = product.title || "";
  form.elements.description.value = product.description || "";
  form.elements.code.value = product.code || "";
  form.elements.price.value = product.price || "";
  form.elements.stock.value = product.stock || "";
  form.elements.category.value = product.category || "";
  form.elements.sizes.value = product.sizes?.join(", ") || "";
  form.elements.thumbnails.value = product.thumbnails?.[0] || "";
  form.elements.status.checked = Boolean(product.status);
  imagePreview.src = product.thumbnails?.[0] || "/images/kitana-top-brown.jpeg";
  formTitle.textContent = "Editar prenda";
  submitButton.innerHTML = `${icon.save} Guardar cambios`;
  cancelEditButton.classList.remove("hidden");
  adminMessage.textContent = `Editando: ${product.title}`;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
};

imageInput.addEventListener("input", () => {
  imagePreview.src = imageInput.value || "/images/kitana-top-brown.jpeg";
});

cancelEditButton.addEventListener("click", resetForm);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const thumbnails = formData.get("thumbnails");

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    sizes: parseSizes(formData.get("sizes") || ""),
    status: formData.get("status") === "on",
    thumbnails: thumbnails ? [thumbnails] : []
  };

  const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products";
  const method = editingProductId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });

  const result = await response.json();

  if (response.ok) {
    const successMessage = editingProductId ? "Producto actualizado." : "Producto creado.";
    resetForm();
    adminMessage.textContent = successMessage;
  } else {
    adminMessage.textContent = result.error || "No se pudo guardar el producto.";
  }
});

list.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-id]");
  const deleteButton = event.target.closest("[data-delete-id]");

  if (editButton) {
    const product = productsCache.find((item) => getProductId(item) === editButton.dataset.editId);
    if (product) fillFormForEdit(product);
    return;
  }

  if (!deleteButton) return;

  await fetch(`/api/products/${deleteButton.dataset.deleteId}`, {
    method: "DELETE"
  });
});
