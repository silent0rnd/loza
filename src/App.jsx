import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDownRight, ArrowLeft, ArrowRight, CaretDown, Check, Pause, Play, Sparkle, X } from '@phosphor-icons/react';
import heroImageFallback from './assets/1bb4a3fc59c86dc4.jpg';
import heroImageMobile from './assets/hero-basket-480.webp';
import heroImageDesktop from './assets/hero-basket-800.webp';
import chairImage480 from './assets/chair-480.webp';
import chairImage800 from './assets/chair-800.webp';
import chairImage1200 from './assets/chair-1200.webp';
import galleryBasketImage480 from './assets/gallery-basket-480.webp';
import galleryBasketImage800 from './assets/gallery-basket-800.webp';
import galleryBasketImage1177 from './assets/gallery-basket-1177.webp';
import galleryDetailImage480 from './assets/gallery-detail-480.webp';
import galleryDetailImage800 from './assets/gallery-detail-800.webp';
import galleryDetailImage1204 from './assets/gallery-detail-1204.webp';
import galleryWorkImage480 from './assets/gallery-work-480.webp';
import galleryWorkImage839 from './assets/gallery-work-839.webp';
import giftVideo from './assets/91a42c543ffc7b3c.mp4';
import giftPoster from './assets/gift-poster.jpg';
import authorVideo from './assets/author-720.mp4';
import authorPoster from './assets/author-poster.jpg';
import nataliaReviewImage from './assets/review-natalia.webp';
import nataliaReviewImage480 from './assets/review-natalia-480.webp';
import nataliaReviewImage900 from './assets/review-natalia-900.webp';
import veronikaReviewImage from './assets/review-veronika.webp';
import veronikaReviewImage480 from './assets/review-veronika-480.webp';
import veronikaReviewImage900 from './assets/review-veronika-900.webp';
import benefitsPaperVineBoxImage from './assets/benefits-paper-vine-box.webp';
import benefitsPaperVineBoxImage640 from './assets/benefits-paper-vine-box-640.webp';
import benefitsPaperVineBoxImage1024 from './assets/benefits-paper-vine-box-1024.webp';

const chairMedia = {
  src: chairImage1200,
  srcSet: `${chairImage480} 480w, ${chairImage800} 800w, ${chairImage1200} 1200w`,
  width: 1200,
  height: 1600,
};
const benefitsMedia = {
  src: benefitsPaperVineBoxImage,
  srcSet: `${benefitsPaperVineBoxImage640} 640w, ${benefitsPaperVineBoxImage1024} 1024w, ${benefitsPaperVineBoxImage} 1536w`,
  width: 1536,
  height: 1024,
};
const nataliaReviewMedia = {
  src: nataliaReviewImage,
  srcSet: `${nataliaReviewImage480} 480w, ${nataliaReviewImage900} 900w, ${nataliaReviewImage} 1448w`,
  sizes: '(max-width: 900px) 100vw, 50vw',
  width: 1448,
  height: 1086,
};
const veronikaReviewMedia = {
  src: veronikaReviewImage,
  srcSet: `${veronikaReviewImage480} 480w, ${veronikaReviewImage900} 900w, ${veronikaReviewImage} 1448w`,
  sizes: '(max-width: 900px) 100vw, 50vw',
  width: 1448,
  height: 1086,
};
const gallery = [
  { src: heroImageDesktop, srcSet: `${heroImageMobile} 480w, ${heroImageDesktop} 800w`, width: 800, height: 1066 },
  chairMedia,
  { src: galleryBasketImage1177, srcSet: `${galleryBasketImage480} 480w, ${galleryBasketImage800} 800w, ${galleryBasketImage1177} 1177w`, width: 1177, height: 1600 },
  { src: galleryDetailImage1204, srcSet: `${galleryDetailImage480} 480w, ${galleryDetailImage800} 800w, ${galleryDetailImage1204} 1204w`, width: 1204, height: 1600 },
  { src: galleryWorkImage839, srcSet: `${galleryWorkImage480} 480w, ${galleryWorkImage839} 839w`, width: 839, height: 1280 },
];
const videoPreloadRequests = new Map();

function preloadVideo(src) {
  if (!videoPreloadRequests.has(src)) {
    const request = fetch(src, { cache: 'force-cache', priority: 'low' }).catch(() => null);
    videoPreloadRequests.set(src, request);
  }
}
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

function MediaImage({ src, srcSet, sizes, alt, className = '', width, height, ...props }) {
  return <img className={className} src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height} loading="eager" fetchPriority="low" decoding="async" {...props} />;
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

