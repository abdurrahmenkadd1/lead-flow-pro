// ═══════════════════════════════════════════════════
// LeadFlow Pro — API Layer + Mock Data
// ═══════════════════════════════════════════════════

import { CONFIG } from './config.js';

// ─── Mock Data (realistic Turkish business data) ─── 
const MOCK_LEADS = [
  { name: "Aker Mobilya Fabrikası", address: "Organize Sanayi Bölgesi, 5. Cadde No:12, Balıkesir", phone: "+90 266 245 1234", website: "https://akermobilya.com.tr", rating: 4.6, user_ratings_total: 142, types: ["furniture_store","manufacturer"], lat: 39.6521, lng: 27.8912 },
  { name: "Doğanlar Mobilya San. Tic.", address: "Balıkesir OSB, 3. Yol No:8", phone: "+90 266 281 5678", website: "https://doganlar-mobilya.com", rating: 4.3, user_ratings_total: 89, types: ["furniture_store","point_of_interest"], lat: 39.6612, lng: 27.9034 },
  { name: "Özgür Ahşap Mobilya", address: "Paşaalanı Mah., Sanayi Cad. No:45, Balıkesir", phone: "+90 266 243 9012", website: null, rating: 4.1, user_ratings_total: 56, types: ["furniture_store"], lat: 39.6401, lng: 27.8756 },
  { name: "Yıldız Koltuk Fabrikası", address: "Altıeylül, Organize San. 7. Cad No:22", phone: "+90 266 249 3456", website: "https://yildizkoltuk.com.tr", rating: 4.8, user_ratings_total: 203, types: ["furniture_store","manufacturer"], lat: 39.6578, lng: 27.8601 },
  { name: "Kardeşler Mobilya A.Ş.", address: "Bandırma Yolu Üzeri, 5. km Balıkesir", phone: "+90 266 246 7890", website: "https://kardesler-mobilya.com", rating: 3.9, user_ratings_total: 45, types: ["furniture_store"], lat: 39.6234, lng: 27.8523 },
  { name: "Anadolu Mobilya Dekorasyon", address: "Yeni Sanayi Sitesi, B Blok No:14", phone: null, website: "https://anadolumobilya.net", rating: 4.0, user_ratings_total: 67, types: ["furniture_store","home_goods_store"], lat: 39.6489, lng: 27.8934 },
  { name: "Mega Ahşap Endüstri", address: "İvrindi Yolu, Sanayi Kavşağı No:3, Balıkesir", phone: "+90 266 271 2345", website: "https://megaahsap.com.tr", rating: 4.4, user_ratings_total: 112, types: ["manufacturer","furniture_store"], lat: 39.6701, lng: 27.9123 },
  { name: "Balıkesir Mobilya Merkezi", address: "Atatürk Bulvarı No:156, Karesi", phone: "+90 266 241 6789", website: null, rating: 3.7, user_ratings_total: 34, types: ["furniture_store","store"], lat: 39.6456, lng: 27.8812 },
  { name: "Prestij Ofis Mobilyaları", address: "Organize San. 2. Cadde No:19, Balıkesir", phone: "+90 266 282 0123", website: "https://prestijofis.com", rating: 4.5, user_ratings_total: 178, types: ["furniture_store","manufacturer"], lat: 39.6543, lng: 27.8678 },
  { name: "Ege Mobilya Tasarım", address: "Bandırma Cad. No:89, Gönen", phone: "+90 266 762 4567", website: "https://egemobilya.com.tr", rating: 4.2, user_ratings_total: 91, types: ["furniture_store","interior_designer"], lat: 40.1067, lng: 27.6478 },
  { name: "Sakarya Ahşap San.", address: "Susurluk OSB, A-12 Parseli", phone: "+90 266 865 8901", website: null, rating: 3.5, user_ratings_total: 23, types: ["manufacturer"], lat: 39.9134, lng: 28.1567 },
  { name: "Atlas Kanepe Fabrikası", address: "Gönen Yolu 12. km, Balıkesir", phone: "+90 266 245 2345", website: "https://atlaskanepe.com", rating: 4.7, user_ratings_total: 156, types: ["furniture_store","manufacturer"], lat: 39.6823, lng: 27.8345 },
  { name: "Modern Yatak Odası", address: "Karesi, Yıldırım Mah. San. Sit. No:7", phone: "+90 266 244 6789", website: "https://modernyatakodasi.com", rating: 4.0, user_ratings_total: 78, types: ["furniture_store","home_goods_store"], lat: 39.6512, lng: 27.8901 },
  { name: "Erdem Mobilya İmalat", address: "Edremit, Sanayi Sitesi C Blok No:5", phone: "+90 266 373 0123", website: null, rating: 3.8, user_ratings_total: 41, types: ["manufacturer","furniture_store"], lat: 39.5956, lng: 27.0234 },
  { name: "Güneş Ahşap Dekorasyon", address: "Bigadiç Yolu, 3. km Balıkesir", phone: "+90 266 249 4567", website: "https://gunesahsap.com.tr", rating: 4.3, user_ratings_total: 95, types: ["furniture_store","carpenter"], lat: 39.6345, lng: 27.9012 },
  { name: "Türk Mobilya Grubu", address: "OSB 11. Cadde No:34, Altıeylül", phone: "+90 266 281 8901", website: "https://turkmobilyagrubu.com", rating: 4.6, user_ratings_total: 189, types: ["manufacturer","furniture_store"], lat: 39.6678, lng: 27.8567 },
  { name: "Nilüfer Ev Mobilyaları", address: "Havran, Cumhuriyet Cad. No:23", phone: "+90 266 385 2345", website: null, rating: 3.4, user_ratings_total: 19, types: ["furniture_store"], lat: 39.5534, lng: 27.0978 },
  { name: "Bayrak Mutfak Mobilya", address: "Karesi, Eski San. Sit. 4. Sok. No:11", phone: "+90 266 243 6789", website: "https://bayrakmutfak.com", rating: 4.1, user_ratings_total: 63, types: ["furniture_store","kitchen_supply"], lat: 39.6467, lng: 27.8823 },
  { name: "Osmanlı Klasik Mobilya", address: "Gönen OSB, D-7 Parseli", phone: "+90 266 762 0123", website: "https://osmanliklasik.com.tr", rating: 4.9, user_ratings_total: 234, types: ["furniture_store","manufacturer"], lat: 40.1123, lng: 27.6534 },
  { name: "Akdeniz Mobilya Fabrikası", address: "Bandırma, Sanayi Bölgesi No:56", phone: "+90 266 714 4567", website: "https://akdenizmobilya.com", rating: 4.4, user_ratings_total: 108, types: ["manufacturer","furniture_store"], lat: 40.3523, lng: 27.9756 },
  { name: "Bolu Koltuk İmalatı", address: "Altıeylül, Yeni OSB 8. Cad No:15", phone: null, website: null, rating: 3.6, user_ratings_total: 28, types: ["manufacturer"], lat: 39.6590, lng: 27.8490 },
  { name: "Marmara Ahşap San. Tic.", address: "Erdek Yolu, 8. km Bandırma", phone: "+90 266 718 8901", website: "https://marmaraahsap.com", rating: 4.2, user_ratings_total: 87, types: ["manufacturer","furniture_store"], lat: 40.3412, lng: 27.9623 },
  { name: "Çınar Mobilya Atölyesi", address: "Dursunbey, Atatürk Cad. No:78", phone: "+90 266 561 2345", website: null, rating: 3.3, user_ratings_total: 15, types: ["furniture_store","carpenter"], lat: 39.5812, lng: 28.6278 },
  { name: "Elit Ofis Sistemleri", address: "Organize San. 4. Cad No:29, Balıkesir", phone: "+90 266 282 6789", website: "https://elitofis.com.tr", rating: 4.5, user_ratings_total: 134, types: ["furniture_store","office_supply"], lat: 39.6534, lng: 27.8745 },
  { name: "Paşa Mobilya Dekor", address: "Karesi, İstasyon Mah. San. Cad. No:33", phone: "+90 266 241 0123", website: "https://pasamobilya.com", rating: 4.0, user_ratings_total: 72, types: ["furniture_store","interior_designer"], lat: 39.6478, lng: 27.8867 },
  { name: "Zambak Bebek Mobilyası", address: "Altıeylül, Çamlık Mah. No:12", phone: "+90 266 249 4501", website: "https://zambakbebek.com", rating: 4.7, user_ratings_total: 198, types: ["furniture_store","baby_store"], lat: 39.6601, lng: 27.8534 },
  { name: "Koç Endüstriyel Mobilya", address: "Bigadiç OSB, E-3 Parseli", phone: "+90 266 561 8923", website: "https://kocendustriyel.com", rating: 4.3, user_ratings_total: 101, types: ["manufacturer"], lat: 39.3945, lng: 28.1234 },
  { name: "Pınar Ahşap İşleri", address: "Sındırgı, Sanayi Sitesi No:6", phone: null, website: null, rating: 3.1, user_ratings_total: 11, types: ["carpenter","furniture_store"], lat: 39.2367, lng: 28.1756 },
  { name: "Safir Koltuk Döşeme", address: "Karesi, Gümüş Cad. No:44", phone: "+90 266 244 3378", website: null, rating: 3.9, user_ratings_total: 52, types: ["furniture_store","upholsterer"], lat: 39.6445, lng: 27.8789 },
  { name: "Defne Mobilya Tasarım", address: "Edremit, Zeytinli Mah. San. Sit. B-9", phone: "+90 266 374 5612", website: "https://defnemobilya.com", rating: 4.1, user_ratings_total: 66, types: ["furniture_store","interior_designer"], lat: 39.5878, lng: 27.0167 }
];

