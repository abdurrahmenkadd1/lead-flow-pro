// ═══════════════════════════════════════════════════
// LeadFlow Pro — Main Application Logic (Bilingual)
// ═══════════════════════════════════════════════════

import { Chart, DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { CONFIG } from './config.js';
import { searchLeads } from './api.js';
import { exportToCSV, exportToExcel, animateCounter, showToast, getRatingClass, formatType } from './utils.js';

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ─── Translations ───
const translations = {
  en: {
    heroTitle1: 'Discover Your Next', heroTitle2: 'Business Leads',
    heroSubtitle: 'AI-powered lead generation platform. Search by industry and location to find potential clients instantly.',
    industryLabel: 'Industry / Sector', industryPlaceholder: 'e.g., Furniture Factory, Restaurant, Hotel...',
    locationLabel: 'Location (coordinates or city)', locationPlaceholder: 'e.g., 39.6484, 27.8826 or Istanbul',
    radiusLabel: 'Search Radius', searchBtn: 'Search Leads', searching: 'Searching...',
    loadingText: 'Searching for potential leads...',
    totalLeads: 'Total Leads', avgRating: 'Avg Rating', havePhone: 'Have Phone', haveWebsite: 'Have Website',
    ratingDist: 'Rating Distribution', bizTypes: 'Top Business Types',
    searchPlaceholder: 'Search in results...', allRatings: 'All Ratings',
    thName: 'Name', thAddress: 'Address', thPhone: 'Phone', thWebsite: 'Website', thRating: 'Rating',
    noData: 'No matching leads found', visit: 'Visit ↗',
    fillIndustry: 'Please enter an industry or sector', fillLocation: 'Please enter a location',
    noResults: 'No results found. Try a different search.',
    exported: 'leads exported as'
  },
  ar: {
    heroTitle1: 'اكتشف عملاءك', heroTitle2: 'المحتملين',
    heroSubtitle: 'منصة ذكية لتوليد العملاء المحتملين. ابحث حسب القطاع والموقع لإيجاد عملاء جدد فوراً.',
    industryLabel: 'القطاع / المجال', industryPlaceholder: 'مثال: مصنع أثاث، مطعم، فندق...',
    locationLabel: 'الموقع (إحداثيات أو مدينة)', locationPlaceholder: 'مثال: 39.6484, 27.8826 أو اسطنبول',
    radiusLabel: 'نطاق البحث', searchBtn: 'ابحث الآن', searching: 'جاري البحث...',
    loadingText: 'جاري البحث عن العملاء المحتملين...',
    totalLeads: 'إجمالي النتائج', avgRating: 'متوسط التقييم', havePhone: 'لديهم هاتف', haveWebsite: 'لديهم موقع',
    ratingDist: 'توزيع التقييمات', bizTypes: 'أنواع الأعمال',
    searchPlaceholder: 'ابحث في النتائج...', allRatings: 'جميع التقييمات',
    thName: 'الاسم', thAddress: 'العنوان', thPhone: 'الهاتف', thWebsite: 'الموقع', thRating: 'التقييم',
    noData: 'لا توجد نتائج مطابقة', visit: 'زيارة ↗',
    fillIndustry: 'يرجى إدخال القطاع أو المجال', fillLocation: 'يرجى إدخال الموقع',
    noResults: 'لم يتم العثور على نتائج. جرب بحث مختلف.',
    exported: 'عميل تم تصديره كـ'
  }
};

// ─── State ───
const state = {
  leads: [], filtered: [], page: 1, perPage: CONFIG.ITEMS_PER_PAGE,
  sortField: null, sortDir: 'asc', ratingFilter: 0, searchQuery: '', isLoading: false,
  lang: localStorage.getItem('lf-lang') || CONFIG.DEFAULT_LANG
};
let ratingChart = null, typesChart = null;
const $ = id => document.getElementById(id);
const t = key => (translations[state.lang] || translations.en)[key] || key;

// ─── Initialize ───
export function initApp() {
  setLanguage(state.lang);
  bindEvents();
}

// ─── i18n ───
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('lf-lang', lang);
  const isRTL = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  // Update toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // Re-render dashboard if data exists
  if (state.leads.length) renderDashboard();
}

