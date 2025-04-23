const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/index.NNROY4DI.js',
      'assets/vendor.BwD-2nqP.js',
      'assets/markdown_highlight.YFvJ8PVJ.js',
      'assets/markdown_large.DH79QO1b.js',
      'assets/locales.jmfv_Ou6.js',
      'assets/radix-ui.DSTsapDl.js',
      'assets/tanstack-vendor.Ch3frAMy.js',
      'assets/framer-motion.SCV6xeNI.js',
      'assets/headlessui.D8Bp046-.js',
      'assets/index.DV8eI4CG.css',
    ]),
) => i.map((i) => d[i]);
import {
  r as e,
  j as s,
  aE as a,
  aC as t,
  dn as r,
  dp as i,
  dg as n,
  bj as o,
  X as l,
  dT as c,
} from './vendor.BwD-2nqP.js';
import {
  Z as d,
  $ as m,
  a as u,
  a1 as x,
  o as p,
  c as h,
  d as b,
  a2 as f,
  s as j,
} from './index.NNROY4DI.js';
import { a as y } from './tanstack-vendor.Ch3frAMy.js';
import { X as g, P as v, a as k, $ as N, j as _ } from './headlessui.D8Bp046-.js';
import './markdown_highlight.YFvJ8PVJ.js';
import './markdown_large.DH79QO1b.js';
import './locales.jmfv_Ou6.js';
import './radix-ui.DSTsapDl.js';
import './framer-motion.SCV6xeNI.js';
const w = [
    {
      id: '100k',
      tokens: '100k',
      price: 1.5,
      originalPrice: null,
      discount: null,
      priceDisplay: '$1.50',
    },
    {
      id: '500k',
      tokens: '500k',
      price: 5,
      originalPrice: 7.5,
      discount: '30% off',
      priceDisplay: '$5.00',
      originalPriceDisplay: '$7.50',
    },
    {
      id: '1m',
      tokens: '1 Million',
      price: 7.5,
      originalPrice: 15,
      discount: '50% off',
      priceDisplay: '$7.50',
      originalPriceDisplay: '$15.00',
    },
    {
      id: '10m',
      tokens: '10 Million',
      price: 40,
      originalPrice: 150,
      discount: '75% off',
      priceDisplay: '$40.00',
      originalPriceDisplay: '$150.00',
    },
  ],
  P = ({ open: l, onOpenChange: c, reason: f, details: j }) => {
    var P, F;
    const [D, T] = e.useState('10m'),
      [C, S] = e.useState(!1),
      [$, E] = e.useState(''),
      [O, q] = e.useState(!1),
      [L, z] = e.useState(null),
      { user: I } = d(),
      { refetch: Q } = m(),
      R = y(),
      A = u();
    e.useEffect(() => {
      l && (null == I ? void 0 : I.id) && M();
    }, [l, null == I ? void 0 : I.id]);
    const M = async () => {
        try {
          const e = await x.getOfferings();
          z(e);
        } catch (e) {
          console.error('Failed to load offerings', e), E('Failed to load available purchases');
        }
      },
      V = () => {
        c(!1),
          setTimeout(() => {
            q(!1), E('');
          }, 300);
      };
    if (O) {
      const e = w.find((e) => e.id === D);
      return s.jsx(g, {
        appear: !0,
        show: l,
        children: s.jsxs(v, {
          as: 'div',
          className: 'relative z-50',
          onClose: V,
          children: [
            s.jsx(k, {
              enter: 'ease-out duration-200',
              enterFrom: 'opacity-0',
              enterTo: 'opacity-100',
              leave: 'ease-in duration-200',
              leaveFrom: 'opacity-100',
              leaveTo: 'opacity-0',
              children: s.jsx('div', {
                className: 'fixed inset-0 bg-black opacity-50 dark:opacity-80',
                'aria-hidden': 'true',
              }),
            }),
            s.jsx(k, {
              enter: 'ease-out duration-200',
              enterFrom: 'opacity-0 scale-95',
              enterTo: 'opacity-100 scale-100',
              leave: 'ease-in duration-100',
              leaveFrom: 'opacity-100 scale-100',
              leaveTo: 'opacity-0 scale-95',
              children: s.jsx('div', {
                className: 'fixed inset-0 flex w-screen items-center justify-center p-2 sm:p-4',
                children: s.jsxs(N, {
                  className:
                    'max-h-[90vh] w-full overflow-auto rounded-xl bg-background shadow-2xl backdrop-blur-2xl animate-in sm:max-w-lg sm:rounded-2xl md:max-h-fit md:max-w-xl',
                  children: [
                    s.jsxs(_, {
                      className: 'mb-1 flex items-center justify-between p-4 pb-0 text-left sm:p-6',
                      as: 'div',
                      children: [
                        s.jsx('div', {
                          children: s.jsx('h2', {
                            className: 'text-lg font-medium leading-6 text-text-primary',
                            children: A('com_checkout_receipt'),
                          }),
                        }),
                        s.jsxs('button', {
                          type: 'button',
                          className:
                            'rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none',
                          onClick: V,
                          children: [
                            s.jsx(a, { className: 'h-5 w-5 text-text-primary' }),
                            s.jsx('span', { className: 'sr-only', children: A('com_ui_close') }),
                          ],
                        }),
                      ],
                    }),
                    s.jsx('div', {
                      className: 'p-4 sm:p-6',
                      children: s.jsx('div', {
                        className: 'rounded-lg border border-border-light bg-surface-tertiary p-4',
                        children: s.jsxs('div', {
                          className: 'space-y-2 text-sm',
                          children: [
                            s.jsxs('div', {
                              className: 'flex justify-between',
                              children: [
                                s.jsxs('span', {
                                  className: 'text-text-secondary',
                                  children: [A('com_checkout_tokens'), ':'],
                                }),
                                s.jsx('span', {
                                  className: 'font-medium text-text-primary',
                                  children: null == e ? void 0 : e.tokens,
                                }),
                              ],
                            }),
                            s.jsxs('div', {
                              className: 'flex justify-between',
                              children: [
                                s.jsxs('span', {
                                  className: 'text-text-secondary',
                                  children: [A('com_checkout_date'), ':'],
                                }),
                                s.jsx('span', {
                                  className: 'font-medium text-text-primary',
                                  children: new Date().toLocaleDateString(),
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    }),
                    s.jsx('div', {
                      className:
                        'flex justify-end gap-2 border-t border-border-light px-4 py-3 sm:px-6 sm:py-4',
                      children: s.jsx(p, {
                        variant: 'submit',
                        onClick: V,
                        className: 'bg-blue-600 px-4 hover:bg-blue-700',
                        children: A('com_ui_close'),
                      }),
                    }),
                  ],
                }),
              }),
            }),
          ],
        }),
      });
    }
    return s.jsx(g, {
      appear: !0,
      show: l,
      children: s.jsxs(v, {
        as: 'div',
        className: 'relative z-50',
        onClose: V,
        children: [
          s.jsx(k, {
            enter: 'ease-out duration-200',
            enterFrom: 'opacity-0',
            enterTo: 'opacity-100',
            leave: 'ease-in duration-200',
            leaveFrom: 'opacity-100',
            leaveTo: 'opacity-0',
            children: s.jsx('div', {
              className: 'fixed inset-0 bg-black opacity-50 dark:opacity-80',
              'aria-hidden': 'true',
            }),
          }),
          s.jsx(k, {
            enter: 'ease-out duration-200',
            enterFrom: 'opacity-0 scale-95',
            enterTo: 'opacity-100 scale-100',
            leave: 'ease-in duration-100',
            leaveFrom: 'opacity-100 scale-100',
            leaveTo: 'opacity-0 scale-95',
            children: s.jsx('div', {
              className: 'fixed inset-0 flex w-screen items-center justify-center p-2 sm:p-4',
              children: s.jsxs(N, {
                className:
                  'max-h-[90vh] w-full overflow-auto rounded-xl bg-background shadow-2xl backdrop-blur-2xl animate-in sm:max-w-lg sm:rounded-2xl md:max-h-fit md:max-w-xl',
                children: [
                  s.jsxs(_, {
                    className: 'mb-1 flex items-center justify-between p-4 pb-0 text-left sm:p-6',
                    as: 'div',
                    children: [
                      s.jsxs('div', {
                        children: [
                          s.jsx('h2', {
                            className: 'text-lg font-medium leading-6 text-text-primary',
                            children: A('com_checkout_buy_tokens'),
                          }),
                          s.jsx('p', {
                            className: 'mt-1 text-sm text-text-secondary',
                            children: A('com_checkout_select_package'),
                          }),
                        ],
                      }),
                      s.jsxs('button', {
                        type: 'button',
                        className:
                          'rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none',
                        onClick: V,
                        children: [
                          s.jsx(a, { className: 'h-5 w-5 text-text-primary' }),
                          s.jsx('span', { className: 'sr-only', children: A('com_ui_close') }),
                        ],
                      }),
                    ],
                  }),
                  'insufficient_funds' === f &&
                    j &&
                    s.jsxs('div', {
                      className:
                        'mx-4 mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30',
                      children: [
                        s.jsx('h3', {
                          className: 'font-medium text-amber-800 dark:text-amber-400',
                          children: A('com_ui_insufficient_funds'),
                        }),
                        s.jsx('p', {
                          className: 'mt-1 text-sm text-amber-700 dark:text-amber-300',
                          children: A('com_checkout_insufficient_funds_message', {
                            balance: (null == (P = j.balance) ? void 0 : P.toLocaleString()) || '0',
                            cost: (null == (F = j.cost) ? void 0 : F.toLocaleString()) || '0',
                          }),
                        }),
                      ],
                    }),
                  s.jsxs('div', {
                    className: 'p-4 sm:p-6',
                    children: [
                      s.jsx('div', {
                        className: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
                        children: w.map((e) =>
                          s.jsxs(
                            'div',
                            {
                              className: h(
                                'relative cursor-pointer rounded-lg border p-4 transition-all',
                                D === e.id
                                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                                  : 'border-gray-200 hover:border-blue-300 dark:border-gray-700',
                              ),
                              onClick: () => T(e.id),
                              children: [
                                D === e.id &&
                                  s.jsx('div', {
                                    className:
                                      'absolute right-2 top-2 text-blue-600 dark:text-blue-400',
                                    children: s.jsx(t, { size: 16 }),
                                  }),
                                s.jsx('div', {
                                  className: 'text-lg font-bold text-text-primary',
                                  children: e.tokens,
                                }),
                                s.jsx('div', {
                                  className: 'text-sm text-text-secondary',
                                  children: A('com_checkout_tokens'),
                                }),
                                s.jsx('div', {
                                  className: 'mt-2 text-lg font-bold text-text-primary',
                                  children: e.priceDisplay,
                                }),
                                e.originalPrice &&
                                  s.jsxs('div', {
                                    className: 'flex items-center gap-2',
                                    children: [
                                      s.jsx('span', {
                                        className: 'text-sm text-text-tertiary line-through',
                                        children: e.originalPriceDisplay,
                                      }),
                                      s.jsx('span', {
                                        className:
                                          'rounded bg-blue-800 px-1.5 py-0.5 text-xs text-white',
                                        children: e.discount,
                                      }),
                                    ],
                                  }),
                              ],
                            },
                            e.id,
                          ),
                        ),
                      }),
                      $ &&
                        s.jsx('div', {
                          className:
                            'mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400',
                          children: $,
                        }),
                    ],
                  }),
                  s.jsxs('div', {
                    className:
                      'flex justify-between border-t border-border-light px-4 py-3 sm:px-6 sm:py-4',
                    children: [
                      s.jsx(p, {
                        variant: 'outline',
                        onClick: async () => {
                          S(!0), E('');
                          try {
                            await x.restorePurchases();
                            const { request: e } = await n(
                              async () => {
                                const { request: e } = await import('./index.NNROY4DI.js').then(
                                  (e) => e.a4,
                                );
                                return { request: e };
                              },
                              __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
                            );
                            await e.post('/api/revenuecat/restore-purchases'),
                              Q(),
                              R.invalidateQueries([b.balance]);
                          } catch (e) {
                            console.error('Restore failed', e), E('Failed to restore purchases');
                          } finally {
                            S(!1);
                          }
                        },
                        disabled: C,
                        children: A('com_ui_restore'),
                      }),
                      s.jsx(p, {
                        variant: 'submit',
                        onClick: async () => {
                          S(!0), E('');
                          try {
                            await x.purchasePackage(D);
                            const { request: e } = await n(
                              async () => {
                                const { request: e } = await import('./index.NNROY4DI.js').then(
                                  (e) => e.a4,
                                );
                                return { request: e };
                              },
                              __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
                            );
                            await e.post('/api/revenuecat/verify-purchase', {
                              packageId: `tokens_${D}`,
                              platform: o.getPlatform(),
                            }),
                              q(!0),
                              Q(),
                              R.invalidateQueries([b.balance]),
                              setTimeout(() => {
                                Q(), R.invalidateQueries([b.balance]);
                              }, 2e3);
                          } catch (e) {
                            console.error('Purchase failed', e),
                              E(
                                e instanceof Error
                                  ? e.message
                                  : 'Purchase failed. Please try again.',
                              );
                          } finally {
                            S(!1);
                          }
                        },
                        className: 'bg-blue-600 px-4 hover:bg-blue-700',
                        disabled: C,
                        children: C
                          ? s.jsxs(s.Fragment, {
                              children: [
                                s.jsx(r, { className: 'mr-2 h-4 w-4 animate-spin' }),
                                A('com_ui_processing'),
                              ],
                            })
                          : s.jsxs(s.Fragment, {
                              children: [
                                s.jsx(i, { className: 'mr-2 h-4 w-4' }),
                                A('com_checkout_purchase'),
                              ],
                            }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
        ],
      }),
    });
  },
  F = (a) => {
    const [t, r] = e.useState(!1);
    return (
      e.useEffect(() => {
        (async () => {
          try {
            const e = o.getPlatform();
            r('ios' === e || 'android' === e);
          } catch (e) {
            console.error('Failed to check platform', e), r(!1);
          }
        })();
      }, []),
      t ? s.jsx(P, { ...a }) : s.jsx(f, { ...a })
    );
  },
  D = () => {
    const [e, a] = l(j.checkoutState),
      t = u();
    return s.jsxs(s.Fragment, {
      children: [
        s.jsxs(p, {
          variant: 'submit',
          className: 'mb-2 flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700',
          onClick: () => {
            a({ isOpen: !0, reason: 'manual', details: null });
          },
          children: [s.jsx(c, { className: 'mr-2 h-4 w-4' }), t('com_ui_buy_tokens')],
        }),
        s.jsx(F, {
          open: e.isOpen,
          onOpenChange: (e) => {
            a({ isOpen: e, reason: null, details: null });
          },
          reason: e.reason,
          details: e.details,
        }),
      ],
    });
  };
export { D as default };
