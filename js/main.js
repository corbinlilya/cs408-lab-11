const BASE_URL = "https://i2sgiec8za.execute-api.us-east-2.amazonaws.com";

const tbody = document.getElementById("items-body");
const loadBtn = document.getElementById("load");
const form = document.getElementById("create-form");

window.onload = () => {
  loadBtn.addEventListener("click", loadItems);
  form.addEventListener("submit", addItem);
  document.addEventListener("click", handleDelete);
  loadItems(); 
};

function render(items = []) {
  tbody.innerHTML = items
    .map(
      (it) => `
      <tr>
        <td>${it.id}</td>
        <td>${it.name}</td>
        <td>${it.price}</td>
        <td class="right"><button class="btn" data-delete="${it.id}">Delete</button></td>
      </tr>`
    )
    .join("");
}

function loadItems() {
  loadBtn.disabled = true;
  fetch(`${BASE_URL}/items`)
    .then((r) => r.json())
    .then((data) => render(Array.isArray(data) ? data : data?.items || []))
    .catch((e) => alert("Failed to load: " + e.message))
    .finally(() => (loadBtn.disabled = false));
}

function addItem(e) {
  e.preventDefault();
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  if (!id || !name || Number.isNaN(price)) return alert("Fill all fields.");

  fetch(`${BASE_URL}/items`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, price })
  })
    .then(() => {
      form.reset();
      loadItems();
    })
    .catch((e) => alert("Add failed: " + e.message));
}

function handleDelete(e) {
  const id = e.target?.dataset?.delete;
  if (!id) return;

  fetch(`${BASE_URL}/items/${encodeURIComponent(id)}`, { method: "DELETE" })
    .then(() => loadItems())
    .catch((err) => alert("Delete failed: " + err.message));
}
