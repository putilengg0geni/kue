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

// Likert labels - 5 point for OI/MI, 7 point for TL/UPB
const likertLabels5 = ['STS', 'TS', 'N', 'S', 'SS'];
const likertLabels7 = ['1', '2', '3', '4', '5', '6', '7'];

// Initialize Likert scales with auto-scroll functionality
function initLikertScales() {
    document.querySelectorAll('.likert').forEach(container => {
        const questionEl = container.closest('.question');
        const questionName = questionEl.dataset.q;
        const section = questionEl.closest('.section');
        const sectionId = section?.id || '';

        // Use 7-point for TL and UPB, 5-point for OI and MI
        const is7Point = sectionId === 'tlSection' || sectionId === 'upbSection';
        const labels = is7Point ? likertLabels7 : likertLabels5;

        container.innerHTML = labels.map((label, i) =>
            `<label><input type="radio" name="${questionName}" value="${i + 1}"><span>${label}</span></label>`
        ).join('');

        // Add click listener for auto-scroll
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => handleQuestionAnswered(questionEl));
        });
    });
}

// Handle question answered - mark as answered and auto-scroll to next
function handleQuestionAnswered(questionEl) {
    // Start music on first interaction
    startMusicOnInteraction();

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

// Section navigation
const sections = ['welcomeSection', 'respondentSection', 'tlSection', 'oiSection', 'miSection', 'upbSection', 'resultSection'];

function showSection(id) {
    // Start music on first interaction
    startMusicOnInteraction();

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
        const nama = document.getElementById('nama').value;
        const usia = document.getElementById('usia').value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const unitorg = document.getElementById('unitorg').value;
        const pendidikan = document.getElementById('pendidikan').value;
        const lamakerja = document.getElementById('lamakerja').value;
        if (!nama || !usia || !gender || !unitorg || !pendidikan || !lamakerja) {
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

// Submit
async function submitForm() {
    const questions = document.querySelectorAll('#upbSection .question');
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

        displayResult(data);
        showSection('resultSection');

    } catch (error) {
        console.error('Error:', error);
        displayResult(data);
        showSection('resultSection');
        showAlert('Data tersimpan offline. Koneksi ke server gagal.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Collect data
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

    // Collect responses for each variable
    const variables = {
        TL: { count: 11, reverse: [] },
        OI: { count: 5, reverse: [4, 5] },
        MI: { count: 5, reverse: [] },
        UPB: { count: 6, reverse: [] }
    };

    for (const [varName, config] of Object.entries(variables)) {
        let sum = 0;
        data.responses[varName] = {};
        for (let i = 1; i <= config.count; i++) {
            let val = parseInt(document.querySelector(`input[name="${varName}${i}"]:checked`)?.value || 0);
            if (config.reverse.includes(i)) {
                val = 6 - val;
            }
            data.responses[varName][`${varName}${i}`] = val;
            sum += val;
        }
        data.scores[varName] = (sum / config.count).toFixed(2);
    }

    return data;
}

// Display result
function displayResult(data) {
    const labels = {
        TL: 'Transformational Leadership',
        OI: 'Organizational Identification',
        MI: 'Moral Identity',
        UPB: 'Unethical Pro-org Behavior'
    };

    let html = '';
    for (const [key, label] of Object.entries(labels)) {
        const score = data.scores[key];
        const pct = (score / 5) * 100;
        html += `<div class="score-item"><span style="font-size:13px">${label}</span><div class="score-bar"><div class="score-fill" style="width:${pct}%"></div></div><strong>${score}</strong></div>`;
    }
    document.getElementById('resultSummary').innerHTML = html;
}

// Export
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

// Reset
function resetForm() {
    document.querySelectorAll('input[type="text"], select').forEach(el => el.value = '');
    document.querySelectorAll('input[type="radio"]').forEach(el => el.checked = false);
    document.querySelectorAll('.error, .answered').forEach(el => {
        el.classList.remove('error');
        el.classList.remove('answered');
    });
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
    initLikertScales();
    updateProgress('welcomeSection');

    // Try to autoplay on first interaction anywhere
    document.body.addEventListener('click', startMusicOnInteraction, { once: true });
    document.body.addEventListener('touchstart', startMusicOnInteraction, { once: true });
});
