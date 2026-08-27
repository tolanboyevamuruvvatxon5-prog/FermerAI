/* ============================================================
   STATE & CONFIGURATION
   ============================================================ */
let userPlan = 'free'; // 'free' or 'pro'
const userName = 'Muruvvatxon Tolanboyeva';

let questionsCount = 0;
const questionsLimit = 3;
let scansCount = 0;
const scansLimit = 2;

let sidebarOpen = false;

/* Custom styled leaf graphics to let the user test the AI scanner instantly */
const sampleImages = {
  tomato: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250' style='background:%23252a1e;'><rect width='400' height='250' fill='%231e2418' /><path d='M200 40 C140 100 120 160 200 220 C280 160 260 100 200 40 Z' fill='%234B6E38' stroke='%237CA355' stroke-width='2'/><circle cx='160' cy='120' r='15' fill='%23C1552E' opacity='0.8'/><circle cx='230' cy='150' r='22' fill='%23C1552E' opacity='0.75'/><circle cx='190' cy='180' r='10' fill='%23C1552E' opacity='0.85'/><text x='20' y='35' fill='%23F4EEDC' font-family='sans-serif' font-size='14' font-weight='bold'>POMIDOR BARGI (Fitoftora)</text><text x='20' y='225' fill='%238C8368' font-family='sans-serif' font-size='11'>Namuna rasmi: Kasallik o&apos;choqlari qizil rangda</text></svg>`,
  cotton: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250' style='background:%2328241b;'><rect width='400' height='250' fill='%23221e15' /><path d='M200 50 C120 90 140 170 200 210 C260 170 280 90 200 50 Z' fill='%235a7848' stroke='%237CA355' stroke-width='2'/><path d='M200 80 Q160 120 150 160 Q200 170 200 210' fill='none' stroke='%23C1552E' stroke-width='4' stroke-linecap='round'/><path d='M200 80 Q240 130 250 170' fill='none' stroke='%23C1552E' stroke-width='3' stroke-linecap='round'/><text x='20' y='35' fill='%23F4EEDC' font-family='sans-serif' font-size='14' font-weight='bold'>G&apos;O&apos;ZA BARGI (Vertsillyoz)</text><text x='20' y='225' fill='%238C8368' font-family='sans-serif' font-size='11'>Namuna rasmi: Tomirlar sarg&apos;ayishi va so&apos;lishi</text></svg>`,
  wheat: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250' style='background:%2325251b;'><rect width='400' height='250' fill='%231f1f15' /><path d='M190 30 Q220 120 190 220 Q160 120 190 30 Z' fill='%23D6A537' opacity='0.6' stroke='%23EAC66B' stroke-width='1.5'/><rect x='182' y='70' width='8' height='15' rx='3' fill='%23C1552E' /><rect x='190' y='110' width='6' height='12' rx='2' fill='%23C1552E' /><rect x='185' y='140' width='9' height='18' rx='4' fill='%23C1552E' /><text x='20' y='35' fill='%23F4EEDC' font-family='sans-serif' font-size='14' font-weight='bold'>BUG&apos;DOY BOSHOG&apos;I (Zang kasalligi)</text><text x='20' y='225' fill='%238C8368' font-family='sans-serif' font-size='11'>Namuna rasmi: Jigarrang zang dog&apos;lari</text></svg>`,
  potato: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250' style='background:%232a221a;'><rect width='400' height='250' fill='%23221b14' /><ellipse cx='200' cy='125' rx='80' ry='60' fill='%23A8431F' opacity='0.7' stroke='%23C1552E' stroke-width='2'/><circle cx='160' cy='110' r='10' fill='%233D3524' opacity='0.8'/><circle cx='230' cy='140' r='12' fill='%233D3524' opacity='0.8'/><circle cx='210' cy='90' r='8' fill='%233D3524' opacity='0.8'/><text x='20' y='35' fill='%23F4EEDC' font-family='sans-serif' font-size='14' font-weight='bold'>KARTOSHKA TUGANAGI (Qo&apos;tir)</text><text x='20' y='225' fill='%238C8368' font-family='sans-serif' font-size='11'>Namuna rasmi: Tuganak sirtidagi qo&apos;tir dog&apos;lar</text></svg>`
};

/* ============================================================
   TOAST & NAVIGATION
   ============================================================ */
function toast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toast-text').textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

function navigate(view){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  const target = document.getElementById('view-' + view);
  if(target) target.classList.add('active');
  
  const navItem = document.querySelector('.nav-item[data-view="' + view + '"]');
  if(navItem) navItem.classList.add('active');
  
  window.location.hash = view;
  sidebarOpen = false;
  document.getElementById('sidebar').classList.remove('open');
  
  // Refresh charts when navigation occurs to adjust to container sizes
  setTimeout(drawAllCharts, 50);
}

document.querySelectorAll('[data-view], [data-view-link]').forEach(el => {
  el.addEventListener('click', (e) => {
    const v = el.dataset.view || el.dataset.viewLink;
    if(v){ e.preventDefault(); navigate(v); }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  // Set user's name on loading
  document.querySelector('.profile-info .name').textContent = userName;
  document.querySelector('.banner-info h2').innerHTML = `Xush kelibsiz, ${userName.split(' ')[0]}! 👋`;

  const hash = window.location.hash.replace('#','');
  navigate(hash && document.getElementById('view-'+hash) ? hash : 'dashboard');
  
  // Load sample cards grid dynamically
  renderSampleCards();
  
  // Setup interactive locks check on changes
  document.getElementById('market-region').addEventListener('change', () => checkProLock('market', 'market-region'));
  document.getElementById('weather-region').addEventListener('change', () => checkProLock('weather', 'weather-region'));
});

/* Theme toggle logic */
const themeBtn = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');
themeBtn.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.innerHTML = isDark
    ? '<path d="M12.79 21.164a10 10 0 1 1 8.375-16.868 8.5 8.5 0 0 0 -0.05 12.735 8.5 8.5 0 0 1 -8.325 4.133z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
  
  toast(isDark ? 'Yorug\' mavzuga o\'tildi' : 'Qorong\'u mavzuga o\'tildi');
  drawAllCharts();
});

/* Sidebar / Notif / Profile dropdown events */
document.getElementById('menu-btn').addEventListener('click', () => {
  sidebarOpen = !sidebarOpen;
  document.getElementById('sidebar').classList.toggle('open', sidebarOpen);
});
const notifPanel = document.getElementById('notif-panel');
document.getElementById('notif-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  notifPanel.classList.toggle('open');
  // Clear notification indicator dot
  const dot = document.querySelector('.badge-dot');
  if(dot) dot.style.display = 'none';
});
const profileMenu = document.getElementById('profile-menu');
document.getElementById('profile-trigger').addEventListener('click', (e) => {
  e.stopPropagation();
  profileMenu.classList.toggle('open');
});
document.addEventListener('click', () => {
  notifPanel.classList.remove('open');
  profileMenu.classList.remove('open');
});

/* Search integration */
const sectionKeywords = {
  dashboard: ['bosh sahifa','dashboard','home'],
  'ai-advisor': ['ai','maslahatchi','chat','savol','agronom'],
  'disease-scanner': ['kasallik','diagnostika','skaner','rasm','barg','fitoftora'],
  market: ['bozor','narx','trend','pomidor','bugdoy'],
  rotation: ['ekin','rejalash','almashlab','tuproq'],
  weather: ['ob-havo','sug\'orish','namlik','suv','harorat','prognoz'],
  pricing: ['tarif','narx','sotib','obuna','pro','pul']
};
document.getElementById('search-input').addEventListener('keydown', (e) => {
  if(e.key !== 'Enter') return;
  const q = e.target.value.trim().toLowerCase();
  if(!q) return;
  const hit = Object.entries(sectionKeywords).find(([,words]) => words.some(w => q.includes(w) || w.includes(q)));
  if(hit){
    navigate(hit[0]);
    toast('"' + e.target.value + '" bo\'yicha bo\'limga o\'tildi');
  } else {
    toast('Hech narsa topilmadi, boshqa so\'z bilan urinib ko\'ring');
  }
});


