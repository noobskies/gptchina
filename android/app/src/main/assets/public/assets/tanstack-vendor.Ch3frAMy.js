import { x as e, r as t, a as n } from './vendor.BwD-2nqP.js';
class o {
  constructor() {
    (this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this));
  }
  subscribe(e) {
    const t = { listener: e };
    return (
      this.listeners.add(t),
      this.onSubscribe(),
      () => {
        this.listeners.delete(t), this.onUnsubscribe();
      }
    );
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {}
  onUnsubscribe() {}
}
const i = 'undefined' == typeof window || 'Deno' in window;
function s() {}
function l(e) {
  return 'number' == typeof e && e >= 0 && e !== 1 / 0;
}
function r(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function a(e, t, n) {
  return w(e)
    ? 'function' == typeof t
      ? { ...n, queryKey: e, queryFn: t }
      : { ...t, queryKey: e }
    : e;
}
function u(e, t, n) {
  return w(e) ? [{ ...t, queryKey: e }, n] : [e || {}, t];
}
function c(e, t) {
  const { type: n = 'all', exact: o, fetchStatus: i, predicate: s, queryKey: l, stale: r } = e;
  if (w(l))
    if (o) {
      if (t.queryHash !== h(l, t.options)) return !1;
    } else if (!f(t.queryKey, l)) return !1;
  if ('all' !== n) {
    const e = t.isActive();
    if ('active' === n && !e) return !1;
    if ('inactive' === n && e) return !1;
  }
  return (
    ('boolean' != typeof r || t.isStale() === r) &&
    (void 0 === i || i === t.state.fetchStatus) &&
    !(s && !s(t))
  );
}
function d(e, t) {
  const { exact: n, fetching: o, predicate: i, mutationKey: s } = e;
  if (w(s)) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (g(t.options.mutationKey) !== g(s)) return !1;
    } else if (!f(t.options.mutationKey, s)) return !1;
  }
  return ('boolean' != typeof o || ('loading' === t.state.status) === o) && !(i && !i(t));
}
function h(e, t) {
  return ((null == t ? void 0 : t.queryKeyHashFn) || g)(e);
}
function g(e) {
  return JSON.stringify(e, (e, t) =>
    y(t)
      ? Object.keys(t)
          .sort()
          .reduce((e, n) => ((e[n] = t[n]), e), {})
      : t,
  );
}
function f(e, t) {
  return p(e, t);
}
function p(e, t) {
  return (
    e === t ||
    (typeof e == typeof t &&
      !(!e || !t || 'object' != typeof e || 'object' != typeof t) &&
      !Object.keys(t).some((n) => !p(e[n], t[n])))
  );
}
function m(e, t) {
  if (e === t) return e;
  const n = b(e) && b(t);
  if (n || (y(e) && y(t))) {
    const o = n ? e.length : Object.keys(e).length,
      i = n ? t : Object.keys(t),
      s = i.length,
      l = n ? [] : {};
    let r = 0;
    for (let a = 0; a < s; a++) {
      const o = n ? a : i[a];
      (l[o] = m(e[o], t[o])), l[o] === e[o] && r++;
    }
    return o === s && r === o ? e : l;
  }
  return t;
}
function v(e, t) {
  if ((e && !t) || (t && !e)) return !1;
  for (const n in e) if (e[n] !== t[n]) return !1;
  return !0;
}
function b(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function y(e) {
  if (!C(e)) return !1;
  const t = e.constructor;
  if (void 0 === t) return !0;
  const n = t.prototype;
  return !!C(n) && !!n.hasOwnProperty('isPrototypeOf');
}
function C(e) {
  return '[object Object]' === Object.prototype.toString.call(e);
}
function w(e) {
  return Array.isArray(e);
}
function S(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function R(e) {
  S(0).then(e);
}
function F(e, t, n) {
  return null != n.isDataEqual && n.isDataEqual(e, t)
    ? e
    : 'function' == typeof n.structuralSharing
      ? n.structuralSharing(e, t)
      : !1 !== n.structuralSharing
        ? m(e, t)
        : t;
}
const M = new (class extends o {
    constructor() {
      super(),
        (this.setup = (e) => {
          if (!i && window.addEventListener) {
            const t = () => e();
            return (
              window.addEventListener('visibilitychange', t, !1),
              window.addEventListener('focus', t, !1),
              () => {
                window.removeEventListener('visibilitychange', t),
                  window.removeEventListener('focus', t);
              }
            );
          }
        });
    }
    onSubscribe() {
      this.cleanup || this.setEventListener(this.setup);
    }
    onUnsubscribe() {
      var e;
      this.hasListeners() || (null == (e = this.cleanup) || e.call(this), (this.cleanup = void 0));
    }
    setEventListener(e) {
      var t;
      (this.setup = e),
        null == (t = this.cleanup) || t.call(this),
        (this.cleanup = e((e) => {
          'boolean' == typeof e ? this.setFocused(e) : this.onFocus();
        }));
    }
    setFocused(e) {
      this.focused !== e && ((this.focused = e), this.onFocus());
    }
    onFocus() {
      this.listeners.forEach(({ listener: e }) => {
        e();
      });
    }
    isFocused() {
      return 'boolean' == typeof this.focused
        ? this.focused
        : 'undefined' == typeof document ||
            [void 0, 'visible', 'prerender'].includes(document.visibilityState);
    }
  })(),
  x = ['online', 'offline'];
const P = new (class extends o {
  constructor() {
    super(),
      (this.setup = (e) => {
        if (!i && window.addEventListener) {
          const t = () => e();
          return (
            x.forEach((e) => {
              window.addEventListener(e, t, !1);
            }),
            () => {
              x.forEach((e) => {
                window.removeEventListener(e, t);
              });
            }
          );
        }
      });
  }
  onSubscribe() {
    this.cleanup || this.setEventListener(this.setup);
  }
  onUnsubscribe() {
    var e;
    this.hasListeners() || (null == (e = this.cleanup) || e.call(this), (this.cleanup = void 0));
  }
  setEventListener(e) {
    var t;
    (this.setup = e),
      null == (t = this.cleanup) || t.call(this),
      (this.cleanup = e((e) => {
        'boolean' == typeof e ? this.setOnline(e) : this.onOnline();
      }));
  }
  setOnline(e) {
    this.online !== e && ((this.online = e), this.onOnline());
  }
  onOnline() {
    this.listeners.forEach(({ listener: e }) => {
      e();
    });
  }
  isOnline() {
    return 'boolean' == typeof this.online
      ? this.online
      : 'undefined' == typeof navigator || void 0 === navigator.onLine || navigator.onLine;
  }
})();
function I(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function O(e) {
  return 'online' !== (null != e ? e : 'online') || P.isOnline();
}
class E {
  constructor(e) {
    (this.revert = null == e ? void 0 : e.revert), (this.silent = null == e ? void 0 : e.silent);
  }
}
function A(e) {
  return e instanceof E;
}
function V(e) {
  let t,
    n,
    o,
    i = !1,
    s = 0,
    l = !1;
  const r = new Promise((e, t) => {
      (n = e), (o = t);
    }),
    a = () => !M.isFocused() || ('always' !== e.networkMode && !P.isOnline()),
    u = (o) => {
      l || ((l = !0), null == e.onSuccess || e.onSuccess(o), null == t || t(), n(o));
    },
    c = (n) => {
      l || ((l = !0), null == e.onError || e.onError(n), null == t || t(), o(n));
    },
    d = () =>
      new Promise((n) => {
        (t = (e) => {
          const t = l || !a();
          return t && n(e), t;
        }),
          null == e.onPause || e.onPause();
      }).then(() => {
        (t = void 0), l || null == e.onContinue || e.onContinue();
      }),
    h = () => {
      if (l) return;
      let t;
      try {
        t = e.fn();
      } catch (n) {
        t = Promise.reject(n);
      }
      Promise.resolve(t)
        .then(u)
        .catch((t) => {
          var n, o;
          if (l) return;
          const r = null != (n = e.retry) ? n : 3,
            u = null != (o = e.retryDelay) ? o : I,
            g = 'function' == typeof u ? u(s, t) : u,
            f = !0 === r || ('number' == typeof r && s < r) || ('function' == typeof r && r(s, t));
          !i && f
            ? (s++,
              null == e.onFail || e.onFail(s, t),
              S(g)
                .then(() => {
                  if (a()) return d();
                })
                .then(() => {
                  i ? c(t) : h();
                }))
            : c(t);
        });
    };
  return (
    O(e.networkMode) ? h() : d().then(h),
    {
      promise: r,
      cancel: (t) => {
        l || (c(new E(t)), null == e.abort || e.abort());
      },
      continue: () => ((null == t ? void 0 : t()) ? r : Promise.resolve()),
      cancelRetry: () => {
        i = !0;
      },
      continueRetry: () => {
        i = !1;
      },
    }
  );
}
const D = console;
const _ = (function () {
  let e = [],
    t = 0,
    n = (e) => {
      e();
    },
    o = (e) => {
      e();
    };
  const i = (o) => {
      t
        ? e.push(o)
        : R(() => {
            n(o);
          });
    },
    s = () => {
      const t = e;
      (e = []),
        t.length &&
          R(() => {
            o(() => {
              t.forEach((e) => {
                n(e);
              });
            });
          });
    };
  return {
    batch: (e) => {
      let n;
      t++;
      try {
        n = e();
      } finally {
        t--, t || s();
      }
      return n;
    },
    batchCalls:
      (e) =>
      (...t) => {
        i(() => {
          e(...t);
        });
      },
    schedule: i,
    setNotifyFunction: (e) => {
      n = e;
    },
    setBatchNotifyFunction: (e) => {
      o = e;
    },
  };
})();
class z {
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout(),
      l(this.cacheTime) &&
        (this.gcTimeout = setTimeout(() => {
          this.optionalRemove();
        }, this.cacheTime));
  }
  updateCacheTime(e) {
    this.cacheTime = Math.max(this.cacheTime || 0, null != e ? e : i ? 1 / 0 : 3e5);
  }
  clearGcTimeout() {
    this.gcTimeout && (clearTimeout(this.gcTimeout), (this.gcTimeout = void 0));
  }
}
class q extends z {
  constructor(e) {
    super(),
      (this.abortSignalConsumed = !1),
      (this.defaultOptions = e.defaultOptions),
      this.setOptions(e.options),
      (this.observers = []),
      (this.cache = e.cache),
      (this.logger = e.logger || D),
      (this.queryKey = e.queryKey),
      (this.queryHash = e.queryHash),
      (this.initialState =
        e.state ||
        (function (e) {
          const t = 'function' == typeof e.initialData ? e.initialData() : e.initialData,
            n = void 0 !== t,
            o = n
              ? 'function' == typeof e.initialDataUpdatedAt
                ? e.initialDataUpdatedAt()
                : e.initialDataUpdatedAt
              : 0;
          return {
            data: t,
            dataUpdateCount: 0,
            dataUpdatedAt: n ? (null != o ? o : Date.now()) : 0,
            error: null,
            errorUpdateCount: 0,
            errorUpdatedAt: 0,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: null,
            isInvalidated: !1,
            status: n ? 'success' : 'loading',
            fetchStatus: 'idle',
          };
        })(this.options)),
      (this.state = this.initialState),
      this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  setOptions(e) {
    (this.options = { ...this.defaultOptions, ...e }), this.updateCacheTime(this.options.cacheTime);
  }
  optionalRemove() {
    this.observers.length || 'idle' !== this.state.fetchStatus || this.cache.remove(this);
  }
  setData(e, t) {
    const n = F(this.state.data, e, this.options);
    return (
      this.dispatch({
        data: n,
        type: 'success',
        dataUpdatedAt: null == t ? void 0 : t.updatedAt,
        manual: null == t ? void 0 : t.manual,
      }),
      n
    );
  }
  setState(e, t) {
    this.dispatch({ type: 'setState', state: e, setStateOptions: t });
  }
  cancel(e) {
    var t;
    const n = this.promise;
    return null == (t = this.retryer) || t.cancel(e), n ? n.then(s).catch(s) : Promise.resolve();
  }
  destroy() {
    super.destroy(), this.cancel({ silent: !0 });
  }
  reset() {
    this.destroy(), this.setState(this.initialState);
  }
  isActive() {
    return this.observers.some((e) => !1 !== e.options.enabled);
  }
  isDisabled() {
    return this.getObserversCount() > 0 && !this.isActive();
  }
  isStale() {
    return (
      this.state.isInvalidated ||
      !this.state.dataUpdatedAt ||
      this.observers.some((e) => e.getCurrentResult().isStale)
    );
  }
  isStaleByTime(e = 0) {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || !r(this.state.dataUpdatedAt, e);
  }
  onFocus() {
    var e;
    const t = this.observers.find((e) => e.shouldFetchOnWindowFocus());
    t && t.refetch({ cancelRefetch: !1 }), null == (e = this.retryer) || e.continue();
  }
  onOnline() {
    var e;
    const t = this.observers.find((e) => e.shouldFetchOnReconnect());
    t && t.refetch({ cancelRefetch: !1 }), null == (e = this.retryer) || e.continue();
  }
  addObserver(e) {
    this.observers.includes(e) ||
      (this.observers.push(e),
      this.clearGcTimeout(),
      this.cache.notify({ type: 'observerAdded', query: this, observer: e }));
  }
  removeObserver(e) {
    this.observers.includes(e) &&
      ((this.observers = this.observers.filter((t) => t !== e)),
      this.observers.length ||
        (this.retryer &&
          (this.abortSignalConsumed
            ? this.retryer.cancel({ revert: !0 })
            : this.retryer.cancelRetry()),
        this.scheduleGc()),
      this.cache.notify({ type: 'observerRemoved', query: this, observer: e }));
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    this.state.isInvalidated || this.dispatch({ type: 'invalidate' });
  }
  fetch(e, t) {
    var n, o;
    if ('idle' !== this.state.fetchStatus)
      if (this.state.dataUpdatedAt && null != t && t.cancelRefetch) this.cancel({ silent: !0 });
      else if (this.promise) {
        var i;
        return null == (i = this.retryer) || i.continueRetry(), this.promise;
      }
    if ((e && this.setOptions(e), !this.options.queryFn)) {
      const e = this.observers.find((e) => e.options.queryFn);
      e && this.setOptions(e.options);
    }
    const s = (function () {
        if ('function' == typeof AbortController) return new AbortController();
      })(),
      l = { queryKey: this.queryKey, pageParam: void 0, meta: this.meta },
      r = (e) => {
        Object.defineProperty(e, 'signal', {
          enumerable: !0,
          get: () => {
            if (s) return (this.abortSignalConsumed = !0), s.signal;
          },
        });
      };
    r(l);
    const a = {
      fetchOptions: t,
      options: this.options,
      queryKey: this.queryKey,
      state: this.state,
      fetchFn: () =>
        this.options.queryFn
          ? ((this.abortSignalConsumed = !1), this.options.queryFn(l))
          : Promise.reject("Missing queryFn for queryKey '" + this.options.queryHash + "'"),
    };
    var u;
    (r(a),
    null == (n = this.options.behavior) || n.onFetch(a),
    (this.revertState = this.state),
    'idle' === this.state.fetchStatus ||
      this.state.fetchMeta !== (null == (o = a.fetchOptions) ? void 0 : o.meta)) &&
      this.dispatch({ type: 'fetch', meta: null == (u = a.fetchOptions) ? void 0 : u.meta });
    const c = (e) => {
      var t, n, o, i;
      ((A(e) && e.silent) || this.dispatch({ type: 'error', error: e }), A(e)) ||
        (null == (t = (n = this.cache.config).onError) || t.call(n, e, this),
        null == (o = (i = this.cache.config).onSettled) || o.call(i, this.state.data, e, this));
      this.isFetchingOptimistic || this.scheduleGc(), (this.isFetchingOptimistic = !1);
    };
    return (
      (this.retryer = V({
        fn: a.fetchFn,
        abort: null == s ? void 0 : s.abort.bind(s),
        onSuccess: (e) => {
          var t, n, o, i;
          void 0 !== e
            ? (this.setData(e),
              null == (t = (n = this.cache.config).onSuccess) || t.call(n, e, this),
              null == (o = (i = this.cache.config).onSettled) ||
                o.call(i, e, this.state.error, this),
              this.isFetchingOptimistic || this.scheduleGc(),
              (this.isFetchingOptimistic = !1))
            : c(new Error(this.queryHash + ' data is undefined'));
        },
        onError: c,
        onFail: (e, t) => {
          this.dispatch({ type: 'failed', failureCount: e, error: t });
        },
        onPause: () => {
          this.dispatch({ type: 'pause' });
        },
        onContinue: () => {
          this.dispatch({ type: 'continue' });
        },
        retry: a.options.retry,
        retryDelay: a.options.retryDelay,
        networkMode: a.options.networkMode,
      })),
      (this.promise = this.retryer.promise),
      this.promise
    );
  }
  dispatch(e) {
    (this.state = ((t) => {
      var n, o;
      switch (e.type) {
        case 'failed':
          return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
        case 'pause':
          return { ...t, fetchStatus: 'paused' };
        case 'continue':
          return { ...t, fetchStatus: 'fetching' };
        case 'fetch':
          return {
            ...t,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: null != (n = e.meta) ? n : null,
            fetchStatus: O(this.options.networkMode) ? 'fetching' : 'paused',
            ...(!t.dataUpdatedAt && { error: null, status: 'loading' }),
          };
        case 'success':
          return {
            ...t,
            data: e.data,
            dataUpdateCount: t.dataUpdateCount + 1,
            dataUpdatedAt: null != (o = e.dataUpdatedAt) ? o : Date.now(),
            error: null,
            isInvalidated: !1,
            status: 'success',
            ...(!e.manual && {
              fetchStatus: 'idle',
              fetchFailureCount: 0,
              fetchFailureReason: null,
            }),
          };
        case 'error':
          const i = e.error;
          return A(i) && i.revert && this.revertState
            ? { ...this.revertState, fetchStatus: 'idle' }
            : {
                ...t,
                error: i,
                errorUpdateCount: t.errorUpdateCount + 1,
                errorUpdatedAt: Date.now(),
                fetchFailureCount: t.fetchFailureCount + 1,
                fetchFailureReason: i,
                fetchStatus: 'idle',
                status: 'error',
              };
        case 'invalidate':
          return { ...t, isInvalidated: !0 };
        case 'setState':
          return { ...t, ...e.state };
      }
    })(this.state)),
      _.batch(() => {
        this.observers.forEach((t) => {
          t.onQueryUpdate(e);
        }),
          this.cache.notify({ query: this, type: 'updated', action: e });
      });
  }
}
class T extends o {
  constructor(e) {
    super(), (this.config = e || {}), (this.queries = []), (this.queriesMap = {});
  }
  build(e, t, n) {
    var o;
    const i = t.queryKey,
      s = null != (o = t.queryHash) ? o : h(i, t);
    let l = this.get(s);
    return (
      l ||
        ((l = new q({
          cache: this,
          logger: e.getLogger(),
          queryKey: i,
          queryHash: s,
          options: e.defaultQueryOptions(t),
          state: n,
          defaultOptions: e.getQueryDefaults(i),
        })),
        this.add(l)),
      l
    );
  }
  add(e) {
    this.queriesMap[e.queryHash] ||
      ((this.queriesMap[e.queryHash] = e),
      this.queries.push(e),
      this.notify({ type: 'added', query: e }));
  }
  remove(e) {
    const t = this.queriesMap[e.queryHash];
    t &&
      (e.destroy(),
      (this.queries = this.queries.filter((t) => t !== e)),
      t === e && delete this.queriesMap[e.queryHash],
      this.notify({ type: 'removed', query: e }));
  }
  clear() {
    _.batch(() => {
      this.queries.forEach((e) => {
        this.remove(e);
      });
    });
  }
  get(e) {
    return this.queriesMap[e];
  }
  getAll() {
    return this.queries;
  }
  find(e, t) {
    const [n] = u(e, t);
    return void 0 === n.exact && (n.exact = !0), this.queries.find((e) => c(n, e));
  }
  findAll(e, t) {
    const [n] = u(e, t);
    return Object.keys(n).length > 0 ? this.queries.filter((e) => c(n, e)) : this.queries;
  }
  notify(e) {
    _.batch(() => {
      this.listeners.forEach(({ listener: t }) => {
        t(e);
      });
    });
  }
  onFocus() {
    _.batch(() => {
      this.queries.forEach((e) => {
        e.onFocus();
      });
    });
  }
  onOnline() {
    _.batch(() => {
      this.queries.forEach((e) => {
        e.onOnline();
      });
    });
  }
}
class L extends z {
  constructor(e) {
    super(),
      (this.defaultOptions = e.defaultOptions),
      (this.mutationId = e.mutationId),
      (this.mutationCache = e.mutationCache),
      (this.logger = e.logger || D),
      (this.observers = []),
      (this.state = e.state || {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: !1,
        status: 'idle',
        variables: void 0,
      }),
      this.setOptions(e.options),
      this.scheduleGc();
  }
  setOptions(e) {
    (this.options = { ...this.defaultOptions, ...e }), this.updateCacheTime(this.options.cacheTime);
  }
  get meta() {
    return this.options.meta;
  }
  setState(e) {
    this.dispatch({ type: 'setState', state: e });
  }
  addObserver(e) {
    this.observers.includes(e) ||
      (this.observers.push(e),
      this.clearGcTimeout(),
      this.mutationCache.notify({ type: 'observerAdded', mutation: this, observer: e }));
  }
  removeObserver(e) {
    (this.observers = this.observers.filter((t) => t !== e)),
      this.scheduleGc(),
      this.mutationCache.notify({ type: 'observerRemoved', mutation: this, observer: e });
  }
  optionalRemove() {
    this.observers.length ||
      ('loading' === this.state.status ? this.scheduleGc() : this.mutationCache.remove(this));
  }
  continue() {
    var e, t;
    return null != (e = null == (t = this.retryer) ? void 0 : t.continue()) ? e : this.execute();
  }
  async execute() {
    const e = () => {
        var e;
        return (
          (this.retryer = V({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(this.state.variables)
                : Promise.reject('No mutationFn found'),
            onFail: (e, t) => {
              this.dispatch({ type: 'failed', failureCount: e, error: t });
            },
            onPause: () => {
              this.dispatch({ type: 'pause' });
            },
            onContinue: () => {
              this.dispatch({ type: 'continue' });
            },
            retry: null != (e = this.options.retry) ? e : 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
          })),
          this.retryer.promise
        );
      },
      t = 'loading' === this.state.status;
    try {
      var n, o, i, s, l, r, a, u;
      if (!t) {
        var c, d, h, g;
        this.dispatch({ type: 'loading', variables: this.options.variables }),
          await (null == (c = (d = this.mutationCache.config).onMutate)
            ? void 0
            : c.call(d, this.state.variables, this));
        const e = await (null == (h = (g = this.options).onMutate)
          ? void 0
          : h.call(g, this.state.variables));
        e !== this.state.context &&
          this.dispatch({ type: 'loading', context: e, variables: this.state.variables });
      }
      const f = await e();
      return (
        await (null == (n = (o = this.mutationCache.config).onSuccess)
          ? void 0
          : n.call(o, f, this.state.variables, this.state.context, this)),
        await (null == (i = (s = this.options).onSuccess)
          ? void 0
          : i.call(s, f, this.state.variables, this.state.context)),
        await (null == (l = (r = this.mutationCache.config).onSettled)
          ? void 0
          : l.call(r, f, null, this.state.variables, this.state.context, this)),
        await (null == (a = (u = this.options).onSettled)
          ? void 0
          : a.call(u, f, null, this.state.variables, this.state.context)),
        this.dispatch({ type: 'success', data: f }),
        f
      );
    } catch (S) {
      try {
        var f, p, m, v, b, y, C, w;
        throw (
          (await (null == (f = (p = this.mutationCache.config).onError)
            ? void 0
            : f.call(p, S, this.state.variables, this.state.context, this)),
          await (null == (m = (v = this.options).onError)
            ? void 0
            : m.call(v, S, this.state.variables, this.state.context)),
          await (null == (b = (y = this.mutationCache.config).onSettled)
            ? void 0
            : b.call(y, void 0, S, this.state.variables, this.state.context, this)),
          await (null == (C = (w = this.options).onSettled)
            ? void 0
            : C.call(w, void 0, S, this.state.variables, this.state.context)),
          S)
        );
      } finally {
        this.dispatch({ type: 'error', error: S });
      }
    }
  }
  dispatch(e) {
    (this.state = ((t) => {
      switch (e.type) {
        case 'failed':
          return { ...t, failureCount: e.failureCount, failureReason: e.error };
        case 'pause':
          return { ...t, isPaused: !0 };
        case 'continue':
          return { ...t, isPaused: !1 };
        case 'loading':
          return {
            ...t,
            context: e.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: !O(this.options.networkMode),
            status: 'loading',
            variables: e.variables,
          };
        case 'success':
          return {
            ...t,
            data: e.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: 'success',
            isPaused: !1,
          };
        case 'error':
          return {
            ...t,
            data: void 0,
            error: e.error,
            failureCount: t.failureCount + 1,
            failureReason: e.error,
            isPaused: !1,
            status: 'error',
          };
        case 'setState':
          return { ...t, ...e.state };
      }
    })(this.state)),
      _.batch(() => {
        this.observers.forEach((t) => {
          t.onMutationUpdate(e);
        }),
          this.mutationCache.notify({ mutation: this, type: 'updated', action: e });
      });
  }
}
class k extends o {
  constructor(e) {
    super(), (this.config = e || {}), (this.mutations = []), (this.mutationId = 0);
  }
  build(e, t, n) {
    const o = new L({
      mutationCache: this,
      logger: e.getLogger(),
      mutationId: ++this.mutationId,
      options: e.defaultMutationOptions(t),
      state: n,
      defaultOptions: t.mutationKey ? e.getMutationDefaults(t.mutationKey) : void 0,
    });
    return this.add(o), o;
  }
  add(e) {
    this.mutations.push(e), this.notify({ type: 'added', mutation: e });
  }
  remove(e) {
    (this.mutations = this.mutations.filter((t) => t !== e)),
      this.notify({ type: 'removed', mutation: e });
  }
  clear() {
    _.batch(() => {
      this.mutations.forEach((e) => {
        this.remove(e);
      });
    });
  }
  getAll() {
    return this.mutations;
  }
  find(e) {
    return void 0 === e.exact && (e.exact = !0), this.mutations.find((t) => d(e, t));
  }
  findAll(e) {
    return this.mutations.filter((t) => d(e, t));
  }
  notify(e) {
    _.batch(() => {
      this.listeners.forEach(({ listener: t }) => {
        t(e);
      });
    });
  }
  resumePausedMutations() {
    var e;
    return (
      (this.resuming = (null != (e = this.resuming) ? e : Promise.resolve())
        .then(() => {
          const e = this.mutations.filter((e) => e.state.isPaused);
          return _.batch(() =>
            e.reduce((e, t) => e.then(() => t.continue().catch(s)), Promise.resolve()),
          );
        })
        .then(() => {
          this.resuming = void 0;
        })),
      this.resuming
    );
  }
}
function H() {
  return {
    onFetch: (e) => {
      e.fetchFn = () => {
        var t, n, o, i, s, l;
        const r = null == (t = e.fetchOptions) || null == (n = t.meta) ? void 0 : n.refetchPage,
          a = null == (o = e.fetchOptions) || null == (i = o.meta) ? void 0 : i.fetchMore,
          u = null == a ? void 0 : a.pageParam,
          c = 'forward' === (null == a ? void 0 : a.direction),
          d = 'backward' === (null == a ? void 0 : a.direction),
          h = (null == (s = e.state.data) ? void 0 : s.pages) || [],
          g = (null == (l = e.state.data) ? void 0 : l.pageParams) || [];
        let f = g,
          p = !1;
        const m =
            e.options.queryFn ||
            (() => Promise.reject("Missing queryFn for queryKey '" + e.options.queryHash + "'")),
          v = (e, t, n, o) => ((f = o ? [t, ...f] : [...f, t]), o ? [n, ...e] : [...e, n]),
          b = (t, n, o, i) => {
            if (p) return Promise.reject('Cancelled');
            if (void 0 === o && !n && t.length) return Promise.resolve(t);
            const s = { queryKey: e.queryKey, pageParam: o, meta: e.options.meta };
            var l;
            (l = s),
              Object.defineProperty(l, 'signal', {
                enumerable: !0,
                get: () => {
                  var t, n;
                  return (
                    null != (t = e.signal) && t.aborted
                      ? (p = !0)
                      : null == (n = e.signal) ||
                        n.addEventListener('abort', () => {
                          p = !0;
                        }),
                    e.signal
                  );
                },
              });
            const r = m(s);
            return Promise.resolve(r).then((e) => v(t, o, e, i));
          };
        let y;
        if (h.length)
          if (c) {
            const t = void 0 !== u,
              n = t ? u : G(e.options, h);
            y = b(h, t, n);
          } else if (d) {
            const t = void 0 !== u,
              n = t ? u : Q(e.options, h);
            y = b(h, t, n, !0);
          } else {
            f = [];
            const t = void 0 === e.options.getNextPageParam;
            y = !r || !h[0] || r(h[0], 0, h) ? b([], t, g[0]) : Promise.resolve(v([], g[0], h[0]));
            for (let n = 1; n < h.length; n++)
              y = y.then((o) => {
                if (!r || !h[n] || r(h[n], n, h)) {
                  const i = t ? g[n] : G(e.options, o);
                  return b(o, t, i);
                }
                return Promise.resolve(v(o, g[n], h[n]));
              });
          }
        else y = b([]);
        return y.then((e) => ({ pages: e, pageParams: f }));
      };
    },
  };
}
function G(e, t) {
  return null == e.getNextPageParam ? void 0 : e.getNextPageParam(t[t.length - 1], t);
}
function Q(e, t) {
  return null == e.getPreviousPageParam ? void 0 : e.getPreviousPageParam(t[0], t);
}
function U(e, t) {
  if (e.getNextPageParam && Array.isArray(t)) {
    const n = G(e, t);
    return null != n && !1 !== n;
  }
}
function B(e, t) {
  if (e.getPreviousPageParam && Array.isArray(t)) {
    const n = Q(e, t);
    return null != n && !1 !== n;
  }
}
class j {
  constructor(e = {}) {
    (this.queryCache = e.queryCache || new T()),
      (this.mutationCache = e.mutationCache || new k()),
      (this.logger = e.logger || D),
      (this.defaultOptions = e.defaultOptions || {}),
      (this.queryDefaults = []),
      (this.mutationDefaults = []),
      (this.mountCount = 0);
  }
  mount() {
    this.mountCount++,
      1 === this.mountCount &&
        ((this.unsubscribeFocus = M.subscribe(() => {
          M.isFocused() && (this.resumePausedMutations(), this.queryCache.onFocus());
        })),
        (this.unsubscribeOnline = P.subscribe(() => {
          P.isOnline() && (this.resumePausedMutations(), this.queryCache.onOnline());
        })));
  }
  unmount() {
    var e, t;
    this.mountCount--,
      0 === this.mountCount &&
        (null == (e = this.unsubscribeFocus) || e.call(this),
        (this.unsubscribeFocus = void 0),
        null == (t = this.unsubscribeOnline) || t.call(this),
        (this.unsubscribeOnline = void 0));
  }
  isFetching(e, t) {
    const [n] = u(e, t);
    return (n.fetchStatus = 'fetching'), this.queryCache.findAll(n).length;
  }
  isMutating(e) {
    return this.mutationCache.findAll({ ...e, fetching: !0 }).length;
  }
  getQueryData(e, t) {
    var n;
    return null == (n = this.queryCache.find(e, t)) ? void 0 : n.state.data;
  }
  ensureQueryData(e, t, n) {
    const o = a(e, t, n),
      i = this.getQueryData(o.queryKey);
    return i ? Promise.resolve(i) : this.fetchQuery(o);
  }
  getQueriesData(e) {
    return this.getQueryCache()
      .findAll(e)
      .map(({ queryKey: e, state: t }) => [e, t.data]);
  }
  setQueryData(e, t, n) {
    const o = this.queryCache.find(e),
      i = (function (e, t) {
        return 'function' == typeof e ? e(t) : e;
      })(t, null == o ? void 0 : o.state.data);
    if (void 0 === i) return;
    const s = a(e),
      l = this.defaultQueryOptions(s);
    return this.queryCache.build(this, l).setData(i, { ...n, manual: !0 });
  }
  setQueriesData(e, t, n) {
    return _.batch(() =>
      this.getQueryCache()
        .findAll(e)
        .map(({ queryKey: e }) => [e, this.setQueryData(e, t, n)]),
    );
  }
  getQueryState(e, t) {
    var n;
    return null == (n = this.queryCache.find(e, t)) ? void 0 : n.state;
  }
  removeQueries(e, t) {
    const [n] = u(e, t),
      o = this.queryCache;
    _.batch(() => {
      o.findAll(n).forEach((e) => {
        o.remove(e);
      });
    });
  }
  resetQueries(e, t, n) {
    const [o, i] = u(e, t, n),
      s = this.queryCache,
      l = { type: 'active', ...o };
    return _.batch(
      () => (
        s.findAll(o).forEach((e) => {
          e.reset();
        }),
        this.refetchQueries(l, i)
      ),
    );
  }
  cancelQueries(e, t, n) {
    const [o, i = {}] = u(e, t, n);
    void 0 === i.revert && (i.revert = !0);
    const l = _.batch(() => this.queryCache.findAll(o).map((e) => e.cancel(i)));
    return Promise.all(l).then(s).catch(s);
  }
  invalidateQueries(e, t, n) {
    const [o, i] = u(e, t, n);
    return _.batch(() => {
      var e, t;
      if (
        (this.queryCache.findAll(o).forEach((e) => {
          e.invalidate();
        }),
        'none' === o.refetchType)
      )
        return Promise.resolve();
      const n = {
        ...o,
        type: null != (e = null != (t = o.refetchType) ? t : o.type) ? e : 'active',
      };
      return this.refetchQueries(n, i);
    });
  }
  refetchQueries(e, t, n) {
    const [o, i] = u(e, t, n),
      l = _.batch(() =>
        this.queryCache
          .findAll(o)
          .filter((e) => !e.isDisabled())
          .map((e) => {
            var t;
            return e.fetch(void 0, {
              ...i,
              cancelRefetch: null == (t = null == i ? void 0 : i.cancelRefetch) || t,
              meta: { refetchPage: o.refetchPage },
            });
          }),
      );
    let r = Promise.all(l).then(s);
    return (null != i && i.throwOnError) || (r = r.catch(s)), r;
  }
  fetchQuery(e, t, n) {
    const o = a(e, t, n),
      i = this.defaultQueryOptions(o);
    void 0 === i.retry && (i.retry = !1);
    const s = this.queryCache.build(this, i);
    return s.isStaleByTime(i.staleTime) ? s.fetch(i) : Promise.resolve(s.state.data);
  }
  prefetchQuery(e, t, n) {
    return this.fetchQuery(e, t, n).then(s).catch(s);
  }
  fetchInfiniteQuery(e, t, n) {
    const o = a(e, t, n);
    return (o.behavior = H()), this.fetchQuery(o);
  }
  prefetchInfiniteQuery(e, t, n) {
    return this.fetchInfiniteQuery(e, t, n).then(s).catch(s);
  }
  resumePausedMutations() {
    return this.mutationCache.resumePausedMutations();
  }
  getQueryCache() {
    return this.queryCache;
  }
  getMutationCache() {
    return this.mutationCache;
  }
  getLogger() {
    return this.logger;
  }
  getDefaultOptions() {
    return this.defaultOptions;
  }
  setDefaultOptions(e) {
    this.defaultOptions = e;
  }
  setQueryDefaults(e, t) {
    const n = this.queryDefaults.find((t) => g(e) === g(t.queryKey));
    n ? (n.defaultOptions = t) : this.queryDefaults.push({ queryKey: e, defaultOptions: t });
  }
  getQueryDefaults(e) {
    if (!e) return;
    const t = this.queryDefaults.find((t) => f(e, t.queryKey));
    return null == t ? void 0 : t.defaultOptions;
  }
  setMutationDefaults(e, t) {
    const n = this.mutationDefaults.find((t) => g(e) === g(t.mutationKey));
    n ? (n.defaultOptions = t) : this.mutationDefaults.push({ mutationKey: e, defaultOptions: t });
  }
  getMutationDefaults(e) {
    if (!e) return;
    const t = this.mutationDefaults.find((t) => f(e, t.mutationKey));
    return null == t ? void 0 : t.defaultOptions;
  }
  defaultQueryOptions(e) {
    if (null != e && e._defaulted) return e;
    const t = {
      ...this.defaultOptions.queries,
      ...this.getQueryDefaults(null == e ? void 0 : e.queryKey),
      ...e,
      _defaulted: !0,
    };
    return (
      !t.queryHash && t.queryKey && (t.queryHash = h(t.queryKey, t)),
      void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = 'always' !== t.networkMode),
      void 0 === t.useErrorBoundary && (t.useErrorBoundary = !!t.suspense),
      t
    );
  }
  defaultMutationOptions(e) {
    return null != e && e._defaulted
      ? e
      : {
          ...this.defaultOptions.mutations,
          ...this.getMutationDefaults(null == e ? void 0 : e.mutationKey),
          ...e,
          _defaulted: !0,
        };
  }
  clear() {
    this.queryCache.clear(), this.mutationCache.clear();
  }
}
class K extends o {
  constructor(e, t) {
    super(),
      (this.client = e),
      (this.options = t),
      (this.trackedProps = new Set()),
      (this.selectError = null),
      this.bindMethods(),
      this.setOptions(t);
  }
  bindMethods() {
    (this.remove = this.remove.bind(this)), (this.refetch = this.refetch.bind(this));
  }
  onSubscribe() {
    1 === this.listeners.size &&
      (this.currentQuery.addObserver(this),
      N(this.currentQuery, this.options) && this.executeFetch(),
      this.updateTimers());
  }
  onUnsubscribe() {
    this.hasListeners() || this.destroy();
  }
  shouldFetchOnReconnect() {
    return W(this.currentQuery, this.options, this.options.refetchOnReconnect);
  }
  shouldFetchOnWindowFocus() {
    return W(this.currentQuery, this.options, this.options.refetchOnWindowFocus);
  }
  destroy() {
    (this.listeners = new Set()),
      this.clearStaleTimeout(),
      this.clearRefetchInterval(),
      this.currentQuery.removeObserver(this);
  }
  setOptions(e, t) {
    const n = this.options,
      o = this.currentQuery;
    if (
      ((this.options = this.client.defaultQueryOptions(e)),
      v(n, this.options) ||
        this.client
          .getQueryCache()
          .notify({ type: 'observerOptionsUpdated', query: this.currentQuery, observer: this }),
      void 0 !== this.options.enabled && 'boolean' != typeof this.options.enabled)
    )
      throw new Error('Expected enabled to be a boolean');
    this.options.queryKey || (this.options.queryKey = n.queryKey), this.updateQuery();
    const i = this.hasListeners();
    i && $(this.currentQuery, o, this.options, n) && this.executeFetch(),
      this.updateResult(t),
      !i ||
        (this.currentQuery === o &&
          this.options.enabled === n.enabled &&
          this.options.staleTime === n.staleTime) ||
        this.updateStaleTimeout();
    const s = this.computeRefetchInterval();
    !i ||
      (this.currentQuery === o &&
        this.options.enabled === n.enabled &&
        s === this.currentRefetchInterval) ||
      this.updateRefetchInterval(s);
  }
  getOptimisticResult(e) {
    const t = this.client.getQueryCache().build(this.client, e),
      n = this.createResult(t, e);
    return (
      (function (e, t, n) {
        if (n.keepPreviousData) return !1;
        if (void 0 !== n.placeholderData) return t.isPlaceholderData;
        if (!v(e.getCurrentResult(), t)) return !0;
        return !1;
      })(this, n, e) &&
        ((this.currentResult = n),
        (this.currentResultOptions = this.options),
        (this.currentResultState = this.currentQuery.state)),
      n
    );
  }
  getCurrentResult() {
    return this.currentResult;
  }
  trackResult(e) {
    const t = {};
    return (
      Object.keys(e).forEach((n) => {
        Object.defineProperty(t, n, {
          configurable: !1,
          enumerable: !0,
          get: () => (this.trackedProps.add(n), e[n]),
        });
      }),
      t
    );
  }
  getCurrentQuery() {
    return this.currentQuery;
  }
  remove() {
    this.client.getQueryCache().remove(this.currentQuery);
  }
  refetch({ refetchPage: e, ...t } = {}) {
    return this.fetch({ ...t, meta: { refetchPage: e } });
  }
  fetchOptimistic(e) {
    const t = this.client.defaultQueryOptions(e),
      n = this.client.getQueryCache().build(this.client, t);
    return (n.isFetchingOptimistic = !0), n.fetch().then(() => this.createResult(n, t));
  }
  fetch(e) {
    var t;
    return this.executeFetch({ ...e, cancelRefetch: null == (t = e.cancelRefetch) || t }).then(
      () => (this.updateResult(), this.currentResult),
    );
  }
  executeFetch(e) {
    this.updateQuery();
    let t = this.currentQuery.fetch(this.options, e);
    return (null != e && e.throwOnError) || (t = t.catch(s)), t;
  }
  updateStaleTimeout() {
    if ((this.clearStaleTimeout(), i || this.currentResult.isStale || !l(this.options.staleTime)))
      return;
    const e = r(this.currentResult.dataUpdatedAt, this.options.staleTime) + 1;
    this.staleTimeoutId = setTimeout(() => {
      this.currentResult.isStale || this.updateResult();
    }, e);
  }
  computeRefetchInterval() {
    var e;
    return 'function' == typeof this.options.refetchInterval
      ? this.options.refetchInterval(this.currentResult.data, this.currentQuery)
      : null != (e = this.options.refetchInterval) && e;
  }
  updateRefetchInterval(e) {
    this.clearRefetchInterval(),
      (this.currentRefetchInterval = e),
      !i &&
        !1 !== this.options.enabled &&
        l(this.currentRefetchInterval) &&
        0 !== this.currentRefetchInterval &&
        (this.refetchIntervalId = setInterval(() => {
          (this.options.refetchIntervalInBackground || M.isFocused()) && this.executeFetch();
        }, this.currentRefetchInterval));
  }
  updateTimers() {
    this.updateStaleTimeout(), this.updateRefetchInterval(this.computeRefetchInterval());
  }
  clearStaleTimeout() {
    this.staleTimeoutId && (clearTimeout(this.staleTimeoutId), (this.staleTimeoutId = void 0));
  }
  clearRefetchInterval() {
    this.refetchIntervalId &&
      (clearInterval(this.refetchIntervalId), (this.refetchIntervalId = void 0));
  }
  createResult(e, t) {
    const n = this.currentQuery,
      o = this.options,
      i = this.currentResult,
      s = this.currentResultState,
      l = this.currentResultOptions,
      r = e !== n,
      a = r ? e.state : this.currentQueryInitialState,
      u = r ? this.currentResult : this.previousQueryResult,
      { state: c } = e;
    let d,
      { dataUpdatedAt: h, error: g, errorUpdatedAt: f, fetchStatus: p, status: m } = c,
      v = !1,
      b = !1;
    if (t._optimisticResults) {
      const i = this.hasListeners(),
        s = !i && N(e, t),
        l = i && $(e, n, t, o);
      (s || l) && ((p = O(e.options.networkMode) ? 'fetching' : 'paused'), h || (m = 'loading')),
        'isRestoring' === t._optimisticResults && (p = 'idle');
    }
    if (t.keepPreviousData && !c.dataUpdatedAt && null != u && u.isSuccess && 'error' !== m)
      (d = u.data), (h = u.dataUpdatedAt), (m = u.status), (v = !0);
    else if (t.select && void 0 !== c.data)
      if (i && c.data === (null == s ? void 0 : s.data) && t.select === this.selectFn)
        d = this.selectResult;
      else
        try {
          (this.selectFn = t.select),
            (d = t.select(c.data)),
            (d = F(null == i ? void 0 : i.data, d, t)),
            (this.selectResult = d),
            (this.selectError = null);
        } catch (S) {
          this.selectError = S;
        }
    else d = c.data;
    if (void 0 !== t.placeholderData && void 0 === d && 'loading' === m) {
      let e;
      if (
        null != i &&
        i.isPlaceholderData &&
        t.placeholderData === (null == l ? void 0 : l.placeholderData)
      )
        e = i.data;
      else if (
        ((e = 'function' == typeof t.placeholderData ? t.placeholderData() : t.placeholderData),
        t.select && void 0 !== e)
      )
        try {
          (e = t.select(e)), (this.selectError = null);
        } catch (S) {
          this.selectError = S;
        }
      void 0 !== e && ((m = 'success'), (d = F(null == i ? void 0 : i.data, e, t)), (b = !0));
    }
    this.selectError &&
      ((g = this.selectError), (d = this.selectResult), (f = Date.now()), (m = 'error'));
    const y = 'fetching' === p,
      C = 'loading' === m,
      w = 'error' === m;
    return {
      status: m,
      fetchStatus: p,
      isLoading: C,
      isSuccess: 'success' === m,
      isError: w,
      isInitialLoading: C && y,
      data: d,
      dataUpdatedAt: h,
      error: g,
      errorUpdatedAt: f,
      failureCount: c.fetchFailureCount,
      failureReason: c.fetchFailureReason,
      errorUpdateCount: c.errorUpdateCount,
      isFetched: c.dataUpdateCount > 0 || c.errorUpdateCount > 0,
      isFetchedAfterMount:
        c.dataUpdateCount > a.dataUpdateCount || c.errorUpdateCount > a.errorUpdateCount,
      isFetching: y,
      isRefetching: y && !C,
      isLoadingError: w && 0 === c.dataUpdatedAt,
      isPaused: 'paused' === p,
      isPlaceholderData: b,
      isPreviousData: v,
      isRefetchError: w && 0 !== c.dataUpdatedAt,
      isStale: X(e, t),
      refetch: this.refetch,
      remove: this.remove,
    };
  }
  updateResult(e) {
    const t = this.currentResult,
      n = this.createResult(this.currentQuery, this.options);
    if (
      ((this.currentResultState = this.currentQuery.state),
      (this.currentResultOptions = this.options),
      v(n, t))
    )
      return;
    this.currentResult = n;
    const o = { cache: !0 };
    !1 !== (null == e ? void 0 : e.listeners) &&
      (() => {
        if (!t) return !0;
        const { notifyOnChangeProps: e } = this.options,
          n = 'function' == typeof e ? e() : e;
        if ('all' === n || (!n && !this.trackedProps.size)) return !0;
        const o = new Set(null != n ? n : this.trackedProps);
        return (
          this.options.useErrorBoundary && o.add('error'),
          Object.keys(this.currentResult).some((e) => {
            const n = e;
            return this.currentResult[n] !== t[n] && o.has(n);
          })
        );
      })() &&
      (o.listeners = !0),
      this.notify({ ...o, ...e });
  }
  updateQuery() {
    const e = this.client.getQueryCache().build(this.client, this.options);
    if (e === this.currentQuery) return;
    const t = this.currentQuery;
    (this.currentQuery = e),
      (this.currentQueryInitialState = e.state),
      (this.previousQueryResult = this.currentResult),
      this.hasListeners() && (null == t || t.removeObserver(this), e.addObserver(this));
  }
  onQueryUpdate(e) {
    const t = {};
    'success' === e.type
      ? (t.onSuccess = !e.manual)
      : 'error' !== e.type || A(e.error) || (t.onError = !0),
      this.updateResult(t),
      this.hasListeners() && this.updateTimers();
  }
  notify(e) {
    _.batch(() => {
      var t, n, o, i;
      if (e.onSuccess)
        null == (t = (n = this.options).onSuccess) || t.call(n, this.currentResult.data),
          null == (o = (i = this.options).onSettled) || o.call(i, this.currentResult.data, null);
      else if (e.onError) {
        var s, l, r, a;
        null == (s = (l = this.options).onError) || s.call(l, this.currentResult.error),
          null == (r = (a = this.options).onSettled) || r.call(a, void 0, this.currentResult.error);
      }
      e.listeners &&
        this.listeners.forEach(({ listener: e }) => {
          e(this.currentResult);
        }),
        e.cache &&
          this.client
            .getQueryCache()
            .notify({ query: this.currentQuery, type: 'observerResultsUpdated' });
    });
  }
}
function N(e, t) {
  return (
    (function (e, t) {
      return !(
        !1 === t.enabled ||
        e.state.dataUpdatedAt ||
        ('error' === e.state.status && !1 === t.retryOnMount)
      );
    })(e, t) ||
    (e.state.dataUpdatedAt > 0 && W(e, t, t.refetchOnMount))
  );
}
function W(e, t, n) {
  if (!1 !== t.enabled) {
    const o = 'function' == typeof n ? n(e) : n;
    return 'always' === o || (!1 !== o && X(e, t));
  }
  return !1;
}
function $(e, t, n, o) {
  return (
    !1 !== n.enabled &&
    (e !== t || !1 === o.enabled) &&
    (!n.suspense || 'error' !== e.state.status) &&
    X(e, n)
  );
}
function X(e, t) {
  return e.isStaleByTime(t.staleTime);
}
class J extends K {
  constructor(e, t) {
    super(e, t);
  }
  bindMethods() {
    super.bindMethods(),
      (this.fetchNextPage = this.fetchNextPage.bind(this)),
      (this.fetchPreviousPage = this.fetchPreviousPage.bind(this));
  }
  setOptions(e, t) {
    super.setOptions({ ...e, behavior: H() }, t);
  }
  getOptimisticResult(e) {
    return (e.behavior = H()), super.getOptimisticResult(e);
  }
  fetchNextPage({ pageParam: e, ...t } = {}) {
    return this.fetch({ ...t, meta: { fetchMore: { direction: 'forward', pageParam: e } } });
  }
  fetchPreviousPage({ pageParam: e, ...t } = {}) {
    return this.fetch({ ...t, meta: { fetchMore: { direction: 'backward', pageParam: e } } });
  }
  createResult(e, t) {
    var n, o, i, s, l, r;
    const { state: a } = e,
      u = super.createResult(e, t),
      { isFetching: c, isRefetching: d } = u,
      h =
        c &&
        'forward' ===
          (null == (n = a.fetchMeta) || null == (o = n.fetchMore) ? void 0 : o.direction),
      g =
        c &&
        'backward' ===
          (null == (i = a.fetchMeta) || null == (s = i.fetchMore) ? void 0 : s.direction);
    return {
      ...u,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: U(t, null == (l = a.data) ? void 0 : l.pages),
      hasPreviousPage: B(t, null == (r = a.data) ? void 0 : r.pages),
      isFetchingNextPage: h,
      isFetchingPreviousPage: g,
      isRefetching: d && !h && !g,
    };
  }
}
class Y extends o {
  constructor(e, t) {
    super(), (this.client = e), this.setOptions(t), this.bindMethods(), this.updateResult();
  }
  bindMethods() {
    (this.mutate = this.mutate.bind(this)), (this.reset = this.reset.bind(this));
  }
  setOptions(e) {
    var t;
    const n = this.options;
    (this.options = this.client.defaultMutationOptions(e)),
      v(n, this.options) ||
        this.client.getMutationCache().notify({
          type: 'observerOptionsUpdated',
          mutation: this.currentMutation,
          observer: this,
        }),
      null == (t = this.currentMutation) || t.setOptions(this.options);
  }
  onUnsubscribe() {
    var e;
    this.hasListeners() || null == (e = this.currentMutation) || e.removeObserver(this);
  }
  onMutationUpdate(e) {
    this.updateResult();
    const t = { listeners: !0 };
    'success' === e.type ? (t.onSuccess = !0) : 'error' === e.type && (t.onError = !0),
      this.notify(t);
  }
  getCurrentResult() {
    return this.currentResult;
  }
  reset() {
    (this.currentMutation = void 0), this.updateResult(), this.notify({ listeners: !0 });
  }
  mutate(e, t) {
    return (
      (this.mutateOptions = t),
      this.currentMutation && this.currentMutation.removeObserver(this),
      (this.currentMutation = this.client.getMutationCache().build(this.client, {
        ...this.options,
        variables: void 0 !== e ? e : this.options.variables,
      })),
      this.currentMutation.addObserver(this),
      this.currentMutation.execute()
    );
  }
  updateResult() {
    const e = this.currentMutation
        ? this.currentMutation.state
        : {
            context: void 0,
            data: void 0,
            error: null,
            failureCount: 0,
            failureReason: null,
            isPaused: !1,
            status: 'idle',
            variables: void 0,
          },
      t = {
        ...e,
        isLoading: 'loading' === e.status,
        isSuccess: 'success' === e.status,
        isError: 'error' === e.status,
        isIdle: 'idle' === e.status,
        mutate: this.mutate,
        reset: this.reset,
      };
    this.currentResult = t;
  }
  notify(e) {
    _.batch(() => {
      var t, n, o, i;
      if (this.mutateOptions && this.hasListeners())
        if (e.onSuccess)
          null == (t = (n = this.mutateOptions).onSuccess) ||
            t.call(
              n,
              this.currentResult.data,
              this.currentResult.variables,
              this.currentResult.context,
            ),
            null == (o = (i = this.mutateOptions).onSettled) ||
              o.call(
                i,
                this.currentResult.data,
                null,
                this.currentResult.variables,
                this.currentResult.context,
              );
        else if (e.onError) {
          var s, l, r, a;
          null == (s = (l = this.mutateOptions).onError) ||
            s.call(
              l,
              this.currentResult.error,
              this.currentResult.variables,
              this.currentResult.context,
            ),
            null == (r = (a = this.mutateOptions).onSettled) ||
              r.call(
                a,
                void 0,
                this.currentResult.error,
                this.currentResult.variables,
                this.currentResult.context,
              );
        }
      e.listeners &&
        this.listeners.forEach(({ listener: e }) => {
          e(this.currentResult);
        });
    });
  }
}
const Z = e.useSyncExternalStore,
  ee = t.createContext(void 0),
  te = t.createContext(!1);
function ne(e, t) {
  return (
    e ||
    (t && 'undefined' != typeof window
      ? (window.ReactQueryClientContext || (window.ReactQueryClientContext = ee),
        window.ReactQueryClientContext)
      : ee)
  );
}
const oe = ({ context: e } = {}) => {
    const n = t.useContext(ne(e, t.useContext(te)));
    if (!n) throw new Error('No QueryClient set, use QueryClientProvider to set one');
    return n;
  },
  ie = ({ client: e, children: n, context: o, contextSharing: i = !1 }) => {
    t.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e],
    );
    const s = ne(o, i);
    return t.createElement(
      te.Provider,
      { value: !o && i },
      t.createElement(s.Provider, { value: e }, n),
    );
  },
  se = t.createContext(!1),
  le = () => t.useContext(se);
