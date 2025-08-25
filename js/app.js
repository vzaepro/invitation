/*******************************************************
 * KODE JS FINAL UNTUK UNDANGAN PERNIKAHAN
 * Disesuaikan untuk menggunakan Google Apps Script
 * Versi: 25 Agustus 2025
 *******************************************************/

const util = (() => {

    const opacity = (nama) => {
        let nm = document.getElementById(nama);
        if (!nm) return; // Tambahan pengaman jika elemen tidak ada
        let op = parseInt(nm.style.opacity) || 1;
        let clear = null;

        clear = setInterval(() => {
            if (op >= 0) {
                nm.style.opacity = op.toString();
                op -= 0.025;
            } else {
                clearInterval(clear);
                clear = null;
                nm.remove();
                return;
            }
        }, 10);
    };

    const escapeHtml = (unsafe) => {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const salin = (btn, msg = 'Tersalin', timeout = 1500) => {
        navigator.clipboard.writeText(btn.getAttribute('data-nomer'));

        let tmp = btn.innerHTML;
        btn.innerHTML = msg;
        btn.disabled = true;

        let clear = null;
        clear = setTimeout(() => {
            btn.innerHTML = tmp;
            btn.disabled = false;
            btn.focus();

            clearTimeout(clear);
            clear = null;
            return;
        }, timeout);
    };

    const timer = () => {
        let waktuElemen = document.getElementById('tampilan-waktu');
        if (!waktuElemen) return;
        let countDownDate = (new Date(waktuElemen.getAttribute('data-waktu').replace(' ', 'T'))).getTime();

        setInterval(() => {
            let distance = Math.abs(countDownDate - (new Date()).getTime());

            document.getElementById('hari').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('jam').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('menit').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('detik').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    };

    const play = (btn) => {
        if (btn.getAttribute('data-status') !== 'true') {
            btn.setAttribute('data-status', 'true');
            audio.play();
            btn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
        } else {
            btn.setAttribute('data-status', 'false');
            audio.pause();
            btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
        }
    };

    const modal = (img) => {
        document.getElementById('show-modal-image').src = img.src;
        (new bootstrap.Modal('#modal-image')).show();
    };

    const tamu = () => {
        let name = (new URLSearchParams(window.location.search)).get('to');
        let namaTamuEl = document.getElementById('nama-tamu');
        if (!namaTamuEl) return;

        if (!name) {
            namaTamuEl.remove();
            return;
        }

        let div = document.createElement('div');
        div.classList.add('m-2');
        div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-light">${escapeHtml(name)}</h2>`;

        let formNamaEl = document.getElementById('form-nama');
        if (formNamaEl) {
            formNamaEl.value = name;
        }
        namaTamuEl.appendChild(div);
    };

    const animation = async () => {
        const duration = 10 * 1000;
        const animationEnd = Date.now() + duration;
        let skew = 1;

        let randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        (async function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            skew = Math.max(0.8, skew - 0.001);

            if (typeof confetti !== 'undefined') {
                await confetti({
                    particleCount: 1, startVelocity: 0, ticks: ticks,
                    origin: { x: Math.random(), y: Math.random() * skew - 0.2 },
                    colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
                    shapes: ["heart"],
                    gravity: randomInRange(0.5, 1), scalar: randomInRange(1, 2), drift: randomInRange(-0.5, 0.5),
                });
            }

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const buka = async () => {
        document.querySelector('body').style.overflowY = 'scroll';
        if (typeof AOS !== 'undefined') AOS.init();
        audio.play();

        opacity('welcome');
        let tombolMusik = document.getElementById('tombol-musik');
        if(tombolMusik) tombolMusik.style.display = 'block';
        timer();

        if (typeof confetti !== 'undefined') {
           await confetti({ origin: { y: 0.8 }, zIndex: 1057 });
           await animation();
        }
    };

    return {
        buka: buka, tamu: tamu, modal: modal, play: play, salin: salin, escapeHtml: escapeHtml, opacity: opacity
    };
})();

const progress = (() => {

    const assets = document.querySelectorAll('img');
    const info = document.getElementById('progress-info');
    const bar = document.getElementById('bar');
    if (!info || !bar) return;

    let total = assets.length;
    let loaded = 0;

    const onProgress = () => {
        loaded += 1;

        bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
        info.innerText = `Loading assets (${loaded}/${total}) [${parseInt(bar.style.width).toFixed(0)}%]`;

        if (loaded == total) {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
            util.tamu();
            util.opacity('loading');
        }
    };

    assets.forEach((asset) => {
        if (asset.complete && (asset.naturalWidth !== 0)) {
            onProgress();
        } else {
            asset.addEventListener('load', onProgress);
            asset.addEventListener('error', onProgress); // Hitung juga aset yang gagal dimuat
        }
    });
})();

const audio = (() => {
    let audioInstance = null;
    const tombolMusik = document.getElementById('tombol-musik');

    const singleton = () => {
        if (!audioInstance && tombolMusik) {
            audioInstance = new Audio();
            audioInstance.src = tombolMusik.getAttribute('data-url');
            audioInstance.load();
            audioInstance.currentTime = 0;
            audioInstance.autoplay = false; // Biarkan user yang memulai
            audioInstance.muted = false;
            audioInstance.loop = true;
            audioInstance.volume = 1;
        }
        return audioInstance;
    };

    return {
        play: () => { if(singleton()) singleton().play() },
        pause: () => { if(singleton()) singleton().pause() },
    };
})();

/*******************************************************
 * SISTEM UCAPAN BARU MENGGUNAKAN GOOGLE APPS SCRIPT
 *******************************************************/

// URL Web App Anda sudah dimasukkan secara otomatis.
const API_URL = "https://script.google.com/macros/s/AKfycbySN3MaPcZEQ_J84wdyY9KEusOiUQr0L784XGCVkhvK_NTgKr6qBvjUx43Gqb4Dcjal/exec";

const ucapanForm = document.getElementById('ucapanForm');
const kirimButton = document.getElementById('kirim');
const daftarUcapanContainer = document.getElementById('daftar-ucapan');

/**
 * Fungsi untuk MENGIRIM ucapan baru
 */
if (ucapanForm) {
  ucapanForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(ucapanForm);
    if (!formData.get('nama').trim() || !formData.get('ucapan').trim()) {
        alert('Nama dan Ucapan tidak boleh kosong!');
        return;
    }
    
    const tombolAsli = kirimButton.innerHTML;
    kirimButton.disabled = true;
    kirimButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Mengirim...`;

    fetch(API_URL, { method: 'POST', body: formData })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        alert(result.message);
        ucapanForm.reset();
        muatUcapan(); // Muat ulang ucapan setelah berhasil mengirim
      } else {
        throw new Error(result.message);
      }
    })
    .catch(error => {
      console.error('Error saat mengirim:', error);
      alert('Terjadi kesalahan: ' + error.message);
    })
    .finally(() => {
      kirimButton.disabled = false;
      kirimButton.innerHTML = tombolAsli;
    });
  });
}

/**
 * Fungsi untuk MEMUAT dan MENAMPILKAN semua ucapan
 */
function muatUcapan() {
  if (!daftarUcapanContainer) return;

  daftarUcapanContainer.innerHTML = '<p style="text-align: center;">Memuat ucapan...</p>';

  fetch(API_URL)
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        daftarUcapanContainer.innerHTML = '';
        
        if(result.data.length === 0) {
            daftarUcapanContainer.innerHTML = '<p style="text-align: center;">Jadilah yang pertama mengirim ucapan!</p>';
            return;
        }

        result.data.forEach(ucapan => {
          const ucapanCard = document.createElement('div');
          ucapanCard.className = 'card shadow-sm mb-3';
          
          let kehadiranClass = ucapan.kehadiran === 'Hadir' ? 'text-success' : 'text-danger';
          let kehadiranIcon = ucapan.kehadiran === 'Hadir' ? 'fa-circle-check' : 'fa-circle-xmark';
          
          ucapanCard.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-1">${util.escapeHtml(ucapan.nama)}</h5>
                    <small class="${kehadiranClass} fw-bold"><i class="fa-solid ${kehadiranIcon}"></i> ${util.escapeHtml(ucapan.kehadiran)}</small>
                </div>
                <p class="card-text mt-2">${util.escapeHtml(ucapan.ucapan)}</p>
                <small class="text-muted">${new Date(ucapan.timestamp).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</small>
            </div>
          `;
          
          daftarUcapanContainer.appendChild(ucapanCard);
        });
      } else {
        throw new Error(result.message);
      }
    })
    .catch(error => {
      console.error('Error saat memuat:', error);
      daftarUcapanContainer.innerHTML = '<p style="text-align: center;">Gagal memuat ucapan. Coba muat ulang halaman.</p>';
    });
}

// Panggil fungsi muatUcapan saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', muatUcapan);
