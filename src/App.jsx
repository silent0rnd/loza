import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowLeft, ArrowRight, CaretDown, Check, Pause, Play, Sparkle, X } from '@phosphor-icons/react';
import heroImageFallback from './assets/1bb4a3fc59c86dc4.jpg';
import heroImageMobile from './assets/hero-basket-480.webp';
import heroImageDesktop from './assets/hero-basket-800.webp';
import chairImage from './assets/5ef017e4626965f7.jpg';
import galleryBasketImage from './assets/b9b7e62ff7d5633d.jpg';
import galleryDetailImage from './assets/98ae41cb44393170.jpg';
import galleryWorkImage from './assets/eb8c8a80c1529ce9.jpg';
import giftVideo from './assets/91a42c543ffc7b3c.mp4';
import giftPoster from './assets/gift-poster.jpg';
import authorVideo from './assets/author-720.mp4';
import authorPoster from './assets/author-poster.jpg';
import nataliaReviewImage from './assets/review-natalia.webp';
import veronikaReviewImage from './assets/review-veronika.webp';
import benefitsPaperVineBoxImage from './assets/benefits-paper-vine-box.webp';

const gallery = [heroImageDesktop, chairImage, galleryBasketImage, galleryDetailImage, galleryWorkImage];
const benefits = [
  ['Готовое изделие', 'Сплетёте первую работу вместе с Полиной прямо на эфире.'],
  ['Два полезных подарка', 'Инструкции и уроки останутся у вас после мастер-класса.'],
  ['Творческая перезагрузка', 'Два часа спокойной работы руками вместо повседневной суеты.'],
  ['План развития', 'Поймёте, как превратить новое хобби в дополнительный доход.'],
];
const faq = [
  ['Нужно ли что-то приготовить?', 'После регистрации вы получите короткий список доступных материалов.'],
  ['Сколько длится мастер-класс?', 'Около двух часов. Этого хватит, чтобы познакомиться с техникой и сделать первую работу.'],
  ['Я никогда не плела. Мне подойдёт?', 'Да. Полина показывает каждый шаг крупно и объясняет без сложных терминов.'],
  ['Как записаться?', 'Выберите удобное время и нажмите кнопку регистрации. Ссылка придёт после записи.'],
];
const orphanPattern = /(^|[\s«])((?:[аикуосуы]|не|на|до|за|из|от|по|со))\s/giu;

function NoBreak({ children }) {
  return String(children).replace(orphanPattern, '$1$2\u00A0');
}

function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const { style } = document.body;
    const scrollY = window.scrollY;
    const previous = { position: style.position, top: style.top, width: style.width, overflow: style.overflow };
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.width = '100%';
    style.overflow = 'hidden';
    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

function useDeferredSource(rootMargin = '240px 0px') {
  const ref = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, shouldLoad];
}

function DeferredImage({ src, alt, className = '', ...props }) {
  const [ref, shouldLoad] = useDeferredSource();
  return <img ref={ref} className={className} src={shouldLoad ? src : undefined} alt={alt} loading="lazy" decoding="async" {...props} />;
}

function MagneticButton({ children, light = false, showArrow = true, ...props }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });
  return <motion.button {...props} className={`magnetic ${light ? 'light' : ''} ${showArrow ? '' : 'no-arrow'}`} style={reduce ? {} : { x: sx, y: sy }} onMouseMove={event => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * .18);
    y.set((event.clientY - rect.top - rect.height / 2) * .22);
  }} onMouseLeave={() => { x.set(0); y.set(0); }} whileTap={{ scale: .96 }}>{children}{showArrow && <ArrowDownRight weight="bold" />}</motion.button>;
}

function Tilt({ children, className = '' }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(.5);
  const py = useMotionValue(.5);
  const bounds = useRef(null);
  const targetRx = useTransform(py, [0, 1], [7, -7]);
  const targetRy = useTransform(px, [0, 1], [-7, 7]);
  const rx = useSpring(targetRx, { stiffness: 150, damping: 24, mass: .7 });
  const ry = useSpring(targetRy, { stiffness: 150, damping: 24, mass: .7 });
  const setPointerPosition = event => {
    if (!bounds.current) bounds.current = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - bounds.current.left) / bounds.current.width);
    py.set((event.clientY - bounds.current.top) / bounds.current.height);
  };
  return <motion.div className={className} style={reduce ? {} : { rotateX: rx, rotateY: ry, transformPerspective: 900 }} onMouseEnter={event => {
    if (reduce) return;
    bounds.current = event.currentTarget.getBoundingClientRect();
    setPointerPosition(event);
  }} onMouseMove={event => {
    if (!reduce) setPointerPosition(event);
  }} onMouseLeave={() => { bounds.current = null; px.set(.5); py.set(.5); }}>{children}</motion.div>;
}

