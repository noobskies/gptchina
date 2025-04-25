import {
  r as e,
  _ as t,
  R as n,
  a as r,
  m as o,
  g as a,
  n as i,
  p as s,
  j as l,
  q as c,
  o as u,
  s as d,
  f,
  b as p,
  t as v,
  v as m,
  w as h,
  e as w,
} from './vendor.BwD-2nqP.js';
function g(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (r) {
    if ((null == e || e(r), !1 === n || !r.defaultPrevented)) return null == t ? void 0 : t(r);
  };
}
function E(...e) {
  return (t) =>
    e.forEach((e) =>
      (function (e, t) {
        'function' == typeof e ? e(t) : null != e && (e.current = t);
      })(e, t),
    );
}
function b(...t) {
  return e.useCallback(E(...t), t);
}
function y(t, n = []) {
  let r = [];
  const o = () => {
    const n = r.map((t) => e.createContext(t));
    return function (r) {
      const o = (null == r ? void 0 : r[t]) || n;
      return e.useMemo(() => ({ [`__scope${t}`]: { ...r, [t]: o } }), [r, o]);
    };
  };
  return (
    (o.scopeName = t),
    [
      function (n, o) {
        const a = e.createContext(o),
          i = r.length;
        function s(n) {
          const { scope: r, children: o, ...s } = n,
            l = (null == r ? void 0 : r[t][i]) || a,
            c = e.useMemo(() => s, Object.values(s));
          return e.createElement(l.Provider, { value: c }, o);
        }
        return (
          (r = [...r, o]),
          (s.displayName = n + 'Provider'),
          [
            s,
            function (r, s) {
              const l = (null == s ? void 0 : s[t][i]) || a,
                c = e.useContext(l);
              if (c) return c;
              if (void 0 !== o) return o;
              throw new Error(`\`${r}\` must be used within \`${n}\``);
            },
          ]
        );
      },
      C(o, ...n),
    ]
  );
}
function C(...t) {
  const n = t[0];
  if (1 === t.length) return n;
  const r = () => {
    const r = t.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
    return function (t) {
      const o = r.reduce(
        (e, { useScope: n, scopeName: r }) => ({ ...e, ...n(t)[`__scope${r}`] }),
        {},
      );
      return e.useMemo(() => ({ [`__scope${n.scopeName}`]: o }), [o]);
    };
  };
  return (r.scopeName = n.scopeName), r;
}
const x = e.forwardRef((n, r) => {
  const { children: o, ...a } = n,
    i = e.Children.toArray(o),
    s = i.find(S);
  if (s) {
    const n = s.props.children,
      o = i.map((t) =>
        t === s
          ? e.Children.count(n) > 1
            ? e.Children.only(null)
            : e.isValidElement(n)
              ? n.props.children
              : null
          : t,
      );
    return e.createElement(
      R,
      t({}, a, { ref: r }),
      e.isValidElement(n) ? e.cloneElement(n, void 0, o) : null,
    );
  }
  return e.createElement(R, t({}, a, { ref: r }), o);
});
x.displayName = 'Slot';
const R = e.forwardRef((t, n) => {
  const { children: r, ...o } = t;
  return e.isValidElement(r)
    ? e.cloneElement(r, { ...D(o, r.props), ref: n ? E(n, r.ref) : r.ref })
    : e.Children.count(r) > 1
      ? e.Children.only(null)
      : null;
});
R.displayName = 'SlotClone';
const _ = ({ children: t }) => e.createElement(e.Fragment, null, t);
function S(t) {
  return e.isValidElement(t) && t.type === _;
}
function D(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? o && a
        ? (n[r] = (...e) => {
            a(...e), o(...e);
          })
        : o && (n[r] = o)
      : 'style' === r
        ? (n[r] = { ...o, ...a })
        : 'className' === r && (n[r] = [o, a].filter(Boolean).join(' '));
  }
  return { ...e, ...n };
}
function P(e) {
  const t = e + 'CollectionProvider',
    [r, o] = y(t),
    [a, i] = r(t, { collectionRef: { current: null }, itemMap: new Map() }),
    s = e + 'CollectionSlot',
    l = e + 'CollectionItemSlot',
    c = 'data-radix-collection-item';
  return [
    {
      Provider: (e) => {
        const { scope: t, children: r } = e,
          o = n.useRef(null),
          i = n.useRef(new Map()).current;
        return n.createElement(a, { scope: t, itemMap: i, collectionRef: o }, r);
      },
      Slot: n.forwardRef((e, t) => {
        const { scope: r, children: o } = e,
          a = b(t, i(s, r).collectionRef);
        return n.createElement(x, { ref: a }, o);
      }),
      ItemSlot: n.forwardRef((e, t) => {
        const { scope: r, children: o, ...a } = e,
          s = n.useRef(null),
          u = b(t, s),
          d = i(l, r);
        return (
          n.useEffect(
            () => (
              d.itemMap.set(s, { ref: s, ...a }),
              () => {
                d.itemMap.delete(s);
              }
            ),
          ),
          n.createElement(x, { [c]: '', ref: u }, o)
        );
      }),
    },
    function (t) {
      const r = i(e + 'CollectionConsumer', t);
      return n.useCallback(() => {
        const e = r.collectionRef.current;
        if (!e) return [];
        const t = Array.from(e.querySelectorAll(`[${c}]`));
        return Array.from(r.itemMap.values()).sort(
          (e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current),
        );
      }, [r.collectionRef, r.itemMap]);
    },
    o,
  ];
}
const T = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
].reduce((n, r) => {
  const o = e.forwardRef((n, o) => {
    const { asChild: a, ...i } = n,
      s = a ? x : r;
    return (
      e.useEffect(() => {
        window[Symbol.for('radix-ui')] = !0;
      }, []),
      e.createElement(s, t({}, i, { ref: o }))
    );
  });
  return (o.displayName = `Primitive.${r}`), { ...n, [r]: o };
}, {});
function M(e, t) {
  e && r.flushSync(() => e.dispatchEvent(t));
}
function O(t) {
  const n = e.useRef(t);
  return (
    e.useEffect(() => {
      n.current = t;
    }),
    e.useMemo(
      () =>
        (...e) => {
          var t;
          return null === (t = n.current) || void 0 === t ? void 0 : t.call(n, ...e);
        },
      [],
    )
  );
}
const k = 'dismissableLayer.update',
  I = 'dismissableLayer.pointerDownOutside',
  A = 'dismissableLayer.focusOutside';
let L;
const N = e.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  F = e.forwardRef((n, r) => {
    var o;
    const {
        disableOutsidePointerEvents: a = !1,
        onEscapeKeyDown: i,
        onPointerDownOutside: s,
        onFocusOutside: l,
        onInteractOutside: c,
        onDismiss: u,
        ...d
      } = n,
      f = e.useContext(N),
      [p, v] = e.useState(null),
      m =
        null !== (o = null == p ? void 0 : p.ownerDocument) && void 0 !== o
          ? o
          : null === globalThis || void 0 === globalThis
            ? void 0
            : globalThis.document,
      [, h] = e.useState({}),
      w = b(r, (e) => v(e)),
      E = Array.from(f.layers),
      [y] = [...f.layersWithOutsidePointerEventsDisabled].slice(-1),
      C = E.indexOf(y),
      x = p ? E.indexOf(p) : -1,
      R = f.layersWithOutsidePointerEventsDisabled.size > 0,
      _ = x >= C,
      S = (function (
        t,
        n = null === globalThis || void 0 === globalThis ? void 0 : globalThis.document,
      ) {
        const r = O(t),
          o = e.useRef(!1),
          a = e.useRef(() => {});
        return (
          e.useEffect(() => {
            const e = (e) => {
                if (e.target && !o.current) {
                  let t = function () {
                    K(I, r, o, { discrete: !0 });
                  };
                  const o = { originalEvent: e };
                  'touch' === e.pointerType
                    ? (n.removeEventListener('click', a.current),
                      (a.current = t),
                      n.addEventListener('click', a.current, { once: !0 }))
                    : t();
                } else n.removeEventListener('click', a.current);
                o.current = !1;
              },
              t = window.setTimeout(() => {
                n.addEventListener('pointerdown', e);
              }, 0);
            return () => {
              window.clearTimeout(t),
                n.removeEventListener('pointerdown', e),
                n.removeEventListener('click', a.current);
            };
          }, [n, r]),
          { onPointerDownCapture: () => (o.current = !0) }
        );
      })((e) => {
        const t = e.target,
          n = [...f.branches].some((e) => e.contains(t));
        _ && !n && (null == s || s(e), null == c || c(e), e.defaultPrevented || null == u || u());
      }, m),
      D = (function (
        t,
        n = null === globalThis || void 0 === globalThis ? void 0 : globalThis.document,
      ) {
        const r = O(t),
          o = e.useRef(!1);
        return (
          e.useEffect(() => {
            const e = (e) => {
              if (e.target && !o.current) {
                K(A, r, { originalEvent: e }, { discrete: !1 });
              }
            };
            return n.addEventListener('focusin', e), () => n.removeEventListener('focusin', e);
          }, [n, r]),
          { onFocusCapture: () => (o.current = !0), onBlurCapture: () => (o.current = !1) }
        );
      })((e) => {
        const t = e.target;
        [...f.branches].some((e) => e.contains(t)) ||
          (null == l || l(e), null == c || c(e), e.defaultPrevented || null == u || u());
      }, m);
    return (
      (function (
        t,
        n = null === globalThis || void 0 === globalThis ? void 0 : globalThis.document,
      ) {
        const r = O(t);
        e.useEffect(() => {
          const e = (e) => {
            'Escape' === e.key && r(e);
          };
          return n.addEventListener('keydown', e), () => n.removeEventListener('keydown', e);
        }, [r, n]);
      })((e) => {
        x === f.layers.size - 1 &&
          (null == i || i(e), !e.defaultPrevented && u && (e.preventDefault(), u()));
      }, m),
      e.useEffect(() => {
        if (p)
          return (
            a &&
              (0 === f.layersWithOutsidePointerEventsDisabled.size &&
                ((L = m.body.style.pointerEvents), (m.body.style.pointerEvents = 'none')),
              f.layersWithOutsidePointerEventsDisabled.add(p)),
            f.layers.add(p),
            j(),
            () => {
              a &&
                1 === f.layersWithOutsidePointerEventsDisabled.size &&
                (m.body.style.pointerEvents = L);
            }
          );
      }, [p, m, a, f]),
      e.useEffect(
        () => () => {
          p && (f.layers.delete(p), f.layersWithOutsidePointerEventsDisabled.delete(p), j());
        },
        [p, f],
      ),
      e.useEffect(() => {
        const e = () => h({});
        return document.addEventListener(k, e), () => document.removeEventListener(k, e);
      }, []),
      e.createElement(
        T.div,
        t({}, d, {
          ref: w,
          style: { pointerEvents: R ? (_ ? 'auto' : 'none') : void 0, ...n.style },
          onFocusCapture: g(n.onFocusCapture, D.onFocusCapture),
          onBlurCapture: g(n.onBlurCapture, D.onBlurCapture),
          onPointerDownCapture: g(n.onPointerDownCapture, S.onPointerDownCapture),
        }),
      )
    );
  });
function j() {
  const e = new CustomEvent(k);
  document.dispatchEvent(e);
}
function K(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target,
    a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? M(o, a) : o.dispatchEvent(a);
}
const $ = F,
  B = e.forwardRef((n, r) => {
    const o = e.useContext(N),
      a = e.useRef(null),
      i = b(r, a);
    return (
      e.useEffect(() => {
        const e = a.current;
        if (e)
          return (
            o.branches.add(e),
            () => {
              o.branches.delete(e);
            }
          );
      }, [o.branches]),
      e.createElement(T.div, t({}, n, { ref: i }))
    );
  }),
  H = e.forwardRef((n, r) => {
    var a;
    const {
      container: i = null === globalThis ||
      void 0 === globalThis ||
      null === (a = globalThis.document) ||
      void 0 === a
        ? void 0
        : a.body,
      ...s
    } = n;
    return i ? o.createPortal(e.createElement(T.div, t({}, s, { ref: r })), i) : null;
  }),
  V = Boolean(null === globalThis || void 0 === globalThis ? void 0 : globalThis.document)
    ? e.useLayoutEffect
    : () => {};
const W = (t) => {
  const { present: n, children: o } = t,
    a = (function (t) {
      const [n, o] = e.useState(),
        a = e.useRef({}),
        i = e.useRef(t),
        s = e.useRef('none'),
        l = t ? 'mounted' : 'unmounted',
        [c, u] = (function (t, n) {
          return e.useReducer((e, t) => {
            const r = n[e][t];
            return null != r ? r : e;
          }, t);
        })(l, {
          mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
          unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
          unmounted: { MOUNT: 'mounted' },
        });
      return (
        e.useEffect(() => {
          const e = U(a.current);
          s.current = 'mounted' === c ? e : 'none';
        }, [c]),
        V(() => {
          const e = a.current,
            n = i.current;
          if (n !== t) {
            const r = s.current,
              o = U(e);
            if (t) u('MOUNT');
            else if ('none' === o || 'none' === (null == e ? void 0 : e.display)) u('UNMOUNT');
            else {
              u(n && r !== o ? 'ANIMATION_OUT' : 'UNMOUNT');
            }
            i.current = t;
          }
        }, [t, u]),
        V(() => {
          if (n) {
            const e = (e) => {
                const t = U(a.current).includes(e.animationName);
                e.target === n && t && r.flushSync(() => u('ANIMATION_END'));
              },
              t = (e) => {
                e.target === n && (s.current = U(a.current));
              };
            return (
              n.addEventListener('animationstart', t),
              n.addEventListener('animationcancel', e),
              n.addEventListener('animationend', e),
              () => {
                n.removeEventListener('animationstart', t),
                  n.removeEventListener('animationcancel', e),
                  n.removeEventListener('animationend', e);
              }
            );
          }
          u('ANIMATION_END');
        }, [n, u]),
        {
          isPresent: ['mounted', 'unmountSuspended'].includes(c),
          ref: e.useCallback((e) => {
            e && (a.current = getComputedStyle(e)), o(e);
          }, []),
        }
      );
    })(n),
    i = 'function' == typeof o ? o({ present: a.isPresent }) : e.Children.only(o),
    s = b(a.ref, i.ref);
  return 'function' == typeof o || a.isPresent ? e.cloneElement(i, { ref: s }) : null;
};
function U(e) {
  return (null == e ? void 0 : e.animationName) || 'none';
}
function z({ prop: t, defaultProp: n, onChange: r = () => {} }) {
  const [o, a] = (function ({ defaultProp: t, onChange: n }) {
      const r = e.useState(t),
        [o] = r,
        a = e.useRef(o),
        i = O(n);
      return (
        e.useEffect(() => {
          a.current !== o && (i(o), (a.current = o));
        }, [o, a, i]),
        r
      );
    })({ defaultProp: n, onChange: r }),
    i = void 0 !== t,
    s = i ? t : o,
    l = O(r);
  return [
    s,
    e.useCallback(
      (e) => {
        if (i) {
          const n = 'function' == typeof e ? e(t) : e;
          n !== t && l(n);
        } else a(e);
      },
      [i, t, a, l],
    ),
  ];
}
W.displayName = 'Presence';
const G = e.forwardRef((n, r) =>
    e.createElement(
      T.span,
      t({}, n, {
        ref: r,
        style: {
          position: 'absolute',
          border: 0,
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          wordWrap: 'normal',
          ...n.style,
        },
      }),
    ),
  ),
  q = 'ToastProvider',
  [X, Z, Y] = P('Toast'),
  [J, Q] = y('Toast', [Y]),
  [ee, te] = J(q),
  ne = (t) => {
    const {
        __scopeToast: n,
        label: r = 'Notification',
        duration: o = 5e3,
        swipeDirection: a = 'right',
        swipeThreshold: i = 50,
        children: s,
      } = t,
      [l, c] = e.useState(null),
      [u, d] = e.useState(0),
      f = e.useRef(!1),
      p = e.useRef(!1);
    return e.createElement(
      X.Provider,
      { scope: n },
      e.createElement(
        ee,
        {
          scope: n,
          label: r,
          duration: o,
          swipeDirection: a,
          swipeThreshold: i,
          toastCount: u,
          viewport: l,
          onViewportChange: c,
          onToastAdd: e.useCallback(() => d((e) => e + 1), []),
          onToastRemove: e.useCallback(() => d((e) => e - 1), []),
          isFocusedToastEscapeKeyDownRef: f,
          isClosePausedRef: p,
        },
        s,
      ),
    );
  };
ne.propTypes = {
  label(e) {
    if (e.label && 'string' == typeof e.label && !e.label.trim()) {
      return new Error(
        `Invalid prop \`label\` supplied to \`${q}\`. Expected non-empty \`string\`.`,
      );
    }
    return null;
  },
};
const re = ['F8'],
  oe = 'toast.viewportPause',
  ae = 'toast.viewportResume',
  ie = e.forwardRef((n, r) => {
    const { __scopeToast: o, hotkey: a = re, label: i = 'Notifications ({hotkey})', ...s } = n,
      l = te('ToastViewport', o),
      c = Z(o),
      u = e.useRef(null),
      d = e.useRef(null),
      f = e.useRef(null),
      p = e.useRef(null),
      v = b(r, p, l.onViewportChange),
      m = a.join('+').replace(/Key/g, '').replace(/Digit/g, ''),
      h = l.toastCount > 0;
    e.useEffect(() => {
      const e = (e) => {
        var t;
        a.every((t) => e[t] || e.code === t) &&
          (null === (t = p.current) || void 0 === t || t.focus());
      };
      return (
        document.addEventListener('keydown', e), () => document.removeEventListener('keydown', e)
      );
    }, [a]),
      e.useEffect(() => {
        const e = u.current,
          t = p.current;
        if (h && e && t) {
          const n = () => {
              if (!l.isClosePausedRef.current) {
                const e = new CustomEvent(oe);
                t.dispatchEvent(e), (l.isClosePausedRef.current = !0);
              }
            },
            r = () => {
              if (l.isClosePausedRef.current) {
                const e = new CustomEvent(ae);
                t.dispatchEvent(e), (l.isClosePausedRef.current = !1);
              }
            },
            o = (t) => {
              !e.contains(t.relatedTarget) && r();
            },
            a = () => {
              e.contains(document.activeElement) || r();
            };
          return (
            e.addEventListener('focusin', n),
            e.addEventListener('focusout', o),
            e.addEventListener('pointermove', n),
            e.addEventListener('pointerleave', a),
            window.addEventListener('blur', n),
            window.addEventListener('focus', r),
            () => {
              e.removeEventListener('focusin', n),
                e.removeEventListener('focusout', o),
                e.removeEventListener('pointermove', n),
                e.removeEventListener('pointerleave', a),
                window.removeEventListener('blur', n),
                window.removeEventListener('focus', r);
            }
          );
        }
      }, [h, l.isClosePausedRef]);
    const w = e.useCallback(
      ({ tabbingDirection: e }) => {
        const t = c().map((t) => {
          const n = t.ref.current,
            r = [n, ...be(n)];
          return 'forwards' === e ? r : r.reverse();
        });
        return ('forwards' === e ? t.reverse() : t).flat();
      },
      [c],
    );
    return (
      e.useEffect(() => {
        const e = p.current;
        if (e) {
          const t = (t) => {
            const n = t.altKey || t.ctrlKey || t.metaKey;
            if ('Tab' === t.key && !n) {
              const n = document.activeElement,
                i = t.shiftKey;
              var r;
              if (t.target === e && i)
                return void (null === (r = d.current) || void 0 === r || r.focus());
              const s = w({ tabbingDirection: i ? 'backwards' : 'forwards' }),
                l = s.findIndex((e) => e === n);
              var o, a;
              if (ye(s.slice(l + 1))) t.preventDefault();
              else
                i
                  ? null === (o = d.current) || void 0 === o || o.focus()
                  : null === (a = f.current) || void 0 === a || a.focus();
            }
          };
          return e.addEventListener('keydown', t), () => e.removeEventListener('keydown', t);
        }
      }, [c, w]),
      e.createElement(
        B,
        {
          ref: u,
          role: 'region',
          'aria-label': i.replace('{hotkey}', m),
          tabIndex: -1,
          style: { pointerEvents: h ? void 0 : 'none' },
        },
        h &&
          e.createElement(se, {
            ref: d,
            onFocusFromOutsideViewport: () => {
              ye(w({ tabbingDirection: 'forwards' }));
            },
          }),
        e.createElement(
          X.Slot,
          { scope: o },
          e.createElement(T.ol, t({ tabIndex: -1 }, s, { ref: v })),
        ),
        h &&
          e.createElement(se, {
            ref: f,
            onFocusFromOutsideViewport: () => {
              ye(w({ tabbingDirection: 'backwards' }));
            },
          }),
      )
    );
  }),
  se = e.forwardRef((n, r) => {
    const { __scopeToast: o, onFocusFromOutsideViewport: a, ...i } = n,
      s = te('ToastFocusProxy', o);
    return e.createElement(
      G,
      t({ 'aria-hidden': !0, tabIndex: 0 }, i, {
        ref: r,
        style: { position: 'fixed' },
        onFocus: (e) => {
          var t;
          const n = e.relatedTarget;
          !(null !== (t = s.viewport) && void 0 !== t && t.contains(n)) && a();
        },
      }),
    );
  }),
  le = 'Toast',
  ce = e.forwardRef((n, r) => {
    const { forceMount: o, open: a, defaultOpen: i, onOpenChange: s, ...l } = n,
      [c = !0, u] = z({ prop: a, defaultProp: i, onChange: s });
    return e.createElement(
      W,
      { present: o || c },
      e.createElement(
        fe,
        t({ open: c }, l, {
          ref: r,
          onClose: () => u(!1),
          onPause: O(n.onPause),
          onResume: O(n.onResume),
          onSwipeStart: g(n.onSwipeStart, (e) => {
            e.currentTarget.setAttribute('data-swipe', 'start');
          }),
          onSwipeMove: g(n.onSwipeMove, (e) => {
            const { x: t, y: n } = e.detail.delta;
            e.currentTarget.setAttribute('data-swipe', 'move'),
              e.currentTarget.style.setProperty('--radix-toast-swipe-move-x', `${t}px`),
              e.currentTarget.style.setProperty('--radix-toast-swipe-move-y', `${n}px`);
          }),
          onSwipeCancel: g(n.onSwipeCancel, (e) => {
            e.currentTarget.setAttribute('data-swipe', 'cancel'),
              e.currentTarget.style.removeProperty('--radix-toast-swipe-move-x'),
              e.currentTarget.style.removeProperty('--radix-toast-swipe-move-y'),
              e.currentTarget.style.removeProperty('--radix-toast-swipe-end-x'),
              e.currentTarget.style.removeProperty('--radix-toast-swipe-end-y');
          }),
          onSwipeEnd: g(n.onSwipeEnd, (e) => {
            const { x: t, y: n } = e.detail.delta;
            e.currentTarget.setAttribute('data-swipe', 'end'),
              e.currentTarget.style.removeProperty('--radix-toast-swipe-move-x'),
              e.currentTarget.style.removeProperty('--radix-toast-swipe-move-y'),
              e.currentTarget.style.setProperty('--radix-toast-swipe-end-x', `${t}px`),
              e.currentTarget.style.setProperty('--radix-toast-swipe-end-y', `${n}px`),
              u(!1);
          }),
        }),
      ),
    );
  }),
  [ue, de] = J(le, { onClose() {} }),
  fe = e.forwardRef((n, o) => {
    const {
        __scopeToast: a,
        type: i = 'foreground',
        duration: s,
        open: l,
        onClose: c,
        onEscapeKeyDown: u,
        onPause: d,
        onResume: f,
        onSwipeStart: p,
        onSwipeMove: v,
        onSwipeCancel: m,
        onSwipeEnd: h,
        ...w
      } = n,
      E = te(le, a),
      [y, C] = e.useState(null),
      x = b(o, (e) => C(e)),
      R = e.useRef(null),
      _ = e.useRef(null),
      S = s || E.duration,
      D = e.useRef(0),
      P = e.useRef(S),
      M = e.useRef(0),
      { onToastAdd: k, onToastRemove: I } = E,
      A = O(() => {
        var e;
        (null == y ? void 0 : y.contains(document.activeElement)) &&
          (null === (e = E.viewport) || void 0 === e || e.focus()),
          c();
      }),
      L = e.useCallback(
        (e) => {
          e &&
            e !== 1 / 0 &&
            (window.clearTimeout(M.current),
            (D.current = new Date().getTime()),
            (M.current = window.setTimeout(A, e)));
        },
        [A],
      );
    e.useEffect(() => {
      const e = E.viewport;
      if (e) {
        const t = () => {
            L(P.current), null == f || f();
          },
          n = () => {
            const e = new Date().getTime() - D.current;
            (P.current = P.current - e), window.clearTimeout(M.current), null == d || d();
          };
        return (
          e.addEventListener(oe, n),
          e.addEventListener(ae, t),
          () => {
            e.removeEventListener(oe, n), e.removeEventListener(ae, t);
          }
        );
      }
    }, [E.viewport, S, d, f, L]),
      e.useEffect(() => {
        l && !E.isClosePausedRef.current && L(S);
      }, [l, S, E.isClosePausedRef, L]),
      e.useEffect(() => (k(), () => I()), [k, I]);
    const N = e.useMemo(() => (y ? we(y) : null), [y]);
    return E.viewport
      ? e.createElement(
          e.Fragment,
          null,
          N &&
            e.createElement(
              pe,
              {
                __scopeToast: a,
                role: 'status',
                'aria-live': 'foreground' === i ? 'assertive' : 'polite',
                'aria-atomic': !0,
              },
              N,
            ),
          e.createElement(
            ue,
            { scope: a, onClose: A },
            r.createPortal(
              e.createElement(
                X.ItemSlot,
                { scope: a },
                e.createElement(
                  $,
                  {
                    asChild: !0,
                    onEscapeKeyDown: g(u, () => {
                      E.isFocusedToastEscapeKeyDownRef.current || A(),
                        (E.isFocusedToastEscapeKeyDownRef.current = !1);
                    }),
                  },
                  e.createElement(
                    T.li,
                    t(
                      {
                        role: 'status',
                        'aria-live': 'off',
                        'aria-atomic': !0,
                        tabIndex: 0,
                        'data-state': l ? 'open' : 'closed',
                        'data-swipe-direction': E.swipeDirection,
                      },
                      w,
                      {
                        ref: x,
                        style: { userSelect: 'none', touchAction: 'none', ...n.style },
                        onKeyDown: g(n.onKeyDown, (e) => {
                          'Escape' === e.key &&
                            (null == u || u(e.nativeEvent),
                            e.nativeEvent.defaultPrevented ||
                              ((E.isFocusedToastEscapeKeyDownRef.current = !0), A()));
                        }),
                        onPointerDown: g(n.onPointerDown, (e) => {
                          0 === e.button && (R.current = { x: e.clientX, y: e.clientY });
                        }),
                        onPointerMove: g(n.onPointerMove, (e) => {
                          if (!R.current) return;
                          const t = e.clientX - R.current.x,
                            n = e.clientY - R.current.y,
                            r = Boolean(_.current),
                            o = ['left', 'right'].includes(E.swipeDirection),
                            a = ['left', 'up'].includes(E.swipeDirection) ? Math.min : Math.max,
                            i = o ? a(0, t) : 0,
                            s = o ? 0 : a(0, n),
                            l = 'touch' === e.pointerType ? 10 : 2,
                            c = { x: i, y: s },
                            u = { originalEvent: e, delta: c };
                          r
                            ? ((_.current = c), ge('toast.swipeMove', v, u, { discrete: !1 }))
                            : Ee(c, E.swipeDirection, l)
                              ? ((_.current = c),
                                ge('toast.swipeStart', p, u, { discrete: !1 }),
                                e.target.setPointerCapture(e.pointerId))
                              : (Math.abs(t) > l || Math.abs(n) > l) && (R.current = null);
                        }),
                        onPointerUp: g(n.onPointerUp, (e) => {
                          const t = _.current,
                            n = e.target;
                          if (
                            (n.hasPointerCapture(e.pointerId) &&
                              n.releasePointerCapture(e.pointerId),
                            (_.current = null),
                            (R.current = null),
                            t)
                          ) {
                            const n = e.currentTarget,
                              r = { originalEvent: e, delta: t };
                            Ee(t, E.swipeDirection, E.swipeThreshold)
                              ? ge('toast.swipeEnd', h, r, { discrete: !0 })
                              : ge('toast.swipeCancel', m, r, { discrete: !0 }),
                              n.addEventListener('click', (e) => e.preventDefault(), { once: !0 });
                          }
                        }),
                      },
                    ),
                  ),
                ),
              ),
              E.viewport,
            ),
          ),
        )
      : null;
  });
