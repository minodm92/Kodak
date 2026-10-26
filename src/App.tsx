import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';

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
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = hero.current;
    if (!root || !matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.hero-card-tilt'));
    const move = (event: PointerEvent) => {
      const x = (event.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (event.clientY - innerHeight / 2) / (innerHeight / 2);
      cards.forEach(card => {
        const depth = Number(card.dataset.depth ?? 1);
        card.style.setProperty('--pointer-x', `${x * 60 * depth}px`);
        card.style.setProperty('--pointer-y', `${y * 60 * depth}px`);
      });
    };
    const reset = () => cards.forEach(card => {
      card.style.setProperty('--pointer-x', '0px');
      card.style.setProperty('--pointer-y', '0px');
    });

    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', reset);
    return () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', reset);
    };
  }, []);

  const cards = [
    { className: 'hero-cap', image: 'hero-cap.png', alt: 'Kodak 모자를 착용한 모델', delay: 0, amp: 16, duration: 4.2, floatRotation: 1.8, rotateX: -4, rotateY: 5, depth: 1 },
    { className: 'hero-store', image: 'hero-store.png', alt: 'Kodak 매장 라이프스타일', delay: .08, amp: 13, duration: 5.1, floatRotation: -1.6, rotateX: 5, rotateY: -4, depth: .55 },
    { className: 'hero-detail', image: 'hero-detail.png', alt: 'Kodak 의류 디테일', delay: .16, amp: 19, duration: 4.6, floatRotation: 2.2, rotateX: -6, rotateY: -5, depth: .8 },
    { className: 'hero-model', image: 'hero-model.png', alt: 'Kodak 의류를 입은 모델', delay: .24, amp: 12, duration: 3.8, floatRotation: -2, rotateX: 4, rotateY: 6, depth: .4 },
  ];

  return <section id="top" className="hero" ref={hero}>
    <Header />
    <div className="hero-images" aria-hidden="true">
      {cards.map(card => <div
        className={`hero-photo hero-card ${card.className}`}
        key={card.image}
        style={{
          '--rise-delay': `${card.delay}s`,
          '--float-delay': `${1.5 + card.delay}s`,
          '--float-y': `${card.amp}px`,
          '--float-duration': `${card.duration}s`,
          '--float-rotation': `${card.floatRotation}deg`,
          '--rotate-x': `${card.rotateX}deg`,
          '--rotate-y': `${card.rotateY}deg`,
        } as React.CSSProperties}
      >
        <div className="hero-card-rise">
          <div className="hero-card-float">
            <div className="hero-card-tilt" data-depth={card.depth}>
              <img src={`${A}${card.image}`} alt={card.alt} />
            </div>
          </div>
        </div>
      </div>)}
    </div>
    <div className="hero-title"><h1><span>KODAK</span><span>APPAREL</span></h1><p>Make something Kodak</p></div>
    <a className="scroll-cue" href="#new"><span>SCROLL</span><i /></a>
  </section>;
}

function Dots({ count, active, onChange }: { count: number; active: number; onChange: (i: number) => void }) {
  return <div className="dots" role="tablist" aria-label="슬라이드 선택">{Array.from({ length: count }).map((_, i) => <button key={i} className={active === i ? 'active' : ''} onClick={() => onChange(i)} aria-label={`${i + 1}번째 슬라이드`} aria-selected={active === i} role="tab" />)}</div>;
}