/* ============================================================
   PRO SUBSCRIPTION SYSTEM & PAYWALL SIMULATION
   ============================================================ */
function checkProLock(sectionId, regionSelectId) {
  const select = document.getElementById(regionSelectId);
  const regionVal = select.value;
  const isFree = (userPlan === 'free');
  // Lock any region other than Tashkent and Tashkent City for Free Tier
  const isLockedRegion = (regionVal !== 'tashkent' && regionVal !== 'tashkent-city');
  
  const container = document.querySelector(`#view-${sectionId} .${sectionId === 'market' ? 'market-grid' : 'weather-grid'}`);
  
  // Remove existing lock overlay if present
  const existingLock = container.parentNode.querySelector('.pro-overlay-lock');
  if (existingLock) existingLock.remove();
  
  if (isFree && isLockedRegion) {
    const lockDiv = document.createElement('div');
    lockDiv.className = 'pro-overlay-lock show';
    lockDiv.innerHTML = `
      <div class="pro-lock-icon-wrap">
        <svg class="icon" style="width:28px;height:28px" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <h4>Fermer Pro Talab Qilinadi</h4>
      <p>Barcha viloyatlar bozor narxlari va ob-havo prognozlari Fermer Pro obunachilari uchun ochiq.</p>
      <button class="btn btn-primary btn-sm" onclick="openCheckoutModal('Fermer Pro', '149 000')">Pro tarifga o'tish</button>
    `;
    container.parentNode.style.position = 'relative';
    container.parentNode.appendChild(lockDiv);
    return true; // Section locked
  }
  return false; // Free to proceed
}

// Global modal triggers
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutClose = document.getElementById('checkout-close');
const payMethods = document.getElementById('pay-methods');
const payFormCard = document.getElementById('pay-form-card');
const payFormPhone = document.getElementById('pay-form-phone');
const checkoutPayBtn = document.getElementById('checkout-pay-btn');

let selectedPlanName = 'Fermer Pro';
let selectedPaymentMethod = 'card';

// Wire up pricing cards to open checkout modal
document.querySelectorAll('[data-plan]').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan;
    if (plan === "Boshlang'ich") {
      userPlan = 'free';
      document.getElementById('user-plan-label').textContent = 'Bepul reja';
      document.querySelector('.avatar').classList.remove('pro-active');
      toast('Hisobingiz Bepul rejaga o\'tkazildi');
      // Trigger locks check
      checkProLock('market', 'market-region');
      checkProLock('weather', 'weather-region');
      navigate('dashboard');
    } else if (plan === 'Fermer Pro') {
      openCheckoutModal('Fermer Pro', '149 000');
    } else if (plan === 'Agroholding') {
      openCheckoutModal('Agroholding', 'Individual / kelishilgan');
    }
  });
});

function openCheckoutModal(planName, priceStr) {
  selectedPlanName = planName;
  document.getElementById('checkout-plan-name').textContent = planName;
  document.getElementById('checkout-plan-price').textContent = priceStr;
  
  // Show Payment Step, hide others
  document.getElementById('checkout-step-pay').style.display = 'block';
  document.getElementById('checkout-step-processing').style.display = 'none';
  document.getElementById('checkout-step-success').style.display = 'none';
  
  // Clear inputs and errors
  document.getElementById('card-number').value = '';
  document.getElementById('card-expiry').value = '';
  document.getElementById('card-cvv').value = '';
  document.getElementById('phone-number').value = '';
  
  document.querySelectorAll('.text-field').forEach(el => el.classList.remove('field-error'));
  
  checkoutOverlay.classList.add('open');
}

checkoutClose.addEventListener('click', () => checkoutOverlay.classList.remove('open'));

// Payment methods tab switching
payMethods.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    payMethods.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPaymentMethod = btn.dataset.method;
    
    if (selectedPaymentMethod === 'card') {
      payFormCard.style.display = 'block';
      payFormPhone.style.display = 'none';
    } else {
      payFormCard.style.display = 'none';
      payFormPhone.style.display = 'block';
      
      const label = document.getElementById('phone-label');
      const hint = document.getElementById('phone-hint');
      if (selectedPaymentMethod === 'click') {
        label.textContent = 'Click raqamingiz';
        hint.textContent = 'To\'lovni tasdiqlash uchun Click ilovasiga push-so\'rov yuboriladi.';
      } else {
        label.textContent = 'Payme raqamingiz';
        hint.textContent = 'Telefon raqamingizga SMS orqali yuboriladigan kod ilovadan keladi.';
      }
    }
  });
});

// Card inputs validation & automatic formatting
document.getElementById('card-number').addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  let formatted = '';
  for (let i = 0; i < val.length && i < 16; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += val[i];
  }
  e.target.value = formatted;
});

document.getElementById('card-expiry').addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  let formatted = '';
  if (val.length > 0) {
    formatted = val.substring(0, 2);
    if (val.length > 2) {
      formatted += '/' + val.substring(2, 4);
    }
  }
  e.target.value = formatted;
});

document.getElementById('card-cvv').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
});

document.getElementById('phone-number').addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (!val.startsWith('998')) {
    val = '998' + val;
  }
  let formatted = '+';
  for (let i = 0; i < val.length && i < 12; i++) {
    if (i === 3) formatted += ' (' + val[i];
    else if (i === 5) formatted += ') ' + val[i];
    else if (i === 8) formatted += '-' + val[i];
    else if (i === 10) formatted += '-' + val[i];
    else formatted += val[i];
  }
  e.target.value = formatted;
});

// Checkout processing
checkoutPayBtn.addEventListener('click', () => {
  let hasError = false;
  
  if (selectedPaymentMethod === 'card') {
    const cardNum = document.getElementById('card-number');
    const cardExp = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    
    if (cardNum.value.replace(/\s/g, '').length !== 16) {
      cardNum.classList.add('field-error');
      hasError = true;
    } else { cardNum.classList.remove('field-error'); }
    
    if (cardExp.value.length !== 5) {
      cardExp.classList.add('field-error');
      hasError = true;
    } else { cardExp.classList.remove('field-error'); }
    
    // Accept 1111 as the default CVV/SMS demo key
    if (cardCvv.value.length < 4) {
      cardCvv.classList.add('field-error');
      hasError = true;
    } else { cardCvv.classList.remove('field-error'); }
    
  } else {
    const phone = document.getElementById('phone-number');
    if (phone.value.length < 18) { // +998 (XX) XXX-XX-XX formatted length is 19
      phone.classList.add('field-error');
      hasError = true;
    } else { phone.classList.remove('field-error'); }
  }
  
  if (hasError) {
    toast('Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring');
    // Simple shake effect
    const box = document.querySelector('.modal-box');
    box.style.animation = 'shake 0.3s ease-in-out';
    setTimeout(() => box.style.animation = '', 300);
    return;
  }
  
  // Transition to processing loading state
  document.getElementById('checkout-step-pay').style.display = 'none';
  document.getElementById('checkout-step-processing').style.display = 'block';
  
  setTimeout(() => {
    // Show success step
    document.getElementById('checkout-step-processing').style.display = 'none';
    document.getElementById('checkout-step-success').style.display = 'block';
    
    // Update global state to PRO
    userPlan = 'pro';
    
    // Update UI elements
    document.getElementById('user-plan-label').innerHTML = `${selectedPlanName} <span class="pro-flag" style="margin-left:4px;font-size:8px;">PRO</span>`;
    document.querySelector('.avatar').classList.add('pro-active');
    
    // Success descriptions
    const successTxt = document.getElementById('checkout-success-text');
    if (selectedPlanName === 'Fermer Pro') {
      successTxt.textContent = "Fermer Pro tarifi faollashtirildi. Endi cheklanmagan AI maslahatchi, cheksiz kasallik tahlili va barcha 12 viloyat sizga ochiq.";
    } else {
      successTxt.textContent = "Agroholding hamkorlik arizangiz qabul qilindi. Shaxsiy agronom va API integratsiyasi taqdim etiladi.";
    }
    
    // Add success notification to sidebar panel
    addSystemNotification(`Tabriklaymiz! Siz muvaffaqiyatli ${selectedPlanName} obunachisi bo'ldingiz. Barcha cheklovlar bekor qilindi.`, 'gold');
    
    // Unlock locks if any section was locked
    const locks = document.querySelectorAll('.pro-overlay-lock');
    locks.forEach(l => l.remove());
    
    // Re-enable chat inputs if disabled
    document.getElementById('chat-input').disabled = false;
    document.getElementById('chat-input').placeholder = "Xabaringizni yozing (masalan, pomidor o'g'itlash...)";
    document.getElementById('send-btn').removeAttribute('disabled');
    
  }, 1600);
});

