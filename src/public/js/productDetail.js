const form = document.querySelector(".add-cart-form");
const message = document.querySelector("#cart-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productId = form.dataset.productId;
  const cartId = new FormData(form).get("cartId");

  const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST"
  });

  const result = await response.json();
  message.textContent = response.ok
    ? "Producto agregado al carrito."
    : result.error || "No se pudo agregar el producto.";
});