function Reveal({ children, className = '' }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .75, ease: [.16, 1, .3, 1] }}>{children}</motion.div>;
}

function DeferredVideo({ src, poster, className = '', ...props }) {
  const reduce = useReducedMotion();
  const [containerRef, shouldLoad] = useDeferredSource();
  return <div className={`deferred-video ${className}`} ref={containerRef}>
    {shouldLoad && <img src={poster} alt="" aria-hidden="true" decoding="async" />}
    {shouldLoad && !reduce && <video {...props} muted loop playsInline preload="metadata" onCanPlay={event => event.currentTarget.play().catch(() => {})}>
      <source src={src} type="video/mp4" />
    </video>}
  </div>;
}

function AuthorVideo({ src, poster }) {
  const reduce = useReducedMotion();
  const videoRef = useRef(null);
  const [containerRef, shouldLoad] = useDeferredSource();
  const [hasStarted, setHasStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || loadFailed) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return <div className="author-video" ref={containerRef}>
    {shouldLoad && <>
      <video
        ref={videoRef}
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label="Полина Майорова показывает технику плетения"
        onPlaying={() => { setHasStarted(true); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        onError={() => { setLoadFailed(true); setPlaying(false); }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <img className={`author-video-poster ${hasStarted ? 'is-hidden' : ''}`} src={poster} alt="" aria-hidden="true" decoding="async" />
      <button
        className={`author-video-control ${playing ? 'is-playing' : ''}`}
        type="button"
        onClick={togglePlayback}
        disabled={loadFailed}
        data-initial={!hasStarted}
        aria-label={loadFailed ? 'Видео недоступно' : playing ? 'Поставить видео на паузу' : 'Воспроизвести видео'}
      >
        {playing ? <Pause weight="fill" /> : <Play weight="fill" />}
      </button>
    </>}
  </div>;
}

function Gallery() {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startScrollLeft: 0 });
  const reduce = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const [controls, setControls] = useState({ previous: false, next: true });

  const updateControls = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setControls({ previous: track.scrollLeft > 1, next: track.scrollLeft < maxScroll - 1 });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    updateControls();
    const observer = 'ResizeObserver' in window ? new ResizeObserver(updateControls) : null;
    observer?.observe(track);
    window.addEventListener('resize', updateControls);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateControls);
    };
  }, []);

  const scrollGallery = direction => {
    const track = trackRef.current;
    const card = track?.querySelector('figure');
    if (!track || !card) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: direction * (card.clientWidth + gap), behavior: reduce ? 'auto' : 'smooth' });
  };

  const finishDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    updateControls();
    window.requestAnimationFrame(() => { drag.current.moved = false; });
  };

  return <section className="gallery">
    <div className="marquee"><div>ПЛЕТЕНИЕ УСПОКАИВАЕТ • РУКИ ПОМНЯТ • КРАСОТА ОСТАЁТСЯ • ПЛЕТЕНИЕ УСПОКАИВАЕТ • РУКИ ПОМНЯТ • КРАСОТА ОСТАЁТСЯ •</div></div>
    <div className="gallery-header">
      <p className="gallery-hint">Работы учениц</p>
      <div className="gallery-controls" aria-label="Управление галереей">
        <button type="button" className="gallery-control" onClick={() => scrollGallery(-1)} disabled={!controls.previous} aria-label="Предыдущая работа"><ArrowLeft weight="bold" aria-hidden="true" /></button>
        <button type="button" className="gallery-control" onClick={() => scrollGallery(1)} disabled={!controls.next} aria-label="Следующая работа"><ArrowRight weight="bold" aria-hidden="true" /></button>
      </div>
    </div>
    <div ref={trackRef} className={`gallery-track ${dragging ? 'is-dragging' : ''}`} aria-label="Работы учениц" onScroll={updateControls} onPointerDown={event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      const track = event.currentTarget;
      track.setPointerCapture(event.pointerId);
      drag.current = { active: true, moved: false, startX: event.clientX, startScrollLeft: track.scrollLeft };
      setDragging(true);
    }} onPointerMove={event => {
      if (!drag.current.active) return;
      const distance = event.clientX - drag.current.startX;
      if (Math.abs(distance) > 4) drag.current.moved = true;
      event.currentTarget.scrollLeft = drag.current.startScrollLeft - distance;
      event.preventDefault();
    }} onPointerUp={finishDrag} onPointerCancel={finishDrag} onClickCapture={event => {
      if (drag.current.moved) {
        event.preventDefault();
        event.stopPropagation();
      }
    }}>{gallery.map((image, index) => <motion.figure key={image} whileHover={{ scale: 1.035, rotate: index % 2 ? 1.5 : -1.5 }}><DeferredImage src={image} alt="Работа ученицы школы плетения" /></motion.figure>)}</div>
  </section>;
}