function BenefitsMedia({ media, alt }) {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);
  const bounds = useRef(null);
  const pointerActive = useRef(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hoverScale = useMotionValue(1);
  const x = useSpring(pointerX, { stiffness: 150, damping: 24, mass: .7 });
  const y = useSpring(pointerY, { stiffness: 150, damping: 24, mass: .7 });
  const scale = useSpring(hoverScale, { stiffness: 170, damping: 24, mass: .7 });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const parallaxTarget = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const parallaxY = useSpring(parallaxTarget, { stiffness: 90, damping: 24, mass: .35 });
  const setPointerPosition = event => {
    pointerActive.current = true;
    if (!bounds.current) bounds.current = event.currentTarget.getBoundingClientRect();
    const relativeX = Math.min(1, Math.max(0, (event.clientX - bounds.current.left) / bounds.current.width));
    const relativeY = Math.min(1, Math.max(0, (event.clientY - bounds.current.top) / bounds.current.height));
    pointerX.set((relativeX - .5) * 24);
    pointerY.set((relativeY - .5) * 16);
  };
  const resetPointer = () => {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    bounds.current = null;
    pointerX.set(0);
    pointerY.set(0);
    hoverScale.set(1);
  };
  useEffect(() => {
    if (reduce) {
      resetPointer();
      return undefined;
    }
    const resetWhenOutside = event => {
      if (!pointerActive.current) return;
      const element = containerRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) resetPointer();
    };
    window.addEventListener('mousemove', resetWhenOutside);
    return () => window.removeEventListener('mousemove', resetWhenOutside);
  }, [reduce, pointerX, pointerY, hoverScale]);
  return <div ref={containerRef} className="benefits-media" onMouseEnter={event => {
    if (reduce) return;
    bounds.current = event.currentTarget.getBoundingClientRect();
    hoverScale.set(1.04);
    setPointerPosition(event);
  }} onMouseMove={event => {
    if (reduce) return;
    hoverScale.set(1.04);
    setPointerPosition(event);
  }} onMouseOut={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) resetPointer();
  }} onMouseLeave={resetPointer}>
    <motion.div className="benefits-media-parallax" style={reduce ? undefined : { y: parallaxY }}>
      <motion.div className="benefits-media-hover" style={reduce ? undefined : { x, y, scale }}>
        <MediaImage {...media} sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw" alt={alt} />
      </motion.div>
    </motion.div>
  </div>;
}

function useVideoPlayback(reduce, src, rootMargin = '600px 0px') {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return undefined;
    preloadVideo(src);
    video.load();
    if (reduce) {
      video.pause();
      return undefined;
    }
    if (!('IntersectionObserver' in window)) {
      video.play().catch(() => {});
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { rootMargin });
    observer.observe(container);
    return () => observer.disconnect();
  }, [reduce, rootMargin, src]);

  return [containerRef, videoRef];
}

function PreloadedVideo({ src, poster, posterWidth, posterHeight, className = '', ...props }) {
  const reduce = useReducedMotion();
  const [containerRef, videoRef] = useVideoPlayback(reduce, src);
  return <div className={`deferred-video ${className}`} ref={containerRef}>
    <img src={poster} alt="" width={posterWidth} height={posterHeight} aria-hidden="true" loading="eager" fetchPriority="low" decoding="async" />
    <video ref={videoRef} {...props} muted loop playsInline preload="auto" poster={poster} width={posterWidth} height={posterHeight}>
      <source src={src} type="video/mp4" />
    </video>
  </div>;
}

