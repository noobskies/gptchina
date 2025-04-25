import { r as t, j as e } from './vendor.BwD-2nqP.js';
function s(t) {
  if ('undefined' == typeof Proxy) return t;
  const e = new Map();
  return new Proxy((...e) => t(...e), {
    get: (s, n) => ('create' === n ? t : (e.has(n) || e.set(n, t(n)), e.get(n))),
  });
}
function n(t) {
  return null !== t && 'object' == typeof t && 'function' == typeof t.start;
}
const i = (t) => Array.isArray(t);
function o(t, e) {
  if (!Array.isArray(e)) return !1;
  const s = e.length;
  if (s !== t.length) return !1;
  for (let n = 0; n < s; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
function r(t) {
  return 'string' == typeof t || Array.isArray(t);
}
function a(t) {
  const e = [{}, {}];
  return (
    null == t ||
      t.values.forEach((t, s) => {
        (e[0][s] = t.get()), (e[1][s] = t.getVelocity());
      }),
    e
  );
}
function l(t, e, s, n) {
  if ('function' == typeof e) {
    const [i, o] = a(n);
    e = e(void 0 !== s ? s : t.custom, i, o);
  }
  if (('string' == typeof e && (e = t.variants && t.variants[e]), 'function' == typeof e)) {
    const [i, o] = a(n);
    e = e(void 0 !== s ? s : t.custom, i, o);
  }
  return e;
}
function u(t, e, s) {
  const n = t.getProps();
  return l(n, e, void 0 !== s ? s : n.custom, t);
}
const h = ['animate', 'whileInView', 'whileFocus', 'whileHover', 'whileTap', 'whileDrag', 'exit'],
  c = ['initial', ...h],
  d = [
    'transformPerspective',
    'x',
    'y',
    'z',
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skew',
    'skewX',
    'skewY',
  ],
  p = new Set(d),
  m = (t) => 1e3 * t,
  f = (t) => t / 1e3,
  v = { type: 'spring', stiffness: 500, damping: 25, restSpeed: 10 },
  g = { type: 'keyframes', duration: 0.8 },
  y = { type: 'keyframes', ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  x = (t, { keyframes: e }) =>
    e.length > 2
      ? g
      : p.has(t)
        ? t.startsWith('scale')
          ? {
              type: 'spring',
              stiffness: 550,
              damping: 0 === e[1] ? 2 * Math.sqrt(550) : 30,
              restSpeed: 10,
            }
          : v
        : y;
function P(t, e) {
  return t[e] || t.default || t;
}
const T = !1,
  w = (t) => null !== t;
function S(t, { repeat: e, repeatType: s = 'loop' }, n) {
  const i = t.filter(w),
    o = e && 'loop' !== s && e % 2 == 1 ? 0 : i.length - 1;
  return o && void 0 !== n ? n : i[o];
}
const A = (t) => t;
const b = ['read', 'resolveKeyframes', 'update', 'preRender', 'render', 'postRender'];
function C(t, e) {
  let s = !1,
    n = !0;
  const i = { delta: 0, timestamp: 0, isProcessing: !1 },
    o = () => (s = !0),
    r = b.reduce(
      (t, e) => (
        (t[e] = (function (t) {
          let e = new Set(),
            s = new Set(),
            n = !1,
            i = !1;
          const o = new WeakSet();
          let r = { delta: 0, timestamp: 0, isProcessing: !1 };
          function a(e) {
            o.has(e) && (l.schedule(e), t()), e(r);
          }
          const l = {
            schedule: (t, i = !1, r = !1) => {
              const a = r && n ? e : s;
              return i && o.add(t), a.has(t) || a.add(t), t;
            },
            cancel: (t) => {
              s.delete(t), o.delete(t);
            },
            process: (t) => {
              (r = t),
                n
                  ? (i = !0)
                  : ((n = !0),
                    ([e, s] = [s, e]),
                    s.clear(),
                    e.forEach(a),
                    (n = !1),
                    i && ((i = !1), l.process(t)));
            },
          };
          return l;
        })(o)),
        t
      ),
      {},
    ),
    { read: a, resolveKeyframes: l, update: u, preRender: h, render: c, postRender: d } = r,
    p = () => {
      const o = performance.now();
      (s = !1),
        (i.delta = n ? 1e3 / 60 : Math.max(Math.min(o - i.timestamp, 40), 1)),
        (i.timestamp = o),
        (i.isProcessing = !0),
        a.process(i),
        l.process(i),
        u.process(i),
        h.process(i),
        c.process(i),
        d.process(i),
        (i.isProcessing = !1),
        s && e && ((n = !1), t(p));
    };
  return {
    schedule: b.reduce((e, o) => {
      const a = r[o];
      return (
        (e[o] = (e, o = !1, r = !1) => (
          s || ((s = !0), (n = !0), i.isProcessing || t(p)), a.schedule(e, o, r)
        )),
        e
      );
    }, {}),
    cancel: (t) => {
      for (let e = 0; e < b.length; e++) r[b[e]].cancel(t);
    },
    state: i,
    steps: r,
  };
}
const {
    schedule: V,
    cancel: E,
    state: M,
    steps: D,
  } = C('undefined' != typeof requestAnimationFrame ? requestAnimationFrame : A, !0),
  R = (t) => /^0[^.\s]+$/u.test(t);
let k = A;
const j = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),
  L = (t) => (e) => 'string' == typeof e && e.startsWith(t),
  F = L('--'),
  B = L('var(--'),
  O = (t) => !!B(t) && I.test(t.split('/*')[0].trim()),
  I = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
  U = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function W(t, e, s = 1) {
  const [n, i] = (function (t) {
    const e = U.exec(t);
    if (!e) return [,];
    const [, s, n, i] = e;
    return [`--${null != s ? s : n}`, i];
  })(t);
  if (!n) return;
  const o = window.getComputedStyle(e).getPropertyValue(n);
  if (o) {
    const t = o.trim();
    return j(t) ? parseFloat(t) : t;
  }
  return O(i) ? W(i, e, s + 1) : i;
}
const N = (t, e, s) => (s > e ? e : s < t ? t : s),
  $ = { test: (t) => 'number' == typeof t, parse: parseFloat, transform: (t) => t },
  z = { ...$, transform: (t) => N(0, 1, t) },
  K = { ...$, default: 1 },
  Y = (t) => Math.round(1e5 * t) / 1e5,
  H = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu,
  X =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu,
  G =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
function q(t) {
  return 'string' == typeof t;
}
const Z = (t) => ({
    test: (e) => q(e) && e.endsWith(t) && 1 === e.split(' ').length,
    parse: parseFloat,
    transform: (e) => `${e}${t}`,
  }),
  _ = Z('deg'),
  J = Z('%'),
  Q = Z('px'),
  tt = Z('vh'),
  et = Z('vw'),
  st = { ...J, parse: (t) => J.parse(t) / 100, transform: (t) => J.transform(100 * t) },
  nt = new Set([
    'width',
    'height',
    'top',
    'left',
    'right',
    'bottom',
    'x',
    'y',
    'translateX',
    'translateY',
  ]),
  it = (t) => t === $ || t === Q,
  ot = (t, e) => parseFloat(t.split(', ')[e]),
  rt =
    (t, e) =>
    (s, { transform: n }) => {
      if ('none' === n || !n) return 0;
      const i = n.match(/^matrix3d\((.+)\)$/u);
      if (i) return ot(i[1], e);
      {
        const e = n.match(/^matrix\((.+)\)$/u);
        return e ? ot(e[1], t) : 0;
      }
    },
  at = new Set(['x', 'y', 'z']),
  lt = d.filter((t) => !at.has(t));
const ut = {
  width: ({ x: t }, { paddingLeft: e = '0', paddingRight: s = '0' }) =>
    t.max - t.min - parseFloat(e) - parseFloat(s),
  height: ({ y: t }, { paddingTop: e = '0', paddingBottom: s = '0' }) =>
    t.max - t.min - parseFloat(e) - parseFloat(s),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: rt(4, 13),
  y: rt(5, 14),
};
(ut.translateX = ut.x), (ut.translateY = ut.y);
const ht = (t) => (e) => e.test(t),
  ct = [$, Q, J, _, et, tt, { test: (t) => 'auto' === t, parse: (t) => t }],
  dt = (t) => ct.find(ht(t)),
  pt = new Set();
let mt = !1,
  ft = !1;
function vt() {
  if (ft) {
    const t = Array.from(pt).filter((t) => t.needsMeasurement),
      e = new Set(t.map((t) => t.element)),
      s = new Map();
    e.forEach((t) => {
      const e = (function (t) {
        const e = [];
        return (
          lt.forEach((s) => {
            const n = t.getValue(s);
            void 0 !== n && (e.push([s, n.get()]), n.set(s.startsWith('scale') ? 1 : 0));
          }),
          e
        );
      })(t);
      e.length && (s.set(t, e), t.render());
    }),
      t.forEach((t) => t.measureInitialState()),
      e.forEach((t) => {
        t.render();
        const e = s.get(t);
        e &&
          e.forEach(([e, s]) => {
            var n;
            null === (n = t.getValue(e)) || void 0 === n || n.set(s);
          });
      }),
      t.forEach((t) => t.measureEndState()),
      t.forEach((t) => {
        void 0 !== t.suspendedScrollY && window.scrollTo(0, t.suspendedScrollY);
      });
  }
  (ft = !1), (mt = !1), pt.forEach((t) => t.complete()), pt.clear();
}
function gt() {
  pt.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (ft = !0);
  });
}
class yt {
  constructor(t, e, s, n, i, o = !1) {
    (this.isComplete = !1),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.isScheduled = !1),
      (this.unresolvedKeyframes = [...t]),
      (this.onComplete = e),
      (this.name = s),
      (this.motionValue = n),
      (this.element = i),
      (this.isAsync = o);
  }
  scheduleResolve() {
    (this.isScheduled = !0),
      this.isAsync
        ? (pt.add(this), mt || ((mt = !0), V.read(gt), V.resolveKeyframes(vt)))
        : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: e, element: s, motionValue: n } = this;
    for (let i = 0; i < t.length; i++)
      if (null === t[i])
        if (0 === i) {
          const i = null == n ? void 0 : n.get(),
            o = t[t.length - 1];
          if (void 0 !== i) t[0] = i;
          else if (s && e) {
            const n = s.readValue(e, o);
            null != n && (t[0] = n);
          }
          void 0 === t[0] && (t[0] = o), n && void 0 === i && n.set(t[0]);
        } else t[i] = t[i - 1];
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete() {
    (this.isComplete = !0),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe),
      pt.delete(this);
  }
  cancel() {
    this.isComplete || ((this.isScheduled = !1), pt.delete(this));
  }
  resume() {
    this.isComplete || this.scheduleResolve();
  }
}
const xt = (t, e) => (s) =>
    Boolean(
      (q(s) && G.test(s) && s.startsWith(t)) ||
        (e &&
          !(function (t) {
            return null == t;
          })(s) &&
          Object.prototype.hasOwnProperty.call(s, e)),
    ),
  Pt = (t, e, s) => (n) => {
    if (!q(n)) return n;
    const [i, o, r, a] = n.match(H);
    return {
      [t]: parseFloat(i),
      [e]: parseFloat(o),
      [s]: parseFloat(r),
      alpha: void 0 !== a ? parseFloat(a) : 1,
    };
  },
  Tt = { ...$, transform: (t) => Math.round(((t) => N(0, 255, t))(t)) },
  wt = {
    test: xt('rgb', 'red'),
    parse: Pt('red', 'green', 'blue'),
    transform: ({ red: t, green: e, blue: s, alpha: n = 1 }) =>
      'rgba(' +
      Tt.transform(t) +
      ', ' +
      Tt.transform(e) +
      ', ' +
      Tt.transform(s) +
      ', ' +
      Y(z.transform(n)) +
      ')',
  };
const St = {
    test: xt('#'),
    parse: function (t) {
      let e = '',
        s = '',
        n = '',
        i = '';
      return (
        t.length > 5
          ? ((e = t.substring(1, 3)),
            (s = t.substring(3, 5)),
            (n = t.substring(5, 7)),
            (i = t.substring(7, 9)))
          : ((e = t.substring(1, 2)),
            (s = t.substring(2, 3)),
            (n = t.substring(3, 4)),
            (i = t.substring(4, 5)),
            (e += e),
            (s += s),
            (n += n),
            (i += i)),
        {
          red: parseInt(e, 16),
          green: parseInt(s, 16),
          blue: parseInt(n, 16),
          alpha: i ? parseInt(i, 16) / 255 : 1,
        }
      );
    },
    transform: wt.transform,
  },
  At = {
    test: xt('hsl', 'hue'),
    parse: Pt('hue', 'saturation', 'lightness'),
    transform: ({ hue: t, saturation: e, lightness: s, alpha: n = 1 }) =>
      'hsla(' +
      Math.round(t) +
      ', ' +
      J.transform(Y(e)) +
      ', ' +
      J.transform(Y(s)) +
      ', ' +
      Y(z.transform(n)) +
      ')',
  },
  bt = {
    test: (t) => wt.test(t) || St.test(t) || At.test(t),
    parse: (t) => (wt.test(t) ? wt.parse(t) : At.test(t) ? At.parse(t) : St.parse(t)),
    transform: (t) => (q(t) ? t : t.hasOwnProperty('red') ? wt.transform(t) : At.transform(t)),
  };
const Ct = 'number',
  Vt = 'color',
  Et = 'var',
  Mt = 'var(',
  Dt = '${}',
  Rt =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function kt(t) {
  const e = t.toString(),
    s = [],
    n = { color: [], number: [], var: [] },
    i = [];
  let o = 0;
  const r = e
    .replace(
      Rt,
      (t) => (
        bt.test(t)
          ? (n.color.push(o), i.push(Vt), s.push(bt.parse(t)))
          : t.startsWith(Mt)
            ? (n.var.push(o), i.push(Et), s.push(t))
            : (n.number.push(o), i.push(Ct), s.push(parseFloat(t))),
        ++o,
        Dt
      ),
    )
    .split(Dt);
  return { values: s, split: r, indexes: n, types: i };
}
function jt(t) {
  return kt(t).values;
}
function Lt(t) {
  const { split: e, types: s } = kt(t),
    n = e.length;
  return (t) => {
    let i = '';
    for (let o = 0; o < n; o++)
      if (((i += e[o]), void 0 !== t[o])) {
        const e = s[o];
        i += e === Ct ? Y(t[o]) : e === Vt ? bt.transform(t[o]) : t[o];
      }
    return i;
  };
}
const Ft = (t) => ('number' == typeof t ? 0 : t);
const Bt = {
    test: function (t) {
      var e, s;
      return (
        isNaN(t) &&
        q(t) &&
        ((null === (e = t.match(H)) || void 0 === e ? void 0 : e.length) || 0) +
          ((null === (s = t.match(X)) || void 0 === s ? void 0 : s.length) || 0) >
          0
      );
    },
    parse: jt,
    createTransformer: Lt,
    getAnimatableNone: function (t) {
      const e = jt(t);
      return Lt(t)(e.map(Ft));
    },
  },
  Ot = new Set(['brightness', 'contrast', 'saturate', 'opacity']);
function It(t) {
  const [e, s] = t.slice(0, -1).split('(');
  if ('drop-shadow' === e) return t;
  const [n] = s.match(H) || [];
  if (!n) return t;
  const i = s.replace(n, '');
  let o = Ot.has(e) ? 1 : 0;
  return n !== s && (o *= 100), e + '(' + o + i + ')';
}
const Ut = /\b([a-z-]*)\(.*?\)/gu,
  Wt = {
    ...Bt,
    getAnimatableNone: (t) => {
      const e = t.match(Ut);
      return e ? e.map(It).join(' ') : t;
    },
  },
  Nt = { ...$, transform: Math.round },
  $t = {
    borderWidth: Q,
    borderTopWidth: Q,
    borderRightWidth: Q,
    borderBottomWidth: Q,
    borderLeftWidth: Q,
    borderRadius: Q,
    radius: Q,
    borderTopLeftRadius: Q,
    borderTopRightRadius: Q,
    borderBottomRightRadius: Q,
    borderBottomLeftRadius: Q,
    width: Q,
    maxWidth: Q,
    height: Q,
    maxHeight: Q,
    size: Q,
    top: Q,
    right: Q,
    bottom: Q,
    left: Q,
    padding: Q,
    paddingTop: Q,
    paddingRight: Q,
    paddingBottom: Q,
    paddingLeft: Q,
    margin: Q,
    marginTop: Q,
    marginRight: Q,
    marginBottom: Q,
    marginLeft: Q,
    rotate: _,
    rotateX: _,
    rotateY: _,
    rotateZ: _,
    scale: K,
    scaleX: K,
    scaleY: K,
    scaleZ: K,
    skew: _,
    skewX: _,
    skewY: _,
    distance: Q,
    translateX: Q,
    translateY: Q,
    translateZ: Q,
    x: Q,
    y: Q,
    z: Q,
    perspective: Q,
    transformPerspective: Q,
    opacity: z,
    originX: st,
    originY: st,
    originZ: Q,
    zIndex: Nt,
    backgroundPositionX: Q,
    backgroundPositionY: Q,
    fillOpacity: z,
    strokeOpacity: z,
    numOctaves: Nt,
  },
  zt = {
    ...$t,
    color: bt,
    backgroundColor: bt,
    outlineColor: bt,
    fill: bt,
    stroke: bt,
    borderColor: bt,
    borderTopColor: bt,
    borderRightColor: bt,
    borderBottomColor: bt,
    borderLeftColor: bt,
    filter: Wt,
    WebkitFilter: Wt,
  },
  Kt = (t) => zt[t];
function Yt(t, e) {
  let s = Kt(t);
  return s !== Wt && (s = Bt), s.getAnimatableNone ? s.getAnimatableNone(e) : void 0;
}
const Ht = new Set(['auto', 'none', '0']);
class Xt extends yt {
  constructor(t, e, s, n, i) {
    super(t, e, s, n, i, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: e, name: s } = this;
    if (!e || !e.current) return;
    super.readKeyframes();
    for (let a = 0; a < t.length; a++) {
      let s = t[a];
      if ('string' == typeof s && ((s = s.trim()), O(s))) {
        const n = W(s, e.current);
        void 0 !== n && (t[a] = n), a === t.length - 1 && (this.finalKeyframe = s);
      }
    }
    if ((this.resolveNoneKeyframes(), !nt.has(s) || 2 !== t.length)) return;
    const [n, i] = t,
      o = dt(n),
      r = dt(i);
    if (o !== r)
      if (it(o) && it(r))
        for (let a = 0; a < t.length; a++) {
          const e = t[a];
          'string' == typeof e && (t[a] = parseFloat(e));
        }
      else this.needsMeasurement = !0;
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: e } = this,
      s = [];
    for (let i = 0; i < t.length; i++)
      ('number' == typeof (n = t[i]) ? 0 === n : null === n || 'none' === n || '0' === n || R(n)) &&
        s.push(i);
    var n;
    s.length &&
      (function (t, e, s) {
        let n,
          i = 0;
        for (; i < t.length && !n; ) {
          const e = t[i];
          'string' == typeof e && !Ht.has(e) && kt(e).values.length && (n = t[i]), i++;
        }
        if (n && s) for (const o of e) t[o] = Yt(s, n);
      })(t, s, e);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: e, name: s } = this;
    if (!t || !t.current) return;
    'height' === s && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = ut[s](t.measureViewportBox(), window.getComputedStyle(t.current))),
      (e[0] = this.measuredOrigin);
    const n = e[e.length - 1];
    void 0 !== n && t.getValue(s, n).jump(n, !1);
  }
  measureEndState() {
    var t;
    const { element: e, name: s, unresolvedKeyframes: n } = this;
    if (!e || !e.current) return;
    const i = e.getValue(s);
    i && i.jump(this.measuredOrigin, !1);
    const o = n.length - 1,
      r = n[o];
    (n[o] = ut[s](e.measureViewportBox(), window.getComputedStyle(e.current))),
      null !== r && void 0 === this.finalKeyframe && (this.finalKeyframe = r),
      (null === (t = this.removedTransforms) || void 0 === t ? void 0 : t.length) &&
        this.removedTransforms.forEach(([t, s]) => {
          e.getValue(t).set(s);
        }),
      this.resolveNoneKeyframes();
  }
}
function Gt(t) {
  let e;
  return () => (void 0 === e && (e = t()), e);
}
let qt;
function Zt() {
  qt = void 0;
}
const _t = {
    now: () => (void 0 === qt && _t.set(M.isProcessing || T ? M.timestamp : performance.now()), qt),
    set: (t) => {
      (qt = t), queueMicrotask(Zt);
    },
  },
  Jt = (t, e) =>
    'zIndex' !== e &&
    (!('number' != typeof t && !Array.isArray(t)) ||
      !('string' != typeof t || (!Bt.test(t) && '0' !== t) || t.startsWith('url(')));