// Closing modal actions
document.getElementById('checkout-done-btn').addEventListener('click', () => {
  checkoutOverlay.classList.remove('open');
  toast('Tarif muvaffaqiyatli yangilandi');
  navigate('dashboard');
});

// CSS shake animation dynamic injector
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}`;
document.head.appendChild(styleSheet);

function addSystemNotification(text, priorityColor='gold') {
  const panel = document.getElementById('notif-panel');
  const emptyNotif = panel.querySelector('.notif-empty');
  if (emptyNotif) emptyNotif.remove();
  
  const notifItem = document.createElement('div');
  notifItem.className = 'notif-item unread';
  notifItem.innerHTML = `
    <span class="dot" style="background:var(--${priorityColor})"></span>
    <div>
      <p>${text}</p>
      <span>Xozirgina</span>
    </div>
  `;
  panel.insertBefore(notifItem, panel.querySelector('h4').nextSibling);
  
  // Highlight badge indicator dot
  const dot = document.querySelector('.badge-dot');
  if (dot) dot.style.display = 'block';
  toast('Yangi bildirishnoma keldi');
}


/* ============================================================
   SMART AI ADVISOR WITH MARKDOWN RENDERING & PAYWALL LIMITS
   ============================================================ */
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');

// Rich local knowledge base for Uzbekistan agriculture
const advisorReplies = [
  { 
    keys: ['pomidor', 'pomidor parvarishi', 'tomid'], 
    text: "### 🍅 Pomidor Parvarishi bo'yicha Qo'llanma\n\nPomidor - O'zbekiston iqlimida yuqori hosil beradigan, lekin alohida parvarish talab qiluvchi ekin.\n\n*   **O'g'itlash**: Ekishdan oldin gektariga **20-25 tonna chirigan go'ng** solish shart. Gullash va tuganak tugish davrida **Kaliy** va **Fosfor** me'yorini oshiring (masalan, NPK 1:2:2 nisbatda).\n*   **Sug'orish**: Pomidor tomchilatib sug'orishni yaxshi ko'radi. Namgarchilik me'yorda (**60-70%**) bo'lishi kerak. Barglariga suv sachratishdan saqlaning - bu zamburug' kasalliklarini qo'zg'atadi.\n*   **Kasalliklar**: Fitoftora va barg kuyishi eng ko'p uchraydi.\n\n<div class='warn-box'>⚠️ <strong>Eslatma</strong>: Fitoftorani erta aniqlash uchun barglar orqasini muntazam tekshiring. Kasallangan barglarni darhol yoqing!</div>"
  },
  { 
    keys: ['g\'o\'za', 'go\'za', 'paxta', 'gʻoʻza'], 
    text: "### 🌱 G'o'za (Paxta) Sug'orish va Oziqlantirish\n\nO'zbekistonda g'o'za hosildorligi to'g'ri sug'orish rejasiga chambarchas bog'liq.\n\n1.  **Sug'orish bosqichlari**:\n    *   **Shonalash davri**: 7-10 kunda bir marta, gektariga 700 m³ suv.\n    *   **Gullash va hosil yig'ish davri**: Har 5-7 kunda, gektariga 800-900 m³ suv. Tuproq namligini **65-70%** dan pastga tushirmang.\n2.  **O'g'itlash**: G'o'zaga gullash arafasida azotli o'g'it (Ammiakli selitra) va fosfor bilan oziqa berish shonalarni to'kilishidan asraydi.\n\n<div class='warn-box'>⚠️ <strong>Sug'orish Qoidasi</strong>: Ertalab soat 9:00 gacha yoki kechki 18:00 dan keyin sug'orish issiq havoda bug'lanishni kamaytiradi va ildiz kuyishini oldini oladi.</div>"
  },
  { 
    keys: ['sho\'r', 'shor', 'shoʻr', 'tuproq sho\'ri'], 
    text: "### 🏜️ Tuproq Sho'rlanishi bilan Kurashish\n\nSho'rlangan erlarda hosildorlikni tiklash uchun quyidagi kompleks choralarni qo'llang:\n\n*   **Kuzgi gips solish**: Tuproq tahliliga ko'ra gektariga **3-5 tonna gips** yoki ohak solib, shudgorlash.\n*   **Sho'r yuvish**: Qishki yoki erta bahorgi mavsumda, sho'r yuvish arixlari va zovurlar yordamida tuproqdagi tuzlarni pastki qatlamlarga yuvish (sho'r yuvish normasi: 1500-2500 m³/ga).\n*   **Almashlab ekish**: Sho'rga chidamli ekinlarni eking - mosh, beda yoki arpa tuproqni tozalashda yordam beradi.\n*   **Organika**: Chirigan go'ng va kompost solish tuzlar ta'sirini kamaytiradi." 
  },
  { 
    keys: ['kartoshka', 'katoshka'], 
    text: "### 🥔 Kartoshka Yetishtirish Sirlari\n\nKartoshkadan yuqori hosil olish uchun tuproq g'ovak bo'lishi juda muhim.\n\n*   **Urug'lik**: Kasallikdan xoli, saralangan va nish urgan tuganaklarni eking.\n*   **O'g'it**: Ekish paytida har bir uyaga yoki gektariga **300-400 kg mineral superfosfat** soling. Kartoshka kaliyli o'g'itlarni (masalan, kaliy sulfat) judayam yaxshi o'zlashtiradi.\n*   **Kasallik**: Kolorado qo'ng'izi va kechki kuyish (late blight) xavfiga qarshi ekishdan oldin urug'lik tuganaklarni fungitsidda namlash tavsiya etiladi." 
  },
  { 
    keys: ['bug\'doy', 'bugdoy', 'bugʻdoy'], 
    text: "### 🌾 Bug'doy Sug'orish va Rivojlanish Bosqichlari\n\nKuzgi bug'doyni O'zbekiston iqlimida 3-4 marta sug'orish muhim hosildorlik ko'rsatkichidir:\n\n*   **1-sug'orish**: Tuplanish davrida (erta bahorda).\n*   **2-sug'orish**: Boshoq chiqarish va gullash davrida.\n*   **3-sug'orish**: Don to'lishi (sut-mum pishish) davrida. Har bir sug'orishda gektariga **800-1000 m³** suv sarflang.\n*   **Oziqlantirish**: Erta bahorda azotli mineral o'g'itlar bilan suspenziya usulida oziqlantirish (gektariga 150-200 kg urea) don tarkibidagi oqsil miqdorini oshiradi." 
  },
  { 
    keys: ['kasallik', 'zararkunanda', 'fitoftora', 'rust', 'vertsillyoz'], 
    text: "### 🛡️ Kasallik va Zararkunandalarga Qarshi Profilaktika\n\nDala ekinlarida kasallik tarqalishini 90% gacha oldini olish mumkin:\n\n1.  **Urug'likni dorilash**: Ekishdan oldin urug'larni fungitsid bilan davolash (masalan, Vitavaks, Raxil).\n2.  **Drenaj va Shamollatish**: O'simliklarni juda zich ekmang. Namlik turg'unligi zamburug' ko'payishiga sabab bo'ladi.\n3.  **Almashlab ekish**: Bir maydonga ketma-ket bir xil ekin ekmang.\n4.  **Monitoring**: Har haftada bir marta dalani aylanib, kasallik alomatlarini ko'zdan kechiring. Agar rasm bo'lsa, **Kasallik Diagnostikasi** bo'limida tahlil qiling." 
  },
  {
    keys: ['o\'g\'it', 'ogit', 'NPK', 'karbamid', 'go\'ng', 'selitra'],
    text: "### 🧪 Ekinlar uchun Mineral va Organik O'g'itlar\n\n*   **Organik o'g'itlar**: Chirigan chorva go'ngi, qush go'ngi, sideratlar (ko'k o'g'it). Tuproq gumuini yaxshilaydi.\n*   **Azotli o'g'itlar (N)**: Karbamid, ammiakli selitra, ammoniy sulfat. Barg va poya o'sishini tezlashtiradi.\n*   **Fosforli o'g'itlar (P)**: Superfosfat, ammofos. Ildiz tizimini mustahkamlaydi va gullashni yaxshilaydi.\n*   **Kaliyli o'g'itlar (K)**: Kaliy xlorid, kaliy sulfat. Hosil sifatini oshiradi va sovuqqa/qurg'oqchilikka chidamlilikni kuchaytiradi."
  }
];

const fallbackReply = "### 🧑‍🌾 Agro-maslahatchi AI\n\nQiziq savol! Men sizga aniqroq maslahat berishim uchun qaysi ekin, tuproq turi yoki viloyat haqida so'rayotganingizni yozib bering.\n\n**Masalan**:\n*   *\"Pomidor parvarishi qanday bo'ladi?\"*\n*   *\"Tuproq sho'rini kamaytirish usullari\"*\n*   *\"G'o'zani gullash davrida qanday sug'orish kerak?\"*";

// Simple custom Markdown rendering for bubbles
function renderMarkdownText(text) {
  let html = text;
  // Headings
  html = html.replace(/^### (.*$)/gim, '<strong>$1</strong>');
  // Bold words
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  // Bullet points
  html = html.replace(/^\*\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d\.\s(.*$)/gim, '<li>$1</li>');
  // Wrap bullet sequences into ul/ol
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Fix multiple adjacent ul tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  // Linebreaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function addBubble(text, who){
  const b = document.createElement('div');
  b.className = 'bubble ' + who;
  
  const avLetter = who === 'bot' 
    ? `<svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`
    : userName.split(' ')[0][0]; // "M" from Muruvvatxon
    
  b.innerHTML = `
    <div class="bubble-av">${avLetter}</div>
    <div class="bubble-txt"></div>
  `;
  
  b.querySelector('.bubble-txt').innerHTML = who === 'bot' ? renderMarkdownText(text) : text;
  chatHistory.appendChild(b);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  return b;
}

function botAnswer(userText){
  const lower = userText.toLowerCase().replace(/['ʻʼ’`‘]/g, "'");
  const match = advisorReplies.find(r => r.keys.some(k => lower.includes(k)));
  
  const typing = document.createElement('div');
  typing.className = 'bubble bot';
  typing.innerHTML = '<div class="bubble-av"><svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg></div><div class="typing"><span></span><span></span><span></span></div>';
  chatHistory.appendChild(typing);
  chatHistory.scrollTop = chatHistory.scrollHeight;
  
  setTimeout(() => {
    typing.remove();
    addBubble(match ? match.text : fallbackReply, 'bot');
  }, 900 + Math.random()*500);
}