function PromoCarousel() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const displayPromos = [promos[2], promos[0], promos[1]];
  useEffect(() => { if (paused) return; const id = window.setInterval(() => setActive(v => (v + 1) % displayPromos.length), 5000); return () => clearInterval(id); }, [paused, displayPromos.length]);
  const move = (dir: number) => setActive(v => (v + dir + displayPromos.length) % displayPromos.length);
  return <section id="new" className="promo-section" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={e => { startX.current = e.touches[0].clientX; setPaused(true); }} onTouchEnd={e => { const d = e.changedTouches[0].clientX - startX.current; if (Math.abs(d) > 50) move(d > 0 ? -1 : 1); setPaused(false); }}>
    <h2>MAKE EVERY <strong>MOMENT</strong> KODAK</h2>
    <div className="promo-viewport">
      <div className="promo-track" style={{ '--slide': active } as React.CSSProperties}>
        {displayPromos.map((p, i) => <article className={`promo-card ${active === i ? 'active' : ''}`} key={p.label} aria-hidden={active !== i}>
          <div className="promo-copy"><div><small>{p.label}</small><b>{p.sub}</b></div><h3>{p.title}</h3><p>{p.body}</p><button className="pill">제품 보러가기</button></div>
          <img src={`${A}${p.image}`} alt="" />
        </article>)}
      </div>
    </div>
    <div className="promo-pagination">
      <button onClick={() => move(-1)} aria-label="이전 프로모션"><img src={`${A}promo-prev.svg`} alt="" /></button>
      <div className="promo-pages" role="group" aria-label="프로모션 선택">
        {displayPromos.map((promo, index) => <button
          key={promo.image}
          className={`promo-page-dot ${active === index ? 'active' : ''}`}
          aria-label={`${index + 1}번째 프로모션: ${promo.label}`}
          aria-current={active === index ? 'true' : undefined}
          onClick={() => setActive(index)}
        />)}
      </div>
      <button onClick={() => move(1)} aria-label="다음 프로모션"><img src={`${A}promo-next.svg`} alt="" /></button>
    </div>
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

  const timeline = progress * 1.9;
  const imageScale = phase(timeline, .105, .455);
  const gapTransition = phase(timeline, .075, .105);
  const textGap = gapTransition * 15;
  const initialSpace = (1 - gapTransition) * .125;
  const whiteCopyIn = phase(timeline, .44, .54) * (1 - phase(timeline, .675, .735));
  const grayReveal = phase(timeline, 1.59, 1.74);
  const grayCopyIn = phase(timeline, 1.69, 1.79);
  const colors = [
    { name: 'blue', description: <>맑고 청량한 블루 컬러로 일상에 산뜻함을 더하고,<br />코닥만의 빈티지한 감성으로 특별한 순간을 완성해 보세요.</> },
    { name: 'yellow', description: <>보기만 해도 기분 좋아지는 선명한 옐로 컬러,<br />코닥의 유쾌한 에너지로 평범한 하루를 특별하게 물들여 보세요.</> },
    { name: 'red', description: <>시선을 사로잡는 강렬한 레드 컬러로 일상에 에너지를 더하고,<br />코닥만의 대담한 감성으로 개성 있는 스타일을 완성해 보세요.</> },
  ];
  const current = timeline < .15 ? 0 : timeline < .45 ? 1 : timeline < .69 ? 2 : Math.min(6, 3 + Math.floor((timeline - .69) / .3));

  return <section className="story story-sequence" ref={section} aria-label="Kodak color story">
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

      {colors.map((color, index) => {
        const start = .69 + index * .3;
        const reveal = phase(timeline, start, start + .15);
        const copy = phase(timeline, start + .10, start + .20) * (1 - phase(timeline, start + .285, start + .345));
        return <article key={color.name} className={`story-slide story-color story-${color.name}`}
          style={{ zIndex: 4 + index, clipPath: `inset(${(1 - reveal) * 100}% 0 0 0)` }} aria-hidden={reveal < .01 || timeline > start + .45}>
          <img src={`${A}story-${color.name}.png`} alt={`Kodak ${color.name} collection`} />
          <div className="story-copy story-color-copy" style={{ opacity: copy, transform: `translate3d(-50%,${(1 - copy) * 28}px,0)` }}>
            <h2>KODAK</h2><p>{color.description}</p>
          </div>
        </article>;
      })}

      <article className="story-slide story-gray" style={{ zIndex: 7, clipPath: `inset(${(1 - grayReveal) * 100}% 0 0 0)`, pointerEvents: grayReveal > .9 ? 'auto' : 'none' }} aria-hidden={grayReveal < .01}>
        <img src={`${A}story-gray.png`} alt="Gray Kodak collection" />
        <div className="story-copy" style={{ opacity: grayCopyIn, transform: `translate3d(-50%,${(1 - grayCopyIn) * 28}px,0)` }}>
          <h2>KODAK</h2><p>모던하고 시크하게 데일리로 입기 좋은 그레이 컬러<br />무심하지만 매력적인 이미지를 만들어보세요</p><button className="pill">제품 보러가기</button>
        </div>
      </article>

      <div className="story-progress" aria-hidden><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="story-steps" aria-hidden>{Array.from({ length: 7 }, (_, i) => <i className={i === current ? 'active' : ''} key={i} />)}</div>
    </div>
  </section>;
}

