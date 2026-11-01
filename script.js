// ===== 1. NAVBAR BERUBAH SAAT SCROLL =====
const nav = document.getElementById('nav');

function cekScroll() {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', cekScroll);
cekScroll(); // jalankan sekali saat halaman dibuka


// ===== 2. TANDAI MENU HALAMAN AKTIF =====
const namaHalaman = location.pathname.split('/').pop() || 'index.html';
const semuaLink = document.querySelectorAll('nav a');

semuaLink.forEach(function (link) {
  if (link.getAttribute('href') === namaHalaman) {
    link.classList.add('active');
  }
});


// ===== 3. MENU MOBILE =====
const menu = document.getElementById('menu');
const burger = document.getElementById('burger');

function tutupMenu() {
  menu.classList.remove('open');
  burger.textContent = '☰';
}

burger.addEventListener('click', function () {
  menu.classList.toggle('open');

  if (menu.classList.contains('open')) {
    burger.textContent = '✕';
  } else {
    burger.textContent = '☰';
  }
});

// Menu menutup otomatis setelah salah satu link diklik
menu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', tutupMenu);
});


// ===== 4. ANIMASI MUNCUL SAAT SCROLL + COUNTER ANGKA =====
function hitungAngka(elemen) {
  const target = Number(elemen.dataset.count);
  const tambah = Math.max(1, Math.ceil(target / 60));
  let angka = 0;

  const timer = setInterval(function () {
    angka = Math.min(target, angka + tambah);
    elemen.textContent = angka + '+';

    if (angka >= target) {
      clearInterval(timer);
    }
  }, 25);
}

const pengamat = new IntersectionObserver(function (daftar) {
  daftar.forEach(function (item) {
    if (!item.isIntersecting) return; // belum terlihat, lewati

    const elemen = item.target;
    elemen.classList.add('show');

    // Kalau ada angka di dalamnya, jalankan counter (sekali saja)
    const angka = elemen.querySelector('[data-count]');
    if (angka && !angka.dataset.sudah) {
      angka.dataset.sudah = 'ya';
      hitungAngka(angka);
    }

    pengamat.unobserve(elemen); // berhenti mengamati
  });
}, { threshold: 0.15 });

document.querySelectorAll('.rv').forEach(function (el) {
  pengamat.observe(el);
});


// ===== 5. FILTER KATEGORI (Prestasi, Galeri, Karya) =====
const semuaItem = document.querySelectorAll('[data-cat]');

document.querySelectorAll('.filters').forEach(function (grup) {
  const tombolFilter = grup.querySelectorAll('.flt');

  tombolFilter.forEach(function (tombol) {
    tombol.addEventListener('click', function () {
      // Reset tombol aktif, lalu aktifkan yang diklik
      tombolFilter.forEach(function (t) {
        t.classList.remove('on');
      });
      tombol.classList.add('on');

      // Tampilkan / sembunyikan item sesuai kategori
      const kategori = tombol.dataset.f;

      semuaItem.forEach(function (item) {
        const cocok = kategori === 'all' || item.dataset.cat === kategori;

        if (cocok) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
});


// ===== 6. LIGHTBOX GALERI =====
const lightbox = document.getElementById('lb');

if (lightbox) {
  document.querySelectorAll('.gi').forEach(function (gambar) {
    gambar.addEventListener('click', function () {
      lightbox.firstElementChild.innerHTML = gambar.innerHTML;
      lightbox.classList.add('on');
    });
  });

  lightbox.addEventListener('click', function () {
    lightbox.classList.remove('on');
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      lightbox.classList.remove('on');
    }
  });
}


// ===== 7. TIMELINE SEJARAH (halaman sejarah.html) =====
function buatTimeline(idElemen, dataList) {
  const wadah = document.getElementById(idElemen);
  if (!wadah || !dataList) return; // keluar kalau tidak ada

  let html = '';
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
  wadah.querySelectorAll('.rv').forEach(function (el) {
    pengamat.observe(el);
  });
}

buatTimeline('tl-org', window.SEJARAH);
buatTimeline('tl-ketua', window.KETUA);


// ===== 8. MODAL DETAIL DIVISI (data dari window.DIVISI) =====
const modal = document.getElementById('mdl');

if (modal && window.DIVISI) {
  const isiModal = modal.querySelector('.mdl-c');

  function bukaModal(idDivisi) {
    const d = DIVISI.find(function (x) {
      return x.id === idDivisi;
    });
    if (!d) return;

    // Susun daftar program kerja
    let prokerHtml = '';
    d.proker.forEach(function (p) {
      prokerHtml += `<li>${p}</li>`;
    });

    // Susun daftar anggota
    let anggotaHtml = '';
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

    modal.classList.add('on');
    document.body.style.overflow = 'hidden'; // kunci scroll halaman
    isiModal.scrollTop = 0;
  }

  function tutupModal() {
    modal.classList.remove('on');
    document.body.style.overflow = '';
  }

  // Klik kartu divisi -> buka modal
  document.querySelectorAll('.dv').forEach(function (kartu) {
    kartu.addEventListener('click', function () {
      bukaModal(kartu.dataset.d);
    });
  });

  // Klik area gelap atau tombol X -> tutup modal
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('.mdl-x')) {
      tutupModal();
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      tutupModal();
    }
  });
}