function sendMessage(){
  const val = chatInput.value.trim();
  if(!val) return;
  
  // Paywall check for Free tier limits
  if (userPlan === 'free') {
    if (questionsCount >= questionsLimit) {
      addBubble(val, 'user');
      chatInput.value = '';
      
      const typing = document.createElement('div');
      typing.className = 'bubble bot';
      typing.innerHTML = '<div class="bubble-av"><svg class="icon" style="width:17px;height:17px" viewBox="0 0 24 24"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/></svg></div><div class="typing"><span></span><span></span><span></span></div>';
      chatHistory.appendChild(typing);
      chatHistory.scrollTop = chatHistory.scrollHeight;
      
      setTimeout(() => {
        typing.remove();
        addBubble("⚠️ **Bepul reja limiti tugadi.**\n\nSuhbatda haftasiga faqat 3 ta savol so'rashingiz mumkin. Savollarni cheksiz berish va agronom maslahatlarini to'liq olish uchun **Fermer Pro** tarifiga o'ting.", 'bot');
        
        // Disable chat input
        chatInput.disabled = true;
        chatInput.placeholder = "Limitingiz tugadi. Pro tarifga o'ting.";
        document.getElementById('send-btn').setAttribute('disabled', 'true');
      }, 700);
      
      return;
    }
    questionsCount++;
  }
  
  addBubble(val, 'user');
  chatInput.value = '';
  botAnswer(val);
}

document.getElementById('send-btn').addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if(e.key === 'Enter') sendMessage(); });

document.querySelectorAll('[data-quick]').forEach(el => {
  el.addEventListener('click', () => {
    navigate('ai-advisor');
    setTimeout(() => { chatInput.value = el.dataset.quick; sendMessage(); }, 150);
  });
});

// suggestion list in sidebar/advisor view
document.querySelectorAll('.suggest-list li').forEach(el => {
  el.addEventListener('click', () => {
    chatInput.value = el.dataset.quick || el.textContent;
    sendMessage();
  });
});


/* ============================================================
   DISEASE SCANNER WITH HOVER EFFECT, SAMPLES & LASER ANIMATION
   ============================================================ */
