var editId = null;
const jumlah = document.getElementById("jumlah");
const harga = document.getElementById("harga");
const total = document.getElementById("total");
const layanan = document.getElementById("layanan");
const jenisGalon = document.getElementById("jenisGalon");

function setHarga() {

  // 15L
  if (jenisGalon.value === "15L") {

    layanan.value = "Isi Ulang";
    layanan.disabled = true;

    harga.innerHTML =
      `<option value="5000">Rp 5.000</option>`;

    hitungTotal();
    return;
  }


  // 19L FQ
  layanan.disabled = false;

  switch (layanan.value) {

    case "Isi Ulang":
      harga.innerHTML =
        `<option value="6000">Rp 6.000</option>`;
      break;

    case "Antar Jemput":
      harga.innerHTML =
        `<option value="8000">Rp 8.000</option>`;
      break;

    case "Antar Jauh":
      harga.innerHTML =
        `<option value="10000">Rp 10.000</option>`;
      break;

    case "Sewa Baru":
      harga.innerHTML =
        `<option value="10000">Rp 10.000</option>`;
      break;

    case "Titip Warung":
      harga.innerHTML = `
        <option value="7000">Rp 7.000</option>
        <option value="8000">Rp 8.000</option>
        <option value="9000">Rp 9.000</option>
        <option value="10000">Rp 10.000</option>
      `;
      break;
  }

  hitungTotal();
}

function hitungTotal() {
  const qty = Number(jumlah.value) || 0;
  const hargaSatuan = Number(harga.value) || 0;

  total.value = qty * hargaSatuan;
}

layanan.addEventListener("change", setHarga);
jenisGalon.addEventListener("change", setHarga);
jumlah.addEventListener("input", hitungTotal);
harga.addEventListener("change", hitungTotal);

setHarga();

function updateDateTime() {

  const now = new Date();

  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const jam = now.toLocaleTimeString("id-ID");

  document.getElementById("tanggal").textContent = tanggal;
  document.getElementById("jam").textContent = jam + " WIB";
}

updateDateTime();
setInterval(updateDateTime, 1000);
document.getElementById("transaksiForm").addEventListener("submit", async function(e) {

  e.preventDefault();

  const data = {
     id: editId,
    nama: document.getElementById("nama").value,
    jumlah: document.getElementById("jumlah").value,
    jenisGalon: document.getElementById("jenisGalon").value,
    layanan: document.getElementById("layanan").value,
    harga: document.getElementById("harga").value,
    total: document.getElementById("total").value
  };

 try {
  console.log("EDIT ID =", editId);
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxd_gzzXNClIFzNtIm8ALSVg0z5wVO9GbwFpFVuW61wGS50iMVEVy727lAKB0OBMj8j-w/exec",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );

  alert("Transaksi berhasil disimpan!");

editId = null;

document.getElementById("transaksiForm").reset();

setHarga();

setTimeout(() => {
  loadDashboard();
}, 1500);

} catch(error){

  console.error(error);

  alert("Gagal menyimpan transaksi");
}

});
async function loadDashboard() {


  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxd_gzzXNClIFzNtIm8ALSVg0z5wVO9GbwFpFVuW61wGS50iMVEVy727lAKB0OBMj8j-w/exec"
  );

  const data = await response.json();

  window.dataRiwayat = data.riwayat;

  const tbody = document.getElementById("riwayatBody");

  const tanggalAwal =
  document.getElementById("filterAwal")?.value;

const tanggalAkhir =
  document.getElementById("filterAkhir")?.value;

let dataTampil;

if (!tanggalAwal && !tanggalAkhir) {

  dataTampil = data.riwayat;

} else {

  dataTampil = data.riwayat.filter(item => {

    const d = new Date(item.waktu);

    const tgl =
      d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");

    if (tanggalAwal && tgl < tanggalAwal)
      return false;

    if (tanggalAkhir && tgl > tanggalAkhir)
      return false;

    return true;

  });

}
window.dataTampil = dataTampil;

  const pendapatanFilter = dataTampil.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );

  const transaksiFilter = dataTampil.length;

  const galonFilter = dataTampil.reduce(
    (total, item) => total + Number(item.jumlah || 0),
    0
  );

  document.getElementById("pendapatan").textContent =
    "Rp " + pendapatanFilter.toLocaleString("id-ID");

  document.getElementById("transaksi").textContent =
    transaksiFilter;

  document.getElementById("galon").textContent =
    galonFilter;

  tbody.innerHTML = "";

  dataTampil.forEach(item => {

    const waktu = new Date(item.waktu);

    const tanggalFormat =
      waktu.toLocaleDateString("id-ID") +
      " " +
      waktu.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });

    tbody.innerHTML += `
<tr>
  <td>${tanggalFormat}</td>
  <td>${item.nama}</td>
  <td>${item.jumlah}</td>
  <td>Rp ${Number(item.total).toLocaleString("id-ID")}</td>
  <td>
    <button
      class="edit-btn"
      onclick="editData('${item.id}')">
      Edit
    </button>
  </td>
</tr>
`;
  });

}
const hariIni = new Date()
  .toISOString()
  .split("T")[0];