se.Provider;
const re = t.createContext(
    (function () {
      let e = !1;
      return {
        clearReset: () => {
          e = !1;
        },
        reset: () => {
          e = !0;
        },
        isReset: () => e,
      };
    })(),
  ),
  ae = () => t.useContext(re);
function ue(e, t) {
  return 'function' == typeof e ? e(...t) : !!e;
}
const ce = (e, t) => {
    (e.suspense || e.useErrorBoundary) && (t.isReset() || (e.retryOnMount = !1));
  },
  de = (e) => {
    t.useEffect(() => {
      e.clearReset();
    }, [e]);
  },
  he = ({ result: e, errorResetBoundary: t, useErrorBoundary: n, query: o }) =>
    e.isError && !t.isReset() && !e.isFetching && ue(n, [e.error, o]),
  ge = (e) => {
    e.suspense && 'number' != typeof e.staleTime && (e.staleTime = 1e3);
  },
  fe = (e, t, n) =>
    (null == e ? void 0 : e.suspense) && ((e, t) => e.isLoading && e.isFetching && !t)(t, n),
  pe = (e, t, n) =>
    t
      .fetchOptimistic(e)
      .then(({ data: t }) => {
        null == e.onSuccess || e.onSuccess(t), null == e.onSettled || e.onSettled(t, null);
      })
      .catch((t) => {
        n.clearReset(),
          null == e.onError || e.onError(t),
          null == e.onSettled || e.onSettled(void 0, t);
      });
