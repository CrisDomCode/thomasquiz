const TOTAL_STEPS = 4;
const answers = {};

function goToStep(stepId) {
  document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
  const target = document.querySelector(`.step[data-step="${stepId}"]`);
  if (target) target.classList.add('active');

  const stepNum = parseInt(stepId);
  updateProgress(isNaN(stepNum) ? TOTAL_STEPS + 1 : stepNum);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(currentStep) {
  const pct = Math.min(((currentStep - 1) / TOTAL_STEPS) * 100, 100);
  document.getElementById('progress-bar').style.width = pct + '%';
}

function isAllPositive() {
  return Object.values(answers).every(v => v === 'positive');
}

function handleAnswer(stepNum, value) {
  answers[stepNum] = value;

  if (stepNum < TOTAL_STEPS) {
    goToStep(stepNum + 1);
  } else {
    document.getElementById('progress-bar').style.width = '100%';
    goToStep(isAllPositive() ? 'result-happy' : 'result-signup');
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const card = document.getElementById('quiz-card');
  card.innerHTML = `
    <div class="confirmation">
      <div style="width:48px;height:48px;border-radius:50%;background:#e8f5e9;color:#4caf50;font-size:1.4rem;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;">&#10003;</div>
      <h2>Tu es inscrite !</h2>
      <p>Je t'envoie tous les details par e-mail.<br>A tres vite dans la masterclass.</p>
    </div>
  `;
  document.getElementById('progress-bar').style.width = '100%';
}

function shareLink() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'Masterclass gratuite - Nadege Lefort', url });
  } else {
    navigator.clipboard.writeText(url).then(() => alert('Lien copie !'));
  }
}

// On passe par l'événement 'change' du radio, plus fiable que le click sur le label
document.querySelectorAll('.options input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function () {
    const stepEl = this.closest('.step');
    const stepNum = parseInt(stepEl.dataset.step);

    stepEl.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
    this.closest('.option-label').classList.add('selected');

    setTimeout(() => handleAnswer(stepNum, this.value), 280);
  });
});

updateProgress(1);
