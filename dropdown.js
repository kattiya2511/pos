const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const subdistrictSelect = document.getElementById("subdistrict");

let addressData = [];
let provinceChoices, districtChoices, subdistrictChoices;

async function loadAddressData() {
  const res = await fetch("provinces.json");
  addressData = await res.json();

  // สร้าง province choices
  provinceChoices = new Choices(provinceSelect, { searchEnabled: true, itemSelectText: '' });
  districtChoices = new Choices(districtSelect, { searchEnabled: true, itemSelectText: '' });
  subdistrictChoices = new Choices(subdistrictSelect, { searchEnabled: true, itemSelectText: '' });

  // เติมจังหวัด
  provinceChoices.setChoices(
    addressData.map(p => ({ value: p.id, label: p.name_th })),
    'value',
    'label',
    true
  );
}

// เมื่อเปลี่ยนจังหวัด
provinceSelect?.addEventListener("change", (e) => {
  const provId = +e.target.value;
  const prov = addressData.find(p => p.id === provId);

  if (!prov || !prov.amphure) return;

  districtChoices.clearStore();
  districtChoices.setChoices(
    prov.amphure.map(d => ({ value: d.id, label: d.name_th })),
    'value',
    'label',
    true
  );

  subdistrictChoices.clearStore();
  subdistrictChoices.setChoices([], 'value', 'label', true);
});

// เมื่อเปลี่ยนอำเภอ
districtSelect?.addEventListener("change", (e) => {
  const provId = +provinceSelect.value;
  const distId = +e.target.value;

  const prov = addressData.find(p => p.id === provId);
  const amphure = prov?.amphure.find(a => a.id === distId);

  if (!amphure || !amphure.tambon) return;

  subdistrictChoices.clearStore();
  subdistrictChoices.setChoices(
    amphure.tambon.map(t => ({ value: t.id, label: t.name_th })),
    'value',
    'label',
    true
  );
});



loadAddressData();
