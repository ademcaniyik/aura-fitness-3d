from pathlib import Path
import base64,re
p=Path(__file__).parent
lib=(p/'three.module.js').read_text()
exporter=(p/'GLTFExporter.js').read_text()
exporter=re.sub(r'import\s+[\s\S]*?from\s+[\'\"][^\'\"]+[\'\"];','',exporter)
# No compressed textures in this scene.
exporter='function decompress(){throw new Error("Compressed textures are not used in this model")}\n'+exporter
html='''<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aura • Gerçekçi yerel çalışma</title><style>body{margin:0;background:#b9cbd5;font:13px system-ui;color:#fff}#info{position:absolute;left:18px;top:18px;background:#162329df;border:1px solid #ffffff25;padding:18px;border-radius:14px;max-width:330px;backdrop-filter:blur(10px)}h1{font-size:19px;margin:0 0 6px}p{margin:6px 0;color:#c3d1d7}button{background:#ecf0ee;color:#203036;border:0;border-radius:7px;padding:9px;margin:6px 3px 0 0;cursor:pointer}small{display:block;color:#afc3c8;margin-top:10px}canvas{display:block}#tag{color:#a6dbb7;font-size:10px;letter-spacing:2px;margin-bottom:8px}@media(max-width:650px){#info{max-width:270px;padding:12px}p.help{display:none}}</style><div id="info"><div id="tag">YEREL TASLAK • CANLIDA DEĞİL</div><h1>AURA FITNESS CLUB</h1><p>Malzeme, ışık ve detay çalışması</p><p class="help">Sürükle: döndür · Tekerlek: yakınlaştır<br>Sağ tuş: kaydır</p><button onclick="view('all')">Genel</button><button onclick="view('side')">Yan kapı</button><button onclick="view('main')">Ana kapı</button><button onclick="view('building')">Aura bina</button><button onclick="view('camera')">Kamera detayı</button><button id="play" onclick="toggleSimulation()">Duraklat</button><button onclick="resetSimulation()">Baştan oynat</button><p id="sim-status" aria-live="polite">Araç girişe yaklaşıyor</p><button id="export" onclick="exportModel()">GLB indir</button><small>Yaklaşık ölçülü konsept model.</small></div><script type="module">'''
html+=lib+'\n'+exporter+'\nconst items='+(p/'scene.json').read_text()+';\nconst signURL="data:image/png;base64,'+base64.b64encode((p/'aura-tabela.png').read_bytes()).decode()+'";\n'+(p/'realist-sahne.js').read_text()+'\n</script></html>'
(p/'aura-3d-realist.html').write_text(html)
(p/'aura-3d-canli.html').write_text(html.replace('YEREL TASLAK • CANLIDA DEĞİL','3D OTOPARK • HAREKETLİ SUNUM').replace('Aura • Gerçekçi yerel çalışma','Aura Fitness • 3D Otopark').replace('Malzeme, ışık ve detay çalışması','Araç geçişleri ve otopark yerleşimi'))
print('Local and public previews built')
