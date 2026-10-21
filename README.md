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
