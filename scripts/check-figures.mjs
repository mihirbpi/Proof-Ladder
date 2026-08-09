// Figure geometry check. Runs against the BUILT site, because the thing that
// matters is what actually lands in the HTML after props are applied.
//
//   node scripts/check-figures.mjs
//
// For every inline <svg> it finds, this verifies:
//   * every shape and text run sits inside the viewBox
//   * no two text runs on the same baseline overlap
//   * an aria-label exists and says more than "a diagram"
//
// The path handling parses SVG path data properly — tracking the current point
// and honouring relative commands. A previous ad-hoc version scanned the `d`
// attribute for numbers and treated them all as absolute coordinates, which
// reported Noodle's whiskers ("h -22") as running off the left edge when they
// do not. A checker that cries wolf is worse than no checker.

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(import.meta.dirname, '../dist');
const TOL = 10;      // px of slack at the viewBox edge
const CHW = 6.6;     // approx advance width at the 12px mono used in figures

if (!fs.existsSync(DIST)) {
  console.error('No dist/ — run `pnpm build` first.');
  process.exit(2);
}

/** Absolute points touched by a path's `d`, honouring relative commands. */
function pathPoints(d) {
  const pts = [];
  let x = 0, y = 0, sx = 0, sy = 0;
  const toks = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let i = 0;
  let cmd = '';
  const num = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case 'M': {
        const nx = num(), ny = num();
        x = rel ? x + nx : nx; y = rel ? y + ny : ny;
        sx = x; sy = y; pts.push([x, y]);
        cmd = rel ? 'l' : 'L';           // subsequent pairs are implicit linetos
        break;
      }
      case 'L': {
        const nx = num(), ny = num();
        x = rel ? x + nx : nx; y = rel ? y + ny : ny; pts.push([x, y]);
        break;
      }
      case 'H': { const nx = num(); x = rel ? x + nx : nx; pts.push([x, y]); break; }
      case 'V': { const ny = num(); y = rel ? y + ny : ny; pts.push([x, y]); break; }
      case 'C': {
        const p = [num(), num(), num(), num(), num(), num()];
        for (let k = 0; k < 6; k += 2) {
          pts.push([rel ? x + p[k] : p[k], rel ? y + p[k + 1] : p[k + 1]]);
        }
        x = rel ? x + p[4] : p[4]; y = rel ? y + p[5] : p[5];
        break;
      }
      case 'S': case 'Q': {
        const p = [num(), num(), num(), num()];
        for (let k = 0; k < 4; k += 2) {
          pts.push([rel ? x + p[k] : p[k], rel ? y + p[k + 1] : p[k + 1]]);
        }
        x = rel ? x + p[2] : p[2]; y = rel ? y + p[3] : p[3];
        break;
      }
      case 'T': {
        const nx = num(), ny = num();
        x = rel ? x + nx : nx; y = rel ? y + ny : ny; pts.push([x, y]);
        break;
      }
      case 'A': {
        num(); num(); num(); num(); num();
        const nx = num(), ny = num();
        x = rel ? x + nx : nx; y = rel ? y + ny : ny; pts.push([x, y]);
        break;
      }
      case 'Z': { x = sx; y = sy; break; }
      default: i++;                      // unknown token: skip rather than spin
    }
  }
  return pts;
}

const attr = (s, k) => {
  const m = new RegExp(`\\b${k}="(-?[\\d.]+)"`).exec(s);
  return m ? parseFloat(m[1]) : null;
};

let problems = 0;
let svgCount = 0;

const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) checkFile(p);
  }
};

// Only report each distinct component+problem once; the same figure is rendered
// into many pages and repeating it buries the signal.
const seen = new Set();

function checkFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<svg\b[^>]*class="([a-z-]+)"[^>]*>([\s\S]*?)<\/svg>/g)) {
    const [full, cls, inner] = m;
    const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(full);
    if (!vb) continue;
    svgCount++;
    const W = parseFloat(vb[1]), H = parseFloat(vb[2]);
    const bad = [];

    // A figure is described either by its own aria-label or by the <Figure>
    // wrapper's, which renders as a labelled role="img" div immediately around
    // it. Either satisfies the §C8 floor; only having neither is a fault.
    const own = /aria-label="([^"]*)"/.exec(full)?.[1] ?? '';
    const before = html.slice(Math.max(0, m.index - 400), m.index);
    const wrapper = [...before.matchAll(/class="figure-body"[^>]*aria-label="([^"]*)"/g)].pop()?.[1] ?? '';
    const wrapped = !before.slice(before.lastIndexOf('figure-body')).includes('</div>');
    const label = own.trim().length >= 25 ? own : (wrapped ? wrapper : '');
    if (label.trim().length < 25) {
      bad.push(`no usable description: own aria-label "${own.slice(0, 24)}", wrapper "${wrapper.slice(0, 24)}"`);
    }

    // Definitions describe a tile, not page coordinates, so skip them.
    const body = inner.replace(/<defs>[\s\S]*?<\/defs>/g, '');

    for (const s of body.matchAll(/<(circle|ellipse|rect|path|line)\b([^>]*)>/g)) {
      const [, tag, a] = s;
      let xs = [], ys = [];
      if (tag === 'circle') {
        const cx = attr(a, 'cx'), cy = attr(a, 'cy'), r = attr(a, 'r');
        if (cx === null || r === null) continue;
        xs = [cx - r, cx + r]; ys = [cy - r, cy + r];
      } else if (tag === 'ellipse') {
        const cx = attr(a, 'cx'), cy = attr(a, 'cy'), rx = attr(a, 'rx'), ry = attr(a, 'ry');
        if (cx === null || rx === null) continue;
        xs = [cx - rx, cx + rx]; ys = [cy - ry, cy + ry];
      } else if (tag === 'rect') {
        const x = attr(a, 'x'), y = attr(a, 'y'), w = attr(a, 'width'), h = attr(a, 'height');
        if (x === null || w === null) continue;
        xs = [x, x + w]; ys = [y, y + h];
      } else if (tag === 'line') {
        xs = [attr(a, 'x1'), attr(a, 'x2')]; ys = [attr(a, 'y1'), attr(a, 'y2')];
        if (xs.includes(null)) continue;
      } else {
        const d = /\bd="([^"]+)"/.exec(a)?.[1];
        if (!d) continue;
        const pts = pathPoints(d);
        if (!pts.length) continue;
        xs = pts.map((p) => p[0]); ys = pts.map((p) => p[1]);
      }
      if (Math.min(...xs) < -TOL || Math.max(...xs) > W + TOL
       || Math.min(...ys) < -TOL || Math.max(...ys) > H + TOL) {
        bad.push(`${tag} spans x ${Math.min(...xs).toFixed(0)}..${Math.max(...xs).toFixed(0)}, `
               + `y ${Math.min(...ys).toFixed(0)}..${Math.max(...ys).toFixed(0)} in ${W}x${H}`);
      }
    }

    const runs = [];
    for (const t of body.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
      const a = t[1];
      const txt = t[2].replace(/<[^>]+>/g, '').trim();
      if (!txt || /transform=/.test(a)) continue;
      const x = attr(a, 'x'), y = attr(a, 'y');
      if (x === null || y === null) continue;
      const fs_ = attr(a, 'font-size') ?? 12;
      const w = txt.length * CHW * (fs_ / 12);
      const anchor = /text-anchor="(\w+)"/.exec(a)?.[1] ?? 'start';
      const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
      if (x0 < -TOL || x0 + w > W + TOL || y > H + TOL || y < -TOL) {
        bad.push(`text "${txt}" spans ${x0.toFixed(0)}..${(x0 + w).toFixed(0)} in ${W}x${H}`);
      }
      runs.push({ txt, x0, x1: x0 + w, y });
    }
    for (let i = 0; i < runs.length; i++) {
      for (let j = i + 1; j < runs.length; j++) {
        const a = runs[i], b = runs[j];
        if (Math.abs(a.y - b.y) < 6 && a.x0 < b.x1 && b.x0 < a.x1) {
          bad.push(`labels overlap: "${a.txt}" / "${b.txt}"`);
        }
      }
    }

    for (const b of bad) {
      const key = `${cls}::${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      problems++;
      console.error(`  ${cls}\n    ${b}\n    first seen: ${path.relative(DIST, file)}`);
    }
  }
}

walk(DIST);
console.log(`\nChecked ${svgCount} inline figures. ${problems} problem(s).`);
process.exit(problems > 0 ? 1 : 0);
