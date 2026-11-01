/**
 * APOLLO 24/7 WAITING ROOM - PARODY APPLICATION ENGINE
 * Independent Consumer Commentary & Parody Suite
 */

// ==========================================
// 1. CHRONOGRAPH & WAITING TIMERS
// ==========================================

// Delivery due date / Waiting started: October 29, 2026 09:00 AM
const WAITING_START_DATE = new Date('2026-10-29T09:00:00');
// Promised delivery deadline: October 29, 2026 18:00 PM
const PROMISED_DATE = new Date('2026-10-29T18:00:00');

function updateTimers() {
  const now = new Date();
  
  // Total elapsed time since delivery was expected (October 29, 2026)
  let diffMs = now - WAITING_START_DATE;
  if (diffMs < 0) {
    // If client system clock is set before 2026, calculate accurate 3-day elapsed time
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    diffMs = 3 * 86400000 + 8 * 3600000 + (mins * 60000) + (secs * 1000);
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-minutes');
  const secsEl = document.getElementById('timer-seconds');

  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');

  // Overdue calculation (since 29 Oct 18:00)
  let overdueMs = now - PROMISED_DATE;
  if (overdueMs < 0) {
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    overdueMs = 2 * 86400000 + 23 * 3600000 + (mins * 60000) + (secs * 1000);
  }
  const oDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
  const oHours = Math.floor((overdueMs / (1000 * 60 * 60)) % 24);
  const oMins = Math.floor((overdueMs / (1000 * 60)) % 60);
  const oSecs = Math.floor((overdueMs / 1000) % 60);

  const overdueEl = document.getElementById('timer-overdue');
  if (overdueEl) {
    overdueEl.textContent = `${oDays}d ${oHours}h ${oMins}m ${oSecs}s overdue`;
  }
}

setInterval(updateTimers, 1000);
updateTimers();

// ==========================================
// 2. AUDIO SYNTHESIZER & SOUND EFFECTS
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  playBuzzer() {
    this.init();
    if (!this.ctx) return;
    this.playTone(150, 'sawtooth', 0.35, 0.15);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    this.playTone(523.25, 'triangle', 0.1, 0.1);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.15, 0.1), 100);
  }

  playBrake() {
    this.init();
    if (!this.ctx) return;
    this.playTone(850, 'sawtooth', 0.4, 0.08);
  }

  // Iconic elevator hold music synthesizer loop
  startHoldMusic() {
    this.init();
    if (!this.ctx) return null;
    
    // Notes of elevator hold melody
    const notes = [392, 440, 523.25, 659.25, 587.33, 523.25, 440, 392];
    let noteIdx = 0;
    
    const interval = setInterval(() => {
      this.playTone(notes[noteIdx % notes.length], 'sine', 0.4, 0.08);
      noteIdx++;
    }, 450);

    return () => clearInterval(interval);
  }
}

const sfx = new SoundFX();

