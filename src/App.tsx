import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';

const A = '/assets/';

const promos = [
  { label: 'THE (KODAK) MOMENT', sub: 'THE (HYEYOON) MOMENT', title: <>KODAK과 김혜윤의<br />굿 콜라보</>, body: <>평범한 하루를 KODAK으로 기록되는 특별함<br />전속 모델 김혜윤과 함께</>, image: 'promo-1.svg' },
  { label: '2025 KODAK 공모전', sub: '[Share your KODAK moment]', title: <>한국의 순간을 담아<br />입어보다</>, body: <>코닥의 시선으로 찰나의 순간을 담은 한국을<br />공모전을 통해 지금 만나보세요</>, image: 'promo-2.svg' },
  { label: 'Summer Edition', sub: '축제같은 여름의 시작', title: <>무더운 여름<br />스타일도 놓치지 않게</>, body: <>가볍지만 스타일은 더해 어디서든 시원하고 멋지게<br />KODAK의 추천 제품을 확인해보세요</>, image: 'promo-3.svg' },
];

const weekly = [
  ['weekly-1.png', '브리즈팝 에어로쿨 빅그래픽 반팔 티셔츠'],
  ['weekly-2.png', '브리즈팝 에어로쿨 빅그래픽 반팔 티셔츠'],
  ['weekly-3.png', '브리즈팝 에어로쿨 빅그래픽 반팔 티셔츠'],
];

