const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('scrolled',scrollY>50);
addEventListener('scroll',onScroll);onScroll();

// Tandai menu halaman aktif
const page=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('active')});

// Menu mobile
const menu=document.getElementById('menu'),burger=document.getElementById('burger');
burger.onclick=()=>{menu.classList.toggle('open');burger.textContent=menu.classList.contains('open')?'✕':'☰'};
menu.querySelectorAll('a').forEach(l=>l.onclick=()=>{menu.classList.remove('open');burger.textContent='☰'});

// Animasi muncul saat scroll + counter angka
const count=el=>{const t=+el.dataset.count;let n=0;const s=Math.max(1,Math.ceil(t/60));
  const id=setInterval(()=>{n=Math.min(t,n+s);el.textContent=n+'+';if(n>=t)clearInterval(id)},25)};
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('show');
  const c=e.target.querySelector('[data-count]');
  if(c&&!c.done){c.done=1;count(c)}
  io.unobserve(e.target);
}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// Filter kategori (halaman Prestasi, Galeri, Karya)
document.querySelectorAll('.filters').forEach(g=>{
  const items=document.querySelectorAll('[data-cat]');
  g.querySelectorAll('.flt').forEach(b=>b.onclick=()=>{
    g.querySelectorAll('.flt').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    items.forEach(i=>i.classList.toggle('hide',b.dataset.f!=='all'&&i.dataset.cat!==b.dataset.f));
  });
});

// Lightbox galeri
const lb=document.getElementById('lb');
if(lb){
  document.querySelectorAll('.gi').forEach(g=>g.onclick=()=>{lb.firstElementChild.innerHTML=g.innerHTML;lb.classList.add('on')});
  lb.onclick=()=>lb.classList.remove('on');
  addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});
}

// Timeline sejarah dari data (halaman sejarah.html)
const draw=(id,list)=>{
  const el=document.getElementById(id);if(!el||!list)return;
  el.innerHTML=list.map(d=>`<div class="tl rv"><b>${d.tahun}</b><br>${d.judul}<small>${d.ket}</small></div>`).join('');
  el.querySelectorAll('.rv').forEach(x=>io.observe(x));
};
draw('tl-org',window.SEJARAH);draw('tl-ketua',window.KETUA);

// Modal detail divisi (data dari window.DIVISI di index.html)
const mdl=document.getElementById('mdl');
if(mdl&&window.DIVISI){
  const box=mdl.querySelector('.mdl-c');
  const open=id=>{
    const d=DIVISI.find(x=>x.id===id);if(!d)return;
    box.innerHTML=`<div class="mdl-head"><div class="ic">${d.ic}</div><div><h3 id="mdl-t">${d.nama}</h3><small>${d.sub}</small></div></div>
    <div class="mdl-body"><h4>Tentang Divisi</h4><p>${d.desc}</p>
    <h4>Program Kerja</h4><ul>${d.proker.map(p=>`<li>${p}</li>`).join('')}</ul>
    <h4>Anggota</h4><div class="mem">${d.anggota.map(a=>`<figure><img src="${a.foto}" alt="${a.nama}" loading="lazy"><figcaption><b>${a.nama}</b><span>${a.jabatan}</span></figcaption></figure>`).join('')}</div></div>`;
    mdl.classList.add('on');document.body.style.overflow='hidden';mdl.querySelector('.mdl-box').scrollTop=0;
  };
  const close=()=>{mdl.classList.remove('on');document.body.style.overflow=''};
  document.querySelectorAll('.dv').forEach(c=>c.onclick=()=>open(c.dataset.d));
  mdl.onclick=e=>{if(e.target===mdl||e.target.closest('.mdl-x'))close()};
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
