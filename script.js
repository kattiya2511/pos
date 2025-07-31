// ✅ ใช้ Firebase Auth อย่างเดียว (ไม่ใช้ Firestore)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWdMC53F7cTDODlaB__DUeWvssElyRh-0",
  authDomain: "pos-shop-7ad71.firebaseapp.com",
  projectId: "pos-shop-7ad71",
  storageBucket: "pos-shop-7ad71.appspot.com",
  messagingSenderId: "885384810023",
  appId: "1:885384810023:web:101fa4971085da93284802"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SHEET_URL = "https://script.google.com/macros/s/AKfycbz_wciGBcNg6P7X_68ZHI-qS7op2lvNN7l87iSLv9XPjWGG7heDLtQdqgM-iSZIOv9_uw/exec";

async function saveToSheet(data) {
  try {
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    console.log("✅ ส่งข้อมูลสำเร็จ:", result);
  } catch (err) {
    console.error("❌ ส่งข้อมูลล้มเหลว:", err);
  }
}

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

const loginBtn = document.getElementById("login-btn");
loginBtn?.addEventListener("click", async () => {
  const email = emailEl.value.trim();
  const password = passwordEl.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    await Swal.fire({ icon: "success", title: "เข้าสู่ระบบสำเร็จ!", timer: 1500, showConfirmButton: false });
    window.location.href = "pos.html";
  } catch (e) {
    Swal.fire({ icon: "error", title: "อีเมล หรือ รหัสผ่านไม่ถูกต้อง", text: "โปรดลองอีกครั้ง" });
  }
});

document.getElementById("register-btn")?.addEventListener("click", () => {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
});

document.getElementById("google-btn")?.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    await Swal.fire({ icon: "success", title: "เข้าสู่ระบบด้วย Google สำเร็จ!", timer: 1500, showConfirmButton: false });
    window.location.href = "pos.html";
  } catch (e) {
    Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: e.message });
  }
});

document.getElementById("forgot-password")?.addEventListener("click", async () => {
  const email = emailEl.value.trim();
  if (!email) return Swal.fire({ icon: "warning", title: "กรุณากรอกอีเมล" });

  const confirm = await Swal.fire({
    icon: "question",
    title: "ยืนยันการส่งลิงก์?",
    text: `ต้องการส่งลิงก์รีเซ็ตรหัสผ่านไปที่: ${email}`,
    showCancelButton: true,
    confirmButtonText: "ใช่, ส่งเลย",
    cancelButtonText: "ยกเลิก"
  });

  if (!confirm.isConfirmed) return;

  try {
    await sendPasswordResetEmail(auth, email);
    Swal.fire({ icon: "success", title: "ส่งลิงก์แล้ว!", timer: 4000 });
  } catch (e) {
    Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: e.message });
  }
});

document.getElementById("create-shop-btn")?.addEventListener("click", async () => {
  const nationalId = document.getElementById("nationalId")?.value || "";
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("emailReg").value;
  const password = document.getElementById("passwordReg").value;
  const confirmPassword = document.getElementById("confirmPasswordReg").value;

  if (!/^[0-9]{13}$/.test(nationalId)) return Swal.fire("เลขบัตรประชาชนไม่ถูกต้อง");
  if (!/^[0-9]{9,10}$/.test(phone)) return Swal.fire("เบอร์โทรไม่ถูกต้อง");
  if (password !== confirmPassword) return Swal.fire("รหัสผ่านไม่ตรงกัน");

  try {
    const uc = await createUserWithEmailAndPassword(auth, email, password);
    const uid = uc.user.uid;

    const provEl = document.getElementById("province");
    const distEl = document.getElementById("district");
    const subEl = document.getElementById("subdistrict");

    const data = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      shopName: document.getElementById("shopName").value,
      nationalId,
      phone,
      email,
      province: provEl.options[provEl.selectedIndex]?.text || "",
      district: distEl.options[distEl.selectedIndex]?.text || "",
      subdistrict: subEl.options[subEl.selectedIndex]?.text || "",
      createdAt: new Date().toISOString(),
      uid,
      type: "register"
    };

    await saveToSheet(data);
    await Swal.fire({ icon: "success", title: "สร้างร้านสำเร็จ!", timer: 1500 });
    window.location.href = "pos.html";
  } catch (err) {
    Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: err.message });
  }
});

document.getElementById("back-to-login")?.addEventListener("click", () => {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
});