function Signup({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  useScrollLock(open);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = event => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
  const keepFocusInside = event => {
    if (event.key !== 'Tab') return;
    const focusable = [...event.currentTarget.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const openDialog = (event, time) => {
    triggerRef.current = event.currentTarget;
    setSelectedTime(time);
    setOpen(true);
  };
  return <>
    <div className={`signup-actions ${compact ? 'compact' : ''}`}>
      <button onClick={event => openDialog(event, '11:00')}><span>11:00</span> Записаться</button>
      <button onClick={event => openDialog(event, '19:00')}><span>19:00</span> Записаться</button>
    </div>
    {open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={close}>
      <motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="signup-title" initial={{ scale: .9, y: 24 }} animate={{ scale: 1, y: 0 }} onClick={event => event.stopPropagation()} onKeyDown={keepFocusInside}>
        <button className="modal-close" type="button" ref={closeRef} onClick={close} aria-label="Закрыть"><X /></button>
        <span className="kicker">11 августа 2026</span><h3 id="signup-title">Ваше место почти готово</h3>
        <p><NoBreak>{`Вы выбрали ${selectedTime}. Оставьте контакты и получите материалы для подготовки.`}</NoBreak></p>
        <label>Имя<input type="text" autoComplete="name" placeholder="Как к вам обращаться" /></label>
        <label>Телефон<input type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></label>
        <MagneticButton type="button">Забронировать</MagneticButton>
      </motion.div>
    </motion.div>}
  </>;
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const menuTriggerRef = useRef(null);
  const menuCloseRef = useRef(null);
  useScrollLock(menu);
  const closeMenu = () => {
    setMenu(false);
    requestAnimationFrame(() => menuTriggerRef.current?.focus());
  };
  useEffect(() => {
    if (!menu) return undefined;
    const onKeyDown = event => { if (event.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => menuCloseRef.current?.focus());
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menu]);
  const navigateFromMenu = (event, target) => {
    event.preventDefault();
    setMenu(false);
    window.setTimeout(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' }), 0);
  };
  const navItems = [['Что узнаете', '#program'], ['Об авторе', '#author'], ['Отзывы', '#reviews']];

  return <main>
    <header className="nav"><a className="logo" href="#top">плету<br />лозу</a>
      <nav>{navItems.map(([label, href]) => <a key={href} href={href}><NoBreak>{label}</NoBreak></a>)}</nav>
      <button className="nav-cta" onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}>Записаться</button>
      <button className="menu" type="button" ref={menuTriggerRef} onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="mobile-menu"><span>меню</span></button>
    </header>
    {menu && <nav className="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация">
      <div className="mobile-menu-head"><a className="logo" href="#top" onClick={closeMenu}>плету<br />лозу</a><button className="mobile-menu-close" type="button" ref={menuCloseRef} onClick={closeMenu} aria-label="Закрыть меню"><X /></button></div>
      {navItems.map(([label, href]) => <a key={href} href={href} onClick={event => navigateFromMenu(event, href)}><NoBreak>{label}</NoBreak></a>)}
    </nav>}
    <section className="hero" id="top"><div className="hero-inner"><div className="hero-copy"><motion.span className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><NoBreak>Бесплатный мастер-класс</NoBreak></motion.span><motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>Плетите <em>красоту</em></motion.h1><motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}><NoBreak>Создайте декор как из Pinterest своими руками всего за 2 часа. Подходит даже новичкам.</NoBreak></motion.p><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><MagneticButton showArrow={false} onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}>Выбрать время</MagneticButton></motion.div></div><div className="hero-media"><motion.div className="sun" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}><Sparkle weight="fill" /></motion.div><Tilt className="hero-photo"><picture><source media="(max-width: 600px)" srcSet={heroImageMobile} type="image/webp" /><source srcSet={heroImageDesktop} type="image/webp" /><img src={heroImageFallback} alt="Плетёная корзина ручной работы" fetchPriority="high" decoding="async" /></picture><div className="price"><small>участие</small><b>0 <i>руб.</i></b><s>1990 руб.</s></div></Tilt><motion.div className="orbit" aria-hidden="true" animate={reduceMotion ? {} : { rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}><div className="orbit-ring" /><span>БУМАЖНАЯ ЛОЗА •<br />СВОИМИ РУКАМИ •</span></motion.div></div></div></section>
    <section className="date-band" id="register"><div><span>Ближайший эфир</span><strong><span>11</span><span>августа</span><span>2026</span></strong></div><Signup compact /></section>
    <section className="gifts" id="program"><Reveal className="section-head"><span className="kicker">Подарки за регистрацию</span><h2>Начните плести<br />ещё до эфира</h2><p><NoBreak>Сразу после регистрации откроем материалы, которые помогут подготовиться и почувствовать технику руками.</NoBreak></p></Reveal><div className="gift-grid"><Tilt className="gift gift-one"><DeferredVideo className="gift-video" src={giftVideo} poster={giftPoster} /><span>Видео-урок</span><h3>Плетёная корзина и макраме</h3><Play weight="fill" aria-hidden="true" /></Tilt><Tilt className="gift gift-two"><span>Практическая инструкция</span><h3>Изготовление и обработка бумажной лозы</h3><DeferredImage src={chairImage} alt="Кресло из бумажной лозы" /><Check weight="bold" /></Tilt></div></section>
    <section className="benefits">
      <div className="benefits-intro">
        <Reveal className="benefits-copy"><span className="kicker">Что вы получите</span><h2><NoBreak>Результат, который можно потрогать</NoBreak></h2></Reveal>
        <Reveal className="benefits-media"><DeferredImage src={benefitsPaperVineBoxImage} alt="Плетёная шкатулка из бумажной лозы ручной работы" /></Reveal>
      </div>
      <div className="benefit-list">{benefits.map((benefit, index) => <article key={benefit[0]}><span>0{index + 1}</span><h3><NoBreak>{benefit[0]}</NoBreak></h3><p><NoBreak>{benefit[1]}</NoBreak></p></article>)}</div>
    </section>
    <Gallery />
    <section className="author" id="author"><div className="author-inner"><Reveal className="author-copy"><span className="kicker">Полина Майорова</span><h2><NoBreak>Научу видеть материал и не бояться первой петли</NoBreak></h2><div className="author-media"><AuthorVideo src={authorVideo} poster={authorPoster} /></div><p><NoBreak>Автор школы «Плету лозу». Полина объясняет технику спокойно, точно и с уважением к вашему темпу.</NoBreak></p><div className="facts"><div><b>с нуля до первой работы</b></div><div><b>Две живые практики</b></div></div><MagneticButton light showArrow={false}>Познакомиться</MagneticButton></Reveal></div></section>
    <section className="reviews" id="reviews"><Reveal><span className="kicker">Отзывы учениц</span><h2>«Теперь я могу плести сама»</h2></Reveal><div className="review-grid"><article className="review-card"><DeferredImage className="review-portrait" src={nataliaReviewImage} alt="Иллюстративный портрет Наталии" /><div className="review-copy"><p><NoBreak>«Впервые встречаю такой ответственный подход и настолько качественное обучение. Настоящая школа плетения.»</NoBreak></p><span>Наталия</span></div></article><article className="review-card"><DeferredImage className="review-portrait" src={veronikaReviewImage} alt="Иллюстративный портрет Вероники" /><div className="review-copy"><p><NoBreak>«Корзинами я бредила лет пятнадцать. Теперь дарю свои работы близким и не верю, что сделала их сама.»</NoBreak></p><span>Вероника</span></div></article></div></section>
    <section className="faq"><Reveal><span className="kicker">Вопросы</span><h2><NoBreak>Всё просто. Даже если вы начинаете с нуля</NoBreak></h2></Reveal><div className="accordion">{faq.map(([question, answer]) => <details key={question}><summary><NoBreak>{question}</NoBreak><CaretDown /></summary><p><NoBreak>{answer}</NoBreak></p></details>)}</div></section>
    <section className="final"><div className="final-bg"><DeferredImage src={chairImage} alt="Интерьер с плетёным креслом" /></div><Reveal className="final-copy"><span className="kicker">Давайте творить вместе</span><h2><NoBreak>Ваши руки уже умеют больше, чем вы думаете</NoBreak></h2><p><NoBreak>Выберите удобное время и приходите на бесплатный мастер-класс 11 августа.</NoBreak></p><Signup /></Reveal></section>
    <footer><a className="logo" href="#top">плету<br />лозу</a><p>ИП Майорова Полина Вадимовна<br />ИНН 771472141040</p><div><a href="https://online.pletulozu.ru/dogovor_oferta">Договор оферты</a><a href="https://online.pletulozu.ru/politika">Политика данных</a></div><div className="site-author">Сайт разработан <a href="https://naklikay.ru/" target="_blank" rel="noopener">Максимом Мирошниковым</a></div><span>© 2026</span></footer>
  </main>;
}
