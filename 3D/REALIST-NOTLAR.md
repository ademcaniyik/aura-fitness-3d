# Yerel gerçekçilik çalışması

Canlıya gönderilmemiş ayrı taslaktır.

- Önizleme: aura-3d-realist.html
- Model: aura-otopark-realist.glb
- Kaynak: realist-sahne.js
- Üretim: python3 3D/realist_olustur.py

GLB yeniden üretmek için önizlemedeki GLB indir düğmesini kullanın. Asfalt/kaldırım dokuları, yuvarlatılmış araçlar, lastik ve jant geometrileri, hacimli ağaç taçları, cephe detayları ve logo dokuları modele dahildir. Tarayıcıdaki güneş, gölgeler ve kamera sunum ayarlarıdır; GLB açılan yazılımda ayrıca ışıklandırılabilir. Ölçüler yaklaşık, model konsepttir.

Ana kapı ortasında 5 turuncu delinatör eklendi. Aura cephesine yakın iki orta sıra aracı (0/13 ve 1/13) kaldırıldı. Sağdan ilerleyip park sıraları etrafında dönerek ana kapı çıkışına ulaşan güzergâh zemin oklarıyla gösterildi.

Kameralar lens, IR ışıklar, güneşlik ve montaj ayağıyla detaylandırıldı. 76 saniyelik döngüde araç girişte bekler, giriş kolu açılır, araç park sıraları etrafında dolaşır ve çıkış kolundan geçer. GLB içinde araç konumu/yönü ve iki bariyer kolu için animasyon izleri vardır. Yan kapı kolu statik kalır. Bu görsel senaryo sensör veya gerçek trafik simülasyonu değildir.

22 Ekim: dış yoldan sağdan yaklaşma ve çıkıştan sola devam etme eklendi. İç dolaşım süresi 50 saniyeden 30 saniyeye indirildi; toplam döngü 64 saniye. Dıştaki iki delinatör kaldırıldı, içeride 3 kaldı. Kameralar yaklaşan ön plaka hedeflerine yönlendirildi.

Çok araçlı akış: iki mevcut park aracı sırayla ana çıkıştan ayrılır; yan kapıdan ek araç girip ilk boşalan yere geri park eder. Ana girişteki mevcut tur aracı korunur. Üç kol hareketlidir. GLB 13 animasyon kanalı içerir.
