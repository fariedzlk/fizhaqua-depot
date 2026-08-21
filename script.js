var editId = null;
var editPengeluaranId = null;
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
document
  .getElementById("transaksiForm")
  .addEventListener("submit", async function(e) {

    e.preventDefault();

    const btnSimpan =
      this.querySelector('button[type="submit"]');

    if (btnSimpan.disabled) return;

    btnSimpan.disabled = true;

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
  "https://script.google.com/macros/s/AKfycbwbP1iQ8X2y-e7Wuo4H_ki6nlg754TmcpT4JSiaQPWq9ae1M0xWU54lsntQu0BhVwX-0Q/exec",
  {
    method: "POST",
    body: JSON.stringify(data)
  }
);

tampilkanNotif(
  "Transaksi berhasil disimpan",
  "success"
);

editId = null;

document.getElementById("transaksiForm").reset();

setHarga();

setTimeout(() => {
  loadDashboard();
}, 1500);

} catch(error) {

  console.error(error);

tampilkanNotif(
  "Gagal menyimpan transaksi",
  "error"
);

} finally {

  btnSimpan.disabled = false;

}

});
async function loadDashboard() {

  try {

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwbP1iQ8X2y-e7Wuo4H_ki6nlg754TmcpT4JSiaQPWq9ae1M0xWU54lsntQu0BhVwX-0Q/exec"
    );

    const data = await response.json();


    // =========================
    // DATA
    // =========================

    window.dataRiwayat =
      data.riwayat || [];

    window.dataPengeluaran =
      data.pengeluaran || [];


    // =========================
    // FILTER TANGGAL
    // =========================

    const tanggalAwal =
      document.getElementById("filterAwal")?.value || "";

    const tanggalAkhir =
      document.getElementById("filterAkhir")?.value || "";


    function filterTanggal(item) {

      const d =
        new Date(item.waktu);

      const tgl =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0");


      if (
        tanggalAwal &&
        tgl < tanggalAwal
      ) {
        return false;
      }


      if (
        tanggalAkhir &&
        tgl > tanggalAkhir
      ) {
        return false;
      }


      return true;

    }


    // =========================
    // TRANSAKSI SESUAI FILTER
    // =========================

    let dataTampil =
      window.dataRiwayat.filter(
        filterTanggal
      );


    // =========================
    // PENGELUARAN SESUAI FILTER
    // =========================

    let pengeluaranTampil =
      window.dataPengeluaran.filter(
        filterTanggal
      );

      // =========================
// KELOMPOK PENGELUARAN
// SESUAI PERIODE FILTER
// =========================

const pengeluaranHarianPeriode =
  pengeluaranTampil.filter(
    item => item.jenis === "Harian"
  );

const pengeluaranBerkalaPeriode =
  pengeluaranTampil.filter(
    item => item.jenis === "Berkala"
  );

const pengeluaranBulananPeriode =
  pengeluaranTampil.filter(
    item => item.jenis === "Bulanan"
  );

const totalPengeluaranHarianPeriode =
  pengeluaranHarianPeriode.reduce(
    (total, item) =>
      total + Number(item.nominal || 0),
    0
  );

const totalPengeluaranBerkalaPeriode =
  pengeluaranBerkalaPeriode.reduce(
    (total, item) =>
      total + Number(item.nominal || 0),
    0
  );

const totalPengeluaranBulananPeriode =
  pengeluaranBulananPeriode.reduce(
    (total, item) =>
      total + Number(item.nominal || 0),
    0
  );

const totalPengeluaranPeriode =
  totalPengeluaranHarianPeriode +
  totalPengeluaranBerkalaPeriode +
  totalPengeluaranBulananPeriode;


    // Simpan untuk kebutuhan lain
    window.dataTampil =
      dataTampil;

    window.dataPengeluaranTampil =
      pengeluaranTampil;


    // =========================
    // HITUNG PENDAPATAN
    // =========================

    const pendapatanKotor =
      dataTampil.reduce(
        (total, item) =>
          total +
          Number(item.total || 0),
        0
      );


// =========================
// HITUNG PENGELUARAN HARIAN
// =========================

const pengeluaranHarian =
  pengeluaranTampil.filter(
    item => item.jenis === "Harian"
  );

const totalPengeluaranHarian =
  pengeluaranHarian.reduce(
    (total, item) =>
      total +
      Number(item.nominal || 0),
    0
  );

// =========================
// PENDAPATAN BERSIH
// =========================

const pendapatanBersih =
  tanggalAwal &&
  tanggalAkhir &&
  tanggalAwal === tanggalAkhir
    ? pendapatanKotor - totalPengeluaranHarianPeriode
    : pendapatanKotor - totalPengeluaranPeriode;

    // =========================
    // JUMLAH TRANSAKSI
    // =========================

    const transaksiFilter =
      dataTampil.length;


    // =========================
    // JUMLAH GALON
    // =========================

    const galonFilter =
      dataTampil.reduce(
        (total, item) =>
          total +
          Number(item.jumlah || 0),
        0
      );


    // =========================
    // TAMPIL DASHBOARD
    // =========================

    document
      .getElementById("pendapatan")
      .textContent =
        "Rp " +
        pendapatanBersih.toLocaleString(
          "id-ID"
        );


    document
      .getElementById("transaksi")
      .textContent =
        transaksiFilter;


    document
      .getElementById("galon")
      .textContent =
        galonFilter;

    document
  .getElementById("pengeluaran")
  .textContent =
    "Rp " +
    totalPengeluaranPeriode.toLocaleString(
      "id-ID"
    );


    // =========================
    // RIWAYAT TRANSAKSI
    // =========================

    const tbody =
      document.getElementById(
        "riwayatBody"
      );


    if (tbody) {

      tbody.innerHTML = "";


      dataTampil.forEach(item => {

        const waktu =
          new Date(item.waktu);


        const tanggalFormat =
          waktu.toLocaleDateString(
            "id-ID"
          ) +
          " " +
          waktu.toLocaleTimeString(
            "id-ID",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          );


        tbody.innerHTML += `
          <tr>

            <td>
              ${tanggalFormat}
            </td>

            <td>
              ${item.nama}
            </td>

            <td>
              ${item.jumlah}
            </td>

            <td>
              Rp ${Number(
                item.total
              ).toLocaleString("id-ID")}
            </td>

            <td>

              <button
                class="edit-btn"
                onclick="editData('${item.id}')"
              >
                Edit
              </button>

            </td>

          </tr>
        `;

      });

    }


    // =========================
    // RIWAYAT PENGELUARAN
    // =========================

    const pengeluaranBody =
      document.getElementById(
        "pengeluaranBody"
      );


    if (pengeluaranBody) {

      pengeluaranBody.innerHTML = "";


      pengeluaranTampil.forEach(item => {

        const waktu =
          new Date(item.waktu);


        const tanggalFormat =
          waktu.toLocaleDateString(
            "id-ID"
          ) +
          " " +
          waktu.toLocaleTimeString(
            "id-ID",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          );


        pengeluaranBody.innerHTML += `
  <tr>

    <td>
      ${tanggalFormat}
    </td>

    <td>
      ${item.jenis}
    </td>

    <td>
      ${item.keterangan}
    </td>

    <td>
      Rp ${Number(
        item.nominal
      ).toLocaleString("id-ID")}
    </td>

    <td>

  <button
    class="edit-btn"
    onclick="editPengeluaran('${item.id}')"
  >
    Edit
  </button>

 <button
  class="delete-btn"
  onclick="hapusPengeluaran('${item.id}')"
>
  Hapus
</button>

</td>

  </tr>
`;

      });

    }


  } catch (error) {

    console.error(
      "GAGAL LOAD DASHBOARD:",
      error
    );

  }

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

  const doc =
    new jsPDF("p", "mm", "a4");


  // =========================
  // DATA SESUAI FILTER
  // =========================