fe.propTypes = {
  type(e) {
    if (e.type && !['foreground', 'background'].includes(e.type)) {
      return new Error(
        `Invalid prop \`type\` supplied to \`${le}\`. Expected \`foreground | background\`.`,
      );
    }
    return null;
  },
};
const pe = (t) => {
    const { __scopeToast: n, children: r, ...o } = t,
      a = te(le, n),
      [i, s] = e.useState(!1),
      [l, c] = e.useState(!1);
    return (
      (function (e = () => {}) {
        const t = O(e);
        V(() => {
          let e = 0,
            n = 0;
          return (
            (e = window.requestAnimationFrame(() => (n = window.requestAnimationFrame(t)))),
            () => {
              window.cancelAnimationFrame(e), window.cancelAnimationFrame(n);
            }
          );
        }, [t]);
      })(() => s(!0)),
      e.useEffect(() => {
        const e = window.setTimeout(() => c(!0), 1e3);
        return () => window.clearTimeout(e);
      }, []),
      l
        ? null
        : e.createElement(
            H,
            { asChild: !0 },
            e.createElement(G, o, i && e.createElement(e.Fragment, null, a.label, ' ', r)),
          )
    );
  },
  ve = e.forwardRef((n, r) => {
    const { __scopeToast: o, ...a } = n;
    return e.createElement(T.div, t({}, a, { ref: r }));
  });
e.forwardRef((n, r) => {
  const { altText: o, ...a } = n;
  return o
    ? e.createElement(he, { altText: o, asChild: !0 }, e.createElement(me, t({}, a, { ref: r })))
    : null;
}).propTypes = {
  altText: (e) =>
    e.altText ? null : new Error('Missing prop `altText` expected on `ToastAction`'),
};
const me = e.forwardRef((n, r) => {
    const { __scopeToast: o, ...a } = n,
      i = de('ToastClose', o);
    return e.createElement(
      he,
      { asChild: !0 },
      e.createElement(
        T.button,
        t({ type: 'button' }, a, { ref: r, onClick: g(n.onClick, i.onClose) }),
      ),
    );
  }),
  he = e.forwardRef((n, r) => {
    const { __scopeToast: o, altText: a, ...i } = n;
    return e.createElement(
      T.div,
      t(
        { 'data-radix-toast-announce-exclude': '', 'data-radix-toast-announce-alt': a || void 0 },
        i,
        { ref: r },
      ),
    );
  });
function we(e) {
  const t = [];
  return (
    Array.from(e.childNodes).forEach((e) => {
      if (
        (e.nodeType === e.TEXT_NODE && e.textContent && t.push(e.textContent),
        (function (e) {
          return e.nodeType === e.ELEMENT_NODE;
        })(e))
      ) {
        const n = e.ariaHidden || e.hidden || 'none' === e.style.display,
          r = '' === e.dataset.radixToastAnnounceExclude;
        if (!n)
          if (r) {
            const n = e.dataset.radixToastAnnounceAlt;
            n && t.push(n);
          } else t.push(...we(e));
      }
    }),
    t
  );
}
function ge(e, t, n, { discrete: r }) {
  const o = n.originalEvent.currentTarget,
    a = new CustomEvent(e, { bubbles: !0, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? M(o, a) : o.dispatchEvent(a);
}
const Ee = (e, t, n = 0) => {
  const r = Math.abs(e.x),
    o = Math.abs(e.y),
    a = r > o;
  return 'left' === t || 'right' === t ? a && r > n : !a && o > n;
};
function be(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (e) => {
        const t = 'INPUT' === e.tagName && 'hidden' === e.type;
        return e.disabled || e.hidden || t
          ? NodeFilter.FILTER_SKIP
          : e.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function ye(e) {
  const t = document.activeElement;
  return e.some((e) => e === t || (e.focus(), document.activeElement !== t));
}
const Ce = ne,
  xe = ie,
  Re = ce,
  _e = ve,
  Se = a['useId'.toString()] || (() => {});
let De = 0;
function Pe(t) {
  const [n, r] = e.useState(Se());
  return (
    V(() => {
      r((e) => (null != e ? e : String(De++)));
    }, [t]),
    t || (n ? `radix-${n}` : '')
  );
}
const Te = 'focusScope.autoFocusOnMount',
  Me = 'focusScope.autoFocusOnUnmount',
  Oe = { bubbles: !1, cancelable: !0 },
  ke = e.forwardRef((n, r) => {
    const { loop: o = !1, trapped: a = !1, onMountAutoFocus: i, onUnmountAutoFocus: s, ...l } = n,
      [c, u] = e.useState(null),
      d = O(i),
      f = O(s),
      p = e.useRef(null),
      v = b(r, (e) => u(e)),
      m = e.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    e.useEffect(() => {
      if (a) {
        let e = function (e) {
            if (m.paused || !c) return;
            const t = e.target;
            c.contains(t) ? (p.current = t) : Ne(p.current, { select: !0 });
          },
          t = function (e) {
            if (m.paused || !c) return;
            const t = e.relatedTarget;
            null !== t && (c.contains(t) || Ne(p.current, { select: !0 }));
          },
          n = function (e) {
            if (document.activeElement === document.body)
              for (const t of e) t.removedNodes.length > 0 && Ne(c);
          };
        document.addEventListener('focusin', e), document.addEventListener('focusout', t);
        const r = new MutationObserver(n);
        return (
          c && r.observe(c, { childList: !0, subtree: !0 }),
          () => {
            document.removeEventListener('focusin', e),
              document.removeEventListener('focusout', t),
              r.disconnect();
          }
        );
      }
    }, [a, c, m.paused]),
      e.useEffect(() => {
        if (c) {
          Fe.add(m);
          const t = document.activeElement;
          if (!c.contains(t)) {
            const n = new CustomEvent(Te, Oe);
            c.addEventListener(Te, d),
              c.dispatchEvent(n),
              n.defaultPrevented ||
                (!(function (e, { select: t = !1 } = {}) {
                  const n = document.activeElement;
                  for (const r of e)
                    if ((Ne(r, { select: t }), document.activeElement !== n)) return;
                })(((e = Ie(c)), e.filter((e) => 'A' !== e.tagName)), { select: !0 }),
                document.activeElement === t && Ne(c));
          }
          return () => {
            c.removeEventListener(Te, d),
              setTimeout(() => {
                const e = new CustomEvent(Me, Oe);
                c.addEventListener(Me, f),
                  c.dispatchEvent(e),
                  e.defaultPrevented || Ne(null != t ? t : document.body, { select: !0 }),
                  c.removeEventListener(Me, f),
                  Fe.remove(m);
              }, 0);
          };
        }
        var e;
      }, [c, d, f, m]);
    const h = e.useCallback(
      (e) => {
        if (!o && !a) return;
        if (m.paused) return;
        const t = 'Tab' === e.key && !e.altKey && !e.ctrlKey && !e.metaKey,
          n = document.activeElement;
        if (t && n) {
          const t = e.currentTarget,
            [r, a] = (function (e) {
              const t = Ie(e),
                n = Ae(t, e),
                r = Ae(t.reverse(), e);
              return [n, r];
            })(t);
          r && a
            ? e.shiftKey || n !== a
              ? e.shiftKey && n === r && (e.preventDefault(), o && Ne(a, { select: !0 }))
              : (e.preventDefault(), o && Ne(r, { select: !0 }))
            : n === t && e.preventDefault();
        }
      },
      [o, a, m.paused],
    );
    return e.createElement(T.div, t({ tabIndex: -1 }, l, { ref: v, onKeyDown: h }));
  });
function Ie(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (e) => {
        const t = 'INPUT' === e.tagName && 'hidden' === e.type;
        return e.disabled || e.hidden || t
          ? NodeFilter.FILTER_SKIP
          : e.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Ae(e, t) {
  for (const n of e) if (!Le(n, { upTo: t })) return n;
}
function Le(e, { upTo: t }) {
  if ('hidden' === getComputedStyle(e).visibility) return !0;
  for (; e; ) {
    if (void 0 !== t && e === t) return !1;
    if ('none' === getComputedStyle(e).display) return !0;
    e = e.parentElement;
  }
  return !1;
}
function Ne(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }),
      e !== n &&
        (function (e) {
          return e instanceof HTMLInputElement && 'select' in e;
        })(e) &&
        t &&
        e.select();
  }
}
const Fe = (function () {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (null == n || n.pause()), (e = je(e, t)), e.unshift(t);
    },
    remove(t) {
      var n;
      (e = je(e, t)), null === (n = e[0]) || void 0 === n || n.resume();
    },
  };
})();
function je(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return -1 !== r && n.splice(r, 1), n;
}
let Ke = 0;
function $e() {
  e.useEffect(() => {
    var e, t;
    const n = document.querySelectorAll('[data-radix-focus-guard]');
    return (
      document.body.insertAdjacentElement(
        'afterbegin',
        null !== (e = n[0]) && void 0 !== e ? e : Be(),
      ),
      document.body.insertAdjacentElement(
        'beforeend',
        null !== (t = n[1]) && void 0 !== t ? t : Be(),
      ),
      Ke++,
      () => {
        1 === Ke &&
          document.querySelectorAll('[data-radix-focus-guard]').forEach((e) => e.remove()),
          Ke--;
      }
    );
  }, []);
}
function Be() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none'),
    e
  );
}
const He = 'Dialog',
  [Ve, We] = y(He),
  [Ue, ze] = Ve(He),
  Ge = e.forwardRef((n, r) => {
    const { __scopeDialog: o, ...a } = n,
      i = ze('DialogTrigger', o),
      s = b(r, i.triggerRef);
    return e.createElement(
      T.button,
      t(
        {
          type: 'button',
          'aria-haspopup': 'dialog',
          'aria-expanded': i.open,
          'aria-controls': i.contentId,
          'data-state': dt(i.open),
        },
        a,
        { ref: s, onClick: g(n.onClick, i.onOpenToggle) },
      ),
    );
  }),
  qe = 'DialogPortal',
  [Xe, Ze] = Ve(qe, { forceMount: void 0 }),
  Ye = 'DialogOverlay',
  Je = e.forwardRef((n, r) => {
    const o = Ze(Ye, n.__scopeDialog),
      { forceMount: a = o.forceMount, ...i } = n,
      s = ze(Ye, n.__scopeDialog);
    return s.modal
      ? e.createElement(W, { present: a || s.open }, e.createElement(Qe, t({}, i, { ref: r })))
      : null;
  }),
  Qe = e.forwardRef((n, r) => {
    const { __scopeDialog: o, ...a } = n,
      s = ze(Ye, o);
    return e.createElement(
      i,
      { as: x, allowPinchZoom: !0, shards: [s.contentRef] },
      e.createElement(
        T.div,
        t({ 'data-state': dt(s.open) }, a, {
          ref: r,
          style: { pointerEvents: 'auto', ...a.style },
        }),
      ),
    );
  }),
  et = 'DialogContent',
  tt = e.forwardRef((n, r) => {
    const o = Ze(et, n.__scopeDialog),
      { forceMount: a = o.forceMount, ...i } = n,
      s = ze(et, n.__scopeDialog);
    return e.createElement(
      W,
      { present: a || s.open },
      s.modal
        ? e.createElement(nt, t({}, i, { ref: r }))
        : e.createElement(rt, t({}, i, { ref: r })),
    );
  }),
  nt = e.forwardRef((n, r) => {
    const o = ze(et, n.__scopeDialog),
      a = e.useRef(null),
      i = b(r, o.contentRef, a);
    return (
      e.useEffect(() => {
        const e = a.current;
        if (e) return s(e);
      }, []),
      e.createElement(
        ot,
        t({}, n, {
          ref: i,
          trapFocus: o.open,
          disableOutsidePointerEvents: !0,
          onCloseAutoFocus: g(n.onCloseAutoFocus, (e) => {
            var t;
            e.preventDefault(), null === (t = o.triggerRef.current) || void 0 === t || t.focus();
          }),
          onPointerDownOutside: g(n.onPointerDownOutside, (e) => {
            const t = e.detail.originalEvent,
              n = 0 === t.button && !0 === t.ctrlKey;
            (2 === t.button || n) && e.preventDefault();
          }),
          onFocusOutside: g(n.onFocusOutside, (e) => e.preventDefault()),
        }),
      )
    );
  }),
  rt = e.forwardRef((n, r) => {
    const o = ze(et, n.__scopeDialog),
      a = e.useRef(!1),
      i = e.useRef(!1);
    return e.createElement(
      ot,
      t({}, n, {
        ref: r,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (e) => {
          var t, r;
          (null === (t = n.onCloseAutoFocus) || void 0 === t || t.call(n, e), e.defaultPrevented) ||
            (a.current || null === (r = o.triggerRef.current) || void 0 === r || r.focus(),
            e.preventDefault());
          (a.current = !1), (i.current = !1);
        },
        onInteractOutside: (e) => {
          var t, r;
          null === (t = n.onInteractOutside) || void 0 === t || t.call(n, e),
            e.defaultPrevented ||
              ((a.current = !0), 'pointerdown' === e.detail.originalEvent.type && (i.current = !0));
          const s = e.target;
          (null === (r = o.triggerRef.current) || void 0 === r ? void 0 : r.contains(s)) &&
            e.preventDefault(),
            'focusin' === e.detail.originalEvent.type && i.current && e.preventDefault();
        },
      }),
    );
  }),
  ot = e.forwardRef((n, r) => {
    const { __scopeDialog: o, trapFocus: a, onOpenAutoFocus: i, onCloseAutoFocus: s, ...l } = n,
      c = ze(et, o),
      u = b(r, e.useRef(null));
    return (
      $e(),
      e.createElement(
        e.Fragment,
        null,
        e.createElement(
          ke,
          { asChild: !0, loop: !0, trapped: a, onMountAutoFocus: i, onUnmountAutoFocus: s },
          e.createElement(
            F,
            t(
              {
                role: 'dialog',
                id: c.contentId,
                'aria-describedby': c.descriptionId,
                'aria-labelledby': c.titleId,
                'data-state': dt(c.open),
              },
              l,
              { ref: u, onDismiss: () => c.onOpenChange(!1) },
            ),
          ),
        ),
        !1,
      )
    );
  }),
  at = 'DialogTitle',
  it = e.forwardRef((n, r) => {
    const { __scopeDialog: o, ...a } = n,
      i = ze(at, o);
    return e.createElement(T.h2, t({ id: i.titleId }, a, { ref: r }));
  }),
  st = 'DialogDescription',
  lt = e.forwardRef((n, r) => {
    const { __scopeDialog: o, ...a } = n,
      i = ze(st, o);
    return e.createElement(T.p, t({ id: i.descriptionId }, a, { ref: r }));
  }),
  ct = 'DialogClose',
  ut = e.forwardRef((n, r) => {
    const { __scopeDialog: o, ...a } = n,
      i = ze(ct, o);
    return e.createElement(
      T.button,
      t({ type: 'button' }, a, { ref: r, onClick: g(n.onClick, () => i.onOpenChange(!1)) }),
    );
  });
function dt(e) {
  return e ? 'open' : 'closed';
}
const [ft, pt] = (function (t, n) {
    const r = e.createContext(n);
    function o(t) {
      const { children: n, ...o } = t,
        a = e.useMemo(() => o, Object.values(o));
      return e.createElement(r.Provider, { value: a }, n);
    }
    return (
      (o.displayName = t + 'Provider'),
      [
        o,
        function (o) {
          const a = e.useContext(r);
          if (a) return a;
          if (void 0 !== n) return n;
          throw new Error(`\`${o}\` must be used within \`${t}\``);
        },
      ]
    );
  })('DialogTitleWarning', { contentName: et, titleName: at, docsSlug: 'dialog' }),
  vt = (t) => {
    const {
        __scopeDialog: n,
        children: r,
        open: o,
        defaultOpen: a,
        onOpenChange: i,
        modal: s = !0,
      } = t,
      l = e.useRef(null),
      c = e.useRef(null),
      [u = !1, d] = z({ prop: o, defaultProp: a, onChange: i });
    return e.createElement(
      Ue,
      {
        scope: n,
        triggerRef: l,
        contentRef: c,
        contentId: Pe(),
        titleId: Pe(),
        descriptionId: Pe(),
        open: u,
        onOpenChange: d,
        onOpenToggle: e.useCallback(() => d((e) => !e), [d]),
        modal: s,
      },
      r,
    );
  },
  mt = Ge,
  ht = (t) => {
    const { __scopeDialog: n, forceMount: r, children: o, container: a } = t,
      i = ze(qe, n);
    return e.createElement(
      Xe,
      { scope: n, forceMount: r },
      e.Children.map(o, (t) =>
        e.createElement(
          W,
          { present: r || i.open },
          e.createElement(H, { asChild: !0, container: a }, t),
        ),
      ),
    );
  },
  wt = Je,
  gt = tt,
  Et = it,
  bt = lt,
  yt = ut,
  [Ct, xt] = y('AlertDialog', [We]),
  Rt = We(),
  _t = e.forwardRef((n, r) => {
    const { __scopeAlertDialog: o, ...a } = n,
      i = Rt(o);
    return e.createElement(wt, t({}, i, a, { ref: r }));
  }),
  St = 'AlertDialogContent',
  [Dt, Pt] = Ct(St),
  Tt = e.forwardRef((n, r) => {
    const { __scopeAlertDialog: o, children: a, ...i } = n,
      s = Rt(o),
      l = b(r, e.useRef(null)),
      c = e.useRef(null);
    return e.createElement(
      ft,
      { contentName: St, titleName: Mt, docsSlug: 'alert-dialog' },
      e.createElement(
        Dt,
        { scope: o, cancelRef: c },
        e.createElement(
          gt,
          t({ role: 'alertdialog' }, s, i, {
            ref: l,
            onOpenAutoFocus: g(i.onOpenAutoFocus, (e) => {
              var t;
              e.preventDefault(),
                null === (t = c.current) || void 0 === t || t.focus({ preventScroll: !0 });
            }),
            onPointerDownOutside: (e) => e.preventDefault(),
            onInteractOutside: (e) => e.preventDefault(),
          }),
          e.createElement(_, null, a),
          !1,
        ),
      ),
    );
  }),
  Mt = 'AlertDialogTitle',
  Ot = e.forwardRef((n, r) => {
    const { __scopeAlertDialog: o, ...a } = n,
      i = Rt(o);
    return e.createElement(Et, t({}, i, a, { ref: r }));
  }),
  kt = e.forwardRef((n, r) => {
    const { __scopeAlertDialog: o, ...a } = n,
      i = Rt(o);
    return e.createElement(bt, t({}, i, a, { ref: r }));
  }),
  It = (n) => {
    const { __scopeAlertDialog: r, ...o } = n,
      a = Rt(r);
    return e.createElement(ht, t({}, a, o));
  },
  At = _t,
  Lt = Tt,
  Nt = e.forwardRef((n, r) => {
    const { __scopeAlertDialog: o, ...a } = n,
      i = Rt(o);
    return e.createElement(yt, t({}, i, a, { ref: r }));
  }),
  Ft = e.forwardRef((n, r) => {
    const { __scopeAlertDialog: o, ...a } = n,
      { cancelRef: i } = Pt('AlertDialogCancel', o),
      s = Rt(o),
      l = b(r, i);
    return e.createElement(yt, t({}, s, a, { ref: l }));
  }),
  jt = Ot,
  Kt = kt;
function $t(t) {
  const n = e.useRef({ value: t, previous: t });
  return e.useMemo(
    () => (
      n.current.value !== t && ((n.current.previous = n.current.value), (n.current.value = t)),
      n.current.previous
    ),
    [t],
  );
}
function Bt(t) {
  const [n, r] = e.useState(void 0);
  return (
    V(() => {
      if (t) {
        r({ width: t.offsetWidth, height: t.offsetHeight });
        const e = new ResizeObserver((e) => {
          if (!Array.isArray(e)) return;
          if (!e.length) return;
          const n = e[0];
          let o, a;
          if ('borderBoxSize' in n) {
            const e = n.borderBoxSize,
              t = Array.isArray(e) ? e[0] : e;
            (o = t.inlineSize), (a = t.blockSize);
          } else (o = t.offsetWidth), (a = t.offsetHeight);
          r({ width: o, height: a });
        });
        return e.observe(t, { box: 'border-box' }), () => e.unobserve(t);
      }
      r(void 0);
    }, [t]),
    n
  );
}
const Ht = 'Checkbox',
  [Vt, Wt] = y(Ht),
  [Ut, zt] = Vt(Ht),
  Gt = e.forwardRef((n, r) => {
    const {
        __scopeCheckbox: o,
        name: a,
        checked: i,
        defaultChecked: s,
        required: l,
        disabled: c,
        value: u = 'on',
        onCheckedChange: d,
        ...f
      } = n,
      [p, v] = e.useState(null),
      m = b(r, (e) => v(e)),
      h = e.useRef(!1),
      w = !p || Boolean(p.closest('form')),
      [E = !1, y] = z({ prop: i, defaultProp: s, onChange: d }),
      C = e.useRef(E);
    return (
      e.useEffect(() => {
        const e = null == p ? void 0 : p.form;
        if (e) {
          const t = () => y(C.current);
          return e.addEventListener('reset', t), () => e.removeEventListener('reset', t);
        }
      }, [p, y]),
      e.createElement(
        Ut,
        { scope: o, state: E, disabled: c },
        e.createElement(
          T.button,
          t(
            {
              type: 'button',
              role: 'checkbox',
              'aria-checked': Xt(E) ? 'mixed' : E,
              'aria-required': l,
              'data-state': Zt(E),
              'data-disabled': c ? '' : void 0,
              disabled: c,
              value: u,
            },
            f,
            {
              ref: m,
              onKeyDown: g(n.onKeyDown, (e) => {
                'Enter' === e.key && e.preventDefault();
              }),
              onClick: g(n.onClick, (e) => {
                y((e) => !!Xt(e) || !e),
                  w && ((h.current = e.isPropagationStopped()), h.current || e.stopPropagation());
              }),
            },
          ),
        ),
        w &&
          e.createElement(qt, {
            control: p,
            bubbles: !h.current,
            name: a,
            value: u,
            checked: E,
            required: l,
            disabled: c,
            style: { transform: 'translateX(-100%)' },
          }),
      )
    );
  }),
  qt = (n) => {
    const { control: r, checked: o, bubbles: a = !0, ...i } = n,
      s = e.useRef(null),
      l = $t(o),
      c = Bt(r);
    return (
      e.useEffect(() => {
        const e = s.current,
          t = window.HTMLInputElement.prototype,
          n = Object.getOwnPropertyDescriptor(t, 'checked').set;
        if (l !== o && n) {
          const t = new Event('click', { bubbles: a });
          (e.indeterminate = Xt(o)), n.call(e, !Xt(o) && o), e.dispatchEvent(t);
        }
      }, [l, o, a]),
      e.createElement(
        'input',
        t({ type: 'checkbox', 'aria-hidden': !0, defaultChecked: !Xt(o) && o }, i, {
          tabIndex: -1,
          ref: s,
          style: {
            ...n.style,
            ...c,
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
          },
        }),
      )
    );
  };
function Xt(e) {
  return 'indeterminate' === e;
}
function Zt(e) {
  return Xt(e) ? 'indeterminate' : e ? 'checked' : 'unchecked';
}
const Yt = Gt,
  Jt = e.forwardRef((n, r) => {
    const { __scopeCheckbox: o, forceMount: a, ...i } = n,
      s = zt('CheckboxIndicator', o);
    return e.createElement(
      W,
      { present: a || Xt(s.state) || !0 === s.state },
      e.createElement(
        T.span,
        t({ 'data-state': Zt(s.state), 'data-disabled': s.disabled ? '' : void 0 }, i, {
          ref: r,
          style: { pointerEvents: 'none', ...n.style },
        }),
      ),
    );
  });
function Qt(e, t) {
  if (null == e) return {};
  var n,
    r,
    o = {},
    a = Object.keys(e);
  for (r = 0; r < a.length; r++) (n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]);
  return o;
}
var en = ['color'],
  tn = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, en);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  nn = ['color'],
  rn = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, nn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  on = ['color'],
  an = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, on);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M3 2.5C3 2.22386 3.22386 2 3.5 2H11.5C11.7761 2 12 2.22386 12 2.5V13.5C12 13.6818 11.9014 13.8492 11.7424 13.9373C11.5834 14.0254 11.3891 14.0203 11.235 13.924L7.5 11.5896L3.765 13.924C3.61087 14.0203 3.41659 14.0254 3.25762 13.9373C3.09864 13.8492 3 13.6818 3 13.5V2.5ZM4 3V12.5979L6.97 10.7416C7.29427 10.539 7.70573 10.539 8.03 10.7416L11 12.5979V3H4Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  sn = ['color'],
  ln = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, sn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  cn = ['color'],
  un = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, cn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  dn = ['color'],
  fn = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, dn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  pn = ['color'],
  vn = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, pn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  mn = ['color'],
  hn = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, mn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  }),
  wn = ['color'],
  gn = e.forwardRef(function (t, n) {
    var r = t.color,
      o = void 0 === r ? 'currentColor' : r,
      a = Qt(t, wn);
    return e.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        a,
        { ref: n },
      ),
      e.createElement('path', {
        d: 'M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }),
    );
  });