const diseaseDB = {
  tomato: [
    { name:"Pomidor fitoftorasi (Phytophthora)", severity:85, symptoms:"Barglar va poyada qo'ng'ir-kulrang, suvli dog'lar hosil bo'ladi, namgarchilikda tez tarqaladi.", organic:"Sarimsoq va qalampir damlamasini har 5 kunda sepish, zararlangan barglarni darhol yo'qotish.", chemical:"Mis asosidagi fungitsid (masalan, bordo suyuqligi) yoki Ridomil Gold sepish.", prevention:"Ekinlarni almashlab ekish, tomchilatib sug'orishga o'tish, o'simliklar orasida shamollatish uchun masofa qoldirish." },
    { name:"Pomidor bargining oldindan kuyishi (Early Blight)", severity:62, symptoms:"Quyi barglarda konsentrik halqali qo'ng'ir dog'lar, barglar sarg'ayib to'kiladi.", organic:"Pishirilgan sut aralashmasi (1:9 suv bilan) haftada 2 marta purkash.", chemical:"Xlorotalonil yoki mankozeb asosidagi preparat qo'llash.", prevention:"Urug'larni davolab ekish, hosildan keyin qoldiqlarni yig'ib yoqish." }
  ],
  cotton: [
    { name:"G'o'za so'lish kasalligi (Vertsillyoz)", severity:74, symptoms:"Barglar sarg'ayib pastdan yuqoriga qarab so'liydi, poya kesimida qorong'i tomirlar ko'rinadi.", organic:"Trixoderma asosidagi biofungitsid bilan tuproqni ishlash.", chemical:"Urug'ni Vitavaks yoki shunga o'xshash preparat bilan dorilash.", prevention:"Sho'rga va kasallikka chidamli navlarni tanlash, 3-4 yillik almashlab ekish." },
    { name:"G'o'za shira (bit) zararkunandasi", severity:48, symptoms:"Barglar burishib, yopishqoq shira izi qoladi, o'simlik rivojlanishi sekinlashadi.", organic:"Sovunli suv eritmasi yoki neem yog'i bilan purkash.", chemical:"Imidakloprid asosidagi insektitsid qo'llash.", prevention:"Foydali hasharotlarni (xonqizi) dalaga jalb qilish, begona o'tlarni yo'qotish." }
  ],
  wheat: [
    { name:"Bug'doy zang kasalligi (Rust)", severity:70, symptoms:"Barglarda to'q sariq-jigarrang kukunsimon dog'lar paydo bo'ladi.", organic:"Ekinni erta muddatlarda ekish va zichlikni me'yorida saqlash.", chemical:"Propikonazol asosidagi fungitsid bilan purkash.", prevention:"Zangga chidamli navlar ekish, hosildan keyin poxol qoldiqlarini shudgorlash." },
    { name:"Un-shudring kasalligi (Powdery mildew)", severity:40, symptoms:"Barg yuzasida oq, un kabi kukunsimon qatlam hosil bo'ladi.", organic:"Sut zardobi eritmasi bilan purkash.", chemical:"Oltingugurt asosidagi preparat qo'llash.", prevention:"Ekin zichligini kamaytirish, azotli o'g'itdan me'yorida foydalanish." }
  ],
  potato: [
    { name:"Kartoshka kechki kuyishi (Late Blight)", severity:80, symptoms:"Barglarda qo'ng'ir dog'lar, ostki tomonida oq kukunsimon zamburug' izi ko'rinadi.", organic:"Bentonit va mis kukuni aralashmasini purkash.", chemical:"Metalaksil asosidagi fungitsid qo'llash.", prevention:"Urug'lik tuganaklarni sog'lom manbadan olish, ekinlar orasida havo aylanishini ta'minlash." },
    { name:"Kartoshka qo'tir kasalligi (Scab)", severity:35, symptoms:"Tuganak yuzasida qo'pol, qo'tirsimon dog'lar hosil bo'ladi.", organic:"Tuproq pH darajasini pasaytirish uchun organik moddalar qo'shish.", chemical:"Ekishdan oldin tuganaklarni fungitsidli eritmada namlash.", prevention:"Sho'rlanmagan, yaxshi drenajli maydonlarda ekish, 3 yillik almashlab ekish." }
  ]
};

const fileInput = document.getElementById('file-input');
const dropzone = document.getElementById('dropzone');
document.getElementById('upload-btn').addEventListener('click', () => fileInput.click());

['dragover','dragleave','drop'].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    dropzone.classList.toggle('drag', evt === 'dragover');
    if(evt === 'drop' && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
});
fileInput.addEventListener('change', () => { if(fileInput.files[0]) handleFile(fileInput.files[0]); });

function handleFile(file){
  if(!file.type.startsWith('image/')){ toast('Iltimos, faqat rasm fayl tanlang'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    // Reset scanner markers and scanning animation
    document.getElementById('image-preview').src = e.target.result;
    dropzone.style.display = 'none';
    document.getElementById('preview-wrap').style.display = 'block';
    
    // Clear scanning state
    const box = document.querySelector('.scan-container-box');
    box.classList.remove('scanning');
    const markers = box.querySelectorAll('.scan-marker');
    markers.forEach(m => m.remove());
  };
  reader.readAsDataURL(file);
}

document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('preview-wrap').style.display = 'none';
  dropzone.style.display = 'block';
  fileInput.value = '';
  document.getElementById('scan-result').style.display = 'none';
  document.getElementById('scan-empty').style.display = 'block';
  
  const box = document.querySelector('.scan-container-box');
  box.classList.remove('scanning');
  const markers = box.querySelectorAll('.scan-marker');
  markers.forEach(m => m.remove());
});

document.getElementById('analyze-btn').addEventListener('click', () => {
  // Paywall check for Scanner on Free plan
  if (userPlan === 'free') {
    if (scansCount >= scansLimit) {
      toast('Skanerlash limiti tugadi (maksimal 2 marta). Pro tarifga o\'ting!');
      navigate('pricing');
      return;
    }
  }
  
  const scanBox = document.querySelector('.scan-container-box');
  scanBox.classList.add('scanning');
  
  // Inject mock bounding box targets dynamically
  const widthVal = 100 + Math.random()*80;
  const heightVal = 80 + Math.random()*60;
  const marker = document.createElement('div');
  marker.className = 'scan-marker';
  marker.style.width = widthVal + 'px';
  marker.style.height = heightVal + 'px';
  marker.style.top = (30 + Math.random()*50) + 'px';
  marker.style.left = (80 + Math.random()*120) + 'px';
  scanBox.appendChild(marker);
  
  // Disable buttons while scanning
  document.getElementById('analyze-btn').disabled = true;
  document.getElementById('cancel-btn').disabled = true;
  
  setTimeout(() => {
    // Increment scan count on free plan
    if (userPlan === 'free') scansCount++;
    
    document.getElementById('preview-wrap').style.display = 'none';
    document.getElementById('scan-loading').style.display = 'block';
    document.getElementById('scan-empty').style.display = 'none';
    document.getElementById('scan-result').style.display = 'none';

    setTimeout(() => {
      const crop = document.getElementById('scanner-crop').value;
      const options = diseaseDB[crop];
      const result = options[Math.floor(Math.random()*options.length)];
      const cropLabels = { tomato:'Pomidor', cotton:"G'o'za (Paxta)", wheat:"Bug'doy", potato:'Kartoshka' };

      document.getElementById('scan-loading').style.display = 'none';
      document.getElementById('dropzone').style.display = 'block';
      document.getElementById('preview-wrap').style.display = 'none';
      
      // Re-enable buttons
      document.getElementById('analyze-btn').disabled = false;
      document.getElementById('cancel-btn').disabled = false;
      fileInput.value = '';
      marker.remove();
      scanBox.classList.remove('scanning');

      const badge = document.getElementById('result-badge');
      badge.textContent = result.severity + '% xavfli';
      badge.className = 'result-badge ' + (result.severity >= 60 ? 'high' : 'med');
      
      document.getElementById('result-name').textContent = result.name;
      document.getElementById('result-crop').textContent = cropLabels[crop];
      document.getElementById('result-symptoms').textContent = result.symptoms;
      document.getElementById('result-organic').textContent = result.organic;
      document.getElementById('result-chemical').textContent = result.chemical;
      document.getElementById('result-prevention').textContent = result.prevention;
      
      document.getElementById('scan-result').style.display = 'block';
      toast('Tahlil yakunlandi');
    }, 1200);
  }, 2200); // Time for scanning laser animation to run
});

// Render click-to-try sample cards in the UI
function renderSampleCards() {
  const container = document.getElementById('dropzone');
  
  const sampleWrap = document.createElement('div');
  sampleWrap.className = 'scanner-samples';
  sampleWrap.innerHTML = `
    <h4>Yoki namunani tanlab sinab ko'ring:</h4>
    <div class="samples-grid">
      <div class="sample-card" data-sample="tomato">
        <div class="sample-img-placeholder" style="background:#cc4444;color:#ffebeb;">🍅</div>
        <span>Pomidor</span>
      </div>
      <div class="sample-card" data-sample="cotton">
        <div class="sample-img-placeholder" style="background:#558833;color:#f5fff0;">🌱</div>
        <span>G'o'za</span>
      </div>
      <div class="sample-card" data-sample="wheat">
        <div class="sample-img-placeholder" style="background:#cca133;color:#fffaeb;">🌾</div>
        <span>Bug'doy</span>
      </div>
      <div class="sample-card" data-sample="potato">
        <div class="sample-img-placeholder" style="background:#8c6d48;color:#fcf9f5;">🥔</div>
        <span>Kartoshka</span>
      </div>
    </div>
  `;
  container.appendChild(sampleWrap);
  
  // Add events to click samples
  sampleWrap.querySelectorAll('.sample-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering parent dropzone click
      const crop = card.dataset.sample;
      document.getElementById('scanner-crop').value = crop;
      
      document.getElementById('image-preview').src = sampleImages[crop];
      dropzone.style.display = 'none';
      document.getElementById('preview-wrap').style.display = 'block';
      
      // Reset scanning animation and markers
      const box = document.querySelector('.scan-container-box');
      box.classList.remove('scanning');
      const markers = box.querySelectorAll('.scan-marker');
      markers.forEach(m => m.remove());
      
      toast(`${crop.toUpperCase()} namunasi yuklandi`);
    });
  });
}


