# Анимация героя · Gerontology / ProAge Research & AI

Оригинальный герой сохранён в `components/site/home-hero-original.tsx` для отката. Референс — `public/images/cellular-hero.webp`. Архив `docs/hero-original.zip` сохраняет исходное изображение, разметку, стили, шрифты и логику движения до выделения компонента. С 30 сентября на главной странице используется отдельный `HomeHeroAnimated`: JavaScript-анимация исходной текстуры с WebGL и резервным Canvas 2D. Этот документ сохраняет исходный художественный промпт.

## Готовый промпт для разработки

Создай премиальную кинематографическую анимацию для первого экрана сайта Gerontology — ProAge Research & AI. Возьми текущее изображение героя как обязательный визуальный референс: полупрозрачная органическая клеточная структура, тонкие складчатые мембраны, глубокий почти чёрный зелёный фон, оливковые и приглушённые золотистые блики. Сохрани его композицию, материал, свет и научную атмосферу. Образ должен говорить об изучении старения, сохранении функции и жизни на клеточном уровне. Это концептуальная научная иллюстрация, а не запись эксперимента или доказательство медицинского эффекта.

Преврати статичную структуру в живую микросреду. Мембраны очень медленно и локально деформируются, как при естественном обмене внутри ткани. Крошечные включения перемещаются внутри структуры плавными согласованными потоками. Через полупрозрачные слои проходит мягкий свет: тонкие блики раскрывают глубину, преломление и фактуру. Движения разных слоёв слегка разнесены по фазе. Не двигай изображение целиком вместо внутренней анимации. Выразительность создаётся материалом, глубиной и точностью движения.

Смысл искусственного интеллекта передай через едва заметную последовательность локальных световых откликов внутри уже существующей ткани — метафору внимательного анализа. Не добавляй буквальные интерфейсы, цифры, графики или отдельную нейросеть поверх изображения. Камера зафиксирована; структура не вращается и не путешествует по экрану. Нет орбит, колец, вращающихся шаров или ДНК, сеток, неоновых обводок, лазерных сканеров, вспышек, конфетти, звёздного поля и декоративных частиц перед текстом. Никакой эстетики игрового интро или шаблонного футуристического лендинга.

Сохрани спокойную тёмную область слева для существующего заголовка. В наиболее ярких участках справа свет остаётся мягким, без пересветов. Текст, шрифты, ссылки, навигация, высота блока и расположение контента остаются текущими. Не встраивай текст в анимацию. Главным остаётся сообщение института; движение раскрывается при внимательном взгляде, не отвлекая от чтения.

Сделай один непрерывный бесшовный цикл длиной 12 секунд, без монтажных склеек, заметного возврата, общего пульсирующего масштабирования или скачков экспозиции. Начало и конец должны совпадать по геометрии, свету и движению. Сохрани качество макросъёмки: правдоподобную тонкость мембран, органическую асимметрию, деликатную глубину резкости, отсутствие дрожащих деталей и цифрового шума. На телефонах используй отдельно проверенное кадрирование с сохранением читаемости заголовка.

Перед заменой сохрани оригинальный герой как отдельный работоспособный вариант и не перезаписывай его изображение. Реализуй новый вариант отдельно, чтобы вернуть исходный можно было заменой одного компонента. Исходное изображение должно сразу отображаться как постер и оставаться при ошибке загрузки, отсутствии поддержки анимации или включённом `prefers-reduced-motion`. Останавливай движение, когда герой вне экрана или вкладка скрыта. Для видео: без аудиодорожки, autoplay muted loop playsinline; отдельные оптимизированные WebM/MP4, без скачивания нескольких альтернатив одновременно. Для WebGL: не рисуй новую клетку примитивами; используй исходный растр как художественную основу, с корректной обработкой потери контекста и статичным fallback. Избегай тяжёлого JavaScript, постоянного React-перерендера и layout shift.

Проверь реальный результат на широком экране и телефоне, доступность ссылок с клавиатуры, reduced motion, читаемость текста, переход между последним и первым кадром и статичный fallback. Покажи результат и возможность точного отката. Критерий качества — дорогая, спокойная, физически убедительная научная анимация, которая продолжает стиль существующего изображения.

## Image-to-video prompt

Use the supplied cellular hero image as the strict visual reference and starting frame. Create a 12-second seamless cinematic loop for a premium gerontology and applied AI research institute. Preserve the reference composition, its near-black forest-green negative space on the left, and the translucent folded cellular structure on the right. Preserve the organic silhouette, delicate membranes, olive and muted golden illumination, microscopic texture and restrained depth of field. This is a conceptual scientific visualization, not experimental footage.

Animate the interior of this existing structure, not the whole photograph. Delicate membranes deform almost imperceptibly and independently; tiny inclusions follow slow coherent fluid currents inside the tissue. Subtle refraction and soft subsurface light reveal the layered material. Offset the motion of different layers so the structure feels alive without a single synchronized breathing or scaling effect. Introduce only a few faint local light responses within existing tissue, suggesting careful computational observation; they must remain an abstract metaphor, never a literal interface.

Keep the camera locked and the overall silhouette stable. The object must never rotate. Keep the left 40 percent dark, quiet and visually stationary for HTML typography. Do not place bright activity behind this area. Retain the reference palette and exposure throughout. Movement must be elegant, meditative and visible on close observation, with no sudden acceleration. The loop boundary must be invisible: match geometry, lighting and motion at the beginning and end without a fade to black or a dissolve. Deliver a 4K 16:9 master without text, logos, watermark or audio. Create an independently composed portrait crop for mobile if the landscape composition cannot preserve the text-safe area.

Avoid orbital rings, spinning spheres, rotating DNA, geometric wireframes, neon, holographic UI, data labels, scanner beams, sparks, floating foreground dust, cosmic imagery, hard flashes, gelatinous wobbling, plastic surfaces, repeated patterns, melting forms, flickering edges, camera shake, zoom, cuts, and generic futuristic technology advertising. Quality should come from physically convincing translucent material, precise micro-motion, quiet light and organic depth.

## Исходный вариант и откат

- Базовая опубликованная версия: 4; исходный коммит: `4082450d1372ea6a6d020e5d1c55ede50048bff8`.
- Оригинальный компонент: `components/site/home-hero-original.tsx`. Главная страница сейчас использует `<HomeHeroAnimated />` из отдельного файла `home-hero-animated.tsx`.
- Для отката верни импорт и вызов `<HomeHeroOriginal />` в `app/page.tsx` и удали импорт `hero-animation.css` из `app/layout.tsx`. Общие исходные стили и изображение не изменены.
- Изображение оригинала не перезаписывать. Новые анимационные файлы сохранять под новыми именами.
- `hero-original.zip` содержит контрольные суммы и исходные файлы. Стили в нём включают общие правила сайта; при восстановлении сверять изменения и возвращать относящиеся к герою правила, чтобы не отменить последующие изменения других блоков.
- Архив и промпт сохраняются в исходниках проекта; дополнительные ссылки и переключатели на самом сайте не добавляются.