function En(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (r) {
    if ((null == e || e(r), !1 === n || !r.defaultPrevented)) return null == t ? void 0 : t(r);
  };
}
function bn(...e) {
  return (t) =>
    e.forEach((e) =>
      (function (e, t) {
        'function' == typeof e ? e(t) : null != e && (e.current = t);
      })(e, t),
    );
}
function yn(...t) {
  const n = t[0];
  if (1 === t.length) return n;
  const r = () => {
    const r = t.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
    return function (t) {
      const o = r.reduce(
        (e, { useScope: n, scopeName: r }) => ({ ...e, ...n(t)[`__scope${r}`] }),
        {},
      );
      return e.useMemo(() => ({ [`__scope${n.scopeName}`]: o }), [o]);
    };
  };
  return (r.scopeName = n.scopeName), r;
}
function Cn(t) {
  const n = e.useRef(t);
  return (
    e.useEffect(() => {
      n.current = t;
    }),
    e.useMemo(
      () =>
        (...e) => {
          var t;
          return null == (t = n.current) ? void 0 : t.call(n, ...e);
        },
      [],
    )
  );
}
function xn({ prop: t, defaultProp: n, onChange: r = () => {} }) {
  const [o, a] = (function ({ defaultProp: t, onChange: n }) {
      const r = e.useState(t),
        [o] = r,
        a = e.useRef(o),
        i = Cn(n);
      return (
        e.useEffect(() => {
          a.current !== o && (i(o), (a.current = o));
        }, [o, a, i]),
        r
      );
    })({ defaultProp: n, onChange: r }),
    i = void 0 !== t,
    s = i ? t : o,
    l = Cn(r);
  return [
    s,
    e.useCallback(
      (e) => {
        if (i) {
          const n = 'function' == typeof e ? e(t) : e;
          n !== t && l(n);
        } else a(e);
      },
      [i, t, a, l],
    ),
  ];
}
var Rn = e.forwardRef((t, n) => {
  const { children: r, ...o } = t,
    a = e.Children.toArray(r),
    i = a.find(Dn);
  if (i) {
    const t = i.props.children,
      r = a.map((n) =>
        n === i
          ? e.Children.count(t) > 1
            ? e.Children.only(null)
            : e.isValidElement(t)
              ? t.props.children
              : null
          : n,
      );
    return l.jsx(_n, {
      ...o,
      ref: n,
      children: e.isValidElement(t) ? e.cloneElement(t, void 0, r) : null,
    });
  }
  return l.jsx(_n, { ...o, ref: n, children: r });
});
Rn.displayName = 'Slot';
var _n = e.forwardRef((t, n) => {
  const { children: r, ...o } = t;
  if (e.isValidElement(r)) {
    const t = (function (e) {
      var t, n;
      let r = null == (t = Object.getOwnPropertyDescriptor(e.props, 'ref')) ? void 0 : t.get,
        o = r && 'isReactWarning' in r && r.isReactWarning;
      if (o) return e.ref;
      if (
        ((r = null == (n = Object.getOwnPropertyDescriptor(e, 'ref')) ? void 0 : n.get),
        (o = r && 'isReactWarning' in r && r.isReactWarning),
        o)
      )
        return e.props.ref;
      return e.props.ref || e.ref;
    })(r);
    return e.cloneElement(r, { ...Pn(o, r.props), ref: n ? bn(n, t) : t });
  }
  return e.Children.count(r) > 1 ? e.Children.only(null) : null;
});
_n.displayName = 'SlotClone';
var Sn = ({ children: e }) => l.jsx(l.Fragment, { children: e });
function Dn(t) {
  return e.isValidElement(t) && t.type === Sn;
}
function Pn(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? o && a
        ? (n[r] = (...e) => {
            a(...e), o(...e);
          })
        : o && (n[r] = o)
      : 'style' === r
        ? (n[r] = { ...o, ...a })
        : 'className' === r && (n[r] = [o, a].filter(Boolean).join(' '));
  }
  return { ...e, ...n };
}
var Tn = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
].reduce((t, n) => {
  const r = e.forwardRef((e, t) => {
    const { asChild: r, ...o } = e,
      a = r ? Rn : n;
    return (
      'undefined' != typeof window && (window[Symbol.for('radix-ui')] = !0),
      l.jsx(a, { ...o, ref: t })
    );
  });
  return (r.displayName = `Primitive.${n}`), { ...t, [n]: r };
}, {});
function Mn(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (r) {
    if ((null == e || e(r), !1 === n || !r.defaultPrevented)) return null == t ? void 0 : t(r);
  };
}
function On(t, n = []) {
  let r = [];
  const o = () => {
    const n = r.map((t) => e.createContext(t));
    return function (r) {
      const o = (null == r ? void 0 : r[t]) || n;
      return e.useMemo(() => ({ [`__scope${t}`]: { ...r, [t]: o } }), [r, o]);
    };
  };
  return (
    (o.scopeName = t),
    [
      function (n, o) {
        const a = e.createContext(o),
          i = r.length;
        function s(n) {
          const { scope: r, children: o, ...s } = n,
            c = (null == r ? void 0 : r[t][i]) || a,
            u = e.useMemo(() => s, Object.values(s));
          return l.jsx(c.Provider, { value: u, children: o });
        }
        return (
          (r = [...r, o]),
          (s.displayName = n + 'Provider'),
          [
            s,
            function (r, s) {
              const l = (null == s ? void 0 : s[t][i]) || a,
                c = e.useContext(l);
              if (c) return c;
              if (void 0 !== o) return o;
              throw new Error(`\`${r}\` must be used within \`${n}\``);
            },
          ]
        );
      },
      kn(o, ...n),
    ]
  );
}
function kn(...t) {
  const n = t[0];
  if (1 === t.length) return n;
  const r = () => {
    const r = t.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
    return function (t) {
      const o = r.reduce(
        (e, { useScope: n, scopeName: r }) => ({ ...e, ...n(t)[`__scope${r}`] }),
        {},
      );
      return e.useMemo(() => ({ [`__scope${n.scopeName}`]: o }), [o]);
    };
  };
  return (r.scopeName = n.scopeName), r;
}
function In(...e) {
  return (t) =>
    e.forEach((e) =>
      (function (e, t) {
        'function' == typeof e ? e(t) : null != e && (e.current = t);
      })(e, t),
    );
}
function An(...t) {
  return e.useCallback(In(...t), t);
}
var Ln = e.forwardRef((t, n) => {
  const { children: r, ...o } = t,
    a = e.Children.toArray(r),
    i = a.find(jn);
  if (i) {
    const t = i.props.children,
      r = a.map((n) =>
        n === i
          ? e.Children.count(t) > 1
            ? e.Children.only(null)
            : e.isValidElement(t)
              ? t.props.children
              : null
          : n,
      );
    return l.jsx(Nn, {
      ...o,
      ref: n,
      children: e.isValidElement(t) ? e.cloneElement(t, void 0, r) : null,
    });
  }
  return l.jsx(Nn, { ...o, ref: n, children: r });
});
Ln.displayName = 'Slot';
var Nn = e.forwardRef((t, n) => {
  const { children: r, ...o } = t;
  if (e.isValidElement(r)) {
    const t = (function (e) {
      var t, n;
      let r = null == (t = Object.getOwnPropertyDescriptor(e.props, 'ref')) ? void 0 : t.get,
        o = r && 'isReactWarning' in r && r.isReactWarning;
      if (o) return e.ref;
      if (
        ((r = null == (n = Object.getOwnPropertyDescriptor(e, 'ref')) ? void 0 : n.get),
        (o = r && 'isReactWarning' in r && r.isReactWarning),
        o)
      )
        return e.props.ref;
      return e.props.ref || e.ref;
    })(r);
    return e.cloneElement(r, { ...Kn(o, r.props), ref: n ? In(n, t) : t });
  }
  return e.Children.count(r) > 1 ? e.Children.only(null) : null;
});
Nn.displayName = 'SlotClone';
var Fn = ({ children: e }) => l.jsx(l.Fragment, { children: e });
function jn(t) {
  return e.isValidElement(t) && t.type === Fn;
}
function Kn(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r],
      a = t[r];
    /^on[A-Z]/.test(r)
      ? o && a
        ? (n[r] = (...e) => {
            a(...e), o(...e);
          })
        : o && (n[r] = o)
      : 'style' === r
        ? (n[r] = { ...o, ...a })
        : 'className' === r && (n[r] = [o, a].filter(Boolean).join(' '));
  }
  return { ...e, ...n };
}
function $n(e) {
  const t = e + 'CollectionProvider',
    [r, o] = On(t),
    [a, i] = r(t, { collectionRef: { current: null }, itemMap: new Map() }),
    s = (e) => {
      const { scope: t, children: r } = e,
        o = n.useRef(null),
        i = n.useRef(new Map()).current;
      return l.jsx(a, { scope: t, itemMap: i, collectionRef: o, children: r });
    };
  s.displayName = t;
  const c = e + 'CollectionSlot',
    u = n.forwardRef((e, t) => {
      const { scope: n, children: r } = e,
        o = An(t, i(c, n).collectionRef);
      return l.jsx(Ln, { ref: o, children: r });
    });
  u.displayName = c;
  const d = e + 'CollectionItemSlot',
    f = 'data-radix-collection-item',
    p = n.forwardRef((e, t) => {
      const { scope: r, children: o, ...a } = e,
        s = n.useRef(null),
        c = An(t, s),
        u = i(d, r);
      return (
        n.useEffect(
          () => (
            u.itemMap.set(s, { ref: s, ...a }),
            () => {
              u.itemMap.delete(s);
            }
          ),
        ),
        l.jsx(Ln, { [f]: '', ref: c, children: o })
      );
    });
  return (
    (p.displayName = d),
    [
      { Provider: s, Slot: u, ItemSlot: p },
      function (t) {
        const r = i(e + 'CollectionConsumer', t);
        return n.useCallback(() => {
          const e = r.collectionRef.current;
          if (!e) return [];
          const t = Array.from(e.querySelectorAll(`[${f}]`));
          return Array.from(r.itemMap.values()).sort(
            (e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current),
          );
        }, [r.collectionRef, r.itemMap]);
      },
      o,
    ]
  );
}
var Bn = e.createContext(void 0);
function Hn(t) {
  const n = e.useContext(Bn);
  return t || n || 'ltr';
}
var Vn = [
  'a',
  'button',
  'div',
  'form',
  'h2',
  'h3',
  'img',
  'input',
  'label',
  'li',
  'nav',
  'ol',
  'p',
  'span',
  'svg',
  'ul',
].reduce((t, n) => {
  const r = e.forwardRef((e, t) => {
    const { asChild: r, ...o } = e,
      a = r ? Ln : n;
    return (
      'undefined' != typeof window && (window[Symbol.for('radix-ui')] = !0),
      l.jsx(a, { ...o, ref: t })
    );
  });
  return (r.displayName = `Primitive.${n}`), { ...t, [n]: r };
}, {});
function Wn(e, t) {
  e && r.flushSync(() => e.dispatchEvent(t));
}
function Un(t) {
  const n = e.useRef(t);
  return (
    e.useEffect(() => {
      n.current = t;
    }),
    e.useMemo(
      () =>
        (...e) => {
          var t;
          return null == (t = n.current) ? void 0 : t.call(n, ...e);
        },
      [],
    )
  );
}
var zn,
  Gn = 'dismissableLayer.update',
  qn = 'dismissableLayer.pointerDownOutside',
  Xn = 'dismissableLayer.focusOutside',
  Zn = e.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  Yn = e.forwardRef((t, n) => {
    const {
        disableOutsidePointerEvents: r = !1,
        onEscapeKeyDown: o,
        onPointerDownOutside: a,
        onFocusOutside: i,
        onInteractOutside: s,
        onDismiss: c,
        ...u
      } = t,
      d = e.useContext(Zn),
      [f, p] = e.useState(null),
      v =
        (null == f ? void 0 : f.ownerDocument) ??
        (null == globalThis ? void 0 : globalThis.document),
      [, m] = e.useState({}),
      h = An(n, (e) => p(e)),
      w = Array.from(d.layers),
      [g] = [...d.layersWithOutsidePointerEventsDisabled].slice(-1),
      E = w.indexOf(g),
      b = f ? w.indexOf(f) : -1,
      y = d.layersWithOutsidePointerEventsDisabled.size > 0,
      C = b >= E,
      x = (function (t, n = null == globalThis ? void 0 : globalThis.document) {
        const r = Un(t),
          o = e.useRef(!1),
          a = e.useRef(() => {});
        return (
          e.useEffect(() => {
            const e = (e) => {
                if (e.target && !o.current) {
                  let t = function () {
                    Qn(qn, r, o, { discrete: !0 });
                  };
                  const o = { originalEvent: e };
                  'touch' === e.pointerType
                    ? (n.removeEventListener('click', a.current),
                      (a.current = t),
                      n.addEventListener('click', a.current, { once: !0 }))
                    : t();
                } else n.removeEventListener('click', a.current);
                o.current = !1;
              },
              t = window.setTimeout(() => {
                n.addEventListener('pointerdown', e);
              }, 0);
            return () => {
              window.clearTimeout(t),
                n.removeEventListener('pointerdown', e),
                n.removeEventListener('click', a.current);
            };
          }, [n, r]),
          { onPointerDownCapture: () => (o.current = !0) }
        );
      })((e) => {
        const t = e.target,
          n = [...d.branches].some((e) => e.contains(t));
        C && !n && (null == a || a(e), null == s || s(e), e.defaultPrevented || null == c || c());
      }, v),
      R = (function (t, n = null == globalThis ? void 0 : globalThis.document) {
        const r = Un(t),
          o = e.useRef(!1);
        return (
          e.useEffect(() => {
            const e = (e) => {
              if (e.target && !o.current) {
                Qn(Xn, r, { originalEvent: e }, { discrete: !1 });
              }
            };
            return n.addEventListener('focusin', e), () => n.removeEventListener('focusin', e);
          }, [n, r]),
          { onFocusCapture: () => (o.current = !0), onBlurCapture: () => (o.current = !1) }
        );
      })((e) => {
        const t = e.target;
        [...d.branches].some((e) => e.contains(t)) ||
          (null == i || i(e), null == s || s(e), e.defaultPrevented || null == c || c());
      }, v);
    return (
      (function (t, n = null == globalThis ? void 0 : globalThis.document) {
        const r = Un(t);
        e.useEffect(() => {
          const e = (e) => {
            'Escape' === e.key && r(e);
          };
          return (
            n.addEventListener('keydown', e, { capture: !0 }),
            () => n.removeEventListener('keydown', e, { capture: !0 })
          );
        }, [r, n]);
      })((e) => {
        b === d.layers.size - 1 &&
          (null == o || o(e), !e.defaultPrevented && c && (e.preventDefault(), c()));
      }, v),
      e.useEffect(() => {
        if (f)
          return (
            r &&
              (0 === d.layersWithOutsidePointerEventsDisabled.size &&
                ((zn = v.body.style.pointerEvents), (v.body.style.pointerEvents = 'none')),
              d.layersWithOutsidePointerEventsDisabled.add(f)),
            d.layers.add(f),
            Jn(),
            () => {
              r &&
                1 === d.layersWithOutsidePointerEventsDisabled.size &&
                (v.body.style.pointerEvents = zn);
            }
          );
      }, [f, v, r, d]),
      e.useEffect(
        () => () => {
          f && (d.layers.delete(f), d.layersWithOutsidePointerEventsDisabled.delete(f), Jn());
        },
        [f, d],
      ),
      e.useEffect(() => {
        const e = () => m({});
        return document.addEventListener(Gn, e), () => document.removeEventListener(Gn, e);
      }, []),
      l.jsx(Vn.div, {
        ...u,
        ref: h,
        style: { pointerEvents: y ? (C ? 'auto' : 'none') : void 0, ...t.style },
        onFocusCapture: Mn(t.onFocusCapture, R.onFocusCapture),
        onBlurCapture: Mn(t.onBlurCapture, R.onBlurCapture),
        onPointerDownCapture: Mn(t.onPointerDownCapture, x.onPointerDownCapture),
      })
    );
  });
Yn.displayName = 'DismissableLayer';
function Jn() {
  const e = new CustomEvent(Gn);
  document.dispatchEvent(e);
}
function Qn(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target,
    a = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? Wn(o, a) : o.dispatchEvent(a);
}
e.forwardRef((t, n) => {
  const r = e.useContext(Zn),
    o = e.useRef(null),
    a = An(n, o);
  return (
    e.useEffect(() => {
      const e = o.current;
      if (e)
        return (
          r.branches.add(e),
          () => {
            r.branches.delete(e);
          }
        );
    }, [r.branches]),
    l.jsx(Vn.div, { ...t, ref: a })
  );
}).displayName = 'DismissableLayerBranch';
var er = 0;
function tr() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none'),
    e
  );
}
var nr = 'focusScope.autoFocusOnMount',
  rr = 'focusScope.autoFocusOnUnmount',
  or = { bubbles: !1, cancelable: !0 },
  ar = e.forwardRef((t, n) => {
    const { loop: r = !1, trapped: o = !1, onMountAutoFocus: a, onUnmountAutoFocus: i, ...s } = t,
      [c, u] = e.useState(null),
      d = Un(a),
      f = Un(i),
      p = e.useRef(null),
      v = An(n, (e) => u(e)),
      m = e.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    e.useEffect(() => {
      if (o) {
        let e = function (e) {
            if (m.paused || !c) return;
            const t = e.target;
            c.contains(t) ? (p.current = t) : cr(p.current, { select: !0 });
          },
          t = function (e) {
            if (m.paused || !c) return;
            const t = e.relatedTarget;
            null !== t && (c.contains(t) || cr(p.current, { select: !0 }));
          },
          n = function (e) {
            if (document.activeElement === document.body)
              for (const t of e) t.removedNodes.length > 0 && cr(c);
          };
        document.addEventListener('focusin', e), document.addEventListener('focusout', t);
        const r = new MutationObserver(n);
        return (
          c && r.observe(c, { childList: !0, subtree: !0 }),
          () => {
            document.removeEventListener('focusin', e),
              document.removeEventListener('focusout', t),
              r.disconnect();
          }
        );
      }
    }, [o, c, m.paused]),
      e.useEffect(() => {
        if (c) {
          ur.add(m);
          const t = document.activeElement;
          if (!c.contains(t)) {
            const n = new CustomEvent(nr, or);
            c.addEventListener(nr, d),
              c.dispatchEvent(n),
              n.defaultPrevented ||
                (!(function (e, { select: t = !1 } = {}) {
                  const n = document.activeElement;
                  for (const r of e)
                    if ((cr(r, { select: t }), document.activeElement !== n)) return;
                })(((e = ir(c)), e.filter((e) => 'A' !== e.tagName)), { select: !0 }),
                document.activeElement === t && cr(c));
          }
          return () => {
            c.removeEventListener(nr, d),
              setTimeout(() => {
                const e = new CustomEvent(rr, or);
                c.addEventListener(rr, f),
                  c.dispatchEvent(e),
                  e.defaultPrevented || cr(t ?? document.body, { select: !0 }),
                  c.removeEventListener(rr, f),
                  ur.remove(m);
              }, 0);
          };
        }
        var e;
      }, [c, d, f, m]);
    const h = e.useCallback(
      (e) => {
        if (!r && !o) return;
        if (m.paused) return;
        const t = 'Tab' === e.key && !e.altKey && !e.ctrlKey && !e.metaKey,
          n = document.activeElement;
        if (t && n) {
          const t = e.currentTarget,
            [o, a] = (function (e) {
              const t = ir(e),
                n = sr(t, e),
                r = sr(t.reverse(), e);
              return [n, r];
            })(t);
          o && a
            ? e.shiftKey || n !== a
              ? e.shiftKey && n === o && (e.preventDefault(), r && cr(a, { select: !0 }))
              : (e.preventDefault(), r && cr(o, { select: !0 }))
            : n === t && e.preventDefault();
        }
      },
      [r, o, m.paused],
    );
    return l.jsx(Vn.div, { tabIndex: -1, ...s, ref: v, onKeyDown: h });
  });
function ir(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (e) => {
        const t = 'INPUT' === e.tagName && 'hidden' === e.type;
        return e.disabled || e.hidden || t
          ? NodeFilter.FILTER_SKIP
          : e.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function sr(e, t) {
  for (const n of e) if (!lr(n, { upTo: t })) return n;
}
function lr(e, { upTo: t }) {
  if ('hidden' === getComputedStyle(e).visibility) return !0;
  for (; e; ) {
    if (void 0 !== t && e === t) return !1;
    if ('none' === getComputedStyle(e).display) return !0;
    e = e.parentElement;
  }
  return !1;
}
function cr(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }),
      e !== n &&
        (function (e) {
          return e instanceof HTMLInputElement && 'select' in e;
        })(e) &&
        t &&
        e.select();
  }
}
ar.displayName = 'FocusScope';
var ur = (function () {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (null == n || n.pause()), (e = dr(e, t)), e.unshift(t);
    },
    remove(t) {
      var n;
      (e = dr(e, t)), null == (n = e[0]) || n.resume();
    },
  };
})();
function dr(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return -1 !== r && n.splice(r, 1), n;
}
var fr = Boolean(null == globalThis ? void 0 : globalThis.document) ? e.useLayoutEffect : () => {},
  pr = a['useId'.toString()] || (() => {}),
  vr = 0;
var mr = e.forwardRef((e, t) => {
  const { children: n, width: r = 10, height: o = 5, ...a } = e;
  return l.jsx(Vn.svg, {
    ...a,
    ref: t,
    width: r,
    height: o,
    viewBox: '0 0 30 10',
    preserveAspectRatio: 'none',
    children: e.asChild ? n : l.jsx('polygon', { points: '0,0 30,0 15,10' }),
  });
});
mr.displayName = 'Arrow';
var hr = mr;
var wr = 'Popper',
  [gr, Er] = On(wr),
  [br, yr] = gr(wr),
  Cr = (t) => {
    const { __scopePopper: n, children: r } = t,
      [o, a] = e.useState(null);
    return l.jsx(br, { scope: n, anchor: o, onAnchorChange: a, children: r });
  };
Cr.displayName = wr;
var xr = 'PopperAnchor',
  Rr = e.forwardRef((t, n) => {
    const { __scopePopper: r, virtualRef: o, ...a } = t,
      i = yr(xr, r),
      s = e.useRef(null),
      c = An(n, s);
    return (
      e.useEffect(() => {
        i.onAnchorChange((null == o ? void 0 : o.current) || s.current);
      }),
      o ? null : l.jsx(Vn.div, { ...a, ref: c })
    );
  });
Rr.displayName = xr;
var _r = 'PopperContent',
  [Sr, Dr] = gr(_r),
  Pr = e.forwardRef((t, n) => {
    var r, o, a, i, s, g;
    const {
        __scopePopper: E,
        side: b = 'bottom',
        sideOffset: y = 0,
        align: C = 'center',
        alignOffset: x = 0,
        arrowPadding: R = 0,
        avoidCollisions: _ = !0,
        collisionBoundary: S = [],
        collisionPadding: D = 0,
        sticky: P = 'partial',
        hideWhenDetached: T = !1,
        updatePositionStrategy: M = 'optimized',
        onPlaced: O,
        ...k
      } = t,
      I = yr(_r, E),
      [A, L] = e.useState(null),
      N = An(n, (e) => L(e)),
      [F, j] = e.useState(null),
      K = (function (t) {
        const [n, r] = e.useState(void 0);
        return (
          fr(() => {
            if (t) {
              r({ width: t.offsetWidth, height: t.offsetHeight });
              const e = new ResizeObserver((e) => {
                if (!Array.isArray(e)) return;
                if (!e.length) return;
                const n = e[0];
                let o, a;
                if ('borderBoxSize' in n) {
                  const e = n.borderBoxSize,
                    t = Array.isArray(e) ? e[0] : e;
                  (o = t.inlineSize), (a = t.blockSize);
                } else (o = t.offsetWidth), (a = t.offsetHeight);
                r({ width: o, height: a });
              });
              return e.observe(t, { box: 'border-box' }), () => e.unobserve(t);
            }
            r(void 0);
          }, [t]),
          n
        );
      })(F),
      $ = (null == K ? void 0 : K.width) ?? 0,
      B = (null == K ? void 0 : K.height) ?? 0,
      H = b + ('center' !== C ? '-' + C : ''),
      V = 'number' == typeof D ? D : { top: 0, right: 0, bottom: 0, left: 0, ...D },
      W = Array.isArray(S) ? S : [S],
      U = W.length > 0,
      z = { padding: V, boundary: W.filter(kr), altBoundary: U },
      {
        refs: G,
        floatingStyles: q,
        placement: X,
        isPositioned: Z,
        middlewareData: Y,
      } = c({
        strategy: 'fixed',
        placement: H,
        whileElementsMounted: (...e) => w(...e, { animationFrame: 'always' === M }),
        elements: { reference: I.anchor },
        middleware: [
          u({ mainAxis: y + B, alignmentAxis: x }),
          _ && d({ mainAxis: !0, crossAxis: !1, limiter: 'partial' === P ? h() : void 0, ...z }),
          _ && f({ ...z }),
          p({
            ...z,
            apply: ({ elements: e, rects: t, availableWidth: n, availableHeight: r }) => {
              const { width: o, height: a } = t.reference,
                i = e.floating.style;
              i.setProperty('--radix-popper-available-width', `${n}px`),
                i.setProperty('--radix-popper-available-height', `${r}px`),
                i.setProperty('--radix-popper-anchor-width', `${o}px`),
                i.setProperty('--radix-popper-anchor-height', `${a}px`);
            },
          }),
          F && v({ element: F, padding: R }),
          Ir({ arrowWidth: $, arrowHeight: B }),
          T && m({ strategy: 'referenceHidden', ...z }),
        ],
      }),
      [J, Q] = Ar(X),
      ee = Un(O);
    fr(() => {
      Z && (null == ee || ee());
    }, [Z, ee]);
    const te = null == (r = Y.arrow) ? void 0 : r.x,
      ne = null == (o = Y.arrow) ? void 0 : o.y,
      re = 0 !== (null == (a = Y.arrow) ? void 0 : a.centerOffset),
      [oe, ae] = e.useState();
    return (
      fr(() => {
        A && ae(window.getComputedStyle(A).zIndex);
      }, [A]),
      l.jsx('div', {
        ref: G.setFloating,
        'data-radix-popper-content-wrapper': '',
        style: {
          ...q,
          transform: Z ? q.transform : 'translate(0, -200%)',
          minWidth: 'max-content',
          zIndex: oe,
          '--radix-popper-transform-origin': [
            null == (i = Y.transformOrigin) ? void 0 : i.x,
            null == (s = Y.transformOrigin) ? void 0 : s.y,
          ].join(' '),
          ...((null == (g = Y.hide) ? void 0 : g.referenceHidden) && {
            visibility: 'hidden',
            pointerEvents: 'none',
          }),
        },
        dir: t.dir,
        children: l.jsx(Sr, {
          scope: E,
          placedSide: J,
          onArrowChange: j,
          arrowX: te,
          arrowY: ne,
          shouldHideArrow: re,
          children: l.jsx(Vn.div, {
            'data-side': J,
            'data-align': Q,
            ...k,
            ref: N,
            style: { ...k.style, animation: Z ? void 0 : 'none' },
          }),
        }),
      })
    );
  });
