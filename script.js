// ===== 0. PENGAMAN TEKS (data dari form tidak boleh merusak halaman) =====
function esc(teks) {
  return String(teks == null ? "" : teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== 1. NAVBAR BERUBAH SAAT SCROLL =====
const nav = document.getElementById("nav");

function cekScroll() {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", cekScroll);
cekScroll(); // jalankan sekali saat halaman dibuka

// ===== 2. TANDAI MENU HALAMAN AKTIF =====
const namaHalaman = location.pathname.split("/").pop() || "index.html";
const semuaLink = document.querySelectorAll("nav a");

semuaLink.forEach(function (link) {
  if (link.getAttribute("href") === namaHalaman) {
    link.classList.add("active");
  }
});

// ===== 3. MENU MOBILE =====
const menu = document.getElementById("menu");
const burger = document.getElementById("burger");

function tutupMenu() {
  menu.classList.remove("open");
  burger.textContent = "☰";
}

burger.addEventListener("click", function () {
  menu.classList.toggle("open");

  if (menu.classList.contains("open")) {
    burger.textContent = "✕";
  } else {
    burger.textContent = "☰";
  }
});

// Menu menutup otomatis setelah salah satu link diklik
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", tutupMenu);
});

// ===== 4. ANIMASI MUNCUL SAAT SCROLL + COUNTER ANGKA =====
function hitungAngka(elemen) {
  const target = Number(elemen.dataset.count);
  const tambah = Math.max(1, Math.ceil(target / 60));
  let angka = 0;

  const timer = setInterval(function () {
    angka = Math.min(target, angka + tambah);
    elemen.textContent = angka + "+";

    if (angka >= target) {
      clearInterval(timer);
    }
  }, 25);
}

const pengamat = new IntersectionObserver(
  function (daftar) {
    daftar.forEach(function (item) {
      if (!item.isIntersecting) return; // belum terlihat, lewati

      const elemen = item.target;
      elemen.classList.add("show");

      // Kalau ada angka di dalamnya, jalankan counter (sekali saja)
      const angka = elemen.querySelector("[data-count]");
      if (angka && !angka.dataset.sudah) {
        angka.dataset.sudah = "ya";
        hitungAngka(angka);
      }

      pengamat.unobserve(elemen); // berhenti mengamati
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".rv").forEach(function (el) {
  pengamat.observe(el);
});

// ===== 5. DAFTAR PRESTASI (data dari data-prestasi.js) =====
const daftarPrestasi = document.getElementById("daftar-prestasi"); // halaman prestasi.html
const ringkasPrestasi = document.getElementById("prestasi-ringkas"); // beranda

if (window.PRESTASI) {
  if (daftarPrestasi) {
    let html = "";
    PRESTASI.forEach(function (p) {
      html += `
        <button class="card rv has-img pr" data-cat="${esc(p.kategori)}" data-p="${esc(p.id)}">
          <div class="thumb"><img src="${esc(p.foto)}" alt="${esc(p.judul)}" loading="lazy"></div>
          <div class="body">
            <span class="badge">${esc(p.tahun)}</span><span class="badge alt">${esc(p.tingkat)}</span>
            <h3>${esc(p.judul)}</h3>
            <p>${esc(p.nama)} · ${esc(p.prodi)}</p>
            <span class="more">Lihat detail →</span>
          </div>
        </button>`;
    });
    daftarPrestasi.innerHTML = html;
  }

  if (ringkasPrestasi) {
    let html = "";
    PRESTASI.slice(0, 6).forEach(function (p) {
      html += `
        <div class="rv" data-p="${esc(p.id)}" role="button" tabindex="0" aria-label="Lihat detail: ${esc(p.judul)}">
          <img src="${esc(p.foto)}" alt="${esc(p.judul)}" loading="lazy">
          <span class="cap">${esc(p.judul)}</span>
        </div>`;
    });
    ringkasPrestasi.innerHTML = html;
  }

  // Aktifkan animasi muncul untuk kartu yang baru dibuat
  document
    .querySelectorAll("#daftar-prestasi .rv, #prestasi-ringkas .rv")
    .forEach(function (el) {
      pengamat.observe(el);
    });
}

// ===== 5B. DAFTAR KARYA (data dari data-karya.js) =====
const daftarKarya = document.getElementById("daftar-karya"); // halaman karya.html

if (window.KARYA && daftarKarya) {
  let html = "";
  KARYA.forEach(function (k) {
    html += `
      <button class="card rv has-img pr" data-cat="${esc(k.kategori)}" data-k="${esc(k.id)}">
        <div class="thumb"><img src="${esc(k.foto)}" alt="${esc(k.judul)}" loading="lazy"></div>
        <div class="body">
          <span class="badge">${esc(k.kategori)}</span>
          <h3>${esc(k.judul)}</h3>
          <p>${esc(k.ringkas)}</p>
          <small>${esc(k.nama)} · ${esc(k.prodi)}</small>
          <span class="more">Lihat karya →</span>
        </div>
      </button>`;
  });
  daftarKarya.innerHTML = html;

  // Aktifkan animasi muncul untuk kartu yang baru dibuat
  daftarKarya.querySelectorAll(".rv").forEach(function (el) {
    pengamat.observe(el);
  });
}

// ===== 5C. DAFTAR ANGGOTA (data dari data-anggota.js) =====
const daftarAnggota = document.getElementById("daftar-anggota");
const filterAnggota = document.getElementById("filter-anggota");
let ANGGOTA_DETAIL = [];

function linkInstagram(nilai) {
  if (!nilai) return "";
  if (/^https?:\/\//i.test(nilai)) return nilai;
  return "https://instagram.com/" + String(nilai).replace(/^@/, "");
}

if (window.ANGGOTA && daftarAnggota) {
  // Tombol filter dibuat dari divisi yang ada di data
  const divisiAda = [];
  ANGGOTA.forEach(function (a) {
    if (a.divisi && divisiAda.indexOf(a.divisi) === -1)
      divisiAda.push(a.divisi);
  });
  if (filterAnggota) {
    divisiAda.forEach(function (d) {
      filterAnggota.insertAdjacentHTML(
        "beforeend",
        `<button class="flt" data-f="${esc(d)}">${esc(d)}</button>`,
      );
    });
  }

  let html = "";
  ANGGOTA.forEach(function (a) {
    html += `
      <button class="card rv has-img pr" data-cat="${esc(a.divisi)}" data-a="${esc(a.id)}">
        <div class="thumb pot"><img src="${esc(a.foto)}" alt="${esc(a.nama)}" loading="lazy"></div>
        <div class="body">
          <span class="badge">${esc(a.divisi)}</span>
          <h3>${esc(a.nama)}</h3>
          <p>${esc(a.jabatan)}</p>
          <small>${esc(a.prodi)}${a.angkatan ? " · Angkatan " + esc(a.angkatan) : ""}</small>
          <span class="more">Lihat portofolio →</span>
        </div>
      </button>`;
  });
  daftarAnggota.innerHTML = html;
  daftarAnggota.querySelectorAll(".rv").forEach(function (el) {
    pengamat.observe(el);
  });

  // Data jendela detail: profil + prestasi + karya milik anggota (dicocokkan lewat nama)
  ANGGOTA_DETAIL = ANGGOTA.map(function (a) {
    const prestasi = (window.PRESTASI || []).filter(function (p) {
      return p.nama === a.nama;
    });
    const karya = (window.KARYA || []).filter(function (k) {
      return k.nama === a.nama;
    });
    const deskripsi = [a.bio];
    if (prestasi.length) {
      deskripsi.push(
        "Prestasi: " +
          prestasi
            .map(function (p) {
              return p.judul + " (" + p.tahun + ")";
            })
            .join("; ") +
          ".",
      );
    }
    if (karya.length) {
      deskripsi.push(
        "Karya: " +
          karya
            .map(function (k) {
              return k.judul + " (" + k.tahun + ")";
            })
            .join("; ") +
          ".",
      );
    }
    const info = [
      ["Divisi", a.divisi],
      ["Program studi", a.prodi],
      ["Angkatan", a.angkatan],
      ["Asal", a.asal],
      ["Keahlian", a.keahlian],
    ].filter(function (baris) {
      return baris[1];
    });

    return {
      id: a.id,
      judul: a.nama,
      nama: a.jabatan,
      prodi: a.divisi,
      foto: a.foto,
      fotoLain: [],
      angkatan: a.angkatan,
      deskripsi: deskripsi.filter(Boolean),
      info: info,
      tautan: linkInstagram(a.instagram),
      tautanTeks: "Buka Instagram",
    };
  });
}

// ===== 5D. DAFTAR GALERI (data dari data-galeri.js) =====
const daftarGaleri = document.getElementById("daftar-galeri"); // halaman galeri.html
const ringkasGaleri = document.getElementById("galeri-ringkas"); // beranda index.html
const filterGaleri = document.getElementById("filter-galeri");

if (window.GALERI) {
  // Tambahkan tombol filter kategori secara dinamis jika ada kategori baru di data
  if (filterGaleri) {
    const katAda = [];
    filterGaleri.querySelectorAll(".flt").forEach(function (btn) {
      katAda.push(btn.dataset.f);
    });
    GALERI.forEach(function (g) {
      if (g.kategori && katAda.indexOf(g.kategori) === -1) {
        katAda.push(g.kategori);
        filterGaleri.insertAdjacentHTML(
          "beforeend",
          `<button class="flt" data-f="${esc(g.kategori)}">${esc(g.kategori)}</button>`,
        );
      }
    });
  }

  if (daftarGaleri) {
    let html = "";
    GALERI.forEach(function (g) {
      html += `
        <div class="gi rv" data-cat="${esc(g.kategori)}" data-g="${esc(g.id)}" role="button" tabindex="0" aria-label="Lihat kegiatan: ${esc(g.judul)}">
          <img src="${esc(g.foto)}" alt="${esc(g.judul)}" loading="lazy">
          <span class="cap">${esc(g.judul)}</span>
        </div>`;
    });
    daftarGaleri.innerHTML = html;
  }

  if (ringkasGaleri) {
    let html = "";
    GALERI.slice(0, 3).forEach(function (g) {
      html += `
        <div class="rv" data-g="${esc(g.id)}" role="button" tabindex="0" aria-label="${esc(g.judul)}">
          <img src="${esc(g.foto)}" alt="${esc(g.judul)}" loading="lazy">
          <span class="cap">${esc(g.judul)}</span>
        </div>`;
    });
    ringkasGaleri.innerHTML = html;
  }

  // Isi kartu foto bertumpuk di beranda dengan foto dari data-galeri.js
  const stackBg = document.getElementById("galeri-stack-bg");
  if (stackBg && GALERI.length) {
    const cards = stackBg.querySelectorAll(".stack-card img");
    cards.forEach(function (imgEl, idx) {
      const item = GALERI[idx % GALERI.length];
      if (item && item.foto) {
        imgEl.src = item.foto;
        imgEl.alt = item.judul || "Dokumentasi";
      }
    });
  }

  // Aktifkan animasi muncul untuk kartu / foto galeri yang baru dibuat
  document
    .querySelectorAll("#daftar-galeri .rv, #galeri-ringkas .rv")
    .forEach(function (el) {
      pengamat.observe(el);
    });
}

// ===== 6. FILTER KATEGORI (Prestasi, Galeri, Karya) =====
document.querySelectorAll(".filters").forEach(function (grup) {
  grup.addEventListener("click", function (e) {
    const tombol = e.target.closest(".flt");
    if (!tombol) return;

    // Reset tombol aktif, lalu aktifkan yang diklik
    const tombolFilter = grup.querySelectorAll(".flt");
    tombolFilter.forEach(function (t) {
      t.classList.remove("on");
    });
    tombol.classList.add("on");

    // Tampilkan / sembunyikan item sesuai kategori
    const kategori = tombol.dataset.f;
    document.querySelectorAll("[data-cat]").forEach(function (item) {
      const cocok = kategori === "all" || item.dataset.cat === kategori;

      if (cocok) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  });
});

// ===== 7. LIGHTBOX GALERI (Fallback jika tidak ada modal detail #mdl-g) =====
const lightbox = document.getElementById("lb");
const modalGaleriEl = document.getElementById("mdl-g");

if (lightbox && !modalGaleriEl) {
  // Event delegation untuk mendukung item statis maupun dinamis
  document.addEventListener("click", function (e) {
    const gambar = e.target.closest(".gi");
    if (gambar) {
      lightbox.firstElementChild.innerHTML = gambar.innerHTML;
      lightbox.classList.add("on");
    }
  });

  // Dukungan keyboard Enter / Space untuk aksesibilitas
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      const gambar =
        document.activeElement && document.activeElement.closest(".gi");
      if (gambar) {
        e.preventDefault();
        lightbox.firstElementChild.innerHTML = gambar.innerHTML;
        lightbox.classList.add("on");
      }
    }
  });

  lightbox.addEventListener("click", function () {
    lightbox.classList.remove("on");
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      lightbox.classList.remove("on");
    }
  });
}

// ===== 8. TIMELINE SEJARAH (halaman sejarah.html) =====
function buatTimeline(idElemen, dataList) {
  const wadah = document.getElementById(idElemen);
  if (!wadah || !dataList) return; // keluar kalau tidak ada

  let html = "";
  dataList.forEach(function (d) {
    html += `
      <div class="tl rv">
        <b>${d.tahun}</b><br>
        ${d.judul}
        <small>${d.ket}</small>
      </div>`;
  });
  wadah.innerHTML = html;

  // Aktifkan animasi untuk item baru
  wadah.querySelectorAll(".rv").forEach(function (el) {
    pengamat.observe(el);
  });
}

buatTimeline("tl-org", window.SEJARAH);
buatTimeline("tl-ketua", window.KETUA);

// ===== 9. MODAL DETAIL DIVISI (data dari window.DIVISI) =====
const modal = document.getElementById("mdl");

if (modal && window.DIVISI) {
  const isiModal = modal.querySelector(".mdl-c");

  function bukaModal(idDivisi) {
    const d = DIVISI.find(function (x) {
      return x.id === idDivisi;
    });
    if (!d) return;

    // Susun daftar program kerja
    let prokerHtml = "";
    d.proker.forEach(function (p) {
      prokerHtml += `<li>${p}</li>`;
    });

    // Susun daftar anggota
    let anggotaHtml = "";
    d.anggota.forEach(function (a) {
      anggotaHtml += `
        <figure>
          <img src="${a.foto}" alt="${a.nama}" loading="lazy">
          <figcaption><b>${a.nama}</b><span>${a.jabatan}</span></figcaption>
        </figure>`;
    });

    isiModal.innerHTML = `
      <div class="mdl-head">
        <div class="ic">${d.ic}</div>
        <div>
          <h3 id="mdl-t">${d.nama}</h3>
          <small>${d.sub}</small>
        </div>
      </div>
      <div class="mdl-body">
        <h4>Tentang Divisi</h4>
        <p>${d.desc}</p>
        <h4>Program Kerja</h4>
        <ul>${prokerHtml}</ul>
        <h4>Anggota</h4>
        <div class="mem">${anggotaHtml}</div>
      </div>`;

    modal.classList.add("on");
    document.body.style.overflow = "hidden"; // kunci scroll halaman
    isiModal.scrollTop = 0;
  }

  function tutupModal() {
    modal.classList.remove("on");
    document.body.style.overflow = "";
  }

  // Klik kartu divisi -> buka modal
  document.querySelectorAll(".dv").forEach(function (kartu) {
    kartu.addEventListener("click", function () {
      bukaModal(kartu.dataset.d);
    });
  });

  // Klik area gelap atau tombol X -> tutup modal
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest(".mdl-x")) {
      tutupModal();
    }
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      tutupModal();
    }
  });
}

