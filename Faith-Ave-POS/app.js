const VAT_RATE = 0.10;
const STORAGE_KEY = "faithAvePos.v1";

const DEFAULT_PRODUCTS = [
  { sku: "TLS-1001", barcode: "2011001001", name: "16 oz Claw Hammer", category: "Tools", stock: 24, cost: 8.40, price: 14.99 },
  { sku: "TLS-1002", barcode: "2011001002", name: "25 ft Tape Measure", category: "Tools", stock: 40, cost: 4.10, price: 8.49 },
  { sku: "TLS-1003", barcode: "2011001003", name: "8-in-1 Screwdriver", category: "Tools", stock: 32, cost: 5.20, price: 9.99 },
  { sku: "TLS-1004", barcode: "2011001004", name: "Adjustable Wrench 10\"", category: "Tools", stock: 18, cost: 7.80, price: 13.49 },
  { sku: "FST-2001", barcode: "2012001001", name: "1 lb 8d Common Nails", category: "Fasteners", stock: 80, cost: 2.10, price: 4.29 },
  { sku: "FST-2002", barcode: "2012001002", name: "1 lb Drywall Screws", category: "Fasteners", stock: 70, cost: 2.40, price: 4.79 },
  { sku: "FST-2003", barcode: "2012001003", name: "Box Wood Screws #8", category: "Fasteners", stock: 55, cost: 3.10, price: 6.49 },
  { sku: "PLB-3001", barcode: "2013001001", name: "1/2\" PVC Elbow", category: "Plumbing", stock: 120, cost: 0.28, price: 0.89 },
  { sku: "PLB-3002", barcode: "2013001002", name: "1/2\" PVC Coupling", category: "Plumbing", stock: 110, cost: 0.22, price: 0.69 },
  { sku: "PLB-3003", barcode: "2013001003", name: "Teflon Tape Roll", category: "Plumbing", stock: 60, cost: 0.55, price: 1.49 },
  { sku: "PLB-3004", barcode: "2013001004", name: "Washer Supply Line", category: "Plumbing", stock: 22, cost: 5.40, price: 11.99 },
  { sku: "ELC-4001", barcode: "2014001001", name: "12/2 NM Wire 25 ft", category: "Electrical", stock: 16, cost: 18.20, price: 32.99 },
  { sku: "ELC-4002", barcode: "2014001002", name: "Duplex Outlet 15A", category: "Electrical", stock: 90, cost: 0.70, price: 1.79 },
  { sku: "ELC-4003", barcode: "2014001003", name: "Single Pole Switch", category: "Electrical", stock: 75, cost: 0.80, price: 1.99 },
  { sku: "ELC-4004", barcode: "2014001004", name: "LED A19 Bulb 9W", category: "Electrical", stock: 64, cost: 1.40, price: 3.49 },
  { sku: "PNT-5001", barcode: "2015001001", name: "Interior Latex Gallon", category: "Paint", stock: 20, cost: 16.50, price: 29.99 },
  { sku: "PNT-5002", barcode: "2015001002", name: "2\" Angle Brush", category: "Paint", stock: 36, cost: 3.20, price: 6.99 },
  { sku: "PNT-5003", barcode: "2015001003", name: "9\" Roller Cover", category: "Paint", stock: 40, cost: 2.10, price: 4.49 },
  { sku: "LMB-6001", barcode: "2016001001", name: "2x4x8 Pressure Treated", category: "Lumber", stock: 48, cost: 4.80, price: 8.75 },
  { sku: "LMB-6002", barcode: "2016001002", name: "1/2\" Plywood 4x8", category: "Lumber", stock: 18, cost: 18.00, price: 32.50 },
  { sku: "HDW-7001", barcode: "2017001001", name: "3\" Door Hinge Pair", category: "Hardware", stock: 28, cost: 4.60, price: 9.49 },
  { sku: "HDW-7002", barcode: "2017001002", name: "Entry Lockset", category: "Hardware", stock: 12, cost: 22.00, price: 39.99 },
  { sku: "HDW-7003", barcode: "2017001003", name: "Padlock 40 mm", category: "Hardware", stock: 30, cost: 5.10, price: 9.99 },
  { sku: "GRD-8001", barcode: "2018001001", name: "Garden Hose 50 ft", category: "Garden", stock: 10, cost: 14.00, price: 24.99 },
  { sku: "GRD-8002", barcode: "2018001002", name: "Round Point Shovel", category: "Garden", stock: 14, cost: 9.20, price: 17.49 }
];

