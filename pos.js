// ✅ เพิ่มสินค้าเมื่อคลิกการ์ดสินค้า
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      alert('คลิกสินค้า: ' + card.textContent.trim());
      // 🔄 เพิ่มฟังก์ชันจัดการสินค้าในตะกร้าที่นี่
    });
  });
});

// ✅ ฟังก์ชันเปิด/ปิด Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const topBar = document.querySelector('.top-bar');
  const main = document.getElementById('main');

  sidebar.classList.toggle('hidden');
  topBar.classList.toggle('sidebar-open');
  main.classList.toggle('expanded');
}