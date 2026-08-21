import { chromium, devices } from "playwright";
const BASE = "http://localhost:3100";
const out = (l, v) => console.log(l.padEnd(26), JSON.stringify(v));
const browser = await chromium.launch();

const readState = () => ({
  body: (() => {
    const b = document.querySelector("#temoignages [style*='transform-origin']");
    const cs = getComputedStyle(b);
    const m = new DOMMatrixReadOnly(cs.transform);
    return {
      angle: +((Math.atan2(m.b, m.a) * 180) / Math.PI).toFixed(2),
      tx: +m.m41.toFixed(1),
      ty: +m.m42.toFixed(1),
    };
  })(),
  line: (() => {
    const l = document.querySelector("#temoignages line");
    return ["x1", "y1", "x2", "y2"].map((a) => +(+l.getAttribute(a)).toFixed(1));
  })(),
});

// ---- 1. Geometry: thread starts at the section's top edge and meets the body ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 90)));
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.querySelector("#temoignages").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(2500);

  out("geometry", await page.evaluate(() => {
    const sec = document.querySelector("#temoignages");
    const svg = sec.querySelector("svg");
    const line = sec.querySelector("line");
    const frame = sec.querySelector("[style*='transform-origin']").parentElement;
    const sr = sec.getBoundingClientRect();
    const svgr = svg.getBoundingClientRect();
    const fr = frame.getBoundingClientRect();
    const y1 = +line.getAttribute("y1");
    const x1 = +line.getAttribute("x1");
    return {
      svgTopEqualsSectionTop: Math.round(svgr.top - sr.top) === 0,
      threadStartsAtTop: y1 === 0,
      // Does the thread's x sit near the left of the heading (the "top-left" anchor)?
      anchorFractionOfHeading: +((x1 - (fr.left - svgr.left)) / fr.width).toFixed(3),
      strokeWidth: line.getAttribute("stroke-width"),
      stroke: line.getAttribute("stroke"),
      sectionHeight: Math.round(sr.height),
    };
  }));
  out("console errors", errs);
  await ctx.close();
}

// ---- 2. Idle sway: small, slow, continuous ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.querySelector("#temoignages").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(3500); // let the entry nudge die down

  const samples = await page.evaluate((fn) => new Promise((res) => {
    const read = new Function("return (" + fn + ")()");
    const a = [];
    const t0 = performance.now();
    const tick = () => {
      a.push(read().body.angle);
      if (performance.now() - t0 < 6000) requestAnimationFrame(tick);
      else res(a);
    };
    requestAnimationFrame(tick);
  }), readState.toString());

  const min = Math.min(...samples), max = Math.max(...samples);
  out("idle sway", {
    min: +min.toFixed(2), max: +max.toFixed(2),
    amplitudeDeg: +((max - min) / 2).toFixed(2),
    centredNearRest: Math.abs((max + min) / 2 - (-3)) < 0.5,
  });
  await ctx.close();
}

// ---- 3. Entry nudge: does it actually move on scroll-in? ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.__peak = 0; });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const before = await page.evaluate(readState);
  await page.evaluate(() => document.querySelector("#temoignages").scrollIntoView({ block: "center" }));
  const peak = await page.evaluate((fn) => new Promise((res) => {
    const read = new Function("return (" + fn + ")()");
    let p = -3;
    const t0 = performance.now();
    const tick = () => {
      const a = read().body.angle;
      if (Math.abs(a - (-3)) > Math.abs(p - (-3))) p = a;
      if (performance.now() - t0 < 1500) requestAnimationFrame(tick);
      else res(p);
    };
    requestAnimationFrame(tick);
  }), readState.toString());
  out("entry nudge peak angle", { restBefore: before.body.angle, peak: +peak.toFixed(2), swungBy: +(peak + 3).toFixed(2) });
  await ctx.close();
}

await browser.close();
