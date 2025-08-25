// Hapus modul 'storage' yang tidak diperlukan

const request = async (action, body = {}) => {
    // Ganti URL ini dengan URL Web App Google Apps Script Anda
    let url = document.querySelector('body').getAttribute('https://script.google.com/macros/s/AKfycbwuxQAb6RXK_suA_z1FgRhA98U9AmeRTTGw2Tg4mwH-eXr9_xXh3E79J5VZ056UJ6zB/exec');
    
    // Tambahkan aksi ke dalam body permintaan
    body.action = action;

    let req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    try {
        const res = await fetch(url, req);
        const data = await res.json();
        
        if (data.status === 'error') {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        throw error;
    }
};

const util = (() => {

    const opacity = (nama) => {
        let nm = document.getElementById(nama);
        let op = parseInt(nm.style.opacity);
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
        let countDownDate = (new Date(document.getElementById('tampilan-waktu').getAttribute('data-waktu').replace(' ', 'T'))).getTime();

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

        if (!name) {
            document.getElementById('nama-tamu').remove();
            return;
        }

        let div = document.createElement('div');
        div.classList.add('m-2');
        div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-light">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-light">${escapeHtml(name)}</h2>`;

        document.getElementById('form-nama').value = name;
        document.getElementById('nama-tamu').appendChild(div);
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

            await confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: Math.random() * skew - 0.2,
                },
                colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
                shapes: ["heart"],
                gravity: randomInRange(0.5, 1),
                scalar: randomInRange(1, 2),
                drift: randomInRange(-0.5, 0.5),
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const buka = async () => {
        document.querySelector('body').style.overflowY = 'scroll';
        AOS.init();
        audio.play();

        opacity('welcome');
        document.getElementById('tombol-musik').style.display = 'block';
        timer();

        await confetti({
            origin: { y: 0.8 },
            zIndex: 1057
        });
        await comment.ucapan();
        await animation();
    };

    return {
        buka: buka,
        tamu: tamu,
        modal: modal,
        play: play,
        salin: salin,
        escapeHtml: escapeHtml,
        opacity: opacity
    };
})();

const progress = (() => {

    const assets = document.querySelectorAll('img');
    const info = document.getElementById('progress-info');
    const bar = document.getElementById('bar');

    let total = assets.length;
    let loaded = 0;

    const progress = () => {
        loaded += 1;

        bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
        info.innerText = `Loading assets (${loaded}/${total}) [${parseInt(bar.style.width).toFixed(0)}%]`;

        if (loaded == total) {

            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }

            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            window.scrollTo(0, 0);

            util.tamu();
            util.opacity('loading');
        }
    };

    assets.forEach((asset) => {
        if (asset.complete && (asset.naturalWidth !== 0)) {
            progress();
        } else {
            asset.addEventListener('load', () => {
                progress();
            });
        }
    });
})();

const audio = (() => {
    let audio = null;

    const singleton = () => {
        if (!audio) {
            audio = new Audio();
            audio.src = document.getElementById('tombol-musik').getAttribute('data-url');
            audio.load();
            audio.currentTime = 0;
            audio.autoplay = true;
            audio.muted = false;
            audio.loop = true;
            audio.volume = 1;
        }

        return audio;
    };

    return {
        play: () => singleton().play(),
        pause: () => singleton().pause(),
    };
})();

const pagination = (() => {

    const perPage = 10;
    let pageNow = 0;
    let resultData = 0;

    const page = document.getElementById('page');
    const prev = document.getElementById('previous');
    const next = document.getElementById('next');

    const disabledPrevious = () => {
        prev.classList.add('disabled');
    };

    const disabledNext = () => {
        next.classList.add('disabled');
    };

    const buttonAction = async (button) => {
        let tmp = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Loading...`;
        await comment.ucapan();
        document.getElementById('daftar-ucapan').scrollIntoView({ behavior: 'smooth' });
        button.disabled = false;
        button.innerHTML = tmp;
    };

    return {
        getPer: () => {
            return perPage;
        },
        getNext: () => {
            return pageNow;
        },
        reset: async () => {
            pageNow = 0;
            resultData = 0;
            page.innerText = 1;
            next.classList.remove('disabled');
            await comment.ucapan();
            disabledPrevious();
        },
        setResultData: (len) => {
            resultData = len;
            if (resultData < perPage) {
                disabledNext();
            }
        },
        previous: async (button) => {
            if (pageNow < 0) {
                disabledPrevious();
            } else {
                pageNow -= perPage;
                disabledNext();
                await buttonAction(button);
                page.innerText = parseInt(page.innerText) - 1;
                next.classList.remove('disabled');
                if (pageNow <= 0) {
                    disabledPrevious();
                }
            }
        },
        next: async (button) => {
            if (resultData < perPage) {
                disabledNext();
            } else {
                pageNow += perPage;
                disabledPrevious();
                await buttonAction(button);
                page.innerText = parseInt(page.innerText) + 1;
                prev.classList.remove('disabled');
            }
        }
    };
})();

// Hapus modul 'session' dan 'like'

const comment = (() => {
    const kirim = document.getElementById('kirim');
    const hadiran = document.getElementById('form-kehadiran');
    const formnama = document.getElementById('form-nama');
    const formpesan = document.getElementById('form-pesan');

    const resetForm = () => {
        // ... (fungsi resetForm tidak diubah) ...
        formnama.value = null;
        hadiran.value = 0;
        formpesan.value = null;
        formnama.disabled = false;
        hadiran.disabled = false;
        formpesan.disabled = false;
    };

    const send = async () => {
        let nama = formnama.value;
        let hadir = parseInt(hadiran.value);
        let komentar = formpesan.value;

        if (nama.length === 0) {
            alert('nama tidak boleh kosong');
            return;
        }
        if (hadir === 0) {
            alert('silahkan pilih kehadiran');
            return;
        }
        if (komentar.length === 0) {
            alert('pesan tidak boleh kosong');
            return;
        }

        formnama.disabled = true;
        hadiran.disabled = true;
        formpesan.disabled = true;
        kirim.disabled = true;

        let tmp = kirim.innerHTML;
        kirim.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Loading...`;

        let isSuccess = false;
        try {
            const res = await request('kirimUcapan', {
                nama: nama,
                hadir: hadir === 1,
                komentar: komentar
            });
            if (res.status === 'success') {
                isSuccess = true;
            }
        } catch (err) {
            alert(`Terdapat kesalahan: ${err.message}`);
        }

        if (isSuccess) {
            await pagination.reset();
            document.getElementById('daftar-ucapan').scrollIntoView({ behavior: 'smooth' });
            resetForm();
        }

        kirim.disabled = false;
        kirim.innerHTML = tmp;
        formnama.disabled = false;
        hadiran.disabled = false;
        formpesan.disabled = false;
    };

    // ... (fungsi `innerComment` dan `innerCard` juga dihapus karena tidak lagi relevan tanpa balasan dan like) ...
    // ... (fungsi `renderCard` diubah, disederhanakan) ...

    const renderCard = (data) => {
        const DIV = document.createElement('div');
        DIV.classList.add('mb-3');
        DIV.innerHTML = `
        <div class="card-body bg-light shadow p-3 m-0 rounded-4" data-parent="true">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                    <strong class="me-1">${util.escapeHtml(data.nama)}</strong><i class="fa-solid ${data.hadir ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}"></i>
                </p>
                <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${data.created_at}</small>
            </div>
            <hr class="text-dark my-1">
            <p class="text-dark mt-0 mb-1 mx-0 p-0" style="white-space: pre-line">${util.escapeHtml(data.komentar)}</p>
        </div>`;
        return DIV;
    };

    const ucapan = async () => {
        const UCAPAN = document.getElementById('daftar-ucapan');
        UCAPAN.innerHTML = renderLoading(pagination.getPer());

        try {
            const res = await request('getUcapan', {
                per: pagination.getPer(),
                next: pagination.getNext()
            });

            if (res.status === 'success') {
                UCAPAN.innerHTML = null;
                res.data.forEach((data) => UCAPAN.appendChild(renderCard(data)));
                pagination.setResultData(res.data.length);

                if (res.data.length === 0) {
                    UCAPAN.innerHTML = `<div class="h6 text-center">Tidak ada data</div>`;
                }
            }
        } catch (err) {
            alert(`Terdapat kesalahan: ${err.message}`);
        }
    };

    const renderLoading = (num) => {
        let result = '';

        for (let index = 0; index < num; index++) {
            result += `
            <div class="mb-3">
                <div class="card-body bg-light shadow p-3 m-0 rounded-4">
                    <div class="d-flex flex-wrap justify-content-between align-items-center placeholder-glow">
                        <span class="placeholder bg-secondary col-5"></span>
                        <span class="placeholder bg-secondary col-3"></span>
                    </div>
                    <hr class="text-dark my-1">
                    <p class="card-text placeholder-glow">
                        <span class="placeholder bg-secondary col-6"></span>
                        <span class="placeholder bg-secondary col-5"></span>
                        <span class="placeholder bg-secondary col-12"></span>
                    </p>
                </div>
            </div>`;
        }

        return result;
    };

    // Hapus semua fungsi yang tidak diperlukan lagi seperti `balasan`, `reply`, `hapus`, `edit`, `ubah`
    // Dan juga hapus variabel `balas`, `batal`, `sunting`, `tempID`

    return {
        ucapan: ucapan,
        kirim: send,
        renderLoading: renderLoading,
    };
})();
