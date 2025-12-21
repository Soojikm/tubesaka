let chart;

const mainpage = document.getElementById("page1");
const page2 = document.getElementById("page2");

document.getElementById("btnStart").onclick = () => {
  mainpage.style.display = "none";
  page2.style.display = "block";
};

/* =========================
   INPUT
========================= */
function buatInput() {
  const n = parseInt(document.getElementById("jumlahHari").value);
  const div = document.getElementById("formTidur");
  div.innerHTML = "";

  if (isNaN(n) || n <= 0) {
    alert("Jumlah hari tidak valid");
    return;
  }

  // AUTO DUMMY kalau n besar
  const data = document.getElementById("infoDummy");
  if (n >= 20) {
    data.innerHTML = `<b>Mode data dummy aktif</b> (${n} hari)`;
    data.style.display = "block";

    let html = ``;
    for (let i = 0; i < n; i++) {
      const dummy = (4 + Math.random() * 5).toFixed(1);
      html += `<input type="hidden" class="jamTidur" value="${dummy}">`;
    }
    div.innerHTML = html;
    return;
  } else {
    data.style.display = "none";
    
    // Manual
    for (let i = 0; i < n; i++) {
      div.innerHTML += `
    <div class="field">
            Hari ${i + 1}:
            <input type="number" step="0.1" class="jamTidur"><br>
        </div>
            `;
    }
  }
}

function ambilData() {
  const inputs = document.getElementsByClassName("jamTidur");
  let data = [];

  for (let i = 0; i < inputs.length; i++) {
    const val = parseFloat(inputs[i].value);
    if (isNaN(val)) {
      alert("Semua jam tidur harus diisi");
      return null;
    }
    data.push(val);
  }
  return data;
}

/* =========================
   ITERATIF
========================= */
function rataIteratif(arr) {
  let total = 0;
  let i = 0;

  while (i < arr.length) {
    total = total + arr[i];
    i = i + 1;
  }

  let rata = total / arr.length;
  return rata;
}

/* =========================
   REKURSIF AMAN (DIVIDE & CONQUER)
========================= */
function sumRekursifDC(arr, kiri, kanan) {
  // BASIS
  if (kiri == kanan) {
    return arr[kiri];
  }

  // PROSES
  let tengah = Math.floor((kiri + kanan) / 2);

  let jumlahKiri = sumRekursifDC(arr, kiri, tengah);
  let jumlahKanan = sumRekursifDC(arr, tengah + 1, kanan);

  let total = jumlahKiri + jumlahKanan;
  return total;
}

function rataRekursif(arr) {
  let total = sumRekursifDC(arr, 0, arr.length - 1);
  let rata = total / arr.length;
  return rata;
}

/* =========================
   HITUNG & BANDINGKAN
========================= */
function hitungDanBandingkan() {
  const data = ambilData();
  if (!data) return;

  // ITERATIF
  let start = performance.now();
  const rIter = rataIteratif(data);
  const tIter = performance.now() - start;

  // REKURSIF
  start = performance.now();
  const rRek = rataRekursif(data);
  const tRek = performance.now() - start;

  document.getElementById("output").innerHTML = `
        <b>Hasil Perhitungan</b><br>
        Rata-rata Iteratif: ${rIter.toFixed(2)}<br>
        Rata-rata Rekursif: ${rRek.toFixed(2)}<br><br>
        Waktu Iteratif: ${tIter.toFixed(4)} ms<br>
        Waktu Rekursif: ${tRek.toFixed(4)} ms
    `;

  grafikIteratifVsRekursif();
}

/* =========================
   GRAFIK RUNNING TIME
========================= */
function grafikIteratifVsRekursif() {
  const sizes = [100, 500, 1000, 5000, 10000];
  const repeat = 500;
  let iterTimes = [];
  let rekTimes = [];

  for (let n of sizes) {
    const dummy = Array.from({ length: n }, () => Math.random() * 10);

    // Iteratif
    let start = performance.now();
    for (let i = 0; i < repeat; i++) rataIteratif(dummy);
    iterTimes.push((performance.now() - start) / repeat);

    // Rekursif (AMAN)
    start = performance.now();
    for (let i = 0; i < repeat; i++) rataRekursif(dummy);
    rekTimes.push((performance.now() - start) / repeat);
  }

  tampilkanGrafik(sizes, iterTimes, rekTimes);
}

function tampilkanGrafik(n, iter, rek) {
  const ctx = document.getElementById("graph");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: n,
      datasets: [
        { label: "Iteratif", data: iter, borderWidth: 2 },
        { label: "Rekursif (Divide & Conquer)", data: rek, borderWidth: 2 },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Ukuran Input (n)" } },
        y: { title: { display: true, text: "Waktu Eksekusi (ms)" } },
      },
    },
  });
}
