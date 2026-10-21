from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
p=Path(__file__).parent
im=Image.new('RGB',(1600,800),'#18212b')
logo=Image.open(p/'aura-fitness-logo.png').convert('RGBA');logo.thumbnail((1400,340));im.paste(logo,((1600-logo.width)//2,90),logo)
d=ImageDraw.Draw(im)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',132)
d.text((800,600),'AURA FITNESS',font=font,fill='white',anchor='mm')
im.save(p/'aura-tabela.png')