const DEFAULT_SETTINGS = {
  storeName: "Screws and Stuff",
  legalName: "Screws and Stuff Ltd.",
  addr1: "Faith Avenue",
  addr2: "Nassau, New Providence, Bahamas",
  phone: "(242) 555-0140",
  email: "sales@faithavehardware.bs",
  cashier: "Front Counter",
  vatPct: 10,
  footer: "Thank you for shopping Screws and Stuff",
  registerId: "REG-01"
};

function money(n) {
  return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        products: parsed.products?.length ? parsed.products : DEFAULT_PRODUCTS,
        customers: parsed.customers || [],
        sales: parsed.sales || [],
        holds: parsed.holds || [],
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings, vatPct: 10 },
        seq: parsed.seq || 1001
      };
    }
  } catch (err) {
    console.warn("Could not restore POS data", err);
  }
  return {
    products: DEFAULT_PRODUCTS.map((p) => ({ ...p })),
    customers: [
      { id: "c1", name: "Walk-in", phone: "", bin: "", notes: "Default counter customer" }
    ],
    sales: [],
    holds: [],
    settings: { ...DEFAULT_SETTINGS },
    seq: 1001
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    products: state.products,
    customers: state.customers,
    sales: state.sales,
    holds: state.holds,
    settings: state.settings,
    seq: state.seq
  }));
}

const state = loadState();
const cart = {
  items: [],
  discount: 0,
  customerId: "c1",
  bin: ""
};

const els = {
  clock: document.getElementById("clock"),
  ticketNo: document.getElementById("ticketNo"),
  cashierName: document.getElementById("cashierName"),
  viewTitle: document.getElementById("viewTitle"),
  viewSubtitle: document.getElementById("viewSubtitle"),
  skuSearch: document.getElementById("skuSearch"),
  categoryFilter: document.getElementById("categoryFilter"),
  categoryPills: document.getElementById("categoryPills"),
  productGrid: document.getElementById("productGrid"),
  cartBody: document.getElementById("cartBody"),
  emptyCart: document.getElementById("emptyCart"),
  subtotalEl: document.getElementById("subtotalEl"),
  vatEl: document.getElementById("vatEl"),
  discountEl: document.getElementById("discountEl"),
  totalEl: document.getElementById("totalEl"),
  discountInput: document.getElementById("discountInput"),
  customerBin: document.getElementById("customerBin"),
  customerPickBtn: document.getElementById("customerPickBtn"),
  inventoryBody: document.getElementById("inventoryBody"),
  salesBody: document.getElementById("salesBody"),
  customersBody: document.getElementById("customersBody"),
  modal: document.getElementById("modal"),
  modalCard: document.getElementById("modalCard"),
  printRoot: document.getElementById("printRoot")
};

let activeCategory = "All";

function categories() {
  return ["All", ...Array.from(new Set(state.products.map((p) => p.category)))];
}

function currentCustomer() {
  return state.customers.find((c) => c.id === cart.customerId) || state.customers[0];
}

function nextTicket() {
  return `FA-${String(state.seq).padStart(5, "0")}`;
}

function lineAmounts(item) {
  const qty = Number(item.qty) || 0;
  const price = Number(item.price) || 0;
  const exVat = qty * price;
  const vat = exVat * VAT_RATE;
  return { exVat, vat, incVat: exVat + vat };
}

function cartTotals() {
  const lines = cart.items.map(lineAmounts);
  const subtotal = lines.reduce((s, l) => s + l.exVat, 0);
  const vat = lines.reduce((s, l) => s + l.vat, 0);
  const discount = Math.min(Number(cart.discount) || 0, subtotal + vat);
  const total = Math.max(0, subtotal + vat - discount);
  return { subtotal, vat, discount, total };
}

function tickClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleString("en-BS", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function renderSettingsForm() {
  const map = {
    setStoreName: "storeName",
    setLegalName: "legalName",
    setAddr1: "addr1",
    setAddr2: "addr2",
    setPhone: "phone",
    setEmail: "email",
    setCashier: "cashier",
    setVat: "vatPct",
    setFooter: "footer",
    setRegisterId: "registerId"
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.value = state.settings[key];
  });
  els.cashierName.textContent = state.settings.cashier;
}