function AuthorVideo({ src, poster }) {
  const reduce = useReducedMotion();
  const [containerRef, videoRef] = useVideoPlayback(reduce, src);
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

  const markStarted = event => {
    const video = event.currentTarget;
    setPlaying(true);
    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(() => setHasStarted(true));
    } else {
      setHasStarted(true);
    }
  };

  return <div className="author-video" ref={containerRef}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        width="406"
        height="720"
        aria-label="Полина Майорова показывает технику плетения"
        onPlaying={markStarted}
        onPause={() => setPlaying(false)}
        onError={() => { setLoadFailed(true); setPlaying(false); }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <img className={`author-video-poster ${hasStarted ? 'is-hidden' : ''}`} src={poster} alt="" width="406" height="720" aria-hidden="true" loading="eager" fetchPriority="low" decoding="async" />
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
    }}>{gallery.map((image, index) => <motion.figure key={image.src} whileHover={{ scale: 1.035, rotate: index % 2 ? 1.5 : -1.5 }}><MediaImage {...image} sizes="(max-width: 600px) 72vw, 380px" alt="Работа ученицы школы плетения" /></motion.figure>)}</div>
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
    <section className="hero" id="top"><div className="hero-inner"><div className="hero-copy"><motion.span className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><NoBreak>Бесплатный мастер-класс</NoBreak></motion.span><motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>Плетите <em>красоту</em></motion.h1><motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}><NoBreak>Создайте декор как из Pinterest своими руками всего за 2 часа. Подходит даже новичкам.</NoBreak></motion.p><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}><MagneticButton showArrow={false} onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}>Выбрать время</MagneticButton></motion.div></div><div className="hero-media"><motion.div className="sun" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}><Sparkle weight="fill" /></motion.div><Tilt className="hero-photo"><picture><source media="(max-width: 600px)" srcSet={heroImageMobile} type="image/webp" /><source srcSet={heroImageDesktop} type="image/webp" /><img src={heroImageFallback} alt="Плетёная корзина ручной работы" width="800" height="1066" loading="eager" fetchPriority="high" decoding="async" /></picture><div className="price"><small>участие</small><b>0 <i>руб.</i></b><s>1990 руб.</s></div></Tilt><motion.div className="orbit" aria-hidden="true" animate={reduceMotion ? {} : { rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}><div className="orbit-ring" /><span>БУМАЖНАЯ ЛОЗА •<br />СВОИМИ РУКАМИ •</span></motion.div></div></div></section>
    <section className="date-band" id="register"><div><span>Ближайший эфир</span><strong><span>11</span><span>августа</span><span>2026</span></strong></div><Signup compact /></section>
    <section className="gifts" id="program"><Reveal className="section-head"><span className="kicker">Подарки за регистрацию</span><h2>Начните плести<br />ещё до эфира</h2><p><NoBreak>Сразу после регистрации откроем материалы, которые помогут подготовиться и почувствовать технику руками.</NoBreak></p></Reveal><div className="gift-grid"><Tilt className="gift gift-one"><PreloadedVideo className="gift-video" src={giftVideo} poster={giftPoster} posterWidth={394} posterHeight={720} /><span>Видео-урок</span><h3>Плетёная корзина и макраме</h3><Play weight="fill" aria-hidden="true" /></Tilt><Tilt className="gift gift-two"><span>Практическая инструкция</span><h3>Изготовление и обработка бумажной лозы</h3><MediaImage {...chairMedia} sizes="(max-width: 900px) 64vw, 32vw" alt="Кресло из бумажной лозы" /><Check weight="bold" /></Tilt></div></section>
    <section className="benefits">
      <div className="benefits-intro">
        <Reveal className="benefits-copy"><span className="kicker">Что вы получите</span><h2><NoBreak>Результат, который можно потрогать</NoBreak></h2></Reveal>
        <Reveal className="benefits-media-reveal"><BenefitsMedia media={benefitsMedia} alt="Плетёная шкатулка из бумажной лозы ручной работы" /></Reveal>
      </div>
      <div className="benefit-list">{benefits.map((benefit, index) => <article key={benefit[0]}><span>0{index + 1}</span><h3><NoBreak>{benefit[0]}</NoBreak></h3><p><NoBreak>{benefit[1]}</NoBreak></p></article>)}</div>
    </section>
    <Gallery />
    <section className="author" id="author"><div className="author-inner"><Reveal className="author-copy"><span className="kicker">Полина Майорова</span><h2><NoBreak>Научу видеть материал и не бояться первой петли</NoBreak></h2><div className="author-media"><AuthorVideo src={authorVideo} poster={authorPoster} /></div><p><NoBreak>Автор школы «Плету лозу». Полина объясняет технику спокойно, точно и с уважением к вашему темпу.</NoBreak></p><div className="facts"><div><b>С нуля до первой работы</b></div><div><b>Две живые практики</b></div></div><MagneticButton light showArrow={false}>Познакомиться</MagneticButton></Reveal></div></section>
    <section className="reviews" id="reviews"><Reveal><span className="kicker">Отзывы учениц</span><h2>«Теперь я могу плести сама»</h2></Reveal><div className="review-grid"><article className="review-card"><MediaImage {...nataliaReviewMedia} className="review-portrait" alt="Иллюстративный портрет Наталии" /><div className="review-copy"><p><NoBreak>«Впервые встречаю такой ответственный подход и настолько качественное обучение. Настоящая школа плетения.»</NoBreak></p><span>Наталия</span></div></article><article className="review-card"><MediaImage {...veronikaReviewMedia} className="review-portrait" alt="Иллюстративный портрет Вероники" /><div className="review-copy"><p><NoBreak>«Корзинами я бредила лет пятнадцать. Теперь дарю свои работы близким и не верю, что сделала их сама.»</NoBreak></p><span>Вероника</span></div></article></div></section>
    <section className="faq"><Reveal><span className="kicker">Вопросы</span><h2><NoBreak>Всё просто. Даже если вы начинаете с нуля</NoBreak></h2></Reveal><div className="accordion">{faq.map(([question, answer]) => <details key={question}><summary><NoBreak>{question}</NoBreak><CaretDown /></summary><p><NoBreak>{answer}</NoBreak></p></details>)}</div></section>
    <section className="final"><div className="final-bg"><MediaImage {...chairMedia} sizes="100vw" alt="Интерьер с плетёным креслом" /></div><Reveal className="final-copy"><span className="kicker">Давайте творить вместе</span><h2><NoBreak>Ваши руки уже умеют больше, чем вы думаете</NoBreak></h2><p><NoBreak>Выберите удобное время и приходите на бесплатный мастер-класс 11 августа.</NoBreak></p><Signup /></Reveal></section>
    <footer><a className="logo" href="#top">плету<br />лозу</a><p>ИП Майорова Полина Вадимовна<br />ИНН 771472141040</p><div><a href="https://online.pletulozu.ru/dogovor_oferta">Договор оферты</a><a href="https://online.pletulozu.ru/politika">Политика данных</a></div><div className="site-author">Сайт разработан <a href="https://naklikay.ru/" target="_blank" rel="noopener">Максимом Мирошниковым</a></div><span>© 2026</span></footer>
  </main>;
}
