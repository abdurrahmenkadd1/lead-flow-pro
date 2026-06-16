// ═══════════════════════════════════════════════════
// LeadFlow Pro — Utilities
// ═══════════════════════════════════════════════════

import * as XLSX from 'xlsx';

/**
 * Export leads data as CSV file
 */
export function exportToCSV(leads, filename = 'leadflow-leads') {
  const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Reviews'];
  const rows = leads.map(l => [
    l.name,
    l.address,
    l.phone || 'N/A',
    l.website || 'N/A',
    l.rating || 'N/A',
    l.user_ratings_total || 0
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export leads data as Excel file
 */
export function exportToExcel(leads, filename = 'leadflow-leads') {
  const data = leads.map(l => ({
    'Business Name': l.name,
    'Address': l.address,
    'Phone': l.phone || 'N/A',
    'Website': l.website || 'N/A',
    'Rating': l.rating || 'N/A',
    'Total Reviews': l.user_ratings_total || 0,
    'Types': (l.types || []).join(', ')
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  // Auto-size columns
  ws['!cols'] = [
    { wch: 30 }, { wch: 45 }, { wch: 18 },
    { wch: 30 }, { wch: 8 }, { wch: 12 }, { wch: 25 }
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Download helper
 */
function downloadFile(content, filename, type) {
  const blob = new Blob(['\ufeff' + content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Animate a counter from 0 to target value
 */
export function animateCounter(element, target, duration = 1200, isFloat = false) {
  let start = 0;
  const startTime = performance.now();
  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = start + (target - start) * eased;
    element.textContent = isFloat ? current.toFixed(1) : Math.round(current);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/**
 * Show a toast notification
 */
export function showToast(message, type = 'error') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(50px)'; }, 3000);
  setTimeout(() => toast.remove(), 3500);
}

/**
 * Get rating badge class
 */
export function getRatingClass(rating) {
  if (rating >= 4) return 'rating-high';
  if (rating >= 3) return 'rating-mid';
  return 'rating-low';
}

/**
 * Format a type string to readable label
 */
export function formatType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
