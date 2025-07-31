const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_wciGBcNg6P7X_68ZHI-qS7op2lvNN7l87iSLv9XPjWGG7heDLtQdqgM-iSZIOv9_uw/exec";

// โหลดสินค้าทั้งหมดจาก Google Sheets
async function loadProductsFromSheet() {
  const container = document.getElementById("productList");
  container.innerHTML = "⏳ กำลังโหลด...";
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    container.innerHTML = data.map((p, i) => `
      <div class="product-item">
        <div class="product-info">
          <strong>${p.name}</strong>
          <small>หมวด: ${p.category || "-"}, จำนวน: ${p.quantity || 0}</small>
        </div>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = "❌ โหลดข้อมูลล้มเหลว";
    console.error(err);
  }
}
window.loadProductsFromSheet = loadProductsFromSheet;

// ส่งข้อมูลเพิ่มสินค้าไปยัง Google Sheets
window.submitNewProduct = async function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const code = document.getElementById("productCode").value;
  const qty = parseInt(document.getElementById("productQty").value);
  const category = document.getElementById("productCategory").value;
  const type = document.getElementById("productType").value;
  const isTaxed = document.getElementById("isTaxed").checked;
  const isPopular = document.getElementById("isPopular").checked;
  const showInPOS = document.getElementById("showInPOS").checked;
  const costPrice = parseFloat(document.getElementById("costPrice").value) || 0;
  const sellPrice = parseFloat(document.getElementById("sellPrice").value) || 0;

  const file = document.getElementById("productImage").files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const imageUrl = e.target.result;
      const productData = createProductObject(name, code, qty, category, type, costPrice, sellPrice, isTaxed, isPopular, showInPOS, imageUrl);
      sendProduct(productData);
    };
    reader.readAsDataURL(file);
  } else {
    const productData = createProductObject(name, code, qty, category, type, costPrice, sellPrice, isTaxed, isPopular, showInPOS, "");
    sendProduct(productData);
  }
};

function createProductObject(name, code, quantity, category, type, costPrice, sellPrice, isTaxed, isPopular, showInPOS, image) {
  return {
    name, code, quantity, category, type,
    costPrice, sellPrice, isTaxed, isPopular, showInPOS,
    image,
    createdAt: new Date().toISOString()
  };
}

async function sendProduct(productData) {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    });

    const result = await res.json();
    if (result.status === "success") {
      alert("✅ เพิ่มสินค้าเรียบร้อยแล้ว");
      closeAddModal();
      loadProductsFromSheet();
    } else {
      alert("❌ บันทึกไม่สำเร็จ: " + (result.message || ""));
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาด:", err);
    alert("❌ เกิดข้อผิดพลาดตอนส่งข้อมูล");
  }
}

window.closeAddModal = () => {
  document.getElementById('addProductModal').classList.add('hidden');
};

function previewSelectedImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById("previewImage").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
window.previewSelectedImage = previewSelectedImage;

window.addEventListener("DOMContentLoaded", () => {
  loadProductsFromSheet();
});
