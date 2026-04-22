# Tower Landing v2 — Startups & Investors

Обновлённый лендинг Tower Community (v2). Полный редизайн главной страницы под две аудитории: **стартапы** (резиденты + Tower Program) и **инвесторы / фонды** (партнёрство с когортой).

## Что на странице

7 секций:

1. **Hero** — TOWER, «Where outlier founders launch, grow, and stay»
2. **Tower Founders** — Greg Tkachenko (Unreal Labs) + Evgeny Yurtaev (Zerion)
3. **Residents** — Dwelly, CodeSpeak, Fira, Rork, Yope
4. **Community** — 700+ members, $500M+ raised, 46% Global Talent Visa
5. **The Space** — 31 Great Queen Street, 120 desks, floors overview
6. **Join** — Residents £1000/desk/mo vs Tower Program (free, 3 months)
7. **For Funds & VCs** — Anchor / Community / Network Friend партнёрства

Плюс скрытая страница `uploads/index.html` — под паролем, для инвесторов.

## Структура

```
index.html         — главная
style.css          — основные стили (1753 строк)
components.css     — компоненты
tokens.css         — дизайн-токены
script.js          — интерактив
assets/            — шрифты, фото здания, логотипы партнёров
assets/residents/  — фото и логотипы резидентов
uploads/           — investor-only страница + её ассеты
```

## Как запустить локально

```bash
python3 -m http.server 8000
open http://localhost:8000
```

## История

- **main** — оригинальный лендинг от Жени (первая версия)
- **v2** (эта ветка) — полный редизайн, апрель 2026