/* ============================================================
   MARKET
   ============================================================ */
const cropMeta = {
  tomato:{label:'Pomidor'}, cotton:{label:"G'o'za (xomashyo)"}, wheat:{label:"Bug'doy (un uchun)"},
  potato:{label:'Kartoshka'}, onion:{label:'Piyoz'}, cucumber:{label:'Bodring'}
};
const marketData = {
  'tashkent-city':{ tomato:[14800,'up'], cotton:[10300,'flat'], wheat:[3900,'up'], potato:[5500,'up'], onion:[4300,'flat'], cucumber:[9800,'up'] },
  tashkent:{ tomato:[14400,'up'], cotton:[10200,'flat'], wheat:[3840,'down'], potato:[5400,'up'], onion:[4200,'down'], cucumber:[9600,'up'] },
  andijon:{ tomato:[13000,'flat'], cotton:[10700,'up'], wheat:[3820,'flat'], potato:[5300,'down'], onion:[4000,'up'], cucumber:[8600,'flat'] },
  fergana:{ tomato:[13200,'up'], cotton:[10500,'up'], wheat:[3900,'flat'], potato:[5100,'down'], onion:[3900,'flat'], cucumber:[8800,'up'] },
  namangan:{ tomato:[12900,'down'], cotton:[10400,'flat'], wheat:[3860,'up'], potato:[5000,'flat'], onion:[3950,'down'], cucumber:[8500,'up'] },
  sirdaryo:{ tomato:[12700,'flat'], cotton:[10900,'up'], wheat:[3750,'down'], potato:[4950,'down'], onion:[3800,'flat'], cucumber:[8300,'down'] },
  jizzax:{ tomato:[12500,'down'], cotton:[11000,'up'], wheat:[3700,'down'], potato:[4850,'down'], onion:[3750,'down'], cucumber:[8100,'flat'] },
  samarkand:{ tomato:[13800,'flat'], cotton:[9900,'down'], wheat:[3780,'down'], potato:[5600,'up'], onion:[4400,'up'], cucumber:[9200,'flat'] },
  qashqadaryo:{ tomato:[13100,'up'], cotton:[10600,'up'], wheat:[3830,'flat'], potato:[5200,'flat'], onion:[4100,'up'], cucumber:[8900,'up'] },
  surkhandarya:{ tomato:[12600,'down'], cotton:[10800,'up'], wheat:[3700,'down'], potato:[4900,'down'], onion:[3700,'down'], cucumber:[8400,'flat'] },
  bukhara:{ tomato:[15100,'up'], cotton:[10100,'flat'], wheat:[3950,'up'], potato:[5900,'up'], onion:[4600,'up'], cucumber:[10400,'up'] },
  navoiy:{ tomato:[14200,'up'], cotton:[10250,'flat'], wheat:[3880,'up'], potato:[5450,'up'], onion:[4250,'flat'], cucumber:[9700,'up'] },
  khorezm:{ tomato:[13500,'flat'], cotton:[10650,'up'], wheat:[3810,'flat'], potato:[5250,'down'], onion:[4050,'up'], cucumber:[9000,'flat'] },
  karakalpakstan:{ tomato:[12200,'down'], cotton:[11100,'up'], wheat:[3650,'down'], potato:[4700,'down'], onion:[3600,'down'], cucumber:[8000,'down'] }
};
const trendArrow = { up:'▲ Ko\'tarildi', down:'▼ Tushdi', flat:'━ Stabil' };
const trendSeries = {
  tomato:[11200,12100,13000,12500,13900,14400], cotton:[9800,9900,10400,10100,10300,10200],
  wheat:[4200,4100,3950,3900,3870,3840], potato:[4800,5000,5200,5300,5100,5400],
  onion:[4600,4500,4300,4100,4150,4200], cucumber:[8200,8600,9000,9300,9500,9600]
};
let currentMarketCrop = 'tomato';

// deterministic tuman factor
function hashStr(s){ let h = 0; for(let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i)) >>> 0; } return h; }
function tumanFactor(tuman, spread){
  const frac = (hashStr(tuman) % 1000) / 1000;
  return 1 + (frac*2 - 1) * spread;
}

