// Language state
let currentLang = 'id';

// Likert labels
const likertLabels = {
    id: ['STS', 'TS', 'N', 'S', 'SS'],
    en: ['SD', 'D', 'N', 'A', 'SA']
};

// Initialize Likert scales
function initLikertScales() {
    document.querySelectorAll('.likert').forEach(container => {
        const questionName = container.closest('.question').dataset.q;
        container.innerHTML = likertLabels[currentLang].map((label, i) =>
            `<label><input type="radio" name="${questionName}" value="${i + 1}"><span>${label}</span></label>`
        ).join('');
    });
}

// Language switching
function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`).classList.add('active');

    // Update all translatable elements
    document.querySelectorAll('[data-id][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (el.tagName === 'INPUT') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    // Update Likert scales
    initLikertScales();
}

// Section navigation
const sections = ['welcomeSection', 'respondentSection', 'tlSection', 'oiSection', 'miSection', 'upbSection', 'resultSection'];

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
        const pendidikan = document.getElementById('pendidikan').value;
        const masakerja = document.getElementById('masakerja').value;
        if (!usia || !gender || !pendidikan || !masakerja) {
            showAlert(currentLang === 'id' ? 'Mohon lengkapi semua data yang wajib diisi (*)' : 'Please fill in all required fields (*)');
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
            showAlert(currentLang === 'id' ? 'Mohon jawab semua pertanyaan' : 'Please answer all questions');
            return;
        }
    }
    showSection(to);
}

// Submit
function submitForm() {
    const questions = document.querySelectorAll('#upbSection .question');
    let valid = true;
    questions.forEach(q => {
        const name = q.dataset.q;
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (!checked) { q.classList.add('error'); valid = false; }
        else { q.classList.remove('error'); }
    });
    if (!valid) {
        showAlert(currentLang === 'id' ? 'Mohon jawab semua pertanyaan' : 'Please answer all questions');
        return;
    }

    const data = collectData();
    displayResult(data);

    // Save to localStorage
    const responses = JSON.parse(localStorage.getItem('responses') || '[]');
    responses.push(data);
    localStorage.setItem('responses', JSON.stringify(responses));

    showSection('resultSection');
}

// Collect data
function collectData() {
    const data = {
        timestamp: new Date().toISOString(),
        language: currentLang,
        respondent: {
            nama: document.getElementById('nama').value || 'Anonim',
            usia: document.getElementById('usia').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            pendidikan: document.getElementById('pendidikan').value,
            masakerja: document.getElementById('masakerja').value
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
            // Reverse score if needed
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
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
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
});