class Qt {
  constructor({
    autoplay: t = !0,
    delay: e = 0,
    type: s = 'keyframes',
    repeat: n = 0,
    repeatDelay: i = 0,
    repeatType: o = 'loop',
    ...r
  }) {
    (this.isStopped = !1),
      (this.hasAttemptedResolve = !1),
      (this.createdAt = _t.now()),
      (this.options = {
        autoplay: t,
        delay: e,
        type: s,
        repeat: n,
        repeatDelay: i,
        repeatType: o,
        ...r,
      }),
      this.updateFinishedPromise();
  }
  calcStartTime() {
    return this.resolvedAt && this.resolvedAt - this.createdAt > 40
      ? this.resolvedAt
      : this.createdAt;
  }
  get resolved() {
    return this._resolved || this.hasAttemptedResolve || (gt(), vt()), this._resolved;
  }
  onKeyframesResolved(t, e) {
    (this.resolvedAt = _t.now()), (this.hasAttemptedResolve = !0);
    const {
      name: s,
      type: n,
      velocity: i,
      delay: o,
      onComplete: r,
      onUpdate: a,
      isGenerator: l,
    } = this.options;
    if (
      !l &&
      !(function (t, e, s, n) {
        const i = t[0];
        if (null === i) return !1;
        if ('display' === e || 'visibility' === e) return !0;
        const o = t[t.length - 1],
          r = Jt(i, e),
          a = Jt(o, e);
        return (
          !(!r || !a) &&
          ((function (t) {
            const e = t[0];
            if (1 === t.length) return !0;
            for (let s = 0; s < t.length; s++) if (t[s] !== e) return !0;
          })(t) ||
            ('spring' === s && n))
        );
      })(t, s, n, i)
    ) {
      if (!o)
        return (
          null == a || a(S(t, this.options, e)),
          null == r || r(),
          void this.resolveFinishedPromise()
        );
      this.options.duration = 0;
    }
    const u = this.initPlayback(t, e);
    !1 !== u &&
      ((this._resolved = { keyframes: t, finalKeyframe: e, ...u }), this.onPostResolved());
  }
  onPostResolved() {}
  then(t, e) {
    return this.currentFinishedPromise.then(t, e);
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((t) => {
      this.resolveFinishedPromise = t;
    });
  }
}
function te(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const ee = 5;
function se(t, e, s) {
  const n = Math.max(e - ee, 0);
  return te(s - t(n), e - n);
}
const ne = 0.001,
  ie = 0.01,
  oe = 10,
  re = 0.05,
  ae = 1;
function le({ duration: t = 800, bounce: e = 0.25, velocity: s = 0, mass: n = 1 }) {
  let i,
    o,
    r = 1 - e;
  (r = N(re, ae, r)),
    (t = N(ie, oe, f(t))),
    r < 1
      ? ((i = (e) => {
          const n = e * r,
            i = n * t,
            o = n - s,
            a = he(e, r),
            l = Math.exp(-i);
          return ne - (o / a) * l;
        }),
        (o = (e) => {
          const n = e * r * t,
            o = n * s + s,
            a = Math.pow(r, 2) * Math.pow(e, 2) * t,
            l = Math.exp(-n),
            u = he(Math.pow(e, 2), r);
          return ((-i(e) + ne > 0 ? -1 : 1) * ((o - a) * l)) / u;
        }))
      : ((i = (e) => Math.exp(-e * t) * ((e - s) * t + 1) - 0.001),
        (o = (e) => Math.exp(-e * t) * (t * t * (s - e))));
  const a = (function (t, e, s) {
    let n = s;
    for (let i = 1; i < ue; i++) n -= t(n) / e(n);
    return n;
  })(i, o, 5 / t);
  if (((t = m(t)), isNaN(a))) return { stiffness: 100, damping: 10, duration: t };
  {
    const e = Math.pow(a, 2) * n;
    return { stiffness: e, damping: 2 * r * Math.sqrt(n * e), duration: t };
  }
}
const ue = 12;
function he(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ce = ['duration', 'bounce'],
  de = ['stiffness', 'damping', 'mass'];
function pe(t, e) {
  return e.some((e) => void 0 !== t[e]);
}
function me({ keyframes: t, restDelta: e, restSpeed: s, ...n }) {
  const i = t[0],
    o = t[t.length - 1],
    r = { done: !1, value: i },
    {
      stiffness: a,
      damping: l,
      mass: u,
      duration: h,
      velocity: c,
      isResolvedFromDuration: d,
    } = (function (t) {
      let e = {
        velocity: 0,
        stiffness: 100,
        damping: 10,
        mass: 1,
        isResolvedFromDuration: !1,
        ...t,
      };
      if (!pe(t, de) && pe(t, ce)) {
        const s = le(t);
        (e = { ...e, ...s, mass: 1 }), (e.isResolvedFromDuration = !0);
      }
      return e;
    })({ ...n, velocity: -f(n.velocity || 0) }),
    p = c || 0,
    v = l / (2 * Math.sqrt(a * u)),
    g = o - i,
    y = f(Math.sqrt(a / u)),
    x = Math.abs(g) < 5;
  let P;
  if ((s || (s = x ? 0.01 : 2), e || (e = x ? 0.005 : 0.5), v < 1)) {
    const t = he(y, v);
    P = (e) => {
      const s = Math.exp(-v * y * e);
      return o - s * (((p + v * y * g) / t) * Math.sin(t * e) + g * Math.cos(t * e));
    };
  } else if (1 === v) P = (t) => o - Math.exp(-y * t) * (g + (p + y * g) * t);
  else {
    const t = y * Math.sqrt(v * v - 1);
    P = (e) => {
      const s = Math.exp(-v * y * e),
        n = Math.min(t * e, 300);
      return o - (s * ((p + v * y * g) * Math.sinh(n) + t * g * Math.cosh(n))) / t;
    };
  }
  return {
    calculatedDuration: (d && h) || null,
    next: (t) => {
      const n = P(t);
      if (d) r.done = t >= h;
      else {
        let i = 0;
        v < 1 && (i = 0 === t ? m(p) : se(P, t, n));
        const a = Math.abs(i) <= s,
          l = Math.abs(o - n) <= e;
        r.done = a && l;
      }
      return (r.value = r.done ? o : n), r;
    },
  };
}
function fe({
  keyframes: t,
  velocity: e = 0,
  power: s = 0.8,
  timeConstant: n = 325,
  bounceDamping: i = 10,
  bounceStiffness: o = 500,
  modifyTarget: r,
  min: a,
  max: l,
  restDelta: u = 0.5,
  restSpeed: h,
}) {
  const c = t[0],
    d = { done: !1, value: c },
    p = (t) => (void 0 === a ? l : void 0 === l || Math.abs(a - t) < Math.abs(l - t) ? a : l);
  let m = s * e;
  const f = c + m,
    v = void 0 === r ? f : r(f);
  v !== f && (m = v - c);
  const g = (t) => -m * Math.exp(-t / n),
    y = (t) => v + g(t),
    x = (t) => {
      const e = g(t),
        s = y(t);
      (d.done = Math.abs(e) <= u), (d.value = d.done ? v : s);
    };
  let P, T;
  const w = (t) => {
    var e;
    ((e = d.value), (void 0 !== a && e < a) || (void 0 !== l && e > l)) &&
      ((P = t),
      (T = me({
        keyframes: [d.value, p(d.value)],
        velocity: se(y, t, d.value),
        damping: i,
        stiffness: o,
        restDelta: u,
        restSpeed: h,
      })));
  };
  return (
    w(0),
    {
      calculatedDuration: null,
      next: (t) => {
        let e = !1;
        return (
          T || void 0 !== P || ((e = !0), x(t), w(t)),
          void 0 !== P && t >= P ? T.next(t - P) : (!e && x(t), d)
        );
      },
    }
  );
}
const ve = (t, e, s) => (((1 - 3 * s + 3 * e) * t + (3 * s - 6 * e)) * t + 3 * e) * t,
  ge = 1e-7,
  ye = 12;
function xe(t, e, s, n) {
  if (t === e && s === n) return A;
  const i = (e) =>
    (function (t, e, s, n, i) {
      let o,
        r,
        a = 0;
      do {
        (r = e + (s - e) / 2), (o = ve(r, n, i) - t), o > 0 ? (s = r) : (e = r);
      } while (Math.abs(o) > ge && ++a < ye);
      return r;
    })(e, 0, 1, t, s);
  return (t) => (0 === t || 1 === t ? t : ve(i(t), e, n));
}
const Pe = xe(0.42, 0, 1, 1),
  Te = xe(0, 0, 0.58, 1),
  we = xe(0.42, 0, 0.58, 1),
  Se = (t) => (e) => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  Ae = (t) => (e) => 1 - t(1 - e),
  be = (t) => 1 - Math.sin(Math.acos(t)),
  Ce = Ae(be),
  Ve = Se(be),
  Ee = xe(0.33, 1.53, 0.69, 0.99),
  Me = Ae(Ee),
  De = {
    linear: A,
    easeIn: Pe,
    easeInOut: we,
    easeOut: Te,
    circIn: be,
    circInOut: Ve,
    circOut: Ce,
    backIn: Me,
    backInOut: Se(Me),
    backOut: Ee,
    anticipate: (t) => ((t *= 2) < 1 ? 0.5 * Me(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1)))),
  },
  Re = (t) => {
    if (Array.isArray(t)) {
      k(4 === t.length);
      const [e, s, n, i] = t;
      return xe(e, s, n, i);
    }
    return 'string' == typeof t ? De[t] : t;
  },
  ke = (t, e) => (s) => e(t(s)),
  je = (...t) => t.reduce(ke),
  Le = (t, e, s) => {
    const n = e - t;
    return 0 === n ? 1 : (s - t) / n;
  },
  Fe = (t, e, s) => t + (e - t) * s;
function Be(t, e, s) {
  return (
    s < 0 && (s += 1),
    s > 1 && (s -= 1),
    s < 1 / 6 ? t + 6 * (e - t) * s : s < 0.5 ? e : s < 2 / 3 ? t + (e - t) * (2 / 3 - s) * 6 : t
  );
}
function Oe(t, e) {
  return (s) => (s > 0 ? e : t);
}
const Ie = (t, e, s) => {
    const n = t * t,
      i = s * (e * e - n) + n;
    return i < 0 ? 0 : Math.sqrt(i);
  },
  Ue = [St, wt, At];
function We(t) {
  const e = ((s = t), Ue.find((t) => t.test(s)));
  var s;
  if (!Boolean(e)) return !1;
  let n = e.parse(t);
  return (
    e === At &&
      (n = (function ({ hue: t, saturation: e, lightness: s, alpha: n }) {
        (t /= 360), (s /= 100);
        let i = 0,
          o = 0,
          r = 0;
        if ((e /= 100)) {
          const n = s < 0.5 ? s * (1 + e) : s + e - s * e,
            a = 2 * s - n;
          (i = Be(a, n, t + 1 / 3)), (o = Be(a, n, t)), (r = Be(a, n, t - 1 / 3));
        } else i = o = r = s;
        return {
          red: Math.round(255 * i),
          green: Math.round(255 * o),
          blue: Math.round(255 * r),
          alpha: n,
        };
      })(n)),
    n
  );
}
const Ne = (t, e) => {
    const s = We(t),
      n = We(e);
    if (!s || !n) return Oe(t, e);
    const i = { ...s };
    return (t) => (
      (i.red = Ie(s.red, n.red, t)),
      (i.green = Ie(s.green, n.green, t)),
      (i.blue = Ie(s.blue, n.blue, t)),
      (i.alpha = Fe(s.alpha, n.alpha, t)),
      wt.transform(i)
    );
  },
  $e = new Set(['none', 'hidden']);