// ===== 10. FOTO OTOMATIS MENYESUAIKAN (portrait / landscape / persegi) =====
// Foto selalu tampil utuh. Latar blur diambil dari foto yang sama.
document
  .querySelectorAll(".ph, .thumb, .gal > div")
  .forEach(function (bingkai) {
    const gambar = bingkai.querySelector("img");
    if (!gambar) return;

    // Isi latar blur dengan foto yang sama
    bingkai.style.setProperty(
      "--bg",
      'url("' + gambar.getAttribute("src") + '")',
    );

    // Foto "Tentang Kami": tinggi kotak mengikuti bentuk foto (dibatasi supaya tetap rapi)
    if (bingkai.classList.contains("ph")) {
      function aturRasio() {
        if (!gambar.naturalWidth) return;
        let rasio = gambar.naturalWidth / gambar.naturalHeight;
        rasio = Math.min(1.6, Math.max(0.75, rasio)); // antara 3:4 dan 16:10
        bingkai.style.aspectRatio = rasio;
      }

      if (gambar.complete) {
        aturRasio();
      } else {
        gambar.addEventListener("load", aturRasio);
      }
    }
  });

// ===== 11. JENDELA DETAIL (dipakai Prestasi dan Karya) =====
// opsi.idModal    : id jendela di HTML
// opsi.data       : daftar data (PRESTASI / KARYA)
// opsi.atribut    : atribut penanda kartu (data-p / data-k)
function pasangDetail(opsi) {
  const modalDetail = document.getElementById(opsi.idModal);
  if (!modalDetail || !opsi.data) return;

  const isiDetail = modalDetail.querySelector(".mdl-c");

  function bukaDetail(idData) {
    const p = opsi.data.find(function (x) {
      return x.id === idData;
    });
    if (!p) return;

    let paragraf = "";
    let daftarDeskripsi = [];
    if (Array.isArray(p.deskripsi)) {
      daftarDeskripsi = p.deskripsi;
    } else if (typeof p.deskripsi === "string" && p.deskripsi.trim()) {
      daftarDeskripsi = p.deskripsi.split(/\r?\n\r?\n|\r?\n/).filter(Boolean);
    }
    daftarDeskripsi.forEach(function (teks) {
      paragraf += `<p>${esc(teks)}</p>`;
    });

    let info = "";
    (p.info || []).forEach(function (baris) {
      info += `<dt>${esc(baris[0])}</dt><dd>${esc(baris[1])}</dd>`;
    });

    let fotoLain = "";
    (p.fotoLain || []).forEach(function (src) {
      fotoLain += `<img src="${esc(src)}" alt="${esc(p.judul)}" loading="lazy">`;
    });

    let subJudul = "";
    if (opsi.subJudul) {
      subJudul = opsi.subJudul(p);
    } else {
      const parts = [p.nama, p.prodi].filter(Boolean);
      if (parts.length) subJudul = parts.join(" · ");
    }

    isiDetail.innerHTML = `
      <div class="pr-foto"><img src="${esc(p.foto)}" alt="${esc(p.judul)}"></div>
      <div class="mdl-body">
        <div class="pr-badges">${opsi.badge(p)}</div>
        <h3 class="pr-judul">${esc(p.judul)}</h3>
        ${subJudul ? '<p class="pr-oleh">' + esc(subJudul) + "</p>" : ""}
        ${paragraf ? "<h4>" + opsi.judulTentang + "</h4>" + paragraf : ""}
        ${info ? '<h4>Keterangan</h4><dl class="pr-info">' + info + "</dl>" : ""}
        ${fotoLain ? "<h4>" + opsi.judulFoto + '</h4><div class="pr-lain">' + fotoLain + "</div>" : ""}
        ${/^https?:\/\//i.test(p.tautan || "") ? '<div class="pr-aksi"><a class="btn" href="' + esc(p.tautan) + '" target="_blank" rel="noopener">' + esc(p.tautanTeks || "Lihat selengkapnya") + "</a></div>" : ""}
      </div>`;

    // Latar blur di belakang foto (supaya foto potret/lanskap tetap rapi)
    isiDetail
      .querySelector(".pr-foto")
      .style.setProperty("--bg", 'url("' + p.foto + '")');

    modalDetail.classList.add("on");
    document.body.style.overflow = "hidden";
    isiDetail.scrollTop = 0;
  }

  function tutupDetail() {
    modalDetail.classList.remove("on");
    document.body.style.overflow = "";
  }

  // Klik kartu mana pun yang punya penanda (beranda maupun halaman daftar)
  document.addEventListener("click", function (e) {
    const kartu = e.target.closest("[" + opsi.atribut + "]");
    if (kartu) bukaDetail(kartu.getAttribute(opsi.atribut));
  });

  // Keyboard: Enter / Spasi pada foto yang berperan sebagai tombol
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    const kartu = e.target.closest
      ? e.target.closest("[" + opsi.atribut + '][role="button"]')
      : null;
    if (kartu) {
      e.preventDefault();
      bukaDetail(kartu.getAttribute(opsi.atribut));
    }
  });

  modalDetail.addEventListener("click", function (e) {
    if (e.target === modalDetail || e.target.closest(".mdl-x")) {
      tutupDetail();
    }
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      tutupDetail();
    }
  });
}

