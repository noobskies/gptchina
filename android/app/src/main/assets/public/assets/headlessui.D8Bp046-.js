import {
  r as e,
  R as t,
  a as n,
  u as r,
  o,
  s as l,
  f as i,
  i as u,
  b as a,
  c as s,
  d as c,
  e as d,
  g as f,
  $ as p,
  h as m,
} from './vendor.BwD-2nqP.js';
var v = Object.defineProperty,
  g = (e, t, n) => (
    ((e, t, n) => {
      t in e ? v(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n);
    })(e, 'symbol' != typeof t ? t + '' : t, n),
    n
  );
let h = new (class {
  constructor() {
    g(this, 'current', this.detect()), g(this, 'handoffState', 'pending'), g(this, 'currentId', 0);
  }
  set(e) {
    this.current !== e &&
      ((this.handoffState = 'pending'), (this.currentId = 0), (this.current = e));
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return 'server' === this.current;
  }
  get isClient() {
    return 'client' === this.current;
  }
  detect() {
    return 'undefined' == typeof window || 'undefined' == typeof document ? 'server' : 'client';
  }
  handoff() {
    'pending' === this.handoffState && (this.handoffState = 'complete');
  }
  get isHandoffComplete() {
    return 'complete' === this.handoffState;
  }
})();
function b(e) {
  return h.isServer
    ? null
    : e instanceof Node
      ? e.ownerDocument
      : null != e && e.hasOwnProperty('current') && e.current instanceof Node
        ? e.current.ownerDocument
        : document;
}
function y(e) {
  'function' == typeof queueMicrotask
    ? queueMicrotask(e)
    : Promise.resolve()
        .then(e)
        .catch((e) =>
          setTimeout(() => {
            throw e;
          }),
        );
}
function E() {
  let e = [],
    t = {
      addEventListener: (e, n, r, o) => (
        e.addEventListener(n, r, o), t.add(() => e.removeEventListener(n, r, o))
      ),
      requestAnimationFrame(...e) {
        let n = requestAnimationFrame(...e);
        return t.add(() => cancelAnimationFrame(n));
      },
      nextFrame: (...e) => t.requestAnimationFrame(() => t.requestAnimationFrame(...e)),
      setTimeout(...e) {
        let n = setTimeout(...e);
        return t.add(() => clearTimeout(n));
      },
      microTask(...e) {
        let n = { current: !0 };
        return (
          y(() => {
            n.current && e[0]();
          }),
          t.add(() => {
            n.current = !1;
          })
        );
      },
      style(e, t, n) {
        let r = e.style.getPropertyValue(t);
        return (
          Object.assign(e.style, { [t]: n }),
          this.add(() => {
            Object.assign(e.style, { [t]: r });
          })
        );
      },
      group(e) {
        let t = E();
        return e(t), this.add(() => t.dispose());
      },
      add: (t) => (
        e.includes(t) || e.push(t),
        () => {
          let n = e.indexOf(t);
          if (n >= 0) for (let t of e.splice(n, 1)) t();
        }
      ),
      dispose() {
        for (let t of e.splice(0)) t();
      },
    };
  return t;
}
function x() {
  let [t] = e.useState(E);
  return e.useEffect(() => () => t.dispose(), [t]), t;
}
let S = (t, n) => {
  h.isServer ? e.useEffect(t, n) : e.useLayoutEffect(t, n);
};
function w(t) {
  let n = e.useRef(t);
  return (
    S(() => {
      n.current = t;
    }, [t]),
    n
  );
}
let R = function (e) {
  let n = w(e);
  return t.useCallback((...e) => n.current(...e), [n]);
};
function P({ disabled: t = !1 } = {}) {
  let n = e.useRef(null),
    [r, o] = e.useState(!1),
    l = x(),
    i = R(() => {
      (n.current = null), o(!1), l.dispose();
    }),
    u = R((e) => {
      if ((l.dispose(), null === n.current)) {
        (n.current = e.currentTarget), o(!0);
        {
          let t = b(e.currentTarget);
          l.addEventListener(t, 'pointerup', i, !1),
            l.addEventListener(
              t,
              'pointermove',
              (e) => {
                if (n.current) {
                  let t = (function (e) {
                    let t = e.width / 2,
                      n = e.height / 2;
                    return {
                      top: e.clientY - n,
                      right: e.clientX + t,
                      bottom: e.clientY + n,
                      left: e.clientX - t,
                    };
                  })(e);
                  o(
                    (function (e, t) {
                      return !(
                        !e ||
                        !t ||
                        e.right < t.left ||
                        e.left > t.right ||
                        e.bottom < t.top ||
                        e.top > t.bottom
                      );
                    })(t, n.current.getBoundingClientRect()),
                  );
                }
              },
              !1,
            ),
            l.addEventListener(t, 'pointercancel', i, !1);
        }
      }
    });
  return { pressed: r, pressProps: t ? {} : { onPointerDown: u, onPointerUp: i, onClick: i } };
}
let I = e.createContext(void 0);
function T() {
  return e.useContext(I);
}
function C(...e) {
  return Array.from(new Set(e.flatMap((e) => ('string' == typeof e ? e.split(' ') : []))))
    .filter(Boolean)
    .join(' ');
}
function O(e, t, ...n) {
  if (e in t) {
    let r = t[e];
    return 'function' == typeof r ? r(...n) : r;
  }
  let r = new Error(
    `Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      t,
    )
      .map((e) => `"${e}"`)
      .join(', ')}.`,
  );
  throw (Error.captureStackTrace && Error.captureStackTrace(r, O), r);
}
var F,
  M,
  L =
    (((M = L || {})[(M.None = 0)] = 'None'),
    (M[(M.RenderStrategy = 1)] = 'RenderStrategy'),
    (M[(M.Static = 2)] = 'Static'),
    M),
  D = (((F = D || {})[(F.Unmount = 0)] = 'Unmount'), (F[(F.Hidden = 1)] = 'Hidden'), F);
