// =====================================================================
//  DASBOR PENGURUS — isi data anggota, prestasi, dan karya
//  Data disimpan di peramban (localStorage), lalu diunduh sebagai
//  data-anggota.js / data-prestasi.js / data-karya.js untuk dipasang di situs.
// =====================================================================
(function () {
  'use strict';

  if (sessionStorage.getItem('css_login') !== '1') {
    location.replace('login.html');
    return;
  }

  const KUNCI = 'cssmora_admin_data_v1';
  const DIVISI = ['Badan Pengurus Harian', 'PSDM', 'P3M', 'PSDE', 'Minat Bakat', 'Media', 'Jejaring', 'Lainnya'];
  const TINGKAT = ['Kampus', 'Kota/Kabupaten', 'Provinsi', 'Nasional', 'Internasional'];
  const FOTO_KOSONG = 'foto/default.jpg';

  // ---------- Pengaturan tiap jenis data ----------
  const KONFIG = {
    anggota: {
      label: 'Anggota', awalan: 'a', file: 'data-anggota.js', variabel: 'ANGGOTA', maks: 700,
      judul: function (d) { return d.nama; },
      sub: function (d) { return [d.jabatan, d.divisi].filter(Boolean).join(' · '); },
      fields: [
        { k: 'nama', label: 'Nama lengkap', tipe: 'text', wajib: true },
        { k: 'jabatan', label: 'Jabatan', tipe: 'text', wajib: true, bantuan: 'Contoh: Ketua Umum, Anggota Divisi Media' },
        { k: 'divisi', label: 'Divisi', tipe: 'select', opsi: DIVISI, wajib: true },
        { k: 'prodi', label: 'Program studi', tipe: 'text', wajib: true },
        { k: 'angkatan', label: 'Angkatan', tipe: 'text', bantuan: 'Contoh: 2023' },
        { k: 'asal', label: 'Asal pesantren / daerah', tipe: 'text' },
        { k: 'instagram', label: 'Instagram', tipe: 'text', bantuan: 'Username tanpa @, atau tautan lengkap' },
        { k: 'keahlian', label: 'Keahlian / minat', tipe: 'text', bantuan: 'Pisahkan dengan koma. Contoh: Desain, Debat' },
        { k: 'bio', label: 'Profil singkat', tipe: 'area' },
        { k: 'foto', label: 'Foto', tipe: 'foto', bantuan: 'Foto otomatis dikecilkan agar hemat memori.' }
      ]
    },
    prestasi: {
      label: 'Prestasi', awalan: 'p', file: 'data-prestasi.js', variabel: 'PRESTASI', maks: 1200,
      judul: function (d) { return d.judul; },
      sub: function (d) { return [d.tahun, d.tingkat, d.nama].filter(Boolean).join(' · '); },
      tambahan: function (o) { o.tautanTeks = o.tautanTeks || 'Baca beritanya'; },
      fields: [
        { k: 'judul', label: 'Nama prestasi', tipe: 'text', wajib: true, bantuan: 'Contoh: Juara 1 Lomba Karya Tulis Ilmiah' },
        { k: 'kategori', label: 'Kategori', tipe: 'select', opsi: ['Akademik', 'Non-Akademik', 'Organisasi'], wajib: true },
        { k: 'tingkat', label: 'Tingkat', tipe: 'select', opsi: TINGKAT, wajib: true },
        { k: 'tahun', label: 'Tahun', tipe: 'text', wajib: true, awal: String(new Date().getFullYear()) },
        { k: 'nama', label: 'Nama awardee / tim', tipe: 'text', wajib: true, daftarNama: true, bantuan: 'Pilih dari anggota agar prestasi muncul di profilnya' },
        { k: 'prodi', label: 'Program studi', tipe: 'text' },
        { k: 'foto', label: 'Foto utama', tipe: 'foto' },
        { k: 'deskripsi', label: 'Penjelasan', tipe: 'baris', bantuan: 'Satu baris = satu paragraf' },
        { k: 'info', label: 'Keterangan lain', tipe: 'info', bantuan: 'Satu baris satu keterangan, format Judul: isi. Contoh: Penyelenggara: Kemenag RI' },
        { k: 'fotoLain', label: 'Foto dokumentasi lain', tipe: 'fotoBanyak', bantuan: 'Boleh lebih dari satu. Klik foto kecil untuk menghapus.' },
        { k: 'tautan', label: 'Tautan berita / sertifikat', tipe: 'text' }
      ]
    },
    karya: {
      label: 'Karya', awalan: 'k', file: 'data-karya.js', variabel: 'KARYA', maks: 1200,
      judul: function (d) { return d.judul; },
      sub: function (d) { return [d.kategori, d.tahun, d.nama].filter(Boolean).join(' · '); },
      tambahan: function (o) { o.tautanTeks = o.tautanTeks || 'Lihat karya'; },
      fields: [
        { k: 'judul', label: 'Judul karya', tipe: 'text', wajib: true },
        { k: 'kategori', label: 'Kategori', tipe: 'select', opsi: ['Penelitian', 'Teknologi', 'Tulisan', 'Desain'], wajib: true },
        { k: 'tahun', label: 'Tahun', tipe: 'text', wajib: true, awal: String(new Date().getFullYear()) },
        { k: 'nama', label: 'Nama awardee / tim', tipe: 'text', wajib: true, daftarNama: true, bantuan: 'Pilih dari anggota agar karya muncul di profilnya' },
        { k: 'prodi', label: 'Program studi', tipe: 'text' },
        { k: 'foto', label: 'Gambar sampul', tipe: 'foto' },
        { k: 'ringkas', label: 'Ringkasan singkat', tipe: 'text', bantuan: 'Tampil di kartu karya' },
        { k: 'deskripsi', label: 'Penjelasan karya', tipe: 'baris', bantuan: 'Satu baris = satu paragraf' },
        { k: 'info', label: 'Keterangan lain', tipe: 'info', bantuan: 'Satu baris satu keterangan, format Judul: isi. Contoh: Platform: Web' },
        { k: 'fotoLain', label: 'Tampilan karya', tipe: 'fotoBanyak', bantuan: 'Tangkapan layar, halaman buku, hasil desain, dst. Klik foto kecil untuk menghapus.' },
        { k: 'tautan', label: 'Tautan karya', tipe: 'text', bantuan: 'Jurnal, aplikasi, buku, atau portofolio daring' }
      ]
    },
    galeri: {
      label: 'Galeri', awalan: 'g', file: 'data-galeri.js', variabel: 'GALERI', maks: 1200,
      judul: function (d) { return d.judul; },
      sub: function (d) { return [d.kategori, d.tanggal].filter(Boolean).join(' · '); },
      fields: [
        { k: 'judul', label: 'Judul foto / kegiatan', tipe: 'text', wajib: true },
        { k: 'kategori', label: 'Kategori', tipe: 'select', opsi: ['Kegiatan', 'PSDE', 'Kajian'], wajib: true },
        { k: 'tanggal', label: 'Waktu / Tahun', tipe: 'text', bantuan: 'Contoh: 2026 atau Agustus 2026' },
        { k: 'foto', label: 'Foto kegiatan', tipe: 'foto', wajib: true },
        { k: 'deskripsi', label: 'Keterangan kegiatan', tipe: 'area', bantuan: 'Penjelasan kegiatan (opsional)' }
      ]
    }
  };

  // ---------- Keadaan ----------
  let tab = 'anggota';
  let editId = null;
  let tmp = {};          // foto sementara untuk form yang sedang dibuka
  let sibuk = 0;         // jumlah foto yang sedang diproses
  let data = muat();

  const el = function (id) { return document.getElementById(id); };

  function esc(t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function salin(x) { return JSON.parse(JSON.stringify(x || [])); }

  function muat() {
    try {
      const teks = localStorage.getItem(KUNCI);
      if (teks) return JSON.parse(teks);
    } catch (e) { /* abaikan, pakai data awal */ }
    return { anggota: salin(window.ANGGOTA), prestasi: salin(window.PRESTASI), karya: salin(window.KARYA), galeri: salin(window.GALERI) };
  }

  function simpan() {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(data));
      return true;
    } catch (e) {
      alert('Memori peramban penuh, data belum tersimpan permanen. Klik "Unduh data untuk situs" sekarang, lalu kurangi jumlah/ukuran foto.');
      return false;
    }
  }

  // ---------- Foto: kecilkan sebelum disimpan ----------
  function perkecil(file, maks) {
    return new Promise(function (selesai, gagal) {
      const pembaca = new FileReader();
      pembaca.onload = function () {
        const gambar = new Image();
        gambar.onload = function () {
          const skala = Math.min(1, maks / Math.max(gambar.width, gambar.height));
          const w = Math.round(gambar.width * skala);
          const h = Math.round(gambar.height * skala);
          const kanvas = document.createElement('canvas');
          kanvas.width = w;
          kanvas.height = h;
          const ctx = kanvas.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(gambar, 0, 0, w, h);
          selesai(kanvas.toDataURL('image/jpeg', 0.78));
        };
        gambar.onerror = gagal;
        gambar.src = pembaca.result;
      };
      pembaca.onerror = gagal;
      pembaca.readAsDataURL(file);
    });
  }

  // ---------- Form ----------
  function inputHtml(f, nilai) {
    const id = 'f-' + f.k;
    if (f.tipe === 'select') {
      let opsi = '<option value="">Pilih...</option>';
      f.opsi.forEach(function (o) {
        opsi += '<option value="' + esc(o) + '"' + (o === nilai ? ' selected' : '') + '>' + esc(o) + '</option>';
      });
      return '<select id="' + id + '">' + opsi + '</select>';
    }
    if (f.tipe === 'area' || f.tipe === 'baris' || f.tipe === 'info') {
      let teks = nilai || '';
      if (f.tipe === 'baris') teks = (nilai || []).join('\n');
      if (f.tipe === 'info') teks = (nilai || []).map(function (b) { return b[0] + ': ' + b[1]; }).join('\n');
      return '<textarea id="' + id + '">' + esc(teks) + '</textarea>';
    }
    if (f.tipe === 'foto') {
      return '<input id="' + id + '" type="file" accept="image/*"><div class="adm-prev" id="pv-' + f.k + '"></div>';
    }
    if (f.tipe === 'fotoBanyak') {
      return '<input id="' + id + '" type="file" accept="image/*" multiple><div class="adm-prev" id="pv-' + f.k + '"></div>';
    }
    return '<input id="' + id + '" type="text" value="' + esc(nilai || '') + '"' + (f.daftarNama ? ' list="dl-nama"' : '') + '>';
  }

  function gambarPratinjau() {
    KONFIG[tab].fields.forEach(function (f) {
      const wadah = el('pv-' + f.k);
      if (!wadah) return;
      let html = '';
      if (f.tipe === 'foto' && tmp[f.k]) {
        html = '<img src="' + esc(tmp[f.k]) + '" alt="Pratinjau">';
      }
      if (f.tipe === 'fotoBanyak') {
        (tmp[f.k] || []).forEach(function (src, i) {
          html += '<img src="' + esc(src) + '" alt="Foto ' + (i + 1) + '" data-hapus="' + f.k + ':' + i + '" title="Klik untuk menghapus">';
        });
      }
      wadah.innerHTML = html;
    });
  }

  function rakitForm() {
    const cfg = KONFIG[tab];
    const item = data[tab].find(function (x) { return x.id === editId; }) || null;
    tmp = {};

    let html = '';
    cfg.fields.forEach(function (f) {
      const nilai = item ? item[f.k] : (f.awal || '');
      if (f.tipe === 'foto') tmp[f.k] = item ? item[f.k] : '';
      if (f.tipe === 'fotoBanyak') tmp[f.k] = item ? (item[f.k] || []).slice() : [];
      html += '<div class="fld"><label for="f-' + f.k + '">' + esc(f.label) + (f.wajib ? ' *' : '') + '</label>' +
        inputHtml(f, nilai) + (f.bantuan ? '<small>' + esc(f.bantuan) + '</small>' : '') + '</div>';
    });
    html += '<div class="adm-tombol"><button class="btn" type="submit">' + (item ? 'Simpan perubahan' : 'Simpan ' + cfg.label.toLowerCase()) + '</button>' +
      (item ? ' <button class="btn-k" type="button" id="btn-batal">Batal edit</button>' : '') + '</div>';

    el('adm-form').innerHTML = html;
    el('adm-judul-form').textContent = (item ? 'Ubah ' : 'Tambah ') + cfg.label.toLowerCase();
    gambarPratinjau();
  }

  function rakitDaftar() {
    const cfg = KONFIG[tab];
    const daftar = data[tab];
    el('adm-jml').textContent = '(' + daftar.length + ')';

    let html = '';
    daftar.forEach(function (d) {
      html += '<div class="adm-item"><img src="' + esc(d.foto || FOTO_KOSONG) + '" alt="">' +
        '<div><b>' + esc(cfg.judul(d)) + '</b><small>' + esc(cfg.sub(d)) + '</small></div>' +
        '<button class="btn-k" type="button" data-e="' + esc(d.id) + '">Edit</button>' +
        '<button class="btn-k merah" type="button" data-h="' + esc(d.id) + '">Hapus</button></div>';
    });
    el('adm-list').innerHTML = html || '<p class="adm-kosong">Belum ada data. Isi form di samping.</p>';

    // Daftar nama anggota untuk isian "Nama awardee"
    el('dl-nama').innerHTML = data.anggota.map(function (a) {
      return '<option value="' + esc(a.nama) + '">';
    }).join('');

    // Status memori
    const mb = JSON.stringify(data).length / 1048576;
    const status = el('adm-status');
    status.textContent = 'Memori peramban: ' + mb.toFixed(2) + ' MB dari sekitar 5 MB';
    status.classList.toggle('penuh', mb > 4);
  }

  function tampil() {
    document.querySelectorAll('#adm-tabs .tab').forEach(function (t) {
      t.classList.toggle('on', t.dataset.tab === tab);
    });
    rakitForm();
    rakitDaftar();
  }

  function toast(pesan) {
    const t = el('toast');
    t.textContent = pesan;
    t.classList.add('on');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.classList.remove('on'); }, 3800);
  }

  // ---------- Peristiwa ----------
  el('adm-tabs').addEventListener('click', function (e) {
    const tombol = e.target.closest('.tab');
    if (!tombol) return;
    tab = tombol.dataset.tab;
    editId = null;
    tampil();
  });

  const form = el('adm-form');

  // Pilih foto
  form.addEventListener('change', function (e) {
    const input = e.target;
    if (input.type !== 'file' || !input.files.length) return;
    const kunci = input.id.replace('f-', '');
    const cfg = KONFIG[tab];
    const f = cfg.fields.find(function (x) { return x.k === kunci; });

    Array.prototype.forEach.call(input.files, function (berkas) {
      sibuk++;
      perkecil(berkas, cfg.maks).then(function (url) {
        if (f.tipe === 'foto') tmp[kunci] = url;
        else tmp[kunci].push(url);
      }).catch(function () {
        toast('Foto "' + berkas.name + '" tidak bisa dibaca.');
      }).then(function () {
        sibuk--;
        gambarPratinjau();
      });
    });
    input.value = '';
  });

  // Isi otomatis program studi dari data anggota
  form.addEventListener('input', function (e) {
    if (e.target.id !== 'f-nama' || tab === 'anggota') return;
    const cocok = data.anggota.find(function (a) { return a.nama === e.target.value; });
    const prodi = el('f-prodi');
    if (cocok && prodi && !prodi.value) prodi.value = cocok.prodi || '';
  });

  // Hapus foto tambahan / batal edit
  form.addEventListener('click', function (e) {
    const gambar = e.target.closest('[data-hapus]');
    if (gambar) {
      const bagian = gambar.dataset.hapus.split(':');
      tmp[bagian[0]].splice(Number(bagian[1]), 1);
      gambarPratinjau();
    }
    if (e.target.id === 'btn-batal') {
      editId = null;
      tampil();
    }
  });

  // Simpan
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sibuk > 0) { toast('Tunggu sebentar, foto sedang diproses.'); return; }

    const cfg = KONFIG[tab];
    const lama = data[tab].find(function (x) { return x.id === editId; });
    const obj = lama ? Object.assign({}, lama) : { id: cfg.awalan + Date.now() };

    for (let i = 0; i < cfg.fields.length; i++) {
      const f = cfg.fields[i];
      const kolom = el('f-' + f.k);

      if (f.tipe === 'foto') {
        obj[f.k] = tmp[f.k] || FOTO_KOSONG;
      } else if (f.tipe === 'fotoBanyak') {
        obj[f.k] = tmp[f.k] || [];
      } else if (f.tipe === 'baris') {
        obj[f.k] = kolom.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      } else if (f.tipe === 'info') {
        obj[f.k] = kolom.value.split('\n').map(function (baris) {
          const n = baris.indexOf(':');
          return n < 1 ? null : [baris.slice(0, n).trim(), baris.slice(n + 1).trim()];
        }).filter(function (b) { return b && b[1]; });
      } else {
        obj[f.k] = kolom.value.trim();
      }

      if (f.wajib && !obj[f.k]) {
        toast('Kolom "' + f.label + '" wajib diisi.');
        kolom.focus();
        return;
      }
    }

    // Tautan: pastikan diawali https://
    if (obj.tautan && !/^https?:\/\//i.test(obj.tautan)) obj.tautan = 'https://' + obj.tautan;
    if (cfg.tambahan) cfg.tambahan(obj);

    if (lama) {
      data[tab][data[tab].indexOf(lama)] = obj;
    } else {
      data[tab].push(obj);
    }

    editId = null;
    const berhasil = simpan();
    tampil();
    if (berhasil) toast('Tersimpan di peramban ini. Klik "Unduh data untuk situs" agar tampil di situs.');
  });

  // Edit & hapus dari daftar
  el('adm-list').addEventListener('click', function (e) {
    const idEdit = e.target.getAttribute('data-e');
    const idHapus = e.target.getAttribute('data-h');

    if (idEdit) {
      editId = idEdit;
      rakitForm();
      el('adm-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (idHapus) {
      const d = data[tab].find(function (x) { return x.id === idHapus; });
      if (d && confirm('Hapus "' + KONFIG[tab].judul(d) + '"?')) {
        data[tab] = data[tab].filter(function (x) { return x.id !== idHapus; });
        if (editId === idHapus) editId = null;
        simpan();
        tampil();
      }
    }
  });

  // ---------- Unduh ----------
  function unduh(jenis) {
    const cfg = KONFIG[jenis];
    const isi = '// Dibuat oleh Dasbor Pengurus pada ' + new Date().toLocaleString('id-ID') + '\n' +
      '// Ganti file ' + cfg.file + ' di folder situs dengan file ini.\n' +
      'window.' + cfg.variabel + ' = ' + JSON.stringify(data[jenis], null, 2) + ';\n';
    const url = URL.createObjectURL(new Blob([isi], { type: 'text/javascript' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = cfg.file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  el('btn-unduh-anggota').addEventListener('click', function () { unduh('anggota'); });
  el('btn-unduh-prestasi').addEventListener('click', function () { unduh('prestasi'); });
  el('btn-unduh-karya').addEventListener('click', function () { unduh('karya'); });
  const btnUnduhGaleri = el('btn-unduh-galeri');
  if (btnUnduhGaleri) btnUnduhGaleri.addEventListener('click', function () { unduh('galeri'); });
  el('btn-unduh-semua').addEventListener('click', function () {
    unduh('anggota');
    setTimeout(function () { unduh('prestasi'); }, 500);
    setTimeout(function () { unduh('karya'); }, 1000);
    setTimeout(function () { unduh('galeri'); }, 1500);
    toast('Mengunduh 4 file data. Jika diminta, izinkan unduhan ganda.');
  });

  el('btn-keluar').addEventListener('click', function () {
    sessionStorage.removeItem('css_login');
    location.href = 'login.html';
  });

  el('btn-reset').addEventListener('click', function () {
    if (!confirm('Hapus semua data di peramban ini dan kembali ke data bawaan situs?')) return;
    localStorage.removeItem(KUNCI);
    data = muat();
    editId = null;
    tampil();
    toast('Data dikembalikan ke data situs.');
  });

  tampil();
})();