Pr.displayName = _r;
var Tr = 'PopperArrow',
  Mr = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' },
  Or = e.forwardRef(function (e, t) {
    const { __scopePopper: n, ...r } = e,
      o = Dr(Tr, n),
      a = Mr[o.placedSide];
    return l.jsx('span', {
      ref: o.onArrowChange,
      style: {
        position: 'absolute',
        left: o.arrowX,
        top: o.arrowY,
        [a]: 0,
        transformOrigin: { top: '', right: '0 0', bottom: 'center 0', left: '100% 0' }[
          o.placedSide
        ],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: 'rotate(180deg)',
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[o.placedSide],
        visibility: o.shouldHideArrow ? 'hidden' : void 0,
      },
      children: l.jsx(hr, { ...r, ref: t, style: { ...r.style, display: 'block' } }),
    });
  });
function kr(e) {
  return null !== e;
}
Or.displayName = Tr;
var Ir = (e) => ({
  name: 'transformOrigin',
  options: e,
  fn(t) {
    var n, r, o;
    const { placement: a, rects: i, middlewareData: s } = t,
      l = 0 !== (null == (n = s.arrow) ? void 0 : n.centerOffset),
      c = l ? 0 : e.arrowWidth,
      u = l ? 0 : e.arrowHeight,
      [d, f] = Ar(a),
      p = { start: '0%', center: '50%', end: '100%' }[f],
      v = ((null == (r = s.arrow) ? void 0 : r.x) ?? 0) + c / 2,
      m = ((null == (o = s.arrow) ? void 0 : o.y) ?? 0) + u / 2;
    let h = '',
      w = '';
    return (
      'bottom' === d
        ? ((h = l ? p : `${v}px`), (w = -u + 'px'))
        : 'top' === d
          ? ((h = l ? p : `${v}px`), (w = `${i.floating.height + u}px`))
          : 'right' === d
            ? ((h = -u + 'px'), (w = l ? p : `${m}px`))
            : 'left' === d && ((h = `${i.floating.width + u}px`), (w = l ? p : `${m}px`)),
      { data: { x: h, y: w } }
    );
  },
});
function Ar(e) {
  const [t, n = 'center'] = e.split('-');
  return [t, n];
}
var Lr = Cr,
  Nr = Rr,
  Fr = Pr,
  jr = Or,
  Kr = e.forwardRef((t, n) => {
    var r;
    const { container: a, ...i } = t,
      [s, c] = e.useState(!1);
    fr(() => c(!0), []);
    const u =
      a ||
      (s && (null == (r = null == globalThis ? void 0 : globalThis.document) ? void 0 : r.body));
    return u ? o.createPortal(l.jsx(Vn.div, { ...i, ref: n }), u) : null;
  });
Kr.displayName = 'Portal';
var $r = (t) => {
  const { present: n, children: o } = t,
    a = (function (t) {
      const [n, o] = e.useState(),
        a = e.useRef({}),
        i = e.useRef(t),
        s = e.useRef('none'),
        l = t ? 'mounted' : 'unmounted',
        [c, u] = (function (t, n) {
          return e.useReducer((e, t) => n[e][t] ?? e, t);
        })(l, {
          mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
          unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
          unmounted: { MOUNT: 'mounted' },
        });
      return (
        e.useEffect(() => {
          const e = Br(a.current);
          s.current = 'mounted' === c ? e : 'none';
        }, [c]),
        fr(() => {
          const e = a.current,
            n = i.current;
          if (n !== t) {
            const r = s.current,
              o = Br(e);
            if (t) u('MOUNT');
            else if ('none' === o || 'none' === (null == e ? void 0 : e.display)) u('UNMOUNT');
            else {
              u(n && r !== o ? 'ANIMATION_OUT' : 'UNMOUNT');
            }
            i.current = t;
          }
        }, [t, u]),
        fr(() => {
          if (n) {
            const e = (e) => {
                const t = Br(a.current).includes(e.animationName);
                e.target === n && t && r.flushSync(() => u('ANIMATION_END'));
              },
              t = (e) => {
                e.target === n && (s.current = Br(a.current));
              };
            return (
              n.addEventListener('animationstart', t),
              n.addEventListener('animationcancel', e),
              n.addEventListener('animationend', e),
              () => {
                n.removeEventListener('animationstart', t),
                  n.removeEventListener('animationcancel', e),
                  n.removeEventListener('animationend', e);
              }
            );
          }
          u('ANIMATION_END');
        }, [n, u]),
        {
          isPresent: ['mounted', 'unmountSuspended'].includes(c),
          ref: e.useCallback((e) => {
            e && (a.current = getComputedStyle(e)), o(e);
          }, []),
        }
      );
    })(n),
    i = 'function' == typeof o ? o({ present: a.isPresent }) : e.Children.only(o),
    s = An(
      a.ref,
      (function (e) {
        var t, n;
        let r = null == (t = Object.getOwnPropertyDescriptor(e.props, 'ref')) ? void 0 : t.get,
          o = r && 'isReactWarning' in r && r.isReactWarning;
        if (o) return e.ref;
        if (
          ((r = null == (n = Object.getOwnPropertyDescriptor(e, 'ref')) ? void 0 : n.get),
          (o = r && 'isReactWarning' in r && r.isReactWarning),
          o)
        )
          return e.props.ref;
        return e.props.ref || e.ref;
      })(i),
    );
  return 'function' == typeof o || a.isPresent ? e.cloneElement(i, { ref: s }) : null;
};
function Br(e) {
  return (null == e ? void 0 : e.animationName) || 'none';
}
function Hr({ prop: t, defaultProp: n, onChange: r = () => {} }) {
  const [o, a] = (function ({ defaultProp: t, onChange: n }) {
      const r = e.useState(t),
        [o] = r,
        a = e.useRef(o),
        i = Un(n);
      return (
        e.useEffect(() => {
          a.current !== o && (i(o), (a.current = o));
        }, [o, a, i]),
        r
      );
    })({ defaultProp: n, onChange: r }),
    i = void 0 !== t,
    s = i ? t : o,
    l = Un(r);
  return [
    s,
    e.useCallback(
      (e) => {
        if (i) {
          const n = 'function' == typeof e ? e(t) : e;
          n !== t && l(n);
        } else a(e);
      },
      [i, t, a, l],
    ),
  ];
}
$r.displayName = 'Presence';
var Vr = 'rovingFocusGroup.onEntryFocus',
  Wr = { bubbles: !1, cancelable: !0 },
  Ur = 'RovingFocusGroup',
  [zr, Gr, qr] = $n(Ur),
  [Xr, Zr] = On(Ur, [qr]),
  [Yr, Jr] = Xr(Ur),
  Qr = e.forwardRef((e, t) =>
    l.jsx(zr.Provider, {
      scope: e.__scopeRovingFocusGroup,
      children: l.jsx(zr.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: l.jsx(eo, { ...e, ref: t }),
      }),
    }),
  );
Qr.displayName = Ur;
var eo = e.forwardRef((t, n) => {
    const {
        __scopeRovingFocusGroup: r,
        orientation: o,
        loop: a = !1,
        dir: i,
        currentTabStopId: s,
        defaultCurrentTabStopId: c,
        onCurrentTabStopIdChange: u,
        onEntryFocus: d,
        preventScrollOnEntryFocus: f = !1,
        ...p
      } = t,
      v = e.useRef(null),
      m = An(n, v),
      h = Hn(i),
      [w = null, g] = Hr({ prop: s, defaultProp: c, onChange: u }),
      [E, b] = e.useState(!1),
      y = Un(d),
      C = Gr(r),
      x = e.useRef(!1),
      [R, _] = e.useState(0);
    return (
      e.useEffect(() => {
        const e = v.current;
        if (e) return e.addEventListener(Vr, y), () => e.removeEventListener(Vr, y);
      }, [y]),
      l.jsx(Yr, {
        scope: r,
        orientation: o,
        dir: h,
        loop: a,
        currentTabStopId: w,
        onItemFocus: e.useCallback((e) => g(e), [g]),
        onItemShiftTab: e.useCallback(() => b(!0), []),
        onFocusableItemAdd: e.useCallback(() => _((e) => e + 1), []),
        onFocusableItemRemove: e.useCallback(() => _((e) => e - 1), []),
        children: l.jsx(Vn.div, {
          tabIndex: E || 0 === R ? -1 : 0,
          'data-orientation': o,
          ...p,
          ref: m,
          style: { outline: 'none', ...t.style },
          onMouseDown: Mn(t.onMouseDown, () => {
            x.current = !0;
          }),
          onFocus: Mn(t.onFocus, (e) => {
            const t = !x.current;
            if (e.target === e.currentTarget && t && !E) {
              const t = new CustomEvent(Vr, Wr);
              if ((e.currentTarget.dispatchEvent(t), !t.defaultPrevented)) {
                const e = C().filter((e) => e.focusable);
                oo(
                  [e.find((e) => e.active), e.find((e) => e.id === w), ...e]
                    .filter(Boolean)
                    .map((e) => e.ref.current),
                  f,
                );
              }
            }
            x.current = !1;
          }),
          onBlur: Mn(t.onBlur, () => b(!1)),
        }),
      })
    );
  }),
  to = 'RovingFocusGroupItem',
  no = e.forwardRef((t, n) => {
    const { __scopeRovingFocusGroup: r, focusable: o = !0, active: a = !1, tabStopId: i, ...s } = t,
      c = (function (t) {
        const [n, r] = e.useState(pr());
        return (
          fr(() => {
            r((e) => e ?? String(vr++));
          }, [t]),
          n ? `radix-${n}` : ''
        );
      })(),
      u = i || c,
      d = Jr(to, r),
      f = d.currentTabStopId === u,
      p = Gr(r),
      { onFocusableItemAdd: v, onFocusableItemRemove: m } = d;
    return (
      e.useEffect(() => {
        if (o) return v(), () => m();
      }, [o, v, m]),
      l.jsx(zr.ItemSlot, {
        scope: r,
        id: u,
        focusable: o,
        active: a,
        children: l.jsx(Vn.span, {
          tabIndex: f ? 0 : -1,
          'data-orientation': d.orientation,
          ...s,
          ref: n,
          onMouseDown: Mn(t.onMouseDown, (e) => {
            o ? d.onItemFocus(u) : e.preventDefault();
          }),
          onFocus: Mn(t.onFocus, () => d.onItemFocus(u)),
          onKeyDown: Mn(t.onKeyDown, (e) => {
            if ('Tab' === e.key && e.shiftKey) return void d.onItemShiftTab();
            if (e.target !== e.currentTarget) return;
            const t = (function (e, t, n) {
              const r = (function (e, t) {
                return 'rtl' !== t
                  ? e
                  : 'ArrowLeft' === e
                    ? 'ArrowRight'
                    : 'ArrowRight' === e
                      ? 'ArrowLeft'
                      : e;
              })(e.key, n);
              return ('vertical' === t && ['ArrowLeft', 'ArrowRight'].includes(r)) ||
                ('horizontal' === t && ['ArrowUp', 'ArrowDown'].includes(r))
                ? void 0
                : ro[r];
            })(e, d.orientation, d.dir);
            if (void 0 !== t) {
              if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
              e.preventDefault();
              let o = p()
                .filter((e) => e.focusable)
                .map((e) => e.ref.current);
              if ('last' === t) o.reverse();
              else if ('prev' === t || 'next' === t) {
                'prev' === t && o.reverse();
                const a = o.indexOf(e.currentTarget);
                o = d.loop
                  ? ((r = a + 1), (n = o).map((e, t) => n[(r + t) % n.length]))
                  : o.slice(a + 1);
              }
              setTimeout(() => oo(o));
            }
            var n, r;
          }),
        }),
      })
    );
  });
no.displayName = to;
var ro = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
};
function oo(e, t = !1) {
  const n = document.activeElement;
  for (const r of e) {
    if (r === n) return;
    if ((r.focus({ preventScroll: t }), document.activeElement !== n)) return;
  }
}
var ao = Qr,
  io = no,
  so = ['Enter', ' '],
  lo = ['ArrowUp', 'PageDown', 'End'],
  co = ['ArrowDown', 'PageUp', 'Home', ...lo],
  uo = { ltr: [...so, 'ArrowRight'], rtl: [...so, 'ArrowLeft'] },
  fo = { ltr: ['ArrowLeft'], rtl: ['ArrowRight'] },
  po = 'Menu',
  [vo, mo, ho] = $n(po),
  [wo, go] = On(po, [ho, Er, Zr]),
  Eo = Er(),
  bo = Zr(),
  [yo, Co] = wo(po),
  [xo, Ro] = wo(po),
  _o = (t) => {
    const { __scopeMenu: n, open: r = !1, children: o, dir: a, onOpenChange: i, modal: s = !0 } = t,
      c = Eo(n),
      [u, d] = e.useState(null),
      f = e.useRef(!1),
      p = Un(i),
      v = Hn(a);
    return (
      e.useEffect(() => {
        const e = () => {
            (f.current = !0),
              document.addEventListener('pointerdown', t, { capture: !0, once: !0 }),
              document.addEventListener('pointermove', t, { capture: !0, once: !0 });
          },
          t = () => (f.current = !1);
        return (
          document.addEventListener('keydown', e, { capture: !0 }),
          () => {
            document.removeEventListener('keydown', e, { capture: !0 }),
              document.removeEventListener('pointerdown', t, { capture: !0 }),
              document.removeEventListener('pointermove', t, { capture: !0 });
          }
        );
      }, []),
      l.jsx(Lr, {
        ...c,
        children: l.jsx(yo, {
          scope: n,
          open: r,
          onOpenChange: p,
          content: u,
          onContentChange: d,
          children: l.jsx(xo, {
            scope: n,
            onClose: e.useCallback(() => p(!1), [p]),
            isUsingKeyboardRef: f,
            dir: v,
            modal: s,
            children: o,
          }),
        }),
      })
    );
  };
_o.displayName = po;
var So = e.forwardRef((e, t) => {
  const { __scopeMenu: n, ...r } = e,
    o = Eo(n);
  return l.jsx(Nr, { ...o, ...r, ref: t });
});
So.displayName = 'MenuAnchor';
var Do = 'MenuPortal',
  [Po, To] = wo(Do, { forceMount: void 0 }),
  Mo = (e) => {
    const { __scopeMenu: t, forceMount: n, children: r, container: o } = e,
      a = Co(Do, t);
    return l.jsx(Po, {
      scope: t,
      forceMount: n,
      children: l.jsx($r, {
        present: n || a.open,
        children: l.jsx(Kr, { asChild: !0, container: o, children: r }),
      }),
    });
  };
Mo.displayName = Do;
var Oo = 'MenuContent',
  [ko, Io] = wo(Oo),
  Ao = e.forwardRef((e, t) => {
    const n = To(Oo, e.__scopeMenu),
      { forceMount: r = n.forceMount, ...o } = e,
      a = Co(Oo, e.__scopeMenu),
      i = Ro(Oo, e.__scopeMenu);
    return l.jsx(vo.Provider, {
      scope: e.__scopeMenu,
      children: l.jsx($r, {
        present: r || a.open,
        children: l.jsx(vo.Slot, {
          scope: e.__scopeMenu,
          children: i.modal ? l.jsx(Lo, { ...o, ref: t }) : l.jsx(No, { ...o, ref: t }),
        }),
      }),
    });
  }),
  Lo = e.forwardRef((t, n) => {
    const r = Co(Oo, t.__scopeMenu),
      o = e.useRef(null),
      a = An(n, o);
    return (
      e.useEffect(() => {
        const e = o.current;
        if (e) return s(e);
      }, []),
      l.jsx(Fo, {
        ...t,
        ref: a,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        disableOutsideScroll: !0,
        onFocusOutside: Mn(t.onFocusOutside, (e) => e.preventDefault(), {
          checkForDefaultPrevented: !1,
        }),
        onDismiss: () => r.onOpenChange(!1),
      })
    );
  }),
  No = e.forwardRef((e, t) => {
    const n = Co(Oo, e.__scopeMenu);
    return l.jsx(Fo, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      disableOutsideScroll: !1,
      onDismiss: () => n.onOpenChange(!1),
    });
  }),
  Fo = e.forwardRef((t, n) => {
    const {
        __scopeMenu: r,
        loop: o = !1,
        trapFocus: a,
        onOpenAutoFocus: s,
        onCloseAutoFocus: c,
        disableOutsidePointerEvents: u,
        onEntryFocus: d,
        onEscapeKeyDown: f,
        onPointerDownOutside: p,
        onFocusOutside: v,
        onInteractOutside: m,
        onDismiss: h,
        disableOutsideScroll: w,
        ...g
      } = t,
      E = Co(Oo, r),
      b = Ro(Oo, r),
      y = Eo(r),
      C = bo(r),
      x = mo(r),
      [R, _] = e.useState(null),
      S = e.useRef(null),
      D = An(n, S, E.onContentChange),
      P = e.useRef(0),
      T = e.useRef(''),
      M = e.useRef(0),
      O = e.useRef(null),
      k = e.useRef('right'),
      I = e.useRef(0),
      A = w ? i : e.Fragment,
      L = w ? { as: Ln, allowPinchZoom: !0 } : void 0,
      N = (e) => {
        var t, n;
        const r = T.current + e,
          o = x().filter((e) => !e.disabled),
          a = document.activeElement,
          i = null == (t = o.find((e) => e.ref.current === a)) ? void 0 : t.textValue,
          s = (function (e, t, n) {
            const r = t.length > 1 && Array.from(t).every((e) => e === t[0]),
              o = r ? t[0] : t,
              a = n ? e.indexOf(n) : -1;
            let i = ((s = e), (l = Math.max(a, 0)), s.map((e, t) => s[(l + t) % s.length]));
            var s, l;
            1 === o.length && (i = i.filter((e) => e !== n));
            const c = i.find((e) => e.toLowerCase().startsWith(o.toLowerCase()));
            return c !== n ? c : void 0;
          })(
            o.map((e) => e.textValue),
            r,
            i,
          ),
          l = null == (n = o.find((e) => e.textValue === s)) ? void 0 : n.ref.current;
        !(function e(t) {
          (T.current = t),
            window.clearTimeout(P.current),
            '' !== t && (P.current = window.setTimeout(() => e(''), 1e3));
        })(r),
          l && setTimeout(() => l.focus());
      };
    e.useEffect(() => () => window.clearTimeout(P.current), []),
      e.useEffect(() => {
        const e = document.querySelectorAll('[data-radix-focus-guard]');
        return (
          document.body.insertAdjacentElement('afterbegin', e[0] ?? tr()),
          document.body.insertAdjacentElement('beforeend', e[1] ?? tr()),
          er++,
          () => {
            1 === er &&
              document.querySelectorAll('[data-radix-focus-guard]').forEach((e) => e.remove()),
              er--;
          }
        );
      }, []);
    const F = e.useCallback((e) => {
      var t, n;
      return (
        k.current === (null == (t = O.current) ? void 0 : t.side) &&
        (function (e, t) {
          if (!t) return !1;
          const n = { x: e.clientX, y: e.clientY };
          return (function (e, t) {
            const { x: n, y: r } = e;
            let o = !1;
            for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
              const e = t[a].x,
                s = t[a].y,
                l = t[i].x,
                c = t[i].y;
              s > r != c > r && n < ((l - e) * (r - s)) / (c - s) + e && (o = !o);
            }
            return o;
          })(n, t);
        })(e, null == (n = O.current) ? void 0 : n.area)
      );
    }, []);
    return l.jsx(ko, {
      scope: r,
      searchRef: T,
      onItemEnter: e.useCallback(
        (e) => {
          F(e) && e.preventDefault();
        },
        [F],
      ),
      onItemLeave: e.useCallback(
        (e) => {
          var t;
          F(e) || (null == (t = S.current) || t.focus(), _(null));
        },
        [F],
      ),
      onTriggerLeave: e.useCallback(
        (e) => {
          F(e) && e.preventDefault();
        },
        [F],
      ),
      pointerGraceTimerRef: M,
      onPointerGraceIntentChange: e.useCallback((e) => {
        O.current = e;
      }, []),
      children: l.jsx(A, {
        ...L,
        children: l.jsx(ar, {
          asChild: !0,
          trapped: a,
          onMountAutoFocus: Mn(s, (e) => {
            var t;
            e.preventDefault(), null == (t = S.current) || t.focus({ preventScroll: !0 });
          }),
          onUnmountAutoFocus: c,
          children: l.jsx(Yn, {
            asChild: !0,
            disableOutsidePointerEvents: u,
            onEscapeKeyDown: f,
            onPointerDownOutside: p,
            onFocusOutside: v,
            onInteractOutside: m,
            onDismiss: h,
            children: l.jsx(ao, {
              asChild: !0,
              ...C,
              dir: b.dir,
              orientation: 'vertical',
              loop: o,
              currentTabStopId: R,
              onCurrentTabStopIdChange: _,
              onEntryFocus: Mn(d, (e) => {
                b.isUsingKeyboardRef.current || e.preventDefault();
              }),
              preventScrollOnEntryFocus: !0,
              children: l.jsx(Fr, {
                role: 'menu',
                'aria-orientation': 'vertical',
                'data-state': ca(E.open),
                'data-radix-menu-content': '',
                dir: b.dir,
                ...y,
                ...g,
                ref: D,
                style: { outline: 'none', ...g.style },
                onKeyDown: Mn(g.onKeyDown, (e) => {
                  const t = e.target.closest('[data-radix-menu-content]') === e.currentTarget,
                    n = e.ctrlKey || e.altKey || e.metaKey,
                    r = 1 === e.key.length;
                  t && ('Tab' === e.key && e.preventDefault(), !n && r && N(e.key));
                  const o = S.current;
                  if (e.target !== o) return;
                  if (!co.includes(e.key)) return;
                  e.preventDefault();
                  const a = x()
                    .filter((e) => !e.disabled)
                    .map((e) => e.ref.current);
                  lo.includes(e.key) && a.reverse(),
                    (function (e) {
                      const t = document.activeElement;
                      for (const n of e) {
                        if (n === t) return;
                        if ((n.focus(), document.activeElement !== t)) return;
                      }
                    })(a);
                }),
                onBlur: Mn(t.onBlur, (e) => {
                  e.currentTarget.contains(e.target) ||
                    (window.clearTimeout(P.current), (T.current = ''));
                }),
                onPointerMove: Mn(
                  t.onPointerMove,
                  fa((e) => {
                    const t = e.target,
                      n = I.current !== e.clientX;
                    if (e.currentTarget.contains(t) && n) {
                      const t = e.clientX > I.current ? 'right' : 'left';
                      (k.current = t), (I.current = e.clientX);
                    }
                  }),
                ),
              }),
            }),
          }),
        }),
      }),
    });
  });
Ao.displayName = Oo;
var jo = e.forwardRef((e, t) => {
  const { __scopeMenu: n, ...r } = e;
  return l.jsx(Vn.div, { role: 'group', ...r, ref: t });
});
jo.displayName = 'MenuGroup';
var Ko = e.forwardRef((e, t) => {
  const { __scopeMenu: n, ...r } = e;
  return l.jsx(Vn.div, { ...r, ref: t });
});
Ko.displayName = 'MenuLabel';
var $o = 'MenuItem',
  Bo = 'menu.itemSelect',
  Ho = e.forwardRef((t, n) => {
    const { disabled: r = !1, onSelect: o, ...a } = t,
      i = e.useRef(null),
      s = Ro($o, t.__scopeMenu),
      c = Io($o, t.__scopeMenu),
      u = An(n, i),
      d = e.useRef(!1);
    return l.jsx(Vo, {
      ...a,
      ref: u,
      disabled: r,
      onClick: Mn(t.onClick, () => {
        const e = i.current;
        if (!r && e) {
          const t = new CustomEvent(Bo, { bubbles: !0, cancelable: !0 });
          e.addEventListener(Bo, (e) => (null == o ? void 0 : o(e)), { once: !0 }),
            Wn(e, t),
            t.defaultPrevented ? (d.current = !1) : s.onClose();
        }
      }),
      onPointerDown: (e) => {
        var n;
        null == (n = t.onPointerDown) || n.call(t, e), (d.current = !0);
      },
      onPointerUp: Mn(t.onPointerUp, (e) => {
        var t;
        d.current || null == (t = e.currentTarget) || t.click();
      }),
      onKeyDown: Mn(t.onKeyDown, (e) => {
        const t = '' !== c.searchRef.current;
        r ||
          (t && ' ' === e.key) ||
          (so.includes(e.key) && (e.currentTarget.click(), e.preventDefault()));
      }),
    });
  });
Ho.displayName = $o;
var Vo = e.forwardRef((t, n) => {
    const { __scopeMenu: r, disabled: o = !1, textValue: a, ...i } = t,
      s = Io($o, r),
      c = bo(r),
      u = e.useRef(null),
      d = An(n, u),
      [f, p] = e.useState(!1),
      [v, m] = e.useState('');
    return (
      e.useEffect(() => {
        const e = u.current;
        e && m((e.textContent ?? '').trim());
      }, [i.children]),
      l.jsx(vo.ItemSlot, {
        scope: r,
        disabled: o,
        textValue: a ?? v,
        children: l.jsx(io, {
          asChild: !0,
          ...c,
          focusable: !o,
          children: l.jsx(Vn.div, {
            role: 'menuitem',
            'data-highlighted': f ? '' : void 0,
            'aria-disabled': o || void 0,
            'data-disabled': o ? '' : void 0,
            ...i,
            ref: d,
            onPointerMove: Mn(
              t.onPointerMove,
              fa((e) => {
                if (o) s.onItemLeave(e);
                else if ((s.onItemEnter(e), !e.defaultPrevented)) {
                  e.currentTarget.focus({ preventScroll: !0 });
                }
              }),
            ),
            onPointerLeave: Mn(
              t.onPointerLeave,
              fa((e) => s.onItemLeave(e)),
            ),
            onFocus: Mn(t.onFocus, () => p(!0)),
            onBlur: Mn(t.onBlur, () => p(!1)),
          }),
        }),
      })
    );
  }),
  Wo = e.forwardRef((e, t) => {
    const { checked: n = !1, onCheckedChange: r, ...o } = e;
    return l.jsx(Jo, {
      scope: e.__scopeMenu,
      checked: n,
      children: l.jsx(Ho, {
        role: 'menuitemcheckbox',
        'aria-checked': ua(n) ? 'mixed' : n,
        ...o,
        ref: t,
        'data-state': da(n),
        onSelect: Mn(o.onSelect, () => (null == r ? void 0 : r(!!ua(n) || !n)), {
          checkForDefaultPrevented: !1,
        }),
      }),
    });
  });
Wo.displayName = 'MenuCheckboxItem';
var Uo = 'MenuRadioGroup',
  [zo, Go] = wo(Uo, { value: void 0, onValueChange: () => {} }),
  qo = e.forwardRef((e, t) => {
    const { value: n, onValueChange: r, ...o } = e,
      a = Un(r);
    return l.jsx(zo, {
      scope: e.__scopeMenu,
      value: n,
      onValueChange: a,
      children: l.jsx(jo, { ...o, ref: t }),
    });
  });
qo.displayName = Uo;
var Xo = 'MenuRadioItem',
  Zo = e.forwardRef((e, t) => {
    const { value: n, ...r } = e,
      o = Go(Xo, e.__scopeMenu),
      a = n === o.value;
    return l.jsx(Jo, {
      scope: e.__scopeMenu,
      checked: a,
      children: l.jsx(Ho, {
        role: 'menuitemradio',
        'aria-checked': a,
        ...r,
        ref: t,
        'data-state': da(a),
        onSelect: Mn(
          r.onSelect,
          () => {
            var e;
            return null == (e = o.onValueChange) ? void 0 : e.call(o, n);
          },
          { checkForDefaultPrevented: !1 },
        ),
      }),
    });
  });