const data =
  window.dataTampil || [];

const dataPengeluaran =
  window.dataPengeluaranTampil || [];


// =========================
// FILTER TANGGAL
// =========================

const tanggalAwal =
  document
    .getElementById("filterAwal")
    .value;

const tanggalAkhir =
  document
    .getElementById("filterAkhir")
    .value;
  // Kalau benar-benar tidak ada data
  if (
    data.length === 0 &&
    dataPengeluaran.length === 0
  ) {

    alert(
      "Tidak ada data untuk diexport"
    );

    return;
  }


  // =========================
  // HITUNG TRANSAKSI
  // =========================

  const pendapatan =
    data.reduce(
      (total, item) =>
        total +
        Number(item.total || 0),
      0
    );


  const transaksi =
    data.length;


  const galon =
    data.reduce(
      (total, item) =>
        total +
        Number(item.jumlah || 0),
      0
    );


  // =========================
  // HITUNG PENGELUARAN
  // =========================

let pengeluaranUntukHitung = dataPengeluaran;

// Jika filter hanya 1 tanggal,
// yang mengurangi pendapatan hanya Harian
if (
  tanggalAwal &&
  tanggalAkhir &&
  tanggalAwal === tanggalAkhir
) {
  pengeluaranUntukHitung =
    dataPengeluaran.filter(
      item =>
        String(item.jenis).toLowerCase() === "harian"
    );
}

