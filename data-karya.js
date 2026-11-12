// =====================================================================
//  DATA KARYA AWARDEE  —  EDIT DI SINI SAJA
//  Klik kartu di halaman Karya Awardee -> muncul penjelasan & tampilan karya.
//
//  kategori : "Penelitian" | "Teknologi" | "Tulisan" | "Desain"
//             (harus sama dengan tombol filter di karya.html)
//  foto     : gambar sampul karya (ganti file di folder foto/karya)
//  fotoLain : tampilan lain dari karya, mis. tangkapan layar aplikasi,
//             halaman buku, atau hasil desain (boleh kosong: [])
//  ringkas  : kalimat singkat yang tampil di kartu
//  deskripsi: penjelasan lengkap, satu paragraf per baris
//  info     : keterangan lain, pasangan [judul, isi]; tambah/kurangi bebas
//  tautan   : alamat karya (jurnal, aplikasi, buku, Behance, dst.); boleh ""
// =====================================================================
window.KARYA = [
  {
    id: 'k1',
    judul: '[Judul Penelitian / Jurnal]',
    kategori: 'Penelitian', tahun: '2026',
    nama: '[Nama Awardee]', prodi: '[Program Studi]',
    foto: 'foto/karya/k1.jpg', fotoLain: [],
    ringkas: 'Ringkasan singkat karya: tujuan, metode, dan dampaknya.',
    deskripsi: [
      '[Jelaskan latar belakang penelitian: masalah apa yang ingin dijawab.]',
      '[Jelaskan metode, temuan utama, dan manfaat penelitian ini.]'
    ],
    info: [
      ['Jenis', '[Jurnal / Skripsi / Laporan penelitian]'],
      ['Penerbit / Jurnal', '[Nama jurnal atau lembaga]'],
      ['Pembimbing', '[Nama dosen pembimbing]'],
      ['Tahun terbit', '[Tahun]']
    ],
    tautan: 'https://repository.unugha.ac.id/49/1/Makalah%20six%20sigma.pdf', tautanTeks: 'Baca karya'
  },
  {
    id: 'k2',
    judul: '[Nama Aplikasi / Website]',
    kategori: 'Teknologi', tahun: '2026',
    nama: '[Nama Awardee]', prodi: 'Teknik Informatika',
    foto: 'foto/karya/k2.jpg', fotoLain: [],
    ringkas: 'Ringkasan singkat karya: masalah yang diselesaikan dan fiturnya.',
    deskripsi: [
      '[Jelaskan masalah yang diselesaikan aplikasi ini dan siapa penggunanya.]',
      '[Sebutkan fitur utama dan keunggulannya.]'
    ],
    info: [
      ['Platform', '[Web / Android / iOS]'],
      ['Teknologi', '[Bahasa pemrograman, framework]'],
      ['Status', '[Prototipe / Sudah rilis]'],
      ['Tim', '[Nama anggota tim]']
    ],
    tautan: 'https://setnasasean.kemlu.go.id/site/uploads/document/magazine/mma29/mobile/index.html', tautanTeks: 'Buka aplikasi'
  },
  {
    id: 'k6',
    judul: '[Nama Proyek / Inovasi]',
    kategori: 'Teknologi', tahun: '2026',
    nama: '[Nama Awardee]', prodi: '[Program Studi]',
    foto: 'foto/karya/k6.jpg', fotoLain: [],
    ringkas: 'Ringkasan singkat inovasi dan manfaatnya bagi pesantren.',
    deskripsi: [
      '[Jelaskan inovasi, cara kerjanya, dan manfaat bagi pesantren atau masyarakat.]'
    ],
    info: [
      ['Bidang', '[Pendidikan / Kesehatan / Lingkungan / dst.]'],
      ['Mitra', '[Nama pesantren atau lembaga]'],
      ['Status', '[Prototipe / Sudah dipakai]']
    ],
    tautan: '', tautanTeks: 'Lihat proyek'
  },
  {
    id: 'k6',
    judul: '[Nama Proyek / Inovasi]',
    kategori: 'Teknologi', tahun: '2026',
    nama: '[Nama Awardee]', prodi: '[Program Studi]',
    foto: 'foto/karya/k6.jpg', fotoLain: [],
    ringkas: 'Ringkasan singkat inovasi dan manfaatnya bagi pesantren.',
    deskripsi: [
      '[Jelaskan inovasi, cara kerjanya, dan manfaat bagi pesantren atau masyarakat.]'
    ],
    info: [
      ['Bidang', '[Pendidikan / Kesehatan / Lingkungan / dst.]'],
      ['Mitra', '[Nama pesantren atau lembaga]'],
      ['Status', '[Prototipe / Sudah dipakai]']
    ],
    tautan: '', tautanTeks: 'Lihat proyek'
  }
];