document.getElementById("filterAwal").value = hariIni;
document.getElementById("filterAkhir").value = hariIni;

loadDashboard();

document
.getElementById("filterAwal")
?.addEventListener("change", loadDashboard);

document
.getElementById("filterAkhir")
?.addEventListener("change", loadDashboard);
document
.getElementById("btnResetFilter")
.addEventListener("click", () => {

  document.getElementById("filterAwal").value = "";

document.getElementById("filterAkhir").value = "";

  loadDashboard();



});
function editData(id) {

  const item = window.dataRiwayat.find(x => x.id === id);

  if (!item) return;

  editId = id;

  document.getElementById("nama").value = item.nama;
  document.getElementById("jumlah").value = item.jumlah;
  document.getElementById("jenisGalon").value =
  item.jenisGalon;

document.getElementById("layanan").value =
  item.layanan;

setHarga();

document.getElementById("harga").value =
  item.harga;

  hitungTotal();

  document
    .getElementById("transaksiForm")
    .scrollIntoView({
      behavior: "smooth"
    });

}
document
.getElementById("btnPdf")
.addEventListener("click", generatePDF);
function generatePDF() {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF("p", "mm", "a4");

  const data = window.dataTampil || [];

  if (data.length === 0) {

    alert("Tidak ada data untuk diexport");

    return;
  }

  const pendapatan = data.reduce(
    (t, x) => t + Number(x.total || 0),
    0
  );

  const transaksi = data.length;

  const galon = data.reduce(
    (t, x) => t + Number(x.jumlah || 0),
    0
  );

  const tanggalAwal =
  document.getElementById("filterAwal").value;

const tanggalAkhir =
  document.getElementById("filterAkhir").value;

 doc.setFontSize(18);
doc.text(
  "LAPORAN",
  105,
  15,
  { align: "center" }
);

doc.setFontSize(14);
doc.text(
  "DEPOT AIR MINUM ISI ULANG FIZHAQUA",
  105,
  23,
  { align: "center" }
);
doc.line(14, 25, 196, 26);

  doc.setFontSize(11);

  let namaFile = "";

if (tanggalAwal || tanggalAkhir) {

  if (tanggalAwal === tanggalAkhir) {

    const tanggal =
      new Date(tanggalAwal)
      .toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

    doc.text("Tanggal", 14, 34);
    doc.text(":", 45, 34);
    doc.text(tanggal, 50, 34);

  } else {

    doc.text("Periode", 14, 34);
    doc.text(":", 45, 34);

    doc.text(
      `${tanggalAwal} s/d ${tanggalAkhir}`,
      50,
      34
    );

  }

  namaFile =
    `laporan-${tanggalAwal || "awal"}-sampai-${tanggalAkhir || "akhir"}.pdf`;

} else {

    const semuaTanggal = data.map(x =>
      new Date(x.waktu)
    );

    const minDate =
      new Date(
        Math.min(...semuaTanggal)
      );

    const maxDate =
      new Date(
        Math.max(...semuaTanggal)
      );
      const awalFile =
  minDate.toISOString().split("T")[0];

const akhirFile =
  maxDate.toISOString().split("T")[0];

    const awal =
  minDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

const akhir =
  maxDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
    if (awalFile === akhirFile) {

  doc.text("Tanggal", 14, 34);
  doc.text(":", 45, 34);
  doc.text(awal, 50, 34);

} else {

  doc.text("Periode", 14, 34);
  doc.text(":", 45, 34);
  doc.text(
    `${awal} s/d ${akhir}`,
    50,
    34
  );

}

   namaFile =
  `laporan-${awalFile}-sampai-${akhirFile}.pdf`;
  }

 doc.text("Pendapatan", 14, 46);
doc.text(":", 45, 46);
doc.text(`Rp ${pendapatan.toLocaleString("id-ID")}`, 50, 46);

doc.text("Transaksi", 14, 53);
doc.text(":", 45, 53);
doc.text(`${transaksi}`, 50, 53);

doc.text("Galon", 14, 60);
doc.text(":", 45, 60);
doc.text(`${galon}`, 50, 60);

 const rows = data.map(item => {

  const waktu = new Date(item.waktu);

  const tanggal =
    String(waktu.getDate()).padStart(2, "0") +
    "/" +
    String(waktu.getMonth() + 1).padStart(2, "0") +
    "/" +
    waktu.getFullYear();

  const jam =
    String(waktu.getHours()).padStart(2, "0") +
    ":" +
    String(waktu.getMinutes()).padStart(2, "0");

  return [

    tanggal + " " + jam,

    item.nama,

    item.jumlah,

    item.jenisGalon,

    item.layanan,

    "Rp " +
    Number(item.harga).toLocaleString("id-ID"),

    "Rp " +
    Number(item.total).toLocaleString("id-ID")

  ];

});

doc.autoTable({

  startY: 70,

  head: [[
    "Waktu",
    "Nama",
    "Jumlah",
    "Jenis Galon",
    "Layanan",
    "Harga",
    "Total"
  ]],

  body: rows,

  styles: {
    fontSize: 8
  }

});
window.open(
  doc.output("bloburl")
);

}

document
  .getElementById("btnPdf")
  .addEventListener("click", generatePDF);