// Jika filter lebih dari 1 tanggal,
// semua kategori yang masuk periode ikut dihitung
const totalPengeluaran =
  pengeluaranUntukHitung.reduce(
    (total, item) =>
      total +
      Number(item.nominal || 0),
    0
  );


  // =========================
  // PENDAPATAN BERSIH
  // =========================

  const pendapatanBersih =
    pendapatan -
    totalPengeluaran;




  // =========================
  // HEADER
  // =========================

  doc.setFontSize(18);

  doc.text(
    "LAPORAN",
    105,
    15,
    {
      align: "center"
    }
  );


  doc.setFontSize(14);

  doc.text(
    "DEPOT AIR MINUM ISI ULANG FIZHAQUA",
    105,
    23,
    {
      align: "center"
    }
  );


  doc.line(
    14,
    25,
    196,
    26
  );


  doc.setFontSize(11);


  // =========================
  // TANGGAL / PERIODE
  // =========================

  let namaFile = "";


  if (
    tanggalAwal ||
    tanggalAkhir
  ) {

    if (
      tanggalAwal ===
      tanggalAkhir
    ) {

      const tanggal =
        new Date(
          tanggalAwal
        ).toLocaleDateString(
          "id-ID",
          {
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        );


      doc.text(
        "Tanggal",
        14,
        34
      );

      doc.text(
        ":",
        45,
        34
      );

      doc.text(
        tanggal,
        50,
        34
      );

    } else {

doc.text(
  "Periode",
  14,
  34
);

doc.text(
  ":",
  60,
  34
);

const awalFormatted =
  new Date(tanggalAwal + "T00:00:00")
    .toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

const akhirFormatted =
  new Date(tanggalAkhir + "T00:00:00")
    .toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

doc.text(
  `${awalFormatted} s/d ${akhirFormatted}`,
  66,
  34
);
    }


    namaFile =
      `laporan-${tanggalAwal || "awal"}-sampai-${tanggalAkhir || "akhir"}.pdf`;

  } else {

    // =========================
    // TANPA FILTER
    // =========================

    const semuaTanggal =
      data.map(
        item =>
          new Date(item.waktu)
      );


    // Kalau transaksi kosong,
    // gunakan tanggal pengeluaran
    if (
      semuaTanggal.length === 0
    ) {

      const tanggalPengeluaran =
        dataPengeluaran.map(
          item =>
            new Date(item.waktu)
        );

      semuaTanggal.push(
        ...tanggalPengeluaran
      );

    }


    const minDate =
      new Date(
        Math.min(
          ...semuaTanggal
        )
      );


    const maxDate =
      new Date(
        Math.max(
          ...semuaTanggal
        )
      );


    const awalFile =
      minDate
        .toISOString()
        .split("T")[0];


    const akhirFile =
      maxDate
        .toISOString()
        .split("T")[0];


    const awal =
      minDate.toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );


    const akhir =
      maxDate.toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );


    if (
      awalFile ===
      akhirFile
    ) {

      doc.text(
        "Tanggal",
        14,
        34
      );

      doc.text(
        ":",
        45,
        34
      );

      doc.text(
        awal,
        50,
        34
      );

    } else {

doc.text(
  "Tanggal",
  14,
  34
);

doc.text(
  ":",
  60,
  34
);

doc.text(
  awal,
  66,
  34
);
    }


    namaFile =
      `laporan-${awalFile}-sampai-${akhirFile}.pdf`;

  }


  // =========================
  // RINGKASAN
  // =========================

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    0,
    0,
    0
  );