const products = [
  ['product-1.png', '브이넥 니트 맨투맨'],
  ['product-2.png', '그래픽 후드 티셔츠'],
  ['product-3.png', '슬리브 프린트 긴팔 티셔츠'],
  ['product-4.png', '디스크 와펜 워싱 볼캡'],
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: .12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Logo() {
  return <a className="logo" href="#top" aria-label="Kodak Apparel 홈"><img src={`${A}logo.png`} alt="Kodak" /></a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const nav = ['NEW', 'MEN', 'WOMEN', 'KIDS', 'SHOES'];
  return <header className="site-header">
    <nav aria-label="주요 메뉴" className="header-inner">
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu">{open ? <X /> : <Menu />}<span className="sr-only">메뉴</span></button>
      <div className={`nav-links ${open ? 'open' : ''}`} id="mobile-menu">
        {nav.map((item, i) => <a key={item} href={`#${i ? 'weekly' : 'new'}`} onClick={() => setOpen(false)}>{item}</a>)}
      </div>
      <Logo />
      <div className="account-links"><button>LOG IN</button><button>SIGN UP</button></div>
    </nav>
  </header>;
}

function Hero() {
  return <section id="top" className="hero">
    <Header />
    <img className="hero-photo hero-cap" src={`${A}hero-cap.png`} alt="Kodak 모자를 착용한 모델" />
    <img className="hero-photo hero-model" src={`${A}hero-model.png`} alt="Kodak 의류를 입은 모델" />
    <img className="hero-photo hero-store" src={`${A}hero-store.png`} alt="Kodak 매장 라이프스타일" />
    <img className="hero-photo hero-detail" src={`${A}hero-detail.png`} alt="Kodak 의류 디테일" />
    <div className="hero-title"><h1><span>KODAK</span><span>APPAREL</span></h1><p>Make something Kodak</p></div>
    <a className="scroll-cue" href="#new"><span>SCROLL</span><i /></a>
  </section>;
}

function Dots({ count, active, onChange }: { count: number; active: number; onChange: (i: number) => void }) {
  return <div className="dots" role="tablist" aria-label="슬라이드 선택">{Array.from({ length: count }).map((_, i) => <button key={i} className={active === i ? 'active' : ''} onClick={() => onChange(i)} aria-label={`${i + 1}번째 슬라이드`} aria-selected={active === i} role="tab" />)}</div>;
}

function PromoCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  useEffect(() => { if (paused) return; const id = window.setInterval(() => setActive(v => (v + 1) % promos.length), 5000); return () => clearInterval(id); }, [paused]);
  const move = (dir: number) => setActive(v => (v + dir + promos.length) % promos.length);
  return <section id="new" className="promo-section" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={e => { startX.current = e.touches[0].clientX; setPaused(true); }} onTouchEnd={e => { const d = e.changedTouches[0].clientX - startX.current; if (Math.abs(d) > 50) move(d > 0 ? -1 : 1); setPaused(false); }}>
    <h2 data-reveal>MAKE EVERY <strong>MOMENT</strong> KODAK</h2>
    <div className="promo-viewport">
      <div className="promo-track" style={{ '--slide': active } as React.CSSProperties}>
        {promos.map((p, i) => <article className={`promo-card ${active === i ? 'active' : ''}`} key={p.label} aria-hidden={active !== i}>
          <div className="promo-copy"><div><small>{p.label}</small><b>{p.sub}</b></div><h3>{p.title}</h3><p>{p.body}</p><button className="pill">제품 보러가기 <ArrowUpRight size={17} /></button></div>
          <img src={`${A}${p.image}`} alt="" />
        </article>)}
      </div>
    </div>
    <button className="carousel-arrow left" onClick={() => move(-1)} aria-label="이전 프로모션"><ArrowLeft /></button>
    <button className="carousel-arrow right" onClick={() => move(1)} aria-label="다음 프로모션"><ArrowRight /></button>
    <Dots count={promos.length} active={active} onChange={setActive} />
  </section>;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const phase = (value: number, start: number, end: number) => {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

function StorySection() {
  const section = useRef<HTMLElement>(null);
  const raf = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance = section.current.offsetHeight - window.innerHeight;
      setProgress(clamp01(-rect.top / Math.max(1, distance)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf.current);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  const expand = phase(progress, .15, .42);
  const introOpacity = 1 - phase(progress, .09, .21);
  const previewOpacity = phase(progress, .08, .18) * (1 - phase(progress, .40, .48));
  const whiteOpacity = phase(progress, .38, .48) * (1 - phase(progress, .67, .76));
  const grayOpacity = phase(progress, .69, .80);
  const current = progress < .14 ? 0 : progress < .42 ? 1 : progress < .72 ? 2 : 3;

  return <section className="story" ref={section} aria-label="Kodak 컬러 스토리">
    <div className="story-sticky">
      <div className="story-intro" style={{ opacity: introOpacity }}>
        <p>Make SomeThing <strong>KODAK</strong> Apparel</p>
      </div>

      <div className="story-preview" style={{ opacity: previewOpacity, pointerEvents: previewOpacity > .1 ? 'auto' : 'none' }}>
        <p className="story-side story-side-left" style={{ transform: `translateX(${-expand * 12}vw)` }}>Make SomeThing</p>
        <img src={`${A}story-preview.png`} alt="화이트 Kodak 컬렉션 미리보기" style={{ width: `${33.75 + expand * 66.25}vw`, height: `${41.11 + expand * 58.89}vh`, borderRadius: `${(1 - expand) * 2}px` }} />
        <p className="story-side story-side-right" style={{ transform: `translateX(${expand * 12}vw)` }}><strong>KODAK</strong> Apparel</p>
      </div>

      <article className="story-slide story-white" style={{ opacity: whiteOpacity, pointerEvents: whiteOpacity > .5 ? 'auto' : 'none' }} aria-hidden={whiteOpacity < .05}>
        <img src={`${A}story-white.png`} alt="화이트 컬러 Kodak 컬렉션" />
        <div className="story-copy"><h2>KODAK</h2><p>깨끗하고 밝은 색상으로 데일리를 화사하게 밝혀주는 컬러<br />여러 포인트 색상과 매치해보세요</p><button className="pill">제품 보러가기</button></div>
      </article>

      <article className="story-slide story-gray" style={{ opacity: grayOpacity, pointerEvents: grayOpacity > .5 ? 'auto' : 'none' }} aria-hidden={grayOpacity < .05}>
        <img src={`${A}story-gray.png`} alt="그레이 컬러 Kodak 컬렉션" />
        <div className="story-copy"><h2>KODAK</h2><p>모던하고 시크하게 데일리로 입기 좋은 그레이 컬러<br />무심하지만 세련된 이미지를 만들어보세요</p><button className="pill">제품 보러가기</button></div>
      </article>

      <div className="story-progress" aria-hidden><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="story-steps" aria-hidden>{[0, 1, 2, 3].map(i => <i className={i === current ? 'active' : ''} key={i} />)}</div>
    </div>
  </section>;
}

function StorySequence() {
  const section = useRef<HTMLElement>(null);
  const raf = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      const distance = section.current.offsetHeight - window.innerHeight;
      setProgress(clamp01(-rect.top / Math.max(1, distance)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf.current);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  const imageScale = phase(progress, .105, .455);
  const gapTransition = phase(progress, .075, .105);
  const textGap = gapTransition * 15;
  const initialSpace = (1 - gapTransition) * .125;
  const whiteCopyIn = phase(progress, .44, .54) * (1 - phase(progress, .675, .735));
  const grayReveal = phase(progress, .69, .84);
  const grayCopyIn = phase(progress, .79, .89);
  const current = progress < .15 ? 0 : progress < .45 ? 1 : progress < .72 ? 2 : 3;

  return <section className="story" ref={section} aria-label="Kodak color story">
    <div className="story-sticky">
      <div className="story-intro story-intro-split">
        <p>
          <span style={{ transform: `translate3d(calc(${-imageScale * 50}vw - ${textGap}px - ${initialSpace}em),0,0)` }}>Make SomeThing</span>
          <span style={{ transform: `translate3d(calc(${imageScale * 50}vw + ${textGap}px + ${initialSpace}em),0,0)` }}><strong>KODAK</strong> Apparel</span>
        </p>
      </div>

      <div className="story-preview" style={{ pointerEvents: imageScale > .1 ? 'auto' : 'none' }}>
        <img src={`${A}story-preview.png`} alt="White Kodak collection" style={{ width: '100vw', height: 'auto', aspectRatio: '16 / 9', transform: `scale(${imageScale})`, transformOrigin: 'center' }} />
        <div className="story-copy story-copy-white" style={{ opacity: whiteCopyIn, transform: `translate3d(-50%,${(1 - whiteCopyIn) * 28}px,0)` }}>
          <h2>KODAK</h2><p>깔끔하고 밝은 색상으로 데일리를 화사하게 밝혀주는 컬러<br />여러 스타일의 색상과 매치해보세요</p><button className="pill">제품 보러가기</button>
        </div>
      </div>

      <article className="story-slide story-gray" style={{ clipPath: `inset(${(1 - grayReveal) * 100}% 0 0 0)`, pointerEvents: grayReveal > .9 ? 'auto' : 'none' }} aria-hidden={grayReveal < .01}>
        <img src={`${A}story-gray.png`} alt="Gray Kodak collection" />
        <div className="story-copy" style={{ opacity: grayCopyIn, transform: `translate3d(-50%,${(1 - grayCopyIn) * 28}px,0)` }}>
          <h2>KODAK</h2><p>모던하고 시크하게 데일리로 입기 좋은 그레이 컬러<br />무심하지만 매력적인 이미지를 만들어보세요</p><button className="pill">제품 보러가기</button>
        </div>
      </article>

      <div className="story-progress" aria-hidden><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="story-steps" aria-hidden>{[0, 1, 2, 3].map(i => <i className={i === current ? 'active' : ''} key={i} />)}</div>
    </div>
  </section>;
}

function Weekly() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const scrollTo = (i: number) => { setActive(i); scroller.current?.children[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); };
  return <section id="weekly" className="weekly section-pad">
    <h2 data-reveal>KODAK <strong>WEEKLY PICKS</strong></h2>
    <div className="weekly-grid" ref={scroller} onScroll={e => { const el = e.currentTarget; setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth * .82))); }}>
      {weekly.map(([img, title], i) => <article key={img} data-reveal style={{ '--delay': `${i * 90}ms` } as React.CSSProperties}><div><img src={`${A}${img}`} alt={title} /></div><p>{title}</p></article>)}
    </div>
    <Dots count={weekly.length} active={Math.min(active, weekly.length - 1)} onChange={scrollTo} />
  </section>;
}