// ==========================================
// 3. AUDIO PLAYER & RECORDING PROOF SUITE
// ==========================================
const audioPlayer = {
  element: new Audio(),
  isPlaying: false,
  isHoldSimulation: false,
  stopHoldMusic: null,
  userAudioUrl: null,

  init() {
    const playBtn = document.getElementById('btn-play-audio');
    const fileInput = document.getElementById('audio-file-input');
    const uploadBox = document.getElementById('audio-upload-dropzone');
    const progressBar = document.getElementById('progress-bar-bg');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadCustomFile(e.target.files[0]);
        }
      });
    }

    if (uploadBox) {
      uploadBox.addEventListener('click', () => {
        if (fileInput) fileInput.click();
      });

      uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
      });

      uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
      });

      uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadCustomFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        if (this.element.duration) {
          const rect = progressBar.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          this.element.currentTime = clickPos * this.element.duration;
        }
      });
    }

    // Audio element event listeners
    this.element.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.element.addEventListener('ended', () => this.onEnded());
    
    // Check if a default recording exists in the audio/ folder
    this.element.src = 'audio/call-recording.mp3';
    this.element.addEventListener('error', () => {
      // Default file doesn't exist yet, we stay in simulator / custom upload ready mode
      this.userAudioUrl = null;
    });
  },

  loadCustomFile(file) {
    if (this.isPlaying) this.pause();
    
    this.userAudioUrl = URL.createObjectURL(file);
    this.element.src = this.userAudioUrl;
    
    const trackTitle = document.getElementById('audio-track-title');
    const trackSubtitle = document.getElementById('audio-track-subtitle');
    
    if (trackTitle) trackTitle.textContent = `Evidence: ${file.name}`;
    if (trackSubtitle) trackSubtitle.textContent = `User Attached Recording • Ready to play (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    
    showToast(`Loaded audio proof: ${file.name}`);
    this.play();
  },

  togglePlay() {
    sfx.init();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  play() {
    const playBtn = document.getElementById('btn-play-audio');
    const waveform = document.getElementById('waveform-box');

    // If an audio source exists and is valid
    if (this.element.src && !this.element.src.endsWith('#') && this.element.error === null && this.userAudioUrl) {
      this.element.play().then(() => {
        this.isPlaying = true;
        if (playBtn) playBtn.innerHTML = '⏸';
        if (waveform) waveform.classList.add('playing');
      }).catch(err => {
        console.warn('Direct playback failed, switching to simulated call:', err);
        this.playSimulatedCall();
      });
    } else {
      // Simulated Call Experience with Web Audio + SpeechSynthesis
      this.playSimulatedCall();
    }
  },

  playSimulatedCall() {
    this.isPlaying = true;
    this.isHoldSimulation = true;
    const playBtn = document.getElementById('btn-play-audio');
    const waveform = document.getElementById('waveform-box');
    const curTimeEl = document.getElementById('audio-cur-time');
    const durTimeEl = document.getElementById('audio-dur-time');
    const trackTitle = document.getElementById('audio-track-title');

    if (playBtn) playBtn.innerHTML = '⏸';
    if (waveform) waveform.classList.add('playing');
    if (trackTitle) trackTitle.textContent = 'Simulating Apollo Support Call #10...';
    if (durTimeEl) durTimeEl.textContent = '00:48';

    // Start hold tune
    this.stopHoldMusic = sfx.startHoldMusic();

    // Voice announcement after 2 seconds
    let holdSeconds = 0;
    this.simTimer = setInterval(() => {
      holdSeconds++;
      if (curTimeEl) {
        const mins = String(Math.floor(holdSeconds / 60)).padStart(2, '0');
        const secs = String(holdSeconds % 60).padStart(2, '0');
        curTimeEl.textContent = `${mins}:${secs}`;
      }
      const fillEl = document.getElementById('progress-bar-fill');
      if (fillEl) {
        fillEl.style.width = `${Math.min(100, (holdSeconds / 48) * 100)}%`;
      }
      if (holdSeconds >= 48) {
        this.pause();
      }
    }, 1000);

    setTimeout(() => {
      if (!this.isPlaying) return;
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          "Welcome to Apollo twenty four seven customer support. We understand your order was placed on October twenty-sixth. All of our executives are currently busy inventing new excuses with BlueDart and Shiprocket. Your expected callback time is seventy-two business years. We have marked your delivery as attempted without calling you. Have a wonderful day."
        );
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }, 1800);
  },

  pause() {
    this.isPlaying = false;
    const playBtn = document.getElementById('btn-play-audio');
    const waveform = document.getElementById('waveform-box');

    if (playBtn) playBtn.innerHTML = '▶';
    if (waveform) waveform.classList.remove('playing');

    if (this.isHoldSimulation) {
      if (this.stopHoldMusic) this.stopHoldMusic();
      clearInterval(this.simTimer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.isHoldSimulation = false;
    } else {
      this.element.pause();
    }
  },

  onTimeUpdate() {
    if (this.isHoldSimulation) return;
    const curTime = this.element.currentTime;
    const dur = this.element.duration || 1;

    const fillEl = document.getElementById('progress-bar-fill');
    if (fillEl) {
      fillEl.style.width = `${(curTime / dur) * 100}%`;
    }

    const curTimeEl = document.getElementById('audio-cur-time');
    const durTimeEl = document.getElementById('audio-dur-time');

    if (curTimeEl) curTimeEl.textContent = this.formatTime(curTime);
    if (durTimeEl && !isNaN(dur)) durTimeEl.textContent = this.formatTime(dur);
  },

  onEnded() {
    this.pause();
    const curTimeEl = document.getElementById('audio-cur-time');
    const fillEl = document.getElementById('progress-bar-fill');
    if (curTimeEl) curTimeEl.textContent = '00:00';
    if (fillEl) fillEl.style.width = '0%';
  },

  formatTime(secs) {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
};

// ==========================================
// 4. THE INFINITE DELIVERY LOOP SIMULATOR
// ==========================================
let loopInterval = null;
let currentLoopStage = 0;

function runLoopSimulation() {
  sfx.init();
  const stages = document.querySelectorAll('.loop-stage');
  const simBtn = document.getElementById('btn-run-loop');
  if (stages.length === 0) return;

  if (loopInterval) {
    clearInterval(loopInterval);
    loopInterval = null;
    stages.forEach(s => s.classList.remove('active', 'failed'));
    if (simBtn) simBtn.textContent = '▶ Simulate Today\'s Delivery Cycle';
    return;
  }

  if (simBtn) simBtn.textContent = '⏹ Stop Simulation';
  currentLoopStage = 0;

  function advance() {
    stages.forEach(s => s.classList.remove('active', 'failed'));
    const cur = stages[currentLoopStage];

    if (currentLoopStage === 3 || currentLoopStage === 4) {
      cur.classList.add('failed');
      sfx.playBuzzer();
    } else {
      cur.classList.add('active');
      sfx.playSuccess();
    }

    currentLoopStage++;
    if (currentLoopStage >= stages.length) {
      currentLoopStage = 0;
    }
  }

  advance();
  loopInterval = setInterval(advance, 2200);
}

// ==========================================
// 5. RADAR PARODY (BlueDart Teleporting Rider)
// ==========================================
let radarAnimating = false;

function triggerRadarSimulation() {
  if (radarAnimating) return;
  sfx.init();
  radarAnimating = true;

  const riderMarker = document.getElementById('marker-rider');
  const logEl = document.getElementById('radar-live-log');
  const btn = document.getElementById('btn-test-radar');

  if (btn) btn.disabled = true;

  if (logEl) logEl.textContent = '⚡ BlueDart Rider Mukesh spotted 1.2km away...';
  sfx.playTone(400, 'sine', 0.1, 0.1);

  // Step 1: Rider moves close to 65%
  setTimeout(() => {
    if (riderMarker) {
      riderMarker.style.left = '62%';
      riderMarker.style.top = '48%';
    }
    if (logEl) logEl.textContent = '⚠️ Rider reached 150m from your house! Preparing delivery...';
    sfx.playTone(600, 'sine', 0.1, 0.1);
  }, 1200);

  // Step 2: Rider stops, panics, makes U-Turn
  setTimeout(() => {
    sfx.playBrake();
    if (logEl) logEl.textContent = '🛑 Sudden U-Turn detected! Rider turned 180° away!';
    if (riderMarker) {
      riderMarker.style.transform = 'translate(-50%, -50%) scaleX(1)';
    }
  }, 2800);

  // Step 3: Rider accelerates back to 10%
  setTimeout(() => {
    if (riderMarker) {
      riderMarker.style.left = '10%';
      riderMarker.style.top = '70%';
    }
    sfx.playBuzzer();
    if (logEl) logEl.textContent = '❌ STATUS LOGGED: "Customer was unreachable / disappeared into another dimension (0 calls made)"';
    showToast('BlueDart SMS received: Customer unavailable without phone ringing!');
  }, 4200);

  // Reset
  setTimeout(() => {
    radarAnimating = false;
    if (btn) btn.disabled = false;
    if (riderMarker) {
      riderMarker.style.left = '20%';
      riderMarker.style.top = '50%';
      riderMarker.style.transform = 'translate(-50%, -50%) scaleX(-1)';
    }
  }, 7500);
}

// ==========================================
// 6. EXCUSE GENERATOR 3.0
// ==========================================
const savageExcuses = [
  "Customer unavailable. Our delivery executive called using telepathy, but your mind was engaged.",
  "Shiprocket handed parcel to BlueDart. BlueDart handed parcel to the wind.",
  "Your order has been 'Out for Delivery' for 7 consecutive days because the road is metaphorical.",
  "Customer contact number was dialed internally in our hearts. No actual network call was placed.",
  "Executive arrived 200m near your house, smelled fresh samosas, and forgot the mission.",
  "We have escalated your complaint to our Senior Escalation Manager of Inaction.",
  "Your parcel is currently meditating in the regional sorting hub to achieve inner peace.",
  "Apollo customer care: 'Sir, today by 8:00 PM guaranteed.' (Spoken every day since October 29).",
  "BlueDart update: Address incomplete. Address had house number, street, landmark, and GPS coordinates.",
  "Our delivery boy knocked on your door in a parallel universe. You were not home there either.",
  "Shiprocket tracking shows: Package in Transit. Transit from one side of warehouse shelf to the other.",
  "Customer reached out 10 times in 3 days. Support rep has promised to 'personally look into this' 10 times.",
  "Your medicine is taking the scenic route across India to mature like fine wine.",
  "Attempted delivery at 5:45 PM. Customer was standing at the front gate staring at empty road.",
  "Support response: 'Please allow 24 to 48 business decades for resolution.'"
];

let excuseIndex = 0;
let updateCounter = 0;

function refreshExcuse() {
  sfx.init();
  sfx.playSuccess();
  excuseIndex = (excuseIndex + 1) % savageExcuses.length;
  updateCounter++;

  const excuseEl = document.getElementById('excuse-output-text');
  const countEl = document.getElementById('excuse-counter-badge');

  if (excuseEl) {
    excuseEl.style.opacity = '0';
    setTimeout(() => {
      excuseEl.textContent = savageExcuses[excuseIndex];
      excuseEl.style.opacity = '1';
    }, 150);
  }

  if (countEl) {
    countEl.textContent = `${updateCounter} fictional updates · 0 parcels moved`;
  }
}

// ==========================================
// 7. SUPPORT CALL #11 SIMULATOR
// ==========================================
let userSupportCalls = 10;

function simulateSupportCall() {
  sfx.init();
  userSupportCalls++;
  sfx.playTone(700, 'triangle', 0.2, 0.15);

  const callCountEl = document.getElementById('stat-call-count');
  if (callCountEl) {
    callCountEl.textContent = `${userSupportCalls}+`;
  }

  const responses = [
    `Call #${userSupportCalls}: Agent: "Sir, I am escalating this to my shift lead. You will receive an SMS in 15 minutes." (Nothing arrived).`,
    `Call #${userSupportCalls}: Agent: "Sir, please do not worry, your health is our priority. Delivery executive is on his way." (Executive is at home).`,
    `Call #${userSupportCalls}: Agent: "Sir, BlueDart hub is having a server glitch. We have raised a ticket on high priority."`,
    `Call #${userSupportCalls}: Agent: "Sir, would you like to cancel and re-order?" (Sensor expired 2 days ago, glucose at 341 mg/dL).`
  ];

  const randomResp = responses[Math.floor(Math.random() * responses.length)];
  showToast(randomResp);

  // Append to call log list
  const list = document.getElementById('call-logs-container');
  if (list) {
    const item = document.createElement('div');
    item.className = 'call-log-item';
    item.innerHTML = `
      <div class="call-log-meta">
        <span>Call #${userSupportCalls} • Just Now</span>
        <span style="color:#ef4444">FAILED</span>
      </div>
      <div class="call-log-text">${randomResp}</div>
    `;
    list.insertBefore(item, list.firstChild);
  }
}

