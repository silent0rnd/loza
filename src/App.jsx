import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, CaretDown, Check, Play, Sparkle, X } from '@phosphor-icons/react';
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
import reviewImage from './assets/b55edb0124837a2e.webp';

const gallery = [heroImageDesktop, chairImage, galleryBasketImage, galleryDetailImage, galleryWorkImage];
const benefits = [
  ['Готовое изделие', 'Сплетёте первую работу вместе с Полиной прямо на эфире.'],
  ['2 полезных подарка', 'Инструкции и уроки останутся у вас после мастер-класса.'],
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

function MagneticButton({ children, light = false, ...props }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });
  return <motion.button {...props} className={`magnetic ${light ? 'light' : ''}`} style={reduce ? {} : { x: sx, y: sy }} onMouseMove={event => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * .18);
    y.set((event.clientY - rect.top - rect.height / 2) * .22);
  }} onMouseLeave={() => { x.set(0); y.set(0); }} whileTap={{ scale: .96 }}>{children}<ArrowDownRight weight="bold" /></motion.button>;
}

function Tilt({ children, className = '' }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(.5);
  const py = useMotionValue(.5);
  const rx = useTransform(py, [0, 1], [7, -7]);
  const ry = useTransform(px, [0, 1], [-7, 7]);
  return <motion.div className={className} style={reduce ? {} : { rotateX: rx, rotateY: ry, transformPerspective: 900 }} onMouseMove={event => {
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }} onMouseLeave={() => { px.set(.5); py.set(.5); }}>{children}</motion.div>;
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
  const navItems = [['Что узнаете', '#program'], ['Для кого', '#for-whom'], ['Об авторе', '#author'], ['Отзывы', '#reviews']];

  return <main>
    <header className="nav"><a className="logo" href="#top">плету<br />лозу</a>
      <nav>{navItems.map(([label, href]) => <a key={href} href={href}><NoBreak>{label}</NoBreak></a>)}</nav>
      <button className="nav-cta" onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}>Записаться <ArrowUpRight /></button>
      <button className="menu" type="button" ref={menuTriggerRef} onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="mobile-menu"><span>меню</span></button>
    </header>
    {menu && <nav className="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация">
      <div className="mobile-menu-head"><a className="logo" href="#top" onClick={closeMenu}>плету<br />лозу</a><button className="mobile-menu-close" type="button" ref={menuCloseRef} onClick={closeMenu} aria-label="Закрыть меню"><X /></button></div>
      {navItems.map(([label, href]) => <a key={href} href={href} onClick={event => navigateFromMenu(event, href)}><NoBreak>{label}</NoBreak></a>)}
    </nav>}
    <section className="hero" id="top"><div className="hero-inner"><div className="hero-copy"><motion.span className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><NoBreak>Бесплатный мастер-класс</NoBreak></motion.span><motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>Плетите <em>красоту</em></motion.h1><motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}><NoBreak>Создайте декор как из Pinterest своими руками всего за 2 часа. Подходит даже новичкам.</NoBreak></motion.p><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><MagneticButton onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}>Выбрать время</MagneticButton></motion.div></div><div className="hero-media"><motion.div className="sun" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}><Sparkle weight="fill" /></motion.div><Tilt className="hero-photo"><picture><source media="(max-width: 600px)" srcSet={heroImageMobile} type="image/webp" /><source srcSet={heroImageDesktop} type="image/webp" /><img src={heroImageFallback} alt="Плетёная корзина ручной работы" fetchPriority="high" decoding="async" /></picture><div className="price"><small>участие</small><b>0 <i>руб.</i></b><s>1990 руб.</s></div></Tilt><div className="orbit" aria-hidden="true"><motion.div className="orbit-ring" animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} /><span>БУМАЖНАЯ ЛОЗА •<br />СВОИМИ РУКАМИ •</span></div></div></div></section>
    <section className="date-band" id="register"><div><span>Ближайший эфир</span><strong><span>11</span><span>августа</span><span>2026</span></strong></div><Signup compact /></section>
    <section className="gifts" id="program"><Reveal className="section-head"><span className="kicker">Подарки за регистрацию</span><h2>Начните плести<br />ещё до эфира</h2><p><NoBreak>Сразу после регистрации откроем материалы, которые помогут подготовиться и почувствовать технику руками.</NoBreak></p></Reveal><div className="gift-grid"><Tilt className="gift gift-one"><DeferredVideo className="gift-video" src={giftVideo} poster={giftPoster} /><span>Видео-урок</span><h3>Плетёная корзина и макраме</h3><Play weight="fill" aria-hidden="true" /></Tilt><Tilt className="gift gift-two"><span>Практическая инструкция</span><h3>Изготовление и обработка бумажной лозы</h3><DeferredImage src={chairImage} alt="Кресло из бумажной лозы" /><Check weight="bold" /></Tilt></div></section>
    <section className="audience" id="for-whom"><Reveal><span className="kicker">Для кого</span><h2><NoBreak>Вам подойдёт, если хочется начать с первого шага</NoBreak></h2><p><NoBreak>Для новичков, любителей ручной работы и тех, кто хочет спокойно попробовать плетение без сложной подготовки.</NoBreak></p></Reveal></section>
    <section className="benefits"><Reveal><span className="kicker">Что вы получите</span><h2><NoBreak>Результат, который можно потрогать</NoBreak></h2></Reveal><div className="benefit-list">{benefits.map((benefit, index) => <article key={benefit[0]}><span>0{index + 1}</span><h3><NoBreak>{benefit[0]}</NoBreak></h3><p><NoBreak>{benefit[1]}</NoBreak></p></article>)}</div></section>
    <section className="gallery"><div className="marquee"><div>ПЛЕТЕНИЕ УСПОКАИВАЕТ • РУКИ ПОМНЯТ • КРАСОТА ОСТАЁТСЯ • ПЛЕТЕНИЕ УСПОКАИВАЕТ • РУКИ ПОМНЯТ • КРАСОТА ОСТАЁТСЯ •</div></div><p className="gallery-hint">Листайте <span aria-hidden="true">→</span></p><div className="gallery-track">{gallery.map((image, index) => <motion.figure key={image} whileHover={{ scale: 1.035, rotate: index % 2 ? 1.5 : -1.5 }}><DeferredImage src={image} alt="Работа ученицы школы плетения" /></motion.figure>)}</div></section>
    <section className="author" id="author"><div className="author-media"><DeferredVideo src={authorVideo} poster={authorPoster} /></div><Reveal className="author-copy"><span className="kicker">Полина Майорова</span><h2><NoBreak>Научу видеть материал и не бояться первой петли</NoBreak></h2><p><NoBreak>Автор школы «Плету лозу». Полина объясняет технику спокойно, точно и с уважением к вашему темпу.</NoBreak></p><div className="facts"><div><b>с нуля</b><span>до первой работы</span></div><div><b>2 часа</b><span>живой практики</span></div></div><MagneticButton light>Познакомиться</MagneticButton></Reveal></section>
    <section className="reviews" id="reviews"><Reveal><span className="kicker">Отзывы учениц</span><h2>«Теперь я могу плести сама»</h2></Reveal><div className="review-grid"><article><p><NoBreak>«Впервые встречаю такой ответственный подход и настолько качественное обучение. Настоящая школа плетения.»</NoBreak></p><span>Наталия</span></article><article><p><NoBreak>«Корзинами я бредила лет пятнадцать. Теперь дарю свои работы близким и не верю, что сделала их сама.»</NoBreak></p><span>Вероника</span></article><article className="review-photo"><DeferredImage src={reviewImage} alt="Плетёное кресло ученицы" /></article></div></section>
    <section className="faq"><Reveal><span className="kicker">Вопросы</span><h2><NoBreak>Всё просто. Даже если вы начинаете с нуля</NoBreak></h2></Reveal><div className="accordion">{faq.map(([question, answer]) => <details key={question}><summary><NoBreak>{question}</NoBreak><CaretDown /></summary><p><NoBreak>{answer}</NoBreak></p></details>)}</div></section>
    <section className="final"><div className="final-bg"><DeferredImage src={chairImage} alt="Интерьер с плетёным креслом" /></div><Reveal className="final-copy"><span className="kicker">Давайте творить вместе</span><h2><NoBreak>Ваши руки уже умеют больше, чем вы думаете</NoBreak></h2><p><NoBreak>Выберите удобное время и приходите на бесплатный мастер-класс 11 августа.</NoBreak></p><Signup /></Reveal></section>
    <footer><a className="logo" href="#top">плету<br />лозу</a><p>ИП Майорова Полина Вадимовна<br />ИНН 771472141040</p><div><a href="https://online.pletulozu.ru/dogovor_oferta">Договор оферты</a><a href="https://online.pletulozu.ru/politika">Политика данных</a></div><div className="site-author">Сайт разработан <a href="https://naklikay.ru/" target="_blank" rel="noopener">Максимом Мирошниковым</a></div><span>© 2026</span></footer>
  </main>;
}