// ─── Events ───
function bindEvents() {
  $('searchBtn').addEventListener('click', handleSearch);
  $('radiusSlider').addEventListener('input', e => { $('radiusValue').textContent = `${e.target.value} km`; });
  $('tableSearchInput').addEventListener('input', e => { state.searchQuery = e.target.value.toLowerCase(); state.page = 1; applyFilters(); });
  $('ratingFilter').addEventListener('change', e => { state.ratingFilter = Number(e.target.value); state.page = 1; applyFilters(); });
  $('exportCSV').addEventListener('click', () => { exportToCSV(state.filtered); showToast(`${state.filtered.length} ${t('exported')} CSV`, 'success'); });
  $('exportExcel').addEventListener('click', () => { exportToExcel(state.filtered); showToast(`${state.filtered.length} ${t('exported')} Excel`, 'success'); });
  // Language toggle
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  // Sort headers
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      if (state.sortField === th.dataset.sort) { state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'; }
      else { state.sortField = th.dataset.sort; state.sortDir = 'asc'; }
      document.querySelectorAll('th[data-sort]').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
      th.querySelector('.sort-icon').textContent = state.sortDir === 'asc' ? '▲' : '▼';
      applyFilters();
    });
  });
  $('industryInput').addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
  $('locationInput').addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });
}

// ─── Search ───
async function handleSearch() {
  const query = $('industryInput').value.trim();
  const location = $('locationInput').value.trim();
  const radius = $('radiusSlider').value;
  if (!query) { showToast(t('fillIndustry')); $('industryInput').focus(); return; }
  if (!location) { showToast(t('fillLocation')); $('locationInput').focus(); return; }
  setLoading(true);
  try {
    const results = await searchLeads(query, location, radius * 1000);
    if (!results.length) { showToast(t('noResults')); setLoading(false); return; }
    state.leads = results; state.filtered = [...results]; state.page = 1;
    state.searchQuery = ''; state.ratingFilter = 0; state.sortField = null;
    $('tableSearchInput').value = ''; $('ratingFilter').value = '0';
    renderDashboard(); showDashboard();
  } catch (err) { showToast(err.message); }
  finally { setLoading(false); }
}

function setLoading(on) {
  state.isLoading = on;
  $('loadingSection').style.display = on ? 'block' : 'none';
  $('searchBtn').disabled = on;
  $('searchBtnText').textContent = on ? t('searching') : t('searchBtn');
  if (on) $('dashboard').style.display = 'none';
}

function showDashboard() {
  $('dashboard').style.display = 'block';
  $('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Filters ───
function applyFilters() {
  let data = [...state.leads];
  if (state.ratingFilter > 0) data = data.filter(l => (l.rating || 0) >= state.ratingFilter);
  if (state.searchQuery) data = data.filter(l => (l.name||'').toLowerCase().includes(state.searchQuery) || (l.address||'').toLowerCase().includes(state.searchQuery) || (l.phone||'').toLowerCase().includes(state.searchQuery));
  if (state.sortField) {
    data.sort((a, b) => {
      let va = a[state.sortField] || '', vb = b[state.sortField] || '';
      if (typeof va === 'number' && typeof vb === 'number') return state.sortDir === 'asc' ? va - vb : vb - va;
      return state.sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }
  state.filtered = data; renderTable(); renderPagination();
}

// ─── Dashboard ───
function renderDashboard() { renderStats(); renderCharts(); renderTable(); renderPagination(); }

// ─── Stats ───
function renderStats() {
  const leads = state.leads, total = leads.length;
  const avg = total ? leads.reduce((s, l) => s + (l.rating || 0), 0) / total : 0;
  const phone = total ? Math.round(leads.filter(l => l.phone).length / total * 100) : 0;
  const web = total ? Math.round(leads.filter(l => l.website).length / total * 100) : 0;
  const stats = [
    { icon: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>', val: total, key: 'totalLeads', fl: false },
    { icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', val: avg, key: 'avgRating', fl: true },
    { icon: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>', val: phone, key: 'havePhone', fl: false, suf: '%' },
    { icon: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>', val: web, key: 'haveWebsite', fl: false, suf: '%' }
  ];
  $('statsGrid').innerHTML = stats.map((s, i) => `
    <div class="stat-card anim-fade-up anim-delay-${i + 1}">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-value" data-target="${s.val}" data-float="${s.fl}">${s.fl ? '0.0' : '0'}${s.suf || ''}</div>
      <div class="stat-label">${t(s.key)}</div>
    </div>`).join('');
  setTimeout(() => {
    $('statsGrid').querySelectorAll('.stat-value').forEach(el => {
      const target = parseFloat(el.dataset.target), isF = el.dataset.float === 'true';
      const suf = el.textContent.includes('%') ? '%' : '';
      animateCounter(el, target, 1200, isF);
      if (suf) { const ob = new MutationObserver(() => { if (!el.textContent.endsWith(suf)) el.textContent += suf; }); ob.observe(el, { childList: true, characterData: true, subtree: true }); setTimeout(() => ob.disconnect(), 1500); }
    });
  }, 200);
}

// ─── Charts ───
function renderCharts() { renderRatingChart(); renderTypesChart(); }

function renderRatingChart() {
  const bk = { '5★': 0, '4★': 0, '3★': 0, '2★': 0, '1★': 0 };
  state.leads.forEach(l => { const r = Math.round(l.rating || 0); bk[r >= 5 ? '5★' : r >= 4 ? '4★' : r >= 3 ? '3★' : r >= 2 ? '2★' : '1★']++; });
  const ctx = $('ratingChart').getContext('2d');
  if (ratingChart) ratingChart.destroy();
  ratingChart = new Chart(ctx, {
    type: 'doughnut', data: { labels: Object.keys(bk), datasets: [{ data: Object.values(bk), backgroundColor: ['#10b981','#22d3ee','#6366f1','#f59e0b','#ef4444'], borderWidth: 0, hoverOffset: 8 }] },
    options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { family: 'Inter', size: 12 }, usePointStyle: true } }, tooltip: { backgroundColor: '#1e1e3f', titleColor: '#f1f5f9', bodyColor: '#94a3b8', cornerRadius: 10, padding: 12 } } }
  });
}

function renderTypesChart() {
  const tc = {};
  state.leads.forEach(l => (l.types || []).forEach(tp => { const lb = formatType(tp); tc[lb] = (tc[lb] || 0) + 1; }));
  const sorted = Object.entries(tc).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const colors = ['#6366f1','#22d3ee','#10b981','#f59e0b','#8b5cf6','#ec4899','#3b82f6'];
  const ctx = $('typesChart').getContext('2d');
  if (typesChart) typesChart.destroy();
  typesChart = new Chart(ctx, {
    type: 'bar', data: { labels: sorted.map(s => s[0]), datasets: [{ data: sorted.map(s => s[1]), backgroundColor: colors.slice(0, sorted.length), borderRadius: 6, barThickness: 28 }] },
    options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e1e3f', titleColor: '#f1f5f9', bodyColor: '#94a3b8', cornerRadius: 10, padding: 12 } },
      scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } }, y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } } }
  });
}