// ==========================================
// 8. RESOLUTION ARSENAL & TOAST
// ==========================================
function copyGrievanceNotice() {
  const text = `FORMAL GRIEVANCE: UNFAIR TRADE PRACTICE & DEFICIENCY OF SERVICE
To: Apollo 24|7 Management / BlueDart Express / Shiprocket
Subject: URGENT: Life-Critical FreeStyle Libre CGM Sensor Delivery / Warehouse Pickup (Apollo Order #362811882)

I placed order #362811882 on 26th October 2026 for a FreeStyle Libre Continuous Glucose Monitoring (CGM) sensor. The promised delivery date (29 October) has lapsed. Over the past 72+ hours, I have contacted customer support over 10 times without resolution.

My previous sensor expired 2 days ago, causing blood sugar to spike to a dangerous 341 mg/dL. 

Furthermore, delivery tracking falsely reports "Delivery Attempted / Customer Unavailable" despite ZERO phone calls or physical visits to my verified address.

DEMANDS:
1. Deliver the pending package immediately within 24 hours, OR
2. Provide the exact physical address, contact manager, and authorization for direct self-collection from the holding BlueDart warehouse hub.
3. Cease recording falsified delivery attempt logs.

Failure to resolve will result in immediate formal escalation to the National Consumer Helpline (NCH), INGRAM portal, the Central Consumer Protection Authority (CCPA), and Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019.`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Formal Consumer Grievance notice (Order #362811882) copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy automatically. Please select text manually.');
  });
}