function Editorial() {
  return <section className="editorial">
    <div className="editorial-panel"><img src={`${A}editorial-left.png`} alt="Monthly Style 컬렉션" /><span>Monthly Style</span></div>
    <div className="editorial-panel"><img src={`${A}editorial-right.png`} alt="Lettering Terry 스타일" /><span>Lettering Terry</span></div>
    <img className="editorial-center" src={`${A}editorial-center.png`} alt="Kodak 룩북 디테일" />
    <b>KODAK</b>
  </section>;
}

function EditorialMotion() {
  const [next, setNext] = useState(false);
  const [paused, setPaused] = useState(false);
  const pointerX = useRef(0);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setNext(value => !value), 5600);
    return () => clearInterval(id);
  }, [paused]);

  const finishPointer = (x: number) => {
    if (Math.abs(x - pointerX.current) > 28) setNext(x < pointerX.current);
  };

  return <section className="editorial-pin" aria-label="Kodak editorial styles">
    <div className={`editorial editorial-motion ${next ? 'show-next' : ''}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onPointerDown={event => { pointerX.current = event.clientX; }}
      onPointerUp={event => finishPointer(event.clientX)}>
    <div className="editorial-half editorial-half-left editorial-base"><img src={`${A}editorial-a-left.png`} alt="Monthly Style collection" /><span>Monthly Style</span></div>
    <div className="editorial-half editorial-half-right editorial-base"><img src={`${A}editorial-a-right.png`} alt="Lettering Terry styling" /><span>Lettering Terry</span></div>
    <div className="editorial-half editorial-half-left editorial-reveal editorial-reveal-left"><img src={`${A}editorial-b-left.png`} alt="Hirono red knit collection" /></div>
    <div className="editorial-half editorial-half-right editorial-reveal editorial-reveal-right"><img src={`${A}editorial-b-right.png`} alt="Kodak graphic styling" /></div>
    <div className="editorial-center editorial-center-base"><img src={`${A}editorial-a-center.png`} alt="Monthly Style look" /></div>
    <div className="editorial-center editorial-center-next"><img src={`${A}editorial-b-center.png`} alt="Hirono Style look" /></div>
    <b>KODAK</b>
    <button className="editorial-hit editorial-hit-left" onClick={() => setNext(false)} aria-label="이전 스타일" />
    <button className="editorial-hit editorial-hit-right" onClick={() => setNext(true)} aria-label="다음 스타일" />
    </div>
  </section>;
}

function EditorialScroll() {
  const section = useRef<HTMLElement>(null);
  const releaseTimer = useRef(0);
  const inputQuietTimer = useRef(0);
  const animationFrame = useRef(0);
  const previousScrollY = useRef(0);
  const touchStartY = useRef(0);
  const releaseReady = useRef(false);
  const direction = useRef<'forward' | 'reverse'>('forward');
  const motionStateRef = useRef<'idle' | 'pinned' | 'running' | 'holding' | 'released'>('idle');
  const [motionState, setMotionState] = useState<'idle' | 'pinned' | 'running' | 'holding' | 'released'>('idle');
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    previousScrollY.current = window.scrollY;

    const snapScrollTo = (top: number) => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, top);
      root.style.scrollBehavior = previousBehavior;
      previousScrollY.current = top;
    };

    const pinAtBoundary = (nextDirection: 'forward' | 'reverse') => {
      if (!section.current) return;
      const top = section.current.offsetTop;
      const boundary = nextDirection === 'forward'
        ? top
        : top + section.current.offsetHeight - window.innerHeight;
      snapScrollTo(boundary);
      direction.current = nextDirection;
      motionStateRef.current = 'pinned';
      setMotionState('pinned');
    };

    const waitForFreshScroll = () => {
      releaseReady.current = false;
      clearTimeout(inputQuietTimer.current);
      inputQuietTimer.current = window.setTimeout(() => {
        releaseReady.current = true;
      }, 180);
    };

    const playAnimation = () => {
      if (motionStateRef.current !== 'pinned') return;

      animationFrame.current = requestAnimationFrame(() => {
        motionStateRef.current = 'running';
        setShowNext(direction.current === 'forward');
        setMotionState('running');
      });

      // 애니메이션 종료 후에는 시간 지연 대신 30vh의 추가 스크롤 구간을 유지한다.
      releaseTimer.current = window.setTimeout(() => {
        motionStateRef.current = 'holding';
        setMotionState('holding');
        waitForFreshScroll();
      }, 1350);
    };

    const onScroll = () => {
      if (!section.current) return;
      const currentScrollY = window.scrollY;
      const rect = section.current.getBoundingClientRect();
      const scrollDelta = currentScrollY - previousScrollY.current;
      const scrollingDown = scrollDelta > 0;
      const scrollingUp = scrollDelta < 0;
      previousScrollY.current = currentScrollY;

      if (motionStateRef.current === 'holding' && releaseReady.current && direction.current === 'forward' && rect.bottom <= window.innerHeight + 1) {
        motionStateRef.current = 'released';
        setMotionState('released');
        return;
      }

      if (motionStateRef.current === 'holding' && releaseReady.current && direction.current === 'reverse' && rect.top >= -1) {
        motionStateRef.current = 'idle';
        setMotionState('idle');
        return;
      }

      const crossedBottomUpward = rect.bottom >= window.innerHeight - 1
        && rect.bottom <= window.innerHeight + Math.abs(scrollDelta) + 2;
      if (motionStateRef.current === 'released' && scrollingUp && crossedBottomUpward && rect.top < 0) {
        pinAtBoundary('reverse');
        return;
      }

      if (motionStateRef.current !== 'idle' || !scrollingDown || rect.top > 1 || rect.bottom <= window.innerHeight * .5) return;

      pinAtBoundary('forward');
    };

    const onWheel = (event: WheelEvent) => {
      if (motionStateRef.current === 'holding' && !releaseReady.current) {
        event.preventDefault();
        waitForFreshScroll();
        return;
      }

      if (section.current && motionStateRef.current === 'idle' && event.deltaY > 0) {
        const rect = section.current.getBoundingClientRect();
        const crossingTop = rect.top <= Math.max(2, Math.abs(event.deltaY)) && rect.bottom > window.innerHeight * .5;
        if (crossingTop) {
          event.preventDefault();
          pinAtBoundary('forward');
          return;
        }
      }

      if (section.current && motionStateRef.current === 'released' && event.deltaY < 0) {
        const rect = section.current.getBoundingClientRect();
        const distanceToBottom = window.innerHeight - rect.bottom;
        const crossingBottom = distanceToBottom >= -1
          && distanceToBottom <= Math.max(2, Math.abs(event.deltaY))
          && rect.top < 0;
        if (crossingBottom) {
          event.preventDefault();
          pinAtBoundary('reverse');
          return;
        }
      }

      if (motionStateRef.current !== 'pinned' && motionStateRef.current !== 'running') return;
      event.preventDefault();
      if (motionStateRef.current === 'running') waitForFreshScroll();
      if ((direction.current === 'forward' && event.deltaY > 0) || (direction.current === 'reverse' && event.deltaY < 0)) playAnimation();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (motionStateRef.current === 'holding' && !releaseReady.current) {
        event.preventDefault();
        waitForFreshScroll();
        return;
      }
      if (motionStateRef.current !== 'pinned' && motionStateRef.current !== 'running') return;
      const currentY = event.touches[0]?.clientY ?? touchStartY.current;
      event.preventDefault();
      if (motionStateRef.current === 'running') waitForFreshScroll();
      const delta = touchStartY.current - currentY;
      if ((direction.current === 'forward' && delta > 8) || (direction.current === 'reverse' && delta < -8)) playAnimation();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (motionStateRef.current === 'holding' && !releaseReady.current) {
        if (['ArrowDown', 'PageDown', ' ', 'End', 'ArrowUp', 'PageUp', 'Home'].includes(event.key)) {
          event.preventDefault();
          waitForFreshScroll();
        }
        return;
      }
      if (motionStateRef.current !== 'pinned' && motionStateRef.current !== 'running') return;
      const forwardKey = ['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key);
      const reverseKey = ['ArrowUp', 'PageUp', 'Home'].includes(event.key);
      if ((direction.current === 'forward' && !forwardKey) || (direction.current === 'reverse' && !reverseKey)) return;
      event.preventDefault();
      if (motionStateRef.current === 'running') waitForFreshScroll();
      playAnimation();
    };

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: false });
    addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(animationFrame.current);
      clearTimeout(releaseTimer.current);
      clearTimeout(inputQuietTimer.current);
      removeEventListener('scroll', onScroll);
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const pinned = motionState === 'pinned' || motionState === 'running';

  return <section className={`editorial-pin editorial-trigger-pin ${motionState === 'released' ? 'is-released' : ''}`} ref={section} aria-label="Kodak editorial styles">
    <div className={`editorial editorial-motion editorial-trigger ${pinned ? 'is-pinned' : ''} ${showNext ? 'show-next' : ''}`}>
      <div className="editorial-half editorial-half-left editorial-base"><img src={`${A}editorial-a-left.png`} alt="Monthly Style collection" /><span>Monthly Style</span></div>
      <div className="editorial-half editorial-half-right editorial-base"><img src={`${A}editorial-a-right.png`} alt="Lettering Terry styling" /><span>Lettering Terry</span></div>
      <div className="editorial-half editorial-half-left editorial-reveal editorial-reveal-left"><img src={`${A}editorial-b-left.png`} alt="Hirono red knit collection" /></div>
      <div className="editorial-half editorial-half-right editorial-reveal editorial-reveal-right"><img src={`${A}editorial-b-right.png`} alt="Kodak graphic styling" /></div>
      <div className="editorial-center editorial-center-base"><img src={`${A}editorial-a-center.png`} alt="Monthly Style look" /></div>
      <div className="editorial-center editorial-center-next"><img src={`${A}editorial-b-center.png`} alt="Hirono Style look" /></div>
      <b>KODAK</b>
    </div>
  </section>;
}

const con5Products = [
  ['product-4.png', '브이넥 니트 맨투맨'],
  ['product-3.png', '그래픽 후드 티셔츠'],
  ['product-2.png', '슬리브 프린트 긴팔 티셔츠'],
  ['product-1.png', '디스크 와펜 워싱 볼캡'],
];

function ProductSelector() {
  const [active, setActive] = useState(0);
  return <section className="product-selector">
    <div className="product-stack" aria-live="polite">{con5Products.map(([img, title], i) => <img key={img} src={`${A}${img}`} alt={title} className={active === i ? 'active' : ''} />)}</div>
    <div className="product-list">{con5Products.map(([, title], i) => <button key={title} className={active === i ? 'active' : ''} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}><span>[히로노]</span><strong>{title}</strong>{active === i && <ArrowRight aria-hidden />}</button>)}</div>
  </section>;
}

function Instagram() {
  const imgs = ['instagram-1.png', 'instagram-2.svg', 'instagram-3.svg', 'instagram-4.svg'];
  return <section className="instagram section-pad"><header data-reveal><h2>INSTAGRAM</h2><p>@kodakstyle_kr</p></header><div className="instagram-grid">{imgs.map((img, i) => <a href="#instagram" key={img} aria-label={`Kodak Instagram 게시물 ${i + 1}`} data-reveal style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}><img src={`${A}${img}`} alt="" /><span><ArrowUpRight /></span></a>)}</div><button className="pill">FOLLOW</button></section>;
}

function Footer() {
  return <footer><Logo /><div className="footer-content"><div className="footer-nav"><a href="#terms">Terms of Use</a><a href="#privacy">개인정보처리방침</a><a href="#tracking">Order Tracking</a><a href="#notice">Notice</a><a href="#qa">Q&amp;A</a><a href="#bulk">대량주문 문의</a></div><div><b>반품 &amp; 교환</b><p>반품배송지 : 경기도 이천시 호법면 안평리 83번지 1층</p><b>매장 안내</b><p>전국 매장 정보</p><p>대리점 입점 문의 : seungwon.hibs.co.kr</p><p>해외 비즈니스 문의 : sanglak.hibs.co.kr</p></div><div><b>CS Center</b><p>Customer Service</p><p>Mon - Fri (10:00 - 16:00)</p><p>문의 전용 : heeji.nam@hibs.co.kr</p><p>마케팅 제휴 : marketing@hibs.co.kr</p></div></div><div className="footer-actions"><button>Log in</button><button>Sign up</button></div><div className="socials"><a href="#kakao" aria-label="KakaoTalk"><img src={`${A}kakao.svg`} alt="" /></a><a href="#instagram" aria-label="Instagram"><img src={`${A}instagram-icon.svg`} alt="" /></a><a href="#facebook" aria-label="Facebook"><img src={`${A}facebook.svg`} alt="" /></a></div></footer>;
}

export default function App() {
  useReveal();
  return <main><Hero /><PromoCarousel /><StorySequence /><Weekly /><EditorialScroll /><ProductSelector /><Instagram /><Footer /></main>;
}