function Weekly() {
  const [active, setActive] = useState(0);
  const startX = useRef(0);
  const move = (direction: number) => setActive(value => (value + direction + weekly.length) % weekly.length);
  return <section id="weekly" className="weekly section-pad" aria-label="Kodak Weekly Picks">
    <h2>KODAK <strong>WEEKLY</strong> PICKS</h2>
    <div className="weekly-viewport" onTouchStart={event => { startX.current = event.touches[0].clientX; }} onTouchEnd={event => {
      const distance = event.changedTouches[0].clientX - startX.current;
      if (Math.abs(distance) > 50) move(distance > 0 ? -1 : 1);
    }}>
      <div className="weekly-grid" style={{ '--weekly-slide': active } as React.CSSProperties}>
        {weekly.map(([img, title], index) => <article key={img} aria-label={`${index + 1} / ${weekly.length}`}><div><img src={`${A}${img}`} alt={title} /></div><p>{title}</p></article>)}
      </div>
    </div>
    <div className="weekly-pagination">
      <button onClick={() => move(-1)} aria-label="이전 Weekly Pick"><img src={`${A}promo-prev.svg`} alt="" /></button>
      <div className="weekly-pages" role="group" aria-label="Weekly Pick 선택">
        {weekly.map(([img], index) => <button key={img} className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`${index + 1}번째 Weekly Pick`} aria-current={index === active ? 'true' : undefined} />)}
      </div>
      <button onClick={() => move(1)} aria-label="다음 Weekly Pick"><img src={`${A}promo-next.svg`} alt="" /></button>
    </div>
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
  const [showNext, setShowNext] = useState(false);
  const [running, setRunning] = useState(false);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let target = false;
    let queuedTarget = false;
    let animating = false;
    let awaitingGesture = false;
    let holdDeadline = 0;
    let lastInputAt = -Infinity;
    let completionFrame = 0;
    let transitionVersion = 0;
    let previousY = window.scrollY;
    let touchY = 0;
    let freshTouch = false;
    const gestureGap = 220;
    const maxHoldDuration = 320;

    // Keep the panel in the same sticky coordinate system throughout the transition.
    const play = (next: boolean) => {
      queuedTarget = next;
      if (animating || next === target) return;
      target = next;
      awaitingGesture = false;
      setHolding(false);
      setShowNext(next);
      if (reducedMotion.matches) return;
      animating = true;
      setRunning(true);
      const version = ++transitionVersion;
      const finish = () => {
        if (version !== transitionVersion) return;
        animating = false;
        setRunning(false);
        if (queuedTarget !== target) {
          play(queuedTarget);
        } else {
          // Briefly absorb the inertial tail, but never require the user to
          // stop scrolling. This deadline cannot be extended by more input.
          awaitingGesture = true;
          lastInputAt = performance.now();
          holdDeadline = lastInputAt + maxHoldDuration;
          setHolding(true);
        }
      };

      // React must commit the new class and the browser must start its CSS
      // transitions before their real completion can be observed.
      const waitForCompletion = () => {
        if (version !== transitionVersion) return;
        const panel = root.querySelector<HTMLElement>('.editorial-trigger');
        if (!panel) return;
        const committed = panel.classList.contains('show-next') === next;
        const transitions = Array.from(panel.querySelectorAll<HTMLElement>('.editorial-reveal, .editorial-center-next'))
          .flatMap(layer => layer.getAnimations());
        const unfinished = transitions.some(animation => animation.playState !== 'finished' && animation.playState !== 'idle');
        if (!committed || unfinished) {
          completionFrame = requestAnimationFrame(waitForCompletion);
        } else {
          finish();
        }
      };
      completionFrame = requestAnimationFrame(() => {
        completionFrame = requestAnimationFrame(waitForCompletion);
      });
    };

    const isPinned = () => {
      const rect = root.getBoundingClientRect();
      return rect.top <= 1 && rect.bottom >= innerHeight - 1;
    };

    const onScroll = () => {
      const delta = scrollY - previousY;
      previousY = scrollY;
      // Scrollbar dragging, anchor navigation and viewport changes must never
      // leave a wheel lock active after the panel has left its sticky range.
      if ((animating || awaitingGesture) && !isPinned()) {
        cancelAnimationFrame(completionFrame);
        transitionVersion++;
        animating = false;
        awaitingGesture = false;
        queuedTarget = target;
        setRunning(false);
        setHolding(false);
      }
      if (delta && !animating && !awaitingGesture && isPinned()) play(delta > 0);
    };

    const consumeInput = (next: boolean, canRelease = true) => {
      const now = performance.now();
      const freshGesture = canRelease && now - lastInputAt >= gestureGap;
      lastInputAt = now;
      if (animating) {
        queuedTarget = next;
        return true;
      }
      if (awaitingGesture) {
        if (next !== target) {
          play(next);
          return true;
        }
        if (!freshGesture && now < holdDeadline) return true;
        awaitingGesture = false;
        setHolding(false);
      }
      if (isPinned() && next !== target) {
        play(next);
        return true;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || !event.deltaY) return;
      const next = event.deltaY > 0;
      if (animating || awaitingGesture || isPinned()) {
        if (consumeInput(next)) event.preventDefault();
        return;
      }

      // Consume only the distance to the crossed edge, never snap back from outside it.
      const rect = root.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      const distance = next ? rect.top : rect.bottom - innerHeight;
      const crosses = next
        ? distance > 0 && distance <= delta
        : distance < 0 && distance >= delta;
      if (crosses && next !== target) {
        event.preventDefault();
        lastInputAt = performance.now();
        window.scrollBy({ top: distance, behavior: 'instant' });
        previousY = scrollY;
        play(next);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
      freshTouch = true;
    };
    const onTouchMove = (event: TouchEvent) => {
      const nextY = event.touches[0]?.clientY ?? touchY;
      const delta = touchY - nextY;
      touchY = nextY;
      if (Math.abs(delta) < 2) return;
      if (animating || awaitingGesture || isPinned()) {
        if (consumeInput(delta > 0, freshTouch)) event.preventDefault();
      }
      freshTouch = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      if (element?.closest('input,textarea,select,[contenteditable="true"]') || event.ctrlKey || event.metaKey || event.altKey) return;
      const forward = ['ArrowDown', 'PageDown', ' '].includes(event.key) && !event.shiftKey;
      const reverse = ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey);
      if (!forward && !reverse) return;
      if (animating || awaitingGesture || isPinned()) {
        if (consumeInput(forward, !event.repeat)) event.preventDefault();
      }
    };

    // Restore the correct image on a reload below this section without moving the page.
    if (root.getBoundingClientRect().bottom <= innerHeight) {
      target = queuedTarget = true;
      setShowNext(true);
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: false });
    addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(completionFrame);
      transitionVersion++;
      removeEventListener('scroll', onScroll);
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return <section className="editorial-pin editorial-trigger-pin" ref={section} data-motion-state={running ? 'running' : holding ? 'holding' : 'settled'} aria-label="Kodak editorial styles">
    <div className={`editorial editorial-motion editorial-trigger ${showNext ? 'show-next' : ''}`}>
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