Zo.displayName = Xo;
var Yo = 'MenuItemIndicator',
  [Jo, Qo] = wo(Yo, { checked: !1 }),
  ea = e.forwardRef((e, t) => {
    const { __scopeMenu: n, forceMount: r, ...o } = e,
      a = Qo(Yo, n);
    return l.jsx($r, {
      present: r || ua(a.checked) || !0 === a.checked,
      children: l.jsx(Vn.span, { ...o, ref: t, 'data-state': da(a.checked) }),
    });
  });
ea.displayName = Yo;
var ta = e.forwardRef((e, t) => {
  const { __scopeMenu: n, ...r } = e;
  return l.jsx(Vn.div, { role: 'separator', 'aria-orientation': 'horizontal', ...r, ref: t });
});
ta.displayName = 'MenuSeparator';
var na = e.forwardRef((e, t) => {
  const { __scopeMenu: n, ...r } = e,
    o = Eo(n);
  return l.jsx(jr, { ...o, ...r, ref: t });
});
na.displayName = 'MenuArrow';
var [ra, oa] = wo('MenuSub'),
  aa = 'MenuSubTrigger',
  ia = e.forwardRef((t, n) => {
    const r = Co(aa, t.__scopeMenu),
      o = Ro(aa, t.__scopeMenu),
      a = oa(aa, t.__scopeMenu),
      i = Io(aa, t.__scopeMenu),
      s = e.useRef(null),
      { pointerGraceTimerRef: c, onPointerGraceIntentChange: u } = i,
      d = { __scopeMenu: t.__scopeMenu },
      f = e.useCallback(() => {
        s.current && window.clearTimeout(s.current), (s.current = null);
      }, []);
    return (
      e.useEffect(() => f, [f]),
      e.useEffect(() => {
        const e = c.current;
        return () => {
          window.clearTimeout(e), u(null);
        };
      }, [c, u]),
      l.jsx(So, {
        asChild: !0,
        ...d,
        children: l.jsx(Vo, {
          id: a.triggerId,
          'aria-haspopup': 'menu',
          'aria-expanded': r.open,
          'aria-controls': a.contentId,
          'data-state': ca(r.open),
          ...t,
          ref: In(n, a.onTriggerChange),
          onClick: (e) => {
            var n;
            null == (n = t.onClick) || n.call(t, e),
              t.disabled ||
                e.defaultPrevented ||
                (e.currentTarget.focus(), r.open || r.onOpenChange(!0));
          },
          onPointerMove: Mn(
            t.onPointerMove,
            fa((e) => {
              i.onItemEnter(e),
                e.defaultPrevented ||
                  t.disabled ||
                  r.open ||
                  s.current ||
                  (i.onPointerGraceIntentChange(null),
                  (s.current = window.setTimeout(() => {
                    r.onOpenChange(!0), f();
                  }, 100)));
            }),
          ),
          onPointerLeave: Mn(
            t.onPointerLeave,
            fa((e) => {
              var t, n;
              f();
              const o = null == (t = r.content) ? void 0 : t.getBoundingClientRect();
              if (o) {
                const t = null == (n = r.content) ? void 0 : n.dataset.side,
                  a = 'right' === t,
                  s = a ? -5 : 5,
                  l = o[a ? 'left' : 'right'],
                  u = o[a ? 'right' : 'left'];
                i.onPointerGraceIntentChange({
                  area: [
                    { x: e.clientX + s, y: e.clientY },
                    { x: l, y: o.top },
                    { x: u, y: o.top },
                    { x: u, y: o.bottom },
                    { x: l, y: o.bottom },
                  ],
                  side: t,
                }),
                  window.clearTimeout(c.current),
                  (c.current = window.setTimeout(() => i.onPointerGraceIntentChange(null), 300));
              } else {
                if ((i.onTriggerLeave(e), e.defaultPrevented)) return;
                i.onPointerGraceIntentChange(null);
              }
            }),
          ),
          onKeyDown: Mn(t.onKeyDown, (e) => {
            var n;
            const a = '' !== i.searchRef.current;
            t.disabled ||
              (a && ' ' === e.key) ||
              (uo[o.dir].includes(e.key) &&
                (r.onOpenChange(!0), null == (n = r.content) || n.focus(), e.preventDefault()));
          }),
        }),
      })
    );
  });
ia.displayName = aa;
var sa = 'MenuSubContent',
  la = e.forwardRef((t, n) => {
    const r = To(Oo, t.__scopeMenu),
      { forceMount: o = r.forceMount, ...a } = t,
      i = Co(Oo, t.__scopeMenu),
      s = Ro(Oo, t.__scopeMenu),
      c = oa(sa, t.__scopeMenu),
      u = e.useRef(null),
      d = An(n, u);
    return l.jsx(vo.Provider, {
      scope: t.__scopeMenu,
      children: l.jsx($r, {
        present: o || i.open,
        children: l.jsx(vo.Slot, {
          scope: t.__scopeMenu,
          children: l.jsx(Fo, {
            id: c.contentId,
            'aria-labelledby': c.triggerId,
            ...a,
            ref: d,
            align: 'start',
            side: 'rtl' === s.dir ? 'left' : 'right',
            disableOutsidePointerEvents: !1,
            disableOutsideScroll: !1,
            trapFocus: !1,
            onOpenAutoFocus: (e) => {
              var t;
              s.isUsingKeyboardRef.current && (null == (t = u.current) || t.focus()),
                e.preventDefault();
            },
            onCloseAutoFocus: (e) => e.preventDefault(),
            onFocusOutside: Mn(t.onFocusOutside, (e) => {
              e.target !== c.trigger && i.onOpenChange(!1);
            }),
            onEscapeKeyDown: Mn(t.onEscapeKeyDown, (e) => {
              s.onClose(), e.preventDefault();
            }),
            onKeyDown: Mn(t.onKeyDown, (e) => {
              var t;
              const n = e.currentTarget.contains(e.target),
                r = fo[s.dir].includes(e.key);
              n &&
                r &&
                (i.onOpenChange(!1), null == (t = c.trigger) || t.focus(), e.preventDefault());
            }),
          }),
        }),
      }),
    });
  });
function ca(e) {
  return e ? 'open' : 'closed';
}
function ua(e) {
  return 'indeterminate' === e;
}
function da(e) {
  return ua(e) ? 'indeterminate' : e ? 'checked' : 'unchecked';
}
function fa(e) {
  return (t) => ('mouse' === t.pointerType ? e(t) : void 0);
}
la.displayName = sa;
var pa = _o,
  va = So,
  ma = Mo,
  ha = Ao,
  wa = jo,
  ga = Ko,
  Ea = Ho,
  ba = Wo,
  ya = qo,
  Ca = Zo,
  xa = ea,
  Ra = ta,
  _a = na,
  Sa = ia,
  Da = la,
  Pa = Boolean(null == globalThis ? void 0 : globalThis.document) ? e.useLayoutEffect : () => {},
  Ta = a['useId'.toString()] || (() => {}),
  Ma = 0;
function Oa(t) {
  const [n, r] = e.useState(Ta());
  return (
    Pa(() => {
      r((e) => e ?? String(Ma++));
    }, [t]),
    t || (n ? `radix-${n}` : '')
  );
}
var ka = 'DropdownMenu',
  [Ia, Aa] = (function (t, n = []) {
    let r = [];
    const o = () => {
      const n = r.map((t) => e.createContext(t));
      return function (r) {
        const o = (null == r ? void 0 : r[t]) || n;
        return e.useMemo(() => ({ [`__scope${t}`]: { ...r, [t]: o } }), [r, o]);
      };
    };
    return (
      (o.scopeName = t),
      [
        function (n, o) {
          const a = e.createContext(o),
            i = r.length;
          function s(n) {
            const { scope: r, children: o, ...s } = n,
              c = (null == r ? void 0 : r[t][i]) || a,
              u = e.useMemo(() => s, Object.values(s));
            return l.jsx(c.Provider, { value: u, children: o });
          }
          return (
            (r = [...r, o]),
            (s.displayName = n + 'Provider'),
            [
              s,
              function (r, s) {
                const l = (null == s ? void 0 : s[t][i]) || a,
                  c = e.useContext(l);
                if (c) return c;
                if (void 0 !== o) return o;
                throw new Error(`\`${r}\` must be used within \`${n}\``);
              },
            ]
          );
        },
        yn(o, ...n),
      ]
    );
  })(ka, [go]),
  La = go(),
  [Na, Fa] = Ia(ka),
  ja = (t) => {
    const {
        __scopeDropdownMenu: n,
        children: r,
        dir: o,
        open: a,
        defaultOpen: i,
        onOpenChange: s,
        modal: c = !0,
      } = t,
      u = La(n),
      d = e.useRef(null),
      [f = !1, p] = xn({ prop: a, defaultProp: i, onChange: s });
    return l.jsx(Na, {
      scope: n,
      triggerId: Oa(),
      triggerRef: d,
      contentId: Oa(),
      open: f,
      onOpenChange: p,
      onOpenToggle: e.useCallback(() => p((e) => !e), [p]),
      modal: c,
      children: l.jsx(pa, { ...u, open: f, onOpenChange: p, dir: o, modal: c, children: r }),
    });
  };
ja.displayName = ka;
var Ka = 'DropdownMenuTrigger',
  $a = e.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, disabled: r = !1, ...o } = e,
      a = Fa(Ka, n),
      i = La(n);
    return l.jsx(va, {
      asChild: !0,
      ...i,
      children: l.jsx(Tn.button, {
        type: 'button',
        id: a.triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': a.open,
        'aria-controls': a.open ? a.contentId : void 0,
        'data-state': a.open ? 'open' : 'closed',
        'data-disabled': r ? '' : void 0,
        disabled: r,
        ...o,
        ref: bn(t, a.triggerRef),
        onPointerDown: En(e.onPointerDown, (e) => {
          r ||
            0 !== e.button ||
            !1 !== e.ctrlKey ||
            (a.onOpenToggle(), a.open || e.preventDefault());
        }),
        onKeyDown: En(e.onKeyDown, (e) => {
          r ||
            (['Enter', ' '].includes(e.key) && a.onOpenToggle(),
            'ArrowDown' === e.key && a.onOpenChange(!0),
            ['Enter', ' ', 'ArrowDown'].includes(e.key) && e.preventDefault());
        }),
      }),
    });
  });
$a.displayName = Ka;
var Ba = (e) => {
  const { __scopeDropdownMenu: t, ...n } = e,
    r = La(t);
  return l.jsx(ma, { ...r, ...n });
};
Ba.displayName = 'DropdownMenuPortal';
var Ha = 'DropdownMenuContent',
  Va = e.forwardRef((t, n) => {
    const { __scopeDropdownMenu: r, ...o } = t,
      a = Fa(Ha, r),
      i = La(r),
      s = e.useRef(!1);
    return l.jsx(ha, {
      id: a.contentId,
      'aria-labelledby': a.triggerId,
      ...i,
      ...o,
      ref: n,
      onCloseAutoFocus: En(t.onCloseAutoFocus, (e) => {
        var t;
        s.current || null == (t = a.triggerRef.current) || t.focus(),
          (s.current = !1),
          e.preventDefault();
      }),
      onInteractOutside: En(t.onInteractOutside, (e) => {
        const t = e.detail.originalEvent,
          n = 0 === t.button && !0 === t.ctrlKey,
          r = 2 === t.button || n;
        (a.modal && !r) || (s.current = !0);
      }),
      style: {
        ...t.style,
        '--radix-dropdown-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-dropdown-menu-content-available-height': 'var(--radix-popper-available-height)',
        '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
        '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
      },
    });
  });
Va.displayName = Ha;
var Wa = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(wa, { ...o, ...r, ref: t });
});
Wa.displayName = 'DropdownMenuGroup';
var Ua = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(ga, { ...o, ...r, ref: t });
});
Ua.displayName = 'DropdownMenuLabel';
var za = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(Ea, { ...o, ...r, ref: t });
});
za.displayName = 'DropdownMenuItem';
var Ga = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(ba, { ...o, ...r, ref: t });
});
Ga.displayName = 'DropdownMenuCheckboxItem';
e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(ya, { ...o, ...r, ref: t });
}).displayName = 'DropdownMenuRadioGroup';
var qa = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(Ca, { ...o, ...r, ref: t });
});
qa.displayName = 'DropdownMenuRadioItem';
var Xa = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(xa, { ...o, ...r, ref: t });
});
Xa.displayName = 'DropdownMenuItemIndicator';
var Za = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(Ra, { ...o, ...r, ref: t });
});
Za.displayName = 'DropdownMenuSeparator';
e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(_a, { ...o, ...r, ref: t });
}).displayName = 'DropdownMenuArrow';
var Ya = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(Sa, { ...o, ...r, ref: t });
});
Ya.displayName = 'DropdownMenuSubTrigger';
var Ja = e.forwardRef((e, t) => {
  const { __scopeDropdownMenu: n, ...r } = e,
    o = La(n);
  return l.jsx(Da, {
    ...o,
    ...r,
    ref: t,
    style: {
      ...e.style,
      '--radix-dropdown-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
      '--radix-dropdown-menu-content-available-width': 'var(--radix-popper-available-width)',
      '--radix-dropdown-menu-content-available-height': 'var(--radix-popper-available-height)',
      '--radix-dropdown-menu-trigger-width': 'var(--radix-popper-anchor-width)',
      '--radix-dropdown-menu-trigger-height': 'var(--radix-popper-anchor-height)',
    },
  });
});
Ja.displayName = 'DropdownMenuSubContent';
var Qa = ja,
  ei = $a,
  ti = Ba,
  ni = Va,
  ri = Wa,
  oi = Ua,
  ai = za,
  ii = Ga,
  si = qa,
  li = Xa,
  ci = Za,
  ui = Ya,
  di = Ja;
const fi = 'Popper',
  [pi, vi] = y(fi),
  [mi, hi] = pi(fi),
  wi = e.forwardRef((n, r) => {
    const { __scopePopper: o, virtualRef: a, ...i } = n,
      s = hi('PopperAnchor', o),
      l = e.useRef(null),
      c = b(r, l);
    return (
      e.useEffect(() => {
        s.onAnchorChange((null == a ? void 0 : a.current) || l.current);
      }),
      a ? null : e.createElement(T.div, t({}, i, { ref: c }))
    );
  }),
  gi = 'PopperContent',
  [Ei, bi] = pi(gi),
  yi = e.forwardRef((n, r) => {
    var o, a, i, s, l, g, E, y;
    const {
        __scopePopper: C,
        side: x = 'bottom',
        sideOffset: R = 0,
        align: _ = 'center',
        alignOffset: S = 0,
        arrowPadding: D = 0,
        avoidCollisions: P = !0,
        collisionBoundary: M = [],
        collisionPadding: k = 0,
        sticky: I = 'partial',
        hideWhenDetached: A = !1,
        updatePositionStrategy: L = 'optimized',
        onPlaced: N,
        ...F
      } = n,
      j = hi(gi, C),
      [K, $] = e.useState(null),
      B = b(r, (e) => $(e)),
      [H, W] = e.useState(null),
      U = Bt(H),
      z = null !== (o = null == U ? void 0 : U.width) && void 0 !== o ? o : 0,
      G = null !== (a = null == U ? void 0 : U.height) && void 0 !== a ? a : 0,
      q = x + ('center' !== _ ? '-' + _ : ''),
      X = 'number' == typeof k ? k : { top: 0, right: 0, bottom: 0, left: 0, ...k },
      Z = Array.isArray(M) ? M : [M],
      Y = Z.length > 0,
      J = { padding: X, boundary: Z.filter(Ci), altBoundary: Y },
      {
        refs: Q,
        floatingStyles: ee,
        placement: te,
        isPositioned: ne,
        middlewareData: re,
      } = c({
        strategy: 'fixed',
        placement: q,
        whileElementsMounted: (...e) => w(...e, { animationFrame: 'always' === L }),
        elements: { reference: j.anchor },
        middleware: [
          u({ mainAxis: R + G, alignmentAxis: S }),
          P && d({ mainAxis: !0, crossAxis: !1, limiter: 'partial' === I ? h() : void 0, ...J }),
          P && f({ ...J }),
          p({
            ...J,
            apply: ({ elements: e, rects: t, availableWidth: n, availableHeight: r }) => {
              const { width: o, height: a } = t.reference,
                i = e.floating.style;
              i.setProperty('--radix-popper-available-width', `${n}px`),
                i.setProperty('--radix-popper-available-height', `${r}px`),
                i.setProperty('--radix-popper-anchor-width', `${o}px`),
                i.setProperty('--radix-popper-anchor-height', `${a}px`);
            },
          }),
          H && v({ element: H, padding: D }),
          xi({ arrowWidth: z, arrowHeight: G }),
          A && m({ strategy: 'referenceHidden', ...J }),
        ],
      }),
      [oe, ae] = Ri(te),
      ie = O(N);
    V(() => {
      ne && (null == ie || ie());
    }, [ne, ie]);
    const se = null === (i = re.arrow) || void 0 === i ? void 0 : i.x,
      le = null === (s = re.arrow) || void 0 === s ? void 0 : s.y,
      ce = 0 !== (null === (l = re.arrow) || void 0 === l ? void 0 : l.centerOffset),
      [ue, de] = e.useState();
    return (
      V(() => {
        K && de(window.getComputedStyle(K).zIndex);
      }, [K]),
      e.createElement(
        'div',
        {
          ref: Q.setFloating,
          'data-radix-popper-content-wrapper': '',
          style: {
            ...ee,
            transform: ne ? ee.transform : 'translate(0, -200%)',
            minWidth: 'max-content',
            zIndex: ue,
            '--radix-popper-transform-origin': [
              null === (g = re.transformOrigin) || void 0 === g ? void 0 : g.x,
              null === (E = re.transformOrigin) || void 0 === E ? void 0 : E.y,
            ].join(' '),
          },
          dir: n.dir,
        },
        e.createElement(
          Ei,
          {
            scope: C,
            placedSide: oe,
            onArrowChange: W,
            arrowX: se,
            arrowY: le,
            shouldHideArrow: ce,
          },
          e.createElement(
            T.div,
            t({ 'data-side': oe, 'data-align': ae }, F, {
              ref: B,
              style: {
                ...F.style,
                animation: ne ? void 0 : 'none',
                opacity: null !== (y = re.hide) && void 0 !== y && y.referenceHidden ? 0 : void 0,
              },
            }),
          ),
        ),
      )
    );
  });
function Ci(e) {
  return null !== e;
}
const xi = (e) => ({
  name: 'transformOrigin',
  options: e,
  fn(t) {
    var n, r, o, a, i;
    const { placement: s, rects: l, middlewareData: c } = t,
      u = 0 !== (null === (n = c.arrow) || void 0 === n ? void 0 : n.centerOffset),
      d = u ? 0 : e.arrowWidth,
      f = u ? 0 : e.arrowHeight,
      [p, v] = Ri(s),
      m = { start: '0%', center: '50%', end: '100%' }[v],
      h =
        (null !== (r = null === (o = c.arrow) || void 0 === o ? void 0 : o.x) && void 0 !== r
          ? r
          : 0) +
        d / 2,
      w =
        (null !== (a = null === (i = c.arrow) || void 0 === i ? void 0 : i.y) && void 0 !== a
          ? a
          : 0) +
        f / 2;
    let g = '',
      E = '';
    return (
      'bottom' === p
        ? ((g = u ? m : `${h}px`), (E = -f + 'px'))
        : 'top' === p
          ? ((g = u ? m : `${h}px`), (E = `${l.floating.height + f}px`))
          : 'right' === p
            ? ((g = -f + 'px'), (E = u ? m : `${w}px`))
            : 'left' === p && ((g = `${l.floating.width + f}px`), (E = u ? m : `${w}px`)),
      { data: { x: g, y: E } }
    );
  },
});
function Ri(e) {
  const [t, n = 'center'] = e.split('-');
  return [t, n];
}
const _i = (t) => {
    const { __scopePopper: n, children: r } = t,
      [o, a] = e.useState(null);
    return e.createElement(mi, { scope: n, anchor: o, onAnchorChange: a }, r);
  },
  Si = wi,
  Di = yi;
let Pi;
const Ti = 'HoverCard',
  [Mi, Oi] = y(Ti, [vi]),
  ki = vi(),
  [Ii, Ai] = Mi(Ti),
  Li = e.forwardRef((n, r) => {
    const { __scopeHoverCard: o, ...a } = n,
      i = Ai('HoverCardTrigger', o),
      s = ki(o);
    return e.createElement(
      Si,
      t({ asChild: !0 }, s),
      e.createElement(
        T.a,
        t({ 'data-state': i.open ? 'open' : 'closed' }, a, {
          ref: r,
          onPointerEnter: g(n.onPointerEnter, Hi(i.onOpen)),
          onPointerLeave: g(n.onPointerLeave, Hi(i.onClose)),
          onFocus: g(n.onFocus, i.onOpen),
          onBlur: g(n.onBlur, i.onClose),
          onTouchStart: g(n.onTouchStart, (e) => e.preventDefault()),
        }),
      ),
    );
  }),
  Ni = 'HoverCardPortal',
  [Fi, ji] = Mi(Ni, { forceMount: void 0 }),
  Ki = 'HoverCardContent',
  $i = e.forwardRef((n, r) => {
    const o = ji(Ki, n.__scopeHoverCard),
      { forceMount: a = o.forceMount, ...i } = n,
      s = Ai(Ki, n.__scopeHoverCard);
    return e.createElement(
      W,
      { present: a || s.open },
      e.createElement(
        Bi,
        t({ 'data-state': s.open ? 'open' : 'closed' }, i, {
          onPointerEnter: g(n.onPointerEnter, Hi(s.onOpen)),
          onPointerLeave: g(n.onPointerLeave, Hi(s.onClose)),
          ref: r,
        }),
      ),
    );
  }),
  Bi = e.forwardRef((n, r) => {
    const {
        __scopeHoverCard: o,
        onEscapeKeyDown: a,
        onPointerDownOutside: i,
        onFocusOutside: s,
        onInteractOutside: l,
        ...c
      } = n,
      u = Ai(Ki, o),
      d = ki(o),
      f = e.useRef(null),
      p = b(r, f),
      [v, m] = e.useState(!1);
    return (
      e.useEffect(() => {
        if (v) {
          const e = document.body;
          return (
            (Pi = e.style.userSelect || e.style.webkitUserSelect),
            (e.style.userSelect = 'none'),
            (e.style.webkitUserSelect = 'none'),
            () => {
              (e.style.userSelect = Pi), (e.style.webkitUserSelect = Pi);
            }
          );
        }
      }, [v]),
      e.useEffect(() => {
        if (f.current) {
          const e = () => {
            m(!1),
              (u.isPointerDownOnContentRef.current = !1),
              setTimeout(() => {
                var e;
                '' !==
                  (null === (e = document.getSelection()) || void 0 === e
                    ? void 0
                    : e.toString()) && (u.hasSelectionRef.current = !0);
              });
          };
          return (
            document.addEventListener('pointerup', e),
            () => {
              document.removeEventListener('pointerup', e),
                (u.hasSelectionRef.current = !1),
                (u.isPointerDownOnContentRef.current = !1);
            }
          );
        }
      }, [u.isPointerDownOnContentRef, u.hasSelectionRef]),
      e.useEffect(() => {
        if (f.current) {
          (function (e) {
            const t = [],
              n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
                acceptNode: (e) =>
                  e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
              });
            for (; n.nextNode(); ) t.push(n.currentNode);
            return t;
          })(f.current).forEach((e) => e.setAttribute('tabindex', '-1'));
        }
      }),
      e.createElement(
        F,
        {
          asChild: !0,
          disableOutsidePointerEvents: !1,
          onInteractOutside: l,
          onEscapeKeyDown: a,
          onPointerDownOutside: i,
          onFocusOutside: g(s, (e) => {
            e.preventDefault();
          }),
          onDismiss: u.onDismiss,
        },
        e.createElement(
          Di,
          t({}, d, c, {
            onPointerDown: g(c.onPointerDown, (e) => {
              e.currentTarget.contains(e.target) && m(!0),
                (u.hasSelectionRef.current = !1),
                (u.isPointerDownOnContentRef.current = !0);
            }),
            ref: p,
            style: {
              ...c.style,
              userSelect: v ? 'text' : void 0,
              WebkitUserSelect: v ? 'text' : void 0,
              '--radix-hover-card-content-transform-origin': 'var(--radix-popper-transform-origin)',
              '--radix-hover-card-content-available-width': 'var(--radix-popper-available-width)',
              '--radix-hover-card-content-available-height': 'var(--radix-popper-available-height)',
              '--radix-hover-card-trigger-width': 'var(--radix-popper-anchor-width)',
              '--radix-hover-card-trigger-height': 'var(--radix-popper-anchor-height)',
            },
          }),
        ),
      )
    );
  });
function Hi(e) {
  return (t) => ('touch' === t.pointerType ? void 0 : e());
}
const Vi = (t) => {
    const {
        __scopeHoverCard: n,
        children: r,
        open: o,
        defaultOpen: a,
        onOpenChange: i,
        openDelay: s = 700,
        closeDelay: l = 300,
      } = t,
      c = ki(n),
      u = e.useRef(0),
      d = e.useRef(0),
      f = e.useRef(!1),
      p = e.useRef(!1),
      [v = !1, m] = z({ prop: o, defaultProp: a, onChange: i }),
      h = e.useCallback(() => {
        clearTimeout(d.current), (u.current = window.setTimeout(() => m(!0), s));
      }, [s, m]),
      w = e.useCallback(() => {
        clearTimeout(u.current),
          f.current || p.current || (d.current = window.setTimeout(() => m(!1), l));
      }, [l, m]),
      g = e.useCallback(() => m(!1), [m]);
    return (
      e.useEffect(
        () => () => {
          clearTimeout(u.current), clearTimeout(d.current);
        },
        [],
      ),
      e.createElement(
        Ii,
        {
          scope: n,
          open: v,
          onOpenChange: m,
          onOpen: h,
          onClose: w,
          onDismiss: g,
          hasSelectionRef: f,
          isPointerDownOnContentRef: p,
        },
        e.createElement(_i, c, r),
      )
    );
  },
  Wi = Li,
  Ui = (t) => {
    const { __scopeHoverCard: n, forceMount: r, children: o, container: a } = t,
      i = Ai(Ni, n);
    return e.createElement(
      Fi,
      { scope: n, forceMount: r },
      e.createElement(
        W,
        { present: r || i.open },
        e.createElement(H, { asChild: !0, container: a }, o),
      ),
    );
  },
  zi = $i,
  Gi = e.forwardRef((n, r) =>
    e.createElement(
      T.label,
      t({}, n, {
        ref: r,
        onMouseDown: (e) => {
          var t;
          null === (t = n.onMouseDown) || void 0 === t || t.call(n, e),
            !e.defaultPrevented && e.detail > 1 && e.preventDefault();
        },
      }),
    ),
  );