// =========================
// RINGKASAN LAPORAN
// =========================

doc.setFont("helvetica", "normal");
doc.setTextColor(0, 0, 0);

// Pendapatan
doc.text(
  "Pendapatan",
  14,
  46
);

doc.text(
  ":",
  60,
  46
);

doc.text(
  `Rp ${pendapatan.toLocaleString("id-ID")}`,
  66,
  46
);


// Pengeluaran
doc.text(
  "Pengeluaran",
  14,
  54
);

doc.text(
  ":",
  60,
  54
);

doc.text(
  totalPengeluaran > 0
    ? `Rp ${totalPengeluaran.toLocaleString("id-ID")}`
    : "-",
  66,
  54
);


// Transaksi
doc.text(
  "Transaksi",
  14,
  62
);

doc.text(
  ":",
  60,
  62
);

doc.text(
  `${transaksi}`,
  66,
  62
);


// Galon
doc.text(
  "Galon",
  14,
  70
);

doc.text(
  ":",
  60,
  70
);

doc.text(
  `${galon}`,
  66,
  70
);


// Pendapatan Bersih
doc.setFont(
  "helvetica",
  "bold"
);

doc.setTextColor(
  0,
  132,
  209
);

doc.text(
  "Pendapatan Bersih",
  14,
  80
);

doc.text(
  ":",
  60,
  80
);

doc.text(
  `Rp ${pendapatanBersih.toLocaleString("id-ID")}`,
  66,
  80
);


// Kembalikan normal
doc.setFont(
  "helvetica",
  "normal"
);

doc.setTextColor(
  0,
  0,
  0
);

  // =========================
  // TABEL TRANSAKSI
  // =========================

  if (data.length > 0) {

    const rows =
      data.map(
        item => {

          const waktu =
            new Date(
              item.waktu
            );


          const tanggal =
            String(
              waktu.getDate()
            ).padStart(2, "0") +
            "/" +
            String(
              waktu.getMonth() + 1
            ).padStart(2, "0") +
            "/" +
            waktu.getFullYear();


          const jam =
            String(
              waktu.getHours()
            ).padStart(2, "0") +
            ":" +
            String(
              waktu.getMinutes()
            ).padStart(2, "0");


          return [

            tanggal +
              " " +
              jam,

            item.nama,

            item.jumlah,

            item.jenisGalon,

            item.layanan,

            "Rp " +
              Number(
                item.harga || 0
              ).toLocaleString(
                "id-ID"
              ),

            "Rp " +
              Number(
                item.total || 0
              ).toLocaleString(
                "id-ID"
              )

          ];

        }
      );


doc.autoTable({

  startY: 88,

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
  fontSize: 8,
  textColor: [0, 0, 0]
},

headStyles: {
  fillColor: [0, 132, 209],
  textColor: 255,
  fontStyle: "bold"
}

});
  }


  // =========================
  // TABEL PENGELUARAN
  // =========================

  let dataPengeluaranPDF =
  dataPengeluaran;

if (
  tanggalAwal &&
  tanggalAkhir &&
  tanggalAwal === tanggalAkhir
) {
  dataPengeluaranPDF =
    dataPengeluaran.filter(
      item =>
        String(item.jenis).toLowerCase() === "harian"
    );
}

