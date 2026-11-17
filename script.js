/**
 * FLORENCE MINECRAFT DIGITAL STORE — MAIN SCRIPT
 * Handles product catalog, shopping cart, skin preview, checkout,
 * payment simulation, audio synthesis, order tracking & animations.
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
  STORE_NAME: "Florence Network",
  SERVER_IP: "game-gnl-jh3.raznar.net",
  BEDROCK_PORT: 9242,
  ADMIN_WA: "6283187198288",
  ADMIN_WA_DISPLAY: "0831-8719-8288",
  PAYMENT_PHONE: "083159084210",
  PAYMENT_PHONE_DISPLAY: "0831-5908-4210",
  QRIS_IMAGE_URL: "qris.jpg",
  QRIS_MERCHANT_NAME: "ETERNALSMP, ID",
  QRIS_NMID: "ID1025374342240",
  CURRENCY_SYMBOL: "Rp ",
  COUPONS: {
    "FLORENCE25": { discountPercent: 25, label: "Diskon Khusus Grand Opening 25%" },
    "SEASON5": { discountPercent: 15, label: "Diskon Season 5 (15%)" },
    "SULTAN": { discountAmount: 30000, label: "Potongan Langsung Rp 30.000" }
  },
  SOUND_ENABLED: true
};

// Base CDN for authentic pixel-crisp Minecraft textures
const MC_CDN = "https://assets.mcasset.cloud/1.20.4/assets/minecraft/textures/";

// ==================== PRESERVASI LENGKAP PRODUK (12 TIER RANK + ITEMS) ====================
const PRODUCTS = [
  // ---------- TIER STARTER ----------
  {
    id: 1,
    name: "Rank Novice (Noob)",
    category: "starter",
    price: 5000,
    oldPrice: 10000,
    badge: "STARTER",
    badgeColor: "cyan",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Wooden Sword",
    image: MC_CDN + "item/wooden_sword.png",
    command: "lp user {ign} parent add noob",
    tierKey: "noob",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear",
      "Bonus Uang In-Game: $25.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 2,
    name: "Rank Stone",
    category: "starter",
    price: 10000,
    oldPrice: 15000,
    badge: "TIER 2",
    badgeColor: "cyan",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Stone Pickaxe",
    image: MC_CDN + "item/stone_pickaxe.png",
    command: "lp user {ign} parent add stone",
    tierKey: "stone",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day",
      "Bonus Uang In-Game: $50.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 3,
    name: "Rank Iron",
    category: "starter",
    price: 15000,
    oldPrice: 20000,
    badge: "TIER 3",
    badgeColor: "purple",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Iron Ingot",
    image: MC_CDN + "item/iron_ingot.png",
    command: "lp user {ign} parent add iron",
    tierKey: "iron",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather",
      "Bonus Uang In-Game: $100.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 4,
    name: "Rank Gold",
    category: "starter",
    price: 20000,
    oldPrice: 25000,
    badge: "HOT",
    badgeColor: "gold",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Gold Ingot",
    image: MC_CDN + "item/gold_ingot.png",
    command: "lp user {ign} parent add gold",
    tierKey: "gold",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather, +nightvision",
      "Bonus Uang In-Game: $250.000",
      "Item Eksklusif Benefit Rank"
    ]
  },

  // ---------- TIER ELEMENTAL ----------
  {
    id: 5,
    name: "Rank Diamond",
    category: "elemental",
    price: 25000,
    oldPrice: 35000,
    badge: "BEST VALUE",
    badgeColor: "cyan",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Diamond Gem",
    image: MC_CDN + "item/diamond.png",
    command: "lp user {ign} parent add diamond",
    tierKey: "diamond",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather, +nv, +enderchest, +workbench",
      "Bonus Uang In-Game: $500.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 6,
    name: "Rank Water",
    category: "elemental",
    price: 30000,
    oldPrice: 40000,
    badge: "ELEMENTAL",
    badgeColor: "cyan",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Heart of the Sea",
    image: MC_CDN + "item/heart_of_the_sea.png",
    command: "lp user {ign} parent add water",
    tierKey: "water",
    benefits: [
      "Perintah Chat: +feed, +heal, +clear, +day, +weather, +ec, +nv, +haste",
      "Bonus Uang In-Game: $850.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 7,
    name: "Rank Fire",
    category: "elemental",
    price: 35000,
    oldPrice: 45000,
    badge: "ELEMENTAL",
    badgeColor: "gold",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Blaze Rod",
    image: MC_CDN + "item/blaze_rod.png",
    command: "lp user {ign} parent add fire",
    tierKey: "fire",
    benefits: [
      "Perintah Chat: +feed, +heal, +ec, +nv, +haste, +warp resource",
      "Bonus Uang In-Game: $1.250.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 8,
    name: "Rank Nether",
    category: "elemental",
    price: 40000,
    oldPrice: 55000,
    badge: "NETHER TIER",
    badgeColor: "purple",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Netherite Ingot",
    image: MC_CDN + "item/netherite_ingot.png",
    command: "lp user {ign} parent add nether",
    tierKey: "nether",
    benefits: [
      "Perintah Chat: +fly, +feed, +heal, +ec, +nv, +haste, +fireres",
      "Bonus Uang In-Game: $1.750.000",
      "Item Eksklusif Benefit Rank"
    ]
  },

  // ---------- TIER SULTAN ----------
  {
    id: 9,
    name: "Rank End",
    category: "sultan",
    price: 55000,
    oldPrice: 75000,
    badge: "POPULAR",
    badgeColor: "purple",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Eye of Ender",
    image: MC_CDN + "item/ender_eye.png",
    command: "lp user {ign} parent add end",
    tierKey: "end",
    benefits: [
      "Perintah Chat: +fly, +feed, +heal, +ec, +nv, +haste, +fireres, +hov",
      "Bonus Uang In-Game: $2.500.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 10,
    name: "Rank Space",
    category: "sultan",
    price: 85000,
    oldPrice: 110000,
    badge: "COSMIC TIER",
    badgeColor: "cyan",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Elytra Wings",
    image: MC_CDN + "item/elytra.png",
    command: "lp user {ign} parent add space",
    tierKey: "space",
    benefits: [
      "Perintah Chat: +fly, +craft, +feed, +heal, +speed, +jumpboost, +hov",
      "Bonus Uang In-Game: $3.250.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 11,
    name: "Rank VIP",
    category: "sultan",
    price: 100000,
    oldPrice: 135000,
    badge: "POPULAR",
    badgeColor: "gold",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Golden Helmet",
    image: MC_CDN + "item/golden_helmet.png",
    command: "lp user {ign} parent add vip",
    tierKey: "vip",
    benefits: [
      "Perintah Chat: +fly, +craft, +workbench, +feed, +heal, +ec, +speed",
      "Bonus Uang In-Game: $4.000.000",
      "Item Eksklusif Benefit Rank"
    ]
  },
  {
    id: 12,
    name: "Florence Monarch (Legend)",
    category: "sultan",
    price: 150000,
    oldPrice: 200000,
    badge: "LEGENDARY",
    badgeColor: "gold",
    duration: "Aktif 1 Season (Per-Season)",
    textureName: "Nether Star",
    image: MC_CDN + "item/nether_star.png",
    command: "lp user {ign} parent add legend",
    tierKey: "legend",
    benefits: [
      "Perintah Chat: Akses SEMUA Fitur (+fly, +god, +heal, +feed, +ec, +craft)",
      "Bonus Uang In-Game: $5.000.000 (Tertinggi)",
      "Item Eksklusif Benefit Rank"
    ]
  }
];

// Fallback icon helper
const FALLBACK_ICON = MC_CDN + "item/nether_star.png";

// ==================== STATE MANAGEMENT ====================
let cart = [];
let appliedCoupon = null;
let currentPlatform = "java";
let currentPaymentMethod = "qris";
let paymentTimer = null;
let activeInvoice = null;

// Audio Context for Clean Minecraft-style clicks
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playSound(type = 'click') {
  if (!CONFIG.SOUND_ENABLED) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      // Arpeggio victory chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + i * 0.08);
        noteGain.gain.setValueAtTime(0.15, now + i * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        noteOsc.start(now + i * 0.08);
        noteOsc.stop(now + i * 0.08 + 0.25);
      });
    }
  } catch (e) {
    // Audio context not allowed or blocked silently
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(PRODUCTS);
  setupEventListeners();
  loadCartFromStorage();
  updateCartBadge();
  startLiveActivityTicker();
  if (window.lucide) window.lucide.createIcons();
});

// Setup DOM Event Listeners
function setupEventListeners() {
  // Sound Toggle
  const btnToggleSound = document.getElementById("btn-toggle-sound");
  if (btnToggleSound) {
    btnToggleSound.addEventListener("click", () => {
      CONFIG.SOUND_ENABLED = !CONFIG.SOUND_ENABLED;
      const icon = document.getElementById("sound-icon");
      if (icon) {
        icon.setAttribute("data-lucide", CONFIG.SOUND_ENABLED ? "volume-2" : "volume-x");
        if (window.lucide) window.lucide.createIcons();
      }
      showToast(CONFIG.SOUND_ENABLED ? "Efek Suara Diaktifkan 🔊" : "Efek Suara Dimatikan 🔇", "info");
      playSound('click');
    });
  }

  // Copy IP Buttons
  const btnCopyHeader = document.getElementById("btn-copy-ip-header");
  const btnCopyMain = document.getElementById("btn-copy-ip-main");
  if (btnCopyHeader) btnCopyHeader.addEventListener("click", () => copyServerIP());
  if (btnCopyMain) btnCopyMain.addEventListener("click", () => copyServerIP());

  // Category Tabs
  const catTabs = document.querySelectorAll(".cat-tab");
  catTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      catTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-cat");
      filterCategory(category);
      playSound('click');
    });
  });

  // Search input
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      clearSearchBtn.style.display = query ? "block" : "none";
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.textureName && p.textureName.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query) ||
        p.benefits.some(b => b.toLowerCase().includes(query))
      );
      renderProducts(filtered);
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchBtn.style.display = "none";
      renderProducts(PRODUCTS);
      playSound('click');
    });
  }

  // Cart Button Open
  const openCartBtn = document.getElementById("open-cart-btn");
  if (openCartBtn) {
    openCartBtn.addEventListener("click", () => {
      openCheckoutModal();
      playSound('click');
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      playSound('click');
    });

    navMenu.querySelectorAll(".nav-item").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
      });
    });
  }

  // Modal overlay backdrop click & bottom-sheet handle dismiss
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
    const handle = overlay.querySelector(".bottom-sheet-handle");
    if (handle) {
      handle.addEventListener("click", () => {
        closeModal(overlay.id);
      });
    }
  });
}

// ==================== PRODUCT RENDERING ====================
function renderProducts(items) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <i data-lucide="package-x" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--text-dim);"></i>
        <h3>Tidak ada produk yang cocok dengan pencarianmu</h3>
        <p>Coba kata kunci lain atau pilih kategori di atas.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = items.map(product => {
    // Show top 4 benefits + indicate remainder if any
    const displayBenefits = product.benefits.slice(0, 4);
    const extraCount = product.benefits.length - displayBenefits.length;

    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-badge-wrap">
          <span class="badge-tag ${product.badgeColor}">${product.badge}</span>
        </div>

        <div class="product-preview">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='${FALLBACK_ICON}'">
        </div>

        <div class="product-info">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="product-category-name">${product.category}</span>
            ${product.textureName ? `<span class="texture-label"><i data-lucide="box" style="width:12px;height:12px;"></i> ${product.textureName}</span>` : ''}
          </div>
          <h3 class="product-title">${product.name}</h3>
          <div class="product-duration">
            <i data-lucide="shield-check" style="width: 14px; height: 14px; color: var(--accent-emerald);"></i>
            <span>${product.duration}</span>
          </div>

          <ul class="product-benefits">
            ${displayBenefits.map(b => `
              <li><i data-lucide="check-circle-2"></i> <span>${b}</span></li>
            `).join('')}
            ${extraCount > 0 ? `
              <li style="color:var(--accent-cyan); font-weight:600;">
                <i data-lucide="sparkles" style="color:var(--accent-cyan);"></i>
                <span>+${extraCount} Benefit Spesial Lainnya</span>
              </li>
            ` : ''}
          </ul>

          <div class="product-pricing-bar">
            <div class="prod-price-box">
              <span class="prod-old-price">${formatRupiah(product.oldPrice)}</span>
              <span class="prod-real-price">${formatRupiah(product.price)}</span>
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-primary" onclick="quickBuy(${product.id})">
              <i data-lucide="zap"></i> Beli Sekarang
            </button>
            <button class="btn-add-cart" onclick="addToCart(${product.id})" title="Tambah ke Keranjang">
              <i data-lucide="plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function filterCategory(category) {
  const tabs = document.querySelectorAll(".cat-tab");
  tabs.forEach(t => {
    if (t.getAttribute("data-cat") === category) t.classList.add("active");
    else t.classList.remove("active");
  });

  if (category === "all" || category === "ranks") {
    renderProducts(PRODUCTS);
  } else if (category === "starter") {
    renderProducts(PRODUCTS.filter(p => p.id >= 1 && p.id <= 4));
  } else if (category === "elemental") {
    renderProducts(PRODUCTS.filter(p => p.id >= 5 && p.id <= 8));
  } else if (category === "sultan") {
    renderProducts(PRODUCTS.filter(p => p.id >= 9 && p.id <= 12));
  } else {
    const filtered = PRODUCTS.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

// ==================== CART & CHECKOUT LOGIC ====================
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCartToStorage();
  updateCartBadge();
  playSound('click');
  showToast(`"${product.name}" berhasil ditambahkan ke keranjang!`, "success");
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartBadge();
  renderCartInModal();
  playSound('click');
}

function quickBuy(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  cart = [{ ...product, quantity: 1 }];
  saveCartToStorage();
  updateCartBadge();
  openCheckoutModal();
  playSound('click');
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById("cart-counter");
  const mobileBadge = document.getElementById("mobile-cart-counter");
  if (badge) badge.textContent = count;
  if (mobileBadge) mobileBadge.textContent = count;
}

function saveCartToStorage() {
  localStorage.setItem("florence_cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const saved = localStorage.getItem("florence_cart");
  if (saved) {
    try { cart = JSON.parse(saved); } catch (e) { cart = []; }
  }
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Keranjang belanja masih kosong! Silakan pilih produk terlebih dahulu.", "info");
    return;
  }
  renderCartInModal();
  updateCheckoutSummary();
  openModal('checkout-modal');
}

function renderCartInModal() {
  const container = document.getElementById("cart-items-list");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;">Tidak ada item di keranjang.</p>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-title">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='${FALLBACK_ICON}'">
        <div>
          <strong>${item.name}</strong>
          ${item.quantity > 1 ? `<span style="color:var(--accent-cyan);"> &times; ${item.quantity}</span>` : ''}
        </div>
      </div>
      <div class="cart-item-meta">
        <span class="cart-item-price">${formatRupiah(item.price * (item.quantity || 1))}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Hapus Item">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
        </button>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function updateCheckoutSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  let discount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    } else if (appliedCoupon.discountAmount) {
      discount = appliedCoupon.discountAmount;
    }
  }

  const total = Math.max(0, subtotal - discount);

  document.getElementById("summary-subtotal").textContent = formatRupiah(subtotal);

  const discountRow = document.getElementById("summary-discount-row");
  const discountEl = document.getElementById("summary-discount");
  if (discount > 0) {
    discountRow.style.display = "flex";
    discountEl.textContent = "- " + formatRupiah(discount);
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("summary-total").textContent = formatRupiah(total);
}

// Platform selector
function selectPlatform(platform) {
  currentPlatform = platform;
  document.getElementById("platform-java").classList.toggle("active", platform === "java");
  document.getElementById("platform-bedrock").classList.toggle("active", platform === "bedrock");

  const hint = document.getElementById("bedrock-hint");
  if (hint) hint.style.display = platform === "bedrock" ? "flex" : "none";

  const usernameInput = document.getElementById("mc-username-input");
  if (usernameInput) updateAvatarPreview(usernameInput.value);
  playSound('click');
}

// Live Avatar update
function updateAvatarPreview(username) {
  const trimmed = username.trim() || "Steve";
  const avatarImg = document.getElementById("checkout-avatar-img");
  const avatarName = document.getElementById("checkout-avatar-name");

  if (avatarName) avatarName.textContent = trimmed;
  if (avatarImg) {
    const cleanLookup = trimmed.replace(/^\./, "").replace(/\s+/g, "_");
    avatarImg.src = `https://mc-heads.net/avatar/${encodeURIComponent(cleanLookup)}/64`;
  }
}

// Payment method selector
function selectPaymentMethod(method) {
  currentPaymentMethod = method;
  document.querySelectorAll(".payment-channel").forEach(el => {
    el.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
  playSound('click');
}

// Coupon validation
function applyCoupon() {
  const input = document.getElementById("coupon-input");
  const alertBox = document.getElementById("coupon-alert");
  if (!input || !alertBox) return;

  const code = input.value.trim().toUpperCase();
  if (!code) {
    alertBox.style.display = "none";
    appliedCoupon = null;
    updateCheckoutSummary();
    return;
  }

  if (CONFIG.COUPONS[code]) {
    appliedCoupon = CONFIG.COUPONS[code];
    alertBox.className = "coupon-feedback success";
    alertBox.textContent = `Berhasil! Kupon "${code}" aktif: ${appliedCoupon.label}`;
    alertBox.style.display = "block";
    playSound('click');
  } else {
    appliedCoupon = null;
    alertBox.className = "coupon-feedback error";
    alertBox.textContent = `Kupon "${code}" tidak valid atau telah kedaluwarsa.`;
    alertBox.style.display = "block";
  }
  updateCheckoutSummary();
}

// ==================== PROCESS ORDER & SIMULATION ====================
function processCheckout() {
  const usernameInput = document.getElementById("mc-username-input");
  const rawUsername = usernameInput ? usernameInput.value.trim() : "";

  if (!rawUsername) {
    showToast("Silakan masukkan Username Minecraft kamu!", "error");
    if (usernameInput) usernameInput.focus();
    return;
  }

  if (cart.length === 0) {
    showToast("Keranjang belanja kosong!", "error");
    return;
  }

  // Generate unique invoice number
  const timestamp = Date.now().toString().slice(-6);
  const invoiceId = `INV-FLORENCE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${timestamp}`;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) discount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    else if (appliedCoupon.discountAmount) discount = appliedCoupon.discountAmount;
  }
  const total = Math.max(0, subtotal - discount);

  // Compile commands for delivery (supports both {ign} and {player})
  const commands = cart.map(item => {
    const formattedUser = (currentPlatform === 'bedrock' && !rawUsername.startsWith('.')) 
      ? `.${rawUsername}` 
      : rawUsername;
    return item.command.replace(/{ign}|{player}/g, formattedUser);
  });

  const orderData = {
    invoiceId,
    username: rawUsername,
    platform: currentPlatform,
    paymentMethod: currentPaymentMethod,
    items: [...cart],
    total,
    commands,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  activeInvoice = orderData;
  saveOrderToHistory(orderData);

  // Close checkout modal & Open payment simulation modal
  closeModal('checkout-modal');
  openPaymentModal(orderData);
  playSound('click');
}

function openPaymentModal(order) {
  document.getElementById("pay-modal-invoice").textContent = order.invoiceId;
  document.getElementById("pay-modal-username").textContent = order.username + ` (${order.platform.toUpperCase()})`;
  document.getElementById("pay-modal-amount").textContent = formatRupiah(order.total);

  const qrisBox = document.getElementById("qris-box");
  const ewalletBox = document.getElementById("manual-ewallet-box");

  if (order.paymentMethod === 'dana' || order.paymentMethod === 'gopay') {
    if (qrisBox) qrisBox.style.display = "none";
    if (ewalletBox) {
      ewalletBox.style.display = "block";
      const badge = document.getElementById("ewallet-name-badge");
      const title = document.getElementById("ewallet-title");
      const numDisp = document.getElementById("ewallet-number-display");
      const amtDisp = document.getElementById("ewallet-amount-display");
      const waBtn = document.getElementById("btn-wa-confirm-ewallet");

      const methodLabel = order.paymentMethod === 'dana' ? 'DANA' : 'GoPay';
      if (badge) badge.textContent = methodLabel;
      if (title) title.textContent = `Transfer Manual via ${methodLabel}`;
      if (numDisp) numDisp.textContent = CONFIG.PAYMENT_PHONE_DISPLAY;
      if (amtDisp) amtDisp.textContent = formatRupiah(order.total);

      if (waBtn) {
        const waText = encodeURIComponent(
          `Halo Admin Florence Shop, saya sedang melakukan transfer via ${methodLabel}:\n` +
          `- Nomor Tujuan: ${CONFIG.PAYMENT_PHONE}\n` +
          `- Invoice: ${order.invoiceId}\n` +
          `- Akun Minecraft: ${order.username} (${order.platform.toUpperCase()})\n` +
          `- Total: ${formatRupiah(order.total)}\n` +
          `Mohon dicek dan dikirimkan rank-nya. Terima kasih!`
        );
        waBtn.href = `https://wa.me/${CONFIG.ADMIN_WA}?text=${waText}`;
      }
    }
  } else {
    // Default QRIS
    if (ewalletBox) ewalletBox.style.display = "none";
    if (qrisBox) {
      qrisBox.style.display = "block";
      const qrImage = document.getElementById("qris-image");
      if (qrImage) {
        qrImage.src = CONFIG.QRIS_IMAGE_URL;
      }
      const waConfirmBtn = document.getElementById("btn-wa-confirm-qris");
      if (waConfirmBtn) {
        const waText = encodeURIComponent(
          `Halo Admin Florence Shop, saya sedang transfer via QRIS:\n` +
          `- Merchant: ${CONFIG.QRIS_MERCHANT_NAME} (${CONFIG.QRIS_NMID})\n` +
          `- Invoice: ${order.invoiceId}\n` +
          `- Akun Minecraft: ${order.username} (${order.platform.toUpperCase()})\n` +
          `- Total: ${formatRupiah(order.total)}\n` +
          `Mohon bantuannya untuk verifikasi/pengiriman item. Terima kasih!`
        );
        waConfirmBtn.href = `https://wa.me/${CONFIG.ADMIN_WA}?text=${waText}`;
      }
    }
  }

  // Start 15 minutes countdown
  startPaymentCountdown(15 * 60);

  openModal('payment-modal');
  if (window.lucide) window.lucide.createIcons();
}

function startPaymentCountdown(duration) {
  if (paymentTimer) clearInterval(paymentTimer);

  let timer = duration;
  const display = document.getElementById("payment-countdown");

  paymentTimer = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    display.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (--timer < 0) {
      clearInterval(paymentTimer);
      display.textContent = "KEDALUWARSA";
      showToast("Batas waktu pembayaran telah habis.", "error");
    }
  }, 1000);
}

// Simulates what happens when Midtrans sends an HTTP Webhook to Supabase Edge Function
function simulatePaymentSuccess() {
  if (!activeInvoice) return;

  clearInterval(paymentTimer);
  closeModal('payment-modal');

  // Update status to PAID & COMPLETED
  activeInvoice.status = "COMPLETED";
  updateOrderStatusInHistory(activeInvoice.invoiceId, "COMPLETED");

  // Populate Success Modal
  document.getElementById("success-invoice-id").textContent = activeInvoice.invoiceId;
  document.getElementById("success-player-name").textContent = activeInvoice.username;
  document.getElementById("success-command-preview").textContent = activeInvoice.commands.join("  &&  ");

  const waSuccessBtn = document.getElementById("success-wa-btn");
  if (waSuccessBtn) {
    const waText = encodeURIComponent(
      `Halo Admin Florence Shop, saya telah menyelesaikan pembelian dengan Invoice: ${activeInvoice.invoiceId} (Akun: ${activeInvoice.username}). Mohon konfirmasinya ya!`
    );
    waSuccessBtn.href = `https://wa.me/${CONFIG.ADMIN_WA}?text=${waText}`;
  }

  // Clear Cart
  cart = [];
  saveCartToStorage();
  updateCartBadge();

  // Play Victory Audio & Show Modal
  playSound('success');
  openModal('success-modal');
  showToast("Pembayaran diverifikasi! Perintah pengiriman dikirim ke server.", "success");
}

// ==================== ORDER TRACKER & STORAGE ====================
function saveOrderToHistory(order) {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem("florence_orders") || "[]");
  } catch (e) { history = []; }
  history.unshift(order);
  localStorage.setItem("florence_orders", JSON.stringify(history.slice(0, 50)));
}

function updateOrderStatusInHistory(invoiceId, newStatus) {
  try {
    let history = JSON.parse(localStorage.getItem("florence_orders") || "[]");
    const item = history.find(o => o.invoiceId === invoiceId);
    if (item) {
      item.status = newStatus;
      item.deliveredAt = new Date().toISOString();
      localStorage.setItem("florence_orders", JSON.stringify(history));
    }
  } catch (e) {}
}

function trackOrder() {
  const query = document.getElementById("tracker-invoice-input").value.trim().toLowerCase();
  const resultBox = document.getElementById("tracker-result");
  if (!query || !resultBox) return;

  let history = [];
  try {
    history = JSON.parse(localStorage.getItem("florence_orders") || "[]");
  } catch (e) { history = []; }

  // Search by invoice or username
  const matched = history.find(o => 
    o.invoiceId.toLowerCase() === query || 
    o.username.toLowerCase() === query
  );

  resultBox.style.display = "block";
  playSound('click');

  if (!matched) {
    resultBox.innerHTML = `
      <div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">
        <i data-lucide="alert-circle" style="width: 32px; height: 32px; color: var(--accent-rose); margin-bottom: 0.5rem;"></i>
        <h4>Pesanan "${query}" tidak ditemukan</h4>
        <p style="font-size: 0.85rem; margin-top: 0.4rem; margin-bottom: 1rem;">
          Pastikan format invoice benar (contoh: <code>INV-FLORENCE-202611...</code>) atau hubungi Admin jika butuh bantuan manual.
        </p>
        <a href="https://wa.me/${CONFIG.ADMIN_WA}?text=${encodeURIComponent('Halo Admin, pesanan saya dengan nomor ' + query + ' tidak ditemukan di sistem track order.')}" target="_blank" class="btn btn-outline btn-sm" style="color: #25d366; border-color: rgba(37,211,102,0.4); display: inline-flex; gap: 0.4rem;">
          <i data-lucide="message-circle" style="width: 16px; height: 16px;"></i> Tanya Admin via WA (0831-8719-8288)
        </a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const isCompleted = matched.status === "COMPLETED";

  resultBox.innerHTML = `
    <div class="result-header">
      <div>
        <span style="font-size: 0.75rem; color: var(--text-dim); display: block;">INVOICE PESANAN</span>
        <strong style="color: var(--accent-cyan); font-family: var(--font-heading);">${matched.invoiceId}</strong>
      </div>
      <div>
        <span class="badge-tag ${isCompleted ? 'green' : 'gold'}">
          ${matched.status}
        </span>
      </div>
    </div>

    <!-- Stepper Timeline -->
    <div class="timeline-stepper">
      <div class="timeline-step completed">
        <div class="step-dot"><i data-lucide="check" style="width:14px;height:14px;"></i></div>
        <span>Pesanan Dibuat</span>
      </div>
      <div class="timeline-step completed">
        <div class="step-dot"><i data-lucide="check" style="width:14px;height:14px;"></i></div>
        <span>Pembayaran Diterima</span>
      </div>
      <div class="timeline-step ${isCompleted ? 'completed' : 'active'}">
        <div class="step-dot">${isCompleted ? '<i data-lucide="check" style="width:14px;height:14px;"></i>' : '3'}</div>
        <span>Eksekusi RCON</span>
      </div>
      <div class="timeline-step ${isCompleted ? 'completed' : ''}">
        <div class="step-dot">${isCompleted ? '<i data-lucide="check" style="width:14px;height:14px;"></i>' : '4'}</div>
        <span>Item Masuk di Game</span>
      </div>
    </div>

    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; margin-top: 1rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem;">
        <span>Pemain:</span>
        <strong>${matched.username} (${matched.platform.toUpperCase()})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem;">
        <span>Total Nominal:</span>
        <strong style="color:var(--accent-gold);">${formatRupiah(matched.total)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 0.75rem;">
        <span>Perintah Server:</span>
        <code style="font-size:0.75rem;">${matched.commands[0] || '-'}</code>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <span style="font-size: 0.75rem; color: var(--text-muted);">Ada kendala pada pesanan?</span>
        <a href="https://wa.me/${CONFIG.ADMIN_WA}?text=${encodeURIComponent('Halo Admin Florence Shop, saya ingin menanyakan status pesanan ' + matched.invoiceId + ' untuk akun ' + matched.username)}" target="_blank" class="btn btn-outline btn-sm" style="color: #25d366; border-color: rgba(37,211,102,0.4); font-size: 0.76rem; padding: 0.35rem 0.65rem; gap: 0.35rem;">
          <i data-lucide="message-circle" style="width: 14px; height: 14px;"></i> Hubungi Admin WA
        </a>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

// ==================== LIVE ACTIVITY TICKER ====================
const FAKE_USERS = ["Aldi_Craft", "Reyhan_PvP", "NezukoMC", "Budi_Gamer", "Kenzho_ID", "Sultan_Skyblock", "Daffa99", "Ayu_Chan", "Frost_King", "PixelLord"];
const FAKE_ITEMS = [
  "Rank Novice (Noob)", "Rank Stone", "Rank Iron", "Rank Gold", "Rank Diamond", 
  "Rank Water", "Rank Fire", "Rank Nether", "Rank End", "Rank Space", 
  "Rank VIP", "Florence Monarch (Legend)"
];

function startLiveActivityTicker() {
  const container = document.getElementById("live-activity");
  const avatar = document.getElementById("activity-avatar");
  const user = document.getElementById("activity-user");
  const text = document.getElementById("activity-text");
  const time = document.getElementById("activity-time");

  if (!container || !avatar || !user) return;

  setInterval(() => {
    const randomUser = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
    const randomItem = FAKE_ITEMS[Math.floor(Math.random() * FAKE_ITEMS.length)];
    const randomMinutes = Math.floor(Math.random() * 8) + 1;

    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';

    setTimeout(() => {
      user.textContent = randomUser;
      text.innerHTML = `baru saja membeli <strong>${randomItem}</strong>`;
      avatar.src = `https://mc-heads.net/avatar/${randomUser}/48`;
      time.textContent = `${randomMinutes}m lalu`;

      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 400);

  }, 10000);
}

// ==================== GENERAL UTILITIES ====================
function formatRupiah(number) {
  return CONFIG.CURRENCY_SYMBOL + new Intl.NumberFormat("id-ID").format(number);
}

function copyServerIP() {
  navigator.clipboard.writeText(CONFIG.SERVER_IP).then(() => {
    showToast(`IP Server "${CONFIG.SERVER_IP}" berhasil disalin! Silakan paste di Minecraft kamu.`, "success");
    playSound('click');
  }).catch(() => {
    showToast(`IP: ${CONFIG.SERVER_IP}`, "info");
  });
}

function toggleFaq(card) {
  card.classList.toggle("open");
  playSound('click');
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("open");
  document.body.style.overflow = "";
  playSound('click');
}

// Download QRIS image for mobile users (saving to phone photo gallery)
function downloadQrisImage() {
  const a = document.createElement("a");
  a.href = CONFIG.QRIS_IMAGE_URL;
  a.download = `QRIS-ETERNALSMP-${activeInvoice ? activeInvoice.invoiceId : 'Store'}.jpg`;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast("Gambar QRIS berhasil diunduh! Buka aplikasi e-Wallet (GoPay/DANA) dan pilih 'Scan dari Galeri'.", "success");
  playSound('click');
}

// Copy payment phone number (DANA / GoPay: 083159084210)
function copyPaymentNumber() {
  navigator.clipboard.writeText(CONFIG.PAYMENT_PHONE).then(() => {
    showToast(`Nomor E-Wallet "${CONFIG.PAYMENT_PHONE}" berhasil disalin!`, "success");
    playSound('click');
  }).catch(() => {
    showToast(`Nomor: ${CONFIG.PAYMENT_PHONE}`, "info");
  });
}

// Copy transfer amount
function copyPaymentAmount() {
  if (!activeInvoice) return;
  navigator.clipboard.writeText(activeInvoice.total.toString()).then(() => {
    showToast(`Nominal transfer Rp ${activeInvoice.total} berhasil disalin!`, "success");
    playSound('click');
  }).catch(() => {
    showToast(`Nominal: ${activeInvoice.total}`, "info");
  });
}

// Copy invoice number to clipboard
function copyInvoiceId() {
  if (!activeInvoice) return;
  navigator.clipboard.writeText(activeInvoice.invoiceId).then(() => {
    showToast(`Nomor Invoice "${activeInvoice.invoiceId}" berhasil disalin!`, "success");
    playSound('click');
  }).catch(() => {
    showToast(`Invoice: ${activeInvoice.invoiceId}`, "info");
  });
}

// Toast notification system
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  if (type === "error") iconName = "alert-triangle";

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ==================== MOBILE APP & PWA INTEGRATION ====================

// Mobile Bottom Nav Active Switcher with Haptic Feedback
function setMobileActiveNav(el) {
  document.querySelectorAll(".mobile-nav-item").forEach(item => {
    item.classList.remove("active");
  });
  if (el) el.classList.add("active");

  // Subtle mobile haptic vibration if supported
  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(20);
  }
  playSound('click');
}

// Service Worker Registration for PWA Mobile App & Lucide Init Safeguard
window.addEventListener('load', () => {
  if (window.lucide) window.lucide.createIcons();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker terdaftar dengan scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker gagal mendaftar:', err);
      });
  }
});

// PWA Install Prompt Banner Handler
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const banner = document.getElementById('pwa-install-banner');
  const isDismissed = localStorage.getItem('pwa_banner_dismissed');

  if (banner && !isDismissed) {
    setTimeout(() => {
      banner.style.display = 'flex';
      if (window.lucide) window.lucide.createIcons();
    }, 2500); // Tampilkan setelah 2.5 detik agar tidak mengganggu kesan pertama
  }
});

// Setup PWA Buttons
document.addEventListener("DOMContentLoaded", () => {
  const btnInstall = document.getElementById('btn-install-pwa');
  const btnDismiss = document.getElementById('btn-dismiss-pwa');
  const banner = document.getElementById('pwa-install-banner');

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast("Aplikasi Florence Shop berhasil dipasang di HP Anda! 🎉", "success");
        }
        deferredPrompt = null;
      } else {
        // Fallback info for iOS / desktop
        showToast("Untuk memasang: Buka menu browser -> 'Tambahkan ke Layar Utama' (Add to Home Screen)", "info");
      }
      if (banner) banner.style.display = 'none';
    });
  }

  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      if (banner) banner.style.display = 'none';
      localStorage.setItem('pwa_banner_dismissed', 'true');
    });
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'none';
  showToast("Selamat datang di Aplikasi Florence Shop!", "success");
});
