const TOTAL_STEPS = 4;
const answers = {};

function buildPersonalizedText() {
  const q1 = answers[1];
  const q2 = answers[2];
  const q3 = answers[3];
  const q4 = answers[4];
  const parts = [];

  // Ouverture — Q1
  if (q1 === 'negative') {
    parts.push("Tu le sais : tu travailles dur, mais quelque chose t'empêche d'atteindre l'abondance que tu mérites réellement.");
  } else {
    parts.push("Ce plafond invisible que tu ressens... il est réel. Et il n'a rien à voir avec ton talent ou ta valeur.");
  }

  // Q2 — connecté à Q1 pour éviter les ruptures de ton
  if (q1 === 'negative') {
    if (q2 === 'negative') {
      parts.push("Te saboter au moment crucial : ce n'est pas un manque de volonté. C'est ton subconscient qui joue contre toi.");
    } else if (q2 === 'medium') {
      parts.push("Cette procrastination qui arrive toujours au mauvais moment... c'est un signal que quelque chose doit être débloqué.");
    } else {
      parts.push("Et même sans te saboter, le simple fait que l'abondance résiste est un signe que quelque chose doit s'aligner.");
    }
  } else {
    if (q2 === 'negative') {
      parts.push("Te retrouver à freiner tes propres élans au moment clé... c'est ton subconscient qui défend un vieux programme.");
    } else if (q2 === 'medium') {
      parts.push("Cette hésitation qui arrive au moment d'agir... c'est exactement là que tout se joue.");
    } else {
      parts.push("Et pourtant quelque chose freine. Difficile à cerner, mais tout aussi réel.");
    }
  }

  // Q3
  if (q3 === 'negative') {
    parts.push("Ces croyances sur l'argent et la légitimité ? Elles ne sont pas les tiennes — elles ont été programmées. Et on peut les reprogrammer.");
  } else if (q3 === 'medium') {
    parts.push("Ce blocage que tu n'arrives pas à identifier... c'est souvent là, dans cet angle mort, que tout se joue.");
  } else {
    parts.push("Ce n'est pas une question de technique — c'est une question d'alignement profond avec qui tu es vraiment.");
  }

  // Fermeture — Q4
  if (q4 === 'negative') {
    parts.push("Si tu ne sais plus si c'est possible, c'est que personne ne t'a encore montré la bonne porte. C'est ce que cette masterclass va changer.");
  } else if (q4 === 'medium') {
    parts.push("Concret, ancré dans le réel, sans blabla : c'est exactement l'approche de Thomas dans cette masterclass.");
  } else {
    parts.push("L'envie est là : c'est déjà un grand pas. En 90 minutes, tu vas comprendre ce qui freine et comment tout changer.");
  }

  return parts.join(' ');
}

function goToStep(stepId) {
  const current = document.querySelector('.step.active');

  const show = () => {
    document.querySelectorAll('.step').forEach(el => {
      el.classList.remove('active', 'fading-out');
    });
    document.querySelector(`.step[data-step="${stepId}"]`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isResult = typeof stepId === 'string' && stepId.startsWith('result');
  document.querySelector('.quiz-header').classList.toggle('hidden', isResult);

  if (current) {
    current.classList.remove('active');
    current.classList.add('fading-out');
    current.addEventListener('animationend', show, { once: true });
  } else {
    show();
  }
}

function handleAnswer(stepNum, value) {
  answers[stepNum] = value;

  // Après Q3 : si les 3 premières réponses sont toutes positives → résultat "déjà dans l'abondance"
  if (stepNum === 3) {
    const first3AllPositive = [1, 2, 3].every(n => answers[n] === 'positive');
    if (first3AllPositive) {
      goToStep('result-happy');
      return;
    }
  }

  if (stepNum < TOTAL_STEPS) {
    goToStep(stepNum + 1);
  } else {
    // Q4 mène toujours au form
    document.getElementById('result-personalized').textContent = buildPersonalizedText();
    goToStep('result-signup');
  }
}

function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('quiz-card').innerHTML = `
    <div class="confirmation">
      <div style="width:48px;height:48px;border-radius:50%;background:#fef8e7;color:#C9A227;font-size:1.4rem;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;">&#10003;</div>
      <h2>Tu es inscrit(e)&nbsp;!</h2>
      <p>Je t'envoie tous les détails par e-mail.<br>À très vite dans la Masterclass Abondance.</p>
    </div>
  `;
}

function shareLink() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'Masterclass Abondance - Thomas Gabillet', url });
  } else {
    navigator.clipboard.writeText(url).then(() => alert('Lien copié !'));
  }
}

document.querySelectorAll('.options input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function () {
    const stepEl = this.closest('.step');
    const stepNum = parseInt(stepEl.dataset.step);
    stepEl.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
    this.closest('.option-label').classList.add('selected');
    setTimeout(() => handleAnswer(stepNum, this.value), 280);
  });
});