function renderCategories() {
  const cats = categories();
  els.categoryFilter.innerHTML = cats.map((c) => `<option value="${c}">${c}</option>`).join("");
  els.categoryFilter.value = activeCategory;
  els.categoryPills.innerHTML = cats.map((c) => (
    `<button type="button" class="pill ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</button>`
  )).join("");
}

function filteredProducts() {
  const q = els.skuSearch.value.trim().toLowerCase();
  return state.products.filter((p) => {
    const catOk = activeCategory === "All" || p.category === activeCategory;
    const text = `${p.sku} ${p.barcode} ${p.name} ${p.category}`.toLowerCase();
    return catOk && (!q || text.includes(q));
  });
}

function renderProducts() {
  els.productGrid.innerHTML = filteredProducts().map((p) => `
    <button type="button" class="product-card" data-sku="${p.sku}">
      <span class="sku">${p.sku}</span>
      <strong>${p.name}</strong>
      <span class="price">$${money(p.price)}</span>
      <span class="stock">${p.stock} on hand</span>
    </button>
  `).join("") || `<p class="empty-cart">No matching items.</p>`;
}

function renderCart() {
  els.ticketNo.textContent = nextTicket();
  els.emptyCart.classList.toggle("hidden", cart.items.length > 0);
  els.cartBody.innerHTML = cart.items.map((item, idx) => {
    const amt = lineAmounts(item);
    return `<tr>
      <td>
        <strong>${item.name}</strong><br />
        <span class="sku">${item.sku}</span>
      </td>
      <td>
        <div class="qty-ctrl">
          <button type="button" data-act="dec" data-idx="${idx}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-act="inc" data-idx="${idx}">+</button>
        </div>
      </td>
      <td>$${money(item.price)}</td>
      <td>$${money(amt.vat)}</td>
      <td>$${money(amt.incVat)}</td>
      <td><button type="button" class="link-btn" data-act="del" data-idx="${idx}">Remove</button></td>
    </tr>`;
  }).join("");
  const t = cartTotals();
  els.subtotalEl.textContent = `$${money(t.subtotal)}`;
  els.vatEl.textContent = `$${money(t.vat)}`;
  els.discountEl.textContent = t.discount ? `−$${money(t.discount)}` : "$0.00";
  els.totalEl.textContent = `$${money(t.total)}`;
  const cust = currentCustomer();
  els.customerPickBtn.textContent = cust?.name || "Walk-in customer";
}

function renderInventory() {
  const q = document.getElementById("invSearch").value.trim().toLowerCase();
  const rows = state.products.filter((p) => `${p.sku} ${p.barcode} ${p.name}`.toLowerCase().includes(q));
  document.getElementById("inventoryBody").innerHTML = rows.map((p) => `
    <tr>
      <td>${p.sku}</td>
      <td>${p.barcode}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.stock}</td>
      <td>$${money(p.cost)}</td>
      <td>$${money(p.price)}</td>
      <td><button type="button" class="link-btn" data-edit-sku="${p.sku}">Edit</button></td>
    </tr>
  `).join("");
}

