(() => {
  const cfg = window.CAFE_CONFIG;
  const categories = window.MENU_CATEGORIES;
  const items = window.MENU_ITEMS;

  let activeCategory = categories[0].id;
  let selectedTime = "Зараз (я в кав'ярні)";
  let orderNumber = 104;
  const cart = new Map();

  const $ = (id) => document.getElementById(id);
  const el = {
    copyWifiBtn: $("copyWifiBtn"), tabs: $("categoryTabs"), title: $("activeCategoryTitle"),
    count: $("activeCategoryCount"), menuList: $("menuList"), cartBar: $("cartBarWrapper"),
    cartBadge: $("cartCountBadge"), cartTotal: $("cartTotalPrice"), openCart: $("openCartBtn"),
    backdrop: $("orderModalBackdrop"), closeModal: $("closeModalBtn"), formView: $("orderFormView"),
    successView: $("orderSuccessView"), cartItems: $("cartItemsList"), timeChips: $("timeChips"),
    comment: $("orderComment"), modalTotal: $("modalTotalPrice"), submit: $("submitOrderBtn"),
    successTitle: $("successTitle"), successSub: $("successSubtitle"), successDetails: $("successDetails"),
    done: $("doneSuccessBtn"), toast: $("toast")
  };

  let toastTimer;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2400);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }

  function initLinks() {
    $("wifiSsid").textContent = cfg.wifi.ssid;
    $("mapsReviewLink").href = cfg.mapsUrl;
    $("addressMapLink").href = cfg.mapsUrl;
    const insta = $("instagramLink");
    insta.href = cfg.instagramUrl;
    if (cfg.instagramUrl === "#") insta.addEventListener("click", (e) => { e.preventDefault(); showToast("Посилання на Instagram буде додано"); });
  }

  el.copyWifiBtn.addEventListener("click", async () => {
    try {
      await copyText(cfg.wifi.password);
      el.copyWifiBtn.classList.add("copied");
      el.copyWifiBtn.textContent = "Скопійовано!";
      showToast("Пароль скопійовано!");
      setTimeout(() => { el.copyWifiBtn.classList.remove("copied"); el.copyWifiBtn.textContent = "Скопіювати пароль від Wi-Fi"; }, 2000);
    } catch { showToast(`Пароль: ${cfg.wifi.password}`); }
  });

  const key = (id, idx) => `${id}__${idx}`;

  function changeQty(id, idx, delta) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const k = key(id, idx);
    const next = (cart.get(k)?.qty || 0) + delta;
    if (next <= 0) cart.delete(k);
    else cart.set(k, { itemId: id, idx, name: item.name, label: item.variants[idx].label, price: item.variants[idx].price, qty: next });
    renderMenu();
    updateCart();
  }

  function totals() {
    let count = 0, total = 0;
    cart.forEach((e) => { count += e.qty; total += e.price * e.qty; });
    return { count, total };
  }

  function updateCart() {
    const { count, total } = totals();
    el.cartBadge.textContent = count;
    el.cartTotal.textContent = `${total} грн`;
    el.modalTotal.textContent = `${total} грн`;
    el.cartBar.classList.toggle("visible", count > 0);
    el.cartBar.setAttribute("aria-hidden", count > 0 ? "false" : "true");
    if (count === 0 && el.successView.hidden) closeModal();
    renderCartItems();
  }

  function renderTabs() {
    el.tabs.innerHTML = "";
    categories.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `category-tab${c.id === activeCategory ? " active" : ""}`;
      b.textContent = c.label;
      b.addEventListener("click", () => { activeCategory = c.id; renderTabs(); renderMenu(); });
      el.tabs.appendChild(b);
    });
  }

  function qtyHtml(id, idx, qty) {
    if (qty === 0) return `<button type="button" class="btn-add" data-action="inc" data-id="${id}" data-idx="${idx}">+ Додати</button>`;
    return `<div class="qty-controls">
      <button type="button" class="btn-qty" data-action="dec" data-id="${id}" data-idx="${idx}" aria-label="Зменшити">−</button>
      <span class="qty-value">${qty}</span>
      <button type="button" class="btn-qty plus" data-action="inc" data-id="${id}" data-idx="${idx}" aria-label="Збільшити">+</button></div>`;
  }

  function renderMenu() {
    const cat = categories.find((c) => c.id === activeCategory);
    const list = items.filter((i) => i.category === activeCategory);
    el.title.textContent = cat.label;
    el.count.textContent = `${list.length} поз.`;
    el.menuList.innerHTML = list.map((item) => `
      <article class="menu-card">
        <div class="menu-card-top">
          <h3 class="menu-card-title">${item.name}</h3>
          ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ""}
        </div>
        ${item.variants.map((v, idx) => `
          <div class="variant-row">
            <div class="variant-info"><span class="variant-label">${v.label}</span><span class="variant-price">${v.price} грн</span></div>
            ${qtyHtml(item.id, idx, cart.get(key(item.id, idx))?.qty || 0)}
          </div>`).join("")}
      </article>`).join("");
  }

  function renderCartItems() {
    el.cartItems.innerHTML = [...cart.values()].map((e) => `
      <div class="cart-item-row">
        <div><div class="cart-item-name">${e.name}</div><div class="cart-item-sub">${e.label} · ${e.price} грн</div></div>
        ${qtyHtml(e.itemId, e.idx, e.qty)}
      </div>`).join("");
  }

  const qtyHandler = (e) => {
    const b = e.target.closest("button[data-action]");
    if (b) changeQty(b.dataset.id, Number(b.dataset.idx), b.dataset.action === "dec" ? -1 : 1);
  };
  el.menuList.addEventListener("click", qtyHandler);
  el.cartItems.addEventListener("click", qtyHandler);

  function openModal() {
    el.formView.hidden = false;
    el.successView.hidden = true;
    el.backdrop.classList.add("open");
    el.backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    el.backdrop.classList.remove("open");
    el.backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  el.openCart.addEventListener("click", openModal);
  el.closeModal.addEventListener("click", closeModal);
  el.done.addEventListener("click", closeModal);
  el.backdrop.addEventListener("click", (e) => { if (e.target === el.backdrop) closeModal(); });

  el.timeChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".time-chip");
    if (!chip) return;
    el.timeChips.querySelectorAll(".time-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    selectedTime = chip.dataset.time;
  });

  /**
   * Відправка замовлення. Зараз — демо-імітація; сюди легко підключити Telegram Bot API.
   * @param {Object} orderData
   */
  async function submitOrder(orderData) {
    console.info("[Nuts Demo] submitOrder:", orderData);
    return { ok: true, orderId: orderNumber++ };
  }
  window.submitOrder = submitOrder;

  el.submit.addEventListener("click", async () => {
    if (cart.size === 0) return;
    const { total } = totals();
    const orderData = {
      cafe: cfg.name,
      items: [...cart.values()].map((e) => ({ name: e.name, variant: e.label, qty: e.qty, price: e.price })),
      total,
      readyTime: selectedTime,
      comment: el.comment.value.trim(),
      payment: "Оплата на касі"
    };
    const res = await submitOrder(orderData);
    if (!res.ok) return;

    el.successTitle.textContent = `Замовлення #${res.orderId} надіслано баристі!`;
    el.successSub.textContent = selectedTime.startsWith("Зараз")
      ? "Готуємо для вас — підійдіть до стійки за хвилину"
      : `Очікуваний час готовності: ${selectedTime.toLowerCase()}`;
    el.successDetails.innerHTML =
      orderData.items.map((i) => `${i.name} (${i.variant}) × ${i.qty}`).join("<br>") +
      `<br><strong>Сума:</strong> ${total} грн` +
      (orderData.comment ? `<br><strong>Коментар:</strong> ${orderData.comment.replace(/</g, "&lt;")}` : "");

    cart.clear();
    el.comment.value = "";
    renderMenu();
    updateCart();
    el.formView.hidden = true;
    el.successView.hidden = false;
  });

  initLinks();
  renderTabs();
  renderMenu();
  updateCart();
})();
