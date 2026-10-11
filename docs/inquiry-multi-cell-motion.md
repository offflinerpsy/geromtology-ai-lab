# Fields of Inquiry — independent cellular layers

This revision follows the owner's request on September 30, 2026: several cellular forms of different sizes, a distinct movement character, stronger vertical scroll parallax, and a palette suited to the existing light background. The approved homepage hero is unchanged.

## Motion prompt

Создать для Fields of Inquiry живую композицию из нескольких независимых клеточных структур на настоящем прозрачном фоне. Крупная пористая форма слева задаёт композицию; меньшие компактные и вытянутые формы располагаются на разных планах и продолжают рисунок за Research Programs. Сохранить светлый бумажный фон сайта. Материал — глубокий лесной зелёный, графитовые мембраны, приглушённая олива; блики тонкие, без белого или серебряного свечения, которое растворяется в фоне.

Каждая структура медленно дрейфует вверх и вниз со своей фазой и продолжительностью. Горизонтальное смещение минимальное, наклон едва заметный. Не повторять текучую деформацию героя: здесь ощущение свободно взвешенных образцов на разных расстояниях. При прокрутке добавить выразительный вертикальный параллакс: ближние формы проходят большее расстояние, дальние меньше, часть слоёв движется в противоположном направлении. Плавно догонять положение прокрутки, без резких скачков. Не использовать вращающиеся орбиты, желейную деформацию, частицы-конфетти, неон, интерфейсные сетки или вымышленные научные подписи. Контраст текста и доступность меню, раскрывающихся программ и управления движением сохраняются на всех размерах экрана.

## Asset brief and provenance

One built-in image-generation edit used the previous transparent Inquiry study as its reference. The result supplies four organic variants in a two-by-two transparent atlas: a broad porous cluster, a compact angled group, an elongated branching group and an open curved form. These are conceptual illustrations, not microscopy observations or a biological simulation.

The atlas is `public/images/cellular-inquiry-atlas.webp`, 1536 × 1024, RGBA, with 58.6% fully transparent pixels. It was converted from the generated PNG using Sharp with alpha quality 100. Some silver highlights remain in the source; a shared forest/graphite colour treatment adjusts all three rendering modes consistently. Each tile has feathered edges so cropping does not introduce a rectangular boundary.

## Implementation

- Five independently placed instances use four source forms. `lib/inquiry-sprites.ts` owns their size, opacity, position, drift, phase and scroll depth.
- `lib/cellular-inquiry.ts` draws alpha-preserving WebGL planes. Each structure moves independently; the hero's fluid-displacement shader is not reused. Vertical periods range from 20 to 40 seconds, with a complete closed motion cycle of 240 seconds.
- Scroll depth ranges from −180 to +230 CSS pixels before mobile attenuation. Scroll response eases over approximately 340 milliseconds. Mobile motion strength is 48% of desktop.
- `app/inquiry-animation.css` supplies responsive composition, soft section edges and the shared forest/graphite palette. Research copy and disclosure controls remain HTML above the artwork.
- Canvas 2D draws five alpha-preserving preprocessed tiles when WebGL is unavailable. Initial loading, reduced motion and rendering failures retain the same static composition. Offscreen, hidden-tab and paused states suspend animation; navigation releases resources.

## Verification

The final vertex and fragment shaders compiled and linked in a headless OpenGL ES2 context. Browser verification used the Canvas 2D fallback because the verification browser did not provide WebGL. Actual rendered pixels changed during autonomous movement and vertical scrolling; a 220-pixel scroll shifted the alpha-weighted composition centre by about 36 canvas pixels. Pausing left the pixel signature unchanged; Enter resumed motion. At widths 360, 430, 768, 800, 801 and 1200 pixels, all five sprites loaded without broken images or horizontal page overflow. A research program opened through its native disclosure control above the animation. The final phone composition was visually reviewed after moving the lower form away from its caption. Hero source files and texture remain byte-identical to version 7. TypeScript and whitespace checks passed before publication; the production build is required by the publication workflow.

## Preservation and rollback

Published version 7, commit `abea54c7966745726fb7c03313c2b0f8edc4326d`, contains the previous single transparent Inquiry study. Its texture `public/images/cellular-inquiry-transparent.webp` remains in the repository. To restore that animation alone, restore `components/site/inquiry-cellular-art.tsx`, `lib/cellular-inquiry.ts` and `app/inquiry-animation.css` from that commit. The new atlas and sprite configuration can then be removed if desired. Do not restore or modify the approved hero when reverting Inquiry.

Hero preservation hashes and the earlier technique are retained in `docs/cellular-motion-notes.md`.