function ze(t, e) {
  return (s) => Fe(t, e, s);
}
function Ke(t) {
  return 'number' == typeof t
    ? ze
    : 'string' == typeof t
      ? O(t)
        ? Oe
        : bt.test(t)
          ? Ne
          : Xe
      : Array.isArray(t)
        ? Ye
        : 'object' == typeof t
          ? bt.test(t)
            ? Ne
            : He
          : Oe;
}
function Ye(t, e) {
  const s = [...t],
    n = s.length,
    i = t.map((t, s) => Ke(t)(t, e[s]));
  return (t) => {
    for (let e = 0; e < n; e++) s[e] = i[e](t);
    return s;
  };
}
function He(t, e) {
  const s = { ...t, ...e },
    n = {};
  for (const i in s) void 0 !== t[i] && void 0 !== e[i] && (n[i] = Ke(t[i])(t[i], e[i]));
  return (t) => {
    for (const e in n) s[e] = n[e](t);
    return s;
  };
}
const Xe = (t, e) => {
  const s = Bt.createTransformer(e),
    n = kt(t),
    i = kt(e);
  return n.indexes.var.length === i.indexes.var.length &&
    n.indexes.color.length === i.indexes.color.length &&
    n.indexes.number.length >= i.indexes.number.length
    ? ($e.has(t) && !i.values.length) || ($e.has(e) && !n.values.length)
      ? (function (t, e) {
          return $e.has(t) ? (s) => (s <= 0 ? t : e) : (s) => (s >= 1 ? e : t);
        })(t, e)
      : je(
          Ye(
            (function (t, e) {
              var s;
              const n = [],
                i = { color: 0, var: 0, number: 0 };
              for (let o = 0; o < e.values.length; o++) {
                const r = e.types[o],
                  a = t.indexes[r][i[r]],
                  l = null !== (s = t.values[a]) && void 0 !== s ? s : 0;
                (n[o] = l), i[r]++;
              }
              return n;
            })(n, i),
            i.values,
          ),
          s,
        )
    : Oe(t, e);
};
function Ge(t, e, s) {
  if ('number' == typeof t && 'number' == typeof e && 'number' == typeof s) return Fe(t, e, s);
  return Ke(t)(t, e);
}
function qe(t, e, { clamp: s = !0, ease: n, mixer: i } = {}) {
  const o = t.length;
  if ((k(o === e.length), 1 === o)) return () => e[0];
  if (2 === o && t[0] === t[1]) return () => e[1];
  t[0] > t[o - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
  const r = (function (t, e, s) {
      const n = [],
        i = s || Ge,
        o = t.length - 1;
      for (let r = 0; r < o; r++) {
        let s = i(t[r], t[r + 1]);
        if (e) {
          const t = Array.isArray(e) ? e[r] || A : e;
          s = je(t, s);
        }
        n.push(s);
      }
      return n;
    })(e, n, i),
    a = r.length,
    l = (e) => {
      let s = 0;
      if (a > 1) for (; s < t.length - 2 && !(e < t[s + 1]); s++);
      const n = Le(t[s], t[s + 1], e);
      return r[s](n);
    };
  return s ? (e) => l(N(t[0], t[o - 1], e)) : l;
}
function Ze(t) {
  const e = [0];
  return (
    (function (t, e) {
      const s = t[t.length - 1];
      for (let n = 1; n <= e; n++) {
        const i = Le(0, e, n);
        t.push(Fe(s, 1, i));
      }
    })(e, t.length - 1),
    e
  );
}
function _e({ duration: t = 300, keyframes: e, times: s, ease: n = 'easeInOut' }) {
  const i = ((t) => Array.isArray(t) && 'number' != typeof t[0])(n) ? n.map(Re) : Re(n),
    o = { done: !1, value: e[0] },
    r = (function (t, e) {
      return t.map((t) => t * e);
    })(s && s.length === e.length ? s : Ze(e), t),
    a = qe(r, e, {
      ease: Array.isArray(i) ? i : ((l = e), (u = i), l.map(() => u || we).splice(0, l.length - 1)),
    });
  var l, u;
  return { calculatedDuration: t, next: (e) => ((o.value = a(e)), (o.done = e >= t), o) };
}
const Je = (t) => {
    const e = ({ timestamp: e }) => t(e);
    return {
      start: () => V.update(e, !0),
      stop: () => E(e),
      now: () => (M.isProcessing ? M.timestamp : _t.now()),
    };
  },
  Qe = { decay: fe, inertia: fe, tween: _e, keyframes: _e, spring: me },
  ts = (t) => t / 100;
class es extends Qt {
  constructor(t) {
    super(t),
      (this.holdTime = null),
      (this.cancelTime = null),
      (this.currentTime = 0),
      (this.playbackSpeed = 1),
      (this.pendingPlayState = 'running'),
      (this.startTime = null),
      (this.state = 'idle'),
      (this.stop = () => {
        if ((this.resolver.cancel(), (this.isStopped = !0), 'idle' === this.state)) return;
        this.teardown();
        const { onStop: t } = this.options;
        t && t();
      });
    const { name: e, motionValue: s, element: n, keyframes: i } = this.options,
      o = (null == n ? void 0 : n.KeyframeResolver) || yt;
    (this.resolver = new o(i, (t, e) => this.onKeyframesResolved(t, e), e, s, n)),
      this.resolver.scheduleResolve();
  }
  initPlayback(t) {
    const {
        type: e = 'keyframes',
        repeat: s = 0,
        repeatDelay: n = 0,
        repeatType: i,
        velocity: o = 0,
      } = this.options,
      r = Qe[e] || _e;
    let a, l;
    r !== _e && 'number' != typeof t[0] && ((a = je(ts, Ge(t[0], t[1]))), (t = [0, 100]));
    const u = r({ ...this.options, keyframes: t });
    'mirror' === i && (l = r({ ...this.options, keyframes: [...t].reverse(), velocity: -o })),
      null === u.calculatedDuration &&
        (u.calculatedDuration = (function (t) {
          let e = 0,
            s = t.next(e);
          for (; !s.done && e < 2e4; ) (e += 50), (s = t.next(e));
          return e >= 2e4 ? 1 / 0 : e;
        })(u));
    const { calculatedDuration: h } = u,
      c = h + n;
    return {
      generator: u,
      mirroredGenerator: l,
      mapPercentToKeyframes: a,
      calculatedDuration: h,
      resolvedDuration: c,
      totalDuration: c * (s + 1) - n,
    };
  }
  onPostResolved() {
    const { autoplay: t = !0 } = this.options;
    this.play(),
      'paused' !== this.pendingPlayState && t ? (this.state = this.pendingPlayState) : this.pause();
  }
  tick(t, e = !1) {
    const { resolved: s } = this;
    if (!s) {
      const { keyframes: t } = this.options;
      return { done: !0, value: t[t.length - 1] };
    }
    const {
      finalKeyframe: n,
      generator: i,
      mirroredGenerator: o,
      mapPercentToKeyframes: r,
      keyframes: a,
      calculatedDuration: l,
      totalDuration: u,
      resolvedDuration: h,
    } = s;
    if (null === this.startTime) return i.next(0);
    const { delay: c, repeat: d, repeatType: p, repeatDelay: m, onUpdate: f } = this.options;
    this.speed > 0
      ? (this.startTime = Math.min(this.startTime, t))
      : this.speed < 0 && (this.startTime = Math.min(t - u / this.speed, this.startTime)),
      e
        ? (this.currentTime = t)
        : null !== this.holdTime
          ? (this.currentTime = this.holdTime)
          : (this.currentTime = Math.round(t - this.startTime) * this.speed);
    const v = this.currentTime - c * (this.speed >= 0 ? 1 : -1),
      g = this.speed >= 0 ? v < 0 : v > u;
    (this.currentTime = Math.max(v, 0)),
      'finished' === this.state && null === this.holdTime && (this.currentTime = u);
    let y = this.currentTime,
      x = i;
    if (d) {
      const t = Math.min(this.currentTime, u) / h;
      let e = Math.floor(t),
        s = t % 1;
      !s && t >= 1 && (s = 1), 1 === s && e--, (e = Math.min(e, d + 1));
      Boolean(e % 2) &&
        ('reverse' === p ? ((s = 1 - s), m && (s -= m / h)) : 'mirror' === p && (x = o)),
        (y = N(0, 1, s) * h);
    }
    const P = g ? { done: !1, value: a[0] } : x.next(y);
    r && (P.value = r(P.value));
    let { done: T } = P;
    g || null === l || (T = this.speed >= 0 ? this.currentTime >= u : this.currentTime <= 0);
    const w =
      null === this.holdTime && ('finished' === this.state || ('running' === this.state && T));
    return (
      w && void 0 !== n && (P.value = S(a, this.options, n)), f && f(P.value), w && this.finish(), P
    );
  }
  get duration() {
    const { resolved: t } = this;
    return t ? f(t.calculatedDuration) : 0;
  }
  get time() {
    return f(this.currentTime);
  }
  set time(t) {
    (t = m(t)),
      (this.currentTime = t),
      null !== this.holdTime || 0 === this.speed
        ? (this.holdTime = t)
        : this.driver && (this.startTime = this.driver.now() - t / this.speed);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    const e = this.playbackSpeed !== t;
    (this.playbackSpeed = t), e && (this.time = f(this.currentTime));
  }
  play() {
    if ((this.resolver.isScheduled || this.resolver.resume(), !this._resolved))
      return void (this.pendingPlayState = 'running');
    if (this.isStopped) return;
    const { driver: t = Je, onPlay: e, startTime: s } = this.options;
    this.driver || (this.driver = t((t) => this.tick(t))), e && e();
    const n = this.driver.now();
    null !== this.holdTime
      ? (this.startTime = n - this.holdTime)
      : this.startTime
        ? 'finished' === this.state && (this.startTime = n)
        : (this.startTime = null != s ? s : this.calcStartTime()),
      'finished' === this.state && this.updateFinishedPromise(),
      (this.cancelTime = this.startTime),
      (this.holdTime = null),
      (this.state = 'running'),
      this.driver.start();
  }
  pause() {
    var t;
    this._resolved
      ? ((this.state = 'paused'),
        (this.holdTime = null !== (t = this.currentTime) && void 0 !== t ? t : 0))
      : (this.pendingPlayState = 'paused');
  }
  complete() {
    'running' !== this.state && this.play(),
      (this.pendingPlayState = this.state = 'finished'),
      (this.holdTime = null);
  }
  finish() {
    this.teardown(), (this.state = 'finished');
    const { onComplete: t } = this.options;
    t && t();
  }
  cancel() {
    null !== this.cancelTime && this.tick(this.cancelTime),
      this.teardown(),
      this.updateFinishedPromise();
  }
  teardown() {
    (this.state = 'idle'),
      this.stopDriver(),
      this.resolveFinishedPromise(),
      this.updateFinishedPromise(),
      (this.startTime = this.cancelTime = null),
      this.resolver.cancel();
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(t) {
    return (this.startTime = 0), this.tick(t, !0);
  }
}
const ss = new Set(['opacity', 'clipPath', 'filter', 'transform']),
  ns = (t) => Array.isArray(t) && 'number' == typeof t[0];
function is(t) {
  return Boolean(
    !t || ('string' == typeof t && t in rs) || ns(t) || (Array.isArray(t) && t.every(is)),
  );
}
const os = ([t, e, s, n]) => `cubic-bezier(${t}, ${e}, ${s}, ${n})`,
  rs = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    circIn: os([0, 0.65, 0.55, 1]),
    circOut: os([0.55, 0, 1, 0.45]),
    backIn: os([0.31, 0.01, 0.66, -0.59]),
    backOut: os([0.33, 1.53, 0.69, 0.99]),
  };
function as(t) {
  return ls(t) || rs.easeOut;
}
function ls(t) {
  return t ? (ns(t) ? os(t) : Array.isArray(t) ? t.map(as) : rs[t]) : void 0;
}
const us = Gt(() => Object.hasOwnProperty.call(Element.prototype, 'animate'));
class hs extends Qt {
  constructor(t) {
    super(t);
    const { name: e, motionValue: s, element: n, keyframes: i } = this.options;
    (this.resolver = new Xt(i, (t, e) => this.onKeyframesResolved(t, e), e, s, n)),
      this.resolver.scheduleResolve();
  }
  initPlayback(t, e) {
    var s;
    let {
      duration: n = 300,
      times: i,
      ease: o,
      type: r,
      motionValue: a,
      name: l,
      startTime: u,
    } = this.options;
    if (!(null === (s = a.owner) || void 0 === s ? void 0 : s.current)) return !1;
    if ('spring' === (h = this.options).type || !is(h.ease)) {
      const { onComplete: e, onUpdate: s, motionValue: a, element: l, ...u } = this.options,
        h = (function (t, e) {
          const s = new es({ ...e, keyframes: t, repeat: 0, delay: 0, isGenerator: !0 });
          let n = { done: !1, value: t[0] };
          const i = [];
          let o = 0;
          for (; !n.done && o < 2e4; ) (n = s.sample(o)), i.push(n.value), (o += 10);
          return { times: void 0, keyframes: i, duration: o - 10, ease: 'linear' };
        })(t, u);
      1 === (t = h.keyframes).length && (t[1] = t[0]),
        (n = h.duration),
        (i = h.times),
        (o = h.ease),
        (r = 'keyframes');
    }
    var h;
    const c = (function (
      t,
      e,
      s,
      {
        delay: n = 0,
        duration: i = 300,
        repeat: o = 0,
        repeatType: r = 'loop',
        ease: a,
        times: l,
      } = {},
    ) {
      const u = { [e]: s };
      l && (u.offset = l);
      const h = ls(a);
      return (
        Array.isArray(h) && (u.easing = h),
        t.animate(u, {
          delay: n,
          duration: i,
          easing: Array.isArray(h) ? 'linear' : h,
          fill: 'both',
          iterations: o + 1,
          direction: 'reverse' === r ? 'alternate' : 'normal',
        })
      );
    })(a.owner.current, l, t, { ...this.options, duration: n, times: i, ease: o });
    return (
      (c.startTime = null != u ? u : this.calcStartTime()),
      this.pendingTimeline
        ? ((c.timeline = this.pendingTimeline), (this.pendingTimeline = void 0))
        : (c.onfinish = () => {
            const { onComplete: s } = this.options;
            a.set(S(t, this.options, e)), s && s(), this.cancel(), this.resolveFinishedPromise();
          }),
      { animation: c, duration: n, times: i, type: r, ease: o, keyframes: t }
    );
  }
  get duration() {
    const { resolved: t } = this;
    if (!t) return 0;
    const { duration: e } = t;
    return f(e);
  }
  get time() {
    const { resolved: t } = this;
    if (!t) return 0;
    const { animation: e } = t;
    return f(e.currentTime || 0);
  }
  set time(t) {
    const { resolved: e } = this;
    if (!e) return;
    const { animation: s } = e;
    s.currentTime = m(t);
  }
  get speed() {
    const { resolved: t } = this;
    if (!t) return 1;
    const { animation: e } = t;
    return e.playbackRate;
  }
  set speed(t) {
    const { resolved: e } = this;
    if (!e) return;
    const { animation: s } = e;
    s.playbackRate = t;
  }
  get state() {
    const { resolved: t } = this;
    if (!t) return 'idle';
    const { animation: e } = t;
    return e.playState;
  }
  get startTime() {
    const { resolved: t } = this;
    if (!t) return null;
    const { animation: e } = t;
    return e.startTime;
  }
  attachTimeline(t) {
    if (this._resolved) {
      const { resolved: e } = this;
      if (!e) return A;
      const { animation: s } = e;
      (s.timeline = t), (s.onfinish = null);
    } else this.pendingTimeline = t;
    return A;
  }
  play() {
    if (this.isStopped) return;
    const { resolved: t } = this;
    if (!t) return;
    const { animation: e } = t;
    'finished' === e.playState && this.updateFinishedPromise(), e.play();
  }
  pause() {
    const { resolved: t } = this;
    if (!t) return;
    const { animation: e } = t;
    e.pause();
  }
  stop() {
    if ((this.resolver.cancel(), (this.isStopped = !0), 'idle' === this.state)) return;
    this.resolveFinishedPromise(), this.updateFinishedPromise();
    const { resolved: t } = this;
    if (!t) return;
    const { animation: e, keyframes: s, duration: n, type: i, ease: o, times: r } = t;
    if ('idle' === e.playState || 'finished' === e.playState) return;
    if (this.time) {
      const { motionValue: t, onUpdate: e, onComplete: a, element: l, ...u } = this.options,
        h = new es({
          ...u,
          keyframes: s,
          duration: n,
          type: i,
          ease: o,
          times: r,
          isGenerator: !0,
        }),
        c = m(this.time);
      t.setWithVelocity(h.sample(c - 10).value, h.sample(c).value, 10);
    }
    const { onStop: a } = this.options;
    a && a(), this.cancel();
  }
  complete() {
    const { resolved: t } = this;
    t && t.animation.finish();
  }
  cancel() {
    const { resolved: t } = this;
    t && t.animation.cancel();
  }
  static supports(t) {
    const { motionValue: e, name: s, repeatDelay: n, repeatType: i, damping: o, type: r } = t;
    return (
      us() &&
      s &&
      ss.has(s) &&
      e &&
      e.owner &&
      e.owner.current instanceof HTMLElement &&
      !e.owner.getProps().onUpdate &&
      !n &&
      'mirror' !== i &&
      0 !== o &&
      'inertia' !== r
    );
  }
}
const cs = Gt(() => void 0 !== window.ScrollTimeline);
class ds {
  constructor(t) {
    (this.stop = () => this.runAll('stop')), (this.animations = t.filter(Boolean));
  }
  then(t, e) {
    return Promise.all(this.animations).then(t).catch(e);
  }
  getAll(t) {
    return this.animations[0][t];
  }
  setAll(t, e) {
    for (let s = 0; s < this.animations.length; s++) this.animations[s][t] = e;
  }
  attachTimeline(t) {
    const e = this.animations.map((e) => {
      if (!cs() || !e.attachTimeline)
        return (
          e.pause(),
          (function (t, e) {
            let s;
            const n = () => {
              const { currentTime: n } = e,
                i = (null === n ? 0 : n.value) / 100;
              s !== i && t(i), (s = i);
            };
            return V.update(n, !0), () => E(n);
          })((t) => {
            e.time = e.duration * t;
          }, t)
        );
      e.attachTimeline(t);
    });
    return () => {
      e.forEach((t, e) => {
        t && t(), this.animations[e].stop();
      });
    };
  }
  get time() {
    return this.getAll('time');
  }
  set time(t) {
    this.setAll('time', t);
  }
  get speed() {
    return this.getAll('speed');
  }
  set speed(t) {
    this.setAll('speed', t);
  }
  get startTime() {
    return this.getAll('startTime');
  }
  get duration() {
    let t = 0;
    for (let e = 0; e < this.animations.length; e++) t = Math.max(t, this.animations[e].duration);
    return t;
  }
  runAll(t) {
    this.animations.forEach((e) => e[t]());
  }
  play() {
    this.runAll('play');
  }
  pause() {
    this.runAll('pause');
  }
  cancel() {
    this.runAll('cancel');
  }
  complete() {
    this.runAll('complete');
  }
}
const ps =
    (t, e, s, n = {}, i, o, r) =>
    (a) => {
      const l = P(n, t) || {},
        u = l.delay || n.delay || 0;
      let { elapsed: h = 0 } = n;
      h -= m(u);
      let c = {
        keyframes: Array.isArray(s) ? s : [null, s],
        ease: 'easeOut',
        velocity: e.getVelocity(),
        ...l,
        delay: -h,
        onUpdate: (t) => {
          e.set(t), l.onUpdate && l.onUpdate(t);
        },
        onComplete: () => {
          a(), l.onComplete && l.onComplete(), r && r();
        },
        onStop: r,
        name: t,
        motionValue: e,
        element: o ? void 0 : i,
      };
      (function ({
        when: t,
        delay: e,
        delayChildren: s,
        staggerChildren: n,
        staggerDirection: i,
        repeat: o,
        repeatType: r,
        repeatDelay: a,
        from: l,
        elapsed: u,
        ...h
      }) {
        return !!Object.keys(h).length;
      })(l) || (c = { ...c, ...x(t, c) }),
        c.duration && (c.duration = m(c.duration)),
        c.repeatDelay && (c.repeatDelay = m(c.repeatDelay)),
        void 0 !== c.from && (c.keyframes[0] = c.from);
      let d = !1;
      if (
        ((!1 === c.type || (0 === c.duration && !c.repeatDelay)) &&
          ((c.duration = 0), 0 === c.delay && (d = !0)),
        d && !o && void 0 !== e.get())
      ) {
        const t = S(c.keyframes, l);
        if (void 0 !== t)
          return (
            V.update(() => {
              c.onUpdate(t), c.onComplete();
            }),
            new ds([])
          );
      }
      return !o && hs.supports(c) ? new hs(c) : new es(c);
    },
  ms = (t) => Boolean(t && 'object' == typeof t && t.mix && t.toValue),
  fs = (t) => (i(t) ? t[t.length - 1] || 0 : t);
function vs(t, e) {
  -1 === t.indexOf(e) && t.push(e);
}
function gs(t, e) {
  const s = t.indexOf(e);
  s > -1 && t.splice(s, 1);
}
class ys {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return vs(this.subscriptions, t), () => gs(this.subscriptions, t);
  }
  notify(t, e, s) {
    const n = this.subscriptions.length;
    if (n)
      if (1 === n) this.subscriptions[0](t, e, s);
      else
        for (let i = 0; i < n; i++) {
          const n = this.subscriptions[i];
          n && n(t, e, s);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
class xs {
  constructor(t, e = {}) {
    (this.version = '11.5.4'),
      (this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (t, e = !0) => {
        const s = _t.now();
        this.updatedAt !== s && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(t),
          this.current !== this.prev &&
            this.events.change &&
            this.events.change.notify(this.current),
          e && this.events.renderRequest && this.events.renderRequest.notify(this.current);
      }),
      (this.hasAnimated = !1),
      this.setCurrent(t),
      (this.owner = e.owner);
  }
  setCurrent(t) {
    var e;
    (this.current = t),
      (this.updatedAt = _t.now()),
      null === this.canTrackVelocity &&
        void 0 !== t &&
        (this.canTrackVelocity = ((e = this.current), !isNaN(parseFloat(e))));
  }
  setPrevFrameValue(t = this.current) {
    (this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt);
  }
  onChange(t) {
    return this.on('change', t);
  }
  on(t, e) {
    this.events[t] || (this.events[t] = new ys());
    const s = this.events[t].add(e);
    return 'change' === t
      ? () => {
          s(),
            V.read(() => {
              this.events.change.getSize() || this.stop();
            });
        }
      : s;
  }
  clearListeners() {
    for (const t in this.events) this.events[t].clear();
  }
  attach(t, e) {
    (this.passiveEffect = t), (this.stopPassiveEffect = e);
  }
  set(t, e = !0) {
    e && this.passiveEffect
      ? this.passiveEffect(t, this.updateAndNotify)
      : this.updateAndNotify(t, e);
  }
  setWithVelocity(t, e, s) {
    this.set(e),
      (this.prev = void 0),
      (this.prevFrameValue = t),
      (this.prevUpdatedAt = this.updatedAt - s);
  }
  jump(t, e = !0) {
    this.updateAndNotify(t),
      (this.prev = t),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      e && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect();
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const t = _t.now();
    if (!this.canTrackVelocity || void 0 === this.prevFrameValue || t - this.updatedAt > 30)
      return 0;
    const e = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
    return te(parseFloat(this.current) - parseFloat(this.prevFrameValue), e);
  }
  start(t) {
    return (
      this.stop(),
      new Promise((e) => {
        (this.hasAnimated = !0),
          (this.animation = t(e)),
          this.events.animationStart && this.events.animationStart.notify();
      }).then(() => {
        this.events.animationComplete && this.events.animationComplete.notify(),
          this.clearAnimation();
      })
    );
  }
  stop() {
    this.animation &&
      (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation();
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function Ps(t, e) {
  return new xs(t, e);
}
function Ts(t, e, s) {
  t.hasValue(e) ? t.getValue(e).set(s) : t.addValue(e, Ps(s));
}
const ws = (t) => t.replace(/([a-z])([A-Z])/gu, '$1-$2').toLowerCase(),
  Ss = 'data-' + ws('framerAppearId');
function As(t) {
  return t.props[Ss];
}
function bs(t) {
  return p.has(t) ? 'transform' : ss.has(t) ? ws(t) : void 0;
}
class Cs extends xs {
  constructor() {
    super(...arguments), (this.output = []), (this.counts = new Map());
  }
  add(t) {
    const e = bs(t);
    if (!e) return;
    const s = this.counts.get(e) || 0;
    this.counts.set(e, s + 1), 0 === s && (this.output.push(e), this.update());
    let n = !1;
    return () => {
      if (n) return;
      n = !0;
      const t = this.counts.get(e) - 1;
      this.counts.set(e, t), 0 === t && (gs(this.output, e), this.update());
    };
  }
  update() {
    this.set(this.output.length ? this.output.join(', ') : 'auto');
  }
}
const Vs = (t) => Boolean(t && t.getVelocity);
function Es(t, e) {
  var s;
  if (!t.applyWillChange) return;
  let n = t.getValue('willChange');
  return (
    n ||
      (null === (s = t.props.style) || void 0 === s ? void 0 : s.willChange) ||
      ((n = new Cs('auto')), t.addValue('willChange', n)),
    (i = n),
    Boolean(Vs(i) && i.add) ? n.add(e) : void 0
  );
  var i;
}
function Ms({ protectedKeys: t, needsAnimating: e }, s) {
  const n = t.hasOwnProperty(s) && !0 !== e[s];
  return (e[s] = !1), n;
}
function Ds(t, e, { delay: s = 0, transitionOverride: n, type: i } = {}) {
  var o;
  let { transition: r = t.getDefaultTransition(), transitionEnd: a, ...l } = e;
  n && (r = n);
  const h = [],
    c = i && t.animationState && t.animationState.getState()[i];
  for (const u in l) {
    const e = t.getValue(u, null !== (o = t.latestValues[u]) && void 0 !== o ? o : null),
      n = l[u];
    if (void 0 === n || (c && Ms(c, u))) continue;
    const i = { delay: s, ...P(r || {}, u) };
    let a = !1;
    if (window.MotionHandoffAnimation) {
      const e = As(t);
      if (e) {
        const t = window.MotionHandoffAnimation(e, u, V);
        null !== t && ((i.startTime = t), (a = !0));
      }
    }
    e.start(ps(u, e, n, t.shouldReduceMotion && p.has(u) ? { type: !1 } : i, t, a, Es(t, u)));
    const d = e.animation;
    d && h.push(d);
  }
  return (
    a &&
      Promise.all(h).then(() => {
        V.update(() => {
          a &&
            (function (t, e) {
              const s = u(t, e);
              let { transitionEnd: n = {}, transition: i = {}, ...o } = s || {};
              o = { ...o, ...n };
              for (const r in o) Ts(t, r, fs(o[r]));
            })(t, a);
        });
      }),
    h
  );
}
function Rs(t, e, s = {}) {
  var n;
  const i = u(
    t,
    e,
    'exit' === s.type
      ? null === (n = t.presenceContext) || void 0 === n
        ? void 0
        : n.custom
      : void 0,
  );
  let { transition: o = t.getDefaultTransition() || {} } = i || {};
  s.transitionOverride && (o = s.transitionOverride);
  const r = i ? () => Promise.all(Ds(t, i, s)) : () => Promise.resolve(),
    a =
      t.variantChildren && t.variantChildren.size
        ? (n = 0) => {
            const { delayChildren: i = 0, staggerChildren: r, staggerDirection: a } = o;
            return (function (t, e, s = 0, n = 0, i = 1, o) {
              const r = [],
                a = (t.variantChildren.size - 1) * n,
                l = 1 === i ? (t = 0) => t * n : (t = 0) => a - t * n;
              return (
                Array.from(t.variantChildren)
                  .sort(ks)
                  .forEach((t, n) => {
                    t.notify('AnimationStart', e),
                      r.push(
                        Rs(t, e, { ...o, delay: s + l(n) }).then(() =>
                          t.notify('AnimationComplete', e),
                        ),
                      );
                  }),
                Promise.all(r)
              );
            })(t, e, i + n, r, a, s);
          }
        : () => Promise.resolve(),
    { when: l } = o;
  if (l) {
    const [t, e] = 'beforeChildren' === l ? [r, a] : [a, r];
    return t().then(() => e());
  }
  return Promise.all([r(), a(s.delay)]);
}
function ks(t, e) {
  return t.sortNodePosition(e);
}
const js = [...h].reverse(),
  Ls = h.length;
function Fs(t) {
  return (e) =>
    Promise.all(
      e.map(({ animation: e, options: s }) =>
        (function (t, e, s = {}) {
          let n;
          if ((t.notify('AnimationStart', e), Array.isArray(e))) {
            const i = e.map((e) => Rs(t, e, s));
            n = Promise.all(i);
          } else if ('string' == typeof e) n = Rs(t, e, s);
          else {
            const i = 'function' == typeof e ? u(t, e, s.custom) : e;
            n = Promise.all(Ds(t, i, s));
          }
          return n.then(() => {
            t.notify('AnimationComplete', e);
          });
        })(t, e, s),
      ),
    );
}
function Bs(t, e) {
  return 'string' == typeof e ? e !== t : !!Array.isArray(e) && !o(e, t);
}
function Os(t = !1) {
  return { isActive: t, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function Is() {
  return {
    animate: Os(!0),
    whileInView: Os(),
    whileHover: Os(),
    whileTap: Os(),
    whileDrag: Os(),
    whileFocus: Os(),
    exit: Os(),
  };
}
class Us {
  constructor(t) {
    (this.isMounted = !1), (this.node = t);
  }
  update() {}
}
let Ws = 0;
const Ns = {
    animation: {
      Feature: class extends Us {
        constructor(t) {
          super(t),
            t.animationState ||
              (t.animationState = (function (t) {
                let e = Fs(t),
                  s = Is(),
                  a = !0;
                const l = (e) => (s, n) => {
                  var i;
                  const o = u(
                    t,
                    n,
                    'exit' === e
                      ? null === (i = t.presenceContext) || void 0 === i
                        ? void 0
                        : i.custom
                      : void 0,
                  );
                  if (o) {
                    const { transition: t, transitionEnd: e, ...n } = o;
                    s = { ...s, ...n, ...e };
                  }
                  return s;
                };
                function h(u) {
                  const h = t.getProps(),
                    c = t.getVariantContext(!0) || {},
                    d = [],
                    p = new Set();
                  let m = {},
                    f = 1 / 0;
                  for (let e = 0; e < Ls; e++) {
                    const v = js[e],
                      g = s[v],
                      y = void 0 !== h[v] ? h[v] : c[v],
                      x = r(y),
                      P = v === u ? g.isActive : null;
                    !1 === P && (f = e);
                    let T = y === c[v] && y !== h[v] && x;
                    if (
                      (T && a && t.manuallyAnimateOnMount && (T = !1),
                      (g.protectedKeys = { ...m }),
                      (!g.isActive && null === P) ||
                        (!y && !g.prevProp) ||
                        n(y) ||
                        'boolean' == typeof y)
                    )
                      continue;
                    let w = Bs(g.prevProp, y) || (v === u && g.isActive && !T && x) || (e > f && x),
                      S = !1;
                    const A = Array.isArray(y) ? y : [y];
                    let b = A.reduce(l(v), {});
                    !1 === P && (b = {});
                    const { prevResolvedValues: C = {} } = g,
                      V = { ...C, ...b },
                      E = (e) => {
                        (w = !0), p.has(e) && ((S = !0), p.delete(e)), (g.needsAnimating[e] = !0);
                        const s = t.getValue(e);
                        s && (s.liveStyle = !1);
                      };
                    for (const t in V) {
                      const e = b[t],
                        s = C[t];
                      if (m.hasOwnProperty(t)) continue;
                      let n = !1;
                      (n = i(e) && i(s) ? !o(e, s) : e !== s),
                        n
                          ? null != e
                            ? E(t)
                            : p.add(t)
                          : void 0 !== e && p.has(t)
                            ? E(t)
                            : (g.protectedKeys[t] = !0);
                    }
                    (g.prevProp = y),
                      (g.prevResolvedValues = b),
                      g.isActive && (m = { ...m, ...b }),
                      a && t.blockInitialAnimation && (w = !1),
                      !w ||
                        (T && !S) ||
                        d.push(...A.map((t) => ({ animation: t, options: { type: v } })));
                  }
                  if (p.size) {
                    const e = {};
                    p.forEach((s) => {
                      const n = t.getBaseTarget(s),
                        i = t.getValue(s);
                      i && (i.liveStyle = !0), (e[s] = null != n ? n : null);
                    }),
                      d.push({ animation: e });
                  }
                  let v = Boolean(d.length);
                  return (
                    !a ||
                      (!1 !== h.initial && h.initial !== h.animate) ||
                      t.manuallyAnimateOnMount ||
                      (v = !1),
                    (a = !1),
                    v ? e(d) : Promise.resolve()
                  );
                }
                return {
                  animateChanges: h,
                  setActive: function (e, n) {
                    var i;
                    if (s[e].isActive === n) return Promise.resolve();
                    null === (i = t.variantChildren) ||
                      void 0 === i ||
                      i.forEach((t) => {
                        var s;
                        return null === (s = t.animationState) || void 0 === s
                          ? void 0
                          : s.setActive(e, n);
                      }),
                      (s[e].isActive = n);
                    const o = h(e);
                    for (const t in s) s[t].protectedKeys = {};
                    return o;
                  },
                  setAnimateFunction: function (s) {
                    e = s(t);
                  },
                  getState: () => s,
                  reset: () => {
                    (s = Is()), (a = !0);
                  },
                };
              })(t));
        }
        updateAnimationControlsSubscription() {
          const { animate: t } = this.node.getProps();
          n(t) && (this.unmountControls = t.subscribe(this.node));
        }
        mount() {
          this.updateAnimationControlsSubscription();
        }
        update() {
          const { animate: t } = this.node.getProps(),
            { animate: e } = this.node.prevProps || {};
          t !== e && this.updateAnimationControlsSubscription();
        }
        unmount() {
          var t;
          this.node.animationState.reset(),
            null === (t = this.unmountControls) || void 0 === t || t.call(this);
        }
      },
    },
    exit: {
      Feature: class extends Us {
        constructor() {
          super(...arguments), (this.id = Ws++);
        }
        update() {
          if (!this.node.presenceContext) return;
          const { isPresent: t, onExitComplete: e } = this.node.presenceContext,
            { isPresent: s } = this.node.prevPresenceContext || {};
          if (!this.node.animationState || t === s) return;
          const n = this.node.animationState.setActive('exit', !t);
          e && !t && n.then(() => e(this.id));
        }
        mount() {
          const { register: t } = this.node.presenceContext || {};
          t && (this.unmount = t(this.id));
        }
        unmount() {}
      },
    },
  },
  $s = (t) =>
    'mouse' === t.pointerType ? 'number' != typeof t.button || t.button <= 0 : !1 !== t.isPrimary;
function zs(t, e = 'page') {
  return { point: { x: t[`${e}X`], y: t[`${e}Y`] } };
}
const Ks = (t) => (e) => $s(e) && t(e, zs(e));
function Ys(t, e, s, n = { passive: !0 }) {
  return t.addEventListener(e, s, n), () => t.removeEventListener(e, s);
}
function Hs(t, e, s, n) {
  return Ys(t, e, Ks(s), n);
}
const Xs = (t, e) => Math.abs(t - e);
class Gs {
  constructor(t, e, { transformPagePoint: s, contextWindow: n, dragSnapToOrigin: i = !1 } = {}) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.updatePoint = () => {
        if (!this.lastMoveEvent || !this.lastMoveEventInfo) return;
        const t = _s(this.lastMoveEventInfo, this.history),
          e = null !== this.startEvent,
          s =
            (function (t, e) {
              const s = Xs(t.x, e.x),
                n = Xs(t.y, e.y);
              return Math.sqrt(s ** 2 + n ** 2);
            })(t.offset, { x: 0, y: 0 }) >= 3;
        if (!e && !s) return;
        const { point: n } = t,
          { timestamp: i } = M;
        this.history.push({ ...n, timestamp: i });
        const { onStart: o, onMove: r } = this.handlers;
        e || (o && o(this.lastMoveEvent, t), (this.startEvent = this.lastMoveEvent)),
          r && r(this.lastMoveEvent, t);
      }),
      (this.handlePointerMove = (t, e) => {
        (this.lastMoveEvent = t),
          (this.lastMoveEventInfo = qs(e, this.transformPagePoint)),
          V.update(this.updatePoint, !0);
      }),
      (this.handlePointerUp = (t, e) => {
        this.end();
        const { onEnd: s, onSessionEnd: n, resumeAnimation: i } = this.handlers;
        if ((this.dragSnapToOrigin && i && i(), !this.lastMoveEvent || !this.lastMoveEventInfo))
          return;
        const o = _s(
          'pointercancel' === t.type ? this.lastMoveEventInfo : qs(e, this.transformPagePoint),
          this.history,
        );
        this.startEvent && s && s(t, o), n && n(t, o);
      }),
      !$s(t))
    )
      return;
    (this.dragSnapToOrigin = i),
      (this.handlers = e),
      (this.transformPagePoint = s),
      (this.contextWindow = n || window);
    const o = qs(zs(t), this.transformPagePoint),
      { point: r } = o,
      { timestamp: a } = M;
    this.history = [{ ...r, timestamp: a }];
    const { onSessionStart: l } = e;
    l && l(t, _s(o, this.history)),
      (this.removeListeners = je(
        Hs(this.contextWindow, 'pointermove', this.handlePointerMove),
        Hs(this.contextWindow, 'pointerup', this.handlePointerUp),
        Hs(this.contextWindow, 'pointercancel', this.handlePointerUp),
      ));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), E(this.updatePoint);
  }
}
function qs(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Zs(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function _s({ point: t }, e) {
  return { point: t, delta: Zs(t, Qs(e)), offset: Zs(t, Js(e)), velocity: tn(e, 0.1) };
}
function Js(t) {
  return t[0];
}
function Qs(t) {
  return t[t.length - 1];
}
function tn(t, e) {
  if (t.length < 2) return { x: 0, y: 0 };
  let s = t.length - 1,
    n = null;
  const i = Qs(t);
  for (; s >= 0 && ((n = t[s]), !(i.timestamp - n.timestamp > m(e))); ) s--;
  if (!n) return { x: 0, y: 0 };
  const o = f(i.timestamp - n.timestamp);
  if (0 === o) return { x: 0, y: 0 };
  const r = { x: (i.x - n.x) / o, y: (i.y - n.y) / o };
  return r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r;
}
function en(t) {
  let e = null;
  return () => {
    const s = () => {
      e = null;
    };
    return null === e && ((e = t), s);
  };
}
const sn = en('dragHorizontal'),
  nn = en('dragVertical');
function on(t) {
  let e = !1;
  if ('y' === t) e = nn();
  else if ('x' === t) e = sn();
  else {
    const t = sn(),
      s = nn();
    t && s
      ? (e = () => {
          t(), s();
        })
      : (t && t(), s && s());
  }
  return e;
}
function rn() {
  const t = on(!0);
  return !t || (t(), !1);
}
function an(t) {
  return t && 'object' == typeof t && Object.prototype.hasOwnProperty.call(t, 'current');
}
const ln = 0.9999,
  un = 1.0001,
  hn = -0.01,
  cn = 0.01;
function dn(t) {
  return t.max - t.min;
}
function pn(t, e, s, n = 0.5) {
  (t.origin = n),
    (t.originPoint = Fe(e.min, e.max, t.origin)),
    (t.scale = dn(s) / dn(e)),
    (t.translate = Fe(s.min, s.max, t.origin) - t.originPoint),
    ((t.scale >= ln && t.scale <= un) || isNaN(t.scale)) && (t.scale = 1),
    ((t.translate >= hn && t.translate <= cn) || isNaN(t.translate)) && (t.translate = 0);
}
function mn(t, e, s, n) {
  pn(t.x, e.x, s.x, n ? n.originX : void 0), pn(t.y, e.y, s.y, n ? n.originY : void 0);
}
function fn(t, e, s) {
  (t.min = s.min + e.min), (t.max = t.min + dn(e));
}
function vn(t, e, s) {
  (t.min = e.min - s.min), (t.max = t.min + dn(e));
}
function gn(t, e, s) {
  vn(t.x, e.x, s.x), vn(t.y, e.y, s.y);
}
function yn(t, e, s) {
  return {
    min: void 0 !== e ? t.min + e : void 0,
    max: void 0 !== s ? t.max + s - (t.max - t.min) : void 0,
  };
}
function xn(t, e) {
  let s = e.min - t.min,
    n = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([s, n] = [n, s]), { min: s, max: n };
}
const Pn = 0.35;
function Tn(t, e, s) {
  return { min: wn(t, e), max: wn(t, s) };
}
function wn(t, e) {
  return 'number' == typeof t ? t : t[e] || 0;
}
const Sn = () => ({
    x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
    y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
  }),
  An = () => ({ x: { min: 0, max: 0 }, y: { min: 0, max: 0 } });
function bn(t) {
  return [t('x'), t('y')];
}
function Cn({ top: t, left: e, right: s, bottom: n }) {
  return { x: { min: e, max: s }, y: { min: t, max: n } };
}
function Vn(t) {
  return void 0 === t || 1 === t;
}
function En({ scale: t, scaleX: e, scaleY: s }) {
  return !Vn(t) || !Vn(e) || !Vn(s);
}
function Mn(t) {
  return En(t) || Dn(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function Dn(t) {
  return Rn(t.x) || Rn(t.y);
}
function Rn(t) {
  return t && '0%' !== t;
}
function kn(t, e, s) {
  return s + e * (t - s);
}
function jn(t, e, s, n, i) {
  return void 0 !== i && (t = kn(t, i, n)), kn(t, s, n) + e;
}
function Ln(t, e = 0, s = 1, n, i) {
  (t.min = jn(t.min, e, s, n, i)), (t.max = jn(t.max, e, s, n, i));
}
function Fn(t, { x: e, y: s }) {
  Ln(t.x, e.translate, e.scale, e.originPoint), Ln(t.y, s.translate, s.scale, s.originPoint);
}
const Bn = 0.999999999999,
  On = 1.0000000000001;
function In(t, e) {
  (t.min = t.min + e), (t.max = t.max + e);
}
function Un(t, e, s, n, i = 0.5) {
  Ln(t, e, s, Fe(t.min, t.max, i), n);
}
function Wn(t, e) {
  Un(t.x, e.x, e.scaleX, e.scale, e.originX), Un(t.y, e.y, e.scaleY, e.scale, e.originY);
}
function Nn(t, e) {
  return Cn(
    (function (t, e) {
      if (!e) return t;
      const s = e({ x: t.left, y: t.top }),
        n = e({ x: t.right, y: t.bottom });
      return { top: s.y, left: s.x, bottom: n.y, right: n.x };
    })(t.getBoundingClientRect(), e),
  );
}
const $n = ({ current: t }) => (t ? t.ownerDocument.defaultView : null),
  zn = new WeakMap();
class Kn {
  constructor(t) {
    (this.openGlobalLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = An()),
      (this.visualElement = t);
  }
  start(t, { snapToCursor: e = !1 } = {}) {
    const { presenceContext: s } = this.visualElement;
    if (s && !1 === s.isPresent) return;
    const { dragSnapToOrigin: n } = this.getProps();
    this.panSession = new Gs(
      t,
      {
        onSessionStart: (t) => {
          const { dragSnapToOrigin: s } = this.getProps();
          s ? this.pauseAnimation() : this.stopAnimation(),
            e && this.snapToCursor(zs(t, 'page').point);
        },
        onStart: (t, e) => {
          var s;
          const { drag: n, dragPropagation: i, onDragStart: o } = this.getProps();
          if (
            n &&
            !i &&
            (this.openGlobalLock && this.openGlobalLock(),
            (this.openGlobalLock = on(n)),
            !this.openGlobalLock)
          )
            return;
          (this.isDragging = !0),
            (this.currentDirection = null),
            this.resolveConstraints(),
            this.visualElement.projection &&
              ((this.visualElement.projection.isAnimationBlocked = !0),
              (this.visualElement.projection.target = void 0)),
            bn((t) => {
              let e = this.getAxisMotionValue(t).get() || 0;
              if (J.test(e)) {
                const { projection: s } = this.visualElement;
                if (s && s.layout) {
                  const n = s.layout.layoutBox[t];
                  if (n) {
                    e = dn(n) * (parseFloat(e) / 100);
                  }
                }
              }
              this.originPoint[t] = e;
            }),
            o && V.postRender(() => o(t, e)),
            null === (s = this.removeWillChange) || void 0 === s || s.call(this),
            (this.removeWillChange = Es(this.visualElement, 'transform'));
          const { animationState: r } = this.visualElement;
          r && r.setActive('whileDrag', !0);
        },
        onMove: (t, e) => {
          const {
            dragPropagation: s,
            dragDirectionLock: n,
            onDirectionLock: i,
            onDrag: o,
          } = this.getProps();
          if (!s && !this.openGlobalLock) return;
          const { offset: r } = e;
          if (n && null === this.currentDirection)
            return (
              (this.currentDirection = (function (t, e = 10) {
                let s = null;
                Math.abs(t.y) > e ? (s = 'y') : Math.abs(t.x) > e && (s = 'x');
                return s;
              })(r)),
              void (null !== this.currentDirection && i && i(this.currentDirection))
            );
          this.updateAxis('x', e.point, r),
            this.updateAxis('y', e.point, r),
            this.visualElement.render(),
            o && o(t, e);
        },
        onSessionEnd: (t, e) => this.stop(t, e),
        resumeAnimation: () =>
          bn((t) => {
            var e;
            return (
              'paused' === this.getAnimationState(t) &&
              (null === (e = this.getAxisMotionValue(t).animation) || void 0 === e
                ? void 0
                : e.play())
            );
          }),
      },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: n,
        contextWindow: $n(this.visualElement),
      },
    );
  }
  stop(t, e) {
    var s;
    null === (s = this.removeWillChange) || void 0 === s || s.call(this);
    const n = this.isDragging;
    if ((this.cancel(), !n)) return;
    const { velocity: i } = e;
    this.startAnimation(i);
    const { onDragEnd: o } = this.getProps();
    o && V.postRender(() => o(t, e));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: e } = this.visualElement;
    t && (t.isAnimationBlocked = !1),
      this.panSession && this.panSession.end(),
      (this.panSession = void 0);
    const { dragPropagation: s } = this.getProps();
    !s && this.openGlobalLock && (this.openGlobalLock(), (this.openGlobalLock = null)),
      e && e.setActive('whileDrag', !1);
  }
  updateAxis(t, e, s) {
    const { drag: n } = this.getProps();
    if (!s || !Yn(t, n, this.currentDirection)) return;
    const i = this.getAxisMotionValue(t);
    let o = this.originPoint[t] + s[t];
    this.constraints &&
      this.constraints[t] &&
      (o = (function (t, { min: e, max: s }, n) {
        return (
          void 0 !== e && t < e
            ? (t = n ? Fe(e, t, n.min) : Math.max(t, e))
            : void 0 !== s && t > s && (t = n ? Fe(s, t, n.max) : Math.min(t, s)),
          t
        );
      })(o, this.constraints[t], this.elastic[t])),
      i.set(o);
  }
  resolveConstraints() {
    var t;
    const { dragConstraints: e, dragElastic: s } = this.getProps(),
      n =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : null === (t = this.visualElement.projection) || void 0 === t
            ? void 0
            : t.layout,
      i = this.constraints;
    e && an(e)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : (this.constraints =
          !(!e || !n) &&
          (function (t, { top: e, left: s, bottom: n, right: i }) {
            return { x: yn(t.x, s, i), y: yn(t.y, e, n) };
          })(n.layoutBox, e)),
      (this.elastic = (function (t = Pn) {
        return (
          !1 === t ? (t = 0) : !0 === t && (t = Pn),
          { x: Tn(t, 'left', 'right'), y: Tn(t, 'top', 'bottom') }
        );
      })(s)),
      i !== this.constraints &&
        n &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        bn((t) => {
          !1 !== this.constraints &&
            this.getAxisMotionValue(t) &&
            (this.constraints[t] = (function (t, e) {
              const s = {};
              return (
                void 0 !== e.min && (s.min = e.min - t.min),
                void 0 !== e.max && (s.max = e.max - t.min),
                s
              );
            })(n.layoutBox[t], this.constraints[t]));
        });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: e } = this.getProps();
    if (!t || !an(t)) return !1;
    const s = t.current,
      { projection: n } = this.visualElement;
    if (!n || !n.layout) return !1;
    const i = (function (t, e, s) {
      const n = Nn(t, s),
        { scroll: i } = e;
      return i && (In(n.x, i.offset.x), In(n.y, i.offset.y)), n;
    })(s, n.root, this.visualElement.getTransformPagePoint());
    let o = (function (t, e) {
      return { x: xn(t.x, e.x), y: xn(t.y, e.y) };
    })(n.layout.layoutBox, i);
    if (e) {
      const t = e(
        (function ({ x: t, y: e }) {
          return { top: e.min, right: t.max, bottom: e.max, left: t.min };
        })(o),
      );
      (this.hasMutatedConstraints = !!t), t && (o = Cn(t));
    }
    return o;
  }
  startAnimation(t) {
    const {
        drag: e,
        dragMomentum: s,
        dragElastic: n,
        dragTransition: i,
        dragSnapToOrigin: o,
        onDragTransitionEnd: r,
      } = this.getProps(),
      a = this.constraints || {},
      l = bn((r) => {
        if (!Yn(r, e, this.currentDirection)) return;
        let l = (a && a[r]) || {};
        o && (l = { min: 0, max: 0 });
        const u = n ? 200 : 1e6,
          h = n ? 40 : 1e7,
          c = {
            type: 'inertia',
            velocity: s ? t[r] : 0,
            bounceStiffness: u,
            bounceDamping: h,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...i,
            ...l,
          };
        return this.startAxisValueAnimation(r, c);
      });
    return Promise.all(l).then(r);
  }
  startAxisValueAnimation(t, e) {
    const s = this.getAxisMotionValue(t);
    return s.start(ps(t, s, 0, e, this.visualElement, !1, Es(this.visualElement, t)));
  }
  stopAnimation() {
    bn((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    bn((t) => {
      var e;
      return null === (e = this.getAxisMotionValue(t).animation) || void 0 === e
        ? void 0
        : e.pause();
    });
  }
  getAnimationState(t) {
    var e;
    return null === (e = this.getAxisMotionValue(t).animation) || void 0 === e ? void 0 : e.state;
  }
  getAxisMotionValue(t) {
    const e = `_drag${t.toUpperCase()}`,
      s = this.visualElement.getProps(),
      n = s[e];
    return n || this.visualElement.getValue(t, (s.initial ? s.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    bn((e) => {
      const { drag: s } = this.getProps();
      if (!Yn(e, s, this.currentDirection)) return;
      const { projection: n } = this.visualElement,
        i = this.getAxisMotionValue(e);
      if (n && n.layout) {
        const { min: s, max: o } = n.layout.layoutBox[e];
        i.set(t[e] - Fe(s, o, 0.5));
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: t, dragConstraints: e } = this.getProps(),
      { projection: s } = this.visualElement;
    if (!an(e) || !s || !this.constraints) return;
    this.stopAnimation();
    const n = { x: 0, y: 0 };
    bn((t) => {
      const e = this.getAxisMotionValue(t);
      if (e && !1 !== this.constraints) {
        const s = e.get();
        n[t] = (function (t, e) {
          let s = 0.5;
          const n = dn(t),
            i = dn(e);
          return (
            i > n ? (s = Le(e.min, e.max - n, t.min)) : n > i && (s = Le(t.min, t.max - i, e.min)),
            N(0, 1, s)
          );
        })({ min: s, max: s }, this.constraints[t]);
      }
    });
    const { transformTemplate: i } = this.visualElement.getProps();
    (this.visualElement.current.style.transform = i ? i({}, '') : 'none'),
      s.root && s.root.updateScroll(),
      s.updateLayout(),
      this.resolveConstraints(),
      bn((e) => {
        if (!Yn(e, t, null)) return;
        const s = this.getAxisMotionValue(e),
          { min: i, max: o } = this.constraints[e];
        s.set(Fe(i, o, n[e]));
      });
  }
  addListeners() {
    if (!this.visualElement.current) return;
    zn.set(this.visualElement, this);
    const t = Hs(this.visualElement.current, 'pointerdown', (t) => {
        const { drag: e, dragListener: s = !0 } = this.getProps();
        e && s && this.start(t);
      }),
      e = () => {
        const { dragConstraints: t } = this.getProps();
        an(t) && t.current && (this.constraints = this.resolveRefConstraints());
      },
      { projection: s } = this.visualElement,
      n = s.addEventListener('measure', e);
    s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()), V.read(e);
    const i = Ys(window, 'resize', () => this.scalePositionWithinConstraints()),
      o = s.addEventListener('didUpdate', ({ delta: t, hasLayoutChanged: e }) => {
        this.isDragging &&
          e &&
          (bn((e) => {
            const s = this.getAxisMotionValue(e);
            s && ((this.originPoint[e] += t[e].translate), s.set(s.get() + t[e].translate));
          }),
          this.visualElement.render());
      });
    return () => {
      i(), t(), n(), o && o();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(),
      {
        drag: e = !1,
        dragDirectionLock: s = !1,
        dragPropagation: n = !1,
        dragConstraints: i = !1,
        dragElastic: o = Pn,
        dragMomentum: r = !0,
      } = t;
    return {
      ...t,
      drag: e,
      dragDirectionLock: s,
      dragPropagation: n,
      dragConstraints: i,
      dragElastic: o,
      dragMomentum: r,
    };
  }
}
function Yn(t, e, s) {
  return !((!0 !== e && e !== t) || (null !== s && s !== t));
}
const Hn = (t) => (e, s) => {
  t && V.postRender(() => t(e, s));
};
const Xn = t.createContext(null);
const Gn = t.createContext({}),
  qn = t.createContext({}),
  Zn = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
function _n(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
const Jn = {
    correct: (t, e) => {
      if (!e.target) return t;
      if ('string' == typeof t) {
        if (!Q.test(t)) return t;
        t = parseFloat(t);
      }
      return `${_n(t, e.target.x)}% ${_n(t, e.target.y)}%`;
    },
  },
  Qn = {
    correct: (t, { treeScale: e, projectionDelta: s }) => {
      const n = t,
        i = Bt.parse(t);
      if (i.length > 5) return n;
      const o = Bt.createTransformer(t),
        r = 'number' != typeof i[0] ? 1 : 0,
        a = s.x.scale * e.x,
        l = s.y.scale * e.y;
      (i[0 + r] /= a), (i[1 + r] /= l);
      const u = Fe(a, l, 0.5);
      return (
        'number' == typeof i[2 + r] && (i[2 + r] /= u),
        'number' == typeof i[3 + r] && (i[3 + r] /= u),
        o(i)
      );
    },
  },
  ti = {};
const { schedule: ei } = C(queueMicrotask, !1);
class si extends t.Component {
  componentDidMount() {
    const { visualElement: t, layoutGroup: e, switchLayoutGroup: s, layoutId: n } = this.props,
      { projection: i } = t;
    var o;
    (o = ii),
      Object.assign(ti, o),
      i &&
        (e.group && e.group.add(i),
        s && s.register && n && s.register(i),
        i.root.didUpdate(),
        i.addEventListener('animationComplete', () => {
          this.safeToRemove();
        }),
        i.setOptions({ ...i.options, onExitComplete: () => this.safeToRemove() })),
      (Zn.hasEverUpdated = !0);
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: e, visualElement: s, drag: n, isPresent: i } = this.props,
      o = s.projection;
    return o
      ? ((o.isPresent = i),
        n || t.layoutDependency !== e || void 0 === e ? o.willUpdate() : this.safeToRemove(),
        t.isPresent !== i &&
          (i
            ? o.promote()
            : o.relegate() ||
              V.postRender(() => {
                const t = o.getStack();
                (t && t.members.length) || this.safeToRemove();
              })),
        null)
      : null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t &&
      (t.root.didUpdate(),
      ei.postRender(() => {
        !t.currentAnimation && t.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: e, switchLayoutGroup: s } = this.props,
      { projection: n } = t;
    n &&
      (n.scheduleCheckAfterUnmount(),
      e && e.group && e.group.remove(n),
      s && s.deregister && s.deregister(n));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function ni(s) {
  const [n, i] = (function () {
      const e = t.useContext(Xn);
      if (null === e) return [!0, null];
      const { isPresent: s, onExitComplete: n, register: i } = e,
        o = t.useId();
      t.useEffect(() => i(o), []);
      const r = t.useCallback(() => n && n(o), [o, n]);
      return !s && n ? [!1, r] : [!0];
    })(),
    o = t.useContext(Gn);
  return e.jsx(si, {
    ...s,
    layoutGroup: o,
    switchLayoutGroup: t.useContext(qn),
    isPresent: n,
    safeToRemove: i,
  });
}
const ii = {
    borderRadius: {
      ...Jn,
      applyTo: [
        'borderTopLeftRadius',
        'borderTopRightRadius',
        'borderBottomLeftRadius',
        'borderBottomRightRadius',
      ],
    },
    borderTopLeftRadius: Jn,
    borderTopRightRadius: Jn,
    borderBottomLeftRadius: Jn,
    borderBottomRightRadius: Jn,
    boxShadow: Qn,
  },
  oi = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
  ri = oi.length,
  ai = (t) => ('string' == typeof t ? parseFloat(t) : t),
  li = (t) => 'number' == typeof t || Q.test(t);
function ui(t, e) {
  return void 0 !== t[e] ? t[e] : t.borderRadius;
}
const hi = di(0, 0.5, Ce),
  ci = di(0.5, 0.95, A);
function di(t, e, s) {
  return (n) => (n < t ? 0 : n > e ? 1 : s(Le(t, e, n)));
}
function pi(t, e) {
  (t.min = e.min), (t.max = e.max);
}
function mi(t, e) {
  pi(t.x, e.x), pi(t.y, e.y);
}
function fi(t, e) {
  (t.translate = e.translate),
    (t.scale = e.scale),
    (t.originPoint = e.originPoint),
    (t.origin = e.origin);
}
function vi(t, e, s, n, i) {
  return (t = kn((t -= e), 1 / s, n)), void 0 !== i && (t = kn(t, 1 / i, n)), t;
}
function gi(t, e, [s, n, i], o, r) {
  !(function (t, e = 0, s = 1, n = 0.5, i, o = t, r = t) {
    J.test(e) && ((e = parseFloat(e)), (e = Fe(r.min, r.max, e / 100) - r.min));
    if ('number' != typeof e) return;
    let a = Fe(o.min, o.max, n);
    t === o && (a -= e), (t.min = vi(t.min, e, s, a, i)), (t.max = vi(t.max, e, s, a, i));
  })(t, e[s], e[n], e[i], e.scale, o, r);
}
const yi = ['x', 'scaleX', 'originX'],
  xi = ['y', 'scaleY', 'originY'];
function Pi(t, e, s, n) {
  gi(t.x, e, yi, s ? s.x : void 0, n ? n.x : void 0),
    gi(t.y, e, xi, s ? s.y : void 0, n ? n.y : void 0);
}
function Ti(t) {
  return 0 === t.translate && 1 === t.scale;
}
function wi(t) {
  return Ti(t.x) && Ti(t.y);
}
function Si(t, e) {
  return t.min === e.min && t.max === e.max;
}
function Ai(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function bi(t, e) {
  return Ai(t.x, e.x) && Ai(t.y, e.y);
}
function Ci(t) {
  return dn(t.x) / dn(t.y);
}
function Vi(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
class Ei {
  constructor() {
    this.members = [];
  }
  add(t) {
    vs(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if ((gs(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead)) {
      const t = this.members[this.members.length - 1];
      t && this.promote(t);
    }
  }
  relegate(t) {
    const e = this.members.findIndex((e) => t === e);
    if (0 === e) return !1;
    let s;
    for (let n = e; n >= 0; n--) {
      const t = this.members[n];
      if (!1 !== t.isPresent) {
        s = t;
        break;
      }
    }
    return !!s && (this.promote(s), !0);
  }
  promote(t, e) {
    const s = this.lead;
    if (t !== s && ((this.prevLead = s), (this.lead = t), t.show(), s)) {
      s.instance && s.scheduleRender(),
        t.scheduleRender(),
        (t.resumeFrom = s),
        e && (t.resumeFrom.preserveOpacity = !0),
        s.snapshot &&
          ((t.snapshot = s.snapshot),
          (t.snapshot.latestValues = s.animationValues || s.latestValues)),
        t.root && t.root.isUpdating && (t.isLayoutDirty = !0);
      const { crossfade: n } = t.options;
      !1 === n && s.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: e, resumingFrom: s } = t;
      e.onExitComplete && e.onExitComplete(),
        s && s.options.onExitComplete && s.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
const Mi = (t, e) => t.depth - e.depth;
class Di {
  constructor() {
    (this.children = []), (this.isDirty = !1);
  }
  add(t) {
    vs(this.children, t), (this.isDirty = !0);
  }
  remove(t) {
    gs(this.children, t), (this.isDirty = !0);
  }
  forEach(t) {
    this.isDirty && this.children.sort(Mi), (this.isDirty = !1), this.children.forEach(t);
  }
}
function Ri(t) {
  const e = Vs(t) ? t.get() : t;
  return ms(e) ? e.toValue() : e;
}
const ki = {
    type: 'projectionFrame',
    totalNodes: 0,
    resolvedTargetDeltas: 0,
    recalculatedProjection: 0,
  },
  ji = 'undefined' != typeof window && void 0 !== window.MotionDebug,
  Li = ['', 'X', 'Y', 'Z'],
  Fi = { visibility: 'hidden' };
let Bi = 0;
function Oi(t, e, s, n) {
  const { latestValues: i } = e;
  i[t] && ((s[t] = i[t]), e.setStaticValue(t, 0), n && (n[t] = 0));
}
function Ii(t) {
  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const s = As(e);
  if (window.MotionHasOptimisedAnimation(s, 'transform')) {
    const { layout: e, layoutId: n } = t.options;
    window.MotionCancelOptimisedAnimation(s, 'transform', V, !(e || n));
  }
  const { parent: n } = t;
  n && !n.hasCheckedOptimisedAppear && Ii(n);
}
function Ui({
  attachResizeListener: t,
  defaultParent: e,
  measureScroll: s,
  checkIsScrollRoot: n,
  resetTransform: i,
}) {
  return class {
    constructor(t = {}, s = null == e ? void 0 : e()) {
      (this.id = Bi++),
        (this.animationId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          (this.projectionUpdateScheduled = !1),
            ji && (ki.totalNodes = ki.resolvedTargetDeltas = ki.recalculatedProjection = 0),
            this.nodes.forEach($i),
            this.nodes.forEach(qi),
            this.nodes.forEach(Zi),
            this.nodes.forEach(zi),
            ji && window.MotionDebug.record(ki);
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = t),
        (this.root = s ? s.root || s : this),
        (this.path = s ? [...s.path, s] : []),
        (this.parent = s),
        (this.depth = s ? s.depth + 1 : 0);
      for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Di());
    }
    addEventListener(t, e) {
      return (
        this.eventHandlers.has(t) || this.eventHandlers.set(t, new ys()),
        this.eventHandlers.get(t).add(e)
      );
    }
    notifyListeners(t, ...e) {
      const s = this.eventHandlers.get(t);
      s && s.notify(...e);
    }
    hasListeners(t) {
      return this.eventHandlers.has(t);
    }
    mount(e, s = this.root.hasTreeAnimated) {
      if (this.instance) return;
      var n;
      (this.isSVG = (n = e) instanceof SVGElement && 'svg' !== n.tagName), (this.instance = e);
      const { layoutId: i, layout: o, visualElement: r } = this.options;
      if (
        (r && !r.current && r.mount(e),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        s && (o || i) && (this.isLayoutDirty = !0),
        t)
      ) {
        let s;
        const n = () => (this.root.updateBlockedByResize = !1);
        t(e, () => {
          (this.root.updateBlockedByResize = !0),
            s && s(),
            (s = (function (t, e) {
              const s = _t.now(),
                n = ({ timestamp: i }) => {
                  const o = i - s;
                  o >= e && (E(n), t(o - e));
                };
              return V.read(n, !0), () => E(n);
            })(n, 250)),
            Zn.hasAnimatedSinceResize && ((Zn.hasAnimatedSinceResize = !1), this.nodes.forEach(Gi));
        });
      }
      i && this.root.registerSharedNode(i, this),
        !1 !== this.options.animate &&
          r &&
          (i || o) &&
          this.addEventListener(
            'didUpdate',
            ({ delta: t, hasLayoutChanged: e, hasRelativeTargetChanged: s, layout: n }) => {
              if (this.isTreeAnimationBlocked())
                return (this.target = void 0), void (this.relativeTarget = void 0);
              const i = this.options.transition || r.getDefaultTransition() || so,
                { onLayoutAnimationStart: o, onLayoutAnimationComplete: a } = r.getProps(),
                l = !this.targetLayout || !bi(this.targetLayout, n) || s,
                u = !e && s;
              if (
                this.options.layoutRoot ||
                (this.resumeFrom && this.resumeFrom.instance) ||
                u ||
                (e && (l || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0)),
                  this.setAnimationOrigin(t, u);
                const e = { ...P(i, 'layout'), onPlay: o, onComplete: a };
                (r.shouldReduceMotion || this.options.layoutRoot) && ((e.delay = 0), (e.type = !1)),
                  this.startAnimation(e);
              } else
                e || Gi(this),
                  this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
              this.targetLayout = n;
            },
          );
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const t = this.getStack();
      t && t.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        E(this.updateProjection);
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0), this.nodes && this.nodes.forEach(_i), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: t } = this.options;
      return t && t.getProps().transformTemplate;
    }
    willUpdate(t = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked()))
        return void (this.options.onExitComplete && this.options.onExitComplete());
      if (
        (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Ii(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let i = 0; i < this.path.length; i++) {
        const t = this.path[i];
        (t.shouldResetTransform = !0),
          t.updateScroll('snapshot'),
          t.options.layoutRoot && t.willUpdate(!1);
      }
      const { layoutId: e, layout: s } = this.options;
      if (void 0 === e && !s) return;
      const n = this.getTransformTemplate();
      (this.prevTransformTemplateValue = n ? n(this.latestValues, '') : void 0),
        this.updateSnapshot(),
        t && this.notifyListeners('willUpdate');
    }
    update() {
      this.updateScheduled = !1;
      if (this.isUpdateBlocked())
        return this.unblockUpdate(), this.clearAllSnapshots(), void this.nodes.forEach(Yi);
      this.isUpdating || this.nodes.forEach(Hi),
        (this.isUpdating = !1),
        this.nodes.forEach(Xi),
        this.nodes.forEach(Wi),
        this.nodes.forEach(Ni),
        this.clearAllSnapshots();
      const t = _t.now();
      (M.delta = N(0, 1e3 / 60, t - M.timestamp)),
        (M.timestamp = t),
        (M.isProcessing = !0),
        D.update.process(M),
        D.preRender.process(M),
        D.render.process(M),
        (M.isProcessing = !1);
    }
    didUpdate() {
      this.updateScheduled || ((this.updateScheduled = !0), ei.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(Ki), this.sharedNodes.forEach(Ji);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0), V.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      V.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      !this.snapshot && this.instance && (this.snapshot = this.measure());
    }
    updateLayout() {
      if (!this.instance) return;
      if (
        (this.updateScroll(),
        !((this.options.alwaysMeasureLayout && this.isLead()) || this.isLayoutDirty))
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let s = 0; s < this.path.length; s++) {
          this.path[s].updateScroll();
        }
      const t = this.layout;
      (this.layout = this.measure(!1)),
        (this.layoutCorrected = An()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners('measure', this.layout.layoutBox);
      const { visualElement: e } = this.options;
      e && e.notify('LayoutMeasure', this.layout.layoutBox, t ? t.layoutBox : void 0);
    }
    updateScroll(t = 'measure') {
      let e = Boolean(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === t &&
          (e = !1),
        e)
      ) {
        const e = n(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: t,
          isRoot: e,
          offset: s(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : e,
        };
      }
    }
    resetTransform() {
      if (!i) return;
      const t = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
        e = this.projectionDelta && !wi(this.projectionDelta),
        s = this.getTransformTemplate(),
        n = s ? s(this.latestValues, '') : void 0,
        o = n !== this.prevTransformTemplateValue;
      t &&
        (e || Mn(this.latestValues) || o) &&
        (i(this.instance, n), (this.shouldResetTransform = !1), this.scheduleRender());
    }
    measure(t = !0) {
      const e = this.measurePageBox();
      let s = this.removeElementScroll(e);
      var n;
      return (
        t && (s = this.removeTransform(s)),
        oo((n = s).x),
        oo(n.y),
        {
          animationId: this.root.animationId,
          measuredBox: e,
          layoutBox: s,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      var t;
      const { visualElement: e } = this.options;
      if (!e) return An();
      const s = e.measureViewportBox();
      if (
        !((null === (t = this.scroll) || void 0 === t ? void 0 : t.wasRoot) || this.path.some(ao))
      ) {
        const { scroll: t } = this.root;
        t && (In(s.x, t.offset.x), In(s.y, t.offset.y));
      }
      return s;
    }
    removeElementScroll(t) {
      var e;
      const s = An();
      if ((mi(s, t), null === (e = this.scroll) || void 0 === e ? void 0 : e.wasRoot)) return s;
      for (let n = 0; n < this.path.length; n++) {
        const e = this.path[n],
          { scroll: i, options: o } = e;
        e !== this.root &&
          i &&
          o.layoutScroll &&
          (i.wasRoot && mi(s, t), In(s.x, i.offset.x), In(s.y, i.offset.y));
      }
      return s;
    }
    applyTransform(t, e = !1) {
      const s = An();
      mi(s, t);
      for (let n = 0; n < this.path.length; n++) {
        const t = this.path[n];
        !e &&
          t.options.layoutScroll &&
          t.scroll &&
          t !== t.root &&
          Wn(s, { x: -t.scroll.offset.x, y: -t.scroll.offset.y }),
          Mn(t.latestValues) && Wn(s, t.latestValues);
      }
      return Mn(this.latestValues) && Wn(s, this.latestValues), s;
    }
    removeTransform(t) {
      const e = An();
      mi(e, t);
      for (let s = 0; s < this.path.length; s++) {
        const t = this.path[s];
        if (!t.instance) continue;
        if (!Mn(t.latestValues)) continue;
        En(t.latestValues) && t.updateSnapshot();
        const n = An();
        mi(n, t.measurePageBox()),
          Pi(e, t.latestValues, t.snapshot ? t.snapshot.layoutBox : void 0, n);
      }
      return Mn(this.latestValues) && Pi(e, this.latestValues), e;
    }
    setTargetDelta(t) {
      (this.targetDelta = t), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0);
    }
    setOptions(t) {
      this.options = { ...this.options, ...t, crossfade: void 0 === t.crossfade || t.crossfade };
    }
    clearMeasurements() {
      (this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1);
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== M.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(t = !1) {
      var e;
      const s = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = s.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = s.isTransformDirty),
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = s.isSharedProjectionDirty);
      const n = Boolean(this.resumingFrom) || this !== s;
      if (
        !(
          t ||
          (n && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          (null === (e = this.parent) || void 0 === e ? void 0 : e.isProjectionDirty) ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      const { layout: i, layoutId: o } = this.options;
      if (this.layout && (i || o)) {
        if (
          ((this.resolvedRelativeTargetAt = M.timestamp), !this.targetDelta && !this.relativeTarget)
        ) {
          const t = this.getClosestProjectingParent();
          t && t.layout && 1 !== this.animationProgress
            ? ((this.relativeParent = t),
              this.forceRelativeParentToResolveTarget(),
              (this.relativeTarget = An()),
              (this.relativeTargetOrigin = An()),
              gn(this.relativeTargetOrigin, this.layout.layoutBox, t.layout.layoutBox),
              mi(this.relativeTarget, this.relativeTargetOrigin))
            : (this.relativeParent = this.relativeTarget = void 0);
        }
        if (this.relativeTarget || this.targetDelta) {
          var r, a, l;
          if (
            (this.target || ((this.target = An()), (this.targetWithTransforms = An())),
            this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.relativeParent &&
            this.relativeParent.target
              ? (this.forceRelativeParentToResolveTarget(),
                (r = this.target),
                (a = this.relativeTarget),
                (l = this.relativeParent.target),
                fn(r.x, a.x, l.x),
                fn(r.y, a.y, l.y))
              : this.targetDelta
                ? (Boolean(this.resumingFrom)
                    ? (this.target = this.applyTransform(this.layout.layoutBox))
                    : mi(this.target, this.layout.layoutBox),
                  Fn(this.target, this.targetDelta))
                : mi(this.target, this.layout.layoutBox),
            this.attemptToResolveRelativeTarget)
          ) {
            this.attemptToResolveRelativeTarget = !1;
            const t = this.getClosestProjectingParent();
            t &&
            Boolean(t.resumingFrom) === Boolean(this.resumingFrom) &&
            !t.options.layoutScroll &&
            t.target &&
            1 !== this.animationProgress
              ? ((this.relativeParent = t),
                this.forceRelativeParentToResolveTarget(),
                (this.relativeTarget = An()),
                (this.relativeTargetOrigin = An()),
                gn(this.relativeTargetOrigin, this.target, t.target),
                mi(this.relativeTarget, this.relativeTargetOrigin))
              : (this.relativeParent = this.relativeTarget = void 0);
          }
          ji && ki.resolvedTargetDeltas++;
        }
      }
    }
    getClosestProjectingParent() {
      if (this.parent && !En(this.parent.latestValues) && !Dn(this.parent.latestValues))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return Boolean(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout,
      );
    }
    calcProjection() {
      var t;
      const e = this.getLead(),
        s = Boolean(this.resumingFrom) || this !== e;
      let n = !0;
      if (
        ((this.isProjectionDirty ||
          (null === (t = this.parent) || void 0 === t ? void 0 : t.isProjectionDirty)) &&
          (n = !1),
        s && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1),
        this.resolvedRelativeTargetAt === M.timestamp && (n = !1),
        n)
      )
        return;
      const { layout: i, layoutId: o } = this.options;
      if (
        ((this.isTreeAnimating = Boolean(
          (this.parent && this.parent.isTreeAnimating) ||
            this.currentAnimation ||
            this.pendingAnimation,
        )),
        this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || (!i && !o))
      )
        return;
      mi(this.layoutCorrected, this.layout.layoutBox);
      const r = this.treeScale.x,
        a = this.treeScale.y;
      !(function (t, e, s, n = !1) {
        const i = s.length;
        if (!i) return;
        let o, r;
        e.x = e.y = 1;
        for (let a = 0; a < i; a++) {
          (o = s[a]), (r = o.projectionDelta);
          const { visualElement: i } = o.options;
          (i && i.props.style && 'contents' === i.props.style.display) ||
            (n &&
              o.options.layoutScroll &&
              o.scroll &&
              o !== o.root &&
              Wn(t, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }),
            r && ((e.x *= r.x.scale), (e.y *= r.y.scale), Fn(t, r)),
            n && Mn(o.latestValues) && Wn(t, o.latestValues));
        }
        e.x < On && e.x > Bn && (e.x = 1), e.y < On && e.y > Bn && (e.y = 1);
      })(this.layoutCorrected, this.treeScale, this.path, s),
        !e.layout ||
          e.target ||
          (1 === this.treeScale.x && 1 === this.treeScale.y) ||
          ((e.target = e.layout.layoutBox), (e.targetWithTransforms = An()));
      const { target: l } = e;
      l
        ? (this.projectionDelta && this.prevProjectionDelta
            ? (fi(this.prevProjectionDelta.x, this.projectionDelta.x),
              fi(this.prevProjectionDelta.y, this.projectionDelta.y))
            : this.createProjectionDeltas(),
          mn(this.projectionDelta, this.layoutCorrected, l, this.latestValues),
          (this.treeScale.x === r &&
            this.treeScale.y === a &&
            Vi(this.projectionDelta.x, this.prevProjectionDelta.x) &&
            Vi(this.projectionDelta.y, this.prevProjectionDelta.y)) ||
            ((this.hasProjected = !0),
            this.scheduleRender(),
            this.notifyListeners('projectionUpdate', l)),
          ji && ki.recalculatedProjection++)
        : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(t = !0) {
      var e;
      if ((null === (e = this.options.visualElement) || void 0 === e || e.scheduleRender(), t)) {
        const t = this.getStack();
        t && t.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      (this.prevProjectionDelta = Sn()),
        (this.projectionDelta = Sn()),
        (this.projectionDeltaWithTransform = Sn());
    }
    setAnimationOrigin(t, e = !1) {
      const s = this.snapshot,
        n = s ? s.latestValues : {},
        i = { ...this.latestValues },
        o = Sn();
      (this.relativeParent && this.relativeParent.options.layoutRoot) ||
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !e);
      const r = An(),
        a = (s ? s.source : void 0) !== (this.layout ? this.layout.source : void 0),
        l = this.getStack(),
        u = !l || l.members.length <= 1,
        h = Boolean(a && !u && !0 === this.options.crossfade && !this.path.some(eo));
      let c;
      (this.animationProgress = 0),
        (this.mixTargetDelta = (e) => {
          const s = e / 1e3;
          var l, d, p, m, f, v;
          Qi(o.x, t.x, s),
            Qi(o.y, t.y, s),
            this.setTargetDelta(o),
            this.relativeTarget &&
              this.relativeTargetOrigin &&
              this.layout &&
              this.relativeParent &&
              this.relativeParent.layout &&
              (gn(r, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
              (p = this.relativeTarget),
              (m = this.relativeTargetOrigin),
              (f = r),
              (v = s),
              to(p.x, m.x, f.x, v),
              to(p.y, m.y, f.y, v),
              c &&
                ((l = this.relativeTarget), (d = c), Si(l.x, d.x) && Si(l.y, d.y)) &&
                (this.isProjectionDirty = !1),
              c || (c = An()),
              mi(c, this.relativeTarget)),
            a &&
              ((this.animationValues = i),
              (function (t, e, s, n, i, o) {
                i
                  ? ((t.opacity = Fe(0, void 0 !== s.opacity ? s.opacity : 1, hi(n))),
                    (t.opacityExit = Fe(void 0 !== e.opacity ? e.opacity : 1, 0, ci(n))))
                  : o &&
                    (t.opacity = Fe(
                      void 0 !== e.opacity ? e.opacity : 1,
                      void 0 !== s.opacity ? s.opacity : 1,
                      n,
                    ));
                for (let r = 0; r < ri; r++) {
                  const i = `border${oi[r]}Radius`;
                  let o = ui(e, i),
                    a = ui(s, i);
                  (void 0 === o && void 0 === a) ||
                    (o || (o = 0),
                    a || (a = 0),
                    0 === o || 0 === a || li(o) === li(a)
                      ? ((t[i] = Math.max(Fe(ai(o), ai(a), n), 0)),
                        (J.test(a) || J.test(o)) && (t[i] += '%'))
                      : (t[i] = a));
                }
                (e.rotate || s.rotate) && (t.rotate = Fe(e.rotate || 0, s.rotate || 0, n));
              })(i, n, this.latestValues, s, h, u)),
            this.root.scheduleUpdateProjection(),
            this.scheduleRender(),
            (this.animationProgress = s);
        }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(t) {
      this.notifyListeners('animationStart'),
        this.currentAnimation && this.currentAnimation.stop(),
        this.resumingFrom &&
          this.resumingFrom.currentAnimation &&
          this.resumingFrom.currentAnimation.stop(),
        this.pendingAnimation && (E(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = V.update(() => {
          (Zn.hasAnimatedSinceResize = !0),
            (this.currentAnimation = (function (t, e, s) {
              const n = Vs(t) ? t : Ps(t);
              return n.start(ps('', n, e, s)), n.animation;
            })(0, 1e3, {
              ...t,
              onUpdate: (e) => {
                this.mixTargetDelta(e), t.onUpdate && t.onUpdate(e);
              },
              onComplete: () => {
                t.onComplete && t.onComplete(), this.completeAnimation();
              },
            })),
            this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0);
        }));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const t = this.getStack();
      t && t.exitAnimationComplete(),
        (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
        this.notifyListeners('animationComplete');
    }
    finishAnimation() {
      this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(1e3), this.currentAnimation.stop()),
        this.completeAnimation();
    }
    applyTransformsToTarget() {
      const t = this.getLead();
      let { targetWithTransforms: e, target: s, layout: n, latestValues: i } = t;
      if (e && s && n) {
        if (
          this !== t &&
          this.layout &&
          n &&
          ro(this.options.animationType, this.layout.layoutBox, n.layoutBox)
        ) {
          s = this.target || An();
          const e = dn(this.layout.layoutBox.x);
          (s.x.min = t.target.x.min), (s.x.max = s.x.min + e);
          const n = dn(this.layout.layoutBox.y);
          (s.y.min = t.target.y.min), (s.y.max = s.y.min + n);
        }
        mi(e, s), Wn(e, i), mn(this.projectionDeltaWithTransform, this.layoutCorrected, e, i);
      }
    }
    registerSharedNode(t, e) {
      this.sharedNodes.has(t) || this.sharedNodes.set(t, new Ei());
      this.sharedNodes.get(t).add(e);
      const s = e.options.initialPromotionConfig;
      e.promote({
        transition: s ? s.transition : void 0,
        preserveFollowOpacity:
          s && s.shouldPreserveFollowOpacity ? s.shouldPreserveFollowOpacity(e) : void 0,
      });
    }
    isLead() {
      const t = this.getStack();
      return !t || t.lead === this;
    }
    getLead() {
      var t;
      const { layoutId: e } = this.options;
      return (e && (null === (t = this.getStack()) || void 0 === t ? void 0 : t.lead)) || this;
    }
    getPrevLead() {
      var t;
      const { layoutId: e } = this.options;
      return e ? (null === (t = this.getStack()) || void 0 === t ? void 0 : t.prevLead) : void 0;
    }
    getStack() {
      const { layoutId: t } = this.options;
      if (t) return this.root.sharedNodes.get(t);
    }
    promote({ needsReset: t, transition: e, preserveFollowOpacity: s } = {}) {
      const n = this.getStack();
      n && n.promote(this, s),
        t && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        e && this.setOptions({ transition: e });
    }
    relegate() {
      const t = this.getStack();
      return !!t && t.relegate(this);
    }
    resetSkewAndRotation() {
      const { visualElement: t } = this.options;
      if (!t) return;
      let e = !1;
      const { latestValues: s } = t;
      if (
        ((s.z || s.rotate || s.rotateX || s.rotateY || s.rotateZ || s.skewX || s.skewY) && (e = !0),
        !e)
      )
        return;
      const n = {};
      s.z && Oi('z', t, n, this.animationValues);
      for (let i = 0; i < Li.length; i++)
        Oi(`rotate${Li[i]}`, t, n, this.animationValues),
          Oi(`skew${Li[i]}`, t, n, this.animationValues);
      t.render();
      for (const i in n)
        t.setStaticValue(i, n[i]), this.animationValues && (this.animationValues[i] = n[i]);
      t.scheduleRender();
    }
    getProjectionStyles(t) {
      var e, s;
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) return Fi;
      const n = { visibility: '' },
        i = this.getTransformTemplate();
      if (this.needsReset)
        return (
          (this.needsReset = !1),
          (n.opacity = ''),
          (n.pointerEvents = Ri(null == t ? void 0 : t.pointerEvents) || ''),
          (n.transform = i ? i(this.latestValues, '') : 'none'),
          n
        );
      const o = this.getLead();
      if (!this.projectionDelta || !this.layout || !o.target) {
        const e = {};
        return (
          this.options.layoutId &&
            ((e.opacity = void 0 !== this.latestValues.opacity ? this.latestValues.opacity : 1),
            (e.pointerEvents = Ri(null == t ? void 0 : t.pointerEvents) || '')),
          this.hasProjected &&
            !Mn(this.latestValues) &&
            ((e.transform = i ? i({}, '') : 'none'), (this.hasProjected = !1)),
          e
        );
      }
      const r = o.animationValues || o.latestValues;
      this.applyTransformsToTarget(),
        (n.transform = (function (t, e, s) {
          let n = '';
          const i = t.x.translate / e.x,
            o = t.y.translate / e.y,
            r = (null == s ? void 0 : s.z) || 0;
          if (
            ((i || o || r) && (n = `translate3d(${i}px, ${o}px, ${r}px) `),
            (1 === e.x && 1 === e.y) || (n += `scale(${1 / e.x}, ${1 / e.y}) `),
            s)
          ) {
            const {
              transformPerspective: t,
              rotate: e,
              rotateX: i,
              rotateY: o,
              skewX: r,
              skewY: a,
            } = s;
            t && (n = `perspective(${t}px) ${n}`),
              e && (n += `rotate(${e}deg) `),
              i && (n += `rotateX(${i}deg) `),
              o && (n += `rotateY(${o}deg) `),
              r && (n += `skewX(${r}deg) `),
              a && (n += `skewY(${a}deg) `);
          }
          const a = t.x.scale * e.x,
            l = t.y.scale * e.y;
          return (1 === a && 1 === l) || (n += `scale(${a}, ${l})`), n || 'none';
        })(this.projectionDeltaWithTransform, this.treeScale, r)),
        i && (n.transform = i(r, n.transform));
      const { x: a, y: l } = this.projectionDelta;
      (n.transformOrigin = `${100 * a.origin}% ${100 * l.origin}% 0`),
        o.animationValues
          ? (n.opacity =
              o === this
                ? null !==
                    (s =
                      null !== (e = r.opacity) && void 0 !== e ? e : this.latestValues.opacity) &&
                  void 0 !== s
                  ? s
                  : 1
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : r.opacityExit)
          : (n.opacity =
              o === this
                ? void 0 !== r.opacity
                  ? r.opacity
                  : ''
                : void 0 !== r.opacityExit
                  ? r.opacityExit
                  : 0);
      for (const u in ti) {
        if (void 0 === r[u]) continue;
        const { correct: t, applyTo: e } = ti[u],
          s = 'none' === n.transform ? r[u] : t(r[u], o);
        if (e) {
          const t = e.length;
          for (let i = 0; i < t; i++) n[e[i]] = s;
        } else n[u] = s;
      }
      return (
        this.options.layoutId &&
          (n.pointerEvents = o === this ? Ri(null == t ? void 0 : t.pointerEvents) || '' : 'none'),
        n
      );
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      this.root.nodes.forEach((t) => {
        var e;
        return null === (e = t.currentAnimation) || void 0 === e ? void 0 : e.stop();
      }),
        this.root.nodes.forEach(Yi),
        this.root.sharedNodes.clear();
    }
  };
}
function Wi(t) {
  t.updateLayout();
}
function Ni(t) {
  var e;
  const s = (null === (e = t.resumeFrom) || void 0 === e ? void 0 : e.snapshot) || t.snapshot;
  if (t.isLead() && t.layout && s && t.hasListeners('didUpdate')) {
    const { layoutBox: e, measuredBox: n } = t.layout,
      { animationType: i } = t.options,
      o = s.source !== t.layout.source;
    'size' === i
      ? bn((t) => {
          const n = o ? s.measuredBox[t] : s.layoutBox[t],
            i = dn(n);
          (n.min = e[t].min), (n.max = n.min + i);
        })
      : ro(i, s.layoutBox, e) &&
        bn((n) => {
          const i = o ? s.measuredBox[n] : s.layoutBox[n],
            r = dn(e[n]);
          (i.max = i.min + r),
            t.relativeTarget &&
              !t.currentAnimation &&
              ((t.isProjectionDirty = !0), (t.relativeTarget[n].max = t.relativeTarget[n].min + r));
        });
    const r = Sn();
    mn(r, e, s.layoutBox);
    const a = Sn();
    o ? mn(a, t.applyTransform(n, !0), s.measuredBox) : mn(a, e, s.layoutBox);
    const l = !wi(r);
    let u = !1;
    if (!t.resumeFrom) {
      const n = t.getClosestProjectingParent();
      if (n && !n.resumeFrom) {
        const { snapshot: i, layout: o } = n;
        if (i && o) {
          const r = An();
          gn(r, s.layoutBox, i.layoutBox);
          const a = An();
          gn(a, e, o.layoutBox),
            bi(r, a) || (u = !0),
            n.options.layoutRoot &&
              ((t.relativeTarget = a), (t.relativeTargetOrigin = r), (t.relativeParent = n));
        }
      }
    }
    t.notifyListeners('didUpdate', {
      layout: e,
      snapshot: s,
      delta: a,
      layoutDelta: r,
      hasLayoutChanged: l,
      hasRelativeTargetChanged: u,
    });
  } else if (t.isLead()) {
    const { onExitComplete: e } = t.options;
    e && e();
  }
  t.options.transition = void 0;
}
function $i(t) {
  ji && ki.totalNodes++,
    t.parent &&
      (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
      t.isSharedProjectionDirty ||
        (t.isSharedProjectionDirty = Boolean(
          t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty,
        )),
      t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function zi(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Ki(t) {
  t.clearSnapshot();
}
function Yi(t) {
  t.clearMeasurements();
}
function Hi(t) {
  t.isLayoutDirty = !1;
}
function Xi(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify('BeforeLayoutMeasure'), t.resetTransform();
}
function Gi(t) {
  t.finishAnimation(),
    (t.targetDelta = t.relativeTarget = t.target = void 0),
    (t.isProjectionDirty = !0);
}
function qi(t) {
  t.resolveTargetDelta();
}
function Zi(t) {
  t.calcProjection();
}
function _i(t) {
  t.resetSkewAndRotation();
}
function Ji(t) {
  t.removeLeadSnapshot();
}
function Qi(t, e, s) {
  (t.translate = Fe(e.translate, 0, s)),
    (t.scale = Fe(e.scale, 1, s)),
    (t.origin = e.origin),
    (t.originPoint = e.originPoint);
}
function to(t, e, s, n) {
  (t.min = Fe(e.min, s.min, n)), (t.max = Fe(e.max, s.max, n));
}
function eo(t) {
  return t.animationValues && void 0 !== t.animationValues.opacityExit;
}
const so = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  no = (t) =>
    'undefined' != typeof navigator &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(t),
  io = no('applewebkit/') && !no('chrome/') ? Math.round : A;
function oo(t) {
  (t.min = io(t.min)), (t.max = io(t.max));
}
function ro(t, e, s) {
  return (
    'position' === t ||
    ('preserve-aspect' === t && ((n = Ci(e)), (i = Ci(s)), (o = 0.2), !(Math.abs(n - i) <= o)))
  );
  var n, i, o;
}
function ao(t) {
  var e;
  return t !== t.root && (null === (e = t.scroll) || void 0 === e ? void 0 : e.wasRoot);
}
const lo = Ui({
    attachResizeListener: (t, e) => Ys(t, 'resize', e),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
    }),
    checkIsScrollRoot: () => !0,
  }),
  uo = { current: void 0 },
  ho = Ui({
    measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
    defaultParent: () => {
      if (!uo.current) {
        const t = new lo({});
        t.mount(window), t.setOptions({ layoutScroll: !0 }), (uo.current = t);
      }
      return uo.current;
    },
    resetTransform: (t, e) => {
      t.style.transform = void 0 !== e ? e : 'none';
    },
    checkIsScrollRoot: (t) => Boolean('fixed' === window.getComputedStyle(t).position),
  }),
  co = {
    pan: {
      Feature: class extends Us {
        constructor() {
          super(...arguments), (this.removePointerDownListener = A);
        }
        onPointerDown(t) {
          this.session = new Gs(t, this.createPanHandlers(), {
            transformPagePoint: this.node.getTransformPagePoint(),
            contextWindow: $n(this.node),
          });
        }
        createPanHandlers() {
          const {
            onPanSessionStart: t,
            onPanStart: e,
            onPan: s,
            onPanEnd: n,
          } = this.node.getProps();
          return {
            onSessionStart: Hn(t),
            onStart: Hn(e),
            onMove: s,
            onEnd: (t, e) => {
              delete this.session, n && V.postRender(() => n(t, e));
            },
          };
        }
        mount() {
          this.removePointerDownListener = Hs(this.node.current, 'pointerdown', (t) =>
            this.onPointerDown(t),
          );
        }
        update() {
          this.session && this.session.updateHandlers(this.createPanHandlers());
        }
        unmount() {
          this.removePointerDownListener(), this.session && this.session.end();
        }
      },
    },
    drag: {
      Feature: class extends Us {
        constructor(t) {
          super(t),
            (this.removeGroupControls = A),
            (this.removeListeners = A),
            (this.controls = new Kn(t));
        }
        mount() {
          const { dragControls: t } = this.node.getProps();
          t && (this.removeGroupControls = t.subscribe(this.controls)),
            (this.removeListeners = this.controls.addListeners() || A);
        }
        unmount() {
          this.removeGroupControls(), this.removeListeners();
        }
      },
      ProjectionNode: ho,
      MeasureLayout: ni,
    },
  };
function po(t, e) {
  const s = e ? 'pointerenter' : 'pointerleave',
    n = e ? 'onHoverStart' : 'onHoverEnd';
  return Hs(
    t.current,
    s,
    (s, i) => {
      if ('touch' === s.pointerType || rn()) return;
      const o = t.getProps();
      t.animationState && o.whileHover && t.animationState.setActive('whileHover', e);
      const r = o[n];
      r && V.postRender(() => r(s, i));
    },
    { passive: !t.getProps()[n] },
  );
}
const mo = (t, e) => !!e && (t === e || mo(t, e.parentElement));
function fo(t, e) {
  if (!e) return;
  const s = new PointerEvent('pointer' + t);
  e(s, zs(s));
}
const vo = new WeakMap(),
  go = new WeakMap(),
  yo = (t) => {
    const e = vo.get(t.target);
    e && e(t);
  },
  xo = (t) => {
    t.forEach(yo);
  };
function Po(t, e, s) {
  const n = (function ({ root: t, ...e }) {
    const s = t || document;
    go.has(s) || go.set(s, {});
    const n = go.get(s),
      i = JSON.stringify(e);
    return n[i] || (n[i] = new IntersectionObserver(xo, { root: t, ...e })), n[i];
  })(e);
  return (
    vo.set(t, s),
    n.observe(t),
    () => {
      vo.delete(t), n.unobserve(t);
    }
  );
}
const To = { some: 0, all: 1 };
const wo = {
    inView: {
      Feature: class extends Us {
        constructor() {
          super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1);
        }
        startObserver() {
          this.unmount();
          const { viewport: t = {} } = this.node.getProps(),
            { root: e, margin: s, amount: n = 'some', once: i } = t,
            o = {
              root: e ? e.current : void 0,
              rootMargin: s,
              threshold: 'number' == typeof n ? n : To[n],
            };
          return Po(this.node.current, o, (t) => {
            const { isIntersecting: e } = t;
            if (this.isInView === e) return;
            if (((this.isInView = e), i && !e && this.hasEnteredView)) return;
            e && (this.hasEnteredView = !0),
              this.node.animationState && this.node.animationState.setActive('whileInView', e);
            const { onViewportEnter: s, onViewportLeave: n } = this.node.getProps(),
              o = e ? s : n;
            o && o(t);
          });
        }
        mount() {
          this.startObserver();
        }
        update() {
          if ('undefined' == typeof IntersectionObserver) return;
          const { props: t, prevProps: e } = this.node;
          ['amount', 'margin', 'root'].some(
            (function ({ viewport: t = {} }, { viewport: e = {} } = {}) {
              return (s) => t[s] !== e[s];
            })(t, e),
          ) && this.startObserver();
        }
        unmount() {}
      },
    },
    tap: {
      Feature: class extends Us {
        constructor() {
          super(...arguments),
            (this.removeStartListeners = A),
            (this.removeEndListeners = A),
            (this.removeAccessibleListeners = A),
            (this.startPointerPress = (t, e) => {
              if (this.isPressing) return;
              this.removeEndListeners();
              const s = this.node.getProps(),
                n = Hs(
                  window,
                  'pointerup',
                  (t, e) => {
                    if (!this.checkPressEnd()) return;
                    const { onTap: s, onTapCancel: n, globalTapTarget: i } = this.node.getProps(),
                      o = i || mo(this.node.current, t.target) ? s : n;
                    o && V.update(() => o(t, e));
                  },
                  { passive: !(s.onTap || s.onPointerUp) },
                ),
                i = Hs(window, 'pointercancel', (t, e) => this.cancelPress(t, e), {
                  passive: !(s.onTapCancel || s.onPointerCancel),
                });
              (this.removeEndListeners = je(n, i)), this.startPress(t, e);
            }),
            (this.startAccessiblePress = () => {
              const t = Ys(this.node.current, 'keydown', (t) => {
                  if ('Enter' !== t.key || this.isPressing) return;
                  this.removeEndListeners(),
                    (this.removeEndListeners = Ys(this.node.current, 'keyup', (t) => {
                      'Enter' === t.key &&
                        this.checkPressEnd() &&
                        fo('up', (t, e) => {
                          const { onTap: s } = this.node.getProps();
                          s && V.postRender(() => s(t, e));
                        });
                    })),
                    fo('down', (t, e) => {
                      this.startPress(t, e);
                    });
                }),
                e = Ys(this.node.current, 'blur', () => {
                  this.isPressing && fo('cancel', (t, e) => this.cancelPress(t, e));
                });
              this.removeAccessibleListeners = je(t, e);
            });
        }
        startPress(t, e) {
          this.isPressing = !0;
          const { onTapStart: s, whileTap: n } = this.node.getProps();
          n && this.node.animationState && this.node.animationState.setActive('whileTap', !0),
            s && V.postRender(() => s(t, e));
        }
        checkPressEnd() {
          this.removeEndListeners(), (this.isPressing = !1);
          return (
            this.node.getProps().whileTap &&
              this.node.animationState &&
              this.node.animationState.setActive('whileTap', !1),
            !rn()
          );
        }
        cancelPress(t, e) {
          if (!this.checkPressEnd()) return;
          const { onTapCancel: s } = this.node.getProps();
          s && V.postRender(() => s(t, e));
        }
        mount() {
          const t = this.node.getProps(),
            e = Hs(
              t.globalTapTarget ? window : this.node.current,
              'pointerdown',
              this.startPointerPress,
              { passive: !(t.onTapStart || t.onPointerStart) },
            ),
            s = Ys(this.node.current, 'focus', this.startAccessiblePress);
          this.removeStartListeners = je(e, s);
        }
        unmount() {
          this.removeStartListeners(), this.removeEndListeners(), this.removeAccessibleListeners();
        }
      },
    },
    focus: {
      Feature: class extends Us {
        constructor() {
          super(...arguments), (this.isActive = !1);
        }
        onFocus() {
          let t = !1;
          try {
            t = this.node.current.matches(':focus-visible');
          } catch (e) {
            t = !0;
          }
          t &&
            this.node.animationState &&
            (this.node.animationState.setActive('whileFocus', !0), (this.isActive = !0));
        }
        onBlur() {
          this.isActive &&
            this.node.animationState &&
            (this.node.animationState.setActive('whileFocus', !1), (this.isActive = !1));
        }
        mount() {
          this.unmount = je(
            Ys(this.node.current, 'focus', () => this.onFocus()),
            Ys(this.node.current, 'blur', () => this.onBlur()),
          );
        }
        unmount() {}
      },
    },
    hover: {
      Feature: class extends Us {
        mount() {
          this.unmount = je(po(this.node, !0), po(this.node, !1));
        }
        unmount() {}
      },
    },
  },
  So = { layout: { ProjectionNode: ho, MeasureLayout: ni } },
  Ao = t.createContext({ transformPagePoint: (t) => t, isStatic: !1, reducedMotion: 'never' }),
  bo = t.createContext({}),
  Co = 'undefined' != typeof window,
  Vo = Co ? t.useLayoutEffect : t.useEffect,
  Eo = t.createContext({ strict: !1 });
let Mo = !1;
function Do(e, s, n, i, o) {
  var r;
  const { visualElement: a } = t.useContext(bo),
    l = t.useContext(Eo),
    u = t.useContext(Xn),
    h = t.useContext(Ao).reducedMotion,
    c = t.useRef();
  (i = i || l.renderer),
    !c.current &&
      i &&
      (c.current = i(e, {
        visualState: s,
        parent: a,
        props: n,
        presenceContext: u,
        blockInitialAnimation: !!u && !1 === u.initial,
        reducedMotionConfig: h,
      }));
  const d = c.current,
    p = t.useContext(qn);
  !d ||
    d.projection ||
    !o ||
    ('html' !== d.type && 'svg' !== d.type) ||
    (function (t, e, s, n) {
      const {
        layoutId: i,
        layout: o,
        drag: r,
        dragConstraints: a,
        layoutScroll: l,
        layoutRoot: u,
      } = e;
      (t.projection = new s(t.latestValues, e['data-framer-portal-id'] ? void 0 : ko(t.parent))),
        t.projection.setOptions({
          layoutId: i,
          layout: o,
          alwaysMeasureLayout: Boolean(r) || (a && an(a)),
          visualElement: t,
          animationType: 'string' == typeof o ? o : 'both',
          initialPromotionConfig: n,
          layoutScroll: l,
          layoutRoot: u,
        });
    })(c.current, n, o, p),
    t.useInsertionEffect(() => {
      d && d.update(n, u);
    });
  const m = n[Ss],
    f = t.useRef(
      Boolean(m) &&
        !window.MotionHandoffIsComplete &&
        (null === (r = window.MotionHasOptimisedAnimation) || void 0 === r
          ? void 0
          : r.call(window, m)),
    );
  return (
    Vo(() => {
      d &&
        (d.updateFeatures(),
        ei.render(d.render),
        f.current && d.animationState && d.animationState.animateChanges());
    }),
    t.useEffect(() => {
      d &&
        (!f.current && d.animationState && d.animationState.animateChanges(),
        (f.current = !1),
        Mo || ((Mo = !0), queueMicrotask(Ro)));
    }),
    d
  );
}
function Ro() {
  window.MotionHandoffIsComplete = !0;
}
function ko(t) {
  if (t) return !1 !== t.options.allowProjection ? t.projection : ko(t.parent);
}
function jo(e, s, n) {
  return t.useCallback(
    (t) => {
      t && e.mount && e.mount(t),
        s && (t ? s.mount(t) : s.unmount()),
        n && ('function' == typeof n ? n(t) : an(n) && (n.current = t));
    },
    [s],
  );
}
function Lo(t) {
  return n(t.animate) || c.some((e) => r(t[e]));
}
function Fo(t) {
  return Boolean(Lo(t) || t.variants);
}
function Bo(e) {
  const { initial: s, animate: n } = (function (t, e) {
    if (Lo(t)) {
      const { initial: e, animate: s } = t;
      return { initial: !1 === e || r(e) ? e : void 0, animate: r(s) ? s : void 0 };
    }
    return !1 !== t.inherit ? e : {};
  })(e, t.useContext(bo));
  return t.useMemo(() => ({ initial: s, animate: n }), [Oo(s), Oo(n)]);
}
function Oo(t) {
  return Array.isArray(t) ? t.join(' ') : t;
}
const Io = {
    animation: [
      'animate',
      'variants',
      'whileHover',
      'whileTap',
      'exit',
      'whileInView',
      'whileFocus',
      'whileDrag',
    ],
    exit: ['exit'],
    drag: ['drag', 'dragControls'],
    focus: ['whileFocus'],
    hover: ['whileHover', 'onHoverStart', 'onHoverEnd'],
    tap: ['whileTap', 'onTap', 'onTapStart', 'onTapCancel'],
    pan: ['onPan', 'onPanStart', 'onPanSessionStart', 'onPanEnd'],
    inView: ['whileInView', 'onViewportEnter', 'onViewportLeave'],
    layout: ['layout', 'layoutId'],
  },
  Uo = {};
for (const Kr in Io) Uo[Kr] = { isEnabled: (t) => Io[Kr].some((e) => !!t[e]) };
const Wo = Symbol.for('motionComponentSymbol');
function No({
  preloadedFeatures: s,
  createVisualElement: n,
  useRender: i,
  useVisualState: o,
  Component: r,
}) {
  s &&
    (function (t) {
      for (const e in t) Uo[e] = { ...Uo[e], ...t[e] };
    })(s);
  const a = t.forwardRef(function (s, a) {
    let l;
    const u = { ...t.useContext(Ao), ...s, layoutId: $o(s) },
      { isStatic: h } = u,
      c = Bo(s),
      d = o(s, h);
    if (!h && Co) {
      t.useContext(Eo).strict;
      const e = (function (t) {
        const { drag: e, layout: s } = Uo;
        if (!e && !s) return {};
        const n = { ...e, ...s };
        return {
          MeasureLayout:
            (null == e ? void 0 : e.isEnabled(t)) || (null == s ? void 0 : s.isEnabled(t))
              ? n.MeasureLayout
              : void 0,
          ProjectionNode: n.ProjectionNode,
        };
      })(u);
      (l = e.MeasureLayout), (c.visualElement = Do(r, d, u, n, e.ProjectionNode));
    }
    return e.jsxs(bo.Provider, {
      value: c,
      children: [
        l && c.visualElement ? e.jsx(l, { visualElement: c.visualElement, ...u }) : null,
        i(r, s, jo(d, c.visualElement, a), d, h, c.visualElement),
      ],
    });
  });
  return (a[Wo] = r), a;
}
function $o({ layoutId: e }) {
  const s = t.useContext(Gn).id;
  return s && void 0 !== e ? s + '-' + e : e;
}
const zo = [
  'animate',
  'circle',
  'defs',
  'desc',
  'ellipse',
  'g',
  'image',
  'line',
  'filter',
  'marker',
  'mask',
  'metadata',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'rect',
  'stop',
  'switch',
  'symbol',
  'svg',
  'text',
  'tspan',
  'use',
  'view',
];
function Ko(t) {
  return 'string' == typeof t && !t.includes('-') && !!(zo.indexOf(t) > -1 || /[A-Z]/u.test(t));
}
function Yo(t, { style: e, vars: s }, n, i) {
  Object.assign(t.style, e, i && i.getProjectionStyles(n));
  for (const o in s) t.style.setProperty(o, s[o]);
}
const Ho = new Set([
  'baseFrequency',
  'diffuseConstant',
  'kernelMatrix',
  'kernelUnitLength',
  'keySplines',
  'keyTimes',
  'limitingConeAngle',
  'markerHeight',
  'markerWidth',
  'numOctaves',
  'targetX',
  'targetY',
  'surfaceScale',
  'specularConstant',
  'specularExponent',
  'stdDeviation',
  'tableValues',
  'viewBox',
  'gradientTransform',
  'pathLength',
  'startOffset',
  'textLength',
  'lengthAdjust',
]);
function Xo(t, e, s, n) {
  Yo(t, e, void 0, n);
  for (const i in e.attrs) t.setAttribute(Ho.has(i) ? i : ws(i), e.attrs[i]);
}
function Go(t, { layout: e, layoutId: s }) {
  return (
    p.has(t) || t.startsWith('origin') || ((e || void 0 !== s) && (!!ti[t] || 'opacity' === t))
  );
}
function qo(t, e, s) {
  var n;
  const { style: i } = t,
    o = {};
  for (const r in i)
    (Vs(i[r]) ||
      (e.style && Vs(e.style[r])) ||
      Go(r, t) ||
      void 0 !==
        (null === (n = null == s ? void 0 : s.getValue(r)) || void 0 === n
          ? void 0
          : n.liveStyle)) &&
      (o[r] = i[r]);
  return s && i && 'string' == typeof i.willChange && (s.applyWillChange = !1), o;
}
function Zo(t, e, s) {
  const n = qo(t, e, s);
  for (const i in t)
    if (Vs(t[i]) || Vs(e[i])) {
      n[-1 !== d.indexOf(i) ? 'attr' + i.charAt(0).toUpperCase() + i.substring(1) : i] = t[i];
    }
  return n;
}
function _o(e) {
  const s = t.useRef(null);
  return null === s.current && (s.current = e()), s.current;
}
const Jo = (e) => (s, n) => {
  const i = t.useContext(bo),
    o = t.useContext(Xn),
    r = () =>
      (function (
        {
          applyWillChange: t = !1,
          scrapeMotionValuesFromProps: e,
          createRenderState: s,
          onMount: n,
        },
        i,
        o,
        r,
        a,
      ) {
        const l = { latestValues: er(i, o, r, !a && t, e), renderState: s() };
        return n && (l.mount = (t) => n(i, t, l)), l;
      })(e, s, i, o, n);
  return n ? r() : _o(r);
};
function Qo(t, e) {
  const s = bs(e);
  s && vs(t, s);
}
function tr(t, e, s) {
  const n = Array.isArray(e) ? e : [e];
  for (let i = 0; i < n.length; i++) {
    const e = l(t, n[i]);
    if (e) {
      const { transitionEnd: t, transition: n, ...i } = e;
      s(i, t);
    }
  }
}
function er(t, e, s, i, o) {
  var r;
  const a = {},
    l = [],
    u = i && void 0 === (null === (r = t.style) || void 0 === r ? void 0 : r.willChange),
    h = o(t, {});
  for (const n in h) a[n] = Ri(h[n]);
  let { initial: c, animate: d } = t;
  const p = Lo(t),
    m = Fo(t);
  e &&
    m &&
    !p &&
    !1 !== t.inherit &&
    (void 0 === c && (c = e.initial), void 0 === d && (d = e.animate));
  let f = !!s && !1 === s.initial;
  f = f || !1 === c;
  const v = f ? d : c;
  return (
    v &&
      'boolean' != typeof v &&
      !n(v) &&
      tr(t, v, (t, e) => {
        for (const s in t) {
          let e = t[s];
          if (Array.isArray(e)) {
            e = e[f ? e.length - 1 : 0];
          }
          null !== e && (a[s] = e);
        }
        for (const s in e) a[s] = e[s];
      }),
    u &&
      (d &&
        !1 !== c &&
        !n(d) &&
        tr(t, d, (t) => {
          for (const e in t) Qo(l, e);
        }),
      l.length && (a.willChange = l.join(','))),
    a
  );
}
const sr = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} }),
  nr = () => ({ ...sr(), attrs: {} }),
  ir = (t, e) => (e && 'number' == typeof t ? e.transform(t) : t),
  or = { x: 'translateX', y: 'translateY', z: 'translateZ', transformPerspective: 'perspective' },
  rr = d.length;
function ar(t, e, s) {
  const { style: n, vars: i, transformOrigin: o } = t;
  let r = !1,
    a = !1;
  for (const l in e) {
    const t = e[l];
    if (p.has(l)) r = !0;
    else if (F(l)) i[l] = t;
    else {
      const e = ir(t, $t[l]);
      l.startsWith('origin') ? ((a = !0), (o[l] = e)) : (n[l] = e);
    }
  }
  if (
    (e.transform ||
      (r || s
        ? (n.transform = (function (t, e, s) {
            let n = '',
              i = !0;
            for (let o = 0; o < rr; o++) {
              const r = d[o],
                a = t[r];
              if (void 0 === a) continue;
              let l = !0;
              if (
                ((l =
                  'number' == typeof a
                    ? a === (r.startsWith('scale') ? 1 : 0)
                    : 0 === parseFloat(a)),
                !l || s)
              ) {
                const t = ir(a, $t[r]);
                l || ((i = !1), (n += `${or[r] || r}(${t}) `)), s && (e[r] = t);
              }
            }
            return (n = n.trim()), s ? (n = s(e, i ? '' : n)) : i && (n = 'none'), n;
          })(e, t.transform, s))
        : n.transform && (n.transform = 'none')),
    a)
  ) {
    const { originX: t = '50%', originY: e = '50%', originZ: s = 0 } = o;
    n.transformOrigin = `${t} ${e} ${s}`;
  }
}
function lr(t, e, s) {
  return 'string' == typeof t ? t : Q.transform(e + s * t);
}
const ur = { offset: 'stroke-dashoffset', array: 'stroke-dasharray' },
  hr = { offset: 'strokeDashoffset', array: 'strokeDasharray' };
function cr(
  t,
  {
    attrX: e,
    attrY: s,
    attrScale: n,
    originX: i,
    originY: o,
    pathLength: r,
    pathSpacing: a = 1,
    pathOffset: l = 0,
    ...u
  },
  h,
  c,
) {
  if ((ar(t, u, c), h)) return void (t.style.viewBox && (t.attrs.viewBox = t.style.viewBox));
  (t.attrs = t.style), (t.style = {});
  const { attrs: d, style: p, dimensions: m } = t;
  d.transform && (m && (p.transform = d.transform), delete d.transform),
    m &&
      (void 0 !== i || void 0 !== o || p.transform) &&
      (p.transformOrigin = (function (t, e, s) {
        return `${lr(e, t.x, t.width)} ${lr(s, t.y, t.height)}`;
      })(m, void 0 !== i ? i : 0.5, void 0 !== o ? o : 0.5)),
    void 0 !== e && (d.x = e),
    void 0 !== s && (d.y = s),
    void 0 !== n && (d.scale = n),
    void 0 !== r &&
      (function (t, e, s = 1, n = 0, i = !0) {
        t.pathLength = 1;
        const o = i ? ur : hr;
        t[o.offset] = Q.transform(-n);
        const r = Q.transform(e),
          a = Q.transform(s);
        t[o.array] = `${r} ${a}`;
      })(d, r, a, l, !1);
}
const dr = (t) => 'string' == typeof t && 'svg' === t.toLowerCase(),
  pr = {
    useVisualState: Jo({
      scrapeMotionValuesFromProps: Zo,
      createRenderState: nr,
      onMount: (t, e, { renderState: s, latestValues: n }) => {
        V.read(() => {
          try {
            s.dimensions = 'function' == typeof e.getBBox ? e.getBBox() : e.getBoundingClientRect();
          } catch (t) {
            s.dimensions = { x: 0, y: 0, width: 0, height: 0 };
          }
        }),
          V.render(() => {
            cr(s, n, dr(e.tagName), t.transformTemplate), Xo(e, s);
          });
      },
    }),
  },
  mr = {
    useVisualState: Jo({
      applyWillChange: !0,
      scrapeMotionValuesFromProps: qo,
      createRenderState: sr,
    }),
  };
function fr(t, e, s) {
  for (const n in e) Vs(e[n]) || Go(n, s) || (t[n] = e[n]);
}
function vr(e, s) {
  const n = {};
  return (
    fr(n, e.style || {}, e),
    Object.assign(
      n,
      (function ({ transformTemplate: e }, s) {
        return t.useMemo(() => {
          const t = sr();
          return ar(t, s, e), Object.assign({}, t.vars, t.style);
        }, [s]);
      })(e, s),
    ),
    n
  );
}
function gr(t, e) {
  const s = {},
    n = vr(t, e);
  return (
    t.drag &&
      !1 !== t.dragListener &&
      ((s.draggable = !1),
      (n.userSelect = n.WebkitUserSelect = n.WebkitTouchCallout = 'none'),
      (n.touchAction = !0 === t.drag ? 'none' : 'pan-' + ('x' === t.drag ? 'y' : 'x'))),
    void 0 === t.tabIndex && (t.onTap || t.onTapStart || t.whileTap) && (s.tabIndex = 0),
    (s.style = n),
    s
  );
}
const yr = new Set([
  'animate',
  'exit',
  'variants',
  'initial',
  'style',
  'values',
  'variants',
  'transition',
  'transformTemplate',
  'custom',
  'inherit',
  'onBeforeLayoutMeasure',
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onMeasureDragConstraints',
  'onDirectionLock',
  'onDragTransitionEnd',
  '_dragX',
  '_dragY',
  'onHoverStart',
  'onHoverEnd',
  'onViewportEnter',
  'onViewportLeave',
  'globalTapTarget',
  'ignoreStrict',
  'viewport',
]);
function xr(t) {
  return (
    t.startsWith('while') ||
    (t.startsWith('drag') && 'draggable' !== t) ||
    t.startsWith('layout') ||
    t.startsWith('onTap') ||
    t.startsWith('onPan') ||
    t.startsWith('onLayout') ||
    yr.has(t)
  );
}
let Pr = (t) => !xr(t);
try {
  (Tr = require('@emotion/is-prop-valid').default) &&
    (Pr = (t) => (t.startsWith('on') ? !xr(t) : Tr(t)));
} catch (zr) {}
var Tr;
function wr(e, s, n, i) {
  const o = t.useMemo(() => {
    const t = nr();
    return cr(t, s, dr(i), e.transformTemplate), { ...t.attrs, style: { ...t.style } };
  }, [s]);
  if (e.style) {
    const t = {};
    fr(t, e.style, e), (o.style = { ...t, ...o.style });
  }
  return o;
}
function Sr(e = !1) {
  return (s, n, i, { latestValues: o }, r) => {
    const a = (Ko(s) ? wr : gr)(n, o, r, s),
      l = (function (t, e, s) {
        const n = {};
        for (const i in t)
          ('values' === i && 'object' == typeof t.values) ||
            ((Pr(i) ||
              (!0 === s && xr(i)) ||
              (!e && !xr(i)) ||
              (t.draggable && i.startsWith('onDrag'))) &&
              (n[i] = t[i]));
        return n;
      })(n, 'string' == typeof s, e),
      u = s !== t.Fragment ? { ...l, ...a, ref: i } : {},
      { children: h } = n,
      c = t.useMemo(() => (Vs(h) ? h.get() : h), [h]);
    return t.createElement(s, { ...u, children: c });
  };
}
function Ar(t, e) {
  return function (s, { forwardMotionProps: n } = { forwardMotionProps: !1 }) {
    return No({
      ...(Ko(s) ? pr : mr),
      preloadedFeatures: t,
      useRender: Sr(n),
      createVisualElement: e,
      Component: s,
    });
  };
}
const br = { current: null },
  Cr = { current: !1 };
const Vr = new WeakMap(),
  Er = [...ct, bt, Bt],
  Mr = [
    'AnimationStart',
    'AnimationComplete',
    'Update',
    'BeforeLayoutMeasure',
    'LayoutMeasure',
    'LayoutAnimationStart',
    'LayoutAnimationComplete',
  ],
  Dr = c.length;
class Rr {
  scrapeMotionValuesFromProps(t, e, s) {
    return {};
  }
  constructor(
    {
      parent: t,
      props: e,
      presenceContext: s,
      reducedMotionConfig: n,
      blockInitialAnimation: i,
      visualState: o,
    },
    r = {},
  ) {
    (this.applyWillChange = !1),
      (this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.values = new Map()),
      (this.KeyframeResolver = yt),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify('Update', this.latestValues)),
      (this.render = () => {
        (this.isRenderScheduled = !1),
          this.current &&
            (this.triggerBuild(),
            this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }),
      (this.isRenderScheduled = !1),
      (this.scheduleRender = () => {
        this.isRenderScheduled || ((this.isRenderScheduled = !0), V.render(this.render, !1, !0));
      });
    const { latestValues: a, renderState: l } = o;
    (this.latestValues = a),
      (this.baseTarget = { ...a }),
      (this.initialValues = e.initial ? { ...a } : {}),
      (this.renderState = l),
      (this.parent = t),
      (this.props = e),
      (this.presenceContext = s),
      (this.depth = t ? t.depth + 1 : 0),
      (this.reducedMotionConfig = n),
      (this.options = r),
      (this.blockInitialAnimation = Boolean(i)),
      (this.isControllingVariants = Lo(e)),
      (this.isVariantNode = Fo(e)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = Boolean(t && t.current));
    const { willChange: u, ...h } = this.scrapeMotionValuesFromProps(e, {}, this);
    for (const c in h) {
      const t = h[c];
      void 0 !== a[c] && Vs(t) && t.set(a[c], !1);
    }
  }
  mount(t) {
    (this.current = t),
      Vr.set(t, this),
      this.projection && !this.projection.instance && this.projection.mount(t),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((t, e) => this.bindToMotionValue(e, t)),
      Cr.current ||
        (function () {
          if (((Cr.current = !0), Co))
            if (window.matchMedia) {
              const t = window.matchMedia('(prefers-reduced-motion)'),
                e = () => (br.current = t.matches);
              t.addListener(e), e();
            } else br.current = !1;
        })(),
      (this.shouldReduceMotion =
        'never' !== this.reducedMotionConfig &&
        ('always' === this.reducedMotionConfig || br.current)),
      this.parent && this.parent.children.add(this),
      this.update(this.props, this.presenceContext);
  }
  unmount() {
    Vr.delete(this.current),
      this.projection && this.projection.unmount(),
      E(this.notifyUpdate),
      E(this.render),
      this.valueSubscriptions.forEach((t) => t()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent && this.parent.children.delete(this);
    for (const t in this.events) this.events[t].clear();
    for (const t in this.features) {
      const e = this.features[t];
      e && (e.unmount(), (e.isMounted = !1));
    }
    this.current = null;
  }
  bindToMotionValue(t, e) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const s = p.has(t),
      n = e.on('change', (e) => {
        (this.latestValues[t] = e),
          this.props.onUpdate && V.preRender(this.notifyUpdate),
          s && this.projection && (this.projection.isTransformDirty = !0);
      }),
      i = e.on('renderRequest', this.scheduleRender);
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, t, e)),
      this.valueSubscriptions.set(t, () => {
        n(), i(), o && o(), e.owner && e.stop();
      });
  }
  sortNodePosition(t) {
    return this.current && this.sortInstanceNodePosition && this.type === t.type
      ? this.sortInstanceNodePosition(this.current, t.current)
      : 0;
  }
  updateFeatures() {
    let t = 'animation';
    for (t in Uo) {
      const e = Uo[t];
      if (!e) continue;
      const { isEnabled: s, Feature: n } = e;
      if (
        (!this.features[t] && n && s(this.props) && (this.features[t] = new n(this)),
        this.features[t])
      ) {
        const e = this.features[t];
        e.isMounted ? e.update() : (e.mount(), (e.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : An();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, e) {
    this.latestValues[t] = e;
  }
  update(t, e) {
    (t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = t),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = e);
    for (let s = 0; s < Mr.length; s++) {
      const e = Mr[s];
      this.propEventSubscriptions[e] &&
        (this.propEventSubscriptions[e](), delete this.propEventSubscriptions[e]);
      const n = t['on' + e];
      n && (this.propEventSubscriptions[e] = this.on(e, n));
    }
    (this.prevMotionValues = (function (t, e, s) {
      for (const n in e) {
        const i = e[n],
          o = s[n];
        if (Vs(i)) t.addValue(n, i);
        else if (Vs(o)) t.addValue(n, Ps(i, { owner: t }));
        else if (o !== i)
          if (t.hasValue(n)) {
            const e = t.getValue(n);
            !0 === e.liveStyle ? e.jump(i) : e.hasAnimated || e.set(i);
          } else {
            const e = t.getStaticValue(n);
            t.addValue(n, Ps(void 0 !== e ? e : i, { owner: t }));
          }
      }
      for (const n in s) void 0 === e[n] && t.removeValue(n);
      return e;
    })(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues)),
      this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  getVariantContext(t = !1) {
    if (t) return this.parent ? this.parent.getVariantContext() : void 0;
    if (!this.isControllingVariants) {
      const t = (this.parent && this.parent.getVariantContext()) || {};
      return void 0 !== this.props.initial && (t.initial = this.props.initial), t;
    }
    const e = {};
    for (let s = 0; s < Dr; s++) {
      const t = c[s],
        n = this.props[t];
      (r(n) || !1 === n) && (e[t] = n);
    }
    return e;
  }
  addVariantChild(t) {
    const e = this.getClosestVariantNode();
    if (e) return e.variantChildren && e.variantChildren.add(t), () => e.variantChildren.delete(t);
  }
  addValue(t, e) {
    const s = this.values.get(t);
    e !== s &&
      (s && this.removeValue(t),
      this.bindToMotionValue(t, e),
      this.values.set(t, e),
      (this.latestValues[t] = e.get()));
  }
  removeValue(t) {
    this.values.delete(t);
    const e = this.valueSubscriptions.get(t);
    e && (e(), this.valueSubscriptions.delete(t)),
      delete this.latestValues[t],
      this.removeValueFromRenderState(t, this.renderState);
  }
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, e) {
    if (this.props.values && this.props.values[t]) return this.props.values[t];
    let s = this.values.get(t);
    return (
      void 0 === s &&
        void 0 !== e &&
        ((s = Ps(null === e ? void 0 : e, { owner: this })), this.addValue(t, s)),
      s
    );
  }
  readValue(t, e) {
    var s;
    let n =
      void 0 === this.latestValues[t] && this.current
        ? null !== (s = this.getBaseTargetFromProps(this.props, t)) && void 0 !== s
          ? s
          : this.readValueFromInstance(this.current, t, this.options)
        : this.latestValues[t];
    var i;
    return (
      null != n &&
        ('string' == typeof n && (j(n) || R(n))
          ? (n = parseFloat(n))
          : ((i = n), !Er.find(ht(i)) && Bt.test(e) && (n = Yt(t, e))),
        this.setBaseTarget(t, Vs(n) ? n.get() : n)),
      Vs(n) ? n.get() : n
    );
  }
  setBaseTarget(t, e) {
    this.baseTarget[t] = e;
  }
  getBaseTarget(t) {
    var e;
    const { initial: s } = this.props;
    let n;
    if ('string' == typeof s || 'object' == typeof s) {
      const i = l(
        this.props,
        s,
        null === (e = this.presenceContext) || void 0 === e ? void 0 : e.custom,
      );
      i && (n = i[t]);
    }
    if (s && void 0 !== n) return n;
    const i = this.getBaseTargetFromProps(this.props, t);
    return void 0 === i || Vs(i)
      ? void 0 !== this.initialValues[t] && void 0 === n
        ? void 0
        : this.baseTarget[t]
      : i;
  }
  on(t, e) {
    return this.events[t] || (this.events[t] = new ys()), this.events[t].add(e);
  }
  notify(t, ...e) {
    this.events[t] && this.events[t].notify(...e);
  }
}
class kr extends Rr {
  constructor() {
    super(...arguments), (this.KeyframeResolver = Xt);
  }
  sortInstanceNodePosition(t, e) {
    return 2 & t.compareDocumentPosition(e) ? 1 : -1;
  }
  getBaseTargetFromProps(t, e) {
    return t.style ? t.style[e] : void 0;
  }
  removeValueFromRenderState(t, { vars: e, style: s }) {
    delete e[t], delete s[t];
  }
}
class jr extends kr {
  constructor() {
    super(...arguments),
      (this.type = 'html'),
      (this.applyWillChange = !0),
      (this.renderInstance = Yo);
  }
  readValueFromInstance(t, e) {
    if (p.has(e)) {
      const t = Kt(e);
      return (t && t.default) || 0;
    }
    {
      const n = ((s = t), window.getComputedStyle(s)),
        i = (F(e) ? n.getPropertyValue(e) : n[e]) || 0;
      return 'string' == typeof i ? i.trim() : i;
    }
    var s;
  }
  measureInstanceViewportBox(t, { transformPagePoint: e }) {
    return Nn(t, e);
  }
  build(t, e, s) {
    ar(t, e, s.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, e, s) {
    return qo(t, e, s);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    Vs(t) &&
      (this.childSubscription = t.on('change', (t) => {
        this.current && (this.current.textContent = `${t}`);
      }));
  }
}
class Lr extends kr {
  constructor() {
    super(...arguments),
      (this.type = 'svg'),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = An);
  }
  getBaseTargetFromProps(t, e) {
    return t[e];
  }
  readValueFromInstance(t, e) {
    if (p.has(e)) {
      const t = Kt(e);
      return (t && t.default) || 0;
    }
    return (e = Ho.has(e) ? e : ws(e)), t.getAttribute(e);
  }
  scrapeMotionValuesFromProps(t, e, s) {
    return Zo(t, e, s);
  }
  build(t, e, s) {
    cr(t, e, this.isSVGTag, s.transformTemplate);
  }
  renderInstance(t, e, s, n) {
    Xo(t, e, 0, n);
  }
  mount(t) {
    (this.isSVGTag = dr(t.tagName)), super.mount(t);
  }
}
const Fr = s(
  Ar({ ...Ns, ...wo, ...co, ...So }, (e, s) =>
    Ko(e) ? new Lr(s) : new jr(s, { allowProjection: e !== t.Fragment }),
  ),
);
class Br extends t.Component {
  getSnapshotBeforeUpdate(t) {
    const e = this.props.childRef.current;
    if (e && t.isPresent && !this.props.isPresent) {
      const t = this.props.sizeRef.current;
      (t.height = e.offsetHeight || 0),
        (t.width = e.offsetWidth || 0),
        (t.top = e.offsetTop),
        (t.left = e.offsetLeft);
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function Or({ children: s, isPresent: n }) {
  const i = t.useId(),
    o = t.useRef(null),
    r = t.useRef({ width: 0, height: 0, top: 0, left: 0 }),
    { nonce: a } = t.useContext(Ao);
  return (
    t.useInsertionEffect(() => {
      const { width: t, height: e, top: s, left: l } = r.current;
      if (n || !o.current || !t || !e) return;
      o.current.dataset.motionPopId = i;
      const u = document.createElement('style');
      return (
        a && (u.nonce = a),
        document.head.appendChild(u),
        u.sheet &&
          u.sheet.insertRule(
            `\n          [data-motion-pop-id="${i}"] {\n            position: absolute !important;\n            width: ${t}px !important;\n            height: ${e}px !important;\n            top: ${s}px !important;\n            left: ${l}px !important;\n          }\n        `,
          ),
        () => {
          document.head.removeChild(u);
        }
      );
    }, [n]),
    e.jsx(Br, { isPresent: n, childRef: o, sizeRef: r, children: t.cloneElement(s, { ref: o }) })
  );
}
const Ir = ({
  children: s,
  initial: n,
  isPresent: i,
  onExitComplete: o,
  custom: r,
  presenceAffectsLayout: a,
  mode: l,
}) => {
  const u = _o(Ur),
    h = t.useId(),
    c = t.useMemo(
      () => ({
        id: h,
        initial: n,
        isPresent: i,
        custom: r,
        onExitComplete: (t) => {
          u.set(t, !0);
          for (const e of u.values()) if (!e) return;
          o && o();
        },
        register: (t) => (u.set(t, !1), () => u.delete(t)),
      }),
      a ? [Math.random()] : [i],
    );
  return (
    t.useMemo(() => {
      u.forEach((t, e) => u.set(e, !1));
    }, [i]),
    t.useEffect(() => {
      !i && !u.size && o && o();
    }, [i]),
    'popLayout' === l && (s = e.jsx(Or, { isPresent: i, children: s })),
    e.jsx(Xn.Provider, { value: c, children: s })
  );
};
function Ur() {
  return new Map();
}
const Wr = (t) => t.key || '';
function Nr(e) {
  const s = [];
  return (
    t.Children.forEach(e, (e) => {
      t.isValidElement(e) && s.push(e);
    }),
    s
  );
}
const $r = ({
  children: s,
  exitBeforeEnter: n,
  custom: i,
  initial: o = !0,
  onExitComplete: r,
  presenceAffectsLayout: a = !0,
  mode: l = 'sync',
}) => {
  const u = t.useMemo(() => Nr(s), [s]),
    h = u.map(Wr),
    c = t.useRef(!0),
    d = t.useRef(u),
    p = _o(() => new Map()),
    [m, f] = t.useState(u),
    [v, g] = t.useState(u);
  Vo(() => {
    (c.current = !1), (d.current = u);
    for (let t = 0; t < v.length; t++) {
      const e = Wr(v[t]);
      h.includes(e) ? p.delete(e) : !0 !== p.get(e) && p.set(e, !1);
    }
  }, [v, h.length, h.join('-')]);
  const y = [];
  if (u !== m) {
    let t = [...u];
    for (let e = 0; e < v.length; e++) {
      const s = v[e],
        n = Wr(s);
      h.includes(n) || (t.splice(e, 0, s), y.push(s));
    }
    return 'wait' === l && y.length && (t = y), g(Nr(t)), void f(u);
  }
  const { forceRender: x } = t.useContext(Gn);
  return e.jsx(e.Fragment, {
    children: v.map((t) => {
      const s = Wr(t),
        n = u === v || h.includes(s);
      return e.jsx(
        Ir,
        {
          isPresent: n,
          initial: !(c.current && !o) && void 0,
          custom: n ? void 0 : i,
          presenceAffectsLayout: a,
          mode: l,
          onExitComplete: n
            ? void 0
            : () => {
                if (!p.has(s)) return;
                p.set(s, !0);
                let t = !0;
                p.forEach((e) => {
                  e || (t = !1);
                }),
                  t && (null == x || x(), g(d.current), r && r());
              },
          children: t,
        },
        s,
      );
    }),
  });
};
export { $r as A, Fr as m };