pasangDetail({
  idModal: "mdl-p",
  data: window.PRESTASI,
  atribut: "data-p",
  judulTentang: "Tentang Prestasi",
  judulFoto: "Dokumentasi",
  badge: function (p) {
    return `<span class="badge">${esc(p.tahun)}</span><span class="badge alt">${esc(p.tingkat)}</span><span class="badge alt">${esc(p.kategori)}</span>`;
  },
});

pasangDetail({
  idModal: "mdl-k",
  data: window.KARYA,
  atribut: "data-k",
  judulTentang: "Tentang Karya",
  judulFoto: "Tampilan Karya",
  badge: function (k) {
    return `<span class="badge">${esc(k.kategori)}</span><span class="badge alt">${esc(k.tahun)}</span>`;
  },
});

pasangDetail({
  idModal: "mdl-a",
  data: ANGGOTA_DETAIL,
  atribut: "data-a",
  judulTentang: "Profil & Portofolio",
  judulFoto: "Foto",
  badge: function (a) {
    return `<span class="badge">${esc(a.prodi)}</span>${a.angkatan ? '<span class="badge alt">Angkatan ' + esc(a.angkatan) + "</span>" : ""}`;
  },
});

pasangDetail({
  idModal: "mdl-g",
  data: window.GALERI,
  atribut: "data-g",
  judulTentang: "Penjelasan Kegiatan",
  judulFoto: "Dokumentasi",
  badge: function (g) {
    let b = `<span class="badge">${esc(g.kategori || "Kegiatan")}</span>`;
    if (g.tanggal) {
      b += `<span class="badge alt">📅 ${esc(g.tanggal)}</span>`;
    }
    return b;
  },
  subJudul: function (g) {
    if (g.tanggal) return "Waktu Kegiatan: " + g.tanggal;
    return "";
  },
});