function qi(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
const Xi = e.createContext(void 0);
function Zi(t) {
  const n = e.useContext(Xi);
  return t || n || 'ltr';
}
const Yi = ['PageUp', 'PageDown'],
  Ji = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  Qi = {
    'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
    'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
  },
  es = 'Slider',
  [ts, ns, rs] = P(es),
  [os, as] = y(es, [rs]),
  [is, ss] = os(es),
  ls = e.forwardRef((n, r) => {
    const {
        name: o,
        min: a = 0,
        max: i = 100,
        step: s = 1,
        orientation: l = 'horizontal',
        disabled: c = !1,
        minStepsBetweenThumbs: u = 0,
        defaultValue: d = [a],
        value: f,
        onValueChange: p = () => {},
        onValueCommit: v = () => {},
        inverted: m = !1,
        ...h
      } = n,
      [w, E] = e.useState(null),
      y = b(r, (e) => E(e)),
      C = e.useRef(new Set()),
      x = e.useRef(0),
      R = 'horizontal' === l,
      _ = !w || Boolean(w.closest('form')),
      S = R ? ds : fs,
      [D = [], P] = z({
        prop: f,
        defaultProp: d,
        onChange: (e) => {
          var t;
          null === (t = [...C.current][x.current]) || void 0 === t || t.focus(), p(e);
        },
      }),
      T = e.useRef(D);
    function M(e, t, { commit: n } = { commit: !1 }) {
      const r = (function (e) {
          return (String(e).split('.')[1] || '').length;
        })(s),
        o = (function (e, t) {
          const n = Math.pow(10, t);
          return Math.round(e * n) / n;
        })(Math.round((e - a) / s) * s + a, r),
        l = qi(o, [a, i]);
      P((e = []) => {
        const r = (function (e = [], t, n) {
          const r = [...e];
          return (r[n] = t), r.sort((e, t) => e - t);
        })(e, l, t);
        if (
          (function (e, t) {
            if (t > 0) {
              const n = (function (e) {
                return e.slice(0, -1).map((t, n) => e[n + 1] - t);
              })(e);
              return Math.min(...n) >= t;
            }
            return !0;
          })(r, u * s)
        ) {
          x.current = r.indexOf(l);
          const t = String(r) !== String(e);
          return t && n && v(r), t ? r : e;
        }
        return e;
      });
    }
    return e.createElement(
      is,
      {
        scope: n.__scopeSlider,
        disabled: c,
        min: a,
        max: i,
        valueIndexToChangeRef: x,
        thumbs: C.current,
        values: D,
        orientation: l,
      },
      e.createElement(
        ts.Provider,
        { scope: n.__scopeSlider },
        e.createElement(
          ts.Slot,
          { scope: n.__scopeSlider },
          e.createElement(
            S,
            t({ 'aria-disabled': c, 'data-disabled': c ? '' : void 0 }, h, {
              ref: y,
              onPointerDown: g(h.onPointerDown, () => {
                c || (T.current = D);
              }),
              min: a,
              max: i,
              inverted: m,
              onSlideStart: c
                ? void 0
                : function (e) {
                    const t = (function (e, t) {
                      if (1 === e.length) return 0;
                      const n = e.map((e) => Math.abs(e - t)),
                        r = Math.min(...n);
                      return n.indexOf(r);
                    })(D, e);
                    M(e, t);
                  },
              onSlideMove: c
                ? void 0
                : function (e) {
                    M(e, x.current);
                  },
              onSlideEnd: c
                ? void 0
                : function () {
                    const e = T.current[x.current];
                    D[x.current] !== e && v(D);
                  },
              onHomeKeyDown: () => !c && M(a, 0, { commit: !0 }),
              onEndKeyDown: () => !c && M(i, D.length - 1, { commit: !0 }),
              onStepKeyDown: ({ event: e, direction: t }) => {
                if (!c) {
                  const n = Yi.includes(e.key) || (e.shiftKey && Ji.includes(e.key)) ? 10 : 1,
                    r = x.current;
                  M(D[r] + s * n * t, r, { commit: !0 });
                }
              },
            }),
          ),
        ),
      ),
      _ &&
        D.map((t, n) =>
          e.createElement(bs, {
            key: n,
            name: o ? o + (D.length > 1 ? '[]' : '') : void 0,
            value: t,
          }),
        ),
    );
  }),
  [cs, us] = os(es, { startEdge: 'left', endEdge: 'right', size: 'width', direction: 1 }),
  ds = e.forwardRef((n, r) => {
    const {
        min: o,
        max: a,
        dir: i,
        inverted: s,
        onSlideStart: l,
        onSlideMove: c,
        onSlideEnd: u,
        onStepKeyDown: d,
        ...f
      } = n,
      [p, v] = e.useState(null),
      m = b(r, (e) => v(e)),
      h = e.useRef(),
      w = Zi(i),
      g = 'ltr' === w,
      E = (g && !s) || (!g && s);
    function y(e) {
      const t = h.current || p.getBoundingClientRect(),
        n = Cs([0, t.width], E ? [o, a] : [a, o]);
      return (h.current = t), n(e - t.left);
    }
    return e.createElement(
      cs,
      {
        scope: n.__scopeSlider,
        startEdge: E ? 'left' : 'right',
        endEdge: E ? 'right' : 'left',
        direction: E ? 1 : -1,
        size: 'width',
      },
      e.createElement(
        ps,
        t({ dir: w, 'data-orientation': 'horizontal' }, f, {
          ref: m,
          style: { ...f.style, '--radix-slider-thumb-transform': 'translateX(-50%)' },
          onSlideStart: (e) => {
            const t = y(e.clientX);
            null == l || l(t);
          },
          onSlideMove: (e) => {
            const t = y(e.clientX);
            null == c || c(t);
          },
          onSlideEnd: () => {
            (h.current = void 0), null == u || u();
          },
          onStepKeyDown: (e) => {
            const t = Qi[E ? 'from-left' : 'from-right'].includes(e.key);
            null == d || d({ event: e, direction: t ? -1 : 1 });
          },
        }),
      ),
    );
  }),
  fs = e.forwardRef((n, r) => {
    const {
        min: o,
        max: a,
        inverted: i,
        onSlideStart: s,
        onSlideMove: l,
        onSlideEnd: c,
        onStepKeyDown: u,
        ...d
      } = n,
      f = e.useRef(null),
      p = b(r, f),
      v = e.useRef(),
      m = !i;
    function h(e) {
      const t = v.current || f.current.getBoundingClientRect(),
        n = Cs([0, t.height], m ? [a, o] : [o, a]);
      return (v.current = t), n(e - t.top);
    }
    return e.createElement(
      cs,
      {
        scope: n.__scopeSlider,
        startEdge: m ? 'bottom' : 'top',
        endEdge: m ? 'top' : 'bottom',
        size: 'height',
        direction: m ? 1 : -1,
      },
      e.createElement(
        ps,
        t({ 'data-orientation': 'vertical' }, d, {
          ref: p,
          style: { ...d.style, '--radix-slider-thumb-transform': 'translateY(50%)' },
          onSlideStart: (e) => {
            const t = h(e.clientY);
            null == s || s(t);
          },
          onSlideMove: (e) => {
            const t = h(e.clientY);
            null == l || l(t);
          },
          onSlideEnd: () => {
            (v.current = void 0), null == c || c();
          },
          onStepKeyDown: (e) => {
            const t = Qi[m ? 'from-bottom' : 'from-top'].includes(e.key);
            null == u || u({ event: e, direction: t ? -1 : 1 });
          },
        }),
      ),
    );
  }),
  ps = e.forwardRef((n, r) => {
    const {
        __scopeSlider: o,
        onSlideStart: a,
        onSlideMove: i,
        onSlideEnd: s,
        onHomeKeyDown: l,
        onEndKeyDown: c,
        onStepKeyDown: u,
        ...d
      } = n,
      f = ss(es, o);
    return e.createElement(
      T.span,
      t({}, d, {
        ref: r,
        onKeyDown: g(n.onKeyDown, (e) => {
          'Home' === e.key
            ? (l(e), e.preventDefault())
            : 'End' === e.key
              ? (c(e), e.preventDefault())
              : Yi.concat(Ji).includes(e.key) && (u(e), e.preventDefault());
        }),
        onPointerDown: g(n.onPointerDown, (e) => {
          const t = e.target;
          t.setPointerCapture(e.pointerId), e.preventDefault(), f.thumbs.has(t) ? t.focus() : a(e);
        }),
        onPointerMove: g(n.onPointerMove, (e) => {
          e.target.hasPointerCapture(e.pointerId) && i(e);
        }),
        onPointerUp: g(n.onPointerUp, (e) => {
          const t = e.target;
          t.hasPointerCapture(e.pointerId) && (t.releasePointerCapture(e.pointerId), s(e));
        }),
      }),
    );
  }),
  vs = e.forwardRef((n, r) => {
    const { __scopeSlider: o, ...a } = n,
      i = ss('SliderTrack', o);
    return e.createElement(
      T.span,
      t({ 'data-disabled': i.disabled ? '' : void 0, 'data-orientation': i.orientation }, a, {
        ref: r,
      }),
    );
  }),
  ms = 'SliderRange',
  hs = e.forwardRef((n, r) => {
    const { __scopeSlider: o, ...a } = n,
      i = ss(ms, o),
      s = us(ms, o),
      l = b(r, e.useRef(null)),
      c = i.values.length,
      u = i.values.map((e) => ys(e, i.min, i.max)),
      d = c > 1 ? Math.min(...u) : 0,
      f = 100 - Math.max(...u);
    return e.createElement(
      T.span,
      t({ 'data-orientation': i.orientation, 'data-disabled': i.disabled ? '' : void 0 }, a, {
        ref: l,
        style: { ...n.style, [s.startEdge]: d + '%', [s.endEdge]: f + '%' },
      }),
    );
  }),
  ws = 'SliderThumb',
  gs = e.forwardRef((n, r) => {
    const o = ns(n.__scopeSlider),
      [a, i] = e.useState(null),
      s = b(r, (e) => i(e)),
      l = e.useMemo(() => (a ? o().findIndex((e) => e.ref.current === a) : -1), [o, a]);
    return e.createElement(Es, t({}, n, { ref: s, index: l }));
  }),
  Es = e.forwardRef((n, r) => {
    const { __scopeSlider: o, index: a, ...i } = n,
      s = ss(ws, o),
      l = us(ws, o),
      [c, u] = e.useState(null),
      d = b(r, (e) => u(e)),
      f = Bt(c),
      p = s.values[a],
      v = void 0 === p ? 0 : ys(p, s.min, s.max),
      m = (function (e, t) {
        return t > 2 ? `Value ${e + 1} of ${t}` : 2 === t ? ['Minimum', 'Maximum'][e] : void 0;
      })(a, s.values.length),
      h = null == f ? void 0 : f[l.size],
      w = h
        ? (function (e, t, n) {
            const r = e / 2,
              o = Cs([0, 50], [0, r]);
            return (r - o(t) * n) * n;
          })(h, v, l.direction)
        : 0;
    return (
      e.useEffect(() => {
        if (c)
          return (
            s.thumbs.add(c),
            () => {
              s.thumbs.delete(c);
            }
          );
      }, [c, s.thumbs]),
      e.createElement(
        'span',
        {
          style: {
            transform: 'var(--radix-slider-thumb-transform)',
            position: 'absolute',
            [l.startEdge]: `calc(${v}% + ${w}px)`,
          },
        },
        e.createElement(
          ts.ItemSlot,
          { scope: n.__scopeSlider },
          e.createElement(
            T.span,
            t(
              {
                role: 'slider',
                'aria-label': n['aria-label'] || m,
                'aria-valuemin': s.min,
                'aria-valuenow': p,
                'aria-valuemax': s.max,
                'aria-orientation': s.orientation,
                'data-orientation': s.orientation,
                'data-disabled': s.disabled ? '' : void 0,
                tabIndex: s.disabled ? void 0 : 0,
              },
              i,
              {
                ref: d,
                style: void 0 === p ? { display: 'none' } : n.style,
                onFocus: g(n.onFocus, () => {
                  s.valueIndexToChangeRef.current = a;
                }),
              },
            ),
          ),
        ),
      )
    );
  }),
  bs = (n) => {
    const { value: r, ...o } = n,
      a = e.useRef(null),
      i = $t(r);
    return (
      e.useEffect(() => {
        const e = a.current,
          t = window.HTMLInputElement.prototype,
          n = Object.getOwnPropertyDescriptor(t, 'value').set;
        if (i !== r && n) {
          const t = new Event('input', { bubbles: !0 });
          n.call(e, r), e.dispatchEvent(t);
        }
      }, [i, r]),
      e.createElement('input', t({ style: { display: 'none' } }, o, { ref: a, defaultValue: r }))
    );
  };
function ys(e, t, n) {
  return qi((100 / (n - t)) * (e - t), [0, 100]);
}
function Cs(e, t) {
  return (n) => {
    if (e[0] === e[1] || t[0] === t[1]) return t[0];
    const r = (t[1] - t[0]) / (e[1] - e[0]);
    return t[0] + r * (n - e[0]);
  };
}
const xs = ls,
  Rs = vs,
  _s = hs,
  Ss = gs,
  Ds = 'horizontal',
  Ps = ['horizontal', 'vertical'],
  Ts = e.forwardRef((n, r) => {
    const { decorative: o, orientation: a = Ds, ...i } = n,
      s = Ms(a) ? a : Ds,
      l = o
        ? { role: 'none' }
        : { 'aria-orientation': 'vertical' === s ? s : void 0, role: 'separator' };
    return e.createElement(T.div, t({ 'data-orientation': s }, l, i, { ref: r }));
  });
function Ms(e) {
  return Ps.includes(e);
}
Ts.propTypes = {
  orientation(e, t, n) {
    const r = e[t],
      o = String(r);
    return r && !Ms(r)
      ? new Error(
          (function (e, t) {
            return `Invalid prop \`orientation\` of value \`${e}\` supplied to \`${t}\`, expected one of:\n  - horizontal\n  - vertical\n\nDefaulting to \`${Ds}\`.`;
          })(o, n),
        )
      : null;
  },
};
const Os = Ts,
  ks = 'Switch',
  [Is, As] = y(ks),
  [Ls, Ns] = Is(ks),
  Fs = e.forwardRef((n, r) => {
    const {
        __scopeSwitch: o,
        name: a,
        checked: i,
        defaultChecked: s,
        required: l,
        disabled: c,
        value: u = 'on',
        onCheckedChange: d,
        ...f
      } = n,
      [p, v] = e.useState(null),
      m = b(r, (e) => v(e)),
      h = e.useRef(!1),
      w = !p || Boolean(p.closest('form')),
      [E = !1, y] = z({ prop: i, defaultProp: s, onChange: d });
    return e.createElement(
      Ls,
      { scope: o, checked: E, disabled: c },
      e.createElement(
        T.button,
        t(
          {
            type: 'button',
            role: 'switch',
            'aria-checked': E,
            'aria-required': l,
            'data-state': Ks(E),
            'data-disabled': c ? '' : void 0,
            disabled: c,
            value: u,
          },
          f,
          {
            ref: m,
            onClick: g(n.onClick, (e) => {
              y((e) => !e),
                w && ((h.current = e.isPropagationStopped()), h.current || e.stopPropagation());
            }),
          },
        ),
      ),
      w &&
        e.createElement(js, {
          control: p,
          bubbles: !h.current,
          name: a,
          value: u,
          checked: E,
          required: l,
          disabled: c,
          style: { transform: 'translateX(-100%)' },
        }),
    );
  }),
  js = (n) => {
    const { control: r, checked: o, bubbles: a = !0, ...i } = n,
      s = e.useRef(null),
      l = $t(o),
      c = Bt(r);
    return (
      e.useEffect(() => {
        const e = s.current,
          t = window.HTMLInputElement.prototype,
          n = Object.getOwnPropertyDescriptor(t, 'checked').set;
        if (l !== o && n) {
          const t = new Event('click', { bubbles: a });
          n.call(e, o), e.dispatchEvent(t);
        }
      }, [l, o, a]),
      e.createElement(
        'input',
        t({ type: 'checkbox', 'aria-hidden': !0, defaultChecked: o }, i, {
          tabIndex: -1,
          ref: s,
          style: {
            ...n.style,
            ...c,
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
          },
        }),
      )
    );
  };
function Ks(e) {
  return e ? 'checked' : 'unchecked';
}
const $s = Fs,
  Bs = e.forwardRef((n, r) => {
    const { __scopeSwitch: o, ...a } = n,
      i = Ns('SwitchThumb', o);
    return e.createElement(
      T.span,
      t({ 'data-state': Ks(i.checked), 'data-disabled': i.disabled ? '' : void 0 }, a, { ref: r }),
    );
  }),
  Hs = 'rovingFocusGroup.onEntryFocus',
  Vs = { bubbles: !1, cancelable: !0 },
  Ws = 'RovingFocusGroup',
  [Us, zs, Gs] = P(Ws),
  [qs, Xs] = y(Ws, [Gs]),
  [Zs, Ys] = qs(Ws),
  Js = e.forwardRef((n, r) =>
    e.createElement(
      Us.Provider,
      { scope: n.__scopeRovingFocusGroup },
      e.createElement(
        Us.Slot,
        { scope: n.__scopeRovingFocusGroup },
        e.createElement(Qs, t({}, n, { ref: r })),
      ),
    ),
  ),
  Qs = e.forwardRef((n, r) => {
    const {
        __scopeRovingFocusGroup: o,
        orientation: a,
        loop: i = !1,
        dir: s,
        currentTabStopId: l,
        defaultCurrentTabStopId: c,
        onCurrentTabStopIdChange: u,
        onEntryFocus: d,
        ...f
      } = n,
      p = e.useRef(null),
      v = b(r, p),
      m = Zi(s),
      [h = null, w] = z({ prop: l, defaultProp: c, onChange: u }),
      [E, y] = e.useState(!1),
      C = O(d),
      x = zs(o),
      R = e.useRef(!1),
      [_, S] = e.useState(0);
    return (
      e.useEffect(() => {
        const e = p.current;
        if (e) return e.addEventListener(Hs, C), () => e.removeEventListener(Hs, C);
      }, [C]),
      e.createElement(
        Zs,
        {
          scope: o,
          orientation: a,
          dir: m,
          loop: i,
          currentTabStopId: h,
          onItemFocus: e.useCallback((e) => w(e), [w]),
          onItemShiftTab: e.useCallback(() => y(!0), []),
          onFocusableItemAdd: e.useCallback(() => S((e) => e + 1), []),
          onFocusableItemRemove: e.useCallback(() => S((e) => e - 1), []),
        },
        e.createElement(
          T.div,
          t({ tabIndex: E || 0 === _ ? -1 : 0, 'data-orientation': a }, f, {
            ref: v,
            style: { outline: 'none', ...n.style },
            onMouseDown: g(n.onMouseDown, () => {
              R.current = !0;
            }),
            onFocus: g(n.onFocus, (e) => {
              const t = !R.current;
              if (e.target === e.currentTarget && t && !E) {
                const t = new CustomEvent(Hs, Vs);
                if ((e.currentTarget.dispatchEvent(t), !t.defaultPrevented)) {
                  const e = x().filter((e) => e.focusable);
                  nl(
                    [e.find((e) => e.active), e.find((e) => e.id === h), ...e]
                      .filter(Boolean)
                      .map((e) => e.ref.current),
                  );
                }
              }
              R.current = !1;
            }),
            onBlur: g(n.onBlur, () => y(!1)),
          }),
        ),
      )
    );
  }),
  el = e.forwardRef((n, r) => {
    const { __scopeRovingFocusGroup: o, focusable: a = !0, active: i = !1, tabStopId: s, ...l } = n,
      c = Pe(),
      u = s || c,
      d = Ys('RovingFocusGroupItem', o),
      f = d.currentTabStopId === u,
      p = zs(o),
      { onFocusableItemAdd: v, onFocusableItemRemove: m } = d;
    return (
      e.useEffect(() => {
        if (a) return v(), () => m();
      }, [a, v, m]),
      e.createElement(
        Us.ItemSlot,
        { scope: o, id: u, focusable: a, active: i },
        e.createElement(
          T.span,
          t({ tabIndex: f ? 0 : -1, 'data-orientation': d.orientation }, l, {
            ref: r,
            onMouseDown: g(n.onMouseDown, (e) => {
              a ? d.onItemFocus(u) : e.preventDefault();
            }),
            onFocus: g(n.onFocus, () => d.onItemFocus(u)),
            onKeyDown: g(n.onKeyDown, (e) => {
              if ('Tab' === e.key && e.shiftKey) return void d.onItemShiftTab();
              if (e.target !== e.currentTarget) return;
              const t = (function (e, t, n) {
                const r = (function (e, t) {
                  return 'rtl' !== t
                    ? e
                    : 'ArrowLeft' === e
                      ? 'ArrowRight'
                      : 'ArrowRight' === e
                        ? 'ArrowLeft'
                        : e;
                })(e.key, n);
                return ('vertical' === t && ['ArrowLeft', 'ArrowRight'].includes(r)) ||
                  ('horizontal' === t && ['ArrowUp', 'ArrowDown'].includes(r))
                  ? void 0
                  : tl[r];
              })(e, d.orientation, d.dir);
              if (void 0 !== t) {
                e.preventDefault();
                let o = p()
                  .filter((e) => e.focusable)
                  .map((e) => e.ref.current);
                if ('last' === t) o.reverse();
                else if ('prev' === t || 'next' === t) {
                  'prev' === t && o.reverse();
                  const a = o.indexOf(e.currentTarget);
                  o = d.loop
                    ? ((r = a + 1), (n = o).map((e, t) => n[(r + t) % n.length]))
                    : o.slice(a + 1);
                }
                setTimeout(() => nl(o));
              }
              var n, r;
            }),
          }),
        ),
      )
    );
  }),
  tl = {
    ArrowLeft: 'prev',
    ArrowUp: 'prev',
    ArrowRight: 'next',
    ArrowDown: 'next',
    PageUp: 'first',
    Home: 'first',
    PageDown: 'last',
    End: 'last',
  };
function nl(e) {
  const t = document.activeElement;
  for (const n of e) {
    if (n === t) return;
    if ((n.focus(), document.activeElement !== t)) return;
  }
}
const rl = Js,
  ol = el,
  al = 'Tabs',
  [il, sl] = y(al, [Xs]),
  ll = Xs(),
  [cl, ul] = il(al);
function dl(e, t) {
  return `${e}-trigger-${t}`;
}
function fl(e, t) {
  return `${e}-content-${t}`;
}
const pl = e.forwardRef((n, r) => {
    const {
        __scopeTabs: o,
        value: a,
        onValueChange: i,
        defaultValue: s,
        orientation: l = 'horizontal',
        dir: c,
        activationMode: u = 'automatic',
        ...d
      } = n,
      f = Zi(c),
      [p, v] = z({ prop: a, onChange: i, defaultProp: s });
    return e.createElement(
      cl,
      {
        scope: o,
        baseId: Pe(),
        value: p,
        onValueChange: v,
        orientation: l,
        dir: f,
        activationMode: u,
      },
      e.createElement(T.div, t({ dir: f, 'data-orientation': l }, d, { ref: r })),
    );
  }),
  vl = e.forwardRef((n, r) => {
    const { __scopeTabs: o, loop: a = !0, ...i } = n,
      s = ul('TabsList', o),
      l = ll(o);
    return e.createElement(
      rl,
      t({ asChild: !0 }, l, { orientation: s.orientation, dir: s.dir, loop: a }),
      e.createElement(
        T.div,
        t({ role: 'tablist', 'aria-orientation': s.orientation }, i, { ref: r }),
      ),
    );
  }),
  ml = e.forwardRef((n, r) => {
    const { __scopeTabs: o, value: a, disabled: i = !1, ...s } = n,
      l = ul('TabsTrigger', o),
      c = ll(o),
      u = dl(l.baseId, a),
      d = fl(l.baseId, a),
      f = a === l.value;
    return e.createElement(
      ol,
      t({ asChild: !0 }, c, { focusable: !i, active: f }),
      e.createElement(
        T.button,
        t(
          {
            type: 'button',
            role: 'tab',
            'aria-selected': f,
            'aria-controls': d,
            'data-state': f ? 'active' : 'inactive',
            'data-disabled': i ? '' : void 0,
            disabled: i,
            id: u,
          },
          s,
          {
            ref: r,
            onMouseDown: g(n.onMouseDown, (e) => {
              i || 0 !== e.button || !1 !== e.ctrlKey ? e.preventDefault() : l.onValueChange(a);
            }),
            onKeyDown: g(n.onKeyDown, (e) => {
              [' ', 'Enter'].includes(e.key) && l.onValueChange(a);
            }),
            onFocus: g(n.onFocus, () => {
              const e = 'manual' !== l.activationMode;
              f || i || !e || l.onValueChange(a);
            }),
          },
        ),
      ),
    );
  }),
  hl = e.forwardRef((n, r) => {
    const { __scopeTabs: o, value: a, forceMount: i, children: s, ...l } = n,
      c = ul('TabsContent', o),
      u = dl(c.baseId, a),
      d = fl(c.baseId, a),
      f = a === c.value,
      p = e.useRef(f);
    return (
      e.useEffect(() => {
        const e = requestAnimationFrame(() => (p.current = !1));
        return () => cancelAnimationFrame(e);
      }, []),
      e.createElement(W, { present: i || f }, ({ present: o }) =>
        e.createElement(
          T.div,
          t(
            {
              'data-state': f ? 'active' : 'inactive',
              'data-orientation': c.orientation,
              role: 'tabpanel',
              'aria-labelledby': u,
              hidden: !o,
              id: d,
              tabIndex: 0,
            },
            l,
            { ref: r, style: { ...n.style, animationDuration: p.current ? '0s' : void 0 } },
          ),
          o && s,
        ),
      )
    );
  });
function wl(...t) {
  const n = t[0];
  if (1 === t.length) return n;
  const r = () => {
    const r = t.map((e) => ({ useScope: e(), scopeName: e.scopeName }));
    return function (t) {
      const o = r.reduce(
        (e, { useScope: n, scopeName: r }) => ({ ...e, ...n(t)[`__scope${r}`] }),
        {},
      );
      return e.useMemo(() => ({ [`__scope${n.scopeName}`]: o }), [o]);
    };
  };
  return (r.scopeName = n.scopeName), r;
}
function gl(e, t) {
  if ('function' == typeof e) return e(t);
  null != e && (e.current = t);
}
var El = e.forwardRef((t, n) => {
  const { children: r, ...o } = t,
    a = e.Children.toArray(r),
    i = a.find(Cl);
  if (i) {
    const t = i.props.children,
      r = a.map((n) =>
        n === i
          ? e.Children.count(t) > 1
            ? e.Children.only(null)
            : e.isValidElement(t)
              ? t.props.children
              : null
          : n,
      );
    return l.jsx(bl, {
      ...o,
      ref: n,
      children: e.isValidElement(t) ? e.cloneElement(t, void 0, r) : null,
    });
  }
  return l.jsx(bl, { ...o, ref: n, children: r });
});
El.displayName = 'Slot';
var bl = e.forwardRef((t, n) => {
  const { children: r, ...o } = t;
  if (e.isValidElement(r)) {
    const t = (function (e) {
        var t, n;
        let r = null == (t = Object.getOwnPropertyDescriptor(e.props, 'ref')) ? void 0 : t.get,
          o = r && 'isReactWarning' in r && r.isReactWarning;
        if (o) return e.ref;
        if (
          ((r = null == (n = Object.getOwnPropertyDescriptor(e, 'ref')) ? void 0 : n.get),
          (o = r && 'isReactWarning' in r && r.isReactWarning),
          o)
        )
          return e.props.ref;
        return e.props.ref || e.ref;
      })(r),
      a = (function (e, t) {
        const n = { ...t };
        for (const r in t) {
          const o = e[r],
            a = t[r];
          /^on[A-Z]/.test(r)
            ? o && a
              ? (n[r] = (...e) => {
                  a(...e), o(...e);
                })
              : o && (n[r] = o)
            : 'style' === r
              ? (n[r] = { ...o, ...a })
              : 'className' === r && (n[r] = [o, a].filter(Boolean).join(' '));
        }
        return { ...e, ...n };
      })(o, r.props);
    return (
      r.type !== e.Fragment &&
        (a.ref = n
          ? (function (...e) {
              return (t) => {
                let n = !1;
                const r = e.map((e) => {
                  const r = gl(e, t);
                  return n || 'function' != typeof r || (n = !0), r;
                });
                if (n)
                  return () => {
                    for (let t = 0; t < r.length; t++) {
                      const n = r[t];
                      'function' == typeof n ? n() : gl(e[t], null);
                    }
                  };
              };
            })(n, t)
          : t),
      e.cloneElement(r, a)
    );
  }
  return e.Children.count(r) > 1 ? e.Children.only(null) : null;
});
bl.displayName = 'SlotClone';
var yl = ({ children: e }) => l.jsx(l.Fragment, { children: e });
function Cl(t) {
  return e.isValidElement(t) && t.type === yl;
}
var xl = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'span',
    'svg',
    'ul',
  ].reduce((t, n) => {
    const r = e.forwardRef((e, t) => {
      const { asChild: r, ...o } = e,
        a = r ? El : n;
      return (
        'undefined' != typeof window && (window[Symbol.for('radix-ui')] = !0),
        l.jsx(a, { ...o, ref: t })
      );
    });
    return (r.displayName = `Primitive.${n}`), { ...t, [n]: r };
  }, {}),
  Rl = 'Progress',
  _l = 100,
  [Sl, Dl] = (function (t, n = []) {
    let r = [];
    const o = () => {
      const n = r.map((t) => e.createContext(t));
      return function (r) {
        const o = (null == r ? void 0 : r[t]) || n;
        return e.useMemo(() => ({ [`__scope${t}`]: { ...r, [t]: o } }), [r, o]);
      };
    };
    return (
      (o.scopeName = t),
      [
        function (n, o) {
          const a = e.createContext(o),
            i = r.length;
          r = [...r, o];
          const s = (n) => {
            var r;
            const { scope: o, children: s, ...c } = n,
              u = (null == (r = null == o ? void 0 : o[t]) ? void 0 : r[i]) || a,
              d = e.useMemo(() => c, Object.values(c));
            return l.jsx(u.Provider, { value: d, children: s });
          };
          return (
            (s.displayName = n + 'Provider'),
            [
              s,
              function (r, s) {
                var l;
                const c = (null == (l = null == s ? void 0 : s[t]) ? void 0 : l[i]) || a,
                  u = e.useContext(c);
                if (u) return u;
                if (void 0 !== o) return o;
                throw new Error(`\`${r}\` must be used within \`${n}\``);
              },
            ]
          );
        },
        wl(o, ...n),
      ]
    );
  })(Rl),
  [Pl, Tl] = Sl(Rl),
  Ml = e.forwardRef((e, t) => {
    const { __scopeProgress: n, value: r = null, max: o, getValueLabel: a = Il, ...i } = e;
    (!o && 0 !== o) ||
      Nl(o) ||
      console.error(
        `Invalid prop \`max\` of value \`${`${o}`}\` supplied to \`${'Progress'}\`. Only numbers greater than 0 are valid max values. Defaulting to \`100\`.`,
      );
    const s = Nl(o) ? o : _l;
    null === r ||
      Fl(r, s) ||
      console.error(
        (function (e, t) {
          return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:\n  - a positive number\n  - less than the value passed to \`max\` (or 100 if no \`max\` prop is set)\n  - \`null\` or \`undefined\` if the progress is indeterminate.\n\nDefaulting to \`null\`.`;
        })(`${r}`, 'Progress'),
      );
    const c = Fl(r, s) ? r : null,
      u = Ll(c) ? a(c, s) : void 0;
    return l.jsx(Pl, {
      scope: n,
      value: c,
      max: s,
      children: l.jsx(xl.div, {
        'aria-valuemax': s,
        'aria-valuemin': 0,
        'aria-valuenow': Ll(c) ? c : void 0,
        'aria-valuetext': u,
        role: 'progressbar',
        'data-state': Al(c, s),
        'data-value': c ?? void 0,
        'data-max': s,
        ...i,
        ref: t,
      }),
    });
  });
