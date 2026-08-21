import { chromium, devices } from "playwright";
const BASE = "http://localhost:3100";
const out = (l, v) => console.log(l.padEnd(26), JSON.stringify(v));
const browser = await chromium.launch();

const READ = `(() => {
  const b = document.querySelector("#temoignages [style*='transform-origin']");
  const m = new DOMMatrixReadOnly(getComputedStyle(b).transform);
  const l = document.querySelector("#temoignages line");
  const sec = document.querySelector("#temoignages");
  const sr = sec.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return {
    angle: +((Math.atan2(m.b, m.a) * 180) / Math.PI).toFixed(2),
    tx: +m.m41.toFixed(1), ty: +m.m42.toFixed(1),
    line: ["x1","y1","x2","y2"].map(a => +(+l.getAttribute(a)).toFixed(1)),
    bodyTopVsSection: Math.round(br.top - sr.top),
    bodyBottomVsSection: Math.round(sr.bottom - br.bottom),
    bodyLeftVsSection: Math.round(br.left - sr.left),
    bodyRightVsSection: Math.round(sr.right - br.right),
  };
})()`;

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(String(e).slice(0, 90)));
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.evaluate(() => document.querySelector("#temoignages").scrollIntoView({ block: "center" }));
await page.waitForTimeout(3500);

const box = await page.locator("#temoignages [style*='transform-origin']").boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;

// ---- Drag far right and hold ----
await page.mouse.move(cx, cy);
await page.mouse.down();
for (let i = 1; i <= 12; i++) await page.mouse.move(cx + i * 30, cy + i * 12, { steps: 2 });
await page.waitForTimeout(900); // let it settle against the cap
const held = await page.evaluate(READ);
out("held (drag +360px)", {
  angle: held.angle,
  pull: +Math.hypot(held.tx, held.ty).toFixed(1),
  withinAngleCap: held.angle <= -3 + 12 + 0.6,
  withinPullCap: Math.hypot(held.tx, held.ty) <= 52 + 1,
});
out("  thread connected", {
  topAtSectionTop: held.line[1] === 0,
  bottomTracksBody: Math.abs(held.line[2] - (held.line[0] + held.tx)) < 0.5,
});
out("  clipping (px margins)", {
  top: held.bodyTopVsSection, bottom: held.bodyBottomVsSection,
  left: held.bodyLeftVsSection, right: held.bodyRightVsSection,
});

// ---- Drag far left and hold, to check the other cap ----
for (let i = 1; i <= 24; i++) await page.mouse.move(cx + 360 - i * 30, cy + 144 - i * 12, { steps: 2 });
await page.waitForTimeout(900);
const heldL = await page.evaluate(READ);
out("held (drag -360px)", {
  angle: heldL.angle,
  withinAngleCap: heldL.angle >= -3 - 12 - 0.6,
  pull: +Math.hypot(heldL.tx, heldL.ty).toFixed(1),
  clipTop: heldL.bodyTopVsSection, clipBottom: heldL.bodyBottomVsSection,
});

// ---- Release: sample the settle ----
const trace = page.evaluate((READ) => new Promise((res) => {
  const read = new Function("return " + READ);
  const a = [];
  const t0 = performance.now();
  const tick = () => {
    a.push({ t: Math.round(performance.now() - t0), v: read().angle });
    if (performance.now() - t0 < 2500) requestAnimationFrame(tick);
    else res(a);
  };
  requestAnimationFrame(tick);
}), READ);
await page.mouse.up();
const samples = await trace;

const REST = -3;
let crossings = 0;
for (let i = 1; i < samples.length; i++) {
  const a = samples[i - 1].v - REST, b = samples[i].v - REST;
  if (a !== 0 && Math.sign(a) !== Math.sign(b)) crossings++;
}
const settleAt = (() => {
  for (let i = samples.length - 1; i >= 0; i--) if (Math.abs(samples[i].v - REST) > 1.5) return samples[i].t;
  return 0;
})();
out("release", {
  startAngle: samples[0].v,
  overshootCrossings: crossings,
  settledWithinMs: settleAt,
  finalAngle: samples[samples.length - 1].v,
});
out("console errors", errs);
await ctx.close();
await browser.close();