function renderSales() {
  const q = document.getElementById("salesSearch").value.trim().toLowerCase();
  const rows = [...state.sales].reverse().filter((s) =>
    `${s.receiptNo} ${s.cashier} ${s.bin} ${s.customerName} ${s.tender}`.toLowerCase().includes(q)
  );
  document.getElementById("salesBody").innerHTML = rows.map((s) => `
    <tr>
      <td>${s.receiptNo}</td>
      <td>${new Date(s.at).toLocaleString("en-BS")}</td>
      <td>${s.customerName}<br /><span class="sku">BIN ${s.bin || "—"}</span></td>
      <td>${s.items.reduce((n, i) => n + i.qty, 0)}</td>
      <td>$${money(s.vat)}</td>
      <td>$${money(s.total)}</td>
      <td>${s.tender}</td>
      <td><button type="button" class="link-btn" data-reprint="${s.receiptNo}">Reprint</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8">No sales yet.</td></tr>`;
}

function renderCustomers() {
  const q = document.getElementById("custSearch").value.trim().toLowerCase();
  const rows = state.customers.filter((c) => `${c.name} ${c.phone} ${c.bin}`.toLowerCase().includes(q));
  document.getElementById("customersBody").innerHTML = rows.map((c) => `
    <tr>
      <td>${c.name}</td>
      <td>${c.phone || "—"}</td>
      <td>${c.bin || "—"}</td>
      <td>${c.notes || ""}</td>
      <td>
        <button type="button" class="link-btn" data-use-cust="${c.id}">Use</button>
        <button type="button" class="link-btn" data-edit-cust="${c.id}">Edit</button>
      </td>
    </tr>
  `).join("");
}

function addToCart(product, qty = 1) {
  if (product.stock < 1) {
    alert(`${product.name} is out of stock.`);
    return;
  }
  const existing = cart.items.find((i) => i.sku === product.sku);
  const nextQty = (existing ? existing.qty : 0) + qty;
  if (nextQty > product.stock) {
    alert(`Only ${product.stock} of ${product.name} on hand.`);
    return;
  }
  if (existing) existing.qty = nextQty;
  else cart.items.push({ sku: product.sku, name: product.name, price: product.price, qty });
  renderCart();
}

function findProduct(query) {
  const q = query.trim().toLowerCase();
  return state.products.find((p) =>
    p.sku.toLowerCase() === q || p.barcode === query.trim() || p.name.toLowerCase() === q
  );
}

function switchView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${name}`));
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  const titles = {
    register: ["Sales Register", "Ring up hardware, plumbing, electrical, and lumber"],
    inventory: ["Inventory", "SKUs, on-hand quantities, cost, and selling price"],
    sales: ["Sales History", "Completed receipts with VAT and tender"],
    customers: ["Customers", "Names, phones, and Bahamas Identification Numbers"],
    settings: ["Settings", "Store identity printed on the 3-inch thermal receipt"]
  };
  const [title, sub] = titles[name];
  els.viewTitle.textContent = title;
  els.viewSubtitle.textContent = sub;
  if (name === "inventory") renderInventory();
  if (name === "sales") renderSales();
  if (name === "customers") renderCustomers();
  if (name === "settings") renderSettingsForm();
}

function closeModal() {
  els.modal.classList.add("hidden");
  els.modalCard.innerHTML = "";
}

function openModal(html) {
  els.modalCard.innerHTML = html;
  els.modal.classList.remove("hidden");
}

function productForm(product) {
  const p = product || { sku: "", barcode: "", name: "", category: "Hardware", stock: 0, cost: 0, price: 0 };
  openModal(`
    <h3>${product ? "Edit Item" : "New Item"}</h3>
    <form class="stack-form" id="productForm">
      <label>SKU<input name="sku" value="${p.sku}" ${product ? "readonly" : ""} required></label>
      <label>Barcode<input name="barcode" value="${p.barcode}"></label>
      <label>Name<input name="name" value="${p.name}" required></label>
      <label>Category<input name="category" value="${p.category}" required></label>
      <label>On hand<input name="stock" type="number" min="0" step="1" value="${p.stock}" required></label>
      <label>Cost<input name="cost" type="number" min="0" step="0.01" value="${p.cost}" required></label>
      <label>Price (ex VAT)<input name="price" type="number" min="0" step="0.01" value="${p.price}" required></label>
      <div class="modal-actions">
        <button type="button" class="ghost" id="modalCancel">Cancel</button>
        <button class="primary" type="submit">Save</button>
      </div>
    </form>
  `);
  document.getElementById("modalCancel").onclick = closeModal;
  document.getElementById("productForm").onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const next = {
      sku: String(fd.get("sku")).trim(),
      barcode: String(fd.get("barcode")).trim(),
      name: String(fd.get("name")).trim(),
      category: String(fd.get("category")).trim(),
      stock: Number(fd.get("stock")),
      cost: Number(fd.get("cost")),
      price: Number(fd.get("price"))
    };
    const idx = state.products.findIndex((x) => x.sku === next.sku);
    if (idx >= 0) state.products[idx] = next;
    else state.products.push(next);
    saveState();
    closeModal();
    renderCategories();
    renderProducts();
    renderInventory();
  };
}

function customerForm(customer) {
  const c = customer || { id: `c${Date.now()}`, name: "", phone: "", bin: "", notes: "" };
  openModal(`
    <h3>${customer ? "Edit Customer" : "New Customer"}</h3>
    <form class="stack-form" id="custForm">
      <label>Name<input name="name" value="${c.name}" required></label>
      <label>Phone<input name="phone" value="${c.phone || ""}"></label>
      <label>BIN (10 digits)<input name="bin" value="${c.bin || ""}" maxlength="10" inputmode="numeric"></label>
      <label>Notes<input name="notes" value="${c.notes || ""}"></label>
      <div class="modal-actions">
        <button type="button" class="ghost" id="modalCancel">Cancel</button>
        <button class="primary" type="submit">Save</button>
      </div>
    </form>
  `);
  document.getElementById("modalCancel").onclick = closeModal;
  document.getElementById("custForm").onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const bin = String(fd.get("bin") || "").replace(/\D/g, "");
    if (bin && bin.length !== 10) {
      alert("BIN must be exactly 10 digits.");
      return;
    }
    const next = {
      id: c.id,
      name: String(fd.get("name")).trim(),
      phone: String(fd.get("phone")).trim(),
      bin,
      notes: String(fd.get("notes")).trim()
    };
    const idx = state.customers.findIndex((x) => x.id === next.id);
    if (idx >= 0) state.customers[idx] = next;
    else state.customers.push(next);
    saveState();
    closeModal();
    renderCustomers();
  };
}

function pickCustomer() {
  openModal(`
    <h3>Assign Customer</h3>
    <div class="stack-form">
      ${state.customers.map((c) => `
        <button type="button" class="ghost" data-pick="${c.id}">${c.name} — BIN ${c.bin || "not on file"}</button>
      `).join("")}
    </div>
    <div class="modal-actions">
      <button type="button" class="ghost" id="modalCancel">Close</button>
    </div>
  `);
  document.getElementById("modalCancel").onclick = closeModal;
  els.modalCard.querySelectorAll("[data-pick]").forEach((btn) => {
    btn.onclick = () => {
      cart.customerId = btn.dataset.pick;
      const cust = currentCustomer();
      cart.bin = cust.bin || cart.bin;
      els.customerBin.value = cart.bin;
      closeModal();
      renderCart();
    };
  });
}

function receiptHTML(sale) {
  const binDisplay = sale.bin && sale.bin.length === 10
    ? sale.bin
    : "__________";
  const itemRows = sale.items.map((item) => {
    const amt = lineAmounts(item);
    return `<div class="row"><span>${item.qty} ${item.name}</span><span>$${money(amt.incVat)}</span></div>
      <div class="tiny">${item.sku} @ $${money(item.price)} + VAT $${money(amt.vat)}</div>`;
  }).join("");
  return `<article class="receipt">
    <div class="center store">${sale.store.storeName}</div>
    <div class="center">${sale.store.legalName}</div>
    <div class="center">${sale.store.addr1}</div>
    <div class="center">${sale.store.addr2}</div>
    <div class="center">${sale.store.phone}</div>
    <div class="center tiny">${sale.store.email}</div>
    <hr class="dash" />
    <div class="center bold">SALES RECEIPT</div>
    <div class="row"><span>Receipt</span><span>${sale.receiptNo}</span></div>
    <div class="row"><span>Register</span><span>${sale.store.registerId}</span></div>
    <div class="row"><span>Cashier</span><span>${sale.cashier}</span></div>
    <div class="row"><span>Date</span><span>${new Date(sale.at).toLocaleString("en-BS")}</span></div>
    <div class="row"><span>Customer</span><span>${sale.customerName}</span></div>
    <hr class="dash" />
    ${itemRows}
    <hr class="dash" />
    <div class="row"><span>Subtotal ex VAT</span><span>$${money(sale.subtotal)}</span></div>
    <div class="row"><span>Bahamas VAT 10%</span><span>$${money(sale.vat)}</span></div>
    ${sale.discount ? `<div class="row"><span>Discount</span><span>-$${money(sale.discount)}</span></div>` : ""}
    <div class="row bold"><span>TOTAL BSD</span><span>$${money(sale.total)}</span></div>
    <div class="row"><span>Tender</span><span>${sale.tender}</span></div>
    <div class="row"><span>Amount tendered</span><span>$${money(sale.tendered)}</span></div>
    <div class="row"><span>Change</span><span>$${money(sale.change)}</span></div>
    <div class="bin-box">
      <div class="bin-label">Bahamas Identification Number (BIN)</div>
      <div class="bin-value">${binDisplay}</div>
      <div class="tiny">10-digit BIN placeholder — enter customer BIN at checkout</div>
    </div>
    <div class="center tiny">Prices include calculation of 10% VAT.</div>
    <div class="center">${sale.store.footer}</div>
    <div class="center tiny">3-inch thermal copy</div>
  </article>`;
}

function printSale(sale) {
  els.printRoot.innerHTML = receiptHTML(sale);
  window.print();
}

function completeSale(tender, tendered) {
  const t = cartTotals();
  if (!cart.items.length) {
    alert("Add items before charging.");
    return;
  }
  const bin = String(els.customerBin.value || "").replace(/\D/g, "");
  if (bin && bin.length !== 10) {
    alert("BIN must be 10 digits, or leave it blank to print the placeholder.");
    return;
  }
  const paid = Number(tendered);
  if (tender === "Cash" && paid < t.total) {
    alert("Cash tendered is less than the amount due.");
    return;
  }
  const sale = {
    receiptNo: nextTicket(),
    at: new Date().toISOString(),
    cashier: state.settings.cashier,
    customerName: currentCustomer().name,
    customerId: cart.customerId,
    bin,
    items: cart.items.map((i) => ({ ...i })),
    subtotal: t.subtotal,
    vat: t.vat,
    discount: t.discount,
    total: t.total,
    tender,
    tendered: tender === "Cash" ? paid : t.total,
    change: tender === "Cash" ? Math.max(0, paid - t.total) : 0,
    store: { ...state.settings }
  };
  sale.items.forEach((line) => {
    const p = state.products.find((x) => x.sku === line.sku);
    if (p) p.stock = Math.max(0, p.stock - line.qty);
  });
  state.sales.push(sale);
  state.seq += 1;
  if (bin) {
    const cust = currentCustomer();
    if (cust) cust.bin = bin;
  }
  cart.items = [];
  cart.discount = 0;
  els.discountInput.value = "";
  saveState();
  closeModal();
  renderCart();
  renderProducts();
  printSale(sale);
}

function openPay() {
  const t = cartTotals();
  if (!cart.items.length) {
    alert("Add items before charging.");
    return;
  }
  openModal(`
    <h3>Take Payment</h3>
    <p>Amount due: <strong>$${money(t.total)}</strong> (includes 10% Bahamas VAT)</p>
    <div class="tender-grid">
      <button type="button" class="primary" id="payCash">Cash</button>
      <button type="button" class="primary" id="payCard">Card</button>
    </div>
    <label>Cash tendered<input id="cashIn" type="number" min="0" step="0.01" value="${money(t.total)}" /></label>
    <div class="change-due" id="changePreview">Change $0.00</div>
    <div class="modal-actions">
      <button type="button" class="ghost" id="modalCancel">Cancel</button>
    </div>
  `);
  const cashIn = document.getElementById("cashIn");
  const preview = document.getElementById("changePreview");
  const updateChange = () => {
    const change = Math.max(0, Number(cashIn.value) - t.total);
    preview.textContent = `Change $${money(change)}`;
  };
  cashIn.oninput = updateChange;
  updateChange();
  document.getElementById("modalCancel").onclick = closeModal;
  document.getElementById("payCash").onclick = () => completeSale("Cash", cashIn.value);
  document.getElementById("payCard").onclick = () => completeSale("Card", t.total);
}

function holdTicket() {
  if (!cart.items.length) {
    alert("Nothing to hold.");
    return;
  }
  state.holds.push({
    id: Date.now(),
    items: cart.items.map((i) => ({ ...i })),
    discount: cart.discount,
    customerId: cart.customerId,
    bin: els.customerBin.value
  });
  cart.items = [];
  cart.discount = 0;
  els.discountInput.value = "";
  saveState();
  renderCart();
}

function recallTicket() {
  if (!state.holds.length) {
    alert("No held tickets.");
    return;
  }
  openModal(`
    <h3>Recall Held Ticket</h3>
    ${state.holds.map((h, i) => `
      <button type="button" class="ghost" data-hold="${i}">
        ${h.items.length} item(s) — ${new Date(h.id).toLocaleString("en-BS")}
      </button>
    `).join("")}
    <div class="modal-actions"><button type="button" class="ghost" id="modalCancel">Close</button></div>
  `);
  document.getElementById("modalCancel").onclick = closeModal;
  els.modalCard.querySelectorAll("[data-hold]").forEach((btn) => {
    btn.onclick = () => {
      const h = state.holds.splice(Number(btn.dataset.hold), 1)[0];
      cart.items = h.items;
      cart.discount = h.discount;
      cart.customerId = h.customerId;
      els.customerBin.value = h.bin || "";
      els.discountInput.value = h.discount || "";
      saveState();
      closeModal();
      renderCart();
    };
  });
}

document.querySelector(".nav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-btn");
  if (btn) switchView(btn.dataset.view);
});

els.categoryPills.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderCategories();
  renderProducts();
});

els.categoryFilter.addEventListener("change", () => {
  activeCategory = els.categoryFilter.value;
  renderCategories();
  renderProducts();
});

els.skuSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const match = findProduct(els.skuSearch.value);
    if (match) {
      addToCart(match);
      els.skuSearch.value = "";
      renderProducts();
    }
  }
});
els.skuSearch.addEventListener("input", renderProducts);

els.productGrid.addEventListener("click", (e) => {
  const card = e.target.closest("[data-sku]");
  if (!card) return;
  const product = state.products.find((p) => p.sku === card.dataset.sku);
  if (product) addToCart(product);
});

els.cartBody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  const item = cart.items[idx];
  if (!item) return;
  if (btn.dataset.act === "inc") {
    const p = state.products.find((x) => x.sku === item.sku);
    if (p && item.qty + 1 > p.stock) return alert("Not enough stock.");
    item.qty += 1;
  }
  if (btn.dataset.act === "dec") item.qty -= 1;
  if (btn.dataset.act === "del" || item.qty < 1) cart.items.splice(idx, 1);
  renderCart();
});

els.discountInput.addEventListener("input", () => {
  cart.discount = Number(els.discountInput.value) || 0;
  renderCart();
});

els.customerBin.addEventListener("input", () => {
  cart.bin = els.customerBin.value.replace(/\D/g, "").slice(0, 10);
  els.customerBin.value = cart.bin;
});

document.getElementById("payBtn").onclick = openPay;
document.getElementById("holdBtn").onclick = holdTicket;
document.getElementById("recallBtn").onclick = recallTicket;
document.getElementById("clearBtn").onclick = () => {
  if (cart.items.length && !confirm("Clear the current sale?")) return;
  cart.items = [];
  cart.discount = 0;
  els.discountInput.value = "";
  renderCart();
};
document.getElementById("customerPickBtn").onclick = pickCustomer;
document.getElementById("addProductBtn").onclick = () => productForm();
document.getElementById("addCustomerBtn").onclick = () => customerForm();
document.getElementById("invSearch").oninput = renderInventory;
document.getElementById("salesSearch").oninput = renderSales;
document.getElementById("custSearch").oninput = renderCustomers;

document.getElementById("inventoryBody").addEventListener("click", (e) => {
  const sku = e.target.closest("[data-edit-sku]")?.dataset.editSku;
  if (sku) productForm(state.products.find((p) => p.sku === sku));
});

document.getElementById("salesBody").addEventListener("click", (e) => {
  const no = e.target.closest("[data-reprint]")?.dataset.reprint;
  if (!no) return;
  const sale = state.sales.find((s) => s.receiptNo === no);
  if (sale) printSale(sale);
});

document.getElementById("customersBody").addEventListener("click", (e) => {
  const useId = e.target.closest("[data-use-cust]")?.dataset.useCust;
  const editId = e.target.closest("[data-edit-cust]")?.dataset.editCust;
  if (useId) {
    cart.customerId = useId;
    const cust = currentCustomer();
    els.customerBin.value = cust.bin || "";
    switchView("register");
    renderCart();
  }
  if (editId) customerForm(state.customers.find((c) => c.id === editId));
});

document.getElementById("saveSettingsBtn").onclick = () => {
  state.settings.storeName = document.getElementById("setStoreName").value.trim();
  state.settings.legalName = document.getElementById("setLegalName").value.trim();
  state.settings.addr1 = document.getElementById("setAddr1").value.trim();
  state.settings.addr2 = document.getElementById("setAddr2").value.trim();
  state.settings.phone = document.getElementById("setPhone").value.trim();
  state.settings.email = document.getElementById("setEmail").value.trim();
  state.settings.cashier = document.getElementById("setCashier").value.trim();
  state.settings.footer = document.getElementById("setFooter").value.trim();
  state.settings.registerId = document.getElementById("setRegisterId").value.trim();
  state.settings.vatPct = 10;
  saveState();
  renderSettingsForm();
  alert("Settings saved.");
};

els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) closeModal();
});

renderSettingsForm();
renderCategories();
renderProducts();
renderCart();
tickClock();
setInterval(tickClock, 1000);
