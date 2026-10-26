import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const profile = await mkdtemp(join(tmpdir(), 'kodak-scroll-'));
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9335',
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let tabs;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { tabs = await (await fetch('http://127.0.0.1:9335/json/list')).json(); break; } catch { await delay(100); }
  }
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) { pending.get(message.id)?.(message); pending.delete(message.id); }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, message => message.error ? reject(message.error) : resolve(message.result));
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5183/' });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate('!!document.querySelector(".editorial-trigger-pin")')) break;
    await delay(100);
  }
  await evaluate('document.fonts.ready.then(() => true)');
  // Make the center transition finish later than both side transitions. This
  // catches regressions that use one hard-coded duration or only one layer.
  await evaluate(`(() => {
    const style = document.createElement('style');
    style.textContent = '.editorial-trigger .editorial-center-next{transition-duration:2s!important;transition-delay:.3s!important}';
    document.head.append(style);
  })()`);
  await evaluate(`(() => {
    window.__editorialTiming = [];
    const capture = () => {
      const root = document.querySelector('.editorial-trigger-pin');
      const panel = root?.querySelector('.editorial-motion');
      if (panel) {
        const active = panel.getAnimations({subtree:true}).filter(animation => animation.playState === 'running');
        if (active.length || root.dataset.motionState !== 'settled') window.__editorialTiming.push({
          time: performance.now(), state: root.dataset.motionState,
          top: panel.getBoundingClientRect().top, active: active.length,
          remaining: active.map(animation => animation.effect.getComputedTiming().endTime - animation.currentTime)
        });
      }
      requestAnimationFrame(capture);
    };
    requestAnimationFrame(capture);
  })()`);
  const samples = [];
  const sample = async label => {
    const state = await evaluate(`(() => {
      const section = document.querySelector('.editorial-trigger-pin');
      const panel = section.querySelector('.editorial-motion');
      return { y: scrollY, sectionTop: section.getBoundingClientRect().top,
        panelTop: panel.getBoundingClientRect().top,
        expectedPanelTop: Math.min(Math.max(section.getBoundingClientRect().top, 0), section.getBoundingClientRect().bottom - innerHeight),
        position: getComputedStyle(panel).position,
        next: panel.classList.contains('show-next'), state: section.dataset.motionState || section.className };
    })()`);
    samples.push({ label, ...state });
    return state;
  };
  const wheel = async deltaY => { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 960, y: 540, deltaX: 0, deltaY }); await delay(50); };
  const inertiaChecks = [];
  await evaluate(`document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.querySelector('.editorial-trigger-pin').offsetTop-80)`);
  await delay(150);
  await wheel(100);
  const forwardLock = await sample('inertia forward start');
  for (let i = 0; i < 12; i++) await wheel(30);
  const duringForward = await sample('continuous forward during animation');
  inertiaChecks.push({ name: 'forward transition stays pinned', passed: duringForward.y === forwardLock.y && duringForward.state === 'running' });
  const continuous = [];
  for (let i = 0; i < 55; i++) { await wheel(30); continuous.push(await sample(`continuous forward ${i}`)); }
  const forwardTail = await sample('inertia forward tail');
  inertiaChecks.push({ name: 'continuous forward exits without a pause', passed: forwardTail.y > forwardLock.y + 324 && forwardTail.state === 'settled' && forwardTail.next });
  await delay(300);
  await wheel(120);
  const forwardRelease = await sample('fresh forward release');
  inertiaChecks.push({ name: 'fresh forward gesture releases', passed: forwardRelease.y > forwardTail.y });
  await wheel(-120);
  const reverseLock = await sample('inertia reverse start');
  for (let i = 0; i < 105; i++) { await wheel(-30); continuous.push(await sample(`continuous reverse ${i}`)); }
  const reverseTail = await sample('inertia reverse tail');
  inertiaChecks.push({ name: 'continuous reverse exits without a pause', passed: reverseTail.sectionTop > 0 && reverseTail.state === 'settled' && !reverseTail.next });
  await delay(300);
  await wheel(-120);
  const reverseRelease = await sample('fresh reverse release');
  inertiaChecks.push({ name: 'fresh reverse gesture releases', passed: reverseRelease.y < reverseTail.y });
  const unexpectedContinuous = continuous.filter((state, index) => Math.abs(state.panelTop - state.expectedPanelTop) > 2 || (index && index !== 55 && Math.abs(state.y - continuous[index - 1].y) > 32));
  inertiaChecks.push({ name: 'continuous input has no coordinate jumps', passed: unexpectedContinuous.length === 0 });
  console.log(JSON.stringify({ inertiaChecks, unexpectedContinuous }));
  const timing = await evaluate(`(() => {
    const frames = window.__editorialTiming;
    return { frames: frames.length,
      earlyUnlockFrames: frames.filter(frame => frame.active && frame.state !== 'running'),
      escapedWhileAnimating: frames.filter(frame => frame.active && Math.abs(frame.top) > 2) };
  })()`);
  console.log(JSON.stringify({ timing }));
  samples.length = 0;
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await send('Page.navigate', { url: 'http://127.0.0.1:5183/?scroll-test=regression' });
  await delay(500);
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate('!!document.querySelector(".editorial-trigger-pin")')) break;
    await delay(100);
  }
  await evaluate('document.fonts.ready.then(() => true)');
  await evaluate(`document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.querySelector('.editorial-trigger-pin').offsetTop-80)`);
  await delay(150);
  await sample('before entry');
  await wheel(100);
  await sample('entry');
  await wheel(120);
  await sample('forward animation');
  await wheel(-120);
  await sample('reverse during animation');
  await delay(2900);
  await sample('after animation');
  for (let i = 0; i < 8; i++) { await wheel(-120); await sample(`reverse ${i}`); }
  for (let i = 0; i < 12; i++) { await wheel(120); await sample(`forward ${i}`); }
  await delay(1550);
  await sample('second settle');
  for (let i = 0; i < 7; i++) { await wheel(120); await sample(`exit ${i}`); }
  for (let i = 0; i < 8; i++) { await wheel(-120); await sample(`re-enter ${i}`); }
  await delay(1550);
  await sample('reverse settle');
  for (let i = 0; i < 20; i++) { await wheel(i % 2 ? -80 : 80); await sample(`rapid reversal ${i}`); }
  await delay(2900);
  await sample('rapid reversal settle');
  const key = async key => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key });
    await delay(100);
  };
  await key('ArrowDown');
  await sample('keyboard forward');
  await key('ArrowUp');
  await sample('keyboard reverse');
  await delay(2900);
  await sample('keyboard settle');
  await wheel(120);
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await delay(150);
  const resized = await sample('resize during transition');
  await wheel(-120);
  await delay(2900);
  const resizeSettle = await sample('resize settle');
  if (process.env.VERBOSE) console.log(JSON.stringify(samples, null, 2));
  const unexpected = samples.filter((s, i) => i && !s.label.startsWith('resize') && Math.abs(s.y - samples[i - 1].y) > 180);
  const displaced = samples.filter(s => Math.abs(s.panelTop - s.expectedPanelTop) > 2);
  const reverseResult = samples.find(s => s.label === 'after animation');
  const reversalFailed = reverseResult.next || Math.abs(reverseResult.panelTop) > 2;
  const queuedReversalFailed = samples.find(s => s.label === 'rapid reversal settle').next || samples.find(s => s.label === 'keyboard settle').next;
  console.log(JSON.stringify({ unexpectedJumps: unexpected, displacedPanels: displaced, reversalFailed,
    queuedReversalFailed, resize: { before: resized, after: resizeSettle }, sampleCount: samples.length,
    maxScrollStep: Math.max(...samples.slice(1).map((s, i) => Math.abs(s.y - samples[i].y))) }));
  if (unexpected.length || displaced.length || reversalFailed || queuedReversalFailed || inertiaChecks.some(check => !check.passed) || timing.earlyUnlockFrames.length || timing.escapedWhileAnimating.length) process.exitCode = 1;
} finally {
  socket?.close();
  chrome.kill();
}