// ─── Table ───
function renderTable() {
  const { filtered, page, perPage } = state;
  const start = (page - 1) * perPage;
  const pd = filtered.slice(start, start + perPage);
  const tbody = $('leadsTableBody');
  if (!pd.length) { tbody.innerHTML = `<tr><td colspan="6" class="no-data-cell">${t('noData')}</td></tr>`; return; }
  tbody.innerHTML = pd.map((l, i) => {
    const rc = getRatingClass(l.rating || 0);
    const ph = l.phone ? `<a href="tel:${l.phone}">${l.phone}</a>` : '<span style="color:var(--text3)">—</span>';
    const wb = l.website ? `<a href="${l.website}" target="_blank" rel="noopener">${t('visit')}</a>` : '<span style="color:var(--text3)">—</span>';
    return `<tr><td>${start+i+1}</td><td class="td-name">${esc(l.name)}</td><td title="${esc(l.address)}">${esc(l.address)}</td><td class="td-phone">${ph}</td><td>${wb}</td><td><span class="rating-badge ${rc}">⭐ ${(l.rating||0).toFixed(1)}</span></td></tr>`;
  }).join('');
}

// ─── Pagination ───
function renderPagination() {
  const { filtered, page, perPage } = state;
  const tp = Math.ceil(filtered.length / perPage) || 1;
  const c = $('pagination');
  if (tp <= 1) { c.innerHTML = ''; return; }
  let h = `<button class="page-btn" ${page<=1?'disabled':''} data-page="${page-1}"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>`;
  getRange(page, tp).forEach(p => { h += p === '...' ? `<span class="page-info">…</span>` : `<button class="page-btn ${p===page?'active':''}" data-page="${p}">${p}</button>`; });
  h += `<button class="page-btn" ${page>=tp?'disabled':''} data-page="${page+1}"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>`;
  c.innerHTML = h;
  c.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { const p = Number(btn.dataset.page); if (p >= 1 && p <= tp) { state.page = p; renderTable(); renderPagination(); $('leadsTable').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } });
  });
}

function getRange(cur, tot) {
  if (tot <= 7) return Array.from({ length: tot }, (_, i) => i + 1);
  if (cur <= 3) return [1, 2, 3, 4, '...', tot];
  if (cur >= tot - 2) return [1, '...', tot - 3, tot - 2, tot - 1, tot];
  return [1, '...', cur - 1, cur, cur + 1, '...', tot];
}

function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
