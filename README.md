# Aura Fitness Club — 3D Otopark

Canlı önizleme: https://candemsoft.store/aura-fitness-3d/

Üç bariyer, tek yönlü kapan, kameralar ve otopark yerleşimi için konsept 3D model.

## Dosyalar

- `3D/aura-3d-onizleme.html`: çevrimdışı çalışan, döndürülebilen önizleme.
- `3D/aura-otopark.glb`: renkli, ayrı adlandırılmış nesneler içeren model.
- `3D/aura-otopark.obj`: geometrik aktarım alternatifi.
- `3D/model_olustur.py`: Python standart kütüphanesiyle model üretimi.
- `3D/viewer_olustur.py`: Three.js içeren bağımsız HTML üretimi.
- `aura-otopark-konsept-v4.png`: son onaylanan görsel referansı.

## Yeniden üretim

```sh
python3 3D/model_olustur.py
python3 3D/viewer_olustur.py
python3 -m http.server 8766 --directory 3D
```

Tarayıcıda `http://localhost:8766/aura-3d-onizleme.html` adresini açın.

## Kapsam

Konsept modeldir; saha ölçümü veya uygulama projesi değildir. Geçişler yaklaşık 4 m kabul edilmiş, diğer ölçüler varsayımsal modellenmiştir. Ürünler üretici CAD modelleri değildir.

## Yayın

Canlı sürüm, üretilen HTML dosyasının sunucuda `/var/www/candemsoft.store/aura-fitness-3d/index.html` olarak yayınlanmasıyla çalışır. GitHub'a push otomatik dağıtım yapmaz.

Three.js r160 MIT lisanslıdır; lisansı `3D/THREE-LICENSE.txt` içindedir.

## Güncel yerleşim

Yan kapı okları otoparka giriş yönündedir. Ana kapının giriş ve çıkış okları yer değiştirmiştir. Mevcut binanın karşısında büyük Aura Fitness binası, yol ve otopark cephelerinde logo ve yazılı tabelalar bulunur. Logo kaynağı: https://aurafitnessclub.com/assets/img/aura-fitness-logo.webp

Tabelanın PNG dokusu GLB ve çevrimdışı HTML içine gömülüdür; OBJ yalnızca geometri içerir. `tabela_olustur.py` tabelayı Pillow ile yeniden üretir (font yolu macOS içindir); hazır PNG depoda bulunduğundan normal model üretimi için bu adım gerekli değildir.

## Güncel animasyonlu sürüm

Canlı sayfa `3D/aura-3d-canli.html` dosyasından yayınlanır. Yerel önizleme `3D/aura-3d-realist.html`, animasyonlu model `3D/aura-otopark-realist.glb` dosyasındadır. Dört hareketli araç, üç hareketli bariyer, detaylı kameralar, üç turuncu delinatör ve yan kapıdan park etme senaryosu içerir.

Üretim: `python3 3D/realist_olustur.py`. Bu işlem yerel ve canlı HTML dosyalarını üretir. GLB için önizlemedeki **GLB indir** düğmesini kullanın. GitHub push otomatik dağıtım yapmaz; canlı HTML sunucuya ayrıca yüklenir.
