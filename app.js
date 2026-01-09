// Music state
let isMusicPlaying = false;
let musicStarted = false;

// Start music on first user interaction
function startMusicOnInteraction() {
    if (!musicStarted) {
        const audio = document.getElementById('bgMusic');
        const btn = document.getElementById('musicBtn');

        audio.volume = 0.25; // 25% volume
        audio.play().then(() => {
            musicStarted = true;
            isMusicPlaying = true;
            btn.textContent = '♫';
            btn.classList.add('playing');
        }).catch(e => {
            console.log('Autoplay blocked, user must click button:', e);
        });
    }
}

// Toggle background music
function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');

    if (isMusicPlaying) {
        audio.pause();
        btn.textContent = '♪';
        btn.classList.remove('playing');
    } else {
        audio.volume = 0.25; // 25% volume
        audio.play().catch(e => console.log('Audio play failed:', e));
        btn.textContent = '♫';
        btn.classList.add('playing');
        musicStarted = true;
    }
    isMusicPlaying = !isMusicPlaying;
}

// Likert labels with initials - 5 point for OI/MI, 7 point for TL/UPB
const likertLabels5 = ['STS', 'TS', 'N', 'S', 'SS'];
const likertLabels7 = ['STS', 'TS', 'ATS', 'N', 'AS', 'S', 'SS'];