function shareOnTwitter() {
  const tweet = encodeURIComponent(
    `Hey @Apollo247 @BlueDart_ @ShiprocketIndia, Order #362811882 was placed on 26 Oct 2026. Reached support 10+ times in 3 days. Your riders keep marking "Customer Unavailable" with ZERO phone calls! Deliver it or let me collect it from your hub! 📦⌛ #Apollo247 #ConsumerRights`
  );
  window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
}

function shareViralTweet() {
  const tweet = encodeURIComponent(
    `🚨 MEDICAL EMERGENCY: @Apollo247 @BlueDart_ @ShiprocketIndia\n\nOrder #362811882 for FreeStyle Libre CGM sensor is marked "Delivery Attempted" with ZERO phone calls! My sensor expired 2 days ago & blood sugar spiked to 341 mg/dL ↗!\n\nDeliver it NOW or give me the hub address to pick up!\n\nProof & Tracker: https://apollo-waiting-room-parody.vercel.app/\n\n#Apollo247 #MedicalEmergency #BlueDart #ConsumerRights @jagograhakjago`
  );
  window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
}

function copyInstagramCaption() {
  const caption = `🚨 MEDICAL EMERGENCY & EXPOSURE: HOW APOLLO 24|7 & BLUEDART ARE ENDANGERING PATIENTS 🚨

APOLLO ORDER NUMBER: #362811882
ITEM: FreeStyle Libre Continuous Glucose Monitoring (CGM) Sensor
ORDER STATUS: "Delivery Attempted" (FALSE CLAIM - 0 CALLS MADE)

My previous sensor EXPIRED 2 days ago.
Without continuous monitoring, my blood sugar spiked dangerously to 341 mg/dL ↗ (swipe to see receipts).

Over the last 72 hours:
📞 10+ desperate calls made to Apollo Customer Support.
🚫 ZERO phone calls received from the BlueDart delivery boy.
❌ Repeated fake SMS updates: "Customer Unavailable / Delivery Attempted".
🛑 Refused self-pickup when I offered to drive to the BlueDart warehouse myself.

Healthcare delivery is not an e-commerce game. When you delay critical medical equipment, lives are at risk.

🔗 Full tracker & call simulator: https://apollo-waiting-room-parody.vercel.app/

@apollo247 @bluedart_express @shiprocket @jagograhakjago_official @ministryofhealth_india

#Apollo247 #BlueDart #Shiprocket #Order362811882 #DiabetesAwareness #Type1Diabetes #ContinuousGlucoseMonitor #ConsumerRights #MedicalNegligence #HighGlucose #JagoGrahakJago`;

  navigator.clipboard.writeText(caption).then(() => {
    showToast('📸 Instagram caption with Order #362811882 copied to clipboard! Ready to paste into your Post/Story.');
  }).catch(() => {
    showToast('Failed to copy. Please manually copy caption.');
  });
}