Ml.displayName = Rl;
var Ol = 'ProgressIndicator',
  kl = e.forwardRef((e, t) => {
    const { __scopeProgress: n, ...r } = e,
      o = Tl(Ol, n);
    return l.jsx(xl.div, {
      'data-state': Al(o.value, o.max),
      'data-value': o.value ?? void 0,
      'data-max': o.max,
      ...r,
      ref: t,
    });
  });
function Il(e, t) {
  return `${Math.round((e / t) * 100)}%`;
}
function Al(e, t) {
  return null == e ? 'indeterminate' : e === t ? 'complete' : 'loading';
}
function Ll(e) {
  return 'number' == typeof e;
}
function Nl(e) {
  return Ll(e) && !isNaN(e) && e > 0;
}
function Fl(e, t) {
  return Ll(e) && !isNaN(e) && e <= t && e >= 0;
}
kl.displayName = Ol;
var jl = Ml,
  Kl = kl;
const $l = [' ', 'Enter', 'ArrowUp', 'ArrowDown'],
  Bl = [' ', 'Enter'],
  Hl = 'Select',
  [Vl, Wl, Ul] = P(Hl),
  [zl, Gl] = y(Hl, [Ul, vi]),
  ql = vi(),
  [Xl, Zl] = zl(Hl),
  [Yl, Jl] = zl(Hl),
  Ql = e.forwardRef((n, r) => {
    const { __scopeSelect: o, disabled: a = !1, ...i } = n,
      s = ql(o),
      l = Zl('SelectTrigger', o),
      c = l.disabled || a,
      u = b(r, l.onTriggerChange),
      d = Wl(o),
      [f, p, v] = Tc((e) => {
        const t = d().filter((e) => !e.disabled),
          n = t.find((e) => e.value === l.value),
          r = Mc(t, e, n);
        void 0 !== r && l.onValueChange(r.value);
      }),
      m = () => {
        c || (l.onOpenChange(!0), v());
      };
    return e.createElement(
      Si,
      t({ asChild: !0 }, s),
      e.createElement(
        T.button,
        t(
          {
            type: 'button',
            role: 'combobox',
            'aria-controls': l.contentId,
            'aria-expanded': l.open,
            'aria-required': l.required,
            'aria-autocomplete': 'none',
            dir: l.dir,
            'data-state': l.open ? 'open' : 'closed',
            disabled: c,
            'data-disabled': c ? '' : void 0,
            'data-placeholder': ((h = l.value), '' === h || void 0 === h ? '' : void 0),
          },
          i,
          {
            ref: u,
            onClick: g(i.onClick, (e) => {
              e.currentTarget.focus();
            }),
            onPointerDown: g(i.onPointerDown, (e) => {
              const t = e.target;
              t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId),
                0 === e.button &&
                  !1 === e.ctrlKey &&
                  (m(),
                  (l.triggerPointerDownPosRef.current = {
                    x: Math.round(e.pageX),
                    y: Math.round(e.pageY),
                  }),
                  e.preventDefault());
            }),
            onKeyDown: g(i.onKeyDown, (e) => {
              const t = '' !== f.current;
              e.ctrlKey || e.altKey || e.metaKey || 1 !== e.key.length || p(e.key),
                (t && ' ' === e.key) || ($l.includes(e.key) && (m(), e.preventDefault()));
            }),
          },
        ),
      ),
    );
    var h;
  }),
  ec = e.forwardRef((n, r) => {
    const { __scopeSelect: o, children: a, ...i } = n;
    return e.createElement(T.span, t({ 'aria-hidden': !0 }, i, { ref: r }), a || '▼');
  }),
  tc = 'SelectContent',
  nc = e.forwardRef((n, o) => {
    const a = Zl(tc, n.__scopeSelect),
      [i, s] = e.useState();
    if (
      (V(() => {
        s(new DocumentFragment());
      }, []),
      !a.open)
    ) {
      const t = i;
      return t
        ? r.createPortal(
            e.createElement(
              oc,
              { scope: n.__scopeSelect },
              e.createElement(
                Vl.Slot,
                { scope: n.__scopeSelect },
                e.createElement('div', null, n.children),
              ),
            ),
            t,
          )
        : null;
    }
    return e.createElement(ic, t({}, n, { ref: o }));
  }),
  rc = 10,
  [oc, ac] = zl(tc),
  ic = e.forwardRef((n, r) => {
    const {
        __scopeSelect: o,
        position: a = 'item-aligned',
        onCloseAutoFocus: l,
        onEscapeKeyDown: c,
        onPointerDownOutside: u,
        side: d,
        sideOffset: f,
        align: p,
        alignOffset: v,
        arrowPadding: m,
        collisionBoundary: h,
        collisionPadding: w,
        sticky: E,
        hideWhenDetached: y,
        avoidCollisions: C,
        ...R
      } = n,
      _ = Zl(tc, o),
      [S, D] = e.useState(null),
      [P, T] = e.useState(null),
      M = b(r, (e) => D(e)),
      [O, k] = e.useState(null),
      [I, A] = e.useState(null),
      L = Wl(o),
      [N, j] = e.useState(!1),
      K = e.useRef(!1);
    e.useEffect(() => {
      if (S) return s(S);
    }, [S]),
      $e();
    const $ = e.useCallback(
        (e) => {
          const [t, ...n] = L().map((e) => e.ref.current),
            [r] = n.slice(-1),
            o = document.activeElement;
          for (const a of e) {
            if (a === o) return;
            if (
              (null == a || a.scrollIntoView({ block: 'nearest' }),
              a === t && P && (P.scrollTop = 0),
              a === r && P && (P.scrollTop = P.scrollHeight),
              null == a || a.focus(),
              document.activeElement !== o)
            )
              return;
          }
        },
        [L, P],
      ),
      B = e.useCallback(() => $([O, S]), [$, O, S]);
    e.useEffect(() => {
      N && B();
    }, [N, B]);
    const { onOpenChange: H, triggerPointerDownPosRef: V } = _;
    e.useEffect(() => {
      if (S) {
        let e = { x: 0, y: 0 };
        const t = (t) => {
            var n, r, o, a;
            e = {
              x: Math.abs(
                Math.round(t.pageX) -
                  (null !== (n = null === (r = V.current) || void 0 === r ? void 0 : r.x) &&
                  void 0 !== n
                    ? n
                    : 0),
              ),
              y: Math.abs(
                Math.round(t.pageY) -
                  (null !== (o = null === (a = V.current) || void 0 === a ? void 0 : a.y) &&
                  void 0 !== o
                    ? o
                    : 0),
              ),
            };
          },
          n = (n) => {
            e.x <= 10 && e.y <= 10 ? n.preventDefault() : S.contains(n.target) || H(!1),
              document.removeEventListener('pointermove', t),
              (V.current = null);
          };
        return (
          null !== V.current &&
            (document.addEventListener('pointermove', t),
            document.addEventListener('pointerup', n, { capture: !0, once: !0 })),
          () => {
            document.removeEventListener('pointermove', t),
              document.removeEventListener('pointerup', n, { capture: !0 });
          }
        );
      }
    }, [S, H, V]),
      e.useEffect(() => {
        const e = () => H(!1);
        return (
          window.addEventListener('blur', e),
          window.addEventListener('resize', e),
          () => {
            window.removeEventListener('blur', e), window.removeEventListener('resize', e);
          }
        );
      }, [H]);
    const [W, U] = Tc((e) => {
        const t = L().filter((e) => !e.disabled),
          n = t.find((e) => e.ref.current === document.activeElement),
          r = Mc(t, e, n);
        r && setTimeout(() => r.ref.current.focus());
      }),
      z = e.useCallback(
        (e, t, n) => {
          const r = !K.current && !n;
          ((void 0 !== _.value && _.value === t) || r) && (k(e), r && (K.current = !0));
        },
        [_.value],
      ),
      G = e.useCallback(() => (null == S ? void 0 : S.focus()), [S]),
      q = e.useCallback(
        (e, t, n) => {
          const r = !K.current && !n;
          ((void 0 !== _.value && _.value === t) || r) && A(e);
        },
        [_.value],
      ),
      X = 'popper' === a ? lc : sc,
      Z =
        X === lc
          ? {
              side: d,
              sideOffset: f,
              align: p,
              alignOffset: v,
              arrowPadding: m,
              collisionBoundary: h,
              collisionPadding: w,
              sticky: E,
              hideWhenDetached: y,
              avoidCollisions: C,
            }
          : {};
    return e.createElement(
      oc,
      {
        scope: o,
        content: S,
        viewport: P,
        onViewportChange: T,
        itemRefCallback: z,
        selectedItem: O,
        onItemLeave: G,
        itemTextRefCallback: q,
        focusSelectedItem: B,
        selectedItemText: I,
        position: a,
        isPositioned: N,
        searchRef: W,
      },
      e.createElement(
        i,
        { as: x, allowPinchZoom: !0 },
        e.createElement(
          ke,
          {
            asChild: !0,
            trapped: _.open,
            onMountAutoFocus: (e) => {
              e.preventDefault();
            },
            onUnmountAutoFocus: g(l, (e) => {
              var t;
              null === (t = _.trigger) || void 0 === t || t.focus({ preventScroll: !0 }),
                e.preventDefault();
            }),
          },
          e.createElement(
            F,
            {
              asChild: !0,
              disableOutsidePointerEvents: !0,
              onEscapeKeyDown: c,
              onPointerDownOutside: u,
              onFocusOutside: (e) => e.preventDefault(),
              onDismiss: () => _.onOpenChange(!1),
            },
            e.createElement(
              X,
              t(
                {
                  role: 'listbox',
                  id: _.contentId,
                  'data-state': _.open ? 'open' : 'closed',
                  dir: _.dir,
                  onContextMenu: (e) => e.preventDefault(),
                },
                R,
                Z,
                {
                  onPlaced: () => j(!0),
                  ref: M,
                  style: { display: 'flex', flexDirection: 'column', outline: 'none', ...R.style },
                  onKeyDown: g(R.onKeyDown, (e) => {
                    const t = e.ctrlKey || e.altKey || e.metaKey;
                    if (
                      ('Tab' === e.key && e.preventDefault(),
                      t || 1 !== e.key.length || U(e.key),
                      ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key))
                    ) {
                      let t = L()
                        .filter((e) => !e.disabled)
                        .map((e) => e.ref.current);
                      if (
                        (['ArrowUp', 'End'].includes(e.key) && (t = t.slice().reverse()),
                        ['ArrowUp', 'ArrowDown'].includes(e.key))
                      ) {
                        const n = e.target,
                          r = t.indexOf(n);
                        t = t.slice(r + 1);
                      }
                      setTimeout(() => $(t)), e.preventDefault();
                    }
                  }),
                },
              ),
            ),
          ),
        ),
      ),
    );
  }),
  sc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, onPlaced: a, ...i } = n,
      s = Zl(tc, o),
      l = ac(tc, o),
      [c, u] = e.useState(null),
      [d, f] = e.useState(null),
      p = b(r, (e) => f(e)),
      v = Wl(o),
      m = e.useRef(!1),
      h = e.useRef(!0),
      { viewport: w, selectedItem: g, selectedItemText: E, focusSelectedItem: y } = l,
      C = e.useCallback(() => {
        if (s.trigger && s.valueNode && c && d && w && g && E) {
          const e = s.trigger.getBoundingClientRect(),
            t = d.getBoundingClientRect(),
            n = s.valueNode.getBoundingClientRect(),
            r = E.getBoundingClientRect();
          if ('rtl' !== s.dir) {
            const o = r.left - t.left,
              a = n.left - o,
              i = e.left - a,
              s = e.width + i,
              l = Math.max(s, t.width),
              u = window.innerWidth - rc,
              d = qi(a, [rc, u - l]);
            (c.style.minWidth = s + 'px'), (c.style.left = d + 'px');
          } else {
            const o = t.right - r.right,
              a = window.innerWidth - n.right - o,
              i = window.innerWidth - e.right - a,
              s = e.width + i,
              l = Math.max(s, t.width),
              u = window.innerWidth - rc,
              d = qi(a, [rc, u - l]);
            (c.style.minWidth = s + 'px'), (c.style.right = d + 'px');
          }
          const o = v(),
            i = window.innerHeight - 2 * rc,
            l = w.scrollHeight,
            u = window.getComputedStyle(d),
            f = parseInt(u.borderTopWidth, 10),
            p = parseInt(u.paddingTop, 10),
            h = parseInt(u.borderBottomWidth, 10),
            b = f + p + l + parseInt(u.paddingBottom, 10) + h,
            y = Math.min(5 * g.offsetHeight, b),
            C = window.getComputedStyle(w),
            x = parseInt(C.paddingTop, 10),
            R = parseInt(C.paddingBottom, 10),
            _ = e.top + e.height / 2 - rc,
            S = i - _,
            D = g.offsetHeight / 2,
            P = f + p + (g.offsetTop + D),
            T = b - P;
          if (P <= _) {
            const e = g === o[o.length - 1].ref.current;
            c.style.bottom = '0px';
            const t = d.clientHeight - w.offsetTop - w.offsetHeight,
              n = P + Math.max(S, D + (e ? R : 0) + t + h);
            c.style.height = n + 'px';
          } else {
            const e = g === o[0].ref.current;
            c.style.top = '0px';
            const t = Math.max(_, f + w.offsetTop + (e ? x : 0) + D) + T;
            (c.style.height = t + 'px'), (w.scrollTop = P - _ + w.offsetTop);
          }
          (c.style.margin = `${rc}px 0`),
            (c.style.minHeight = y + 'px'),
            (c.style.maxHeight = i + 'px'),
            null == a || a(),
            requestAnimationFrame(() => (m.current = !0));
        }
      }, [v, s.trigger, s.valueNode, c, d, w, g, E, s.dir, a]);
    V(() => C(), [C]);
    const [x, R] = e.useState();
    V(() => {
      d && R(window.getComputedStyle(d).zIndex);
    }, [d]);
    const _ = e.useCallback(
      (e) => {
        e && !0 === h.current && (C(), null == y || y(), (h.current = !1));
      },
      [C, y],
    );
    return e.createElement(
      cc,
      { scope: o, contentWrapper: c, shouldExpandOnScrollRef: m, onScrollButtonChange: _ },
      e.createElement(
        'div',
        {
          ref: u,
          style: { display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: x },
        },
        e.createElement(
          T.div,
          t({}, i, { ref: p, style: { boxSizing: 'border-box', maxHeight: '100%', ...i.style } }),
        ),
      ),
    );
  }),
  lc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, align: a = 'start', collisionPadding: i = rc, ...s } = n,
      l = ql(o);
    return e.createElement(
      Di,
      t({}, l, s, {
        ref: r,
        align: a,
        collisionPadding: i,
        style: {
          boxSizing: 'border-box',
          ...s.style,
          '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)',
        },
      }),
    );
  }),
  [cc, uc] = zl(tc, {}),
  dc = 'SelectViewport',
  fc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, ...a } = n,
      i = ac(dc, o),
      s = uc(dc, o),
      l = b(r, i.onViewportChange),
      c = e.useRef(0);
    return e.createElement(
      e.Fragment,
      null,
      e.createElement('style', {
        dangerouslySetInnerHTML: {
          __html:
            '[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}',
        },
      }),
      e.createElement(
        Vl.Slot,
        { scope: o },
        e.createElement(
          T.div,
          t({ 'data-radix-select-viewport': '', role: 'presentation' }, a, {
            ref: l,
            style: { position: 'relative', flex: 1, overflow: 'auto', ...a.style },
            onScroll: g(a.onScroll, (e) => {
              const t = e.currentTarget,
                { contentWrapper: n, shouldExpandOnScrollRef: r } = s;
              if (null != r && r.current && n) {
                const e = Math.abs(c.current - t.scrollTop);
                if (e > 0) {
                  const r = window.innerHeight - 2 * rc,
                    o = parseFloat(n.style.minHeight),
                    a = parseFloat(n.style.height),
                    i = Math.max(o, a);
                  if (i < r) {
                    const o = i + e,
                      a = Math.min(r, o),
                      s = o - a;
                    (n.style.height = a + 'px'),
                      '0px' === n.style.bottom &&
                        ((t.scrollTop = s > 0 ? s : 0), (n.style.justifyContent = 'flex-end'));
                  }
                }
              }
              c.current = t.scrollTop;
            }),
          }),
        ),
      ),
    );
  }),
  [pc, vc] = zl('SelectGroup'),
  mc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, ...a } = n,
      i = vc('SelectLabel', o);
    return e.createElement(T.div, t({ id: i.id }, a, { ref: r }));
  }),
  hc = 'SelectItem',
  [wc, gc] = zl(hc),
  Ec = e.forwardRef((n, r) => {
    const { __scopeSelect: o, value: a, disabled: i = !1, textValue: s, ...l } = n,
      c = Zl(hc, o),
      u = ac(hc, o),
      d = c.value === a,
      [f, p] = e.useState(null != s ? s : ''),
      [v, m] = e.useState(!1),
      h = b(r, (e) => {
        var t;
        return null === (t = u.itemRefCallback) || void 0 === t ? void 0 : t.call(u, e, a, i);
      }),
      w = Pe(),
      E = () => {
        i || (c.onValueChange(a), c.onOpenChange(!1));
      };
    if ('' === a)
      throw new Error(
        'A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
      );
    return e.createElement(
      wc,
      {
        scope: o,
        value: a,
        disabled: i,
        textId: w,
        isSelected: d,
        onItemTextChange: e.useCallback((e) => {
          p((t) => {
            var n;
            return (
              t ||
              (null !== (n = null == e ? void 0 : e.textContent) && void 0 !== n ? n : '').trim()
            );
          });
        }, []),
      },
      e.createElement(
        Vl.ItemSlot,
        { scope: o, value: a, disabled: i, textValue: f },
        e.createElement(
          T.div,
          t(
            {
              role: 'option',
              'aria-labelledby': w,
              'data-highlighted': v ? '' : void 0,
              'aria-selected': d && v,
              'data-state': d ? 'checked' : 'unchecked',
              'aria-disabled': i || void 0,
              'data-disabled': i ? '' : void 0,
              tabIndex: i ? void 0 : -1,
            },
            l,
            {
              ref: h,
              onFocus: g(l.onFocus, () => m(!0)),
              onBlur: g(l.onBlur, () => m(!1)),
              onPointerUp: g(l.onPointerUp, E),
              onPointerMove: g(l.onPointerMove, (e) => {
                var t;
                i
                  ? null === (t = u.onItemLeave) || void 0 === t || t.call(u)
                  : e.currentTarget.focus({ preventScroll: !0 });
              }),
              onPointerLeave: g(l.onPointerLeave, (e) => {
                var t;
                e.currentTarget === document.activeElement &&
                  (null === (t = u.onItemLeave) || void 0 === t || t.call(u));
              }),
              onKeyDown: g(l.onKeyDown, (e) => {
                var t;
                ('' !== (null === (t = u.searchRef) || void 0 === t ? void 0 : t.current) &&
                  ' ' === e.key) ||
                  (Bl.includes(e.key) && E(), ' ' === e.key && e.preventDefault());
              }),
            },
          ),
        ),
      ),
    );
  }),
  bc = 'SelectItemText',
  yc = e.forwardRef((n, o) => {
    const { __scopeSelect: a, className: i, style: s, ...l } = n,
      c = Zl(bc, a),
      u = ac(bc, a),
      d = gc(bc, a),
      f = Jl(bc, a),
      [p, v] = e.useState(null),
      m = b(
        o,
        (e) => v(e),
        d.onItemTextChange,
        (e) => {
          var t;
          return null === (t = u.itemTextRefCallback) || void 0 === t
            ? void 0
            : t.call(u, e, d.value, d.disabled);
        },
      ),
      h = null == p ? void 0 : p.textContent,
      w = e.useMemo(
        () => e.createElement('option', { key: d.value, value: d.value, disabled: d.disabled }, h),
        [d.disabled, d.value, h],
      ),
      { onNativeOptionAdd: g, onNativeOptionRemove: E } = f;
    return (
      V(() => (g(w), () => E(w)), [g, E, w]),
      e.createElement(
        e.Fragment,
        null,
        e.createElement(T.span, t({ id: d.textId }, l, { ref: m })),
        d.isSelected && c.valueNode && !c.valueNodeHasChildren
          ? r.createPortal(l.children, c.valueNode)
          : null,
      )
    );
  }),
  Cc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, ...a } = n;
    return gc('SelectItemIndicator', o).isSelected
      ? e.createElement(T.span, t({ 'aria-hidden': !0 }, a, { ref: r }))
      : null;
  }),
  xc = 'SelectScrollUpButton',
  Rc = e.forwardRef((n, r) => {
    const o = ac(xc, n.__scopeSelect),
      a = uc(xc, n.__scopeSelect),
      [i, s] = e.useState(!1),
      l = b(r, a.onScrollButtonChange);
    return (
      V(() => {
        if (o.viewport && o.isPositioned) {
          let e = function () {
            const e = t.scrollTop > 0;
            s(e);
          };
          const t = o.viewport;
          return e(), t.addEventListener('scroll', e), () => t.removeEventListener('scroll', e);
        }
      }, [o.viewport, o.isPositioned]),
      i
        ? e.createElement(
            Dc,
            t({}, n, {
              ref: l,
              onAutoScroll: () => {
                const { viewport: e, selectedItem: t } = o;
                e && t && (e.scrollTop = e.scrollTop - t.offsetHeight);
              },
            }),
          )
        : null
    );
  }),
  _c = 'SelectScrollDownButton',
  Sc = e.forwardRef((n, r) => {
    const o = ac(_c, n.__scopeSelect),
      a = uc(_c, n.__scopeSelect),
      [i, s] = e.useState(!1),
      l = b(r, a.onScrollButtonChange);
    return (
      V(() => {
        if (o.viewport && o.isPositioned) {
          let e = function () {
            const e = t.scrollHeight - t.clientHeight,
              n = Math.ceil(t.scrollTop) < e;
            s(n);
          };
          const t = o.viewport;
          return e(), t.addEventListener('scroll', e), () => t.removeEventListener('scroll', e);
        }
      }, [o.viewport, o.isPositioned]),
      i
        ? e.createElement(
            Dc,
            t({}, n, {
              ref: l,
              onAutoScroll: () => {
                const { viewport: e, selectedItem: t } = o;
                e && t && (e.scrollTop = e.scrollTop + t.offsetHeight);
              },
            }),
          )
        : null
    );
  }),
  Dc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, onAutoScroll: a, ...i } = n,
      s = ac('SelectScrollButton', o),
      l = e.useRef(null),
      c = Wl(o),
      u = e.useCallback(() => {
        null !== l.current && (window.clearInterval(l.current), (l.current = null));
      }, []);
    return (
      e.useEffect(() => () => u(), [u]),
      V(() => {
        var e;
        const t = c().find((e) => e.ref.current === document.activeElement);
        null == t ||
          null === (e = t.ref.current) ||
          void 0 === e ||
          e.scrollIntoView({ block: 'nearest' });
      }, [c]),
      e.createElement(
        T.div,
        t({ 'aria-hidden': !0 }, i, {
          ref: r,
          style: { flexShrink: 0, ...i.style },
          onPointerDown: g(i.onPointerDown, () => {
            null === l.current && (l.current = window.setInterval(a, 50));
          }),
          onPointerMove: g(i.onPointerMove, () => {
            var e;
            null === (e = s.onItemLeave) || void 0 === e || e.call(s),
              null === l.current && (l.current = window.setInterval(a, 50));
          }),
          onPointerLeave: g(i.onPointerLeave, () => {
            u();
          }),
        }),
      )
    );
  }),
  Pc = e.forwardRef((n, r) => {
    const { __scopeSelect: o, ...a } = n;
    return e.createElement(T.div, t({ 'aria-hidden': !0 }, a, { ref: r }));
  });