if (dataPengeluaranPDF.length > 0) {

    const rowsPengeluaran =
  dataPengeluaranPDF.map(
        item => {

          const waktu =
            new Date(
              item.waktu
            );


          const tanggal =
            String(
              waktu.getDate()
            ).padStart(2, "0") +
            "/" +
            String(
              waktu.getMonth() + 1
            ).padStart(2, "0") +
            "/" +
            waktu.getFullYear();


          const jam =
            String(
              waktu.getHours()
            ).padStart(2, "0") +
            ":" +
            String(
              waktu.getMinutes()
            ).padStart(2, "0");


          return [

            tanggal +
              " " +
              jam,

            item.jenis,

            item.keterangan,

            "Rp " +
              Number(
                item.nominal || 0
              ).toLocaleString(
                "id-ID"
              )

          ];

        }
      );


    // Tentukan posisi tabel
    // berdasarkan tabel sebelumnya

    let posisiTabelPengeluaran = 84;


    if (
      data.length > 0 &&
      doc.lastAutoTable
    ) {

      posisiTabelPengeluaran =
        doc.lastAutoTable.finalY + 10;

    }


doc.autoTable({

  startY: posisiTabelPengeluaran,

  head: [[
    "Waktu",
    "Jenis",
    "Keterangan",
    "Nominal"
  ]],

  body: rowsPengeluaran,

styles: {
  fontSize: 8,
  textColor: [0, 0, 0]
},

headStyles: {
  fillColor: [220, 53, 69],
  textColor: 255,
  fontStyle: "bold"
}

});

  }


  // =========================
  // BUKA PDF
  // =========================

  window.open(
    doc.output("bloburl")
  );

}

document
  .getElementById("btnPdf")
  .addEventListener("click", generatePDF);

// =========================
// FORM PENGELUARAN
// =========================

const btnTambahPengeluaran =
  document.getElementById("btnTambahPengeluaran");

const formPengeluaran =
  document.getElementById("formPengeluaran");

const btnBatalPengeluaran =
  document.getElementById("btnBatalPengeluaran");

const tanggalPengeluaran =
  document.getElementById("tanggalPengeluaran");


// Buka / tutup form pengeluaran
btnTambahPengeluaran.addEventListener("click", () => {

  const sedangTerbuka =
    formPengeluaran.style.display === "block";

  if (sedangTerbuka) {

    // Tutup form
    formPengeluaran.style.display = "none";

    btnTambahPengeluaran.textContent =
      "+ Tambah Pengeluaran";

  } else {

    // Buka form
    formPengeluaran.style.display = "block";

    btnTambahPengeluaran.textContent =
      "− Tutup Pengeluaran";

    // Tanggal otomatis hari ini
    const hariIni =
      new Date().toISOString().split("T")[0];

    tanggalPengeluaran.value = hariIni;

  }

});


// Tombol Batal
btnBatalPengeluaran.addEventListener("click", () => {

  formPengeluaran.style.display = "none";

  btnTambahPengeluaran.textContent =
    "+ Tambah Pengeluaran";

});

// =========================
// SIMPAN PENGELUARAN
// =========================

