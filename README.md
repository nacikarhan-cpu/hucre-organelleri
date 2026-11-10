# Naci Hoca ile TYT Biyoloji

**Hücre ve Organelleri · Öğren – Çöz – Değerlendir**  
Tasarım: Naci Karhan

## Aç ve kullan

ZIP dosyasını tamamen çıkardıktan sonra `naci-hoca/index.html` dosyasını tarayıcıda açın. Kurulum, hesap veya internet bağlantısı gerekmez. Paylaşılabilir bağlantı ve sosyal medya önizlemesi için uygulamanın erişilebilir bir HTTPS adresinde yayımlanması gerekir.

- **Konuyu Keşfet:** 12 Türkçe etiketli SVG kartı, prokaryot–ökaryot karşılaştırması.
- **Kendini Dene:** Her biri 10 soruluk Temel Bilgi, Kavrama ve Yorumlama, Bağlam Temelli Yeni Nesil Sorular testleri.
- **Konu Özeti:** Zar sayılarına göre sınıflandırma, temel görevler, bitki–hayvan karşılaştırması ve önemli istisnalar.

Sınav sırasında cevaplar değiştirilebilir veya boş bırakılabilir. Çözümler sınav bitince görünür. Net = doğru − yanlış / 4. Başarı = doğru / toplam × 100. Başarı rozeti %50 ve üzerinde görünür. Ses başlangıçta kapalıdır. Sayfayı yenilemek devam eden denemeyi sıfırlar; uygulama öğrenci verilerini dışarı göndermez.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| `index.html`, `style.css` | Sayfa yapısı, Türkçe paylaşım metinleri ve duyarlı tasarım |
| `questions.js` | Test adları, 30 soru, seçenekler, cevaplar ve çözümler |
| `content.js` | Öğretici kartlar, özet verileri ve özgün SVG çizimleri |
| `app.js` | Sınav akışı, kronometre, değerlendirme, paylaşım ve ses |
| `assets/` | Hücre şeması ve 1200 × 630 PNG paylaşım kapağı |
| `vercel.json`, `build.mjs` | Bağımlılık kurmadan Vercel için statik çıktı ve paylaşım adresleri |

## GitHub ve Vercel

Bu paket yerel inceleme için hazırlanmıştır. GitHub'a gönderilmedi ve Vercel'de yayımlanmadı.

1. Yayın onayından sonra `naci-hoca` klasörünün **içeriğini**, `.gitignore` dahil, GitHub deposunun köküne ekleyin.
2. Vercel'de bu depoyu içe aktarın. Projenin kökü `index.html` ve `vercel.json` bulunan dizin olmalıdır. Yapılandırma, `node build.mjs` komutuyla yalnız statik site dosyalarını `dist/` dizinine hazırlar.
3. Vercel sistem değişkenleri etkinse yayın adresi otomatik alınır. Özel alan adı için gerekirse `SITE_URL` değişkenine tam HTTPS adresini yazın. Üretim adresi, paylaşım bağlantısı ve `og:image` kapağı oluşturulurken kullanılır.
4. Yayımdan sonra üretim bağlantısını açın ve mobil paylaşım menüsünü, WhatsApp/Facebook önizlemesini ve kapağın erişilebilirliğini kontrol edin.

Başvuru: [Vercel proje yapılandırması](https://vercel.com/docs/project-configuration/vercel-json) ve [Vercel sistem değişkenleri](https://vercel.com/docs/environment-variables/system-environment-variables).

## Cevap anahtarı ve kontroller

| Test | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Temel Bilgi | C | A | E | B | D | A | C | D | B | E |
| Kavrama ve Yorumlama | D | B | E | A | C | E | B | D | C | A |
| Bağlam Temelli | B | E | A | D | C | A | D | B | E | C |

- Sorular ve çözümler bilimsel doğruluk ve tek doğru seçenek bakımından gözden geçirildi. Her testte A–E seçeneklerinin her biri iki kez doğrudur.
- Chrome'da üç testi başlatma, önceki/sonraki soruya ve soru numarasına gitme, cevap değiştirme, cevabı temizleme, sınavı bitirme/iptal, çözüm ve yanlış filtresi, yeniden çözme ve ana sayfaya dönme sınandı.
- Kronometrenin ilerlediği ve 5 doğru, 1 yanlış, 4 boş için 4,75 net, %50 başarı ve rozet çıktığı doğrulandı. Boş denemede rozet gösterilmedi.
- 320, 390, 768 ve 1365 piksel genişliklerinde tarayıcı kontrolü yapıldı. Sınanan akışlarda JavaScript konsol hatası görülmedi.
- Paylaşım ve kopyalama çağrıları örnek HTTPS adresinde tarayıcı ortamında sınandı. Ses açıkken iki kısa ton üretildiği, kapalıyken üretilmediği doğrulandı. Örnek üretim derlemesi doğru paylaşım adreslerini oluşturdu.
- Fiziksel Android/iOS cihazlar, canlı Vercel dağıtımı ve sosyal ağların gerçek önizlemeleri sınanmadı.

## İçerik dayanakları

- [MEB 9. sınıf Biyoloji – Organizasyon teması](https://tymm.meb.gov.tr/21/unite/3) ve [MEB OGM Biyoloji 9 çalışma defteri](https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/calisma_defteri/f4/9/biyoloji/biyoloji.pdf).
- [ÖSYM 2026-YKS soru kitapçıkları](https://www.osym.gov.tr/2026yks-tyt-ayt-ve-ydt-temel-soru-kitapciklari-ve-cevap-anahtarlari), sınav biçimi için genel referans.
- Paylaşılan soru bankasının hücre bölümü konu ve soru biçimi için örneklendi. Uygulamadaki sorular ve şemalar bu proje için özgün yazıldı ve çizildi.