function me(e, n) {
  const o = oe({ context: e.context }),
    i = le(),
    s = ae(),
    l = o.defaultQueryOptions(e);
  (l._optimisticResults = i ? 'isRestoring' : 'optimistic'),
    l.onError && (l.onError = _.batchCalls(l.onError)),
    l.onSuccess && (l.onSuccess = _.batchCalls(l.onSuccess)),
    l.onSettled && (l.onSettled = _.batchCalls(l.onSettled)),
    ge(l),
    ce(l, s),
    de(s);
  const [r] = t.useState(() => new n(o, l)),
    a = r.getOptimisticResult(l);
  if (
    (Z(
      t.useCallback(
        (e) => {
          const t = i ? () => {} : r.subscribe(_.batchCalls(e));
          return r.updateResult(), t;
        },
        [r, i],
      ),
      () => r.getCurrentResult(),
      () => r.getCurrentResult(),
    ),
    t.useEffect(() => {
      r.setOptions(l, { listeners: !1 });
    }, [l, r]),
    fe(l, a, i))
  )
    throw pe(l, r, s);
  if (
    he({
      result: a,
      errorResetBoundary: s,
      useErrorBoundary: l.useErrorBoundary,
      query: r.getCurrentQuery(),
    })
  )
    throw a.error;
  return l.notifyOnChangeProps ? a : r.trackResult(a);
}
function ve(e, t, n) {
  return me(a(e, t, n), K);
}
function be(e, n, o) {
  const i = (function (e, t, n) {
      return w(e)
        ? 'function' == typeof t
          ? { ...n, mutationKey: e, mutationFn: t }
          : { ...t, mutationKey: e }
        : 'function' == typeof e
          ? { ...t, mutationFn: e }
          : { ...e };
    })(e, n, o),
    s = oe({ context: i.context }),
    [l] = t.useState(() => new Y(s, i));
  t.useEffect(() => {
    l.setOptions(i);
  }, [l, i]);
  const r = Z(
      t.useCallback((e) => l.subscribe(_.batchCalls(e)), [l]),
      () => l.getCurrentResult(),
      () => l.getCurrentResult(),
    ),
    a = t.useCallback(
      (e, t) => {
        l.mutate(e, t).catch(ye);
      },
      [l],
    );
  if (r.error && ue(l.options.useErrorBoundary, [r.error])) throw r.error;
  return { ...r, mutate: a, mutateAsync: r.mutate };
}
function ye() {}
function Ce(e, t, n) {
  return me(a(e, t, n), J);
}
const we = function () {
  return null;
};
function Se(e, t, n) {
  let o,
    i = n.initialDeps ?? [];
  return () => {
    var s, l, r, a;
    let u;
    n.key && (null == (s = n.debug) ? void 0 : s.call(n)) && (u = Date.now());
    const c = e();
    if (!(c.length !== i.length || c.some((e, t) => i[t] !== e))) return o;
    let d;
    if (
      ((i = c),
      n.key && (null == (l = n.debug) ? void 0 : l.call(n)) && (d = Date.now()),
      (o = t(...c)),
      n.key && (null == (r = n.debug) ? void 0 : r.call(n)))
    ) {
      const e = Math.round(100 * (Date.now() - u)) / 100,
        t = Math.round(100 * (Date.now() - d)) / 100,
        o = t / 16,
        i = (e, t) => {
          for (e = String(e); e.length < t; ) e = ' ' + e;
          return e;
        };
      console.info(
        `%c⏱ ${i(t, 5)} /${i(e, 5)} ms`,
        `\n            font-size: .6rem;\n            font-weight: bold;\n            color: hsl(${Math.max(0, Math.min(120 - 120 * o, 120))}deg 100% 31%);`,
        null == n ? void 0 : n.key,
      );
    }
    return null == (a = null == n ? void 0 : n.onChange) || a.call(n, o), o;
  };
}
function Re(e, t) {
  if (void 0 === e) throw new Error('Unexpected undefined');
  return e;
}
const Fe = (e, t, n) => {
    let o;
    return function (...i) {
      e.clearTimeout(o), (o = e.setTimeout(() => t.apply(this, i), n));
    };
  },
  Me = (e) => e,
  xe = (e) => {
    const t = Math.max(e.startIndex - e.overscan, 0),
      n = Math.min(e.endIndex + e.overscan, e.count - 1),
      o = [];
    for (let i = t; i <= n; i++) o.push(i);
    return o;
  },
  Pe = (e, t) => {
    const n = e.scrollElement;
    if (!n) return;
    const o = e.targetWindow;
    if (!o) return;
    const i = (e) => {
      const { width: n, height: o } = e;
      t({ width: Math.round(n), height: Math.round(o) });
    };
    if ((i(n.getBoundingClientRect()), !o.ResizeObserver)) return () => {};
    const s = new o.ResizeObserver((e) => {
      const t = e[0];
      if (null == t ? void 0 : t.borderBoxSize) {
        const e = t.borderBoxSize[0];
        if (e) return void i({ width: e.inlineSize, height: e.blockSize });
      }
      i(n.getBoundingClientRect());
    });
    return (
      s.observe(n, { box: 'border-box' }),
      () => {
        s.unobserve(n);
      }
    );
  },
  Ie = { passive: !0 },
  Oe = 'undefined' == typeof window || 'onscrollend' in window,
  Ee = (e, t) => {
    const n = e.scrollElement;
    if (!n) return;
    const o = e.targetWindow;
    if (!o) return;
    let i = 0;
    const s = Oe
        ? () => {}
        : Fe(
            o,
            () => {
              t(i, !1);
            },
            e.options.isScrollingResetDelay,
          ),
      l = (o) => () => {
        (i = n[e.options.horizontal ? 'scrollLeft' : 'scrollTop']), s(), t(i, o);
      },
      r = l(!0),
      a = l(!1);
    return (
      a(),
      n.addEventListener('scroll', r, Ie),
      n.addEventListener('scrollend', a, Ie),
      () => {
        n.removeEventListener('scroll', r), n.removeEventListener('scrollend', a);
      }
    );
  },
  Ae = (e, t, n) => {
    if (null == t ? void 0 : t.borderBoxSize) {
      const e = t.borderBoxSize[0];
      if (e) {
        return Math.round(e[n.options.horizontal ? 'inlineSize' : 'blockSize']);
      }
    }
    return Math.round(e.getBoundingClientRect()[n.options.horizontal ? 'width' : 'height']);
  },
  Ve = (e, { adjustments: t = 0, behavior: n }, o) => {
    var i, s;
    const l = e + t;
    null == (s = null == (i = o.scrollElement) ? void 0 : i.scrollTo) ||
      s.call(i, { [o.options.horizontal ? 'left' : 'top']: l, behavior: n });
  };