function shareOnWhatsApp() {
  const msg = encodeURIComponent(
    `🚨 Critical medical delivery failure: Apollo Order #362811882 for FreeStyle Libre glucose sensor marked "Delivery Attempted" with 0 phone calls! Sensor expired 2 days ago, glucose spiked to 341 mg/dL! Check the full evidence tracker: https://apollo-waiting-room-parody.vercel.app/`
  );
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

// ==========================================
// 9. INITIALIZE ON LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  audioPlayer.init();

  const btnExcuse = document.getElementById('btn-refresh-excuse');
  if (btnExcuse) btnExcuse.addEventListener('click', refreshExcuse);

  const btnLoop = document.getElementById('btn-run-loop');
  if (btnLoop) btnLoop.addEventListener('click', runLoopSimulation);

  const btnRadar = document.getElementById('btn-test-radar');
  if (btnRadar) btnRadar.addEventListener('click', triggerRadarSimulation);

  const btnCall = document.getElementById('btn-simulate-call');
  if (btnCall) btnCall.addEventListener('click', simulateSupportCall);

  const btnCopyGrievance = document.getElementById('btn-copy-grievance');
  if (btnCopyGrievance) btnCopyGrievance.addEventListener('click', copyGrievanceNotice);

  const btnShare = document.getElementById('btn-share-twitter');
  if (btnShare) btnShare.addEventListener('click', shareOnTwitter);

  // Viral social sharing
  const btnViralTop = document.getElementById('btn-share-viral-top');
  if (btnViralTop) btnViralTop.addEventListener('click', shareViralTweet);

  const btnViralTw = document.getElementById('btn-share-twitter-viral');
  if (btnViralTw) btnViralTw.addEventListener('click', shareViralTweet);

  const btnViralInsta = document.getElementById('btn-share-instagram-viral');
  if (btnViralInsta) btnViralInsta.addEventListener('click', copyInstagramCaption);

  const btnViralWa = document.getElementById('btn-share-whatsapp-viral');
  if (btnViralWa) btnViralWa.addEventListener('click', shareOnWhatsApp);

  // Image modal for all proof screenshots
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const proofImages = document.querySelectorAll('.zoomable-proof');

  proofImages.forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
});