function renderMarket(){
  // Paywall check for regional data
  if (checkProLock('market', 'market-region')) return;
  
  const region = document.getElementById('market-region').value;
  const tuman = document.getElementById('market-tuman').value;
  const data = marketData[region] || marketData.tashkent;
  const tbody = document.getElementById('market-tbody');
  tbody.innerHTML = '';
  
  Object.entries(data).forEach(([crop, [price, trend]]) => {
    const localPrice = Math.round((price * tumanFactor(tuman + crop, 0.05)) / 50) * 50;
    const tr = document.createElement('tr');
    if(crop === currentMarketCrop) tr.classList.add('row-active');
    tr.innerHTML = `
      <td class="crop-name">${cropMeta[crop].label}</td>
      <td class="price">${localPrice.toLocaleString('ru-RU')} UZS</td>
      <td><span class="trend ${trend}">${trendArrow[trend]}</span></td>
      <td><button class="btn btn-secondary btn-sm" data-crop="${crop}">Grafik</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-crop]').forEach(btn => {
    btn.addEventListener('click', () => { currentMarketCrop = btn.dataset.crop; renderMarket(); drawMarketChart(); });
  });
}


/* ============================================================
   ROTATION PLANNER
   ============================================================ */
const rotationRules = {
  cotton: [
    { crop:"Bug'doy", reason:"G'o'zadan keyin don ekinlari tuproqdagi azot balansini tiklaydi va zararkunandalar zanjirini uzadi." },
    { crop:"Mosh (mung loviya)", reason:"Dukkakli ekin sifatida tuproqni tabiiy azot bilan boyitadi, keyingi mavsum uchun unumdorlikni oshiradi." }
  ],
  wheat: [
    { crop:"G'o'za (Paxta)", reason:"Bug'doydan bo'shagan maydonda g'o'za yaxshi rivojlanadi, chunki tuproq tuzilishi allaqachon yumshatilgan." },
    { crop:"Sabzavotlar (pomidor, bodring)", reason:"Qisqa vegetatsiya davri tufayli bug'doy yig'im-terimidan so'ng ikkinchi hosil sifatida yetishtirish mumkin." }
  ],
  tomato: [
    { crop:"Dukkakli ekinlar (loviya, no'xat)", reason:"Pomidordan keyin dukkaklilar tuproqni azot bilan boyitadi va fitoftoraga qarshi tabiiy to'siq yaratadi." },
    { crop:"Don ekinlari (bug'doy, arpa)", reason:"Pomidorga xos kasalliklar don ekinlariga ta'sir qilmaydi, bu tuproqdagi patogenlarni kamaytiradi." }
  ],
  potato: [
    { crop:"Don ekinlari (bug'doy, arpa)", reason:"Kartoshkaga xos kasalliklarning (masalan, qo'tir) tarqalishini to'xtatish uchun eng ishonchli tanlov." },
    { crop:"Dukkakli ekinlar", reason:"Tuproqni azot bilan boyitib, kartoshka olib ketgan oziq moddalarni tiklaydi." }
  ]
};
const soilNotes = {
  loamy:"Qumoq tuproq deyarli barcha ekinlar uchun qulay, tanlangan ekinlar to'liq samara beradi.",
  sandy:"Qumloq tuproqda namlikni yaxshi tutadigan ekinlar (masalan, kartoshka, poliz) afzalroq, tez-tez sug'orishni unutmang.",
  clayey:"Gilli tuproqda drenajga e'tibor bering — don ekinlari va bug'doy og'ir tuproqqa nisbatan chidamliroq.",
  saline:"Sho'rlangan tuproqda sho'rga chidamli navlarni tanlang va ekishdan oldin gips yoki organik modda solishni unutmang."
};

document.getElementById('rotation-btn').addEventListener('click', () => {
  const soil = document.getElementById('soil-type').value;
  const prev = document.getElementById('prev-crop').value;
  const region = regionById(document.getElementById('rotation-region').value);
  const tuman = document.getElementById('rotation-tuman').value;

  const container = document.getElementById('rotation-results');
  container.innerHTML = '';
  const recs = rotationRules[prev] || rotationRules.cotton;

  recs.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'rotation-result';
    div.innerHTML = `<div class="rank">Tavsiya ${i+1}</div><h4>${r.crop}</h4><p>${r.reason}</p>`;
    container.appendChild(div);
  });
  const soilDiv = document.createElement('div');
  soilDiv.className = 'rotation-result';
  soilDiv.innerHTML = `<div class="rank">${tuman} tumani, ${region.label} · Tuproq eslatmasi</div><p>${soilNotes[soil]}</p>`;
  container.appendChild(soilDiv);

  document.getElementById('rotation-empty').style.display = 'none';
  container.style.display = 'block';
  toast('Tavsiyalar tayyor');
});


/* ============================================================
   WEATHER & WATER & IRRIGATION CALCULATOR
   ============================================================ */
const weatherData = {
  'tashkent-city':{ temp:33, cond:'Yarim bulutli, shahar iqlimi', humidity:33, wind:10, moisture:45, icon:'cloud' },
  tashkent:{ temp:34, cond:'Quyoshli va issiq', humidity:30, wind:12, moisture:42, icon:'sun' },
  andijon:{ temp:36, cond:'Quyoshli, issiq', humidity:28, wind:9, moisture:38, icon:'sun' },
  fergana:{ temp:37, cond:'Issiq va dim', humidity:25, wind:8, moisture:35, icon:'sun' },
  namangan:{ temp:35, cond:'Quyoshli', humidity:29, wind:9, moisture:40, icon:'sun' },
  sirdaryo:{ temp:36, cond:'Quruq va issiq', humidity:24, wind:14, moisture:33, icon:'wind' },
  jizzax:{ temp:35, cond:'Quyoshli, quruq', humidity:22, wind:16, moisture:30, icon:'wind' },
  samarkand:{ temp:31, cond:'Yarim bulutli', humidity:38, wind:15, moisture:55, icon:'cloud' },
  qashqadaryo:{ temp:38, cond:'Issiq va quruq', humidity:20, wind:11, moisture:27, icon:'sun' },
  surkhandarya:{ temp:41, cond:'Juda issiq, quruq', humidity:18, wind:10, moisture:22, icon:'sun' },
  bukhara:{ temp:39, cond:'Cho\'l iqlimi, issiq', humidity:19, wind:13, moisture:25, icon:'sun' },
  navoiy:{ temp:38, cond:'Quruq va changli', humidity:17, wind:19, moisture:20, icon:'wind' },
  khorezm:{ temp:36, cond:'Issiq, shamolli', humidity:23, wind:17, moisture:31, icon:'wind' },
  karakalpakstan:{ temp:33, cond:'Shamolli, quruq', humidity:20, wind:24, moisture:28, icon:'wind' }
};
const weatherIcons = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  wind:'<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>'
};

function irrigationAdvice(moisture){
  if(moisture < 30) return "Namlik juda past. Ertalab soat 8:00 gacha yoki kechki 19:00 dan keyin 30 l/m² sug'orish shart.";
  if(moisture < 50) return "Namlik past. Ertalab soat 8:00 gacha yoki kechki 19:00 dan keyin 20 l/m² sug'orish tavsiya etiladi.";
  if(moisture < 70) return "Namlik me'yorda yaqinlashmoqda. 10-12 l/m² yengil sug'orish yetarli bo'ladi.";
  return "Tuproq namligi yetarli. Bugun sug'orishni o'tkazib yuborish mumkin.";
}

function renderWeather(){
  // Paywall check for regional data
  if (checkProLock('weather', 'weather-region')) return;
  
  const region = document.getElementById('weather-region').value;
  const tuman = document.getElementById('weather-tuman').value;
  const base = weatherData[region] || weatherData.tashkent;
  const d = {
    temp: Math.round(base.temp * tumanFactor(tuman + 'temp', 0.04)),
    cond: base.cond,
    humidity: Math.max(5, Math.round(base.humidity * tumanFactor(tuman + 'hum', 0.08))),
    wind: Math.max(2, Math.round(base.wind * tumanFactor(tuman + 'wind', 0.15))),
    moisture: Math.min(95, Math.max(8, Math.round(base.moisture * tumanFactor(tuman + 'moist', 0.08)))),
    icon: base.icon
  };
  document.getElementById('w-temp').textContent = d.temp + '°C';
  document.getElementById('w-cond').textContent = d.cond;
  document.getElementById('w-humidity').textContent = d.humidity + '%';
  document.getElementById('w-wind').textContent = d.wind + ' km/s';
  document.getElementById('w-moisture').textContent = d.moisture + '%';
  document.getElementById('w-icon').innerHTML = weatherIcons[d.icon];
  document.getElementById('w-irrigation').textContent = irrigationAdvice(d.moisture);
  document.getElementById('w-soil-bar').style.width = d.moisture + '%';
}

// Inject and wire up the interactive Irrigation Calculator
function initIrrigationCalculator() {
  const container = document.querySelector('#view-weather .weather-grid');
  
  const calcCard = document.createElement('div');
  calcCard.className = 'card irrigation-calculator-card';
  calcCard.innerHTML = `
    <div class="card-head"><h3>Suv Sarfi va Vaqt Kalkulyatori</h3></div>
    <p style="font-size:.82rem;color:var(--text-dim);line-height:1.5;">Maydoningiz o'lchami va ekin turiga qarab tomchilatib sug'orish tizimi uchun aniq suv hajmi va vaqtini hisoblang.</p>
    
    <div class="irr-calc-form">
      <div class="form-group">
        <label>Maydon turi</label>
        <select id="calc-area-type" class="field-select" style="width:100%;">
          <option value="sotix">Sotix</option>
          <option value="hectare">Gektar</option>
        </select>
      </div>
      <div class="form-group">
        <label>Maydon o'lchami</label>
        <input type="number" id="calc-area-size" class="text-field" value="10" min="1" max="10000" style="padding: 10px 12px; height: 38px;">
      </div>
      <button class="btn btn-primary" id="calc-irr-btn" style="height: 38px;">Hisoblash</button>
    </div>
    
    <div class="irr-results-wrapper" id="irr-calc-results">
      <div class="irr-results-title" id="irr-calc-title">Hisob natijalari (10 Sotix maydon uchun)</div>
      <div class="irr-results-grid">
        <div class="irr-res-item">
          <span>Suv hajmi</span>
          <strong id="irr-res-water">20 m³</strong>
        </div>
        <div class="irr-res-item">
          <span>Tavsiya vaqti</span>
          <strong id="irr-res-time">3.5 soat</strong>
        </div>
        <div class="irr-res-item">
          <span>O'rtacha xarajat</span>
          <strong id="irr-res-cost">3 000 UZS</strong>
        </div>
      </div>
    </div>
  `;
  container.parentNode.appendChild(calcCard);
  
  // Wire calculation event
  document.getElementById('calc-irr-btn').addEventListener('click', () => {
    const size = parseFloat(document.getElementById('calc-area-size').value);
    const unit = document.getElementById('calc-area-type').value;
    
    if (isNaN(size) || size <= 0) {
      toast('Iltimos, maydon o\'lchamini to\'g\'ri kiriting');
      return;
    }
    
    const weatherRegion = document.getElementById('weather-region').value;
    const weatherTuman = document.getElementById('weather-tuman').value;
    const base = weatherData[weatherRegion] || weatherData.tashkent;
    const moisture = Math.min(95, Math.max(8, Math.round(base.moisture * tumanFactor(weatherTuman + 'moist', 0.08))));
    
    // Calculate values (e.g. 20 Liters per square meter if moisture is 42%)
    const litersPerSqm = moisture < 30 ? 30 : (moisture < 50 ? 20 : 10);
    const sqmMultiplier = unit === 'sotix' ? 100 : 10000;
    const totalSqm = size * sqmMultiplier;
    const totalLiters = totalSqm * litersPerSqm;
    const totalCubicMeters = Math.round(totalLiters / 1000);
    
    // Time based on standard drip flow rate (approx 6 cubic meters per hour for a pump)
    const hours = (totalCubicMeters / 6).toFixed(1);
    
    // Cost based on average agricultural water rate in Uzbekistan (approx 150 UZS per cubic meter)
    const cost = Math.round(totalCubicMeters * 150);
    
    // Update elements
    document.getElementById('irr-calc-title').textContent = `Hisob natijalari (${size} ${unit === 'sotix' ? 'Sotix' : 'Gektar'} uchun)`;
    document.getElementById('irr-res-water').textContent = totalCubicMeters.toLocaleString('ru-RU') + ' m³';
    document.getElementById('irr-res-time').textContent = hours + ' soat';
    document.getElementById('irr-res-cost').textContent = cost.toLocaleString('ru-RU') + ' UZS';
    
    document.getElementById('irr-calc-results').style.display = 'block';
    toast('Sug\'orish normasi hisoblandi');
  });
}

// Delay calling to make sure elements are fully loaded
setTimeout(initIrrigationCalculator, 50);


/* ============================================================
   REGIONS LOADER & HELPER
   ============================================================ */
const REGIONS = [
  { id:'tashkent-city', label:"Toshkent shahri", tumanlar:["Chilonzor","Yunusobod","Mirzo Ulug'bek","Yakkasaroy","Sergeli","Bektemir"] },
  { id:'tashkent', label:"Toshkent viloyati", tumanlar:["Zangiota","Qibray","Chirchiq","Bekabad","Yangiyo'l","Bo'ka"] },
  { id:'andijon', label:"Andijon viloyati", tumanlar:["Asaka","Xo'jaobod","Marhamat","Shahrixon","Baliqchi","Qo'rg'ontepa"] },
  { id:'fergana', label:"Farg'ona viloyati", tumanlar:["Qo'qon","Marg'ilon","Rishton","Quva","Beshariq","Oltiariq"] },
  { id:'namangan', label:"Namangan viloyati", tumanlar:["Chust","Pop","Kosonsoy","Uchqo'rg'on","Norin","Yangiqo'rg'on"] },
  { id:'sirdaryo', label:"Sirdaryo viloyati", tumanlar:["Guliston","Boyovut","Sardoba","Mirzaobod","Sayxunobod","Xovos"] },
  { id:'jizzax', label:"Jizzax viloyati", tumanlar:["Zomin","Do'stlik","Forish","G'allaorol","Zafarobod","Paxtakor"] },
  { id:'samarkand', label:"Samarqand viloyati", tumanlar:["Kattaqo'rg'on","Urgut","Bulung'ur","Jomboy","Payariq","Ishtixon"] },
  { id:'qashqadaryo', label:"Qashqadaryo viloyati", tumanlar:["Shahrisabz","Kitob","Koson","G'uzor","Kasbi","Chiroqchi"] },
  { id:'surkhandarya', label:"Surxondaryo viloyati", tumanlar:["Denov","Sherobod","Boysun","Sho'rchi","Angor","Qumqo'rg'on"] },
  { id:'bukhara', label:"Buxoro viloyati", tumanlar:["G'ijduvon","Kogon","Vobkent","Peshku","Qorako'l","Olot"] },
  { id:'navoiy', label:"Navoiy viloyati", tumanlar:["Konimex","Karmana","Xatirchi","Nurota","Uchquduq","Qiziltepa"] },
  { id:'khorezm', label:"Xorazm viloyati", tumanlar:["Xiva","Xonqa","Shovot","Gurlan","Yangiariq","Bog'ot"] },
  { id:'karakalpakstan', label:"Qoraqalpog'iston Respublikasi", tumanlar:["Xo'jayli","Beruniy","To'rtko'l","Chimboy","Qo'ng'irot","Taxtako'pir"] }
];
const regionById = id => REGIONS.find(r => r.id === id);

function populateRegionSelects(regionSelectId, tumanSelectId, onChange){
  const regionSel = document.getElementById(regionSelectId);
  const tumanSel = document.getElementById(tumanSelectId);
  regionSel.innerHTML = REGIONS.map(r => `<option value="${r.id}">${r.label}</option>`).join('');
  function fillTumanlar(){
    const region = regionById(regionSel.value);
    tumanSel.innerHTML = region.tumanlar.map(t => `<option value="${t}">${t} tumani</option>`).join('');
  }
  fillTumanlar();
  regionSel.addEventListener('change', () => { fillTumanlar(); onChange(); });
  tumanSel.addEventListener('change', onChange);
}

// Wire up the region lists
populateRegionSelects('market-region', 'market-tuman', renderMarket);
populateRegionSelects('weather-region', 'weather-tuman', renderWeather);
populateRegionSelects('rotation-region', 'rotation-tuman', () => {});


/* ============================================================
   CHARTS (Chart.js wrapper)
   ============================================================ */
let dashboardChart, marketChart;
function chartTextColor(){ return getComputedStyle(document.documentElement).getPropertyValue('--text-dim').trim(); }
function chartGridColor(){ return getComputedStyle(document.documentElement).getPropertyValue('--border-soft').trim(); }
function goldColor(){ return getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(); }
function leafColor(){ return getComputedStyle(document.documentElement).getPropertyValue('--leaf').trim(); }

const months = ['Fevral','Mart','Aprel','May','Iyun','Iyul'];

function baseChartOptions(){
  return {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
      x:{ ticks:{ color:chartTextColor(), font:{ family:'Manrope', size:11 } }, grid:{ display:false } },
      y:{ ticks:{ color:chartTextColor(), font:{ family:'Manrope', size:11 } }, grid:{ color:chartGridColor() } }
    }
  };
}

function drawDashboardChart(){
  const ctx = document.getElementById('chart-dashboard');
  if(!ctx) return;
  if(dashboardChart) dashboardChart.destroy();
  dashboardChart = new Chart(ctx, {
    type:'line',
    data:{ labels:months, datasets:[{ data:trendSeries.tomato, borderColor:goldColor(), backgroundColor:'transparent', tension:.4, pointRadius:3, pointBackgroundColor:goldColor(), borderWidth:2.5 }] },
    options: baseChartOptions()
  });
}

function drawMarketChart(){
  const ctx = document.getElementById('chart-market');
  if(!ctx) return;
  if(marketChart) marketChart.destroy();
  document.getElementById('market-chart-title').textContent = cropMeta[currentMarketCrop].label + ' narx dinamikasi — so\'nggi 6 oy';
  marketChart = new Chart(ctx, {
    type:'line',
    data:{ labels:months, datasets:[{ data:trendSeries[currentMarketCrop], borderColor:leafColor(), backgroundColor:'color-mix(in srgb, ' + leafColor() + ' 18%, transparent)', fill:true, tension:.4, pointRadius:3, pointBackgroundColor:leafColor(), borderWidth:2.5 }] },
    options: baseChartOptions()
  });
}

function drawAllCharts(){ drawDashboardChart(); drawMarketChart(); }


/* ============================================================
   INITIALIZATION
   ============================================================ */
renderMarket();
renderWeather();
setTimeout(drawAllCharts, 100);