/**
 * Fixes Turkish character mojibake caused by N8N server decoding UTF-8 bytes as GBK (Simplified Chinese)
 */
function fixTurkishMojibake(str) {
  if (!str) return '';
  return str
    .replace(/谋/g, 'ı')
    .replace(/陌/g, 'İ')
    .replace(/臒/g, 'ğ')
    .replace(/臑/g, 'Ğ')
    .replace(/眉/g, 'ü')
    .replace(/脺/g, 'Ü')
    .replace(/艧/g, 'ş')
    .replace(/艦/g, 'Ş')
    .replace(/枚/g, 'ö')
    .replace(/脰/g, 'Ö')
    .replace(/莽/g, 'ç')
    .replace(/脟/g, 'Ç');
}

/**
 * Search for leads via N8N webhook or mock data
 */
export async function searchLeads(query, location, radiusMeters) {
  if (CONFIG.USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    return [...MOCK_LEADS];
  }

  try {
    const params = new URLSearchParams({
      query,
      location,
      radius: String(radiusMeters)
    });
    const response = await fetch(`${CONFIG.WEBHOOK_URL}?${params}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    // N8N returns mixed items from Filter (text search) and HTTP Request1 (details)
    // We use items that have a 'name' field (text search results)
    const results = Array.isArray(data) ? data : (data.results || []);

    return results
      .filter(item => item.name || item.Name)
      .map(item => ({
        name: fixTurkishMojibake(item.name || item.Name || ''),
        address: fixTurkishMojibake(item.formatted_address || item.address || item.Address || ''),
        phone: item.formatted_phone_number || item.phone || item.Phone || item.result?.formatted_phone_number || null,
        website: item.website || item.Website || item.result?.website || null,
        rating: item.rating || 0,
        user_ratings_total: item.user_ratings_total || 0,
        types: item.types || [],
        lat: item.geometry?.location?.lat || item.lat || 0,
        lng: item.geometry?.location?.lng || item.lng || 0
      }));
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to connect to the lead generation service. Please check your N8N webhook URL and try again.');
  }
}