function Tc(t) {
  const n = O(t),
    r = e.useRef(''),
    o = e.useRef(0),
    a = e.useCallback(
      (e) => {
        const t = r.current + e;
        n(t),
          (function e(t) {
            (r.current = t),
              window.clearTimeout(o.current),
              '' !== t && (o.current = window.setTimeout(() => e(''), 1e3));
          })(t);
      },
      [n],
    ),
    i = e.useCallback(() => {
      (r.current = ''), window.clearTimeout(o.current);
    }, []);
  return e.useEffect(() => () => window.clearTimeout(o.current), []), [r, a, i];
}
function Mc(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t,
    o = n ? e.indexOf(n) : -1;
  let a = ((i = e), (s = Math.max(o, 0)), i.map((e, t) => i[(s + t) % i.length]));
  var i, s;
  1 === r.length && (a = a.filter((e) => e !== n));
  const l = a.find((e) => e.textValue.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
e.forwardRef((n, r) => {
  const { value: o, ...a } = n,
    i = e.useRef(null),
    s = b(r, i),
    l = $t(o);
  return (
    e.useEffect(() => {
      const e = i.current,
        t = window.HTMLSelectElement.prototype,
        n = Object.getOwnPropertyDescriptor(t, 'value').set;
      if (l !== o && n) {
        const t = new Event('change', { bubbles: !0 });
        n.call(e, o), e.dispatchEvent(t);
      }
    }, [l, o]),
    e.createElement(
      G,
      { asChild: !0 },
      e.createElement('select', t({}, a, { ref: s, defaultValue: o })),
    )
  );
}).displayName = 'BubbleSelect';
const Oc = Ql,
  kc = ec,
  Ic = (n) => e.createElement(H, t({ asChild: !0 }, n)),
  Ac = nc,
  Lc = fc,
  Nc = mc,
  Fc = Ec,
  jc = yc,
  Kc = Cc,
  $c = Rc,
  Bc = Sc,
  Hc = Pc,
  Vc = 'Popover',
  [Wc, Uc] = y(Vc, [vi]),
  zc = vi(),
  [Gc, qc] = Wc(Vc),
  Xc = e.forwardRef((n, r) => {
    const { __scopePopover: o, ...a } = n,
      i = qc('PopoverTrigger', o),
      s = zc(o),
      l = b(r, i.triggerRef),
      c = e.createElement(
        T.button,
        t(
          {
            type: 'button',
            'aria-haspopup': 'dialog',
            'aria-expanded': i.open,
            'aria-controls': i.contentId,
            'data-state': ou(i.open),
          },
          a,
          { ref: l, onClick: g(n.onClick, i.onOpenToggle) },
        ),
      );
    return i.hasCustomAnchor ? c : e.createElement(Si, t({ asChild: !0 }, s), c);
  }),
  Zc = 'PopoverPortal',
  [Yc, Jc] = Wc(Zc, { forceMount: void 0 }),
  Qc = 'PopoverContent',
  eu = e.forwardRef((n, r) => {
    const o = Jc(Qc, n.__scopePopover),
      { forceMount: a = o.forceMount, ...i } = n,
      s = qc(Qc, n.__scopePopover);
    return e.createElement(
      W,
      { present: a || s.open },
      s.modal
        ? e.createElement(tu, t({}, i, { ref: r }))
        : e.createElement(nu, t({}, i, { ref: r })),
    );
  }),
  tu = e.forwardRef((n, r) => {
    const o = qc(Qc, n.__scopePopover),
      a = e.useRef(null),
      l = b(r, a),
      c = e.useRef(!1);
    return (
      e.useEffect(() => {
        const e = a.current;
        if (e) return s(e);
      }, []),
      e.createElement(
        i,
        { as: x, allowPinchZoom: !0 },
        e.createElement(
          ru,
          t({}, n, {
            ref: l,
            trapFocus: o.open,
            disableOutsidePointerEvents: !0,
            onCloseAutoFocus: g(n.onCloseAutoFocus, (e) => {
              var t;
              e.preventDefault(),
                c.current || null === (t = o.triggerRef.current) || void 0 === t || t.focus();
            }),
            onPointerDownOutside: g(
              n.onPointerDownOutside,
              (e) => {
                const t = e.detail.originalEvent,
                  n = 0 === t.button && !0 === t.ctrlKey,
                  r = 2 === t.button || n;
                c.current = r;
              },
              { checkForDefaultPrevented: !1 },
            ),
            onFocusOutside: g(n.onFocusOutside, (e) => e.preventDefault(), {
              checkForDefaultPrevented: !1,
            }),
          }),
        ),
      )
    );
  }),
  nu = e.forwardRef((n, r) => {
    const o = qc(Qc, n.__scopePopover),
      a = e.useRef(!1),
      i = e.useRef(!1);
    return e.createElement(
      ru,
      t({}, n, {
        ref: r,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (e) => {
          var t, r;
          (null === (t = n.onCloseAutoFocus) || void 0 === t || t.call(n, e), e.defaultPrevented) ||
            (a.current || null === (r = o.triggerRef.current) || void 0 === r || r.focus(),
            e.preventDefault());
          (a.current = !1), (i.current = !1);
        },
        onInteractOutside: (e) => {
          var t, r;
          null === (t = n.onInteractOutside) || void 0 === t || t.call(n, e),
            e.defaultPrevented ||
              ((a.current = !0), 'pointerdown' === e.detail.originalEvent.type && (i.current = !0));
          const s = e.target;
          (null === (r = o.triggerRef.current) || void 0 === r ? void 0 : r.contains(s)) &&
            e.preventDefault(),
            'focusin' === e.detail.originalEvent.type && i.current && e.preventDefault();
        },
      }),
    );
  }),
  ru = e.forwardRef((n, r) => {
    const {
        __scopePopover: o,
        trapFocus: a,
        onOpenAutoFocus: i,
        onCloseAutoFocus: s,
        disableOutsidePointerEvents: l,
        onEscapeKeyDown: c,
        onPointerDownOutside: u,
        onFocusOutside: d,
        onInteractOutside: f,
        ...p
      } = n,
      v = qc(Qc, o),
      m = zc(o);
    return (
      $e(),
      e.createElement(
        ke,
        { asChild: !0, loop: !0, trapped: a, onMountAutoFocus: i, onUnmountAutoFocus: s },
        e.createElement(
          F,
          {
            asChild: !0,
            disableOutsidePointerEvents: l,
            onInteractOutside: f,
            onEscapeKeyDown: c,
            onPointerDownOutside: u,
            onFocusOutside: d,
            onDismiss: () => v.onOpenChange(!1),
          },
          e.createElement(
            Di,
            t({ 'data-state': ou(v.open), role: 'dialog', id: v.contentId }, m, p, {
              ref: r,
              style: {
                ...p.style,
                '--radix-popover-content-transform-origin': 'var(--radix-popper-transform-origin)',
                '--radix-popover-content-available-width': 'var(--radix-popper-available-width)',
                '--radix-popover-content-available-height': 'var(--radix-popper-available-height)',
                '--radix-popover-trigger-width': 'var(--radix-popper-anchor-width)',
                '--radix-popover-trigger-height': 'var(--radix-popper-anchor-height)',
              },
            }),
          ),
        ),
      )
    );
  });
function ou(e) {
  return e ? 'open' : 'closed';
}
const au = (t) => {
    const {
        __scopePopover: n,
        children: r,
        open: o,
        defaultOpen: a,
        onOpenChange: i,
        modal: s = !1,
      } = t,
      l = zc(n),
      c = e.useRef(null),
      [u, d] = e.useState(!1),
      [f = !1, p] = z({ prop: o, defaultProp: a, onChange: i });
    return e.createElement(
      _i,
      l,
      e.createElement(
        Gc,
        {
          scope: n,
          contentId: Pe(),
          triggerRef: c,
          open: f,
          onOpenChange: p,
          onOpenToggle: e.useCallback(() => p((e) => !e), [p]),
          hasCustomAnchor: u,
          onCustomAnchorAdd: e.useCallback(() => d(!0), []),
          onCustomAnchorRemove: e.useCallback(() => d(!1), []),
          modal: s,
        },
        r,
      ),
    );
  },
  iu = Xc,
  su = (t) => {
    const { __scopePopover: n, forceMount: r, children: o, container: a } = t,
      i = qc(Zc, n);
    return e.createElement(
      Yc,
      { scope: n, forceMount: r },
      e.createElement(
        W,
        { present: r || i.open },
        e.createElement(H, { asChild: !0, container: a }, o),
      ),
    );
  },
  lu = eu,
  cu = e.forwardRef((n, r) => {
    const { __scopePopover: o, ...a } = n,
      i = qc('PopoverClose', o);
    return e.createElement(
      T.button,
      t({ type: 'button' }, a, { ref: r, onClick: g(n.onClick, () => i.onOpenChange(!1)) }),
    );
  }),
  uu = 'Radio',
  [du, fu] = y(uu),
  [pu, vu] = du(uu),
  mu = e.forwardRef((n, r) => {
    const {
        __scopeRadio: o,
        name: a,
        checked: i = !1,
        required: s,
        disabled: l,
        value: c = 'on',
        onCheck: u,
        ...d
      } = n,
      [f, p] = e.useState(null),
      v = b(r, (e) => p(e)),
      m = e.useRef(!1),
      h = !f || Boolean(f.closest('form'));
    return e.createElement(
      pu,
      { scope: o, checked: i, disabled: l },
      e.createElement(
        T.button,
        t(
          {
            type: 'button',
            role: 'radio',
            'aria-checked': i,
            'data-state': gu(i),
            'data-disabled': l ? '' : void 0,
            disabled: l,
            value: c,
          },
          d,
          {
            ref: v,
            onClick: g(n.onClick, (e) => {
              i || null == u || u(),
                h && ((m.current = e.isPropagationStopped()), m.current || e.stopPropagation());
            }),
          },
        ),
      ),
      h &&
        e.createElement(wu, {
          control: f,
          bubbles: !m.current,
          name: a,
          value: c,
          checked: i,
          required: s,
          disabled: l,
          style: { transform: 'translateX(-100%)' },
        }),
    );
  }),
  hu = e.forwardRef((n, r) => {
    const { __scopeRadio: o, forceMount: a, ...i } = n,
      s = vu('RadioIndicator', o);
    return e.createElement(
      W,
      { present: a || s.checked },
      e.createElement(
        T.span,
        t({ 'data-state': gu(s.checked), 'data-disabled': s.disabled ? '' : void 0 }, i, {
          ref: r,
        }),
      ),
    );
  }),
  wu = (n) => {
    const { control: r, checked: o, bubbles: a = !0, ...i } = n,
      s = e.useRef(null),
      l = $t(o),
      c = Bt(r);
    return (
      e.useEffect(() => {
        const e = s.current,
          t = window.HTMLInputElement.prototype,
          n = Object.getOwnPropertyDescriptor(t, 'checked').set;
        if (l !== o && n) {
          const t = new Event('click', { bubbles: a });
          n.call(e, o), e.dispatchEvent(t);
        }
      }, [l, o, a]),
      e.createElement(
        'input',
        t({ type: 'radio', 'aria-hidden': !0, defaultChecked: o }, i, {
          tabIndex: -1,
          ref: s,
          style: {
            ...n.style,
            ...c,
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
          },
        }),
      )
    );
  };
function gu(e) {
  return e ? 'checked' : 'unchecked';
}
const Eu = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  bu = 'RadioGroup',
  [yu, Cu] = y(bu, [Xs, fu]),
  xu = Xs(),
  Ru = fu(),
  [_u, Su] = yu(bu),
  Du = e.forwardRef((n, r) => {
    const {
        __scopeRadioGroup: o,
        name: a,
        defaultValue: i,
        value: s,
        required: l = !1,
        disabled: c = !1,
        orientation: u,
        dir: d,
        loop: f = !0,
        onValueChange: p,
        ...v
      } = n,
      m = xu(o),
      h = Zi(d),
      [w, g] = z({ prop: s, defaultProp: i, onChange: p });
    return e.createElement(
      _u,
      { scope: o, name: a, required: l, disabled: c, value: w, onValueChange: g },
      e.createElement(
        rl,
        t({ asChild: !0 }, m, { orientation: u, dir: h, loop: f }),
        e.createElement(
          T.div,
          t(
            {
              role: 'radiogroup',
              'aria-required': l,
              'aria-orientation': u,
              'data-disabled': c ? '' : void 0,
              dir: h,
            },
            v,
            { ref: r },
          ),
        ),
      ),
    );
  }),
  Pu = e.forwardRef((n, r) => {
    const { __scopeRadioGroup: o, disabled: a, ...i } = n,
      s = Su('RadioGroupItem', o),
      l = s.disabled || a,
      c = xu(o),
      u = Ru(o),
      d = e.useRef(null),
      f = b(r, d),
      p = s.value === i.value,
      v = e.useRef(!1);
    return (
      e.useEffect(() => {
        const e = (e) => {
            Eu.includes(e.key) && (v.current = !0);
          },
          t = () => (v.current = !1);
        return (
          document.addEventListener('keydown', e),
          document.addEventListener('keyup', t),
          () => {
            document.removeEventListener('keydown', e), document.removeEventListener('keyup', t);
          }
        );
      }, []),
      e.createElement(
        ol,
        t({ asChild: !0 }, c, { focusable: !l, active: p }),
        e.createElement(
          mu,
          t({ disabled: l, required: s.required, checked: p }, u, i, {
            name: s.name,
            ref: f,
            onCheck: () => s.onValueChange(i.value),
            onKeyDown: g((e) => {
              'Enter' === e.key && e.preventDefault();
            }),
            onFocus: g(i.onFocus, () => {
              var e;
              v.current && (null === (e = d.current) || void 0 === e || e.click());
            }),
          }),
        ),
      )
    );
  }),
  Tu = e.forwardRef((n, r) => {
    const { __scopeRadioGroup: o, ...a } = n,
      i = Ru(o);
    return e.createElement(hu, t({}, i, a, { ref: r }));
  }),
  Mu = 'Collapsible',
  [Ou, ku] = y(Mu),
  [Iu, Au] = Ou(Mu),
  Lu = e.forwardRef((n, r) => {
    const {
        __scopeCollapsible: o,
        open: a,
        defaultOpen: i,
        disabled: s,
        onOpenChange: l,
        ...c
      } = n,
      [u = !1, d] = z({ prop: a, defaultProp: i, onChange: l });
    return e.createElement(
      Iu,
      {
        scope: o,
        disabled: s,
        contentId: Pe(),
        open: u,
        onOpenToggle: e.useCallback(() => d((e) => !e), [d]),
      },
      e.createElement(
        T.div,
        t({ 'data-state': $u(u), 'data-disabled': s ? '' : void 0 }, c, { ref: r }),
      ),
    );
  }),
  Nu = e.forwardRef((n, r) => {
    const { __scopeCollapsible: o, ...a } = n,
      i = Au('CollapsibleTrigger', o);
    return e.createElement(
      T.button,
      t(
        {
          type: 'button',
          'aria-controls': i.contentId,
          'aria-expanded': i.open || !1,
          'data-state': $u(i.open),
          'data-disabled': i.disabled ? '' : void 0,
          disabled: i.disabled,
        },
        a,
        { ref: r, onClick: g(n.onClick, i.onOpenToggle) },
      ),
    );
  }),
  Fu = 'CollapsibleContent',
  ju = e.forwardRef((n, r) => {
    const { forceMount: o, ...a } = n,
      i = Au(Fu, n.__scopeCollapsible);
    return e.createElement(W, { present: o || i.open }, ({ present: n }) =>
      e.createElement(Ku, t({}, a, { ref: r, present: n })),
    );
  }),
  Ku = e.forwardRef((n, r) => {
    const { __scopeCollapsible: o, present: a, children: i, ...s } = n,
      l = Au(Fu, o),
      [c, u] = e.useState(a),
      d = e.useRef(null),
      f = b(r, d),
      p = e.useRef(0),
      v = p.current,
      m = e.useRef(0),
      h = m.current,
      w = l.open || c,
      g = e.useRef(w),
      E = e.useRef();
    return (
      e.useEffect(() => {
        const e = requestAnimationFrame(() => (g.current = !1));
        return () => cancelAnimationFrame(e);
      }, []),
      V(() => {
        const e = d.current;
        if (e) {
          (E.current = E.current || {
            transitionDuration: e.style.transitionDuration,
            animationName: e.style.animationName,
          }),
            (e.style.transitionDuration = '0s'),
            (e.style.animationName = 'none');
          const t = e.getBoundingClientRect();
          (p.current = t.height),
            (m.current = t.width),
            g.current ||
              ((e.style.transitionDuration = E.current.transitionDuration),
              (e.style.animationName = E.current.animationName)),
            u(a);
        }
      }, [l.open, a]),
      e.createElement(
        T.div,
        t(
          {
            'data-state': $u(l.open),
            'data-disabled': l.disabled ? '' : void 0,
            id: l.contentId,
            hidden: !w,
          },
          s,
          {
            ref: f,
            style: {
              '--radix-collapsible-content-height': v ? `${v}px` : void 0,
              '--radix-collapsible-content-width': h ? `${h}px` : void 0,
              ...n.style,
            },
          },
        ),
        w && i,
      )
    );
  });
function $u(e) {
  return e ? 'open' : 'closed';
}
const Bu = Lu,
  Hu = Nu,
  Vu = ju,
  Wu = 'Accordion',
  Uu = ['Home', 'End', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'],
  [zu, Gu, qu] = P(Wu),
  [Xu, Zu] = y(Wu, [qu, ku]),
  Yu = ku(),
  Ju = n.forwardRef((e, r) => {
    const { type: o, ...a } = e,
      i = a,
      s = a;
    return n.createElement(
      zu.Provider,
      { scope: e.__scopeAccordion },
      'multiple' === o
        ? n.createElement(od, t({}, s, { ref: r }))
        : n.createElement(rd, t({}, i, { ref: r })),
    );
  });
Ju.propTypes = {
  type(e) {
    const t = e.value || e.defaultValue;
    return e.type && !['single', 'multiple'].includes(e.type)
      ? new Error(
          'Invalid prop `type` supplied to `Accordion`. Expected one of `single | multiple`.',
        )
      : 'multiple' === e.type && 'string' == typeof t
        ? new Error(
            'Invalid prop `type` supplied to `Accordion`. Expected `single` when `defaultValue` or `value` is type `string`.',
          )
        : 'single' === e.type && Array.isArray(t)
          ? new Error(
              'Invalid prop `type` supplied to `Accordion`. Expected `multiple` when `defaultValue` or `value` is type `string[]`.',
            )
          : null;
  },
};
const [Qu, ed] = Xu(Wu),
  [td, nd] = Xu(Wu, { collapsible: !1 }),
  rd = n.forwardRef((e, r) => {
    const { value: o, defaultValue: a, onValueChange: i = () => {}, collapsible: s = !1, ...l } = e,
      [c, u] = z({ prop: o, defaultProp: a, onChange: i });
    return n.createElement(
      Qu,
      {
        scope: e.__scopeAccordion,
        value: c ? [c] : [],
        onItemOpen: u,
        onItemClose: n.useCallback(() => s && u(''), [s, u]),
      },
      n.createElement(
        td,
        { scope: e.__scopeAccordion, collapsible: s },
        n.createElement(sd, t({}, l, { ref: r })),
      ),
    );
  }),
  od = n.forwardRef((e, r) => {
    const { value: o, defaultValue: a, onValueChange: i = () => {}, ...s } = e,
      [l = [], c] = z({ prop: o, defaultProp: a, onChange: i }),
      u = n.useCallback((e) => c((t = []) => [...t, e]), [c]),
      d = n.useCallback((e) => c((t = []) => t.filter((t) => t !== e)), [c]);
    return n.createElement(
      Qu,
      { scope: e.__scopeAccordion, value: l, onItemOpen: u, onItemClose: d },
      n.createElement(
        td,
        { scope: e.__scopeAccordion, collapsible: !0 },
        n.createElement(sd, t({}, s, { ref: r })),
      ),
    );
  }),
  [ad, id] = Xu(Wu),
  sd = n.forwardRef((e, r) => {
    const { __scopeAccordion: o, disabled: a, dir: i, orientation: s = 'vertical', ...l } = e,
      c = b(n.useRef(null), r),
      u = Gu(o),
      d = 'ltr' === Zi(i),
      f = g(e.onKeyDown, (e) => {
        var t;
        if (!Uu.includes(e.key)) return;
        const n = e.target,
          r = u().filter((e) => {
            var t;
            return !(null !== (t = e.ref.current) && void 0 !== t && t.disabled);
          }),
          o = r.findIndex((e) => e.ref.current === n),
          a = r.length;
        if (-1 === o) return;
        e.preventDefault();
        let i = o;
        const l = a - 1,
          c = () => {
            (i = o + 1), i > l && (i = 0);
          },
          f = () => {
            (i = o - 1), i < 0 && (i = l);
          };
        switch (e.key) {
          case 'Home':
            i = 0;
            break;
          case 'End':
            i = l;
            break;
          case 'ArrowRight':
            'horizontal' === s && (d ? c() : f());
            break;
          case 'ArrowDown':
            'vertical' === s && c();
            break;
          case 'ArrowLeft':
            'horizontal' === s && (d ? f() : c());
            break;
          case 'ArrowUp':
            'vertical' === s && f();
        }
        null === (t = r[i % a].ref.current) || void 0 === t || t.focus();
      });
    return n.createElement(
      ad,
      { scope: o, disabled: a, direction: i, orientation: s },
      n.createElement(
        zu.Slot,
        { scope: o },
        n.createElement(
          T.div,
          t({}, l, { 'data-orientation': s, ref: c, onKeyDown: a ? void 0 : f }),
        ),
      ),
    );
  }),
  ld = 'AccordionItem',
  [cd, ud] = Xu(ld),
  dd = 'AccordionTrigger';
function fd(e) {
  return e ? 'open' : 'closed';
}
const pd = Ju,
  vd = n.forwardRef((e, r) => {
    const { __scopeAccordion: o, value: a, ...i } = e,
      s = id(ld, o),
      l = ed(ld, o),
      c = Yu(o),
      u = Pe(),
      d = (a && l.value.includes(a)) || !1,
      f = s.disabled || e.disabled;
    return n.createElement(
      cd,
      { scope: o, open: d, disabled: f, triggerId: u },
      n.createElement(
        Bu,
        t({ 'data-orientation': s.orientation, 'data-state': fd(d) }, c, i, {
          ref: r,
          disabled: f,
          open: d,
          onOpenChange: (e) => {
            e ? l.onItemOpen(a) : l.onItemClose(a);
          },
        }),
      ),
    );
  }),
  md = n.forwardRef((e, r) => {
    const { __scopeAccordion: o, ...a } = e,
      i = id(Wu, o),
      s = ud('AccordionHeader', o);
    return n.createElement(
      T.h3,
      t(
        {
          'data-orientation': i.orientation,
          'data-state': fd(s.open),
          'data-disabled': s.disabled ? '' : void 0,
        },
        a,
        { ref: r },
      ),
    );
  }),
  hd = n.forwardRef((e, r) => {
    const { __scopeAccordion: o, ...a } = e,
      i = id(Wu, o),
      s = ud(dd, o),
      l = nd(dd, o),
      c = Yu(o);
    return n.createElement(
      zu.ItemSlot,
      { scope: o },
      n.createElement(
        Hu,
        t(
          {
            'aria-disabled': (s.open && !l.collapsible) || void 0,
            'data-orientation': i.orientation,
            id: s.triggerId,
          },
          c,
          a,
          { ref: r },
        ),
      ),
    );
  }),
  wd = n.forwardRef((e, r) => {
    const { __scopeAccordion: o, ...a } = e,
      i = id(Wu, o),
      s = ud('AccordionContent', o),
      l = Yu(o);
    return n.createElement(
      Vu,
      t(
        { role: 'region', 'aria-labelledby': s.triggerId, 'data-orientation': i.orientation },
        l,
        a,
        {
          ref: r,
          style: {
            '--radix-accordion-content-height': 'var(--radix-collapsible-content-height)',
            '--radix-accordion-content-width': 'var(--radix-collapsible-content-width)',
            ...e.style,
          },
        },
      ),
    );
  });
export {
  Re as $,
  Wi as A,
  Ui as B,
  ni as C,
  Gi as D,
  xs as E,
  Rs as F,
  ri as G,
  _s as H,
  ai as I,
  Ss as J,
  Os as K,
  oi as L,
  $s as M,
  Bs as N,
  vl as O,
  ti as P,
  ml as Q,
  si as R,
  ui as S,
  ei as T,
  hl as U,
  jl as V,
  Kl as W,
  Oc as X,
  kc as Y,
  un as Z,
  $c as _,
  _e as a,
  hn as a0,
  Bc as a1,
  vn as a2,
  Ic as a3,
  Ac as a4,
  Lc as a5,
  Nc as a6,
  Fc as a7,
  Kc as a8,
  fn as a9,
  jc as aa,
  Hc as ab,
  iu as ac,
  su as ad,
  lu as ae,
  au as af,
  cu as ag,
  pl as ah,
  Du as ai,
  Pu as aj,
  Tu as ak,
  vd as al,
  md as am,
  hd as an,
  wd as ao,
  pd as ap,
  ln as aq,
  an as ar,
  Ce as as,
  xe as at,
  gn as au,
  tn as av,
  rn as aw,
  At as b,
  Lt as c,
  jt as d,
  Kt as e,
  Nt as f,
  Ft as g,
  It as h,
  x as i,
  Yt as j,
  Jt as k,
  di as l,
  ii as m,
  li as n,
  ci as o,
  Qa as p,
  ht as q,
  wt as r,
  gt as s,
  yt as t,
  Et as u,
  bt as v,
  vt as w,
  mt as x,
  zi as y,
  Vi as z,
};