class De {
  constructor(e) {
    (this.unsubs = []),
      (this.scrollElement = null),
      (this.targetWindow = null),
      (this.isScrolling = !1),
      (this.scrollToIndexTimeoutId = null),
      (this.measurementsCache = []),
      (this.itemSizeCache = new Map()),
      (this.pendingMeasuredCacheIndexes = []),
      (this.scrollRect = null),
      (this.scrollOffset = null),
      (this.scrollDirection = null),
      (this.scrollAdjustments = 0),
      (this.elementsCache = new Map()),
      (this.observer = (() => {
        let e = null;
        const t = () =>
          e ||
          (this.targetWindow && this.targetWindow.ResizeObserver
            ? (e = new this.targetWindow.ResizeObserver((e) => {
                e.forEach((e) => {
                  this._measureElement(e.target, e);
                });
              }))
            : null);
        return {
          disconnect: () => {
            var e;
            return null == (e = t()) ? void 0 : e.disconnect();
          },
          observe: (e) => {
            var n;
            return null == (n = t()) ? void 0 : n.observe(e, { box: 'border-box' });
          },
          unobserve: (e) => {
            var n;
            return null == (n = t()) ? void 0 : n.unobserve(e);
          },
        };
      })()),
      (this.range = null),
      (this.setOptions = (e) => {
        Object.entries(e).forEach(([t, n]) => {
          void 0 === n && delete e[t];
        }),
          (this.options = {
            debug: !1,
            initialOffset: 0,
            overscan: 1,
            paddingStart: 0,
            paddingEnd: 0,
            scrollPaddingStart: 0,
            scrollPaddingEnd: 0,
            horizontal: !1,
            getItemKey: Me,
            rangeExtractor: xe,
            onChange: () => {},
            measureElement: Ae,
            initialRect: { width: 0, height: 0 },
            scrollMargin: 0,
            gap: 0,
            indexAttribute: 'data-index',
            initialMeasurementsCache: [],
            lanes: 1,
            isScrollingResetDelay: 150,
            enabled: !0,
            ...e,
          });
      }),
      (this.notify = (e, t) => {
        var n, o;
        const { startIndex: i, endIndex: s } = this.range ?? {
            startIndex: void 0,
            endIndex: void 0,
          },
          l = this.calculateRange();
        (e ||
          i !== (null == l ? void 0 : l.startIndex) ||
          s !== (null == l ? void 0 : l.endIndex)) &&
          (null == (o = (n = this.options).onChange) || o.call(n, this, t));
      }),
      (this.cleanup = () => {
        this.unsubs.filter(Boolean).forEach((e) => e()),
          (this.unsubs = []),
          (this.scrollElement = null),
          (this.targetWindow = null),
          this.observer.disconnect(),
          this.elementsCache.clear();
      }),
      (this._didMount = () => () => {
        this.cleanup();
      }),
      (this._willUpdate = () => {
        var e;
        const t = this.options.enabled ? this.options.getScrollElement() : null;
        if (this.scrollElement !== t) {
          if ((this.cleanup(), !t)) return void this.notify(!1, !1);
          (this.scrollElement = t),
            this.scrollElement && 'ownerDocument' in this.scrollElement
              ? (this.targetWindow = this.scrollElement.ownerDocument.defaultView)
              : (this.targetWindow =
                  (null == (e = this.scrollElement) ? void 0 : e.window) ?? null),
            this._scrollToOffset(this.getScrollOffset(), { adjustments: void 0, behavior: void 0 }),
            this.unsubs.push(
              this.options.observeElementRect(this, (e) => {
                (this.scrollRect = e), this.notify(!1, !1);
              }),
            ),
            this.unsubs.push(
              this.options.observeElementOffset(this, (e, t) => {
                (this.scrollAdjustments = 0),
                  (this.scrollDirection = t
                    ? this.getScrollOffset() < e
                      ? 'forward'
                      : 'backward'
                    : null),
                  (this.scrollOffset = e);
                const n = this.isScrolling;
                (this.isScrolling = t), this.notify(n !== t, t);
              }),
            );
        }
      }),
      (this.getSize = () =>
        this.options.enabled
          ? ((this.scrollRect = this.scrollRect ?? this.options.initialRect),
            this.scrollRect[this.options.horizontal ? 'width' : 'height'])
          : ((this.scrollRect = null), 0)),
      (this.getScrollOffset = () =>
        this.options.enabled
          ? ((this.scrollOffset =
              this.scrollOffset ??
              ('function' == typeof this.options.initialOffset
                ? this.options.initialOffset()
                : this.options.initialOffset)),
            this.scrollOffset)
          : ((this.scrollOffset = null), 0)),
      (this.getFurthestMeasurement = (e, t) => {
        const n = new Map(),
          o = new Map();
        for (let i = t - 1; i >= 0; i--) {
          const t = e[i];
          if (n.has(t.lane)) continue;
          const s = o.get(t.lane);
          if (
            (null == s || t.end > s.end ? o.set(t.lane, t) : t.end < s.end && n.set(t.lane, !0),
            n.size === this.options.lanes)
          )
            break;
        }
        return o.size === this.options.lanes
          ? Array.from(o.values()).sort((e, t) =>
              e.end === t.end ? e.index - t.index : e.end - t.end,
            )[0]
          : void 0;
      }),
      (this.getMeasurementOptions = Se(
        () => [
          this.options.count,
          this.options.paddingStart,
          this.options.scrollMargin,
          this.options.getItemKey,
          this.options.enabled,
        ],
        (e, t, n, o, i) => (
          (this.pendingMeasuredCacheIndexes = []),
          { count: e, paddingStart: t, scrollMargin: n, getItemKey: o, enabled: i }
        ),
        { key: !1 },
      )),
      (this.getMeasurements = Se(
        () => [this.getMeasurementOptions(), this.itemSizeCache],
        ({ count: e, paddingStart: t, scrollMargin: n, getItemKey: o, enabled: i }, s) => {
          var l;
          if (!i) return (this.measurementsCache = []), this.itemSizeCache.clear(), [];
          0 === this.measurementsCache.length &&
            ((this.measurementsCache = this.options.initialMeasurementsCache),
            this.measurementsCache.forEach((e) => {
              this.itemSizeCache.set(e.key, e.size);
            }));
          const r =
            this.pendingMeasuredCacheIndexes.length > 0
              ? Math.min(...this.pendingMeasuredCacheIndexes)
              : 0;
          this.pendingMeasuredCacheIndexes = [];
          const a = this.measurementsCache.slice(0, r);
          for (let u = r; u < e; u++) {
            let e = null == (l = this.measurementsCache[u]) ? void 0 : l.measureElement;
            e ||
              (e = (e) => {
                const t = o(u),
                  n = this.elementsCache.get(t);
                e
                  ? (n !== e &&
                      (n && this.observer.unobserve(n),
                      this.observer.observe(e),
                      this.elementsCache.set(t, e)),
                    e.isConnected &&
                      this.resizeItem(u, this.options.measureElement(e, void 0, this)))
                  : n && (this.observer.unobserve(n), this.elementsCache.delete(t));
              });
            const i = o(u),
              r = 1 === this.options.lanes ? a[u - 1] : this.getFurthestMeasurement(a, u),
              c = r ? r.end + this.options.gap : t + n,
              d = s.get(i),
              h = 'number' == typeof d ? d : this.options.estimateSize(u),
              g = c + h,
              f = r ? r.lane : u % this.options.lanes;
            a[u] = { index: u, start: c, size: h, end: g, key: i, lane: f, measureElement: e };
          }
          return (this.measurementsCache = a), a;
        },
        { key: !1, debug: () => this.options.debug },
      )),
      (this.calculateRange = Se(
        () => [this.getMeasurements(), this.getSize(), this.getScrollOffset()],
        (e, t, n) =>
          (this.range =
            e.length > 0 && t > 0
              ? (function ({ measurements: e, outerSize: t, scrollOffset: n }) {
                  const o = e.length - 1,
                    i = (t) => e[t].start,
                    s = _e(0, o, i, n);
                  let l = s;
                  for (; l < o && e[l].end < n + t; ) l++;
                  return { startIndex: s, endIndex: l };
                })({ measurements: e, outerSize: t, scrollOffset: n })
              : null),
        { key: !1, debug: () => this.options.debug },
      )),
      (this.getIndexes = Se(
        () => [
          this.options.rangeExtractor,
          this.calculateRange(),
          this.options.overscan,
          this.options.count,
        ],
        (e, t, n, o) =>
          null === t
            ? []
            : e({ startIndex: t.startIndex, endIndex: t.endIndex, overscan: n, count: o }),
        { key: !1, debug: () => this.options.debug },
      )),
      (this.indexFromElement = (e) => {
        const t = this.options.indexAttribute,
          n = e.getAttribute(t);
        return n
          ? parseInt(n, 10)
          : (console.warn(`Missing attribute name '${t}={index}' on measured element.`), -1);
      }),
      (this._measureElement = (e, t) => {
        const n = this.indexFromElement(e),
          o = this.getMeasurements()[n];
        if (!o || !e.isConnected)
          return void this.elementsCache.forEach((t, n) => {
            t === e && (this.observer.unobserve(e), this.elementsCache.delete(n));
          });
        const i = this.elementsCache.get(o.key);
        i !== e &&
          (i && this.observer.unobserve(i),
          this.observer.observe(e),
          this.elementsCache.set(o.key, e)),
          this.resizeItem(n, this.options.measureElement(e, t, this));
      }),
      (this.resizeItem = (e, t) => {
        const n = this.getMeasurements()[e];
        if (!n) return;
        const o = t - (this.itemSizeCache.get(n.key) ?? n.size);
        0 !== o &&
          ((void 0 !== this.shouldAdjustScrollPositionOnItemSizeChange
            ? this.shouldAdjustScrollPositionOnItemSizeChange(n, o, this)
            : n.start < this.getScrollOffset() + this.scrollAdjustments) &&
            this._scrollToOffset(this.getScrollOffset(), {
              adjustments: (this.scrollAdjustments += o),
              behavior: void 0,
            }),
          this.pendingMeasuredCacheIndexes.push(n.index),
          (this.itemSizeCache = new Map(this.itemSizeCache.set(n.key, t))),
          this.notify(!0, !1));
      }),
      (this.measureElement = (e) => {
        e && this._measureElement(e, void 0);
      }),
      (this.getVirtualItems = Se(
        () => [this.getIndexes(), this.getMeasurements()],
        (e, t) => {
          const n = [];
          for (let o = 0, i = e.length; o < i; o++) {
            const i = t[e[o]];
            n.push(i);
          }
          return n;
        },
        { key: !1, debug: () => this.options.debug },
      )),
      (this.getVirtualItemForOffset = (e) => {
        const t = this.getMeasurements();
        if (0 !== t.length) return Re(t[_e(0, t.length - 1, (e) => Re(t[e]).start, e)]);
      }),
      (this.getOffsetForAlignment = (e, t) => {
        const n = this.getSize(),
          o = this.getScrollOffset();
        'auto' === t && (t = e <= o ? 'start' : e >= o + n ? 'end' : 'start'),
          'start' === t || ('end' === t ? (e -= n) : 'center' === t && (e -= n / 2));
        const i = this.options.horizontal ? 'scrollWidth' : 'scrollHeight',
          s =
            (this.scrollElement
              ? 'document' in this.scrollElement
                ? this.scrollElement.document.documentElement[i]
                : this.scrollElement[i]
              : 0) - n;
        return Math.max(Math.min(s, e), 0);
      }),
      (this.getOffsetForIndex = (e, t = 'auto') => {
        e = Math.max(0, Math.min(e, this.options.count - 1));
        const n = this.getMeasurements()[e];
        if (!n) return;
        const o = this.getSize(),
          i = this.getScrollOffset();
        if ('auto' === t)
          if (n.end >= i + o - this.options.scrollPaddingEnd) t = 'end';
          else {
            if (!(n.start <= i + this.options.scrollPaddingStart)) return [i, t];
            t = 'start';
          }
        const s =
          'end' === t
            ? n.end + this.options.scrollPaddingEnd
            : n.start - this.options.scrollPaddingStart;
        return [this.getOffsetForAlignment(s, t), t];
      }),
      (this.isDynamicMode = () => this.elementsCache.size > 0),
      (this.cancelScrollToIndex = () => {
        null !== this.scrollToIndexTimeoutId &&
          this.targetWindow &&
          (this.targetWindow.clearTimeout(this.scrollToIndexTimeoutId),
          (this.scrollToIndexTimeoutId = null));
      }),
      (this.scrollToOffset = (e, { align: t = 'start', behavior: n } = {}) => {
        this.cancelScrollToIndex(),
          'smooth' === n &&
            this.isDynamicMode() &&
            console.warn('The `smooth` scroll behavior is not fully supported with dynamic size.'),
          this._scrollToOffset(this.getOffsetForAlignment(e, t), {
            adjustments: void 0,
            behavior: n,
          });
      }),
      (this.scrollToIndex = (e, { align: t = 'auto', behavior: n } = {}) => {
        (e = Math.max(0, Math.min(e, this.options.count - 1))),
          this.cancelScrollToIndex(),
          'smooth' === n &&
            this.isDynamicMode() &&
            console.warn('The `smooth` scroll behavior is not fully supported with dynamic size.');
        const o = this.getOffsetForIndex(e, t);
        if (!o) return;
        const [i, s] = o;
        this._scrollToOffset(i, { adjustments: void 0, behavior: n }),
          'smooth' !== n &&
            this.isDynamicMode() &&
            this.targetWindow &&
            (this.scrollToIndexTimeoutId = this.targetWindow.setTimeout(() => {
              this.scrollToIndexTimeoutId = null;
              if (this.elementsCache.has(this.options.getItemKey(e))) {
                const [i] = Re(this.getOffsetForIndex(e, s));
                (t = i),
                  (o = this.getScrollOffset()),
                  Math.abs(t - o) < 1 || this.scrollToIndex(e, { align: s, behavior: n });
              } else this.scrollToIndex(e, { align: s, behavior: n });
              var t, o;
            }));
      }),
      (this.scrollBy = (e, { behavior: t } = {}) => {
        this.cancelScrollToIndex(),
          'smooth' === t &&
            this.isDynamicMode() &&
            console.warn('The `smooth` scroll behavior is not fully supported with dynamic size.'),
          this._scrollToOffset(this.getScrollOffset() + e, { adjustments: void 0, behavior: t });
      }),
      (this.getTotalSize = () => {
        var e;
        const t = this.getMeasurements();
        let n;
        return (
          (n =
            0 === t.length
              ? this.options.paddingStart
              : 1 === this.options.lanes
                ? ((null == (e = t[t.length - 1]) ? void 0 : e.end) ?? 0)
                : Math.max(...t.slice(-this.options.lanes).map((e) => e.end))),
          n - this.options.scrollMargin + this.options.paddingEnd
        );
      }),
      (this._scrollToOffset = (e, { adjustments: t, behavior: n }) => {
        this.options.scrollToFn(e, { behavior: n, adjustments: t }, this);
      }),
      (this.measure = () => {
        var e, t;
        (this.itemSizeCache = new Map()),
          null == (t = (e = this.options).onChange) || t.call(e, this, !1);
      }),
      this.setOptions(e);
  }
}
const _e = (e, t, n, o) => {
  for (; e <= t; ) {
    const i = ((e + t) / 2) | 0,
      s = n(i);
    if (s < o) e = i + 1;
    else {
      if (!(s > o)) return i;
      t = i - 1;
    }
  }
  return e > 0 ? e - 1 : 0;
};
const ze = 'undefined' != typeof document ? t.useLayoutEffect : t.useEffect;
function qe(e) {
  return (function (e) {
    const o = t.useReducer(() => ({}), {})[1],
      i = {
        ...e,
        onChange: (t, i) => {
          var s;
          i ? n.flushSync(o) : o(), null == (s = e.onChange) || s.call(e, t, i);
        },
      },
      [s] = t.useState(() => new De(i));
    return s.setOptions(i), t.useEffect(() => s._didMount(), []), ze(() => s._willUpdate()), s;
  })({ observeElementRect: Pe, observeElementOffset: Ee, scrollToFn: Ve, ...e });
}
/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Te(e, t) {
  return 'function' == typeof e ? e(t) : e;
}
function Le(e, t) {
  return (n) => {
    t.setState((t) => ({ ...t, [e]: Te(n, t[e]) }));
  };
}
function ke(e) {
  return e instanceof Function;
}
function He(e, t, n) {
  let o,
    i = [];
  return () => {
    let s;
    n.key && n.debug && (s = Date.now());
    const l = e();
    if (!(l.length !== i.length || l.some((e, t) => i[t] !== e))) return o;
    let r;
    if (
      ((i = l),
      n.key && n.debug && (r = Date.now()),
      (o = t(...l)),
      null == n || null == n.onChange || n.onChange(o),
      n.key && n.debug && null != n && n.debug())
    ) {
      const e = Math.round(100 * (Date.now() - s)) / 100,
        t = Math.round(100 * (Date.now() - r)) / 100,
        o = t / 16,
        i = (e, t) => {
          for (e = String(e); e.length < t; ) e = ' ' + e;
          return e;
        };
      console.info(
        `%c⏱ ${i(t, 5)} /${i(e, 5)} ms`,
        `\n            font-size: .6rem;\n            font-weight: bold;\n            color: hsl(${Math.max(0, Math.min(120 - 120 * o, 120))}deg 100% 31%);`,
        null == n ? void 0 : n.key,
      );
    }
    return o;
  };
}
function Ge(e, t, n) {
  var o;
  let i = {
    id: null != (o = n.id) ? o : t.id,
    column: t,
    index: n.index,
    isPlaceholder: !!n.isPlaceholder,
    placeholderId: n.placeholderId,
    depth: n.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const e = [],
        t = (n) => {
          n.subHeaders && n.subHeaders.length && n.subHeaders.map(t), e.push(n);
        };
      return t(i), e;
    },
    getContext: () => ({ table: e, header: i, column: t }),
  };
  return (
    e._features.forEach((t) => {
      null == t.createHeader || t.createHeader(i, e);
    }),
    i
  );
}
const Qe = {
  createTable: (e) => {
    (e.getHeaderGroups = He(
      () => [
        e.getAllColumns(),
        e.getVisibleLeafColumns(),
        e.getState().columnPinning.left,
        e.getState().columnPinning.right,
      ],
      (t, n, o, i) => {
        var s, l;
        const r =
            null !=
            (s = null == o ? void 0 : o.map((e) => n.find((t) => t.id === e)).filter(Boolean))
              ? s
              : [],
          a =
            null !=
            (l = null == i ? void 0 : i.map((e) => n.find((t) => t.id === e)).filter(Boolean))
              ? l
              : [];
        return Ue(
          t,
          [
            ...r,
            ...n.filter(
              (e) => !((null != o && o.includes(e.id)) || (null != i && i.includes(e.id))),
            ),
            ...a,
          ],
          e,
        );
      },
      {
        key: !1,
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
        },
      },
    )),
      (e.getCenterHeaderGroups = He(
        () => [
          e.getAllColumns(),
          e.getVisibleLeafColumns(),
          e.getState().columnPinning.left,
          e.getState().columnPinning.right,
        ],
        (t, n, o, i) =>
          Ue(
            t,
            (n = n.filter(
              (e) => !((null != o && o.includes(e.id)) || (null != i && i.includes(e.id))),
            )),
            e,
            'center',
          ),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getLeftHeaderGroups = He(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left],
        (t, n, o) => {
          var i;
          return Ue(
            t,
            null !=
              (i = null == o ? void 0 : o.map((e) => n.find((t) => t.id === e)).filter(Boolean))
              ? i
              : [],
            e,
            'left',
          );
        },
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getRightHeaderGroups = He(
        () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.right],
        (t, n, o) => {
          var i;
          return Ue(
            t,
            null !=
              (i = null == o ? void 0 : o.map((e) => n.find((t) => t.id === e)).filter(Boolean))
              ? i
              : [],
            e,
            'right',
          );
        },
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getFooterGroups = He(
        () => [e.getHeaderGroups()],
        (e) => [...e].reverse(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getLeftFooterGroups = He(
        () => [e.getLeftHeaderGroups()],
        (e) => [...e].reverse(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getCenterFooterGroups = He(
        () => [e.getCenterHeaderGroups()],
        (e) => [...e].reverse(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getRightFooterGroups = He(
        () => [e.getRightHeaderGroups()],
        (e) => [...e].reverse(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getFlatHeaders = He(
        () => [e.getHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getLeftFlatHeaders = He(
        () => [e.getLeftHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getCenterFlatHeaders = He(
        () => [e.getCenterHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getRightFlatHeaders = He(
        () => [e.getRightHeaderGroups()],
        (e) => e.map((e) => e.headers).flat(),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getCenterLeafHeaders = He(
        () => [e.getCenterFlatHeaders()],
        (e) =>
          e.filter((e) => {
            var t;
            return !(null != (t = e.subHeaders) && t.length);
          }),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getLeftLeafHeaders = He(
        () => [e.getLeftFlatHeaders()],
        (e) =>
          e.filter((e) => {
            var t;
            return !(null != (t = e.subHeaders) && t.length);
          }),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getRightLeafHeaders = He(
        () => [e.getRightFlatHeaders()],
        (e) =>
          e.filter((e) => {
            var t;
            return !(null != (t = e.subHeaders) && t.length);
          }),
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      )),
      (e.getLeafHeaders = He(
        () => [e.getLeftHeaderGroups(), e.getCenterHeaderGroups(), e.getRightHeaderGroups()],
        (e, t, n) => {
          var o, i, s, l, r, a;
          return [
            ...(null != (o = null == (i = e[0]) ? void 0 : i.headers) ? o : []),
            ...(null != (s = null == (l = t[0]) ? void 0 : l.headers) ? s : []),
            ...(null != (r = null == (a = n[0]) ? void 0 : a.headers) ? r : []),
          ]
            .map((e) => e.getLeafHeaders())
            .flat();
        },
        {
          key: !1,
          debug: () => {
            var t;
            return null != (t = e.options.debugAll) ? t : e.options.debugHeaders;
          },
        },
      ));
  },
};
function Ue(e, t, n, o) {
  var i, s;
  let l = 0;
  const r = function (e, t) {
    void 0 === t && (t = 1),
      (l = Math.max(l, t)),
      e
        .filter((e) => e.getIsVisible())
        .forEach((e) => {
          var n;
          null != (n = e.columns) && n.length && r(e.columns, t + 1);
        }, 0);
  };
  r(e);
  let a = [];
  const u = (e, t) => {
      const i = { depth: t, id: [o, `${t}`].filter(Boolean).join('_'), headers: [] },
        s = [];
      e.forEach((e) => {
        const l = [...s].reverse()[0];
        let r,
          a = !1;
        if (
          (e.column.depth === i.depth && e.column.parent
            ? (r = e.column.parent)
            : ((r = e.column), (a = !0)),
          l && (null == l ? void 0 : l.column) === r)
        )
          l.subHeaders.push(e);
        else {
          const i = Ge(n, r, {
            id: [o, t, r.id, null == e ? void 0 : e.id].filter(Boolean).join('_'),
            isPlaceholder: a,
            placeholderId: a ? `${s.filter((e) => e.column === r).length}` : void 0,
            depth: t,
            index: s.length,
          });
          i.subHeaders.push(e), s.push(i);
        }
        i.headers.push(e), (e.headerGroup = i);
      }),
        a.push(i),
        t > 0 && u(s, t - 1);
    },
    c = t.map((e, t) => Ge(n, e, { depth: l, index: t }));
  u(c, l - 1), a.reverse();
  const d = (e) =>
    e
      .filter((e) => e.column.getIsVisible())
      .map((e) => {
        let t = 0,
          n = 0,
          o = [0];
        e.subHeaders && e.subHeaders.length
          ? ((o = []),
            d(e.subHeaders).forEach((e) => {
              let { colSpan: n, rowSpan: i } = e;
              (t += n), o.push(i);
            }))
          : (t = 1);
        return (n += Math.min(...o)), (e.colSpan = t), (e.rowSpan = n), { colSpan: t, rowSpan: n };
      });
  return d(null != (i = null == (s = a[0]) ? void 0 : s.headers) ? i : []), a;
}
const Be = { size: 150, minSize: 20, maxSize: Number.MAX_SAFE_INTEGER },
  je = {
    getDefaultColumnDef: () => Be,
    getInitialState: (e) => ({
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: !1,
        columnSizingStart: [],
      },
      ...e,
    }),
    getDefaultOptions: (e) => ({
      columnResizeMode: 'onEnd',
      columnResizeDirection: 'ltr',
      onColumnSizingChange: Le('columnSizing', e),
      onColumnSizingInfoChange: Le('columnSizingInfo', e),
    }),
    createColumn: (e, t) => {
      (e.getSize = () => {
        var n, o, i;
        const s = t.getState().columnSizing[e.id];
        return Math.min(
          Math.max(
            null != (n = e.columnDef.minSize) ? n : Be.minSize,
            null != (o = null != s ? s : e.columnDef.size) ? o : Be.size,
          ),
          null != (i = e.columnDef.maxSize) ? i : Be.maxSize,
        );
      }),
        (e.getStart = (n) => {
          const o = n
              ? 'left' === n
                ? t.getLeftVisibleLeafColumns()
                : t.getRightVisibleLeafColumns()
              : t.getVisibleLeafColumns(),
            i = o.findIndex((t) => t.id === e.id);
          if (i > 0) {
            const e = o[i - 1];
            return e.getStart(n) + e.getSize();
          }
          return 0;
        }),
        (e.resetSize = () => {
          t.setColumnSizing((t) => {
            let { [e.id]: n, ...o } = t;
            return o;
          });
        }),
        (e.getCanResize = () => {
          var n, o;
          return (
            (null == (n = e.columnDef.enableResizing) || n) &&
            (null == (o = t.options.enableColumnResizing) || o)
          );
        }),
        (e.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === e.id);
    },
    createHeader: (e, t) => {
      (e.getSize = () => {
        let t = 0;
        const n = (e) => {
          var o;
          e.subHeaders.length
            ? e.subHeaders.forEach(n)
            : (t += null != (o = e.column.getSize()) ? o : 0);
        };
        return n(e), t;
      }),
        (e.getStart = () => {
          if (e.index > 0) {
            const t = e.headerGroup.headers[e.index - 1];
            return t.getStart() + t.getSize();
          }
          return 0;
        }),
        (e.getResizeHandler = (n) => {
          const o = t.getColumn(e.column.id),
            i = null == o ? void 0 : o.getCanResize();
          return (s) => {
            if (!o || !i) return;
            if ((null == s.persist || s.persist(), Ne(s) && s.touches && s.touches.length > 1))
              return;
            const l = e.getSize(),
              r = e
                ? e.getLeafHeaders().map((e) => [e.column.id, e.column.getSize()])
                : [[o.id, o.getSize()]],
              a = Ne(s) ? Math.round(s.touches[0].clientX) : s.clientX,
              u = {},
              c = (e, n) => {
                'number' == typeof n &&
                  (t.setColumnSizingInfo((e) => {
                    var o, i;
                    const s = 'rtl' === t.options.columnResizeDirection ? -1 : 1,
                      l = (n - (null != (o = null == e ? void 0 : e.startOffset) ? o : 0)) * s,
                      r = Math.max(
                        l / (null != (i = null == e ? void 0 : e.startSize) ? i : 0),
                        -0.999999,
                      );
                    return (
                      e.columnSizingStart.forEach((e) => {
                        let [t, n] = e;
                        u[t] = Math.round(100 * Math.max(n + n * r, 0)) / 100;
                      }),
                      { ...e, deltaOffset: l, deltaPercentage: r }
                    );
                  }),
                  ('onChange' !== t.options.columnResizeMode && 'end' !== e) ||
                    t.setColumnSizing((e) => ({ ...e, ...u })));
              },
              d = (e) => c('move', e),
              h = (e) => {
                c('end', e),
                  t.setColumnSizingInfo((e) => ({
                    ...e,
                    isResizingColumn: !1,
                    startOffset: null,
                    startSize: null,
                    deltaOffset: null,
                    deltaPercentage: null,
                    columnSizingStart: [],
                  }));
              },
              g = n || 'undefined' != typeof document ? document : null,
              f = {
                moveHandler: (e) => d(e.clientX),
                upHandler: (e) => {
                  null == g || g.removeEventListener('mousemove', f.moveHandler),
                    null == g || g.removeEventListener('mouseup', f.upHandler),
                    h(e.clientX);
                },
              },
              p = {
                moveHandler: (e) => (
                  e.cancelable && (e.preventDefault(), e.stopPropagation()),
                  d(e.touches[0].clientX),
                  !1
                ),
                upHandler: (e) => {
                  var t;
                  null == g || g.removeEventListener('touchmove', p.moveHandler),
                    null == g || g.removeEventListener('touchend', p.upHandler),
                    e.cancelable && (e.preventDefault(), e.stopPropagation()),
                    h(null == (t = e.touches[0]) ? void 0 : t.clientX);
                },
              },
              m = !!(function () {
                if ('boolean' == typeof Ke) return Ke;
                let e = !1;
                try {
                  const t = {
                      get passive() {
                        return (e = !0), !1;
                      },
                    },
                    n = () => {};
                  window.addEventListener('test', n, t), window.removeEventListener('test', n);
                } catch (t) {
                  e = !1;
                }
                return (Ke = e), Ke;
              })() && { passive: !1 };
            Ne(s)
              ? (null == g || g.addEventListener('touchmove', p.moveHandler, m),
                null == g || g.addEventListener('touchend', p.upHandler, m))
              : (null == g || g.addEventListener('mousemove', f.moveHandler, m),
                null == g || g.addEventListener('mouseup', f.upHandler, m)),
              t.setColumnSizingInfo((e) => ({
                ...e,
                startOffset: a,
                startSize: l,
                deltaOffset: 0,
                deltaPercentage: 0,
                columnSizingStart: r,
                isResizingColumn: o.id,
              }));
          };
        });
    },
    createTable: (e) => {
      (e.setColumnSizing = (t) =>
        null == e.options.onColumnSizingChange ? void 0 : e.options.onColumnSizingChange(t)),
        (e.setColumnSizingInfo = (t) =>
          null == e.options.onColumnSizingInfoChange
            ? void 0
            : e.options.onColumnSizingInfoChange(t)),
        (e.resetColumnSizing = (t) => {
          var n;
          e.setColumnSizing(t ? {} : null != (n = e.initialState.columnSizing) ? n : {});
        }),
        (e.resetHeaderSizeInfo = (t) => {
          var n;
          e.setColumnSizingInfo(
            t
              ? {
                  startOffset: null,
                  startSize: null,
                  deltaOffset: null,
                  deltaPercentage: null,
                  isResizingColumn: !1,
                  columnSizingStart: [],
                }
              : null != (n = e.initialState.columnSizingInfo)
                ? n
                : {
                    startOffset: null,
                    startSize: null,
                    deltaOffset: null,
                    deltaPercentage: null,
                    isResizingColumn: !1,
                    columnSizingStart: [],
                  },
          );
        }),
        (e.getTotalSize = () => {
          var t, n;
          return null !=
            (t =
              null == (n = e.getHeaderGroups()[0])
                ? void 0
                : n.headers.reduce((e, t) => e + t.getSize(), 0))
            ? t
            : 0;
        }),
        (e.getLeftTotalSize = () => {
          var t, n;
          return null !=
            (t =
              null == (n = e.getLeftHeaderGroups()[0])
                ? void 0
                : n.headers.reduce((e, t) => e + t.getSize(), 0))
            ? t
            : 0;
        }),
        (e.getCenterTotalSize = () => {
          var t, n;
          return null !=
            (t =
              null == (n = e.getCenterHeaderGroups()[0])
                ? void 0
                : n.headers.reduce((e, t) => e + t.getSize(), 0))
            ? t
            : 0;
        }),
        (e.getRightTotalSize = () => {
          var t, n;
          return null !=
            (t =
              null == (n = e.getRightHeaderGroups()[0])
                ? void 0
                : n.headers.reduce((e, t) => e + t.getSize(), 0))
            ? t
            : 0;
        });
    },
  };
let Ke = null;
function Ne(e) {
  return 'touchstart' === e.type;
}
const We = {
    getInitialState: (e) => ({ expanded: {}, ...e }),
    getDefaultOptions: (e) => ({ onExpandedChange: Le('expanded', e), paginateExpandedRows: !0 }),
    createTable: (e) => {
      let t = !1,
        n = !1;
      (e._autoResetExpanded = () => {
        var o, i;
        if (t) {
          if (
            null != (o = null != (i = e.options.autoResetAll) ? i : e.options.autoResetExpanded)
              ? o
              : !e.options.manualExpanding
          ) {
            if (n) return;
            (n = !0),
              e._queue(() => {
                e.resetExpanded(), (n = !1);
              });
          }
        } else
          e._queue(() => {
            t = !0;
          });
      }),
        (e.setExpanded = (t) =>
          null == e.options.onExpandedChange ? void 0 : e.options.onExpandedChange(t)),
        (e.toggleAllRowsExpanded = (t) => {
          (null != t ? t : !e.getIsAllRowsExpanded()) ? e.setExpanded(!0) : e.setExpanded({});
        }),
        (e.resetExpanded = (t) => {
          var n, o;
          e.setExpanded(
            t ? {} : null != (n = null == (o = e.initialState) ? void 0 : o.expanded) ? n : {},
          );
        }),
        (e.getCanSomeRowsExpand = () =>
          e.getPrePaginationRowModel().flatRows.some((e) => e.getCanExpand())),
        (e.getToggleAllRowsExpandedHandler = () => (t) => {
          null == t.persist || t.persist(), e.toggleAllRowsExpanded();
        }),
        (e.getIsSomeRowsExpanded = () => {
          const t = e.getState().expanded;
          return !0 === t || Object.values(t).some(Boolean);
        }),
        (e.getIsAllRowsExpanded = () => {
          const t = e.getState().expanded;
          return 'boolean' == typeof t
            ? !0 === t
            : !!Object.keys(t).length && !e.getRowModel().flatRows.some((e) => !e.getIsExpanded());
        }),
        (e.getExpandedDepth = () => {
          let t = 0;
          return (
            (!0 === e.getState().expanded
              ? Object.keys(e.getRowModel().rowsById)
              : Object.keys(e.getState().expanded)
            ).forEach((e) => {
              const n = e.split('.');
              t = Math.max(t, n.length);
            }),
            t
          );
        }),
        (e.getPreExpandedRowModel = () => e.getSortedRowModel()),
        (e.getExpandedRowModel = () => (
          !e._getExpandedRowModel &&
            e.options.getExpandedRowModel &&
            (e._getExpandedRowModel = e.options.getExpandedRowModel(e)),
          e.options.manualExpanding || !e._getExpandedRowModel
            ? e.getPreExpandedRowModel()
            : e._getExpandedRowModel()
        ));
    },
    createRow: (e, t) => {
      (e.toggleExpanded = (n) => {
        t.setExpanded((o) => {
          var i;
          const s = !0 === o || !(null == o || !o[e.id]);
          let l = {};
          if (
            (!0 === o
              ? Object.keys(t.getRowModel().rowsById).forEach((e) => {
                  l[e] = !0;
                })
              : (l = o),
            (n = null != (i = n) ? i : !s),
            !s && n)
          )
            return { ...l, [e.id]: !0 };
          if (s && !n) {
            const { [e.id]: t, ...n } = l;
            return n;
          }
          return o;
        });
      }),
        (e.getIsExpanded = () => {
          var n;
          const o = t.getState().expanded;
          return !!(null !=
          (n = null == t.options.getIsRowExpanded ? void 0 : t.options.getIsRowExpanded(e))
            ? n
            : !0 === o || (null == o ? void 0 : o[e.id]));
        }),
        (e.getCanExpand = () => {
          var n, o, i;
          return null !=
            (n = null == t.options.getRowCanExpand ? void 0 : t.options.getRowCanExpand(e))
            ? n
            : (null == (o = t.options.enableExpanding) || o) &&
                !(null == (i = e.subRows) || !i.length);
        }),
        (e.getIsAllParentsExpanded = () => {
          let n = !0,
            o = e;
          for (; n && o.parentId; ) (o = t.getRow(o.parentId, !0)), (n = o.getIsExpanded());
          return n;
        }),
        (e.getToggleExpandedHandler = () => {
          const t = e.getCanExpand();
          return () => {
            t && e.toggleExpanded();
          };
        });
    },
  },
  $e = (e, t, n) => {
    var o;
    const i = n.toLowerCase();
    return Boolean(
      null == (o = e.getValue(t)) || null == (o = o.toString()) || null == (o = o.toLowerCase())
        ? void 0
        : o.includes(i),
    );
  };
$e.autoRemove = (e) => st(e);
const Xe = (e, t, n) => {
  var o;
  return Boolean(
    null == (o = e.getValue(t)) || null == (o = o.toString()) ? void 0 : o.includes(n),
  );
};
Xe.autoRemove = (e) => st(e);
const Je = (e, t, n) => {
  var o;
  return (
    (null == (o = e.getValue(t)) || null == (o = o.toString()) ? void 0 : o.toLowerCase()) ===
    (null == n ? void 0 : n.toLowerCase())
  );
};
Je.autoRemove = (e) => st(e);
const Ye = (e, t, n) => {
  var o;
  return null == (o = e.getValue(t)) ? void 0 : o.includes(n);
};
Ye.autoRemove = (e) => st(e) || !(null != e && e.length);
const Ze = (e, t, n) =>
  !n.some((n) => {
    var o;
    return !(null != (o = e.getValue(t)) && o.includes(n));
  });
Ze.autoRemove = (e) => st(e) || !(null != e && e.length);
const et = (e, t, n) =>
  n.some((n) => {
    var o;
    return null == (o = e.getValue(t)) ? void 0 : o.includes(n);
  });
et.autoRemove = (e) => st(e) || !(null != e && e.length);
const tt = (e, t, n) => e.getValue(t) === n;
tt.autoRemove = (e) => st(e);
const nt = (e, t, n) => e.getValue(t) == n;
nt.autoRemove = (e) => st(e);
const ot = (e, t, n) => {
  let [o, i] = n;
  const s = e.getValue(t);
  return s >= o && s <= i;
};
(ot.resolveFilterValue = (e) => {
  let [t, n] = e,
    o = 'number' != typeof t ? parseFloat(t) : t,
    i = 'number' != typeof n ? parseFloat(n) : n,
    s = null === t || Number.isNaN(o) ? -1 / 0 : o,
    l = null === n || Number.isNaN(i) ? 1 / 0 : i;
  if (s > l) {
    const e = s;
    (s = l), (l = e);
  }
  return [s, l];
}),
  (ot.autoRemove = (e) => st(e) || (st(e[0]) && st(e[1])));
const it = {
  includesString: $e,
  includesStringSensitive: Xe,
  equalsString: Je,
  arrIncludes: Ye,
  arrIncludesAll: Ze,
  arrIncludesSome: et,
  equals: tt,
  weakEquals: nt,
  inNumberRange: ot,
};
function st(e) {
  return null == e || '' === e;
}
function lt(e, t, n) {
  return (
    (!(!e || !e.autoRemove) && e.autoRemove(t, n)) || void 0 === t || ('string' == typeof t && !t)
  );
}
const rt = {
  sum: (e, t, n) =>
    n.reduce((t, n) => {
      const o = n.getValue(e);
      return t + ('number' == typeof o ? o : 0);
    }, 0),
  min: (e, t, n) => {
    let o;
    return (
      n.forEach((t) => {
        const n = t.getValue(e);
        null != n && (o > n || (void 0 === o && n >= n)) && (o = n);
      }),
      o
    );
  },
  max: (e, t, n) => {
    let o;
    return (
      n.forEach((t) => {
        const n = t.getValue(e);
        null != n && (o < n || (void 0 === o && n >= n)) && (o = n);
      }),
      o
    );
  },
  extent: (e, t, n) => {
    let o, i;
    return (
      n.forEach((t) => {
        const n = t.getValue(e);
        null != n && (void 0 === o ? n >= n && (o = i = n) : (o > n && (o = n), i < n && (i = n)));
      }),
      [o, i]
    );
  },
  mean: (e, t) => {
    let n = 0,
      o = 0;
    if (
      (t.forEach((t) => {
        let i = t.getValue(e);
        null != i && (i = +i) >= i && (++n, (o += i));
      }),
      n)
    )
      return o / n;
  },
  median: (e, t) => {
    if (!t.length) return;
    const n = t.map((t) => t.getValue(e));
    if (((o = n), !Array.isArray(o) || !o.every((e) => 'number' == typeof e))) return;
    var o;
    if (1 === n.length) return n[0];
    const i = Math.floor(n.length / 2),
      s = n.sort((e, t) => e - t);
    return n.length % 2 != 0 ? s[i] : (s[i - 1] + s[i]) / 2;
  },
  unique: (e, t) => Array.from(new Set(t.map((t) => t.getValue(e))).values()),
  uniqueCount: (e, t) => new Set(t.map((t) => t.getValue(e))).size,
  count: (e, t) => t.length,
};
const at = {
    getInitialState: (e) => ({ rowSelection: {}, ...e }),
    getDefaultOptions: (e) => ({
      onRowSelectionChange: Le('rowSelection', e),
      enableRowSelection: !0,
      enableMultiRowSelection: !0,
      enableSubRowSelection: !0,
    }),
    createTable: (e) => {
      (e.setRowSelection = (t) =>
        null == e.options.onRowSelectionChange ? void 0 : e.options.onRowSelectionChange(t)),
        (e.resetRowSelection = (t) => {
          var n;
          return e.setRowSelection(t ? {} : null != (n = e.initialState.rowSelection) ? n : {});
        }),
        (e.toggleAllRowsSelected = (t) => {
          e.setRowSelection((n) => {
            t = void 0 !== t ? t : !e.getIsAllRowsSelected();
            const o = { ...n },
              i = e.getPreGroupedRowModel().flatRows;
            return (
              t
                ? i.forEach((e) => {
                    e.getCanSelect() && (o[e.id] = !0);
                  })
                : i.forEach((e) => {
                    delete o[e.id];
                  }),
              o
            );
          });
        }),
        (e.toggleAllPageRowsSelected = (t) =>
          e.setRowSelection((n) => {
            const o = void 0 !== t ? t : !e.getIsAllPageRowsSelected(),
              i = { ...n };
            return (
              e.getRowModel().rows.forEach((t) => {
                ut(i, t.id, o, !0, e);
              }),
              i
            );
          })),
        (e.getPreSelectedRowModel = () => e.getCoreRowModel()),
        (e.getSelectedRowModel = He(
          () => [e.getState().rowSelection, e.getCoreRowModel()],
          (t, n) => (Object.keys(t).length ? ct(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          {
            key: !1,
            debug: () => {
              var t;
              return null != (t = e.options.debugAll) ? t : e.options.debugTable;
            },
          },
        )),
        (e.getFilteredSelectedRowModel = He(
          () => [e.getState().rowSelection, e.getFilteredRowModel()],
          (t, n) => (Object.keys(t).length ? ct(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          {
            key: 'getFilteredSelectedRowModel',
            debug: () => {
              var t;
              return null != (t = e.options.debugAll) ? t : e.options.debugTable;
            },
          },
        )),
        (e.getGroupedSelectedRowModel = He(
          () => [e.getState().rowSelection, e.getSortedRowModel()],
          (t, n) => (Object.keys(t).length ? ct(e, n) : { rows: [], flatRows: [], rowsById: {} }),
          {
            key: 'getGroupedSelectedRowModel',
            debug: () => {
              var t;
              return null != (t = e.options.debugAll) ? t : e.options.debugTable;
            },
          },
        )),
        (e.getIsAllRowsSelected = () => {
          const t = e.getFilteredRowModel().flatRows,
            { rowSelection: n } = e.getState();
          let o = Boolean(t.length && Object.keys(n).length);
          return o && t.some((e) => e.getCanSelect() && !n[e.id]) && (o = !1), o;
        }),
        (e.getIsAllPageRowsSelected = () => {
          const t = e.getPaginationRowModel().flatRows.filter((e) => e.getCanSelect()),
            { rowSelection: n } = e.getState();
          let o = !!t.length;
          return o && t.some((e) => !n[e.id]) && (o = !1), o;
        }),
        (e.getIsSomeRowsSelected = () => {
          var t;
          const n = Object.keys(null != (t = e.getState().rowSelection) ? t : {}).length;
          return n > 0 && n < e.getFilteredRowModel().flatRows.length;
        }),
        (e.getIsSomePageRowsSelected = () => {
          const t = e.getPaginationRowModel().flatRows;
          return (
            !e.getIsAllPageRowsSelected() &&
            t
              .filter((e) => e.getCanSelect())
              .some((e) => e.getIsSelected() || e.getIsSomeSelected())
          );
        }),
        (e.getToggleAllRowsSelectedHandler = () => (t) => {
          e.toggleAllRowsSelected(t.target.checked);
        }),
        (e.getToggleAllPageRowsSelectedHandler = () => (t) => {
          e.toggleAllPageRowsSelected(t.target.checked);
        });
    },
    createRow: (e, t) => {
      (e.toggleSelected = (n, o) => {
        const i = e.getIsSelected();
        t.setRowSelection((s) => {
          var l;
          if (((n = void 0 !== n ? n : !i), e.getCanSelect() && i === n)) return s;
          const r = { ...s };
          return ut(r, e.id, n, null == (l = null == o ? void 0 : o.selectChildren) || l, t), r;
        });
      }),
        (e.getIsSelected = () => {
          const { rowSelection: n } = t.getState();
          return dt(e, n);
        }),
        (e.getIsSomeSelected = () => {
          const { rowSelection: n } = t.getState();
          return 'some' === ht(e, n);
        }),
        (e.getIsAllSubRowsSelected = () => {
          const { rowSelection: n } = t.getState();
          return 'all' === ht(e, n);
        }),
        (e.getCanSelect = () => {
          var n;
          return 'function' == typeof t.options.enableRowSelection
            ? t.options.enableRowSelection(e)
            : null == (n = t.options.enableRowSelection) || n;
        }),
        (e.getCanSelectSubRows = () => {
          var n;
          return 'function' == typeof t.options.enableSubRowSelection
            ? t.options.enableSubRowSelection(e)
            : null == (n = t.options.enableSubRowSelection) || n;
        }),
        (e.getCanMultiSelect = () => {
          var n;
          return 'function' == typeof t.options.enableMultiRowSelection
            ? t.options.enableMultiRowSelection(e)
            : null == (n = t.options.enableMultiRowSelection) || n;
        }),
        (e.getToggleSelectedHandler = () => {
          const t = e.getCanSelect();
          return (n) => {
            var o;
            t && e.toggleSelected(null == (o = n.target) ? void 0 : o.checked);
          };
        });
    },
  },
  ut = (e, t, n, o, i) => {
    var s;
    const l = i.getRow(t, !0);
    n
      ? (l.getCanMultiSelect() || Object.keys(e).forEach((t) => delete e[t]),
        l.getCanSelect() && (e[t] = !0))
      : delete e[t],
      o &&
        null != (s = l.subRows) &&
        s.length &&
        l.getCanSelectSubRows() &&
        l.subRows.forEach((t) => ut(e, t.id, n, o, i));
  };
function ct(e, t) {
  const n = e.getState().rowSelection,
    o = [],
    i = {},
    s = function (e, t) {
      return e
        .map((e) => {
          var t;
          const l = dt(e, n);
          if (
            (l && (o.push(e), (i[e.id] = e)),
            null != (t = e.subRows) && t.length && (e = { ...e, subRows: s(e.subRows) }),
            l)
          )
            return e;
        })
        .filter(Boolean);
    };
  return { rows: s(t.rows), flatRows: o, rowsById: i };
}
function dt(e, t) {
  var n;
  return null != (n = t[e.id]) && n;
}
function ht(e, t, n) {
  var o;
  if (null == (o = e.subRows) || !o.length) return !1;
  let i = !0,
    s = !1;
  return (
    e.subRows.forEach((e) => {
      if (
        (!s || i) &&
        (e.getCanSelect() && (dt(e, t) ? (s = !0) : (i = !1)), e.subRows && e.subRows.length)
      ) {
        const n = ht(e, t);
        'all' === n ? (s = !0) : 'some' === n ? ((s = !0), (i = !1)) : (i = !1);
      }
    }),
    i ? 'all' : !!s && 'some'
  );
}
const gt = /([0-9]+)/gm;
function ft(e, t) {
  return e === t ? 0 : e > t ? 1 : -1;
}
function pt(e) {
  return 'number' == typeof e
    ? isNaN(e) || e === 1 / 0 || e === -1 / 0
      ? ''
      : String(e)
    : 'string' == typeof e
      ? e
      : '';
}
function mt(e, t) {
  const n = e.split(gt).filter(Boolean),
    o = t.split(gt).filter(Boolean);
  for (; n.length && o.length; ) {
    const e = n.shift(),
      t = o.shift(),
      i = parseInt(e, 10),
      s = parseInt(t, 10),
      l = [i, s].sort();
    if (isNaN(l[0])) {
      if (e > t) return 1;
      if (t > e) return -1;
    } else {
      if (isNaN(l[1])) return isNaN(i) ? -1 : 1;
      if (i > s) return 1;
      if (s > i) return -1;
    }
  }
  return n.length - o.length;
}
const vt = {
    alphanumeric: (e, t, n) => mt(pt(e.getValue(n)).toLowerCase(), pt(t.getValue(n)).toLowerCase()),
    alphanumericCaseSensitive: (e, t, n) => mt(pt(e.getValue(n)), pt(t.getValue(n))),
    text: (e, t, n) => ft(pt(e.getValue(n)).toLowerCase(), pt(t.getValue(n)).toLowerCase()),
    textCaseSensitive: (e, t, n) => ft(pt(e.getValue(n)), pt(t.getValue(n))),
    datetime: (e, t, n) => {
      const o = e.getValue(n),
        i = t.getValue(n);
      return o > i ? 1 : o < i ? -1 : 0;
    },
    basic: (e, t, n) => ft(e.getValue(n), t.getValue(n)),
  },
  bt = [
    Qe,
    {
      getInitialState: (e) => ({ columnVisibility: {}, ...e }),
      getDefaultOptions: (e) => ({ onColumnVisibilityChange: Le('columnVisibility', e) }),
      createColumn: (e, t) => {
        (e.toggleVisibility = (n) => {
          e.getCanHide() &&
            t.setColumnVisibility((t) => ({ ...t, [e.id]: null != n ? n : !e.getIsVisible() }));
        }),
          (e.getIsVisible = () => {
            var n, o;
            return (
              null == (n = null == (o = t.getState().columnVisibility) ? void 0 : o[e.id]) || n
            );
          }),
          (e.getCanHide = () => {
            var n, o;
            return (
              (null == (n = e.columnDef.enableHiding) || n) &&
              (null == (o = t.options.enableHiding) || o)
            );
          }),
          (e.getToggleVisibilityHandler = () => (t) => {
            null == e.toggleVisibility || e.toggleVisibility(t.target.checked);
          });
      },
      createRow: (e, t) => {
        (e._getAllVisibleCells = He(
          () => [e.getAllCells(), t.getState().columnVisibility],
          (e) => e.filter((e) => e.column.getIsVisible()),
          {
            key: 'row._getAllVisibleCells',
            debug: () => {
              var e;
              return null != (e = t.options.debugAll) ? e : t.options.debugRows;
            },
          },
        )),
          (e.getVisibleCells = He(
            () => [e.getLeftVisibleCells(), e.getCenterVisibleCells(), e.getRightVisibleCells()],
            (e, t, n) => [...e, ...t, ...n],
            {
              key: !1,
              debug: () => {
                var e;
                return null != (e = t.options.debugAll) ? e : t.options.debugRows;
              },
            },
          ));
      },
      createTable: (e) => {
        const t = (t, n) =>
          He(
            () => [
              n(),
              n()
                .filter((e) => e.getIsVisible())
                .map((e) => e.id)
                .join('_'),
            ],
            (e) => e.filter((e) => (null == e.getIsVisible ? void 0 : e.getIsVisible())),
            {
              key: t,
              debug: () => {
                var t;
                return null != (t = e.options.debugAll) ? t : e.options.debugColumns;
              },
            },
          );
        (e.getVisibleFlatColumns = t('getVisibleFlatColumns', () => e.getAllFlatColumns())),
          (e.getVisibleLeafColumns = t('getVisibleLeafColumns', () => e.getAllLeafColumns())),
          (e.getLeftVisibleLeafColumns = t('getLeftVisibleLeafColumns', () =>
            e.getLeftLeafColumns(),
          )),
          (e.getRightVisibleLeafColumns = t('getRightVisibleLeafColumns', () =>
            e.getRightLeafColumns(),
          )),
          (e.getCenterVisibleLeafColumns = t('getCenterVisibleLeafColumns', () =>
            e.getCenterLeafColumns(),
          )),
          (e.setColumnVisibility = (t) =>
            null == e.options.onColumnVisibilityChange
              ? void 0
              : e.options.onColumnVisibilityChange(t)),
          (e.resetColumnVisibility = (t) => {
            var n;
            e.setColumnVisibility(t ? {} : null != (n = e.initialState.columnVisibility) ? n : {});
          }),
          (e.toggleAllColumnsVisible = (t) => {
            var n;
            (t = null != (n = t) ? n : !e.getIsAllColumnsVisible()),
              e.setColumnVisibility(
                e
                  .getAllLeafColumns()
                  .reduce(
                    (e, n) => ({ ...e, [n.id]: t || !(null != n.getCanHide && n.getCanHide()) }),
                    {},
                  ),
              );
          }),
          (e.getIsAllColumnsVisible = () =>
            !e.getAllLeafColumns().some((e) => !(null != e.getIsVisible && e.getIsVisible()))),
          (e.getIsSomeColumnsVisible = () =>
            e
              .getAllLeafColumns()
              .some((e) => (null == e.getIsVisible ? void 0 : e.getIsVisible()))),
          (e.getToggleAllColumnsVisibilityHandler = () => (t) => {
            var n;
            e.toggleAllColumnsVisible(null == (n = t.target) ? void 0 : n.checked);
          });
      },
    },
    {
      getInitialState: (e) => ({ columnOrder: [], ...e }),
      getDefaultOptions: (e) => ({ onColumnOrderChange: Le('columnOrder', e) }),
      createTable: (e) => {
        (e.setColumnOrder = (t) =>
          null == e.options.onColumnOrderChange ? void 0 : e.options.onColumnOrderChange(t)),
          (e.resetColumnOrder = (t) => {
            var n;
            e.setColumnOrder(t ? [] : null != (n = e.initialState.columnOrder) ? n : []);
          }),
          (e._getOrderColumnsFn = He(
            () => [e.getState().columnOrder, e.getState().grouping, e.options.groupedColumnMode],
            (e, t, n) => (o) => {
              let i = [];
              if (null != e && e.length) {
                const t = [...e],
                  n = [...o];
                for (; n.length && t.length; ) {
                  const e = t.shift(),
                    o = n.findIndex((t) => t.id === e);
                  o > -1 && i.push(n.splice(o, 1)[0]);
                }
                i = [...i, ...n];
              } else i = o;
              return (function (e, t, n) {
                if (null == t || !t.length || !n) return e;
                const o = e.filter((e) => !t.includes(e.id));
                return 'remove' === n
                  ? o
                  : [...t.map((t) => e.find((e) => e.id === t)).filter(Boolean), ...o];
              })(i, t, n);
            },
            { key: !1 },
          ));
      },
    },
    {
      getInitialState: (e) => ({
        columnPinning: { left: [], right: [] },
        rowPinning: { top: [], bottom: [] },
        ...e,
      }),
      getDefaultOptions: (e) => ({
        onColumnPinningChange: Le('columnPinning', e),
        onRowPinningChange: Le('rowPinning', e),
      }),
      createColumn: (e, t) => {
        (e.pin = (n) => {
          const o = e
            .getLeafColumns()
            .map((e) => e.id)
            .filter(Boolean);
          t.setColumnPinning((e) => {
            var t, i, s, l, r, a;
            return 'right' === n
              ? {
                  left: (null != (s = null == e ? void 0 : e.left) ? s : []).filter(
                    (e) => !(null != o && o.includes(e)),
                  ),
                  right: [
                    ...(null != (l = null == e ? void 0 : e.right) ? l : []).filter(
                      (e) => !(null != o && o.includes(e)),
                    ),
                    ...o,
                  ],
                }
              : 'left' === n
                ? {
                    left: [
                      ...(null != (r = null == e ? void 0 : e.left) ? r : []).filter(
                        (e) => !(null != o && o.includes(e)),
                      ),
                      ...o,
                    ],
                    right: (null != (a = null == e ? void 0 : e.right) ? a : []).filter(
                      (e) => !(null != o && o.includes(e)),
                    ),
                  }
                : {
                    left: (null != (t = null == e ? void 0 : e.left) ? t : []).filter(
                      (e) => !(null != o && o.includes(e)),
                    ),
                    right: (null != (i = null == e ? void 0 : e.right) ? i : []).filter(
                      (e) => !(null != o && o.includes(e)),
                    ),
                  };
          });
        }),
          (e.getCanPin = () =>
            e.getLeafColumns().some((e) => {
              var n, o, i;
              return (
                (null == (n = e.columnDef.enablePinning) || n) &&
                (null ==
                  (o = null != (i = t.options.enableColumnPinning) ? i : t.options.enablePinning) ||
                  o)
              );
            })),
          (e.getIsPinned = () => {
            const n = e.getLeafColumns().map((e) => e.id),
              { left: o, right: i } = t.getState().columnPinning,
              s = n.some((e) => (null == o ? void 0 : o.includes(e))),
              l = n.some((e) => (null == i ? void 0 : i.includes(e)));
            return s ? 'left' : !!l && 'right';
          }),
          (e.getPinnedIndex = () => {
            var n, o;
            const i = e.getIsPinned();
            return i
              ? null !=
                (n =
                  null == (o = t.getState().columnPinning) || null == (o = o[i])
                    ? void 0
                    : o.indexOf(e.id))
                ? n
                : -1
              : 0;
          });
      },
      createRow: (e, t) => {
        (e.pin = (n, o, i) => {
          const s = o
              ? e.getLeafRows().map((e) => {
                  let { id: t } = e;
                  return t;
                })
              : [],
            l = i
              ? e.getParentRows().map((e) => {
                  let { id: t } = e;
                  return t;
                })
              : [],
            r = new Set([...l, e.id, ...s]);
          t.setRowPinning((e) => {
            var t, o, i, s, l, a;
            return 'bottom' === n
              ? {
                  top: (null != (i = null == e ? void 0 : e.top) ? i : []).filter(
                    (e) => !(null != r && r.has(e)),
                  ),
                  bottom: [
                    ...(null != (s = null == e ? void 0 : e.bottom) ? s : []).filter(
                      (e) => !(null != r && r.has(e)),
                    ),
                    ...Array.from(r),
                  ],
                }
              : 'top' === n
                ? {
                    top: [
                      ...(null != (l = null == e ? void 0 : e.top) ? l : []).filter(
                        (e) => !(null != r && r.has(e)),
                      ),
                      ...Array.from(r),
                    ],
                    bottom: (null != (a = null == e ? void 0 : e.bottom) ? a : []).filter(
                      (e) => !(null != r && r.has(e)),
                    ),
                  }
                : {
                    top: (null != (t = null == e ? void 0 : e.top) ? t : []).filter(
                      (e) => !(null != r && r.has(e)),
                    ),
                    bottom: (null != (o = null == e ? void 0 : e.bottom) ? o : []).filter(
                      (e) => !(null != r && r.has(e)),
                    ),
                  };
          });
        }),
          (e.getCanPin = () => {
            var n;
            const { enableRowPinning: o, enablePinning: i } = t.options;
            return 'function' == typeof o ? o(e) : null == (n = null != o ? o : i) || n;
          }),
          (e.getIsPinned = () => {
            const n = [e.id],
              { top: o, bottom: i } = t.getState().rowPinning,
              s = n.some((e) => (null == o ? void 0 : o.includes(e))),
              l = n.some((e) => (null == i ? void 0 : i.includes(e)));
            return s ? 'top' : !!l && 'bottom';
          }),
          (e.getPinnedIndex = () => {
            var n, o;
            const i = e.getIsPinned();
            if (!i) return -1;
            const s =
              null == (n = t._getPinnedRows(i))
                ? void 0
                : n.map((e) => {
                    let { id: t } = e;
                    return t;
                  });
            return null != (o = null == s ? void 0 : s.indexOf(e.id)) ? o : -1;
          }),
          (e.getCenterVisibleCells = He(
            () => [
              e._getAllVisibleCells(),
              t.getState().columnPinning.left,
              t.getState().columnPinning.right,
            ],
            (e, t, n) => {
              const o = [...(null != t ? t : []), ...(null != n ? n : [])];
              return e.filter((e) => !o.includes(e.column.id));
            },
            {
              key: !1,
              debug: () => {
                var e;
                return null != (e = t.options.debugAll) ? e : t.options.debugRows;
              },
            },
          )),
          (e.getLeftVisibleCells = He(
            () => [e._getAllVisibleCells(), t.getState().columnPinning.left, ,],
            (e, t) =>
              (null != t ? t : [])
                .map((t) => e.find((e) => e.column.id === t))
                .filter(Boolean)
                .map((e) => ({ ...e, position: 'left' })),
            {
              key: !1,
              debug: () => {
                var e;
                return null != (e = t.options.debugAll) ? e : t.options.debugRows;
              },
            },
          )),
          (e.getRightVisibleCells = He(
            () => [e._getAllVisibleCells(), t.getState().columnPinning.right],
            (e, t) =>
              (null != t ? t : [])
                .map((t) => e.find((e) => e.column.id === t))
                .filter(Boolean)
                .map((e) => ({ ...e, position: 'right' })),
            {
              key: !1,
              debug: () => {
                var e;
                return null != (e = t.options.debugAll) ? e : t.options.debugRows;
              },
            },
          ));
      },
      createTable: (e) => {
        (e.setColumnPinning = (t) =>
          null == e.options.onColumnPinningChange ? void 0 : e.options.onColumnPinningChange(t)),
          (e.resetColumnPinning = (t) => {
            var n, o;
            return e.setColumnPinning(
              t
                ? { left: [], right: [] }
                : null != (n = null == (o = e.initialState) ? void 0 : o.columnPinning)
                  ? n
                  : { left: [], right: [] },
            );
          }),
          (e.getIsSomeColumnsPinned = (t) => {
            var n;
            const o = e.getState().columnPinning;
            var i, s;
            return t
              ? Boolean(null == (n = o[t]) ? void 0 : n.length)
              : Boolean(
                  (null == (i = o.left) ? void 0 : i.length) ||
                    (null == (s = o.right) ? void 0 : s.length),
                );
          }),
          (e.getLeftLeafColumns = He(
            () => [e.getAllLeafColumns(), e.getState().columnPinning.left],
            (e, t) => (null != t ? t : []).map((t) => e.find((e) => e.id === t)).filter(Boolean),
            {
              key: !1,
              debug: () => {
                var t;
                return null != (t = e.options.debugAll) ? t : e.options.debugColumns;
              },
            },
          )),
          (e.getRightLeafColumns = He(
            () => [e.getAllLeafColumns(), e.getState().columnPinning.right],
            (e, t) => (null != t ? t : []).map((t) => e.find((e) => e.id === t)).filter(Boolean),
            {
              key: !1,
              debug: () => {
                var t;
                return null != (t = e.options.debugAll) ? t : e.options.debugColumns;
              },
            },
          )),
          (e.getCenterLeafColumns = He(
            () => [
              e.getAllLeafColumns(),
              e.getState().columnPinning.left,
              e.getState().columnPinning.right,
            ],
            (e, t, n) => {
              const o = [...(null != t ? t : []), ...(null != n ? n : [])];
              return e.filter((e) => !o.includes(e.id));
            },
            {
              key: !1,
              debug: () => {
                var t;
                return null != (t = e.options.debugAll) ? t : e.options.debugColumns;
              },
            },
          )),
          (e.setRowPinning = (t) =>
            null == e.options.onRowPinningChange ? void 0 : e.options.onRowPinningChange(t)),
          (e.resetRowPinning = (t) => {
            var n, o;
            return e.setRowPinning(
              t
                ? { top: [], bottom: [] }
                : null != (n = null == (o = e.initialState) ? void 0 : o.rowPinning)
                  ? n
                  : { top: [], bottom: [] },
            );
          }),
          (e.getIsSomeRowsPinned = (t) => {
            var n;
            const o = e.getState().rowPinning;
            var i, s;
            return t
              ? Boolean(null == (n = o[t]) ? void 0 : n.length)
              : Boolean(
                  (null == (i = o.top) ? void 0 : i.length) ||
                    (null == (s = o.bottom) ? void 0 : s.length),
                );
          }),
          (e._getPinnedRows = (t) =>
            He(
              () => [e.getRowModel().rows, e.getState().rowPinning[t]],
              (n, o) => {
                var i;
                return (
                  null == (i = e.options.keepPinnedRows) || i
                    ? (null != o ? o : []).map((t) => {
                        const n = e.getRow(t, !0);
                        return n.getIsAllParentsExpanded() ? n : null;
                      })
                    : (null != o ? o : []).map((e) => n.find((t) => t.id === e))
                )
                  .filter(Boolean)
                  .map((e) => ({ ...e, position: t }));
              },
              {
                key: !1,
                debug: () => {
                  var t;
                  return null != (t = e.options.debugAll) ? t : e.options.debugRows;
                },
              },
            )()),
          (e.getTopRows = () => e._getPinnedRows('top')),
          (e.getBottomRows = () => e._getPinnedRows('bottom')),
          (e.getCenterRows = He(
            () => [
              e.getRowModel().rows,
              e.getState().rowPinning.top,
              e.getState().rowPinning.bottom,
            ],
            (e, t, n) => {
              const o = new Set([...(null != t ? t : []), ...(null != n ? n : [])]);
              return e.filter((e) => !o.has(e.id));
            },
            {
              key: !1,
              debug: () => {
                var t;
                return null != (t = e.options.debugAll) ? t : e.options.debugRows;
              },
            },
          ));
      },
    },
    {
      getDefaultColumnDef: () => ({ filterFn: 'auto' }),
      getInitialState: (e) => ({ columnFilters: [], globalFilter: void 0, ...e }),
      getDefaultOptions: (e) => ({
        onColumnFiltersChange: Le('columnFilters', e),
        onGlobalFilterChange: Le('globalFilter', e),
        filterFromLeafRows: !1,
        maxLeafRowFilterDepth: 100,
        globalFilterFn: 'auto',
        getColumnCanGlobalFilter: (t) => {
          var n;
          const o =
            null == (n = e.getCoreRowModel().flatRows[0]) ||
            null == (n = n._getAllCellsByColumnId()[t.id])
              ? void 0
              : n.getValue();
          return 'string' == typeof o || 'number' == typeof o;
        },
      }),
      createColumn: (e, t) => {
        (e.getAutoFilterFn = () => {
          const n = t.getCoreRowModel().flatRows[0],
            o = null == n ? void 0 : n.getValue(e.id);
          return 'string' == typeof o
            ? it.includesString
            : 'number' == typeof o
              ? it.inNumberRange
              : 'boolean' == typeof o || (null !== o && 'object' == typeof o)
                ? it.equals
                : Array.isArray(o)
                  ? it.arrIncludes
                  : it.weakEquals;
        }),
          (e.getFilterFn = () => {
            var n, o;
            return ke(e.columnDef.filterFn)
              ? e.columnDef.filterFn
              : 'auto' === e.columnDef.filterFn
                ? e.getAutoFilterFn()
                : null != (n = null == (o = t.options.filterFns) ? void 0 : o[e.columnDef.filterFn])
                  ? n
                  : it[e.columnDef.filterFn];
          }),
          (e.getCanFilter = () => {
            var n, o, i;
            return (
              (null == (n = e.columnDef.enableColumnFilter) || n) &&
              (null == (o = t.options.enableColumnFilters) || o) &&
              (null == (i = t.options.enableFilters) || i) &&
              !!e.accessorFn
            );
          }),
          (e.getCanGlobalFilter = () => {
            var n, o, i, s;
            return (
              (null == (n = e.columnDef.enableGlobalFilter) || n) &&
              (null == (o = t.options.enableGlobalFilter) || o) &&
              (null == (i = t.options.enableFilters) || i) &&
              (null ==
                (s =
                  null == t.options.getColumnCanGlobalFilter
                    ? void 0
                    : t.options.getColumnCanGlobalFilter(e)) ||
                s) &&
              !!e.accessorFn
            );
          }),
          (e.getIsFiltered = () => e.getFilterIndex() > -1),
          (e.getFilterValue = () => {
            var n;
            return null == (n = t.getState().columnFilters) ||
              null == (n = n.find((t) => t.id === e.id))
              ? void 0
              : n.value;
          }),
          (e.getFilterIndex = () => {
            var n, o;
            return null !=
              (n =
                null == (o = t.getState().columnFilters)
                  ? void 0
                  : o.findIndex((t) => t.id === e.id))
              ? n
              : -1;
          }),
          (e.setFilterValue = (n) => {
            t.setColumnFilters((t) => {
              const o = e.getFilterFn(),
                i = null == t ? void 0 : t.find((t) => t.id === e.id),
                s = Te(n, i ? i.value : void 0);
              var l;
              if (lt(o, s, e))
                return null != (l = null == t ? void 0 : t.filter((t) => t.id !== e.id)) ? l : [];
              const r = { id: e.id, value: s };
              var a;
              return i
                ? null != (a = null == t ? void 0 : t.map((t) => (t.id === e.id ? r : t)))
                  ? a
                  : []
                : null != t && t.length
                  ? [...t, r]
                  : [r];
            });
          }),
          (e._getFacetedRowModel =
            t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id)),
          (e.getFacetedRowModel = () =>
            e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel()),
          (e._getFacetedUniqueValues =
            t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id)),
          (e.getFacetedUniqueValues = () =>
            e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : new Map()),
          (e._getFacetedMinMaxValues =
            t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id)),
          (e.getFacetedMinMaxValues = () => {
            if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues();
          });
      },
      createRow: (e, t) => {
        (e.columnFilters = {}), (e.columnFiltersMeta = {});
      },
      createTable: (e) => {
        (e.getGlobalAutoFilterFn = () => it.includesString),
          (e.getGlobalFilterFn = () => {
            var t, n;
            const { globalFilterFn: o } = e.options;
            return ke(o)
              ? o
              : 'auto' === o
                ? e.getGlobalAutoFilterFn()
                : null != (t = null == (n = e.options.filterFns) ? void 0 : n[o])
                  ? t
                  : it[o];
          }),
          (e.setColumnFilters = (t) => {
            const n = e.getAllLeafColumns();
            null == e.options.onColumnFiltersChange ||
              e.options.onColumnFiltersChange((e) => {
                var o;
                return null == (o = Te(t, e))
                  ? void 0
                  : o.filter((e) => {
                      const t = n.find((t) => t.id === e.id);
                      if (t) {
                        if (lt(t.getFilterFn(), e.value, t)) return !1;
                      }
                      return !0;
                    });
              });
          }),
          (e.setGlobalFilter = (t) => {
            null == e.options.onGlobalFilterChange || e.options.onGlobalFilterChange(t);
          }),
          (e.resetGlobalFilter = (t) => {
            e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter);
          }),
          (e.resetColumnFilters = (t) => {
            var n, o;
            e.setColumnFilters(
              t
                ? []
                : null != (n = null == (o = e.initialState) ? void 0 : o.columnFilters)
                  ? n
                  : [],
            );
          }),
          (e.getPreFilteredRowModel = () => e.getCoreRowModel()),
          (e.getFilteredRowModel = () => (
            !e._getFilteredRowModel &&
              e.options.getFilteredRowModel &&
              (e._getFilteredRowModel = e.options.getFilteredRowModel(e)),
            e.options.manualFiltering || !e._getFilteredRowModel
              ? e.getPreFilteredRowModel()
              : e._getFilteredRowModel()
          )),
          (e._getGlobalFacetedRowModel =
            e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, '__global__')),
          (e.getGlobalFacetedRowModel = () =>
            e.options.manualFiltering || !e._getGlobalFacetedRowModel
              ? e.getPreFilteredRowModel()
              : e._getGlobalFacetedRowModel()),
          (e._getGlobalFacetedUniqueValues =
            e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, '__global__')),
          (e.getGlobalFacetedUniqueValues = () =>
            e._getGlobalFacetedUniqueValues ? e._getGlobalFacetedUniqueValues() : new Map()),
          (e._getGlobalFacetedMinMaxValues =
            e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, '__global__')),
          (e.getGlobalFacetedMinMaxValues = () => {
            if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues();
          });
      },
    },
    {
      getInitialState: (e) => ({ sorting: [], ...e }),
      getDefaultColumnDef: () => ({ sortingFn: 'auto', sortUndefined: 1 }),
      getDefaultOptions: (e) => ({
        onSortingChange: Le('sorting', e),
        isMultiSortEvent: (e) => e.shiftKey,
      }),
      createColumn: (e, t) => {
        (e.getAutoSortingFn = () => {
          const n = t.getFilteredRowModel().flatRows.slice(10);
          let o = !1;
          for (const t of n) {
            const n = null == t ? void 0 : t.getValue(e.id);
            if ('[object Date]' === Object.prototype.toString.call(n)) return vt.datetime;
            if ('string' == typeof n && ((o = !0), n.split(gt).length > 1)) return vt.alphanumeric;
          }
          return o ? vt.text : vt.basic;
        }),
          (e.getAutoSortDir = () => {
            const n = t.getFilteredRowModel().flatRows[0];
            return 'string' == typeof (null == n ? void 0 : n.getValue(e.id)) ? 'asc' : 'desc';
          }),
          (e.getSortingFn = () => {
            var n, o;
            if (!e) throw new Error();
            return ke(e.columnDef.sortingFn)
              ? e.columnDef.sortingFn
              : 'auto' === e.columnDef.sortingFn
                ? e.getAutoSortingFn()
                : null !=
                    (n = null == (o = t.options.sortingFns) ? void 0 : o[e.columnDef.sortingFn])
                  ? n
                  : vt[e.columnDef.sortingFn];
          }),
          (e.toggleSorting = (n, o) => {
            const i = e.getNextSortingOrder(),
              s = null != n;
            t.setSorting((l) => {
              const r = null == l ? void 0 : l.find((t) => t.id === e.id),
                a = null == l ? void 0 : l.findIndex((t) => t.id === e.id);
              let u,
                c = [],
                d = s ? n : 'desc' === i;
              var h;
              ((u =
                null != l && l.length && e.getCanMultiSort() && o
                  ? r
                    ? 'toggle'
                    : 'add'
                  : null != l && l.length && a !== l.length - 1
                    ? 'replace'
                    : r
                      ? 'toggle'
                      : 'replace'),
              'toggle' === u && (s || i || (u = 'remove')),
              'add' === u)
                ? ((c = [...l, { id: e.id, desc: d }]),
                  c.splice(
                    0,
                    c.length -
                      (null != (h = t.options.maxMultiSortColCount) ? h : Number.MAX_SAFE_INTEGER),
                  ))
                : (c =
                    'toggle' === u
                      ? l.map((t) => (t.id === e.id ? { ...t, desc: d } : t))
                      : 'remove' === u
                        ? l.filter((t) => t.id !== e.id)
                        : [{ id: e.id, desc: d }]);
              return c;
            });
          }),
          (e.getFirstSortDir = () => {
            var n, o;
            return (
              null != (n = null != (o = e.columnDef.sortDescFirst) ? o : t.options.sortDescFirst)
                ? n
                : 'desc' === e.getAutoSortDir()
            )
              ? 'desc'
              : 'asc';
          }),
          (e.getNextSortingOrder = (n) => {
            var o, i;
            const s = e.getFirstSortDir(),
              l = e.getIsSorted();
            return l
              ? !!(
                  l === s ||
                  (null != (o = t.options.enableSortingRemoval) && !o) ||
                  (n && null != (i = t.options.enableMultiRemove) && !i)
                ) && ('desc' === l ? 'asc' : 'desc')
              : s;
          }),
          (e.getCanSort = () => {
            var n, o;
            return (
              (null == (n = e.columnDef.enableSorting) || n) &&
              (null == (o = t.options.enableSorting) || o) &&
              !!e.accessorFn
            );
          }),
          (e.getCanMultiSort = () => {
            var n, o;
            return null !=
              (n = null != (o = e.columnDef.enableMultiSort) ? o : t.options.enableMultiSort)
              ? n
              : !!e.accessorFn;
          }),
          (e.getIsSorted = () => {
            var n;
            const o = null == (n = t.getState().sorting) ? void 0 : n.find((t) => t.id === e.id);
            return !!o && (o.desc ? 'desc' : 'asc');
          }),
          (e.getSortIndex = () => {
            var n, o;
            return null !=
              (n = null == (o = t.getState().sorting) ? void 0 : o.findIndex((t) => t.id === e.id))
              ? n
              : -1;
          }),
          (e.clearSorting = () => {
            t.setSorting((t) => (null != t && t.length ? t.filter((t) => t.id !== e.id) : []));
          }),
          (e.getToggleSortingHandler = () => {
            const n = e.getCanSort();
            return (o) => {
              n &&
                (null == o.persist || o.persist(),
                null == e.toggleSorting ||
                  e.toggleSorting(
                    void 0,
                    !!e.getCanMultiSort() &&
                      (null == t.options.isMultiSortEvent ? void 0 : t.options.isMultiSortEvent(o)),
                  ));
            };
          });
      },
      createTable: (e) => {
        (e.setSorting = (t) =>
          null == e.options.onSortingChange ? void 0 : e.options.onSortingChange(t)),
          (e.resetSorting = (t) => {
            var n, o;
            e.setSorting(
              t ? [] : null != (n = null == (o = e.initialState) ? void 0 : o.sorting) ? n : [],
            );
          }),
          (e.getPreSortedRowModel = () => e.getGroupedRowModel()),
          (e.getSortedRowModel = () => (
            !e._getSortedRowModel &&
              e.options.getSortedRowModel &&
              (e._getSortedRowModel = e.options.getSortedRowModel(e)),
            e.options.manualSorting || !e._getSortedRowModel
              ? e.getPreSortedRowModel()
              : e._getSortedRowModel()
          ));
      },
    },
    {
      getDefaultColumnDef: () => ({
        aggregatedCell: (e) => {
          var t, n;
          return null !=
            (t = null == (n = e.getValue()) || null == n.toString ? void 0 : n.toString())
            ? t
            : null;
        },
        aggregationFn: 'auto',
      }),
      getInitialState: (e) => ({ grouping: [], ...e }),
      getDefaultOptions: (e) => ({
        onGroupingChange: Le('grouping', e),
        groupedColumnMode: 'reorder',
      }),
      createColumn: (e, t) => {
        (e.toggleGrouping = () => {
          t.setGrouping((t) =>
            null != t && t.includes(e.id)
              ? t.filter((t) => t !== e.id)
              : [...(null != t ? t : []), e.id],
          );
        }),
          (e.getCanGroup = () => {
            var n, o, i, s;
            return null !=
              (n =
                null ==
                  (o =
                    null != (i = null == (s = e.columnDef.enableGrouping) || s)
                      ? i
                      : t.options.enableGrouping) || o)
              ? n
              : !!e.accessorFn;
          }),
          (e.getIsGrouped = () => {
            var n;
            return null == (n = t.getState().grouping) ? void 0 : n.includes(e.id);
          }),
          (e.getGroupedIndex = () => {
            var n;
            return null == (n = t.getState().grouping) ? void 0 : n.indexOf(e.id);
          }),
          (e.getToggleGroupingHandler = () => {
            const t = e.getCanGroup();
            return () => {
              t && e.toggleGrouping();
            };
          }),
          (e.getAutoAggregationFn = () => {
            const n = t.getCoreRowModel().flatRows[0],
              o = null == n ? void 0 : n.getValue(e.id);
            return 'number' == typeof o
              ? rt.sum
              : '[object Date]' === Object.prototype.toString.call(o)
                ? rt.extent
                : void 0;
          }),
          (e.getAggregationFn = () => {
            var n, o;
            if (!e) throw new Error();
            return ke(e.columnDef.aggregationFn)
              ? e.columnDef.aggregationFn
              : 'auto' === e.columnDef.aggregationFn
                ? e.getAutoAggregationFn()
                : null !=
                    (n =
                      null == (o = t.options.aggregationFns)
                        ? void 0
                        : o[e.columnDef.aggregationFn])
                  ? n
                  : rt[e.columnDef.aggregationFn];
          });
      },
      createTable: (e) => {
        (e.setGrouping = (t) =>
          null == e.options.onGroupingChange ? void 0 : e.options.onGroupingChange(t)),
          (e.resetGrouping = (t) => {
            var n, o;
            e.setGrouping(
              t ? [] : null != (n = null == (o = e.initialState) ? void 0 : o.grouping) ? n : [],
            );
          }),
          (e.getPreGroupedRowModel = () => e.getFilteredRowModel()),
          (e.getGroupedRowModel = () => (
            !e._getGroupedRowModel &&
              e.options.getGroupedRowModel &&
              (e._getGroupedRowModel = e.options.getGroupedRowModel(e)),
            e.options.manualGrouping || !e._getGroupedRowModel
              ? e.getPreGroupedRowModel()
              : e._getGroupedRowModel()
          ));
      },
      createRow: (e, t) => {
        (e.getIsGrouped = () => !!e.groupingColumnId),
          (e.getGroupingValue = (n) => {
            if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n];
            const o = t.getColumn(n);
            return null != o && o.columnDef.getGroupingValue
              ? ((e._groupingValuesCache[n] = o.columnDef.getGroupingValue(e.original)),
                e._groupingValuesCache[n])
              : e.getValue(n);
          }),
          (e._groupingValuesCache = {});
      },
      createCell: (e, t, n, o) => {
        (e.getIsGrouped = () => t.getIsGrouped() && t.id === n.groupingColumnId),
          (e.getIsPlaceholder = () => !e.getIsGrouped() && t.getIsGrouped()),
          (e.getIsAggregated = () => {
            var t;
            return (
              !e.getIsGrouped() && !e.getIsPlaceholder() && !(null == (t = n.subRows) || !t.length)
            );
          });
      },
    },
    We,
    {
      getInitialState: (e) => ({
        ...e,
        pagination: { pageIndex: 0, pageSize: 10, ...(null == e ? void 0 : e.pagination) },
      }),
      getDefaultOptions: (e) => ({ onPaginationChange: Le('pagination', e) }),
      createTable: (e) => {
        let t = !1,
          n = !1;
        (e._autoResetPageIndex = () => {
          var o, i;
          if (t) {
            if (
              null != (o = null != (i = e.options.autoResetAll) ? i : e.options.autoResetPageIndex)
                ? o
                : !e.options.manualPagination
            ) {
              if (n) return;
              (n = !0),
                e._queue(() => {
                  e.resetPageIndex(), (n = !1);
                });
            }
          } else
            e._queue(() => {
              t = !0;
            });
        }),
          (e.setPagination = (t) =>
            null == e.options.onPaginationChange
              ? void 0
              : e.options.onPaginationChange((e) => Te(t, e))),
          (e.resetPagination = (t) => {
            var n;
            e.setPagination(
              t
                ? { pageIndex: 0, pageSize: 10 }
                : null != (n = e.initialState.pagination)
                  ? n
                  : { pageIndex: 0, pageSize: 10 },
            );
          }),
          (e.setPageIndex = (t) => {
            e.setPagination((n) => {
              let o = Te(t, n.pageIndex);
              const i =
                void 0 === e.options.pageCount || -1 === e.options.pageCount
                  ? Number.MAX_SAFE_INTEGER
                  : e.options.pageCount - 1;
              return (o = Math.max(0, Math.min(o, i))), { ...n, pageIndex: o };
            });
          }),
          (e.resetPageIndex = (t) => {
            var n, o;
            e.setPageIndex(
              t
                ? 0
                : null !=
                    (n =
                      null == (o = e.initialState) || null == (o = o.pagination)
                        ? void 0
                        : o.pageIndex)
                  ? n
                  : 0,
            );
          }),
          (e.resetPageSize = (t) => {
            var n, o;
            e.setPageSize(
              t
                ? 10
                : null !=
                    (n =
                      null == (o = e.initialState) || null == (o = o.pagination)
                        ? void 0
                        : o.pageSize)
                  ? n
                  : 10,
            );
          }),
          (e.setPageSize = (t) => {
            e.setPagination((e) => {
              const n = Math.max(1, Te(t, e.pageSize)),
                o = e.pageSize * e.pageIndex,
                i = Math.floor(o / n);
              return { ...e, pageIndex: i, pageSize: n };
            });
          }),
          (e.setPageCount = (t) =>
            e.setPagination((n) => {
              var o;
              let i = Te(t, null != (o = e.options.pageCount) ? o : -1);
              return 'number' == typeof i && (i = Math.max(-1, i)), { ...n, pageCount: i };
            })),
          (e.getPageOptions = He(
            () => [e.getPageCount()],
            (e) => {
              let t = [];
              return e && e > 0 && (t = [...new Array(e)].fill(null).map((e, t) => t)), t;
            },
            {
              key: !1,
              debug: () => {
                var t;
                return null != (t = e.options.debugAll) ? t : e.options.debugTable;
              },
            },
          )),
          (e.getCanPreviousPage = () => e.getState().pagination.pageIndex > 0),
          (e.getCanNextPage = () => {
            const { pageIndex: t } = e.getState().pagination,
              n = e.getPageCount();
            return -1 === n || (0 !== n && t < n - 1);
          }),
          (e.previousPage = () => e.setPageIndex((e) => e - 1)),
          (e.nextPage = () => e.setPageIndex((e) => e + 1)),
          (e.getPrePaginationRowModel = () => e.getExpandedRowModel()),
          (e.getPaginationRowModel = () => (
            !e._getPaginationRowModel &&
              e.options.getPaginationRowModel &&
              (e._getPaginationRowModel = e.options.getPaginationRowModel(e)),
            e.options.manualPagination || !e._getPaginationRowModel
              ? e.getPrePaginationRowModel()
              : e._getPaginationRowModel()
          )),
          (e.getPageCount = () => {
            var t;
            return null != (t = e.options.pageCount)
              ? t
              : Math.ceil(
                  e.getPrePaginationRowModel().rows.length / e.getState().pagination.pageSize,
                );
          });
      },
    },
    at,
    je,
  ];
function yt(e) {
  var t;
  (e.debugAll || e.debugTable) && console.info('Creating Table Instance...');
  let n = { _features: bt };
  const o = n._features.reduce(
    (e, t) => Object.assign(e, null == t.getDefaultOptions ? void 0 : t.getDefaultOptions(n)),
    {},
  );
  let i = { ...(null != (t = e.initialState) ? t : {}) };
  n._features.forEach((e) => {
    var t;
    i = null != (t = null == e.getInitialState ? void 0 : e.getInitialState(i)) ? t : i;
  });
  const s = [];
  let l = !1;
  const r = {
    _features: bt,
    options: { ...o, ...e },
    initialState: i,
    _queue: (e) => {
      s.push(e),
        l ||
          ((l = !0),
          Promise.resolve()
            .then(() => {
              for (; s.length; ) s.shift()();
              l = !1;
            })
            .catch((e) =>
              setTimeout(() => {
                throw e;
              }),
            ));
    },
    reset: () => {
      n.setState(n.initialState);
    },
    setOptions: (e) => {
      const t = Te(e, n.options);
      var i;
      n.options = ((i = t), n.options.mergeOptions ? n.options.mergeOptions(o, i) : { ...o, ...i });
    },
    getState: () => n.options.state,
    setState: (e) => {
      null == n.options.onStateChange || n.options.onStateChange(e);
    },
    _getRowId: (e, t, o) => {
      var i;
      return null != (i = null == n.options.getRowId ? void 0 : n.options.getRowId(e, t, o))
        ? i
        : `${o ? [o.id, t].join('.') : t}`;
    },
    getCoreRowModel: () => (
      n._getCoreRowModel || (n._getCoreRowModel = n.options.getCoreRowModel(n)),
      n._getCoreRowModel()
    ),
    getRowModel: () => n.getPaginationRowModel(),
    getRow: (e, t) => {
      let o = (t ? n.getPrePaginationRowModel() : n.getRowModel()).rowsById[e];
      if (!o && ((o = n.getCoreRowModel().rowsById[e]), !o)) throw new Error();
      return o;
    },
    _getDefaultColumnDef: He(
      () => [n.options.defaultColumn],
      (e) => {
        var t;
        return (
          (e = null != (t = e) ? t : {}),
          {
            header: (e) => {
              const t = e.header.column.columnDef;
              return t.accessorKey ? t.accessorKey : t.accessorFn ? t.id : null;
            },
            cell: (e) => {
              var t, n;
              return null !=
                (t = null == (n = e.renderValue()) || null == n.toString ? void 0 : n.toString())
                ? t
                : null;
            },
            ...n._features.reduce(
              (e, t) =>
                Object.assign(e, null == t.getDefaultColumnDef ? void 0 : t.getDefaultColumnDef()),
              {},
            ),
            ...e,
          }
        );
      },
      {
        debug: () => {
          var e;
          return null != (e = n.options.debugAll) ? e : n.options.debugColumns;
        },
        key: !1,
      },
    ),
    _getColumnDefs: () => n.options.columns,
    getAllColumns: He(
      () => [n._getColumnDefs()],
      (e) => {
        const t = function (e, o, i) {
          return (
            void 0 === i && (i = 0),
            e.map((e) => {
              const s = (function (e, t, n, o) {
                  var i, s;
                  const l = { ...e._getDefaultColumnDef(), ...t },
                    r = l.accessorKey;
                  let a,
                    u =
                      null != (i = null != (s = l.id) ? s : r ? r.replace('.', '_') : void 0)
                        ? i
                        : 'string' == typeof l.header
                          ? l.header
                          : void 0;
                  if (
                    (l.accessorFn
                      ? (a = l.accessorFn)
                      : r &&
                        (a = r.includes('.')
                          ? (e) => {
                              let t = e;
                              for (const o of r.split('.')) {
                                var n;
                                t = null == (n = t) ? void 0 : n[o];
                              }
                              return t;
                            }
                          : (e) => e[l.accessorKey]),
                    !u)
                  )
                    throw new Error();
                  let c = {
                    id: `${String(u)}`,
                    accessorFn: a,
                    parent: o,
                    depth: n,
                    columnDef: l,
                    columns: [],
                    getFlatColumns: He(
                      () => [!0],
                      () => {
                        var e;
                        return [
                          c,
                          ...(null == (e = c.columns)
                            ? void 0
                            : e.flatMap((e) => e.getFlatColumns())),
                        ];
                      },
                      {
                        key: 'column.getFlatColumns',
                        debug: () => {
                          var t;
                          return null != (t = e.options.debugAll) ? t : e.options.debugColumns;
                        },
                      },
                    ),
                    getLeafColumns: He(
                      () => [e._getOrderColumnsFn()],
                      (e) => {
                        var t;
                        return null != (t = c.columns) && t.length
                          ? e(c.columns.flatMap((e) => e.getLeafColumns()))
                          : [c];
                      },
                      {
                        key: 'column.getLeafColumns',
                        debug: () => {
                          var t;
                          return null != (t = e.options.debugAll) ? t : e.options.debugColumns;
                        },
                      },
                    ),
                  };
                  for (const d of e._features) null == d.createColumn || d.createColumn(c, e);
                  return c;
                })(n, e, i, o),
                l = e;
              return (s.columns = l.columns ? t(l.columns, s, i + 1) : []), s;
            })
          );
        };
        return t(e);
      },
      {
        key: !1,
        debug: () => {
          var e;
          return null != (e = n.options.debugAll) ? e : n.options.debugColumns;
        },
      },
    ),
    getAllFlatColumns: He(
      () => [n.getAllColumns()],
      (e) => e.flatMap((e) => e.getFlatColumns()),
      {
        key: !1,
        debug: () => {
          var e;
          return null != (e = n.options.debugAll) ? e : n.options.debugColumns;
        },
      },
    ),
    _getAllFlatColumnsById: He(
      () => [n.getAllFlatColumns()],
      (e) => e.reduce((e, t) => ((e[t.id] = t), e), {}),
      {
        key: !1,
        debug: () => {
          var e;
          return null != (e = n.options.debugAll) ? e : n.options.debugColumns;
        },
      },
    ),
    getAllLeafColumns: He(
      () => [n.getAllColumns(), n._getOrderColumnsFn()],
      (e, t) => t(e.flatMap((e) => e.getLeafColumns())),
      {
        key: !1,
        debug: () => {
          var e;
          return null != (e = n.options.debugAll) ? e : n.options.debugColumns;
        },
      },
    ),
    getColumn: (e) => n._getAllFlatColumnsById()[e],
  };
  Object.assign(n, r);
  for (let a = 0; a < n._features.length; a++) {
    const e = n._features[a];
    null == e || null == e.createTable || e.createTable(n);
  }
  return n;
}
const Ct = (e, t, n, o, i, s, l) => {
  let r = {
    id: t,
    index: o,
    original: n,
    depth: i,
    parentId: l,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (t) => {
      if (r._valuesCache.hasOwnProperty(t)) return r._valuesCache[t];
      const n = e.getColumn(t);
      return null != n && n.accessorFn
        ? ((r._valuesCache[t] = n.accessorFn(r.original, o)), r._valuesCache[t])
        : void 0;
    },
    getUniqueValues: (t) => {
      if (r._uniqueValuesCache.hasOwnProperty(t)) return r._uniqueValuesCache[t];
      const n = e.getColumn(t);
      return null != n && n.accessorFn
        ? n.columnDef.getUniqueValues
          ? ((r._uniqueValuesCache[t] = n.columnDef.getUniqueValues(r.original, o)),
            r._uniqueValuesCache[t])
          : ((r._uniqueValuesCache[t] = [r.getValue(t)]), r._uniqueValuesCache[t])
        : void 0;
    },
    renderValue: (t) => {
      var n;
      return null != (n = r.getValue(t)) ? n : e.options.renderFallbackValue;
    },
    subRows: [],
    getLeafRows: () =>
      (function (e, t) {
        const n = [],
          o = (e) => {
            e.forEach((e) => {
              n.push(e);
              const i = t(e);
              null != i && i.length && o(i);
            });
          };
        return o(e), n;
      })(r.subRows, (e) => e.subRows),
    getParentRow: () => (r.parentId ? e.getRow(r.parentId, !0) : void 0),
    getParentRows: () => {
      let e = [],
        t = r;
      for (;;) {
        const n = t.getParentRow();
        if (!n) break;
        e.push(n), (t = n);
      }
      return e.reverse();
    },
    getAllCells: He(
      () => [e.getAllLeafColumns()],
      (t) =>
        t.map((t) =>
          (function (e, t, n, o) {
            const i = {
              id: `${t.id}_${n.id}`,
              row: t,
              column: n,
              getValue: () => t.getValue(o),
              renderValue: () => {
                var t;
                return null != (t = i.getValue()) ? t : e.options.renderFallbackValue;
              },
              getContext: He(
                () => [e, n, t, i],
                (e, t, n, o) => ({
                  table: e,
                  column: t,
                  row: n,
                  cell: o,
                  getValue: o.getValue,
                  renderValue: o.renderValue,
                }),
                { key: !1, debug: () => e.options.debugAll },
              ),
            };
            return (
              e._features.forEach((o) => {
                null == o.createCell || o.createCell(i, n, t, e);
              }, {}),
              i
            );
          })(e, r, t, t.id),
        ),
      {
        key: !1,
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugRows;
        },
      },
    ),
    _getAllCellsByColumnId: He(
      () => [r.getAllCells()],
      (e) => e.reduce((e, t) => ((e[t.column.id] = t), e), {}),
      {
        key: 'row.getAllCellsByColumnId',
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugRows;
        },
      },
    ),
  };
  for (let a = 0; a < e._features.length; a++) {
    const t = e._features[a];
    null == t || null == t.createRow || t.createRow(r, e);
  }
  return r;
};
function wt() {
  return (e) =>
    He(
      () => [e.options.data],
      (t) => {
        const n = { rows: [], flatRows: [], rowsById: {} },
          o = function (t, i, s) {
            void 0 === i && (i = 0);
            const l = [];
            for (let a = 0; a < t.length; a++) {
              const u = Ct(
                e,
                e._getRowId(t[a], a, s),
                t[a],
                a,
                i,
                void 0,
                null == s ? void 0 : s.id,
              );
              var r;
              if ((n.flatRows.push(u), (n.rowsById[u.id] = u), l.push(u), e.options.getSubRows))
                (u.originalSubRows = e.options.getSubRows(t[a], a)),
                  null != (r = u.originalSubRows) &&
                    r.length &&
                    (u.subRows = o(u.originalSubRows, i + 1, u));
            }
            return l;
          };
        return (n.rows = o(t)), n;
      },
      {
        key: !1,
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      },
    );
}
function St(e, t, n) {
  return n.options.filterFromLeafRows
    ? (function (e, t, n) {
        var o;
        const i = [],
          s = {},
          l = null != (o = n.options.maxLeafRowFilterDepth) ? o : 100,
          r = function (e, o) {
            void 0 === o && (o = 0);
            const a = [];
            for (let c = 0; c < e.length; c++) {
              var u;
              let d = e[c];
              const h = Ct(n, d.id, d.original, d.index, d.depth, void 0, d.parentId);
              if (
                ((h.columnFilters = d.columnFilters), null != (u = d.subRows) && u.length && o < l)
              ) {
                if (((h.subRows = r(d.subRows, o + 1)), (d = h), t(d) && !h.subRows.length)) {
                  a.push(d), (s[d.id] = d), i.push(d);
                  continue;
                }
                if (t(d) || h.subRows.length) {
                  a.push(d), (s[d.id] = d), i.push(d);
                  continue;
                }
              } else (d = h), t(d) && (a.push(d), (s[d.id] = d), i.push(d));
            }
            return a;
          };
        return { rows: r(e), flatRows: i, rowsById: s };
      })(e, t, n)
    : (function (e, t, n) {
        var o;
        const i = [],
          s = {},
          l = null != (o = n.options.maxLeafRowFilterDepth) ? o : 100,
          r = function (e, o) {
            void 0 === o && (o = 0);
            const a = [];
            for (let c = 0; c < e.length; c++) {
              let d = e[c];
              if (t(d)) {
                var u;
                if (null != (u = d.subRows) && u.length && o < l) {
                  const e = Ct(n, d.id, d.original, d.index, d.depth, void 0, d.parentId);
                  (e.subRows = r(d.subRows, o + 1)), (d = e);
                }
                a.push(d), i.push(d), (s[d.id] = d);
              }
            }
            return a;
          };
        return { rows: r(e), flatRows: i, rowsById: s };
      })(e, t, n);
}
function Rt() {
  return (e) =>
    He(
      () => [e.getPreFilteredRowModel(), e.getState().columnFilters, e.getState().globalFilter],
      (t, n, o) => {
        if (!t.rows.length || ((null == n || !n.length) && !o)) {
          for (let e = 0; e < t.flatRows.length; e++)
            (t.flatRows[e].columnFilters = {}), (t.flatRows[e].columnFiltersMeta = {});
          return t;
        }
        const i = [],
          s = [];
        (null != n ? n : []).forEach((t) => {
          var n;
          const o = e.getColumn(t.id);
          if (!o) return;
          const s = o.getFilterFn();
          s &&
            i.push({
              id: t.id,
              filterFn: s,
              resolvedValue:
                null != (n = null == s.resolveFilterValue ? void 0 : s.resolveFilterValue(t.value))
                  ? n
                  : t.value,
            });
        });
        const l = n.map((e) => e.id),
          r = e.getGlobalFilterFn(),
          a = e.getAllLeafColumns().filter((e) => e.getCanGlobalFilter());
        let u, c;
        o &&
          r &&
          a.length &&
          (l.push('__global__'),
          a.forEach((e) => {
            var t;
            s.push({
              id: e.id,
              filterFn: r,
              resolvedValue:
                null != (t = null == r.resolveFilterValue ? void 0 : r.resolveFilterValue(o))
                  ? t
                  : o,
            });
          }));
        for (let e = 0; e < t.flatRows.length; e++) {
          const n = t.flatRows[e];
          if (((n.columnFilters = {}), i.length))
            for (let e = 0; e < i.length; e++) {
              u = i[e];
              const t = u.id;
              n.columnFilters[t] = u.filterFn(n, t, u.resolvedValue, (e) => {
                n.columnFiltersMeta[t] = e;
              });
            }
          if (s.length) {
            for (let e = 0; e < s.length; e++) {
              c = s[e];
              const t = c.id;
              if (
                c.filterFn(n, t, c.resolvedValue, (e) => {
                  n.columnFiltersMeta[t] = e;
                })
              ) {
                n.columnFilters.__global__ = !0;
                break;
              }
            }
            !0 !== n.columnFilters.__global__ && (n.columnFilters.__global__ = !1);
          }
        }
        return St(
          t.rows,
          (e) => {
            for (let t = 0; t < l.length; t++) if (!1 === e.columnFilters[l[t]]) return !1;
            return !0;
          },
          e,
        );
      },
      {
        key: !1,
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      },
    );
}
function Ft() {
  return (e) =>
    He(
      () => [e.getState().sorting, e.getPreSortedRowModel()],
      (t, n) => {
        if (!n.rows.length || null == t || !t.length) return n;
        const o = e.getState().sorting,
          i = [],
          s = o.filter((t) => {
            var n;
            return null == (n = e.getColumn(t.id)) ? void 0 : n.getCanSort();
          }),
          l = {};
        s.forEach((t) => {
          const n = e.getColumn(t.id);
          n &&
            (l[t.id] = {
              sortUndefined: n.columnDef.sortUndefined,
              invertSorting: n.columnDef.invertSorting,
              sortingFn: n.getSortingFn(),
            });
        });
        const r = (e) => {
          const t = e.map((e) => ({ ...e }));
          return (
            t.sort((e, t) => {
              for (let o = 0; o < s.length; o += 1) {
                var n;
                const i = s[o],
                  r = l[i.id],
                  a = null != (n = null == i ? void 0 : i.desc) && n;
                let u = 0;
                if (r.sortUndefined) {
                  const n = void 0 === e.getValue(i.id),
                    o = void 0 === t.getValue(i.id);
                  (n || o) && (u = n && o ? 0 : n ? r.sortUndefined : -r.sortUndefined);
                }
                if ((0 === u && (u = r.sortingFn(e, t, i.id)), 0 !== u))
                  return a && (u *= -1), r.invertSorting && (u *= -1), u;
              }
              return e.index - t.index;
            }),
            t.forEach((e) => {
              var t;
              i.push(e), null != (t = e.subRows) && t.length && (e.subRows = r(e.subRows));
            }),
            t
          );
        };
        return { rows: r(n.rows), flatRows: i, rowsById: n.rowsById };
      },
      {
        key: !1,
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      },
    );
}
function Mt(e) {
  return (e) =>
    He(
      () => [
        e.getState().pagination,
        e.getPrePaginationRowModel(),
        e.options.paginateExpandedRows ? void 0 : e.getState().expanded,
      ],
      (t, n) => {
        if (!n.rows.length) return n;
        const { pageSize: o, pageIndex: i } = t;
        let { rows: s, flatRows: l, rowsById: r } = n;
        const a = o * i,
          u = a + o;
        let c;
        (s = s.slice(a, u)),
          (c = e.options.paginateExpandedRows
            ? { rows: s, flatRows: l, rowsById: r }
            : (function (e) {
                const t = [],
                  n = (e) => {
                    var o;
                    t.push(e),
                      null != (o = e.subRows) &&
                        o.length &&
                        e.getIsExpanded() &&
                        e.subRows.forEach(n);
                  };
                return e.rows.forEach(n), { rows: t, flatRows: e.flatRows, rowsById: e.rowsById };
              })({ rows: s, flatRows: l, rowsById: r })),
          (c.flatRows = []);
        const d = (e) => {
          c.flatRows.push(e), e.subRows.length && e.subRows.forEach(d);
        };
        return c.rows.forEach(d), c;
      },
      {
        key: !1,
        debug: () => {
          var t;
          return null != (t = e.options.debugAll) ? t : e.options.debugTable;
        },
      },
    );
}
/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function xt(e, n) {
  return e
    ? (function (e) {
        return (
          'function' == typeof e &&
          (() => {
            const t = Object.getPrototypeOf(e);
            return t.prototype && t.prototype.isReactComponent;
          })()
        );
      })((o = e)) ||
      'function' == typeof o ||
      (function (e) {
        return (
          'object' == typeof e &&
          'symbol' == typeof e.$$typeof &&
          ['react.memo', 'react.forward_ref'].includes(e.$$typeof.description)
        );
      })(o)
      ? t.createElement(e, n)
      : e
    : null;
  var o;
}
function Pt(e) {
  const n = { state: {}, onStateChange: () => {}, renderFallbackValue: null, ...e },
    [o] = t.useState(() => ({ current: yt(n) })),
    [i, s] = t.useState(() => o.current.initialState);
  return (
    o.current.setOptions((t) => ({
      ...t,
      ...e,
      state: { ...i, ...e.state },
      onStateChange: (t) => {
        s(t), null == e.onStateChange || e.onStateChange(t);
      },
    })),
    o.current
  );
}
export {
  j as Q,
  we as R,
  oe as a,
  be as b,
  Ce as c,
  Pt as d,
  Mt as e,
  xt as f,
  wt as g,
  Rt as h,
  Ft as i,
  qe as j,
  T as k,
  ie as l,
  ve as u,
};