// Question definitions for randomized section (TL + UPB = 17 questions, all scale 7)
const randomQuestions = [
    // TL (11 questions) - Likert 7
    { id: 'TL1', text: 'Atasan langsung saya memiliki pemahaman jelas mengenai arah tujuan organisasi.', scale: 7 },
    { id: 'TL2', text: 'Atasan langsung saya mampu mendefinisikan masa depan organisasi dengan sudut pandang menarik.', scale: 7 },
    { id: 'TL3', text: 'Atasan langsung saya selalu proaktif mencari peluang baru demi kemajuan organisasi.', scale: 7 },
    { id: 'TL4', text: 'Rencana masa depan yang disusun atasan langsung saya mampu menginspirasi orang lain.', scale: 7 },
    { id: 'TL5', text: 'Atasan langsung saya mampu membuat anggotanya merasa memiliki dan berkomitmen pada visi yang ia bangun.', scale: 7 },
    { id: 'TL6', text: 'Atasan langsung saya menjadi panutan yang baik untuk dicontoh dalam bekerja.', scale: 7 },
    { id: 'TL7', text: 'Atasan langsung saya memimpin dengan memberikan contoh berupa tindakan nyata.', scale: 7 },
    { id: 'TL8', text: 'Atasan langsung saya mendorong terciptanya kolaborasi antar unit kerja.', scale: 7 },
    { id: 'TL9', text: 'Atasan langsung saya memotivasi tiap pegawai untuk menjadi anggota tim yang handal.', scale: 7 },
    { id: 'TL10', text: 'Atasan langsung saya mampu menyatukan seluruh anggota kelompok untuk bergerak menuju satu tujuan yang sama.', scale: 7 },
    { id: 'TL11', text: 'Atasan langsung saya membangun mentalitas dan semangat kebersamaan di antara pegawai.', scale: 7 },
    // UPB (6 questions) - Likert 7
    { id: 'UPB1', text: 'Demi membantu organisasi, saya bersedia menyelaraskan informasi agar citra organisasi tetap terlihat baik di mata publik.', scale: 7 },
    { id: 'UPB2', text: 'Jika itu menguntungkan organisasi, saya bersedia menonjolkan sisi positif layanan organisasi secara berlebihan saat berhadapan dengan Wajib Pajak.', scale: 7 },
    { id: 'UPB3', text: 'Jika menguntungkan organisasi, saya akan menyimpan informasi negatif terkait organisasi dari Wajib Pajak.', scale: 7 },
    { id: 'UPB4', text: 'Demi kepentingan organisasi, saya bersedia memberikan rekomendasi positif bagi pegawai yang tidak kompeten agar ia diterima di instansi atau perusahaan lain dan tidak lagi menjadi beban di organisasi saya.', scale: 7 },
    { id: 'UPB5', text: 'Jika organisasi membutuhkan, saya bersedia untuk tidak mengembalikan kelebihan bayar Wajib Pajak meski terjadi kesalahan penagihan.', scale: 7 },
    { id: 'UPB6', text: 'Jika diperlukan, saya akan menahan informasi yang berpotensi merusak reputasi organisasi agar tidak diketahui publik.', scale: 7 }
];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate randomized questions HTML (TL + UPB only, all scale 7)
function generateRandomQuestions() {
    const container = document.getElementById('randomQuestionsContainer');

    // Shuffle all questions (all are scale 7 now)
    const shuffledQuestions = shuffleArray(randomQuestions);

    let html = '';
    shuffledQuestions.forEach((q, index) => {
        const labels = likertLabels7; // All scale 7 now
        const likertHtml = labels.map((label, i) =>
            `<label><input type="radio" name="${q.id}" value="${i + 1}"><span>${label}</span></label>`
        ).join('');

        html += `
            <div class="question" data-q="${q.id}" data-scale="${q.scale}">
                <p>${index + 1}. ${q.text}</p>
                <div class="likert">${likertHtml}</div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add click listeners for auto-scroll and auto-save
    container.querySelectorAll('.question').forEach(questionEl => {
        questionEl.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                handleQuestionAnswered(questionEl);
                saveProgress(); // Auto-save on every answer
            });
        });
    });
}

// Initialize Likert scales for MI section (static, not randomized)
function initLikertScales() {
    document.querySelectorAll('#miSection .likert').forEach(container => {
        const questionEl = container.closest('.question');
        const questionName = questionEl.dataset.q;

        // MI uses 5-point scale
        container.innerHTML = likertLabels5.map((label, i) =>
            `<label><input type="radio" name="${questionName}" value="${i + 1}"><span>${label}</span></label>`
        ).join('');

        // Add click listener for auto-scroll and auto-save
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                handleQuestionAnswered(questionEl);
                saveProgress(); // Auto-save on every answer
            });
        });
    });
}

// Initialize Likert scales for OI section (static, not randomized)
function initOILikertScales() {
    document.querySelectorAll('#oiSection .likert').forEach(container => {
        const questionEl = container.closest('.question');
        const questionName = questionEl.dataset.q;

        // OI uses 5-point scale
        container.innerHTML = likertLabels5.map((label, i) =>
            `<label><input type="radio" name="${questionName}" value="${i + 1}"><span>${label}</span></label>`
        ).join('');

        // Add click listener for auto-scroll and auto-save
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                handleQuestionAnswered(questionEl);
                saveProgress(); // Auto-save on every answer
            });
        });
    });
}

// Handle question answered - mark as answered and auto-scroll to next
function handleQuestionAnswered(questionEl) {
    // Mark as answered
    questionEl.classList.add('answered');
    questionEl.classList.remove('error');

    // Find next unanswered question in current section
    const section = questionEl.closest('.section');
    const questions = section.querySelectorAll('.question');
    let nextQuestion = null;
    let foundCurrent = false;

    for (const q of questions) {
        if (q === questionEl) {
            foundCurrent = true;
            continue;
        }
        if (foundCurrent && !q.classList.contains('answered')) {
            nextQuestion = q;
            break;
        }
    }

    if (nextQuestion) {
        // Scroll to next question with smooth animation
        setTimeout(() => {
            nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
    } else {
        // All questions in section answered, scroll to nav buttons
        const allAnswered = Array.from(questions).every(q => q.classList.contains('answered'));
        if (allAnswered) {
            const navButtons = section.querySelector('.nav-buttons');
            if (navButtons) {
                setTimeout(() => {
                    navButtons.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }
}

// Section navigation - updated for new flow with OI section
const sections = ['welcomeSection', 'respondentSection', 'miSection', 'oiSection', 'randomSection', 'resultSection'];

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    updateProgress(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(id) {
    const idx = sections.indexOf(id);
    const pct = Math.round((idx / (sections.length - 1)) * 100);
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressText').textContent = pct + '%';
}

// Validation
function validateAndNext(from, to) {
    if (from === 'respondentSection') {
        const usia = document.getElementById('usia').value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const unitorg = document.getElementById('unitorg').value;
        const pendidikan = document.getElementById('pendidikan').value;
        const lamakerja = document.getElementById('lamakerja').value;
        if (!usia || !gender || !unitorg || !pendidikan || !lamakerja) {
            showAlert('Mohon lengkapi semua data yang wajib diisi (*)');
            return;
        }
    } else {
        const questions = document.querySelectorAll(`#${from} .question`);
        let valid = true;
        questions.forEach(q => {
            const name = q.dataset.q;
            const checked = document.querySelector(`input[name="${name}"]:checked`);
            if (!checked) { q.classList.add('error'); valid = false; }
            else { q.classList.remove('error'); }
        });
        if (!valid) {
            showAlert('Mohon jawab semua pertanyaan');
            return;
        }
    }
    showSection(to);
}

// ============================================
// GOOGLE APPS SCRIPT WEB APP URL
// ============================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSQQ7YcueaY0FKtwAWjkqDWlI31tJlEsotVOhuEh9OPoaXDCZjAWWCPwBSufyrVZnc7A/exec';

// Submit - updated to validate randomSection
async function submitForm() {
    const questions = document.querySelectorAll('#randomSection .question');
    let valid = true;
    questions.forEach(q => {
        const name = q.dataset.q;
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (!checked) { q.classList.add('error'); valid = false; }
        else { q.classList.remove('error'); }
    });
    if (!valid) {
        showAlert('Mohon jawab semua pertanyaan');
        return;
    }

    const data = collectData();

    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Mengirim...';
    submitBtn.disabled = true;

    try {
        // Kirim ke Google Sheets
        if (GOOGLE_SCRIPT_URL !== 'PASTE_WEB_APP_URL_DISINI') {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        // Save to localStorage as backup
        const responses = JSON.parse(localStorage.getItem('responses') || '[]');
        responses.push(data);
        localStorage.setItem('responses', JSON.stringify(responses));

        // Clear form progress (not backup responses)
        clearProgress();

        showSection('resultSection');

    } catch (error) {
        showSection('resultSection');
        showAlert('Data tersimpan offline. Koneksi ke server gagal.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Collect data - organized by variable group regardless of display order
function collectData() {
    const data = {
        timestamp: new Date().toISOString(),
        language: 'id',
        respondent: {
            nama: document.getElementById('nama').value,
            usia: document.getElementById('usia').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            unitorg: document.getElementById('unitorg').value,
            pendidikan: document.getElementById('pendidikan').value,
            lamakerja: document.getElementById('lamakerja').value
        },
        responses: {},
        scores: {}
    };

    // Collect responses for each variable - NO reverse scoring
    const variables = {
        TL: { count: 11, maxScale: 7 },
        OI: { count: 5, maxScale: 5 },
        MI: { count: 5, maxScale: 5 },
        UPB: { count: 6, maxScale: 7 }
    };

    for (const [varName, config] of Object.entries(variables)) {
        let sum = 0;
        data.responses[varName] = {};
        for (let i = 1; i <= config.count; i++) {
            let val = parseInt(document.querySelector(`input[name="${varName}${i}"]:checked`)?.value || 0);
            data.responses[varName][`${varName}${i}`] = val;
            sum += val;
        }
        data.scores[varName] = (sum / config.count).toFixed(2);
    }

    return data;
}

// Export (disabled but kept for reference)
function exportData() {
    const data = collectData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kuesioner_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// SESSION PERSISTENCE - Auto-save progress
// ============================================
const STORAGE_KEY = 'kuesioner_progress';

// Save current progress to localStorage
function saveProgress() {
    const progress = {
        currentSection: document.querySelector('.section.active')?.id || 'welcomeSection',
        respondent: {
            nama: document.getElementById('nama')?.value || '',
            usia: document.getElementById('usia')?.value || '',
            gender: document.querySelector('input[name="gender"]:checked')?.value || '',
            unitorg: document.getElementById('unitorg')?.value || '',
            pendidikan: document.getElementById('pendidikan')?.value || '',
            lamakerja: document.getElementById('lamakerja')?.value || ''
        },
        answers: {}
    };

    // Save all radio button answers
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        progress.answers[input.name] = input.value;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// Load saved progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;

    try {
        const progress = JSON.parse(saved);

        // Restore respondent data
        if (progress.respondent) {
            if (progress.respondent.nama) document.getElementById('nama').value = progress.respondent.nama;
            if (progress.respondent.usia) document.getElementById('usia').value = progress.respondent.usia;
            if (progress.respondent.gender) {
                const genderRadio = document.querySelector(`input[name="gender"][value="${progress.respondent.gender}"]`);
                if (genderRadio) genderRadio.checked = true;
            }
            if (progress.respondent.unitorg) document.getElementById('unitorg').value = progress.respondent.unitorg;
            if (progress.respondent.pendidikan) document.getElementById('pendidikan').value = progress.respondent.pendidikan;
            if (progress.respondent.lamakerja) document.getElementById('lamakerja').value = progress.respondent.lamakerja;
        }

        // Restore all answers
        if (progress.answers) {
            for (const [name, value] of Object.entries(progress.answers)) {
                const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
                if (radio) {
                    radio.checked = true;
                    // Mark question as answered
                    const questionEl = radio.closest('.question');
                    if (questionEl) questionEl.classList.add('answered');
                }
            }
        }

        // Navigate to last section (but not result section)
        if (progress.currentSection && progress.currentSection !== 'resultSection') {
            showSection(progress.currentSection);
            return true;
        }

        return false;
    } catch (e) {
        console.log('Error loading progress:', e);
        return false;
    }
}

// Clear saved progress
function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
}

// Reset
function resetForm() {
    document.querySelectorAll('input[type="text"], select').forEach(el => el.value = '');
    document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
    document.querySelectorAll('.error, .answered').forEach(el => {
        el.classList.remove('error');
        el.classList.remove('answered');
    });
    // Clear saved progress
    clearProgress();
    // Re-shuffle questions on reset
    generateRandomQuestions();
    showSection('welcomeSection');
}

// Alert
function showAlert(msg) {
    const alert = document.getElementById('alertBox');
    document.getElementById('alertText').textContent = '⚠️ ' + msg;
    alert.classList.add('show');
    setTimeout(() => alert.classList.remove('show'), 3000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initLikertScales();        // Initialize MI section (static)
    initOILikertScales();      // Initialize OI section (static)
    generateRandomQuestions(); // Generate and shuffle TL+UPB questions
    updateProgress('welcomeSection');

    // Try to load saved progress
    const hasProgress = loadProgress();
    if (hasProgress) {
        showAlert('Progress sebelumnya telah dipulihkan!');
    }

    // Try to autoplay on first interaction anywhere
    // Music is now manual only - user must click the music button
    // No auto-play on interaction

    // Save respondent data on change
    document.querySelectorAll('#respondentSection input, #respondentSection select').forEach(el => {
        el.addEventListener('change', saveProgress);
    });
});