function k({
  ourProps: e,
  theirProps: t,
  slot: n,
  defaultTag: r,
  features: o,
  visible: l = !0,
  name: i,
  mergeRefs: u,
}) {
  u = null != u ? u : H;
  let a = _(t, e);
  if (l) return A(a, n, r, i, u);
  let s = null != o ? o : 0;
  if (2 & s) {
    let { static: e = !1, ...t } = a;
    if (e) return A(t, n, r, i, u);
  }
  if (1 & s) {
    let { unmount: e = !0, ...t } = a;
    return O(e ? 0 : 1, {
      0: () => null,
      1: () => A({ ...t, hidden: !0, style: { display: 'none' } }, n, r, i, u),
    });
  }
  return A(a, n, r, i, u);
}
function A(t, n = {}, r, o, l) {
  let { as: i = r, children: u, refName: a = 'ref', ...s } = U(t, ['unmount', 'static']),
    c = void 0 !== t.ref ? { [a]: t.ref } : {},
    d = 'function' == typeof u ? u(n) : u;
  'className' in s &&
    s.className &&
    'function' == typeof s.className &&
    (s.className = s.className(n)),
    s['aria-labelledby'] && s['aria-labelledby'] === s.id && (s['aria-labelledby'] = void 0);
  let f = {};
  if (n) {
    let e = !1,
      t = [];
    for (let [r, o] of Object.entries(n))
      'boolean' == typeof o && (e = !0),
        !0 === o && t.push(r.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`));
    if (e) {
      f['data-headlessui-state'] = t.join(' ');
      for (let e of t) f[`data-${e}`] = '';
    }
  }
  if (i === e.Fragment && (Object.keys(B(s)).length > 0 || Object.keys(B(f)).length > 0)) {
    if (e.isValidElement(d) && !(Array.isArray(d) && d.length > 1)) {
      let t = d.props,
        n = null == t ? void 0 : t.className,
        r = 'function' == typeof n ? (...e) => C(n(...e), s.className) : C(n, s.className),
        o = r ? { className: r } : {},
        i = _(d.props, B(U(s, ['ref'])));
      for (let e in f) e in i && delete f[e];
      return e.cloneElement(d, Object.assign({}, i, f, c, { ref: l(d.ref, c.ref) }, o));
    }
    if (Object.keys(B(s)).length > 0)
      throw new Error(
        [
          'Passing props on "Fragment"!',
          '',
          `The current component <${o} /> is rendering a "Fragment".`,
          'However we need to passthrough the following props:',
          Object.keys(B(s))
            .concat(Object.keys(B(f)))
            .map((e) => `  - ${e}`)
            .join('\n'),
          '',
          'You can apply a few solutions:',
          [
            'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
            'Render a single element as the child so that we can forward the props onto that element.',
          ]
            .map((e) => `  - ${e}`)
            .join('\n'),
        ].join('\n'),
      );
  }
  return e.createElement(
    i,
    Object.assign({}, U(s, ['ref']), i !== e.Fragment && c, i !== e.Fragment && f),
    d,
  );
}
function N() {
  let t = e.useRef([]),
    n = e.useCallback((e) => {
      for (let n of t.current) null != n && ('function' == typeof n ? n(e) : (n.current = e));
    }, []);
  return (...e) => {
    if (!e.every((e) => null == e)) return (t.current = e), n;
  };
}
function H(...e) {
  return e.every((e) => null == e)
    ? void 0
    : (t) => {
        for (let n of e) null != n && ('function' == typeof n ? n(t) : (n.current = t));
      };
}
function _(...e) {
  if (0 === e.length) return {};
  if (1 === e.length) return e[0];
  let t = {},
    n = {};
  for (let r of e)
    for (let e in r)
      e.startsWith('on') && 'function' == typeof r[e]
        ? (null != n[e] || (n[e] = []), n[e].push(r[e]))
        : (t[e] = r[e]);
  if (t.disabled || t['aria-disabled'])
    for (let r in n)
      /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(r) &&
        (n[r] = [
          (e) => {
            var t;
            return null == (t = null == e ? void 0 : e.preventDefault) ? void 0 : t.call(e);
          },
        ]);
  for (let r in n)
    Object.assign(t, {
      [r](e, ...t) {
        let o = n[r];
        for (let n of o) {
          if (
            (e instanceof Event || (null == e ? void 0 : e.nativeEvent) instanceof Event) &&
            e.defaultPrevented
          )
            return;
          n(e, ...t);
        }
      },
    });
  return t;
}
function j(...e) {
  if (0 === e.length) return {};
  if (1 === e.length) return e[0];
  let t = {},
    n = {};
  for (let r of e)
    for (let e in r)
      e.startsWith('on') && 'function' == typeof r[e]
        ? (null != n[e] || (n[e] = []), n[e].push(r[e]))
        : (t[e] = r[e]);
  for (let r in n)
    Object.assign(t, {
      [r](...e) {
        let t = n[r];
        for (let n of t) null == n || n(...e);
      },
    });
  return t;
}
function $(t) {
  var n;
  return Object.assign(e.forwardRef(t), { displayName: null != (n = t.displayName) ? n : t.name });
}
function B(e) {
  let t = Object.assign({}, e);
  for (let n in t) void 0 === t[n] && delete t[n];
  return t;
}
function U(e, t = []) {
  let n = Object.assign({}, e);
  for (let r of t) r in n && delete n[r];
  return n;
}
function V(e = {}, t = null, n = []) {
  for (let [r, o] of Object.entries(e)) K(n, W(t, r), o);
  return n;
}
function W(e, t) {
  return e ? e + '[' + t + ']' : t;
}
function K(e, t, n) {
  if (Array.isArray(n)) for (let [r, o] of n.entries()) K(e, W(t, r.toString()), o);
  else
    n instanceof Date
      ? e.push([t, n.toISOString()])
      : 'boolean' == typeof n
        ? e.push([t, n ? '1' : '0'])
        : 'string' == typeof n
          ? e.push([t, n])
          : 'number' == typeof n
            ? e.push([t, `${n}`])
            : null == n
              ? e.push([t, ''])
              : V(n, t, e);
}
var Q = ((e) => (
  (e[(e.None = 1)] = 'None'),
  (e[(e.Focusable = 2)] = 'Focusable'),
  (e[(e.Hidden = 4)] = 'Hidden'),
  e
))(Q || {});
let q = $(function (e, t) {
    var n;
    let { features: r = 1, ...o } = e;
    return k({
      ourProps: {
        ref: t,
        'aria-hidden': 2 == (2 & r) || (null != (n = o['aria-hidden']) ? n : void 0),
        hidden: 4 == (4 & r) || void 0,
        style: {
          position: 'fixed',
          top: 1,
          left: 1,
          width: 1,
          height: 0,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
          ...(4 == (4 & r) && 2 != (2 & r) && { display: 'none' }),
        },
      },
      theirProps: o,
      slot: {},
      defaultTag: 'span',
      name: 'Hidden',
    });
  }),
  Y = e.createContext(null);
function G({ children: r }) {
  let o = e.useContext(Y);
  if (!o) return t.createElement(t.Fragment, null, r);
  let { target: l } = o;
  return l ? n.createPortal(t.createElement(t.Fragment, null, r), l) : null;
}
function X({ data: n, form: r, disabled: o, onReset: l, overrides: i }) {
  let [u, a] = e.useState(null),
    s = x();
  return (
    e.useEffect(() => {
      if (l && u) return s.addEventListener(u, 'reset', l);
    }, [u, r, l]),
    t.createElement(
      G,
      null,
      t.createElement(z, { setForm: a, formId: r }),
      V(n).map(([e, n]) =>
        t.createElement(q, {
          features: Q.Hidden,
          ...B({
            key: e,
            as: 'input',
            type: 'hidden',
            hidden: !0,
            readOnly: !0,
            form: r,
            disabled: o,
            name: e,
            value: n,
            ...i,
          }),
        }),
      ),
    )
  );
}
function z({ setForm: n, formId: r }) {
  return (
    e.useEffect(() => {
      if (r) {
        let e = document.getElementById(r);
        e && n(e);
      }
    }, [n, r]),
    r
      ? null
      : t.createElement(q, {
          features: Q.Hidden,
          as: 'input',
          type: 'hidden',
          hidden: !0,
          readOnly: !0,
          ref: (e) => {
            if (!e) return;
            let t = e.closest('form');
            t && n(t);
          },
        })
  );
}
let J = e.createContext(void 0);
function Z() {
  return e.useContext(J);
}
function ee(e) {
  let t = e.parentElement,
    n = null;
  for (; t && !(t instanceof HTMLFieldSetElement); )
    t instanceof HTMLLegendElement && (n = t), (t = t.parentElement);
  let r = '' === (null == t ? void 0 : t.getAttribute('disabled'));
  return (
    (!r ||
      !(function (e) {
        if (!e) return !1;
        let t = e.previousElementSibling;
        for (; null !== t; ) {
          if (t instanceof HTMLLegendElement) return !1;
          t = t.previousElementSibling;
        }
        return !0;
      })(n)) &&
    r
  );
}
let te = Symbol();
function ne(e, t = !0) {
  return Object.assign(e, { [te]: t });
}
function re(...t) {
  let n = e.useRef(t);
  e.useEffect(() => {
    n.current = t;
  }, [t]);
  let r = R((e) => {
    for (let t of n.current) null != t && ('function' == typeof t ? t(e) : (t.current = e));
  });
  return t.every((e) => null == e || (null == e ? void 0 : e[te])) ? void 0 : r;
}
let oe = e.createContext(null);
function le() {
  let t = e.useContext(oe);
  if (null === t) {
    let e = new Error(
      'You used a <Description /> component, but it is not inside a relevant parent.',
    );
    throw (Error.captureStackTrace && Error.captureStackTrace(e, le), e);
  }
  return t;
}
function ie() {
  let [n, r] = e.useState([]);
  return [
    n.length > 0 ? n.join(' ') : void 0,
    e.useMemo(
      () =>
        function (n) {
          let o = R(
              (e) => (
                r((t) => [...t, e]),
                () =>
                  r((t) => {
                    let n = t.slice(),
                      r = n.indexOf(e);
                    return -1 !== r && n.splice(r, 1), n;
                  })
              ),
            ),
            l = e.useMemo(
              () => ({ register: o, slot: n.slot, name: n.name, props: n.props, value: n.value }),
              [o, n.slot, n.name, n.props, n.value],
            );
          return t.createElement(oe.Provider, { value: l }, n.children);
        },
      [r],
    ),
  ];
}
oe.displayName = 'DescriptionContext';
let ue = $(function (t, n) {
    let r = e.useId(),
      o = T(),
      { id: l = `headlessui-description-${r}`, ...i } = t,
      u = le(),
      a = re(n);
    S(() => u.register(l), [l, u.register]);
    let s = o || !1,
      c = e.useMemo(() => ({ ...u.slot, disabled: s }), [u.slot, s]);
    return k({
      ourProps: { ref: a, ...u.props, id: l },
      theirProps: i,
      slot: c,
      defaultTag: 'p',
      name: u.name || 'Description',
    });
  }),
  ae = Object.assign(ue, {});
var se,
  ce =
    (((se = ce || {}).Space = ' '),
    (se.Enter = 'Enter'),
    (se.Escape = 'Escape'),
    (se.Backspace = 'Backspace'),
    (se.Delete = 'Delete'),
    (se.ArrowLeft = 'ArrowLeft'),
    (se.ArrowUp = 'ArrowUp'),
    (se.ArrowRight = 'ArrowRight'),
    (se.ArrowDown = 'ArrowDown'),
    (se.Home = 'Home'),
    (se.End = 'End'),
    (se.PageUp = 'PageUp'),
    (se.PageDown = 'PageDown'),
    (se.Tab = 'Tab'),
    se);
let de = e.createContext(null);
function fe() {
  let t = e.useContext(de);
  if (null === t) {
    let e = new Error('You used a <Label /> component, but it is not inside a relevant parent.');
    throw (Error.captureStackTrace && Error.captureStackTrace(e, fe), e);
  }
  return t;
}
function pe(t) {
  var n, r, o;
  let l = null != (r = null == (n = e.useContext(de)) ? void 0 : n.value) ? r : void 0;
  return (null != (o = null == t ? void 0 : t.length) ? o : 0) > 0
    ? [l, ...t].filter(Boolean).join(' ')
    : l;
}
function me({ inherit: n = !1 } = {}) {
  let r = pe(),
    [o, l] = e.useState([]),
    i = n ? [r, ...o].filter(Boolean) : o;
  return [
    i.length > 0 ? i.join(' ') : void 0,
    e.useMemo(
      () =>
        function (n) {
          let r = R(
              (e) => (
                l((t) => [...t, e]),
                () =>
                  l((t) => {
                    let n = t.slice(),
                      r = n.indexOf(e);
                    return -1 !== r && n.splice(r, 1), n;
                  })
              ),
            ),
            o = e.useMemo(
              () => ({ register: r, slot: n.slot, name: n.name, props: n.props, value: n.value }),
              [r, n.slot, n.name, n.props, n.value],
            );
          return t.createElement(de.Provider, { value: o }, n.children);
        },
      [l],
    ),
  ];
}
de.displayName = 'LabelContext';
let ve = $(function (t, n) {
    var r;
    let o = e.useId(),
      l = fe(),
      i = Z(),
      u = T(),
      {
        id: a = `headlessui-label-${o}`,
        htmlFor: s = null != i ? i : null == (r = l.props) ? void 0 : r.htmlFor,
        passive: c = !1,
        ...d
      } = t,
      f = re(n);
    S(() => l.register(a), [a, l.register]);
    let p = R((e) => {
        let t = e.currentTarget;
        if (
          (t instanceof HTMLLabelElement && e.preventDefault(),
          l.props &&
            'onClick' in l.props &&
            'function' == typeof l.props.onClick &&
            l.props.onClick(e),
          t instanceof HTMLLabelElement)
        ) {
          let e = document.getElementById(t.htmlFor);
          if (e) {
            let t = e.getAttribute('disabled');
            if ('true' === t || '' === t) return;
            let n = e.getAttribute('aria-disabled');
            if ('true' === n || '' === n) return;
            ((e instanceof HTMLInputElement && ('radio' === e.type || 'checkbox' === e.type)) ||
              'radio' === e.role ||
              'checkbox' === e.role ||
              'switch' === e.role) &&
              e.click(),
              e.focus({ preventScroll: !0 });
          }
        }
      }),
      m = u || !1,
      v = e.useMemo(() => ({ ...l.slot, disabled: m }), [l.slot, m]),
      g = { ref: f, ...l.props, id: a, htmlFor: s, onClick: p };
    return (
      c &&
        ('onClick' in g && (delete g.htmlFor, delete g.onClick),
        'onClick' in d && delete d.onClick),
      k({
        ourProps: g,
        theirProps: d,
        slot: v,
        defaultTag: s ? 'label' : 'div',
        name: l.name || 'Label',
      })
    );
  }),
  ge = Object.assign(ve, {}),
  he = e.createContext(() => {});
function be({ value: e, children: n }) {
  return t.createElement(he.Provider, { value: e }, n);
}
function ye(e, t) {
  return null !== e &&
    null !== t &&
    'object' == typeof e &&
    'object' == typeof t &&
    'id' in e &&
    'id' in t
    ? e.id === t.id
    : e === t;
}
function Ee(t, n = !1) {
  let r = null === t ? null : 'current' in t ? t.current : t,
    [o, l] = e.useReducer(() => ({}), {}),
    i = e.useMemo(
      () =>
        (function (e) {
          if (null === e) return { width: 0, height: 0 };
          let { width: t, height: n } = e.getBoundingClientRect();
          return { width: t, height: n };
        })(r),
      [r, o],
    );
  return (
    S(() => {
      if (!r) return;
      let e = new ResizeObserver(l);
      return (
        e.observe(r),
        () => {
          e.disconnect();
        }
      );
    }, [r]),
    n ? { width: `${i.width}px`, height: `${i.height}px` } : i
  );
}
let xe = class extends Map {
  constructor(e) {
    super(), (this.factory = e);
  }
  get(e) {
    let t = super.get(e);
    return void 0 === t && ((t = this.factory(e)), this.set(e, t)), t;
  }
};
function Se(e, t) {
  let n = e(),
    r = new Set();
  return {
    getSnapshot: () => n,
    subscribe: (e) => (r.add(e), () => r.delete(e)),
    dispatch(e, ...o) {
      let l = t[e].call(n, ...o);
      l && ((n = l), r.forEach((e) => e()));
    },
  };
}
function we(t) {
  return e.useSyncExternalStore(t.subscribe, t.getSnapshot, t.getSnapshot);
}
let Re = new xe(() =>
  Se(() => [], {
    ADD(e) {
      return this.includes(e) ? this : [...this, e];
    },
    REMOVE(e) {
      let t = this.indexOf(e);
      if (-1 === t) return this;
      let n = this.slice();
      return n.splice(t, 1), n;
    },
  }),
);
function Pe(t, n) {
  let r = Re.get(n),
    o = e.useId(),
    l = we(r);
  if (
    (S(() => {
      if (t) return r.dispatch('ADD', o), () => r.dispatch('REMOVE', o);
    }, [r, t]),
    !t)
  )
    return !1;
  let i = l.indexOf(o),
    u = l.length;
  return -1 === i && ((i = u), (u += 1)), i === u - 1;
}
let Ie = new Map(),
  Te = new Map();
function Ce(e) {
  var t;
  let n = null != (t = Te.get(e)) ? t : 0;
  return (
    Te.set(e, n + 1),
    0 !== n ||
      (Ie.set(e, { 'aria-hidden': e.getAttribute('aria-hidden'), inert: e.inert }),
      e.setAttribute('aria-hidden', 'true'),
      (e.inert = !0)),
    () => Oe(e)
  );
}
function Oe(e) {
  var t;
  let n = null != (t = Te.get(e)) ? t : 1;
  if ((1 === n ? Te.delete(e) : Te.set(e, n - 1), 1 !== n)) return;
  let r = Ie.get(e);
  r &&
    (null === r['aria-hidden']
      ? e.removeAttribute('aria-hidden')
      : e.setAttribute('aria-hidden', r['aria-hidden']),
    (e.inert = r.inert),
    Ie.delete(e));
}
function Fe(e, { allowed: t, disallowed: n } = {}) {
  let r = Pe(e, 'inert-others');
  S(() => {
    var e, o;
    if (!r) return;
    let l = E();
    for (let t of null != (e = null == n ? void 0 : n()) ? e : []) t && l.add(Ce(t));
    let i = null != (o = null == t ? void 0 : t()) ? o : [];
    for (let t of i) {
      if (!t) continue;
      let e = b(t);
      if (!e) continue;
      let n = t.parentElement;
      for (; n && n !== e.body; ) {
        for (let e of n.children) i.some((t) => e.contains(t)) || l.add(Ce(e));
        n = n.parentElement;
      }
    }
    return l.dispose;
  }, [r, t, n]);
}
function Me(t, n, r) {
  let o = w((e) => {
    let t = e.getBoundingClientRect();
    0 === t.x && 0 === t.y && 0 === t.width && 0 === t.height && r();
  });
  e.useEffect(() => {
    if (!t) return;
    let e = null === n ? null : n instanceof HTMLElement ? n : n.current;
    if (!e) return;
    let r = E();
    if ('undefined' != typeof ResizeObserver) {
      let t = new ResizeObserver(() => o.current(e));
      t.observe(e), r.add(() => t.disconnect());
    }
    if ('undefined' != typeof IntersectionObserver) {
      let t = new IntersectionObserver(() => o.current(e));
      t.observe(e), r.add(() => t.disconnect());
    }
    return () => r.dispose();
  }, [n, o, t]);
}
let Le = [
    '[contentEditable=true]',
    '[tabindex]',
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'iframe',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
  ]
    .map((e) => `${e}:not([tabindex='-1'])`)
    .join(','),
  De = ['[data-autofocus]'].map((e) => `${e}:not([tabindex='-1'])`).join(',');
var ke,
  Ae,
  Ne,
  He =
    (((Ne = He || {})[(Ne.First = 1)] = 'First'),
    (Ne[(Ne.Previous = 2)] = 'Previous'),
    (Ne[(Ne.Next = 4)] = 'Next'),
    (Ne[(Ne.Last = 8)] = 'Last'),
    (Ne[(Ne.WrapAround = 16)] = 'WrapAround'),
    (Ne[(Ne.NoScroll = 32)] = 'NoScroll'),
    (Ne[(Ne.AutoFocus = 64)] = 'AutoFocus'),
    Ne),
  _e =
    (((Ae = _e || {})[(Ae.Error = 0)] = 'Error'),
    (Ae[(Ae.Overflow = 1)] = 'Overflow'),
    (Ae[(Ae.Success = 2)] = 'Success'),
    (Ae[(Ae.Underflow = 3)] = 'Underflow'),
    Ae),
  je = (((ke = je || {})[(ke.Previous = -1)] = 'Previous'), (ke[(ke.Next = 1)] = 'Next'), ke);
function $e(e = document.body) {
  return null == e
    ? []
    : Array.from(e.querySelectorAll(Le)).sort((e, t) =>
        Math.sign(
          (e.tabIndex || Number.MAX_SAFE_INTEGER) - (t.tabIndex || Number.MAX_SAFE_INTEGER),
        ),
      );
}
var Be = ((e) => ((e[(e.Strict = 0)] = 'Strict'), (e[(e.Loose = 1)] = 'Loose'), e))(Be || {});
function Ue(e, t = 0) {
  var n;
  return (
    e !== (null == (n = b(e)) ? void 0 : n.body) &&
    O(t, {
      0: () => e.matches(Le),
      1() {
        let t = e;
        for (; null !== t; ) {
          if (t.matches(Le)) return !0;
          t = t.parentElement;
        }
        return !1;
      },
    })
  );
}
function Ve(e) {
  let t = b(e);
  E().nextFrame(() => {
    t && !Ue(t.activeElement, 0) && Ke(e);
  });
}
var We = ((e) => ((e[(e.Keyboard = 0)] = 'Keyboard'), (e[(e.Mouse = 1)] = 'Mouse'), e))(We || {});
function Ke(e) {
  null == e || e.focus({ preventScroll: !0 });
}
'undefined' != typeof window &&
  'undefined' != typeof document &&
  (document.addEventListener(
    'keydown',
    (e) => {
      e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        (document.documentElement.dataset.headlessuiFocusVisible = '');
    },
    !0,
  ),
  document.addEventListener(
    'click',
    (e) => {
      1 === e.detail
        ? delete document.documentElement.dataset.headlessuiFocusVisible
        : 0 === e.detail && (document.documentElement.dataset.headlessuiFocusVisible = '');
    },
    !0,
  ));
let Qe = ['textarea', 'input'].join(',');
function qe(e, t = (e) => e) {
  return e.slice().sort((e, n) => {
    let r = t(e),
      o = t(n);
    if (null === r || null === o) return 0;
    let l = r.compareDocumentPosition(o);
    return l & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : l & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function Ye(e, t) {
  return Ge($e(), t, { relativeTo: e });
}
function Ge(e, t, { sorted: n = !0, relativeTo: r = null, skipElements: o = [] } = {}) {
  let l = Array.isArray(e) ? (e.length > 0 ? e[0].ownerDocument : document) : e.ownerDocument,
    i = Array.isArray(e)
      ? n
        ? qe(e)
        : e
      : 64 & t
        ? (function (e = document.body) {
            return null == e
              ? []
              : Array.from(e.querySelectorAll(De)).sort((e, t) =>
                  Math.sign(
                    (e.tabIndex || Number.MAX_SAFE_INTEGER) -
                      (t.tabIndex || Number.MAX_SAFE_INTEGER),
                  ),
                );
          })(e)
        : $e(e);
  o.length > 0 &&
    i.length > 1 &&
    (i = i.filter(
      (e) =>
        !o.some((t) =>
          null != t && 'current' in t ? (null == t ? void 0 : t.current) === e : t === e,
        ),
    )),
    (r = null != r ? r : l.activeElement);
  let u,
    a = (() => {
      if (5 & t) return 1;
      if (10 & t) return -1;
      throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
    })(),
    s = (() => {
      if (1 & t) return 0;
      if (2 & t) return Math.max(0, i.indexOf(r)) - 1;
      if (4 & t) return Math.max(0, i.indexOf(r)) + 1;
      if (8 & t) return i.length - 1;
      throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
    })(),
    c = 32 & t ? { preventScroll: !0 } : {},
    d = 0,
    f = i.length;
  do {
    if (d >= f || d + f <= 0) return 0;
    let e = s + d;
    if (16 & t) e = (e + f) % f;
    else {
      if (e < 0) return 3;
      if (e >= f) return 1;
    }
    (u = i[e]), null == u || u.focus(c), (d += a);
  } while (u !== l.activeElement);
  return (
    6 & t &&
      (function (e) {
        var t, n;
        return (
          null != (n = null == (t = null == e ? void 0 : e.matches) ? void 0 : t.call(e, Qe)) && n
        );
      })(u) &&
      u.select(),
    2
  );
}
function Xe() {
  return (
    /iPhone/gi.test(window.navigator.platform) ||
    (/Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0)
  );
}
function ze() {
  return Xe() || /Android/gi.test(window.navigator.userAgent);
}
function Je(t, n, r, o) {
  let l = w(r);
  e.useEffect(() => {
    if (t) return document.addEventListener(n, e, o), () => document.removeEventListener(n, e, o);
    function e(e) {
      l.current(e);
    }
  }, [t, n, o]);
}
function Ze(t, n, r, o) {
  let l = w(r);
  e.useEffect(() => {
    if (t) return window.addEventListener(n, e, o), () => window.removeEventListener(n, e, o);
    function e(e) {
      l.current(e);
    }
  }, [t, n, o]);
}
const et = 30;
function tt(t, n, r) {
  let o = Pe(t, 'outside-click'),
    l = w(r),
    i = e.useCallback(
      function (e, t) {
        if (e.defaultPrevented) return;
        let r = t(e);
        if (null === r || !r.getRootNode().contains(r) || !r.isConnected) return;
        let o = (function e(t) {
          return 'function' == typeof t ? e(t()) : Array.isArray(t) || t instanceof Set ? t : [t];
        })(n);
        for (let n of o) {
          if (null === n) continue;
          let t = n instanceof HTMLElement ? n : n.current;
          if ((null != t && t.contains(r)) || (e.composed && e.composedPath().includes(t))) return;
        }
        return !Ue(r, Be.Loose) && -1 !== r.tabIndex && e.preventDefault(), l.current(e, r);
      },
      [l],
    ),
    u = e.useRef(null);
  Je(
    o,
    'pointerdown',
    (e) => {
      var t, n;
      u.current =
        (null == (n = null == (t = e.composedPath) ? void 0 : t.call(e)) ? void 0 : n[0]) ||
        e.target;
    },
    !0,
  ),
    Je(
      o,
      'mousedown',
      (e) => {
        var t, n;
        u.current =
          (null == (n = null == (t = e.composedPath) ? void 0 : t.call(e)) ? void 0 : n[0]) ||
          e.target;
      },
      !0,
    ),
    Je(
      o,
      'click',
      (e) => {
        ze() || (u.current && (i(e, () => u.current), (u.current = null)));
      },
      !0,
    );
  let a = e.useRef({ x: 0, y: 0 });
  Je(
    o,
    'touchstart',
    (e) => {
      (a.current.x = e.touches[0].clientX), (a.current.y = e.touches[0].clientY);
    },
    !0,
  ),
    Je(
      o,
      'touchend',
      (e) => {
        let t = e.changedTouches[0].clientX,
          n = e.changedTouches[0].clientY;
        if (!(Math.abs(t - a.current.x) >= et || Math.abs(n - a.current.y) >= et))
          return i(e, () => (e.target instanceof HTMLElement ? e.target : null));
      },
      !0,
    ),
    Ze(
      o,
      'blur',
      (e) =>
        i(e, () =>
          window.document.activeElement instanceof HTMLIFrameElement
            ? window.document.activeElement
            : null,
        ),
      !0,
    );
}
function nt(...t) {
  return e.useMemo(() => b(...t), [...t]);
}
function rt(t, n, r, o) {
  let l = w(r);
  e.useEffect(() => {
    function e(e) {
      l.current(e);
    }
    return (
      (t = null != t ? t : window).addEventListener(n, e, o), () => t.removeEventListener(n, e, o)
    );
  }, [t, n, o]);
}
function ot(e) {
  var t;
  if (e.type) return e.type;
  let n = null != (t = e.as) ? t : 'button';
  return 'string' == typeof n && 'button' === n.toLowerCase() ? 'button' : void 0;
}
function lt(t, n) {
  let [r, o] = e.useState(() => ot(t));
  return (
    S(() => {
      o(ot(t));
    }, [t.type, t.as]),
    S(() => {
      r ||
        (n.current &&
          n.current instanceof HTMLButtonElement &&
          !n.current.hasAttribute('type') &&
          o('button'));
    }, [r, n]),
    r
  );
}
function it() {
  let e;
  return {
    before({ doc: t }) {
      var n;
      let r = t.documentElement,
        o = null != (n = t.defaultView) ? n : window;
      e = Math.max(0, o.innerWidth - r.clientWidth);
    },
    after({ doc: t, d: n }) {
      let r = t.documentElement,
        o = Math.max(0, r.clientWidth - r.offsetWidth),
        l = Math.max(0, e - o);
      n.style(r, 'paddingRight', `${l}px`);
    },
  };
}
function ut(e) {
  let t = {};
  for (let n of e) Object.assign(t, n(t));
  return t;
}
let at = Se(() => new Map(), {
  PUSH(e, t) {
    var n;
    let r = null != (n = this.get(e)) ? n : { doc: e, count: 0, d: E(), meta: new Set() };
    return r.count++, r.meta.add(t), this.set(e, r), this;
  },
  POP(e, t) {
    let n = this.get(e);
    return n && (n.count--, n.meta.delete(t)), this;
  },
  SCROLL_PREVENT({ doc: e, d: t, meta: n }) {
    let r = { doc: e, d: t, meta: ut(n) },
      o = [
        Xe()
          ? {
              before({ doc: e, d: t, meta: n }) {
                function r(e) {
                  return n.containers.flatMap((e) => e()).some((t) => t.contains(e));
                }
                t.microTask(() => {
                  var n;
                  if ('auto' !== window.getComputedStyle(e.documentElement).scrollBehavior) {
                    let n = E();
                    n.style(e.documentElement, 'scrollBehavior', 'auto'),
                      t.add(() => t.microTask(() => n.dispose()));
                  }
                  let o = null != (n = window.scrollY) ? n : window.pageYOffset,
                    l = null;
                  t.addEventListener(
                    e,
                    'click',
                    (t) => {
                      if (t.target instanceof HTMLElement)
                        try {
                          let n = t.target.closest('a');
                          if (!n) return;
                          let { hash: o } = new URL(n.href),
                            i = e.querySelector(o);
                          i && !r(i) && (l = i);
                        } catch {}
                    },
                    !0,
                  ),
                    t.addEventListener(e, 'touchstart', (e) => {
                      if (e.target instanceof HTMLElement)
                        if (r(e.target)) {
                          let n = e.target;
                          for (; n.parentElement && r(n.parentElement); ) n = n.parentElement;
                          t.style(n, 'overscrollBehavior', 'contain');
                        } else t.style(e.target, 'touchAction', 'none');
                    }),
                    t.addEventListener(
                      e,
                      'touchmove',
                      (e) => {
                        if (e.target instanceof HTMLElement) {
                          if ('INPUT' === e.target.tagName) return;
                          if (r(e.target)) {
                            let t = e.target;
                            for (
                              ;
                              t.parentElement &&
                              '' !== t.dataset.headlessuiPortal &&
                              !(t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth);

                            )
                              t = t.parentElement;
                            '' === t.dataset.headlessuiPortal && e.preventDefault();
                          } else e.preventDefault();
                        }
                      },
                      { passive: !1 },
                    ),
                    t.add(() => {
                      var e;
                      let t = null != (e = window.scrollY) ? e : window.pageYOffset;
                      o !== t && window.scrollTo(0, o),
                        l && l.isConnected && (l.scrollIntoView({ block: 'nearest' }), (l = null));
                    });
                });
              },
            }
          : {},
        it(),
        {
          before({ doc: e, d: t }) {
            t.style(e.documentElement, 'overflow', 'hidden');
          },
        },
      ];
    o.forEach(({ before: e }) => (null == e ? void 0 : e(r))),
      o.forEach(({ after: e }) => (null == e ? void 0 : e(r)));
  },
  SCROLL_ALLOW({ d: e }) {
    e.dispose();
  },
  TEARDOWN({ doc: e }) {
    this.delete(e);
  },
});
function st(e, t, n = () => [document.body]) {
  !(function (e, t, n = () => ({ containers: [] })) {
    let r = we(at),
      o = t ? r.get(t) : void 0,
      l = !!o && o.count > 0;
    S(() => {
      if (t && e) return at.dispatch('PUSH', t, n), () => at.dispatch('POP', t, n);
    }, [e, t]);
  })(Pe(e, 'scroll-lock'), t, (e) => {
    var t;
    return { containers: [...(null != (t = e.containers) ? t : []), n] };
  });
}
function ct(e) {
  return [e.screenX, e.screenY];
}
function dt() {
  let t = e.useRef([-1, -1]);
  return {
    wasMoved(e) {
      let n = ct(e);
      return (t.current[0] !== n[0] || t.current[1] !== n[1]) && ((t.current = n), !0);
    },
    update(e) {
      t.current = ct(e);
    },
  };
}
at.subscribe(() => {
  let e = at.getSnapshot(),
    t = new Map();
  for (let [n] of e) t.set(n, n.documentElement.style.overflow);
  for (let n of e.values()) {
    let e = 'hidden' === t.get(n.doc),
      r = 0 !== n.count;
    ((r && !e) || (!r && e)) && at.dispatch(n.count > 0 ? 'SCROLL_PREVENT' : 'SCROLL_ALLOW', n),
      0 === n.count && at.dispatch('TEARDOWN', n);
  }
});
var ft,
  pt =
    (((ft = pt || {})[(ft.None = 0)] = 'None'),
    (ft[(ft.Closed = 1)] = 'Closed'),
    (ft[(ft.Enter = 2)] = 'Enter'),
    (ft[(ft.Leave = 4)] = 'Leave'),
    ft);
function mt(e) {
  let t = {};
  for (let n in e) !0 === e[n] && (t[`data-${n}`] = '');
  return t;
}
function vt(t, n, r, o) {
  let [l, i] = e.useState(r),
    {
      hasFlag: u,
      addFlag: a,
      removeFlag: s,
    } = (function (t = 0) {
      let [n, r] = e.useState(t),
        o = e.useCallback((e) => r(e), [n]),
        l = e.useCallback((e) => r((t) => t | e), [n]),
        i = e.useCallback((e) => (n & e) === e, [n]),
        u = e.useCallback((e) => r((t) => t & ~e), [r]),
        a = e.useCallback((e) => r((t) => t ^ e), [r]);
      return { flags: n, setFlag: o, addFlag: l, hasFlag: i, removeFlag: u, toggleFlag: a };
    })(t && l ? 3 : 0),
    c = e.useRef(!1),
    d = e.useRef(!1),
    f = x();
  return (
    S(
      function e() {
        var l;
        if (!t) return;
        r && i(!0);
        let u = n.current;
        return u
          ? (null == (l = null == o ? void 0 : o.start) || l.call(o, r),
            (function (e, { prepare: t, run: n, done: r, inFlight: o }) {
              let l = E();
              return (
                (function (e, { inFlight: t, prepare: n }) {
                  if (null != t && t.current) return void n();
                  let r = e.style.transition;
                  (e.style.transition = 'none'), n(), e.offsetHeight, (e.style.transition = r);
                })(e, { prepare: t, inFlight: o }),
                l.nextFrame(() => {
                  l.add(
                    (function (e, t) {
                      let n = (function (e) {
                          let t = { called: !1 };
                          return (...n) => {
                            if (!t.called) return (t.called = !0), e(...n);
                          };
                        })(t),
                        r = E();
                      if (!e) return r.dispose;
                      let { transitionDuration: o, transitionDelay: l } = getComputedStyle(e),
                        [i, u] = [o, l].map((e) => {
                          let [t = 0] = e
                            .split(',')
                            .filter(Boolean)
                            .map((e) => (e.includes('ms') ? parseFloat(e) : 1e3 * parseFloat(e)))
                            .sort((e, t) => t - e);
                          return t;
                        }),
                        a = i + u;
                      if (0 !== a) {
                        let t = r.group((r) => {
                          let o = r.setTimeout(() => {
                            n(), r.dispose();
                          }, a);
                          r.addEventListener(e, 'transitionrun', (l) => {
                            l.target === l.currentTarget &&
                              (o(),
                              r.addEventListener(e, 'transitioncancel', (e) => {
                                e.target === e.currentTarget && (n(), t());
                              }));
                          });
                        });
                        r.addEventListener(e, 'transitionend', (e) => {
                          e.target === e.currentTarget && (n(), r.dispose());
                        });
                      } else n();
                      return r.dispose;
                    })(e, r),
                  ),
                    n();
                }),
                l.dispose
              );
            })(u, {
              inFlight: c,
              prepare() {
                d.current ? (d.current = !1) : (d.current = c.current),
                  (c.current = !0),
                  !d.current && (r ? (a(3), s(4)) : (a(4), s(2)));
              },
              run() {
                d.current ? (r ? (s(3), a(4)) : (s(4), a(3))) : r ? s(1) : a(1);
              },
              done() {
                var e;
                (d.current &&
                  'function' == typeof u.getAnimations &&
                  u.getAnimations().length > 0) ||
                  ((c.current = !1),
                  s(7),
                  r || i(!1),
                  null == (e = null == o ? void 0 : o.end) || e.call(o, r));
              },
            }))
          : r
            ? (a(3), f.nextFrame(() => e()))
            : void 0;
      },
      [t, r, n, f],
    ),
    t
      ? [l, { closed: u(1), enter: u(2), leave: u(4), transition: u(2) || u(4) }]
      : [r, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }]
  );
}
function gt(t, n) {
  let r = e.useRef([]),
    o = R(t);
  e.useEffect(() => {
    let e = [...r.current];
    for (let [t, l] of n.entries())
      if (r.current[t] !== l) {
        let t = o(n, e);
        return (r.current = n), t;
      }
  }, [o, ...n]);
}
let ht = e.createContext({
  styles: void 0,
  setReference: () => {},
  setFloating: () => {},
  getReferenceProps: () => ({}),
  getFloatingProps: () => ({}),
  slot: {},
});
ht.displayName = 'FloatingContext';
let bt = e.createContext(null);
function yt(t) {
  return e.useMemo(() => (t ? ('string' == typeof t ? { to: t } : t) : null), [t]);
}
function Et() {
  return e.useContext(ht).setReference;
}
function xt() {
  return e.useContext(ht).getReferenceProps;
}
function St() {
  let { getFloatingProps: t, slot: n } = e.useContext(ht);
  return e.useCallback((...e) => Object.assign({}, t(...e), { 'data-anchor': n.anchor }), [t, n]);
}
function wt(t = null) {
  !1 === t && (t = null), 'string' == typeof t && (t = { to: t });
  let n = e.useContext(bt),
    r = e.useMemo(
      () => t,
      [
        JSON.stringify(
          t,
          'undefined' != typeof HTMLElement
            ? (e, t) => (t instanceof HTMLElement ? t.outerHTML : t)
            : void 0,
        ),
      ],
    );
  S(() => {
    null == n || n(null != r ? r : null);
  }, [n, r]);
  let o = e.useContext(ht);
  return e.useMemo(() => [o.setFloating, t ? o.styles : {}], [o.setFloating, t, o.styles]);
}
bt.displayName = 'PlacementContext';
let Rt = 4;
function Pt({ children: t, enabled: n = !0 }) {
  let [f, p] = e.useState(null),
    [m, v] = e.useState(0),
    g = e.useRef(null),
    [h, b] = e.useState(null);
  !(function (e) {
    S(() => {
      if (!e) return;
      let t = new MutationObserver(() => {
        let t = window.getComputedStyle(e).maxHeight,
          n = parseFloat(t);
        if (isNaN(n)) return;
        let r = parseInt(t);
        isNaN(r) || (n !== r && (e.style.maxHeight = `${Math.ceil(n)}px`));
      });
      return (
        t.observe(e, { attributes: !0, attributeFilter: ['style'] }),
        () => {
          t.disconnect();
        }
      );
    }, [e]);
  })(h);
  let y = n && null !== f && null !== h,
    {
      to: E = 'bottom',
      gap: x = 0,
      offset: w = 0,
      padding: P = 0,
      inner: I,
    } = (function (e, t) {
      var n, r, o;
      let l = It(null != (n = null == e ? void 0 : e.gap) ? n : 'var(--anchor-gap, 0)', t),
        i = It(null != (r = null == e ? void 0 : e.offset) ? r : 'var(--anchor-offset, 0)', t),
        u = It(null != (o = null == e ? void 0 : e.padding) ? o : 'var(--anchor-padding, 0)', t);
      return { ...e, gap: l, offset: i, padding: u };
    })(f, h),
    [T, C = 'center'] = E.split(' ');
  S(() => {
    y && v(0);
  }, [y]);
  let {
      refs: O,
      floatingStyles: F,
      context: M,
    } = r({
      open: y,
      placement:
        'selection' === T
          ? 'center' === C
            ? 'bottom'
            : `bottom-${C}`
          : 'center' === C
            ? `${T}`
            : `${T}-${C}`,
      strategy: 'absolute',
      transform: !1,
      middleware: [
        o({ mainAxis: 'selection' === T ? 0 : x, crossAxis: w }),
        l({ padding: P }),
        'selection' !== T && i({ padding: P }),
        'selection' === T && I
          ? u({
              ...I,
              padding: P,
              overflowRef: g,
              offset: m,
              minItemsVisible: Rt,
              referenceOverflowThreshold: P,
              onFallbackChange(e) {
                var t, n;
                if (!e) return;
                let r = M.elements.floating;
                if (!r) return;
                let o = parseFloat(getComputedStyle(r).scrollPaddingBottom) || 0,
                  l = Math.min(Rt, r.childElementCount),
                  i = 0,
                  u = 0;
                for (let a of null !=
                (n = null == (t = M.elements.floating) ? void 0 : t.childNodes)
                  ? n
                  : [])
                  if (a instanceof HTMLElement) {
                    let e = a.offsetTop,
                      t = e + a.clientHeight + o,
                      n = r.scrollTop,
                      s = n + r.clientHeight;
                    if (!(e >= n && t <= s)) {
                      (u = Math.max(0, Math.min(t, s) - Math.max(e, n))), (i = a.clientHeight);
                      break;
                    }
                    l--;
                  }
                l >= 1 &&
                  v((e) => {
                    let t = i * l - u + o;
                    return e >= t ? e : t;
                  });
              },
            })
          : null,
        a({
          padding: P,
          apply({ availableWidth: e, availableHeight: t, elements: n }) {
            Object.assign(n.floating.style, {
              overflow: 'auto',
              maxWidth: `${e}px`,
              maxHeight: `min(var(--anchor-max-height, 100vh), ${t}px)`,
            });
          },
        }),
      ].filter(Boolean),
      whileElementsMounted: d,
    }),
    [L = T, D = C] = M.placement.split('-');
  'selection' === T && (L = 'selection');
  let k = e.useMemo(() => ({ anchor: [L, D].filter(Boolean).join(' ') }), [L, D]),
    A = s(M, { overflowRef: g, onChange: v }),
    { getReferenceProps: N, getFloatingProps: H } = c([A]),
    _ = R((e) => {
      b(e), O.setFloating(e);
    });
  return e.createElement(
    bt.Provider,
    { value: p },
    e.createElement(
      ht.Provider,
      {
        value: {
          setFloating: _,
          setReference: O.setReference,
          styles: F,
          getReferenceProps: N,
          getFloatingProps: H,
          slot: k,
        },
      },
      t,
    ),
  );
}
function It(t, n, r = void 0) {
  let o = x(),
    l = R((e, t) => {
      if (null == e) return [r, null];
      if ('number' == typeof e) return [e, null];
      if ('string' == typeof e) {
        if (!t) return [r, null];
        let n = Ct(e, t);
        return [
          n,
          (r) => {
            let l = Tt(e);
            {
              let i = l.map((e) => window.getComputedStyle(t).getPropertyValue(e));
              o.requestAnimationFrame(function u() {
                o.nextFrame(u);
                let a = !1;
                for (let [e, n] of l.entries()) {
                  let r = window.getComputedStyle(t).getPropertyValue(n);
                  if (i[e] !== r) {
                    (i[e] = r), (a = !0);
                    break;
                  }
                }
                if (!a) return;
                let s = Ct(e, t);
                n !== s && (r(s), (n = s));
              });
            }
            return o.dispose;
          },
        ];
      }
      return [r, null];
    }),
    i = e.useMemo(() => l(t, n)[0], [t, n]),
    [u = i, a] = e.useState();
  return (
    S(() => {
      let [e, r] = l(t, n);
      if ((a(e), r)) return r(a);
    }, [t, n]),
    u
  );
}
function Tt(e) {
  let t = /var\((.*)\)/.exec(e);
  if (t) {
    let e = t[1].indexOf(',');
    if (-1 === e) return [t[1]];
    let n = t[1].slice(0, e).trim(),
      r = t[1].slice(e + 1).trim();
    return r ? [n, ...Tt(r)] : [n];
  }
  return [];
}
function Ct(e, t) {
  let n = document.createElement('div');
  t.appendChild(n),
    n.style.setProperty('margin-top', '0px', 'important'),
    n.style.setProperty('margin-top', e, 'important');
  let r = parseFloat(window.getComputedStyle(n).marginTop) || 0;
  return t.removeChild(n), r;
}
let Ot = e.createContext(null);
Ot.displayName = 'OpenClosedContext';
var Ft = ((e) => (
  (e[(e.Open = 1)] = 'Open'),
  (e[(e.Closed = 2)] = 'Closed'),
  (e[(e.Closing = 4)] = 'Closing'),
  (e[(e.Opening = 8)] = 'Opening'),
  e
))(Ft || {});
function Mt() {
  return e.useContext(Ot);
}
function Lt({ value: e, children: n }) {
  return t.createElement(Ot.Provider, { value: e }, n);
}
function Dt({ children: e }) {
  return t.createElement(Ot.Provider, { value: null }, e);
}
let kt = [];
!(function (e) {
  function t() {
    'loading' !== document.readyState && (e(), document.removeEventListener('DOMContentLoaded', t));
  }
  'undefined' != typeof window &&
    'undefined' != typeof document &&
    (document.addEventListener('DOMContentLoaded', t), t());
})(() => {
  function e(e) {
    if (!(e.target instanceof HTMLElement) || e.target === document.body || kt[0] === e.target)
      return;
    let t = e.target;
    (t = t.closest(Le)),
      kt.unshift(null != t ? t : e.target),
      (kt = kt.filter((e) => null != e && e.isConnected)),
      kt.splice(10);
  }
  window.addEventListener('click', e, { capture: !0 }),
    window.addEventListener('mousedown', e, { capture: !0 }),
    window.addEventListener('focus', e, { capture: !0 }),
    document.body.addEventListener('click', e, { capture: !0 }),
    document.body.addEventListener('mousedown', e, { capture: !0 }),
    document.body.addEventListener('focus', e, { capture: !0 });
});
var At = ((e) => (
  (e[(e.First = 0)] = 'First'),
  (e[(e.Previous = 1)] = 'Previous'),
  (e[(e.Next = 2)] = 'Next'),
  (e[(e.Last = 3)] = 'Last'),
  (e[(e.Specific = 4)] = 'Specific'),
  (e[(e.Nothing = 5)] = 'Nothing'),
  e
))(At || {});
function Nt(e, t) {
  let n = t.resolveItems();
  if (n.length <= 0) return null;
  let r = t.resolveActiveIndex(),
    o = null != r ? r : -1;
  switch (e.focus) {
    case 0:
      for (let e = 0; e < n.length; ++e) if (!t.resolveDisabled(n[e], e, n)) return e;
      return r;
    case 1:
      -1 === o && (o = n.length);
      for (let e = o - 1; e >= 0; --e) if (!t.resolveDisabled(n[e], e, n)) return e;
      return r;
    case 2:
      for (let e = o + 1; e < n.length; ++e) if (!t.resolveDisabled(n[e], e, n)) return e;
      return r;
    case 3:
      for (let e = n.length - 1; e >= 0; --e) if (!t.resolveDisabled(n[e], e, n)) return e;
      return r;
    case 4:
      for (let r = 0; r < n.length; ++r) if (t.resolveId(n[r], r, n) === e.id) return r;
      return r;
    case 5:
      return null;
    default:
      !(function (e) {
        throw new Error('Unexpected object: ' + e);
      })(e);
  }
}
function Ht(t) {
  let n = R(t),
    r = e.useRef(!1);
  e.useEffect(
    () => (
      (r.current = !1),
      () => {
        (r.current = !0),
          y(() => {
            r.current && n();
          });
      }
    ),
    [n],
  );
}
function _t() {
  let t = (function () {
      let e = 'undefined' == typeof document;
      return (
        'useSyncExternalStore' in f &&
        f.useSyncExternalStore(
          () => () => {},
          () => !1,
          () => !e,
        )
      );
    })(),
    [n, r] = e.useState(h.isHandoffComplete);
  return (
    n && !1 === h.isHandoffComplete && r(!1),
    e.useEffect(() => {
      !0 !== n && r(!0);
    }, [n]),
    e.useEffect(() => h.handoff(), []),
    !t && n
  );
}
let jt = e.createContext(!1);
function $t(e) {
  return t.createElement(jt.Provider, { value: e.force }, e.children);
}
function Bt(t) {
  let n = e.useContext(jt),
    r = e.useContext(Kt),
    o = nt(t),
    [l, i] = e.useState(() => {
      var e;
      if (!n && null !== r) return null != (e = r.current) ? e : null;
      if (h.isServer) return null;
      let t = null == o ? void 0 : o.getElementById('headlessui-portal-root');
      if (t) return t;
      if (null === o) return null;
      let l = o.createElement('div');
      return l.setAttribute('id', 'headlessui-portal-root'), o.body.appendChild(l);
    });
  return (
    e.useEffect(() => {
      null !== l && ((null != o && o.body.contains(l)) || null == o || o.body.appendChild(l));
    }, [l, o]),
    e.useEffect(() => {
      n || (null !== r && i(r.current));
    }, [r, i, n]),
    l
  );
}
let Ut = e.Fragment,
  Vt = $(function (t, r) {
    let o = t,
      l = e.useRef(null),
      i = re(
        ne((e) => {
          l.current = e;
        }),
        r,
      ),
      u = nt(l),
      a = Bt(l),
      [s] = e.useState(() => {
        var e;
        return h.isServer
          ? null
          : null != (e = null == u ? void 0 : u.createElement('div'))
            ? e
            : null;
      }),
      c = e.useContext(Qt),
      d = _t();
    return (
      S(() => {
        !a ||
          !s ||
          a.contains(s) ||
          (s.setAttribute('data-headlessui-portal', ''), a.appendChild(s));
      }, [a, s]),
      S(() => {
        if (s && c) return c.register(s);
      }, [c, s]),
      Ht(() => {
        var e;
        !a ||
          !s ||
          (s instanceof Node && a.contains(s) && a.removeChild(s),
          a.childNodes.length <= 0 && (null == (e = a.parentElement) || e.removeChild(a)));
      }),
      d && a && s
        ? n.createPortal(
            k({ ourProps: { ref: i }, theirProps: o, slot: {}, defaultTag: Ut, name: 'Portal' }),
            s,
          )
        : null
    );
  });
let Wt = e.Fragment,
  Kt = e.createContext(null);
let Qt = e.createContext(null);
let qt = $(function (e, n) {
    let r = re(n),
      { enabled: o = !0, ...l } = e;
    return o
      ? t.createElement(Vt, { ...l, ref: r })
      : k({ ourProps: { ref: r }, theirProps: l, slot: {}, defaultTag: Ut, name: 'Portal' });
  }),
  Yt = $(function (e, n) {
    let { target: r, ...o } = e,
      l = { ref: re(n) };
    return t.createElement(
      Kt.Provider,
      { value: r },
      k({ ourProps: l, theirProps: o, defaultTag: Wt, name: 'Popover.Group' }),
    );
  }),
  Gt = Object.assign(qt, { Group: Yt });
let Xt = e.createContext(null);
function zt({ children: n, node: r }) {
  let [o, l] = e.useState(null),
    i = Jt(null != r ? r : o);
  return t.createElement(
    Xt.Provider,
    { value: i },
    n,
    null === i &&
      t.createElement(q, {
        features: Q.Hidden,
        ref: (e) => {
          var t, n;
          if (e)
            for (let r of null !=
            (n = null == (t = b(e)) ? void 0 : t.querySelectorAll('html > *, body > *'))
              ? n
              : [])
              if (
                r !== document.body &&
                r !== document.head &&
                r instanceof HTMLElement &&
                null != r &&
                r.contains(e)
              ) {
                l(r);
                break;
              }
        },
      }),
  );
}
function Jt(t = null) {
  var n;
  return null != (n = e.useContext(Xt)) ? n : t;
}
function Zt() {
  let t = e.useRef(!1);
  return (
    S(
      () => (
        (t.current = !0),
        () => {
          t.current = !1;
        }
      ),
      [],
    ),
    t
  );
}
var en = ((e) => ((e[(e.Forwards = 0)] = 'Forwards'), (e[(e.Backwards = 1)] = 'Backwards'), e))(
  en || {},
);
function tn(e) {
  if (!e) return new Set();
  if ('function' == typeof e) return new Set(e());
  let t = new Set();
  for (let n of e.current) n.current instanceof HTMLElement && t.add(n.current);
  return t;
}
var nn = ((e) => (
  (e[(e.None = 0)] = 'None'),
  (e[(e.InitialFocus = 1)] = 'InitialFocus'),
  (e[(e.TabLock = 2)] = 'TabLock'),
  (e[(e.FocusLock = 4)] = 'FocusLock'),
  (e[(e.RestoreFocus = 8)] = 'RestoreFocus'),
  (e[(e.AutoFocus = 16)] = 'AutoFocus'),
  e
))(nn || {});
let rn = $(function (n, r) {
    let o = e.useRef(null),
      l = re(o, r),
      { initialFocus: i, initialFocusFallback: u, containers: a, features: s = 15, ...c } = n;
    _t() || (s = 0);
    let d = nt(o);
    !(function (t, { ownerDocument: n }) {
      let r = !!(8 & t),
        o = (function (t = !0) {
          let n = e.useRef(kt.slice());
          return (
            gt(
              ([e], [t]) => {
                !0 === t &&
                  !1 === e &&
                  y(() => {
                    n.current.splice(0);
                  }),
                  !1 === t && !0 === e && (n.current = kt.slice());
              },
              [t, kt, n],
            ),
            R(() => {
              var e;
              return null != (e = n.current.find((e) => null != e && e.isConnected)) ? e : null;
            })
          );
        })(r);
      gt(() => {
        r || ((null == n ? void 0 : n.activeElement) === (null == n ? void 0 : n.body) && Ke(o()));
      }, [r]),
        Ht(() => {
          r && Ke(o());
        });
    })(s, { ownerDocument: d });
    let f = (function (
      t,
      { ownerDocument: n, container: r, initialFocus: o, initialFocusFallback: l },
    ) {
      let i = e.useRef(null),
        u = Pe(!!(1 & t), 'focus-trap#initial-focus'),
        a = Zt();
      return (
        gt(() => {
          if (0 === t) return;
          if (!u) return void (null != l && l.current && Ke(l.current));
          let e = r.current;
          e &&
            y(() => {
              if (!a.current) return;
              let r = null == n ? void 0 : n.activeElement;
              if (null != o && o.current) {
                if ((null == o ? void 0 : o.current) === r) return void (i.current = r);
              } else if (e.contains(r)) return void (i.current = r);
              if (null != o && o.current) Ke(o.current);
              else {
                if (16 & t) {
                  if (Ge(e, He.First | He.AutoFocus) !== _e.Error) return;
                } else if (Ge(e, He.First) !== _e.Error) return;
                if (
                  null != l &&
                  l.current &&
                  (Ke(l.current), (null == n ? void 0 : n.activeElement) === l.current)
                )
                  return;
                console.warn('There are no focusable elements inside the <FocusTrap />');
              }
              i.current = null == n ? void 0 : n.activeElement;
            });
        }, [l, u, t]),
        i
      );
    })(s, { ownerDocument: d, container: o, initialFocus: i, initialFocusFallback: u });
    !(function (e, { ownerDocument: t, container: n, containers: r, previousActiveElement: o }) {
      let l = Zt(),
        i = !!(4 & e);
      rt(
        null == t ? void 0 : t.defaultView,
        'focus',
        (e) => {
          if (!i || !l.current) return;
          let t = tn(r);
          n.current instanceof HTMLElement && t.add(n.current);
          let u = o.current;
          if (!u) return;
          let a = e.target;
          a && a instanceof HTMLElement
            ? ln(t, a)
              ? ((o.current = a), Ke(a))
              : (e.preventDefault(), e.stopPropagation(), Ke(u))
            : Ke(o.current);
        },
        !0,
      );
    })(s, { ownerDocument: d, container: o, containers: a, previousActiveElement: f });
    let p = (function () {
        let t = e.useRef(0);
        return (
          Ze(
            !0,
            'keydown',
            (e) => {
              'Tab' === e.key && (t.current = e.shiftKey ? 1 : 0);
            },
            !0,
          ),
          t
        );
      })(),
      m = R((e) => {
        let t = o.current;
        t &&
          O(p.current, {
            [en.Forwards]: () => {
              Ge(t, He.First, { skipElements: [e.relatedTarget, u] });
            },
            [en.Backwards]: () => {
              Ge(t, He.Last, { skipElements: [e.relatedTarget, u] });
            },
          });
      }),
      v = Pe(!!(2 & s), 'focus-trap#tab-lock'),
      g = x(),
      h = e.useRef(!1),
      b = {
        ref: l,
        onKeyDown(e) {
          'Tab' == e.key &&
            ((h.current = !0),
            g.requestAnimationFrame(() => {
              h.current = !1;
            }));
        },
        onBlur(e) {
          if (!(4 & s)) return;
          let t = tn(a);
          o.current instanceof HTMLElement && t.add(o.current);
          let n = e.relatedTarget;
          n instanceof HTMLElement &&
            'true' !== n.dataset.headlessuiFocusGuard &&
            (ln(t, n) ||
              (h.current
                ? Ge(
                    o.current,
                    O(p.current, {
                      [en.Forwards]: () => He.Next,
                      [en.Backwards]: () => He.Previous,
                    }) | He.WrapAround,
                    { relativeTo: e.target },
                  )
                : e.target instanceof HTMLElement && Ke(e.target)));
        },
      };
    return t.createElement(
      t.Fragment,
      null,
      v &&
        t.createElement(q, {
          as: 'button',
          type: 'button',
          'data-headlessui-focus-guard': !0,
          onFocus: m,
          features: Q.Focusable,
        }),
      k({ ourProps: b, theirProps: c, defaultTag: 'div', name: 'FocusTrap' }),
      v &&
        t.createElement(q, {
          as: 'button',
          type: 'button',
          'data-headlessui-focus-guard': !0,
          onFocus: m,
          features: Q.Focusable,
        }),
    );
  }),
  on = Object.assign(rn, { features: nn });
function ln(e, t) {
  for (let n of e) if (n.contains(t)) return !0;
  return !1;
}
function un(n) {
  var r;
  return (
    !!(n.enter || n.enterFrom || n.enterTo || n.leave || n.leaveFrom || n.leaveTo) ||
    (null != (r = n.as) ? r : pn) !== e.Fragment ||
    1 === t.Children.count(n.children)
  );
}
let an = e.createContext(null);
an.displayName = 'TransitionContext';
var sn = ((e) => ((e.Visible = 'visible'), (e.Hidden = 'hidden'), e))(sn || {});
let cn = e.createContext(null);
function dn(e) {
  return 'children' in e
    ? dn(e.children)
    : e.current.filter(({ el: e }) => null !== e.current).filter(({ state: e }) => 'visible' === e)
        .length > 0;
}
function fn(t, n) {
  let r = w(t),
    o = e.useRef([]),
    l = Zt(),
    i = x(),
    u = R((e, t = D.Hidden) => {
      let n = o.current.findIndex(({ el: t }) => t === e);
      -1 !== n &&
        (O(t, {
          [D.Unmount]() {
            o.current.splice(n, 1);
          },
          [D.Hidden]() {
            o.current[n].state = 'hidden';
          },
        }),
        i.microTask(() => {
          var e;
          !dn(o) && l.current && (null == (e = r.current) || e.call(r));
        }));
    }),
    a = R((e) => {
      let t = o.current.find(({ el: t }) => t === e);
      return (
        t
          ? 'visible' !== t.state && (t.state = 'visible')
          : o.current.push({ el: e, state: 'visible' }),
        () => u(e, D.Unmount)
      );
    }),
    s = e.useRef([]),
    c = e.useRef(Promise.resolve()),
    d = e.useRef({ enter: [], leave: [] }),
    f = R((e, t, r) => {
      s.current.splice(0),
        n && (n.chains.current[t] = n.chains.current[t].filter(([t]) => t !== e)),
        null == n ||
          n.chains.current[t].push([
            e,
            new Promise((e) => {
              s.current.push(e);
            }),
          ]),
        null == n ||
          n.chains.current[t].push([
            e,
            new Promise((e) => {
              Promise.all(d.current[t].map(([e, t]) => t)).then(() => e());
            }),
          ]),
        'enter' === t
          ? (c.current = c.current
              .then(() => (null == n ? void 0 : n.wait.current))
              .then(() => r(t)))
          : r(t);
    }),
    p = R((e, t, n) => {
      Promise.all(d.current[t].splice(0).map(([e, t]) => t))
        .then(() => {
          var e;
          null == (e = s.current.shift()) || e();
        })
        .then(() => n(t));
    });
  return e.useMemo(
    () => ({ children: o, register: a, unregister: u, onStart: f, onStop: p, wait: c, chains: d }),
    [a, u, o, f, p, d, c],
  );
}
cn.displayName = 'NestingContext';
let pn = e.Fragment,
  mn = L.RenderStrategy;
let vn = $(function (n, r) {
    let { show: o, appear: l = !1, unmount: i = !0, ...u } = n,
      a = e.useRef(null),
      s = re(...(un(n) ? [a, r] : null === r ? [] : [r]));
    _t();
    let c = Mt();
    if ((void 0 === o && null !== c && (o = (c & Ft.Open) === Ft.Open), void 0 === o))
      throw new Error('A <Transition /> is used but it is missing a `show={true | false}` prop.');
    let [d, f] = e.useState(o ? 'visible' : 'hidden'),
      p = fn(() => {
        o || f('hidden');
      }),
      [m, v] = e.useState(!0),
      g = e.useRef([o]);
    S(() => {
      !1 !== m && g.current[g.current.length - 1] !== o && (g.current.push(o), v(!1));
    }, [g, o]);
    let h = e.useMemo(() => ({ show: o, appear: l, initial: m }), [o, l, m]);
    Me(o, a, () => f('hidden')),
      S(() => {
        o ? f('visible') : !dn(p) && null !== a.current && f('hidden');
      }, [o, p]);
    let b = { unmount: i },
      y = R(() => {
        var e;
        m && v(!1), null == (e = n.beforeEnter) || e.call(n);
      }),
      E = R(() => {
        var e;
        m && v(!1), null == (e = n.beforeLeave) || e.call(n);
      });
    return t.createElement(
      cn.Provider,
      { value: p },
      t.createElement(
        an.Provider,
        { value: h },
        k({
          ourProps: {
            ...b,
            as: e.Fragment,
            children: t.createElement(gn, { ref: s, ...b, ...u, beforeEnter: y, beforeLeave: E }),
          },
          theirProps: {},
          defaultTag: e.Fragment,
          features: mn,
          visible: 'visible' === d,
          name: 'Transition',
        }),
      ),
    );
  }),
  gn = $(function (n, r) {
    var o, l;
    let {
        transition: i = !0,
        beforeEnter: u,
        afterEnter: a,
        beforeLeave: s,
        afterLeave: c,
        enter: d,
        enterFrom: f,
        enterTo: p,
        entered: m,
        leave: v,
        leaveFrom: g,
        leaveTo: h,
        ...b
      } = n,
      y = e.useRef(null),
      E = un(n),
      x = re(...(E ? [y, r] : null === r ? [] : [r])),
      w = null == (o = b.unmount) || o ? D.Unmount : D.Hidden,
      {
        show: P,
        appear: I,
        initial: T,
      } = (function () {
        let t = e.useContext(an);
        if (null === t)
          throw new Error(
            'A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.',
          );
        return t;
      })(),
      [F, M] = e.useState(P ? 'visible' : 'hidden'),
      L = (function () {
        let t = e.useContext(cn);
        if (null === t)
          throw new Error(
            'A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.',
          );
        return t;
      })(),
      { register: A, unregister: N } = L;
    S(() => A(y), [A, y]),
      S(() => {
        if (w === D.Hidden && y.current)
          return P && 'visible' !== F
            ? void M('visible')
            : O(F, { hidden: () => N(y), visible: () => A(y) });
      }, [F, y, A, N, P, w]);
    let H = _t();
    S(() => {
      if (E && H && 'visible' === F && null === y.current)
        throw new Error('Did you forget to passthrough the `ref` to the actual DOM node?');
    }, [y, F, H, E]);
    let _ = T && !I,
      j = I && P && T,
      $ = e.useRef(!1),
      U = fn(() => {
        $.current || (M('hidden'), N(y));
      }, L),
      V = R((e) => {
        $.current = !0;
        let t = e ? 'enter' : 'leave';
        U.onStart(y, t, (e) => {
          'enter' === e ? null == u || u() : 'leave' === e && (null == s || s());
        });
      }),
      W = R((e) => {
        let t = e ? 'enter' : 'leave';
        ($.current = !1),
          U.onStop(y, t, (e) => {
            'enter' === e ? null == a || a() : 'leave' === e && (null == c || c());
          }),
          'leave' === t && !dn(U) && (M('hidden'), N(y));
      });
    e.useEffect(() => {
      (E && i) || (V(P), W(P));
    }, [P, E, i]);
    let K = (() => !(!i || !E || !H || _))(),
      [, Q] = vt(K, y, P, { start: V, end: W }),
      q = B({
        ref: x,
        className:
          (null ==
          (l = C(
            b.className,
            j && d,
            j && f,
            Q.enter && d,
            Q.enter && Q.closed && f,
            Q.enter && !Q.closed && p,
            Q.leave && v,
            Q.leave && !Q.closed && g,
            Q.leave && Q.closed && h,
            !Q.transition && P && m,
          ))
            ? void 0
            : l.trim()) || void 0,
        ...mt(Q),
      }),
      Y = 0;
    return (
      'visible' === F && (Y |= Ft.Open),
      'hidden' === F && (Y |= Ft.Closed),
      Q.enter && (Y |= Ft.Opening),
      Q.leave && (Y |= Ft.Closing),
      t.createElement(
        cn.Provider,
        { value: U },
        t.createElement(
          Lt,
          { value: Y },
          k({
            ourProps: q,
            theirProps: b,
            defaultTag: pn,
            features: mn,
            visible: 'visible' === F,
            name: 'Transition.Child',
          }),
        ),
      )
    );
  }),
  hn = $(function (n, r) {
    let o = null !== e.useContext(an),
      l = null !== Mt();
    return t.createElement(
      t.Fragment,
      null,
      !o && l ? t.createElement(vn, { ref: r, ...n }) : t.createElement(gn, { ref: r, ...n }),
    );
  }),
  bn = Object.assign(vn, { Child: hn, Root: vn });
var yn = ((e) => ((e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e))(yn || {}),
  En = ((e) => ((e[(e.SetTitleId = 0)] = 'SetTitleId'), e))(En || {});
let xn = { 0: (e, t) => (e.titleId === t.id ? e : { ...e, titleId: t.id }) },
  Sn = e.createContext(null);
function wn(t) {
  let n = e.useContext(Sn);
  if (null === n) {
    let e = new Error(`<${t} /> is missing a parent <Dialog /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(e, wn), e);
  }
  return n;
}
function Rn(e, t) {
  return O(t.type, xn, e, t);
}
Sn.displayName = 'DialogContext';
let Pn = $(function (n, r) {
    let o = e.useId(),
      {
        id: l = `headlessui-dialog-${o}`,
        open: i,
        onClose: u,
        initialFocus: a,
        role: s = 'dialog',
        autoFocus: c = !0,
        __demoMode: d = !1,
        unmount: f = !1,
        ...p
      } = n,
      m = e.useRef(!1);
    s =
      'dialog' === s || 'alertdialog' === s
        ? s
        : (m.current ||
            ((m.current = !0),
            console.warn(
              `Invalid role [${s}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`,
            )),
          'dialog');
    let v = Mt();
    void 0 === i && null !== v && (i = (v & Ft.Open) === Ft.Open);
    let g = e.useRef(null),
      h = re(g, r),
      b = nt(g),
      y = i ? 0 : 1,
      [E, x] = e.useReducer(Rn, { titleId: null, descriptionId: null, panelRef: e.createRef() }),
      w = R(() => u(!1)),
      P = R((e) => x({ type: 0, id: e })),
      I = !!_t() && 0 === y,
      [T, C] = (function () {
        let n = e.useContext(Qt),
          r = e.useRef([]),
          o = R((e) => (r.current.push(e), n && n.register(e), () => l(e))),
          l = R((e) => {
            let t = r.current.indexOf(e);
            -1 !== t && r.current.splice(t, 1), n && n.unregister(e);
          }),
          i = e.useMemo(() => ({ register: o, unregister: l, portals: r }), [o, l, r]);
        return [
          r,
          e.useMemo(
            () =>
              function ({ children: e }) {
                return t.createElement(Qt.Provider, { value: i }, e);
              },
            [i],
          ),
        ];
      })(),
      O = {
        get current() {
          var e;
          return null != (e = E.panelRef.current) ? e : g.current;
        },
      },
      F = Jt(),
      { resolveContainers: M } = (function ({
        defaultContainers: e = [],
        portals: t,
        mainTreeNode: n,
      } = {}) {
        let r = nt(n),
          o = R(() => {
            var o, l;
            let i = [];
            for (let t of e)
              null !== t &&
                (t instanceof HTMLElement
                  ? i.push(t)
                  : 'current' in t && t.current instanceof HTMLElement && i.push(t.current));
            if (null != t && t.current) for (let e of t.current) i.push(e);
            for (let e of null !=
            (o = null == r ? void 0 : r.querySelectorAll('html > *, body > *'))
              ? o
              : [])
              e !== document.body &&
                e !== document.head &&
                e instanceof HTMLElement &&
                'headlessui-portal-root' !== e.id &&
                ((n &&
                  (e.contains(n) ||
                    e.contains(
                      null == (l = null == n ? void 0 : n.getRootNode()) ? void 0 : l.host,
                    ))) ||
                  i.some((t) => e.contains(t)) ||
                  i.push(e));
            return i;
          });
        return { resolveContainers: o, contains: R((e) => o().some((t) => t.contains(e))) };
      })({ mainTreeNode: F, portals: T, defaultContainers: [O] }),
      L = null !== v && (v & Ft.Closing) === Ft.Closing;
    Fe(!d && !L && I, {
      allowed: R(() => {
        var e, t;
        return [
          null != (t = null == (e = g.current) ? void 0 : e.closest('[data-headlessui-portal]'))
            ? t
            : null,
        ];
      }),
      disallowed: R(() => {
        var e;
        return [
          null != (e = null == F ? void 0 : F.closest('body > *:not(#headlessui-portal-root)'))
            ? e
            : null,
        ];
      }),
    }),
      tt(I, M, (e) => {
        e.preventDefault(), w();
      }),
      (function (e, t = 'undefined' != typeof document ? document.defaultView : null, n) {
        let r = Pe(e, 'escape');
        rt(t, 'keydown', (e) => {
          r && (e.defaultPrevented || (e.key === ce.Escape && n(e)));
        });
      })(I, null == b ? void 0 : b.defaultView, (e) => {
        e.preventDefault(),
          e.stopPropagation(),
          document.activeElement &&
            'blur' in document.activeElement &&
            'function' == typeof document.activeElement.blur &&
            document.activeElement.blur(),
          w();
      }),
      st(!d && !L && I, b, M),
      Me(I, g, w);
    let [D, A] = ie(),
      N = e.useMemo(
        () => [{ dialogState: y, close: w, setTitleId: P, unmount: f }, E],
        [y, E, w, P, f],
      ),
      H = e.useMemo(() => ({ open: 0 === y }), [y]),
      _ = {
        ref: h,
        id: l,
        role: s,
        tabIndex: -1,
        'aria-modal': d ? void 0 : 0 === y || void 0,
        'aria-labelledby': E.titleId,
        'aria-describedby': D,
        unmount: f,
      },
      j = !(function () {
        var t;
        let [n] = e.useState(() =>
            'undefined' != typeof window && 'function' == typeof window.matchMedia
              ? window.matchMedia('(pointer: coarse)')
              : null,
          ),
          [r, o] = e.useState(null != (t = null == n ? void 0 : n.matches) && t);
        return (
          S(() => {
            if (n) return n.addEventListener('change', e), () => n.removeEventListener('change', e);
            function e(e) {
              o(e.matches);
            }
          }, [n]),
          r
        );
      })(),
      $ = nn.None;
    return (
      I &&
        !d &&
        (($ |= nn.RestoreFocus),
        ($ |= nn.TabLock),
        c && ($ |= nn.AutoFocus),
        j && ($ |= nn.InitialFocus)),
      t.createElement(
        Dt,
        null,
        t.createElement(
          $t,
          { force: !0 },
          t.createElement(
            Gt,
            null,
            t.createElement(
              Sn.Provider,
              { value: N },
              t.createElement(
                Yt,
                { target: g },
                t.createElement(
                  $t,
                  { force: !1 },
                  t.createElement(
                    A,
                    { slot: H },
                    t.createElement(
                      C,
                      null,
                      t.createElement(
                        on,
                        { initialFocus: a, initialFocusFallback: g, containers: M, features: $ },
                        t.createElement(
                          be,
                          { value: w },
                          k({
                            ourProps: _,
                            theirProps: p,
                            slot: H,
                            defaultTag: In,
                            features: Tn,
                            visible: 0 === y,
                            name: 'Dialog',
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      )
    );
  }),
  In = 'div',
  Tn = L.RenderStrategy | L.Static;
let Cn = $(function (e, n) {
    let { transition: r = !1, open: o, ...l } = e,
      i = Mt(),
      u = e.hasOwnProperty('open') || null !== i,
      a = e.hasOwnProperty('onClose');
    if (!u && !a)
      throw new Error(
        'You have to provide an `open` and an `onClose` prop to the `Dialog` component.',
      );
    if (!u)
      throw new Error('You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.');
    if (!a)
      throw new Error('You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.');
    if (!i && 'boolean' != typeof e.open)
      throw new Error(
        `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${e.open}`,
      );
    if ('function' != typeof e.onClose)
      throw new Error(
        `You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${e.onClose}`,
      );
    return (void 0 === o && !r) || l.static
      ? t.createElement(zt, null, t.createElement(Pn, { ref: n, open: o, ...l }))
      : t.createElement(
          zt,
          null,
          t.createElement(
            bn,
            { show: o, transition: r, unmount: l.unmount },
            t.createElement(Pn, { ref: n, ...l }),
          ),
        );
  }),
  On = $(function (n, r) {
    let o = e.useId(),
      { id: l = `headlessui-dialog-panel-${o}`, transition: i = !1, ...u } = n,
      [{ dialogState: a, unmount: s }, c] = wn('Dialog.Panel'),
      d = re(r, c.panelRef),
      f = e.useMemo(() => ({ open: 0 === a }), [a]),
      p = {
        ref: d,
        id: l,
        onClick: R((e) => {
          e.stopPropagation();
        }),
      };
    return t.createElement(
      i ? hn : e.Fragment,
      { ...(i ? { unmount: s } : {}) },
      k({ ourProps: p, theirProps: u, slot: f, defaultTag: 'div', name: 'Dialog.Panel' }),
    );
  });
$(function (n, r) {
  let { transition: o = !1, ...l } = n,
    [{ dialogState: i, unmount: u }] = wn('Dialog.Backdrop'),
    a = e.useMemo(() => ({ open: 0 === i }), [i]),
    s = { ref: r, 'aria-hidden': !0 };
  return t.createElement(
    o ? hn : e.Fragment,
    { ...(o ? { unmount: u } : {}) },
    k({ ourProps: s, theirProps: l, slot: a, defaultTag: 'div', name: 'Dialog.Backdrop' }),
  );
});
let Fn = $(function (t, n) {
    let r = e.useId(),
      { id: o = `headlessui-dialog-title-${r}`, ...l } = t,
      [{ dialogState: i, setTitleId: u }] = wn('Dialog.Title'),
      a = re(n);
    e.useEffect(() => (u(o), () => u(null)), [o, u]);
    let s = e.useMemo(() => ({ open: 0 === i }), [i]);
    return k({
      ourProps: { ref: a, id: o },
      theirProps: l,
      slot: s,
      defaultTag: 'h2',
      name: 'Dialog.Title',
    });
  }),
  Mn = Object.assign(Cn, { Panel: On, Title: Fn, Description: ae });
var Ln;
let Dn =
  null != (Ln = t.startTransition)
    ? Ln
    : function (e) {
        e();
      };
var kn = ((e) => ((e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e))(kn || {}),
  An = ((e) => (
    (e[(e.ToggleDisclosure = 0)] = 'ToggleDisclosure'),
    (e[(e.CloseDisclosure = 1)] = 'CloseDisclosure'),
    (e[(e.SetButtonId = 2)] = 'SetButtonId'),
    (e[(e.SetPanelId = 3)] = 'SetPanelId'),
    (e[(e.LinkPanel = 4)] = 'LinkPanel'),
    (e[(e.UnlinkPanel = 5)] = 'UnlinkPanel'),
    e
  ))(An || {});
let Nn = {
    0: (e) => ({ ...e, disclosureState: O(e.disclosureState, { 0: 1, 1: 0 }) }),
    1: (e) => (1 === e.disclosureState ? e : { ...e, disclosureState: 1 }),
    4: (e) => (!0 === e.linkedPanel ? e : { ...e, linkedPanel: !0 }),
    5: (e) => (!1 === e.linkedPanel ? e : { ...e, linkedPanel: !1 }),
    2: (e, t) => (e.buttonId === t.buttonId ? e : { ...e, buttonId: t.buttonId }),
    3: (e, t) => (e.panelId === t.panelId ? e : { ...e, panelId: t.panelId }),
  },
  Hn = e.createContext(null);
function _n(t) {
  let n = e.useContext(Hn);
  if (null === n) {
    let e = new Error(`<${t} /> is missing a parent <Disclosure /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(e, _n), e);
  }
  return n;
}
Hn.displayName = 'DisclosureContext';
let jn = e.createContext(null);
function $n(t) {
  let n = e.useContext(jn);
  if (null === n) {
    let e = new Error(`<${t} /> is missing a parent <Disclosure /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(e, $n), e);
  }
  return n;
}
jn.displayName = 'DisclosureAPIContext';
let Bn = e.createContext(null);
function Un(e, t) {
  return O(t.type, Nn, e, t);
}
Bn.displayName = 'DisclosurePanelContext';
let Vn = e.Fragment;
let Wn = L.RenderStrategy | L.Static;
let Kn = $(function (n, r) {
    let { defaultOpen: o = !1, ...l } = n,
      i = e.useRef(null),
      u = re(
        r,
        ne(
          (e) => {
            i.current = e;
          },
          void 0 === n.as || n.as === e.Fragment,
        ),
      ),
      a = e.useRef(null),
      s = e.useRef(null),
      c = e.useReducer(Un, {
        disclosureState: o ? 0 : 1,
        linkedPanel: !1,
        buttonRef: s,
        panelRef: a,
        buttonId: null,
        panelId: null,
      }),
      [{ disclosureState: d, buttonId: f }, p] = c,
      m = R((e) => {
        p({ type: 1 });
        let t = b(i);
        if (!t || !f) return;
        let n = e
          ? e instanceof HTMLElement
            ? e
            : e.current instanceof HTMLElement
              ? e.current
              : t.getElementById(f)
          : t.getElementById(f);
        null == n || n.focus();
      }),
      v = e.useMemo(() => ({ close: m }), [m]),
      g = e.useMemo(() => ({ open: 0 === d, close: m }), [d, m]),
      h = { ref: u };
    return t.createElement(
      Hn.Provider,
      { value: c },
      t.createElement(
        jn.Provider,
        { value: v },
        t.createElement(
          be,
          { value: m },
          t.createElement(
            Lt,
            { value: O(d, { 0: Ft.Open, 1: Ft.Closed }) },
            k({ ourProps: h, theirProps: l, slot: g, defaultTag: Vn, name: 'Disclosure' }),
          ),
        ),
      ),
    );
  }),
  Qn = $(function (t, n) {
    let r = e.useId(),
      {
        id: o = `headlessui-disclosure-button-${r}`,
        disabled: l = !1,
        autoFocus: i = !1,
        ...u
      } = t,
      [a, s] = _n('Disclosure.Button'),
      c = e.useContext(Bn),
      d = null !== c && c === a.panelId,
      f = e.useRef(null),
      v = re(f, n, d ? null : a.buttonRef),
      g = N();
    e.useEffect(() => {
      if (!d)
        return (
          s({ type: 2, buttonId: o }),
          () => {
            s({ type: 2, buttonId: null });
          }
        );
    }, [o, s, d]);
    let h = R((e) => {
        var t;
        if (d) {
          if (1 === a.disclosureState) return;
          switch (e.key) {
            case ce.Space:
            case ce.Enter:
              e.preventDefault(),
                e.stopPropagation(),
                s({ type: 0 }),
                null == (t = a.buttonRef.current) || t.focus();
          }
        } else
          switch (e.key) {
            case ce.Space:
            case ce.Enter:
              e.preventDefault(), e.stopPropagation(), s({ type: 0 });
          }
      }),
      b = R((e) => {
        if (e.key === ce.Space) e.preventDefault();
      }),
      y = R((e) => {
        var t;
        ee(e.currentTarget) ||
          l ||
          (d ? (s({ type: 0 }), null == (t = a.buttonRef.current) || t.focus()) : s({ type: 0 }));
      }),
      { isFocusVisible: E, focusProps: x } = p({ autoFocus: i }),
      { isHovered: S, hoverProps: w } = m({ isDisabled: l }),
      { pressed: I, pressProps: T } = P({ disabled: l }),
      C = e.useMemo(
        () => ({
          open: 0 === a.disclosureState,
          hover: S,
          active: I,
          disabled: l,
          focus: E,
          autofocus: i,
        }),
        [a, S, I, E, l, i],
      ),
      O = lt(t, f);
    return k({
      mergeRefs: g,
      ourProps: j(
        d
          ? { ref: v, type: O, disabled: l || void 0, autoFocus: i, onKeyDown: h, onClick: y }
          : {
              ref: v,
              id: o,
              type: O,
              'aria-expanded': 0 === a.disclosureState,
              'aria-controls': a.linkedPanel ? a.panelId : void 0,
              disabled: l || void 0,
              autoFocus: i,
              onKeyDown: h,
              onKeyUp: b,
              onClick: y,
            },
        x,
        w,
        T,
      ),
      theirProps: u,
      slot: C,
      defaultTag: 'button',
      name: 'Disclosure.Button',
    });
  }),
  qn = $(function (n, r) {
    let o = e.useId(),
      { id: l = `headlessui-disclosure-panel-${o}`, transition: i = !1, ...u } = n,
      [a, s] = _n('Disclosure.Panel'),
      { close: c } = $n('Disclosure.Panel'),
      d = N(),
      f = re(r, a.panelRef, (e) => {
        Dn(() => s({ type: e ? 4 : 5 }));
      });
    e.useEffect(
      () => (
        s({ type: 3, panelId: l }),
        () => {
          s({ type: 3, panelId: null });
        }
      ),
      [l, s],
    );
    let p = Mt(),
      [m, v] = vt(i, a.panelRef, null !== p ? (p & Ft.Open) === Ft.Open : 0 === a.disclosureState),
      g = e.useMemo(() => ({ open: 0 === a.disclosureState, close: c }), [a.disclosureState, c]),
      h = { ref: f, id: l, ...mt(v) };
    return t.createElement(
      Dt,
      null,
      t.createElement(
        Bn.Provider,
        { value: a.panelId },
        k({
          mergeRefs: d,
          ourProps: h,
          theirProps: u,
          slot: g,
          defaultTag: 'div',
          features: Wn,
          visible: m,
          name: 'Disclosure.Panel',
        }),
      ),
    );
  }),
  Yn = Object.assign(Kn, { Button: Qn, Panel: qn });
function Gn(t, n) {
  let r = e.useRef({ left: 0, top: 0 });
  if (
    (S(() => {
      let e = n.current;
      if (!e) return;
      let t = e.getBoundingClientRect();
      t && (r.current = t);
    }, [t]),
    null == n.current || !t || n.current === document.activeElement)
  )
    return !1;
  let o = n.current.getBoundingClientRect();
  return o.top !== r.current.top || o.left !== r.current.left;
}
let Xn =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function zn(e) {
  var t, n;
  let r = null != (t = e.innerText) ? t : '',
    o = e.cloneNode(!0);
  if (!(o instanceof HTMLElement)) return r;
  let l = !1;
  for (let u of o.querySelectorAll('[hidden],[aria-hidden],[role="img"]')) u.remove(), (l = !0);
  let i = l ? (null != (n = o.innerText) ? n : '') : r;
  return Xn.test(i) && (i = i.replace(Xn, '')), i;
}
function Jn(t) {
  let n = e.useRef(''),
    r = e.useRef('');
  return R(() => {
    let e = t.current;
    if (!e) return '';
    let o = e.innerText;
    if (n.current === o) return r.current;
    let l = (function (e) {
      let t = e.getAttribute('aria-label');
      if ('string' == typeof t) return t.trim();
      let n = e.getAttribute('aria-labelledby');
      if (n) {
        let e = n
          .split(' ')
          .map((e) => {
            let t = document.getElementById(e);
            if (t) {
              let e = t.getAttribute('aria-label');
              return 'string' == typeof e ? e.trim() : zn(t).trim();
            }
            return null;
          })
          .filter(Boolean);
        if (e.length > 0) return e.join(', ');
      }
      return zn(e).trim();
    })(e)
      .trim()
      .toLowerCase();
    return (n.current = o), (r.current = l), l;
  });
}
var Zn = ((e) => ((e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e))(Zn || {}),
  er = ((e) => ((e[(e.Single = 0)] = 'Single'), (e[(e.Multi = 1)] = 'Multi'), e))(er || {}),
  tr = ((e) => ((e[(e.Pointer = 0)] = 'Pointer'), (e[(e.Other = 1)] = 'Other'), e))(tr || {}),
  nr = ((e) => (
    (e[(e.OpenListbox = 0)] = 'OpenListbox'),
    (e[(e.CloseListbox = 1)] = 'CloseListbox'),
    (e[(e.GoToOption = 2)] = 'GoToOption'),
    (e[(e.Search = 3)] = 'Search'),
    (e[(e.ClearSearch = 4)] = 'ClearSearch'),
    (e[(e.RegisterOption = 5)] = 'RegisterOption'),
    (e[(e.UnregisterOption = 6)] = 'UnregisterOption'),
    e
  ))(nr || {});
function rr(e, t = (e) => e) {
  let n = null !== e.activeOptionIndex ? e.options[e.activeOptionIndex] : null,
    r = qe(t(e.options.slice()), (e) => e.dataRef.current.domRef.current),
    o = n ? r.indexOf(n) : null;
  return -1 === o && (o = null), { options: r, activeOptionIndex: o };
}
let or = {
    1: (e) =>
      e.dataRef.current.disabled || 1 === e.listboxState
        ? e
        : { ...e, activeOptionIndex: null, listboxState: 1, __demoMode: !1 },
    0(e) {
      if (e.dataRef.current.disabled || 0 === e.listboxState) return e;
      let t = e.activeOptionIndex,
        { isSelected: n } = e.dataRef.current,
        r = e.options.findIndex((e) => n(e.dataRef.current.value));
      return -1 !== r && (t = r), { ...e, listboxState: 0, activeOptionIndex: t, __demoMode: !1 };
    },
    2(e, t) {
      var n, r, o, l, i;
      if (e.dataRef.current.disabled || 1 === e.listboxState) return e;
      let u = {
        ...e,
        searchQuery: '',
        activationTrigger: null != (n = t.trigger) ? n : 1,
        __demoMode: !1,
      };
      if (t.focus === At.Nothing) return { ...u, activeOptionIndex: null };
      if (t.focus === At.Specific)
        return { ...u, activeOptionIndex: e.options.findIndex((e) => e.id === t.id) };
      if (t.focus === At.Previous) {
        let n = e.activeOptionIndex;
        if (null !== n) {
          let l = e.options[n].dataRef.current.domRef,
            i = Nt(t, {
              resolveItems: () => e.options,
              resolveActiveIndex: () => e.activeOptionIndex,
              resolveId: (e) => e.id,
              resolveDisabled: (e) => e.dataRef.current.disabled,
            });
          if (null !== i) {
            let t = e.options[i].dataRef.current.domRef;
            if (
              (null == (r = l.current) ? void 0 : r.previousElementSibling) === t.current ||
              null === (null == (o = t.current) ? void 0 : o.previousElementSibling)
            )
              return { ...u, activeOptionIndex: i };
          }
        }
      } else if (t.focus === At.Next) {
        let n = e.activeOptionIndex;
        if (null !== n) {
          let r = e.options[n].dataRef.current.domRef,
            o = Nt(t, {
              resolveItems: () => e.options,
              resolveActiveIndex: () => e.activeOptionIndex,
              resolveId: (e) => e.id,
              resolveDisabled: (e) => e.dataRef.current.disabled,
            });
          if (null !== o) {
            let t = e.options[o].dataRef.current.domRef;
            if (
              (null == (l = r.current) ? void 0 : l.nextElementSibling) === t.current ||
              null === (null == (i = t.current) ? void 0 : i.nextElementSibling)
            )
              return { ...u, activeOptionIndex: o };
          }
        }
      }
      let a = rr(e),
        s = Nt(t, {
          resolveItems: () => a.options,
          resolveActiveIndex: () => a.activeOptionIndex,
          resolveId: (e) => e.id,
          resolveDisabled: (e) => e.dataRef.current.disabled,
        });
      return { ...u, ...a, activeOptionIndex: s };
    },
    3: (e, t) => {
      if (e.dataRef.current.disabled || 1 === e.listboxState) return e;
      let n = '' !== e.searchQuery ? 0 : 1,
        r = e.searchQuery + t.value.toLowerCase(),
        o = (
          null !== e.activeOptionIndex
            ? e.options
                .slice(e.activeOptionIndex + n)
                .concat(e.options.slice(0, e.activeOptionIndex + n))
            : e.options
        ).find((e) => {
          var t;
          return (
            !e.dataRef.current.disabled &&
            (null == (t = e.dataRef.current.textValue) ? void 0 : t.startsWith(r))
          );
        }),
        l = o ? e.options.indexOf(o) : -1;
      return -1 === l || l === e.activeOptionIndex
        ? { ...e, searchQuery: r }
        : { ...e, searchQuery: r, activeOptionIndex: l, activationTrigger: 1 };
    },
    4: (e) =>
      e.dataRef.current.disabled || 1 === e.listboxState || '' === e.searchQuery
        ? e
        : { ...e, searchQuery: '' },
    5: (e, t) => {
      let n = { id: t.id, dataRef: t.dataRef },
        r = rr(e, (e) => [...e, n]);
      return (
        null === e.activeOptionIndex &&
          e.dataRef.current.isSelected(t.dataRef.current.value) &&
          (r.activeOptionIndex = r.options.indexOf(n)),
        { ...e, ...r }
      );
    },
    6: (e, t) => {
      let n = rr(e, (e) => {
        let n = e.findIndex((e) => e.id === t.id);
        return -1 !== n && e.splice(n, 1), e;
      });
      return { ...e, ...n, activationTrigger: 1 };
    },
  },
  lr = e.createContext(null);
function ir(t) {
  let n = e.useContext(lr);
  if (null === n) {
    let e = new Error(`<${t} /> is missing a parent <Listbox /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(e, ir), e);
  }
  return n;
}
lr.displayName = 'ListboxActionsContext';
let ur = e.createContext(null);
function ar(t) {
  let n = e.useContext(ur);
  if (null === n) {
    let e = new Error(`<${t} /> is missing a parent <Listbox /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(e, ar), e);
  }
  return n;
}
function sr(e, t) {
  return O(t.type, or, e, t);
}
ur.displayName = 'ListboxDataContext';
let cr = e.Fragment;
let dr = e.createContext(!1),
  fr = L.RenderStrategy | L.Static;
let pr = e.Fragment;
let mr = $(function (n, r) {
    var o;
    let l = T(),
      {
        value: i,
        defaultValue: u,
        form: a,
        name: s,
        onChange: c,
        by: d,
        invalid: f = !1,
        disabled: p = l || !1,
        horizontal: m = !1,
        multiple: v = !1,
        __demoMode: g = !1,
        ...h
      } = n;
    const b = m ? 'horizontal' : 'vertical';
    let y = re(r),
      E = (function (t) {
        let [n] = e.useState(t);
        return n;
      })(u),
      [w = v ? [] : void 0, P] = (function (t, n, r) {
        let [o, l] = e.useState(r),
          i = void 0 !== t,
          u = e.useRef(i),
          a = e.useRef(!1),
          s = e.useRef(!1);
        return (
          !i || u.current || a.current
            ? !i &&
              u.current &&
              !s.current &&
              ((s.current = !0),
              (u.current = i),
              console.error(
                'A component is changing from controlled to uncontrolled. This may be caused by the value changing from a defined value to undefined, which should not happen.',
              ))
            : ((a.current = !0),
              (u.current = i),
              console.error(
                'A component is changing from uncontrolled to controlled. This may be caused by the value changing from undefined to a defined value, which should not happen.',
              )),
          [i ? t : o, R((e) => (i || l(e), null == n ? void 0 : n(e)))]
        );
      })(i, c, E),
      [I, C] = e.useReducer(sr, {
        dataRef: e.createRef(),
        listboxState: g ? 0 : 1,
        options: [],
        searchQuery: '',
        activeOptionIndex: null,
        activationTrigger: 1,
        optionsVisible: !1,
        __demoMode: g,
      }),
      F = e.useRef({ static: !1, hold: !1 }),
      M = e.useRef(null),
      L = e.useRef(null),
      D = e.useRef(new Map()),
      A = (function (t = ye) {
        return e.useCallback(
          (e, n) => {
            if ('string' == typeof t) {
              let r = t;
              return (null == e ? void 0 : e[r]) === (null == n ? void 0 : n[r]);
            }
            return t(e, n);
          },
          [t],
        );
      })(d),
      N = e.useCallback(
        (e) => O(H.mode, { 1: () => w.some((t) => A(t, e)), 0: () => A(w, e) }),
        [w],
      ),
      H = e.useMemo(
        () => ({
          ...I,
          value: w,
          disabled: p,
          invalid: f,
          mode: v ? 1 : 0,
          orientation: b,
          compare: A,
          isSelected: N,
          optionsPropsRef: F,
          buttonRef: M,
          optionsRef: L,
          listRef: D,
        }),
        [w, p, f, v, I, D],
      );
    S(() => {
      I.dataRef.current = H;
    }, [H]),
      tt(0 === H.listboxState, [H.buttonRef, H.optionsRef], (e, t) => {
        var n;
        C({ type: 1 }),
          Ue(t, Be.Loose) || (e.preventDefault(), null == (n = H.buttonRef.current) || n.focus());
      });
    let _ = e.useMemo(
        () => ({ open: 0 === H.listboxState, disabled: p, invalid: f, value: w }),
        [H, p, w, f],
      ),
      j = R((e) => {
        let t = H.options.find((t) => t.id === e);
        t && Q(t.dataRef.current.value);
      }),
      $ = R(() => {
        if (null !== H.activeOptionIndex) {
          let { dataRef: e, id: t } = H.options[H.activeOptionIndex];
          Q(e.current.value), C({ type: 2, focus: At.Specific, id: t });
        }
      }),
      B = R(() => C({ type: 0 })),
      U = R(() => C({ type: 1 })),
      V = x(),
      W = R((e, t, n) => {
        V.dispose(),
          V.microTask(() =>
            e === At.Specific
              ? C({ type: 2, focus: At.Specific, id: t, trigger: n })
              : C({ type: 2, focus: e, trigger: n }),
          );
      }),
      K = R((e, t) => (C({ type: 5, id: e, dataRef: t }), () => C({ type: 6, id: e }))),
      Q = R((e) =>
        O(H.mode, {
          0: () => (null == P ? void 0 : P(e)),
          1() {
            let t = H.value.slice(),
              n = t.findIndex((t) => A(t, e));
            return -1 === n ? t.push(e) : t.splice(n, 1), null == P ? void 0 : P(t);
          },
        }),
      ),
      q = R((e) => C({ type: 3, value: e })),
      Y = R(() => C({ type: 4 })),
      G = e.useMemo(
        () => ({
          onChange: Q,
          registerOption: K,
          goToOption: W,
          closeListbox: U,
          openListbox: B,
          selectActiveOption: $,
          selectOption: j,
          search: q,
          clearSearch: Y,
        }),
        [],
      ),
      [z, J] = me({ inherit: !0 }),
      Z = { ref: y },
      ee = e.useCallback(() => {
        if (void 0 !== E) return null == P ? void 0 : P(E);
      }, [P, E]);
    return t.createElement(
      J,
      {
        value: z,
        props: { htmlFor: null == (o = H.buttonRef.current) ? void 0 : o.id },
        slot: { open: 0 === H.listboxState, disabled: p },
      },
      t.createElement(
        Pt,
        null,
        t.createElement(
          lr.Provider,
          { value: G },
          t.createElement(
            ur.Provider,
            { value: H },
            t.createElement(
              Lt,
              { value: O(H.listboxState, { 0: Ft.Open, 1: Ft.Closed }) },
              null != s &&
                null != w &&
                t.createElement(X, { disabled: p, data: { [s]: w }, form: a, onReset: ee }),
              k({ ourProps: Z, theirProps: h, slot: _, defaultTag: cr, name: 'Listbox' }),
            ),
          ),
        ),
      ),
    );
  }),
  vr = $(function (t, r) {
    var o;
    let l = ar('Listbox.Button'),
      i = ir('Listbox.Button'),
      u = e.useId(),
      a = Z(),
      {
        id: s = a || `headlessui-listbox-button-${u}`,
        disabled: c = l.disabled || !1,
        autoFocus: d = !1,
        ...f
      } = t,
      v = re(l.buttonRef, r, Et()),
      g = xt(),
      h = R((e) => {
        switch (e.key) {
          case ce.Enter:
            !(function (e) {
              var t, n;
              let r = null != (t = null == e ? void 0 : e.form) ? t : e.closest('form');
              if (r) {
                for (let t of r.elements)
                  if (
                    t !== e &&
                    (('INPUT' === t.tagName && 'submit' === t.type) ||
                      ('BUTTON' === t.tagName && 'submit' === t.type) ||
                      ('INPUT' === t.nodeName && 'image' === t.type))
                  )
                    return void t.click();
                null == (n = r.requestSubmit) || n.call(r);
              }
            })(e.currentTarget);
            break;
          case ce.Space:
          case ce.ArrowDown:
            e.preventDefault(),
              n.flushSync(() => i.openListbox()),
              l.value || i.goToOption(At.First);
            break;
          case ce.ArrowUp:
            e.preventDefault(),
              n.flushSync(() => i.openListbox()),
              l.value || i.goToOption(At.Last);
        }
      }),
      b = R((e) => {
        if (e.key === ce.Space) e.preventDefault();
      }),
      y = R((e) => {
        var t;
        if (ee(e.currentTarget)) return e.preventDefault();
        0 === l.listboxState
          ? (n.flushSync(() => i.closeListbox()),
            null == (t = l.buttonRef.current) || t.focus({ preventScroll: !0 }))
          : (e.preventDefault(), i.openListbox());
      }),
      E = R((e) => e.preventDefault()),
      x = pe([s]),
      S = (function () {
        var t, n;
        return null != (n = null == (t = e.useContext(oe)) ? void 0 : t.value) ? n : void 0;
      })(),
      { isFocusVisible: w, focusProps: I } = p({ autoFocus: d }),
      { isHovered: T, hoverProps: C } = m({ isDisabled: c }),
      { pressed: O, pressProps: F } = P({ disabled: c }),
      M = e.useMemo(
        () => ({
          open: 0 === l.listboxState,
          active: O || 0 === l.listboxState,
          disabled: c,
          invalid: l.invalid,
          value: l.value,
          hover: T,
          focus: w,
          autofocus: d,
        }),
        [l.listboxState, l.value, c, T, w, O, l.invalid, d],
      );
    return k({
      ourProps: j(
        g(),
        {
          ref: v,
          id: s,
          type: lt(t, l.buttonRef),
          'aria-haspopup': 'listbox',
          'aria-controls': null == (o = l.optionsRef.current) ? void 0 : o.id,
          'aria-expanded': 0 === l.listboxState,
          'aria-labelledby': x,
          'aria-describedby': S,
          disabled: c || void 0,
          autoFocus: d,
          onKeyDown: h,
          onKeyUp: b,
          onKeyPress: E,
          onClick: y,
        },
        I,
        C,
        F,
      ),
      theirProps: f,
      slot: M,
      defaultTag: 'button',
      name: 'Listbox.Button',
    });
  }),
  gr = ge,
  hr = $(function (r, o) {
    var l;
    let i = e.useId(),
      {
        id: u = `headlessui-listbox-options-${i}`,
        anchor: a,
        portal: s = !1,
        modal: c = !0,
        transition: d = !1,
        ...f
      } = r,
      p = yt(a);
    p && (s = !0);
    let m = ar('Listbox.Options'),
      v = ir('Listbox.Options'),
      g = nt(m.optionsRef),
      h = Mt(),
      [y, E] = vt(d, m.optionsRef, null !== h ? (h & Ft.Open) === Ft.Open : 0 === m.listboxState);
    Me(y, m.buttonRef, v.closeListbox),
      st(!m.__demoMode && c && 0 === m.listboxState, g),
      Fe(!m.__demoMode && c && 0 === m.listboxState, {
        allowed: R(() => [m.buttonRef.current, m.optionsRef.current]),
      });
    let P = !Gn(0 !== m.listboxState, m.buttonRef) && y,
      I = (function (t, n) {
        let [r, o] = e.useState(n);
        return !t && r !== n && o(n), t ? r : n;
      })(y && 1 === m.listboxState, m.value),
      T = R((e) => m.compare(I, e)),
      C = e.useMemo(() => {
        var e;
        if (null == p || null == (e = null == p ? void 0 : p.to) || !e.includes('selection'))
          return null;
        let t = m.options.findIndex((e) => T(e.dataRef.current.value));
        return -1 === t && (t = 0), t;
      }, [p, m.options]),
      F = (() => {
        if (null == p) return;
        if (null === C) return { ...p, inner: void 0 };
        let e = Array.from(m.listRef.current.values());
        return { ...p, inner: { listRef: { current: e }, index: C } };
      })(),
      [M, L] = wt(F),
      D = St(),
      A = re(m.optionsRef, o, p ? M : null),
      N = x();
    e.useEffect(() => {
      var e;
      let t = m.optionsRef.current;
      t &&
        0 === m.listboxState &&
        t !== (null == (e = b(t)) ? void 0 : e.activeElement) &&
        (null == t || t.focus({ preventScroll: !0 }));
    }, [m.listboxState, m.optionsRef, m.optionsRef.current]);
    let H = R((e) => {
        var t, r;
        switch ((N.dispose(), e.key)) {
          case ce.Space:
            if ('' !== m.searchQuery)
              return e.preventDefault(), e.stopPropagation(), v.search(e.key);
          case ce.Enter:
            if ((e.preventDefault(), e.stopPropagation(), null !== m.activeOptionIndex)) {
              let { dataRef: e } = m.options[m.activeOptionIndex];
              v.onChange(e.current.value);
            }
            0 === m.mode &&
              (n.flushSync(() => v.closeListbox()),
              null == (t = m.buttonRef.current) || t.focus({ preventScroll: !0 }));
            break;
          case O(m.orientation, { vertical: ce.ArrowDown, horizontal: ce.ArrowRight }):
            return e.preventDefault(), e.stopPropagation(), v.goToOption(At.Next);
          case O(m.orientation, { vertical: ce.ArrowUp, horizontal: ce.ArrowLeft }):
            return e.preventDefault(), e.stopPropagation(), v.goToOption(At.Previous);
          case ce.Home:
          case ce.PageUp:
            return e.preventDefault(), e.stopPropagation(), v.goToOption(At.First);
          case ce.End:
          case ce.PageDown:
            return e.preventDefault(), e.stopPropagation(), v.goToOption(At.Last);
          case ce.Escape:
            return (
              e.preventDefault(),
              e.stopPropagation(),
              n.flushSync(() => v.closeListbox()),
              void (null == (r = m.buttonRef.current) || r.focus({ preventScroll: !0 }))
            );
          case ce.Tab:
            e.preventDefault(),
              e.stopPropagation(),
              n.flushSync(() => v.closeListbox()),
              Ye(m.buttonRef.current, e.shiftKey ? He.Previous : He.Next);
            break;
          default:
            1 === e.key.length && (v.search(e.key), N.setTimeout(() => v.clearSearch(), 350));
        }
      }),
      _ = (function (t, n) {
        let [r, o] = e.useState(t),
          l = w(t);
        return S(() => o(l.current), [l, o, ...n]), r;
      })(() => {
        var e;
        return null == (e = m.buttonRef.current) ? void 0 : e.id;
      }, [m.buttonRef.current]),
      $ = e.useMemo(() => ({ open: 0 === m.listboxState }), [m.listboxState]),
      B = j(p ? D() : {}, {
        id: u,
        ref: A,
        'aria-activedescendant':
          null === m.activeOptionIndex || null == (l = m.options[m.activeOptionIndex])
            ? void 0
            : l.id,
        'aria-multiselectable': 1 === m.mode || void 0,
        'aria-labelledby': _,
        'aria-orientation': m.orientation,
        onKeyDown: H,
        role: 'listbox',
        tabIndex: 0 === m.listboxState ? 0 : void 0,
        style: { ...f.style, ...L, '--button-width': Ee(m.buttonRef, !0).width },
        ...mt(E),
      });
    return t.createElement(
      Gt,
      { enabled: !!s && (r.static || y) },
      t.createElement(
        ur.Provider,
        { value: 1 === m.mode ? m : { ...m, isSelected: T } },
        k({
          ourProps: B,
          theirProps: f,
          slot: $,
          defaultTag: 'div',
          features: fr,
          visible: P,
          name: 'Listbox.Options',
        }),
      ),
    );
  }),
  br = $(function (t, r) {
    let o = e.useId(),
      { id: l = `headlessui-listbox-option-${o}`, disabled: i = !1, value: u, ...a } = t,
      s = !0 === e.useContext(dr),
      c = ar('Listbox.Option'),
      d = ir('Listbox.Option'),
      f = null !== c.activeOptionIndex && c.options[c.activeOptionIndex].id === l,
      p = c.isSelected(u),
      m = e.useRef(null),
      v = Jn(m),
      g = w({
        disabled: i,
        value: u,
        domRef: m,
        get textValue() {
          return v();
        },
      }),
      h = re(r, m, (e) => {
        e ? c.listRef.current.set(l, e) : c.listRef.current.delete(l);
      });
    S(() => {
      if (!c.__demoMode && 0 === c.listboxState && f && 0 !== c.activationTrigger)
        return E().requestAnimationFrame(() => {
          var e, t;
          null == (t = null == (e = m.current) ? void 0 : e.scrollIntoView) ||
            t.call(e, { block: 'nearest' });
        });
    }, [m, f, c.__demoMode, c.listboxState, c.activationTrigger, c.activeOptionIndex]),
      S(() => {
        if (!s) return d.registerOption(l, g);
      }, [g, l, s]);
    let b = R((e) => {
        var t;
        if (i) return e.preventDefault();
        d.onChange(u),
          0 === c.mode &&
            (n.flushSync(() => d.closeListbox()),
            null == (t = c.buttonRef.current) || t.focus({ preventScroll: !0 }));
      }),
      y = R(() => {
        if (i) return d.goToOption(At.Nothing);
        d.goToOption(At.Specific, l);
      }),
      x = dt(),
      P = R((e) => {
        x.update(e), !i && (f || d.goToOption(At.Specific, l, 0));
      }),
      I = R((e) => {
        x.wasMoved(e) && (i || f || d.goToOption(At.Specific, l, 0));
      }),
      T = R((e) => {
        x.wasMoved(e) && (i || (f && d.goToOption(At.Nothing)));
      }),
      C = e.useMemo(
        () => ({ active: f, focus: f, selected: p, disabled: i, selectedOption: p && s }),
        [f, p, i, s],
      );
    return !p && s
      ? null
      : k({
          ourProps: s
            ? {}
            : {
                id: l,
                ref: h,
                role: 'option',
                tabIndex: !0 === i ? void 0 : -1,
                'aria-disabled': !0 === i || void 0,
                'aria-selected': p,
                disabled: void 0,
                onClick: b,
                onFocus: y,
                onPointerEnter: P,
                onMouseEnter: P,
                onPointerMove: I,
                onMouseMove: I,
                onPointerLeave: T,
                onMouseLeave: T,
              },
          theirProps: a,
          slot: C,
          defaultTag: 'div',
          name: 'Listbox.Option',
        });
  }),
  yr = $(function (n, r) {
    let { options: o, placeholder: l, ...i } = n,
      u = { ref: re(r) },
      a = ar('ListboxSelectedOption'),
      s = e.useMemo(() => ({}), []),
      c =
        void 0 === a.value ||
        null === a.value ||
        (1 === a.mode && Array.isArray(a.value) && 0 === a.value.length);
    return t.createElement(
      dr.Provider,
      { value: !0 },
      k({
        ourProps: u,
        theirProps: { ...i, children: t.createElement(t.Fragment, null, l && c ? l : o) },
        slot: s,
        defaultTag: pr,
        name: 'ListboxSelectedOption',
      }),
    );
  }),
  Er = Object.assign(mr, { Button: vr, Label: gr, Options: hr, Option: br, SelectedOption: yr });
var xr = ((e) => ((e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e))(xr || {}),
  Sr = ((e) => ((e[(e.Pointer = 0)] = 'Pointer'), (e[(e.Other = 1)] = 'Other'), e))(Sr || {}),
  wr = ((e) => (
    (e[(e.OpenMenu = 0)] = 'OpenMenu'),
    (e[(e.CloseMenu = 1)] = 'CloseMenu'),
    (e[(e.GoToItem = 2)] = 'GoToItem'),
    (e[(e.Search = 3)] = 'Search'),
    (e[(e.ClearSearch = 4)] = 'ClearSearch'),
    (e[(e.RegisterItem = 5)] = 'RegisterItem'),
    (e[(e.UnregisterItem = 6)] = 'UnregisterItem'),
    e
  ))(wr || {});
function Rr(e, t = (e) => e) {
  let n = null !== e.activeItemIndex ? e.items[e.activeItemIndex] : null,
    r = qe(t(e.items.slice()), (e) => e.dataRef.current.domRef.current),
    o = n ? r.indexOf(n) : null;
  return -1 === o && (o = null), { items: r, activeItemIndex: o };
}
let Pr = {
    1: (e) => (1 === e.menuState ? e : { ...e, activeItemIndex: null, menuState: 1 }),
    0: (e) => (0 === e.menuState ? e : { ...e, __demoMode: !1, menuState: 0 }),
    2: (e, t) => {
      var n, r, o, l, i;
      if (1 === e.menuState) return e;
      let u = {
        ...e,
        searchQuery: '',
        activationTrigger: null != (n = t.trigger) ? n : 1,
        __demoMode: !1,
      };
      if (t.focus === At.Nothing) return { ...u, activeItemIndex: null };
      if (t.focus === At.Specific)
        return { ...u, activeItemIndex: e.items.findIndex((e) => e.id === t.id) };
      if (t.focus === At.Previous) {
        let n = e.activeItemIndex;
        if (null !== n) {
          let l = e.items[n].dataRef.current.domRef,
            i = Nt(t, {
              resolveItems: () => e.items,
              resolveActiveIndex: () => e.activeItemIndex,
              resolveId: (e) => e.id,
              resolveDisabled: (e) => e.dataRef.current.disabled,
            });
          if (null !== i) {
            let t = e.items[i].dataRef.current.domRef;
            if (
              (null == (r = l.current) ? void 0 : r.previousElementSibling) === t.current ||
              null === (null == (o = t.current) ? void 0 : o.previousElementSibling)
            )
              return { ...u, activeItemIndex: i };
          }
        }
      } else if (t.focus === At.Next) {
        let n = e.activeItemIndex;
        if (null !== n) {
          let r = e.items[n].dataRef.current.domRef,
            o = Nt(t, {
              resolveItems: () => e.items,
              resolveActiveIndex: () => e.activeItemIndex,
              resolveId: (e) => e.id,
              resolveDisabled: (e) => e.dataRef.current.disabled,
            });
          if (null !== o) {
            let t = e.items[o].dataRef.current.domRef;
            if (
              (null == (l = r.current) ? void 0 : l.nextElementSibling) === t.current ||
              null === (null == (i = t.current) ? void 0 : i.nextElementSibling)
            )
              return { ...u, activeItemIndex: o };
          }
        }
      }
      let a = Rr(e),
        s = Nt(t, {
          resolveItems: () => a.items,
          resolveActiveIndex: () => a.activeItemIndex,
          resolveId: (e) => e.id,
          resolveDisabled: (e) => e.dataRef.current.disabled,
        });
      return { ...u, ...a, activeItemIndex: s };
    },
    3: (e, t) => {
      let n = '' !== e.searchQuery ? 0 : 1,
        r = e.searchQuery + t.value.toLowerCase(),
        o = (
          null !== e.activeItemIndex
            ? e.items.slice(e.activeItemIndex + n).concat(e.items.slice(0, e.activeItemIndex + n))
            : e.items
        ).find((e) => {
          var t;
          return (
            (null == (t = e.dataRef.current.textValue) ? void 0 : t.startsWith(r)) &&
            !e.dataRef.current.disabled
          );
        }),
        l = o ? e.items.indexOf(o) : -1;
      return -1 === l || l === e.activeItemIndex
        ? { ...e, searchQuery: r }
        : { ...e, searchQuery: r, activeItemIndex: l, activationTrigger: 1 };
    },
    4: (e) => ('' === e.searchQuery ? e : { ...e, searchQuery: '', searchActiveItemIndex: null }),
    5: (e, t) => {
      let n = Rr(e, (e) => [...e, { id: t.id, dataRef: t.dataRef }]);
      return { ...e, ...n };
    },
    6: (e, t) => {
      let n = Rr(e, (e) => {
        let n = e.findIndex((e) => e.id === t.id);
        return -1 !== n && e.splice(n, 1), e;
      });
      return { ...e, ...n, activationTrigger: 1 };
    },
  },
  Ir = e.createContext(null);
function Tr(t) {
  let n = e.useContext(Ir);
  if (null === n) {
    let e = new Error(`<${t} /> is missing a parent <Menu /> component.`);
    throw (Error.captureStackTrace && Error.captureStackTrace(e, Tr), e);
  }
  return n;
}
function Cr(e, t) {
  return O(t.type, Pr, e, t);
}
Ir.displayName = 'MenuContext';
let Or = e.Fragment;
let Fr = L.RenderStrategy | L.Static;
let Mr = e.Fragment;
let Lr = $(function (n, r) {
    let { __demoMode: o = !1, ...l } = n,
      i = e.useReducer(Cr, {
        __demoMode: o,
        menuState: o ? 0 : 1,
        buttonRef: e.createRef(),
        itemsRef: e.createRef(),
        items: [],
        searchQuery: '',
        activeItemIndex: null,
        activationTrigger: 1,
      }),
      [{ menuState: u, itemsRef: a, buttonRef: s }, c] = i,
      d = re(r);
    tt(0 === u, [s, a], (e, t) => {
      var n;
      c({ type: 1 }), Ue(t, Be.Loose) || (e.preventDefault(), null == (n = s.current) || n.focus());
    });
    let f = R(() => {
        c({ type: 1 });
      }),
      p = e.useMemo(() => ({ open: 0 === u, close: f }), [u, f]),
      m = { ref: d };
    return t.createElement(
      Pt,
      null,
      t.createElement(
        Ir.Provider,
        { value: i },
        t.createElement(
          Lt,
          { value: O(u, { 0: Ft.Open, 1: Ft.Closed }) },
          k({ ourProps: m, theirProps: l, slot: p, defaultTag: Or, name: 'Menu' }),
        ),
      ),
    );
  }),
  Dr = $(function (t, r) {
    var o;
    let l = e.useId(),
      { id: i = `headlessui-menu-button-${l}`, disabled: u = !1, autoFocus: a = !1, ...s } = t,
      [c, d] = Tr('Menu.Button'),
      f = xt(),
      v = re(c.buttonRef, r, Et()),
      g = R((e) => {
        switch (e.key) {
          case ce.Space:
          case ce.Enter:
          case ce.ArrowDown:
            e.preventDefault(),
              e.stopPropagation(),
              n.flushSync(() => d({ type: 0 })),
              d({ type: 2, focus: At.First });
            break;
          case ce.ArrowUp:
            e.preventDefault(),
              e.stopPropagation(),
              n.flushSync(() => d({ type: 0 })),
              d({ type: 2, focus: At.Last });
        }
      }),
      h = R((e) => {
        if (e.key === ce.Space) e.preventDefault();
      }),
      b = R((e) => {
        var t;
        if (ee(e.currentTarget)) return e.preventDefault();
        u ||
          (0 === c.menuState
            ? (n.flushSync(() => d({ type: 1 })),
              null == (t = c.buttonRef.current) || t.focus({ preventScroll: !0 }))
            : (e.preventDefault(), d({ type: 0 })));
      }),
      { isFocusVisible: y, focusProps: E } = p({ autoFocus: a }),
      { isHovered: x, hoverProps: S } = m({ isDisabled: u }),
      { pressed: w, pressProps: I } = P({ disabled: u }),
      T = e.useMemo(
        () => ({
          open: 0 === c.menuState,
          active: w || 0 === c.menuState,
          disabled: u,
          hover: x,
          focus: y,
          autofocus: a,
        }),
        [c, x, y, w, u, a],
      );
    return k({
      ourProps: j(
        f(),
        {
          ref: v,
          id: i,
          type: lt(t, c.buttonRef),
          'aria-haspopup': 'menu',
          'aria-controls': null == (o = c.itemsRef.current) ? void 0 : o.id,
          'aria-expanded': 0 === c.menuState,
          disabled: u || void 0,
          autoFocus: a,
          onKeyDown: g,
          onKeyUp: h,
          onClick: b,
        },
        E,
        S,
        I,
      ),
      theirProps: s,
      slot: T,
      defaultTag: 'button',
      name: 'Menu.Button',
    });
  }),
  kr = $(function (r, o) {
    var l, i;
    let u = e.useId(),
      {
        id: a = `headlessui-menu-items-${u}`,
        anchor: s,
        portal: c = !1,
        modal: d = !0,
        transition: f = !1,
        ...p
      } = r,
      m = yt(s),
      [v, g] = Tr('Menu.Items'),
      [h, y] = wt(m),
      E = St(),
      w = re(v.itemsRef, o, m ? h : null),
      P = nt(v.itemsRef);
    m && (c = !0);
    let I = Mt(),
      [T, C] = vt(f, v.itemsRef, null !== I ? (I & Ft.Open) === Ft.Open : 0 === v.menuState);
    Me(T, v.buttonRef, () => {
      g({ type: 1 });
    }),
      st(!v.__demoMode && d && 0 === v.menuState, P),
      Fe(!v.__demoMode && d && 0 === v.menuState, {
        allowed: R(() => [v.buttonRef.current, v.itemsRef.current]),
      });
    let O = !Gn(0 !== v.menuState, v.buttonRef) && T;
    e.useEffect(() => {
      let e = v.itemsRef.current;
      e &&
        0 === v.menuState &&
        e !== (null == P ? void 0 : P.activeElement) &&
        e.focus({ preventScroll: !0 });
    }, [v.menuState, v.itemsRef, P, v.itemsRef.current]),
      (function (t, { container: n, accept: r, walk: o }) {
        let l = e.useRef(r),
          i = e.useRef(o);
        e.useEffect(() => {
          (l.current = r), (i.current = o);
        }, [r, o]),
          S(() => {
            if (!n || !t) return;
            let e = b(n);
            if (!e) return;
            let r = l.current,
              o = i.current,
              u = Object.assign((e) => r(e), { acceptNode: r }),
              a = e.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, u, !1);
            for (; a.nextNode(); ) o(a.currentNode);
          }, [n, t, l, i]);
      })(0 === v.menuState, {
        container: v.itemsRef.current,
        accept: (e) =>
          'menuitem' === e.getAttribute('role')
            ? NodeFilter.FILTER_REJECT
            : e.hasAttribute('role')
              ? NodeFilter.FILTER_SKIP
              : NodeFilter.FILTER_ACCEPT,
        walk(e) {
          e.setAttribute('role', 'none');
        },
      });
    let F = x(),
      M = R((e) => {
        var t, r, o;
        switch ((F.dispose(), e.key)) {
          case ce.Space:
            if ('' !== v.searchQuery)
              return e.preventDefault(), e.stopPropagation(), g({ type: 3, value: e.key });
          case ce.Enter:
            if (
              (e.preventDefault(), e.stopPropagation(), g({ type: 1 }), null !== v.activeItemIndex)
            ) {
              let { dataRef: e } = v.items[v.activeItemIndex];
              null == (r = null == (t = e.current) ? void 0 : t.domRef.current) || r.click();
            }
            Ve(v.buttonRef.current);
            break;
          case ce.ArrowDown:
            return e.preventDefault(), e.stopPropagation(), g({ type: 2, focus: At.Next });
          case ce.ArrowUp:
            return e.preventDefault(), e.stopPropagation(), g({ type: 2, focus: At.Previous });
          case ce.Home:
          case ce.PageUp:
            return e.preventDefault(), e.stopPropagation(), g({ type: 2, focus: At.First });
          case ce.End:
          case ce.PageDown:
            return e.preventDefault(), e.stopPropagation(), g({ type: 2, focus: At.Last });
          case ce.Escape:
            e.preventDefault(),
              e.stopPropagation(),
              n.flushSync(() => g({ type: 1 })),
              null == (o = v.buttonRef.current) || o.focus({ preventScroll: !0 });
            break;
          case ce.Tab:
            e.preventDefault(),
              e.stopPropagation(),
              n.flushSync(() => g({ type: 1 })),
              Ye(v.buttonRef.current, e.shiftKey ? He.Previous : He.Next);
            break;
          default:
            1 === e.key.length &&
              (g({ type: 3, value: e.key }), F.setTimeout(() => g({ type: 4 }), 350));
        }
      }),
      L = R((e) => {
        if (e.key === ce.Space) e.preventDefault();
      }),
      D = e.useMemo(() => ({ open: 0 === v.menuState }), [v.menuState]),
      A = j(m ? E() : {}, {
        'aria-activedescendant':
          null === v.activeItemIndex || null == (l = v.items[v.activeItemIndex]) ? void 0 : l.id,
        'aria-labelledby': null == (i = v.buttonRef.current) ? void 0 : i.id,
        id: a,
        onKeyDown: M,
        onKeyUp: L,
        role: 'menu',
        tabIndex: 0 === v.menuState ? 0 : void 0,
        ref: w,
        style: { ...p.style, ...y, '--button-width': Ee(v.buttonRef, !0).width },
        ...mt(C),
      });
    return t.createElement(
      Gt,
      { enabled: !!c && (r.static || T) },
      k({
        ourProps: A,
        theirProps: p,
        slot: D,
        defaultTag: 'div',
        features: Fr,
        visible: O,
        name: 'Menu.Items',
      }),
    );
  }),
  Ar = $(function (n, r) {
    let o = e.useId(),
      { id: l = `headlessui-menu-item-${o}`, disabled: i = !1, ...u } = n,
      [a, s] = Tr('Menu.Item'),
      c = null !== a.activeItemIndex && a.items[a.activeItemIndex].id === l,
      d = e.useRef(null),
      f = re(r, d);
    S(() => {
      if (!a.__demoMode && 0 === a.menuState && c && 0 !== a.activationTrigger)
        return E().requestAnimationFrame(() => {
          var e, t;
          null == (t = null == (e = d.current) ? void 0 : e.scrollIntoView) ||
            t.call(e, { block: 'nearest' });
        });
    }, [a.__demoMode, d, c, a.menuState, a.activationTrigger, a.activeItemIndex]);
    let p = Jn(d),
      m = e.useRef({
        disabled: i,
        domRef: d,
        get textValue() {
          return p();
        },
      });
    S(() => {
      m.current.disabled = i;
    }, [m, i]),
      S(() => (s({ type: 5, id: l, dataRef: m }), () => s({ type: 6, id: l })), [m, l]);
    let v = R(() => {
        s({ type: 1 });
      }),
      g = R((e) => {
        if (i) return e.preventDefault();
        s({ type: 1 }), Ve(a.buttonRef.current);
      }),
      h = R(() => {
        if (i) return s({ type: 2, focus: At.Nothing });
        s({ type: 2, focus: At.Specific, id: l });
      }),
      b = dt(),
      y = R((e) => {
        b.update(e), !i && (c || s({ type: 2, focus: At.Specific, id: l, trigger: 0 }));
      }),
      x = R((e) => {
        b.wasMoved(e) && (i || c || s({ type: 2, focus: At.Specific, id: l, trigger: 0 }));
      }),
      w = R((e) => {
        b.wasMoved(e) && (i || (c && s({ type: 2, focus: At.Nothing })));
      }),
      [P, I] = me(),
      [T, C] = ie(),
      O = e.useMemo(() => ({ active: c, focus: c, disabled: i, close: v }), [c, i, v]);
    return t.createElement(
      I,
      null,
      t.createElement(
        C,
        null,
        k({
          ourProps: {
            id: l,
            ref: f,
            role: 'menuitem',
            tabIndex: !0 === i ? void 0 : -1,
            'aria-disabled': !0 === i || void 0,
            'aria-labelledby': P,
            'aria-describedby': T,
            disabled: void 0,
            onClick: g,
            onFocus: h,
            onPointerEnter: y,
            onMouseEnter: y,
            onPointerMove: x,
            onMouseMove: x,
            onPointerLeave: w,
            onMouseLeave: w,
          },
          theirProps: u,
          slot: O,
          defaultTag: Mr,
          name: 'Menu.Item',
        }),
      ),
    );
  }),
  Nr = $(function (e, n) {
    let [r, o] = me();
    return t.createElement(
      o,
      null,
      k({
        ourProps: { ref: n, 'aria-labelledby': r, role: 'group' },
        theirProps: e,
        slot: {},
        defaultTag: 'div',
        name: 'Menu.Section',
      }),
    );
  }),
  Hr = $(function (t, n) {
    let r = e.useId(),
      { id: o = `headlessui-menu-heading-${r}`, ...l } = t,
      i = fe();
    return (
      S(() => i.register(o), [o, i.register]),
      k({
        ourProps: { id: o, ref: n, role: 'presentation', ...i.props },
        theirProps: l,
        slot: {},
        defaultTag: 'header',
        name: 'Menu.Heading',
      })
    );
  }),
  _r = $(function (e, t) {
    return k({
      ourProps: { ref: t, role: 'separator' },
      theirProps: e,
      slot: {},
      defaultTag: 'div',
      name: 'Menu.Separator',
    });
  }),
  jr = Object.assign(Lr, {
    Button: Dr,
    Items: kr,
    Item: Ar,
    Section: Nr,
    Heading: Hr,
    Separator: _r,
  });
export {
  On as $,
  Qn as C,
  hr as G,
  qn as I,
  ge as K,
  Er as M,
  Mn as P,
  Ar as T,
  vr as U,
  br as V,
  Yn as W,
  bn as X,
  jr as Z,
  hn as a,
  Dr as c,
  kr as f,
  Fn as j,
  ae as w,
};