document
  .getElementById("btnSimpanPengeluaran")
  .addEventListener("click", async () => {

    const jenis =
      document.getElementById("jenisPengeluaran").value;

    const keterangan =
      document.getElementById("keteranganPengeluaran").value.trim();

    const nominal =
      document.getElementById("nominalPengeluaran").value;

    const tanggal =
      document.getElementById("tanggalPengeluaran").value;


    // Validasi
    if (!keterangan || !nominal || !tanggal) {

      alert("Lengkapi data pengeluaran terlebih dahulu");

      return;
    }
    const btnSimpan =
  document.getElementById("btnSimpanPengeluaran");

btnSimpan.disabled = true;


const data = {

  tipe: "pengeluaran",

  mode: editPengeluaranId
    ? "edit"
    : "tambah",

  id: editPengeluaranId || null,

  jenis: jenis,

  keterangan: keterangan,

  nominal: Number(nominal),

  tanggal: tanggal
};
    


    try {

const response = await fetch(
  "https://script.google.com/macros/s/AKfycbwbP1iQ8X2y-e7Wuo4H_ki6nlg754TmcpT4JSiaQPWq9ae1M0xWU54lsntQu0BhVwX-0Q/exec",
  {
    method: "POST",
    body: JSON.stringify(data)
  }
);


const hasil = await response.text();

console.log("RESPONSE APPS SCRIPT =", hasil);

console.log("Pengeluaran berhasil dikirim");

editPengeluaranId = null;

document
  .getElementById("btnSimpanPengeluaran")
  .textContent = "Simpan";

// Reset form
document
  .getElementById("keteranganPengeluaran")
  .value = "";

document
  .getElementById("nominalPengeluaran")
  .value = "";

// Tutup form
formPengeluaran.style.display = "none";

btnTambahPengeluaran.textContent =
  "+ Tambah Pengeluaran";

// POPUP SATU KALI
tampilkanNotif(
  "Pengeluaran berhasil disimpan",
  "success"
);

// Refresh dashboard setelah popup
loadDashboard();


    } catch (error) {

  console.error(error);

  tampilkanNotif(
  "Gagal menyimpan pengeluaran",
  "error"
);

} finally {

  document
    .getElementById("btnSimpanPengeluaran")
    .disabled = false;

}

  });
  function editPengeluaran(id) {

  const item =
    window.dataPengeluaran.find(
      x => x.id === id
    );

  if (!item) return;

  editPengeluaranId = id;

  document.getElementById(
    "jenisPengeluaran"
  ).value = item.jenis;

  document.getElementById(
    "keteranganPengeluaran"
  ).value = item.keterangan;

  document.getElementById(
    "nominalPengeluaran"
  ).value = item.nominal;

  const waktu =
    new Date(item.waktu);

  const tanggal =
    waktu.getFullYear() +
    "-" +
    String(
      waktu.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      waktu.getDate()
    ).padStart(2, "0");

  document.getElementById(
    "tanggalPengeluaran"
  ).value = tanggal;

  formPengeluaran.style.display =
    "block";

  btnTambahPengeluaran.textContent =
    "− Tutup Pengeluaran";

  document
    .getElementById("btnSimpanPengeluaran")
    .textContent =
      "Simpan Perubahan";

  formPengeluaran.scrollIntoView({
    behavior: "smooth"
  });
}
async function hapusPengeluaran(id) {

  tampilkanKonfirmasi(
    "Yakin ingin menghapus pengeluaran ini?",
    async () => {

      try {

        const response =
          await fetch(
            "https://script.google.com/macros/s/AKfycbwbP1iQ8X2y-e7Wuo4H_ki6nlg754TmcpT4JSiaQPWq9ae1M0xWU54lsntQu0BhVwX-0Q/exec",
            {
              method: "POST",

              body: JSON.stringify({
                tipe: "pengeluaran",
                mode: "hapus",
                id: id
              })
            }
          );

        const hasil =
          await response.json();

        console.log(
          "RESPONSE HAPUS =",
          hasil
        );


        if (!hasil.success) {

          tampilkanNotif(
            "Gagal menghapus pengeluaran",
            "error"
          );

          return;
        }


        // Refresh dashboard
        await loadDashboard();


        // Notifikasi berhasil
        tampilkanNotif(
          "Pengeluaran berhasil dihapus!",
          "success"
        );

      } catch (error) {

        console.error(error);

        tampilkanNotif(
          "Gagal menghapus pengeluaran",
          "error"
        );

      }

    }
  );

}
function tampilkanNotif(pesan, tipe = "success") {

  const notif =
    document.createElement("div");

  const icon =
    tipe === "success" ? "✓" : "✕";

  notif.className =
    `custom-notif ${tipe}`;

  notif.innerHTML = `
    <div class="custom-notif-icon">
      ${icon}
    </div>

    <div>
      ${pesan}
    </div>
  `;

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("show");
  }, 10);

  setTimeout(() => {

    notif.classList.remove("show");

    setTimeout(() => {
      notif.remove();
    }, 250);

  }, 2500);

}

function tampilkanKonfirmasi(pesan, callback) {

  const overlay =
    document.createElement("div");

  overlay.className =
    "confirm-overlay";

  overlay.innerHTML = `
    <div class="confirm-box">

      <div class="confirm-icon">
        !
      </div>

      <h3>Konfirmasi Hapus</h3>

      <p>${pesan}</p>

      <div class="confirm-actions">

        <button
          type="button"
          class="confirm-cancel">
          Batal
        </button>

        <button
          type="button"
          class="confirm-delete">
          Hapus
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add("show");
  }, 10);


  // BATAL
  overlay
    .querySelector(".confirm-cancel")
    .addEventListener("click", () => {

      overlay.classList.remove("show");

      setTimeout(() => {
        overlay.remove();
      }, 200);

    });


  // HAPUS
  overlay
    .querySelector(".confirm-delete")
    .addEventListener("click", () => {

      overlay.classList.remove("show");

      setTimeout(() => {

        overlay.remove();

        callback();

      }, 200);

    });

}