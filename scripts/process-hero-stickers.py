#!/usr/bin/env python3
"""Convierte PNG del hero en stickers con fondo transparente."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

# Umbral para recortar fondo negro o blanco sólido
THRESHOLD = 35

# Archivos con fondo negro (producto sobre negro)
BLACK_BG = {
    'macbook.png',
    'drone.png',
    'sneaker.png',
    'foundation.png',
}

# Archivos con fondo blanco
WHITE_BG = {
    'boarding-pass.png',
}


def key_color(img: Image.Image, mode: str) -> Image.Image:
    """Hace transparente píxeles cercanos al color de fondo."""
    rgba = img.convert('RGBA')
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if mode == 'black' and r <= THRESHOLD and g <= THRESHOLD and b <= THRESHOLD:
                px[x, y] = (r, g, b, 0)
            elif mode == 'white' and r >= 255 - THRESHOLD and g >= 255 - THRESHOLD and b >= 255 - THRESHOLD:
                px[x, y] = (r, g, b, 0)
    return rgba


def has_alpha(img: Image.Image) -> bool:
    if img.mode in ('RGBA', 'LA'):
        extrema = img.getextrema()
        if len(extrema) >= 4:
            return extrema[3][0] < 255
    return False


def process_file(path: Path, use_rembg: bool) -> None:
    name = path.name
    img = Image.open(path)

    if name in BLACK_BG:
        out = key_color(img, 'black')
    elif name in WHITE_BG:
        out = key_color(img, 'white')
    elif has_alpha(img):
        print(f'  skip (ya tiene alpha): {name}')
        return
    elif use_rembg:
        from rembg import remove

        out = remove(img)
    else:
        out = key_color(img, 'black')

    out.save(path, 'PNG', optimize=True)
    print(f'  ok: {name}')


def main() -> None:
    hero_dir = Path(__file__).resolve().parents[1] / 'public' / 'hero-cards'
    use_rembg = '--rembg' in sys.argv
    files = sorted(hero_dir.glob('*.png'))
    print(f'Procesando {len(files)} archivos en {hero_dir}')
    for path in files:
        process_file(path, use_rembg)


if __name__ == '__main__':
    main()
