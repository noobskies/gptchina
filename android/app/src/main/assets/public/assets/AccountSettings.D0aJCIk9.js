import {
  j as e,
  r as s,
  d7 as a,
  dO as t,
  bm as l,
  dP as n,
  cN as r,
  bD as o,
  X as i,
  cT as c,
  aX as d,
  aZ as m,
  dQ as x,
  a_ as u,
  dR as h,
  dS as p,
} from './vendor.BwD-2nqP.js';
import {
  b as g,
  d as v,
  e as j,
  c as f,
  f as w,
  a as _,
  g as N,
  G as y,
  D as b,
  U as C,
  h as k,
  C as S,
  i as M,
  j as A,
  k as F,
  l as R,
  A as z,
  m as T,
  n as E,
  o as D,
  p as O,
  r as P,
  t as L,
  v as H,
  I as V,
  w as I,
  F as $,
  x as B,
  O as W,
  y as K,
  z as G,
  T as U,
  S as Q,
  E as X,
  H as Z,
  J,
  K as Y,
  L as q,
  M as ee,
  N as se,
  P as ae,
  Q as te,
  R as le,
  V as ne,
  W as re,
  X as oe,
  Y as ie,
  Z as ce,
  _ as de,
  $ as me,
  s as xe,
  a0 as ue,
} from './index.NNROY4DI.js';
import {
  ah as he,
  O as pe,
  Q as ge,
  U as ve,
  av as je,
  aw as fe,
  Z as we,
} from './radix-ui.DSTsapDl.js';
import {
  a as _e,
  d as Ne,
  e as ye,
  h as be,
  i as Ce,
  g as ke,
  f as Se,
} from './tanstack-vendor.Ch3frAMy.js';
import { X as Me, P as Ae, a as Fe, $ as Re, j as ze } from './headlessui.D8Bp046-.js';
import './markdown_highlight.YFvJ8PVJ.js';
import './markdown_large.DH79QO1b.js';
import './locales.jmfv_Ou6.js';
import './framer-motion.SCV6xeNI.js';
function Te() {
  return e.jsxs('svg', {
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: 'icon-sm',
    children: [
      e.jsx('path', {
        d: 'M9 3H15M9 3V9.2759C9 9.74377 8.83597 10.1968 8.53644 10.5563L4.85085 14.979C4.30108 15.6387 4 16.4703 4 17.3291V17.3291C4 19.3565 5.64353 21 7.67094 21H16.3291C18.3565 21 20 19.3565 20 17.3291V17.3291C20 16.4703 19.6989 15.6387 19.1492 14.979L15.4636 10.5563C15.164 10.1968 15 9.74377 15 9.2759V3M9 3H8M15 3H16',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
      e.jsx('path', {
        d: 'M5 14.774C11.5 12.839 12.15 16.7089 18 14',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }),
    ],
  });
}
function Ee({ className: s }) {
  return e.jsxs('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: f(s),
    children: [
      e.jsx('path', { d: 'M2 10v3' }),
      e.jsx('path', { d: 'M6 6v11' }),
      e.jsx('path', { d: 'M10 3v18' }),
      e.jsx('path', { d: 'M14 8v7' }),
      e.jsx('path', { d: 'M18 5v13' }),
      e.jsx('path', { d: 'M22 10v3' }),
    ],
  });
}
function De({ open: l, onOpenChange: n }) {
  const r = w('(max-width: 767px)'),
    o = _(),
    [i, c] = s.useState(N.GENERAL),
    d = s.useRef({}),
    m = [
      { value: N.GENERAL, icon: e.jsx(y, {}), label: 'com_nav_setting_general' },
      { value: N.CHAT, icon: e.jsx(a, { className: 'icon-sm' }), label: 'com_nav_setting_chat' },
      { value: N.BETA, icon: e.jsx(Te, {}), label: 'com_nav_setting_beta' },
      { value: N.COMMANDS, icon: e.jsx(t, { className: 'icon-sm' }), label: 'com_nav_commands' },
      {
        value: N.SPEECH,
        icon: e.jsx(Ee, { className: 'icon-sm' }),
        label: 'com_nav_setting_speech',
      },
      { value: N.DATA, icon: e.jsx(b, {}), label: 'com_nav_setting_data' },
      { value: N.ACCOUNT, icon: e.jsx(C, {}), label: 'com_nav_setting_account' },
    ];
  return e.jsx(Me, {
    appear: !0,
    show: l,
    children: e.jsxs(Ae, {
      as: 'div',
      className: 'relative z-50',
      onClose: n,
      children: [
        e.jsx(Fe, {
          enter: 'ease-out duration-200',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'ease-in duration-200',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
          children: e.jsx('div', {
            className: 'fixed inset-0 bg-black opacity-50 dark:opacity-80',
            'aria-hidden': 'true',
          }),
        }),
        e.jsx(Fe, {
          enter: 'ease-out duration-200',
          enterFrom: 'opacity-0 scale-95',
          enterTo: 'opacity-100 scale-100',
          leave: 'ease-in duration-100',
          leaveFrom: 'opacity-100 scale-100',
          leaveTo: 'opacity-0 scale-95',
          children: e.jsx('div', {
            className: f('fixed inset-0 flex w-screen items-center justify-center p-4'),
            children: e.jsxs(Re, {
              className: f(
                'min-h-[600px] overflow-hidden rounded-xl rounded-b-lg bg-background pb-6 shadow-2xl backdrop-blur-2xl animate-in sm:rounded-2xl md:min-h-[373px] md:w-[680px]',
              ),
              children: [
                e.jsxs(ze, {
                  className: 'mb-1 flex items-center justify-between p-6 pb-5 text-left',
                  as: 'div',
                  children: [
                    e.jsx('h2', {
                      className: 'text-lg font-medium leading-6 text-text-primary',
                      children: o('com_nav_settings'),
                    }),
                    e.jsxs('button', {
                      type: 'button',
                      className:
                        'rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-xheavy focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-surface-primary dark:focus:ring-offset-surface-primary',
                      onClick: () => n(!1),
                      children: [
                        e.jsxs('svg', {
                          xmlns: 'http://www.w3.org/2000/svg',
                          width: '24',
                          height: '24',
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: 'currentColor',
                          strokeWidth: '2',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round',
                          className: 'h-5 w-5 text-text-primary',
                          children: [
                            e.jsx('line', { x1: '18', x2: '6', y1: '6', y2: '18' }),
                            e.jsx('line', { x1: '6', x2: '18', y1: '6', y2: '18' }),
                          ],
                        }),
                        e.jsx('span', { className: 'sr-only', children: o('com_ui_close') }),
                      ],
                    }),
                  ],
                }),
                e.jsx('div', {
                  className:
                    'max-h-[550px] overflow-auto px-6 md:max-h-[400px] md:min-h-[400px] md:w-[680px]',
                  children: e.jsxs(he, {
                    value: i,
                    onValueChange: (e) => {
                      c(e);
                    },
                    className: 'flex flex-col gap-10 md:flex-row',
                    orientation: 'vertical',
                    children: [
                      e.jsx(pe, {
                        'aria-label': 'Settings',
                        className: f(
                          'min-w-auto max-w-auto relative -ml-[8px] flex flex-shrink-0 flex-col flex-nowrap overflow-auto sm:max-w-none',
                          r ? 'flex-row rounded-xl bg-surface-secondary' : 'sticky top-0 h-full',
                        ),
                        onKeyDown: (e) => {
                          const s = [
                              N.GENERAL,
                              N.CHAT,
                              N.BETA,
                              N.COMMANDS,
                              N.SPEECH,
                              N.DATA,
                              N.ACCOUNT,
                            ],
                            a = s.indexOf(i);
                          switch (e.key) {
                            case 'ArrowDown':
                              e.preventDefault(), c(s[(a + 1) % s.length]);
                              break;
                            case 'ArrowUp':
                              e.preventDefault(), c(s[(a - 1 + s.length) % s.length]);
                              break;
                            case 'Home':
                              e.preventDefault(), c(s[0]);
                              break;
                            case 'End':
                              e.preventDefault(), c(s[s.length - 1]);
                          }
                        },
                        children: m.map(({ value: s, icon: a, label: t }) =>
                          e.jsxs(
                            ge,
                            {
                              className: f(
                                'group relative z-10 m-1 flex items-center justify-start gap-2 rounded-xl px-2 py-1.5 transition-all duration-200 ease-in-out',
                                r
                                  ? 'flex-1 justify-center text-nowrap p-1 px-3 text-sm text-text-secondary radix-state-active:bg-surface-hover radix-state-active:text-text-primary'
                                  : 'bg-transparent text-text-secondary radix-state-active:bg-surface-tertiary radix-state-active:text-text-primary',
                              ),
                              value: s,
                              ref: (e) => (d.current[s] = e),
                              children: [a, o(t)],
                            },
                            s,
                          ),
                        ),
                      }),
                      e.jsxs('div', {
                        className: 'overflow-auto sm:w-full sm:max-w-none md:pr-0.5 md:pt-0.5',
                        children: [
                          e.jsx(ve, { value: N.GENERAL, children: e.jsx(k, {}) }),
                          e.jsx(ve, { value: N.CHAT, children: e.jsx(S, {}) }),
                          e.jsx(ve, { value: N.BETA, children: e.jsx(M, {}) }),
                          e.jsx(ve, { value: N.COMMANDS, children: e.jsx(A, {}) }),
                          e.jsx(ve, { value: N.SPEECH, children: e.jsx(F, {}) }),
                          e.jsx(ve, { value: N.DATA, children: e.jsx(R, {}) }),
                          e.jsx(ve, { value: N.ACCOUNT, children: e.jsx(z, {}) }),
                        ],
                      }),
                    ],
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
function Oe({ column: s, title: a, className: t = '', filters: r, valueMap: o }) {
  const i = _();
  return s.getCanSort()
    ? e.jsx('div', {
        className: f('flex items-center space-x-2', t),
        children: e.jsxs(T, {
          children: [
            e.jsx(E, {
              asChild: !0,
              children: e.jsxs(D, {
                variant: 'ghost',
                className:
                  'px-2 py-0 text-xs hover:bg-surface-hover data-[state=open]:bg-surface-hover sm:px-2 sm:py-2 sm:text-sm',
                children: [
                  e.jsx('span', { children: a }),
                  s.getIsFiltered()
                    ? e.jsx(l, { className: 'icon-sm ml-2 text-muted-foreground/70' })
                    : e.jsx(l, { className: 'icon-sm ml-2 opacity-30' }),
                  (() => {
                    const a = s.getIsSorted();
                    return 'desc' === a
                      ? e.jsx(je, { className: 'icon-sm ml-2' })
                      : 'asc' === a
                        ? e.jsx(fe, { className: 'icon-sm ml-2' })
                        : e.jsx(we, { className: 'icon-sm ml-2' });
                  })(),
                ],
              }),
            }),
            e.jsxs(O, {
              align: 'start',
              className: 'z-[1001] dark:border-gray-700 dark:bg-gray-850',
              children: [
                e.jsxs(P, {
                  onClick: () => s.toggleSorting(!1),
                  className: 'cursor-pointer text-text-primary',
                  children: [
                    e.jsx(fe, { className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70' }),
                    i('com_ui_ascending'),
                  ],
                }),
                e.jsxs(P, {
                  onClick: () => s.toggleSorting(!0),
                  className: 'cursor-pointer text-text-primary',
                  children: [
                    e.jsx(je, { className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70' }),
                    i('com_ui_descending'),
                  ],
                }),
                e.jsx(L, { className: 'dark:bg-gray-500' }),
                r &&
                  Object.entries(r).map(([a, t]) =>
                    t.map((t) => {
                      const n = null == o ? void 0 : o[t ?? ''],
                        r = null != n && n.length ? i(n) : String(t);
                      return r
                        ? e.jsxs(
                            P,
                            {
                              className: 'cursor-pointer text-text-primary',
                              onClick: () => {
                                s.setFilterValue(t);
                              },
                              children: [
                                e.jsx(l, {
                                  className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70',
                                }),
                                r,
                              ],
                            },
                            `${a}-${t}`,
                          )
                        : null;
                    }),
                  ),
                r &&
                  e.jsxs(P, {
                    className: s.getIsFiltered()
                      ? 'cursor-pointer dark:text-white dark:hover:bg-gray-800'
                      : 'pointer-events-none opacity-30',
                    onClick: () => {
                      s.setFilterValue(void 0);
                    },
                    children: [
                      e.jsx(n, { className: 'mr-2 h-3.5 w-3.5 text-muted-foreground/70' }),
                      i('com_ui_show_all'),
                    ],
                  }),
              ],
            }),
          ],
        }),
      })
    : e.jsx('div', { className: f(t), children: a });
}
const Pe = {
    [U.avatar]: 'com_ui_avatar',
    [U.unknown]: 'com_ui_unknown',
    [U.assistants]: 'com_ui_assistants',
    [U.image_generation]: 'com_ui_image_gen',
    [U.assistants_output]: 'com_ui_assistants_output',
    [U.message_attachment]: 'com_ui_attachment',
  },
  Le = [
    {
      id: 'select',
      header: ({ table: s }) =>
        e.jsx(H, {
          checked:
            s.getIsAllPageRowsSelected() || (s.getIsSomePageRowsSelected() && 'indeterminate'),
          onCheckedChange: (e) => s.toggleAllPageRowsSelected(!!e),
          'aria-label': 'Select all',
          className: 'flex',
        }),
      cell: ({ row: s }) =>
        e.jsx(H, {
          checked: s.getIsSelected(),
          onCheckedChange: (e) => s.toggleSelected(!!e),
          'aria-label': 'Select row',
          className: 'flex',
        }),
      enableSorting: !1,
      enableHiding: !1,
    },
    {
      meta: { size: '150px' },
      accessorKey: 'filename',
      header: ({ column: s }) => {
        const a = _();
        return e.jsxs(D, {
          variant: 'ghost',
          className: 'px-2 py-0 text-xs hover:bg-surface-hover sm:px-2 sm:py-2 sm:text-sm',
          onClick: () => s.toggleSorting('asc' === s.getIsSorted()),
          children: [a('com_ui_name'), e.jsx(r, { className: 'ml-2 h-3 w-4 sm:h-4 sm:w-4' })],
        });
      },
      cell: ({ row: s }) => {
        const a = s.original;
        if (a.type.startsWith('image'))
          return e.jsxs('div', {
            className: 'flex gap-2',
            children: [
              e.jsx(V, {
                url: a.filepath,
                className: 'relative h-10 w-10 shrink-0 overflow-hidden rounded-md',
                source: a.source,
              }),
              e.jsx('span', { className: 'self-center truncate ', children: a.filename }),
            ],
          });
        const t = I(a.type);
        return e.jsxs('div', {
          className: 'flex gap-2',
          children: [
            t && e.jsx($, { fileType: t, className: 'relative', file: a }),
            e.jsx('span', { className: 'self-center truncate', children: a.filename }),
          ],
        });
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column: s }) => {
        const a = _();
        return e.jsxs(D, {
          variant: 'ghost',
          onClick: () => s.toggleSorting('asc' === s.getIsSorted()),
          className: 'px-2 py-0 text-xs hover:bg-surface-hover sm:px-2 sm:py-2 sm:text-sm',
          children: [a('com_ui_date'), e.jsx(r, { className: 'ml-2 h-3 w-4 sm:h-4 sm:w-4' })],
        });
      },
      cell: ({ row: e }) => {
        var s;
        const a = w('(max-width: 768px)');
        return B((null == (s = e.original.updatedAt) ? void 0 : s.toString()) ?? '', a);
      },
    },
    {
      accessorKey: 'filterSource',
      header: ({ column: s }) => {
        const a = _();
        return e.jsx(Oe, {
          column: s,
          title: a('com_ui_storage'),
          filters: {
            Storage: Object.values(W).filter(
              (e) => e === W.local || e === W.openai || e === W.azure,
            ),
          },
          valueMap: {
            [W.azure]: 'com_ui_azure',
            [W.openai]: 'com_ui_openai',
            [W.local]: 'com_ui_host',
          },
        });
      },
      cell: ({ row: s }) => {
        const a = _(),
          { source: t } = s.original;
        return t === W.openai
          ? e.jsxs('div', {
              className: 'flex flex-wrap items-center gap-2',
              children: [e.jsx(K, { className: 'icon-sm text-green-600/50' }), 'OpenAI'],
            })
          : t === W.azure
            ? e.jsxs('div', {
                className: 'flex flex-wrap items-center gap-2',
                children: [e.jsx(G, { className: 'icon-sm text-cyan-700' }), 'Azure'],
              })
            : e.jsxs('div', {
                className: 'flex flex-wrap items-center gap-2',
                children: [e.jsx(o, { className: 'icon-sm text-cyan-700' }), a('com_ui_host')],
              });
      },
    },
    {
      accessorKey: 'context',
      header: ({ column: s }) => {
        const a = _();
        return e.jsx(Oe, {
          column: s,
          title: a('com_ui_context'),
          filters: { Context: Object.values(U).filter((e) => e === U[e ?? '']) },
          valueMap: Pe,
        });
      },
      cell: ({ row: s }) => {
        const { context: a } = s.original,
          t = _();
        return e.jsx('div', {
          className: 'flex flex-wrap items-center gap-2',
          children: t(Pe[a ?? U.unknown]),
        });
      },
    },
    {
      accessorKey: 'bytes',
      header: ({ column: s }) => {
        const a = _();
        return e.jsxs(D, {
          variant: 'ghost',
          className: 'px-2 py-0 text-xs hover:bg-surface-hover sm:px-2 sm:py-2 sm:text-sm',
          onClick: () => s.toggleSorting('asc' === s.getIsSorted()),
          children: [a('com_ui_size'), e.jsx(r, { className: 'ml-2 h-3 w-4 sm:h-4 sm:w-4' })],
        });
      },
      cell: ({ row: e }) => {
        const s = Number((Number(e.original.bytes) / 1024 / 1024).toFixed(2));
        return s < 0.01 ? '< 0.01 MB' : `${s} MB`;
      },
    },
  ],
  He = {
    [U.filename]: 'com_ui_name',
    [U.updatedAt]: 'com_ui_date',
    [U.filterSource]: 'com_ui_storage',
    [U.context]: 'com_ui_context',
    [U.bytes]: 'com_ui_size',
  };
function Ve({ columns: a, data: t }) {
  var n;
  const r = _(),
    [o, i] = s.useState(!1),
    [c, d] = s.useState({}),
    [m, x] = s.useState([]),
    u = w('(max-width: 768px)'),
    [h, p] = s.useState([]),
    [N, y] = s.useState({}),
    { deleteFiles: b } = (function (e) {
      const s = _e(),
        a = g({
          onMutate: async (e) => {
            const { files: s } = e;
            return s.length
              ? { filesToDeleteMap: s.reduce((e, s) => (e.set(s.file_id, s), e), new Map()) }
              : new Map();
          },
          onSuccess: (a, t, l) => {
            console.log('Files deleted');
            const { filesToDeleteMap: n } = l;
            s.setQueryData([v.files], (e) => {
              const { files: s } = t;
              return s.length ? (null == e ? void 0 : e.filter((e) => !n.has(e.file_id))) : e;
            }),
              null == e || e();
          },
          onError: (s) => {
            console.log('Error deleting files:', s), null == e || e();
          },
        });
      return j({ mutateAsync: a.mutateAsync });
    })(() => i(!1)),
    C = Ne({
      data: t,
      columns: a,
      onSortingChange: x,
      getCoreRowModel: ke(),
      getSortedRowModel: Ce(),
      onColumnFiltersChange: p,
      getFilteredRowModel: be(),
      onColumnVisibilityChange: y,
      getPaginationRowModel: ye(),
      onRowSelectionChange: d,
      state: { sorting: m, columnFilters: h, columnVisibility: N, rowSelection: c },
    });
  return e.jsxs('div', {
    className: 'flex h-full flex-col gap-4',
    children: [
      e.jsxs('div', {
        className: 'flex flex-wrap items-center gap-2 py-2 sm:gap-4 sm:py-4',
        children: [
          e.jsxs(D, {
            variant: 'outline',
            onClick: () => {
              i(!0);
              const e = C.getFilteredSelectedRowModel().rows.map((e) => e.original);
              b({ files: e }), d({});
            },
            disabled: !C.getFilteredSelectedRowModel().rows.length || o,
            className: f('min-w-[40px] transition-all duration-200', u && 'px-2 py-1'),
            children: [
              o
                ? e.jsx(Q, { className: 'size-3.5 sm:size-4' })
                : e.jsx(X, { className: 'size-3.5 text-red-400 sm:size-4' }),
              !u && e.jsx('span', { className: 'ml-2', children: r('com_ui_delete') }),
            ],
          }),
          e.jsx(Z, {
            placeholder: r('com_files_filter'),
            value: (null == (n = C.getColumn('filename')) ? void 0 : n.getFilterValue()) ?? '',
            onChange: (e) => {
              var s;
              return null == (s = C.getColumn('filename'))
                ? void 0
                : s.setFilterValue(e.target.value);
            },
            className: 'flex-1 text-sm',
          }),
          e.jsxs(T, {
            children: [
              e.jsx(E, {
                asChild: !0,
                children: e.jsx(D, {
                  variant: 'outline',
                  className: f('min-w-[40px]', u && 'px-2 py-1'),
                  children: e.jsx(l, { className: 'size-3.5 sm:size-4' }),
                }),
              }),
              e.jsx(O, {
                align: 'end',
                className: 'max-h-[300px] overflow-y-auto dark:border-gray-700 dark:bg-gray-850',
                children: C.getAllColumns()
                  .filter((e) => e.getCanHide())
                  .map((s) =>
                    e.jsx(
                      J,
                      {
                        className:
                          'cursor-pointer text-sm capitalize dark:text-white dark:hover:bg-gray-800',
                        checked: s.getIsVisible(),
                        onCheckedChange: (e) => s.toggleVisibility(Boolean(e)),
                        children: r(He[s.id]),
                      },
                      s.id,
                    ),
                  ),
              }),
            ],
          }),
        ],
      }),
      e.jsx('div', {
        className:
          'relative grid h-full max-h-[calc(100vh-20rem)] w-full flex-1 overflow-hidden overflow-x-auto overflow-y-auto rounded-md border border-black/10 dark:border-white/10',
        children: e.jsxs(Y, {
          className: 'w-full min-w-[300px] border-separate border-spacing-0',
          children: [
            e.jsx(q, {
              className: 'sticky top-0 z-50',
              children: C.getHeaderGroups().map((s) =>
                e.jsx(
                  ee,
                  {
                    className: 'border-b border-border-light',
                    children: s.headers.map((s, a) => {
                      const t = {};
                      return (
                        0 === a && 'select' === s.id
                          ? ((t.width = '35px'), (t.minWidth = '35px'))
                          : 'filename' === s.id
                            ? (t.width = u ? '60%' : '40%')
                            : (t.width = u ? '20%' : '15%'),
                        e.jsx(
                          se,
                          {
                            className:
                              'whitespace-nowrap bg-surface-secondary px-2 py-2 text-left text-sm font-medium text-text-secondary sm:px-4',
                            style: { ...t },
                            children: s.isPlaceholder
                              ? null
                              : Se(s.column.columnDef.header, s.getContext()),
                          },
                          s.id,
                        )
                      );
                    }),
                  },
                  s.id,
                ),
              ),
            }),
            e.jsx(ae, {
              className: 'w-full',
              children: C.getRowModel().rows.length
                ? C.getRowModel().rows.map((s) =>
                    e.jsx(
                      ee,
                      {
                        'data-state': s.getIsSelected() && 'selected',
                        className:
                          'border-b border-border-light transition-colors hover:bg-surface-secondary [tr:last-child_&]:border-b-0',
                        children: s.getVisibleCells().map((s, a) => {
                          var t;
                          const l =
                              (null == (t = s.column.columnDef.meta) ? void 0 : t.size) ?? 'auto',
                            n = {};
                          return (
                            'filename' === s.column.id
                              ? (n.maxWidth = l)
                              : 0 === a && (n.maxWidth = '20px'),
                            e.jsx(
                              te,
                              {
                                className:
                                  'align-start overflow-x-auto px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm [tr[data-disabled=true]_&]:opacity-50',
                                style: n,
                                children: Se(s.column.columnDef.cell, s.getContext()),
                              },
                              s.id,
                            )
                          );
                        }),
                      },
                      s.id,
                    ),
                  )
                : e.jsx(ee, {
                    children: e.jsx(te, {
                      colSpan: a.length,
                      className: 'h-24 text-center',
                      children: r('com_files_no_results'),
                    }),
                  }),
            }),
          ],
        }),
      }),
      e.jsxs('div', {
        className: 'flex items-center justify-end gap-2 py-4',
        children: [
          e.jsxs('div', {
            className: 'ml-2 flex-1 truncate text-xs text-muted-foreground sm:ml-4 sm:text-sm',
            children: [
              e.jsx('span', {
                className: 'hidden sm:inline',
                children: r('com_files_number_selected', {
                  0: `${C.getFilteredSelectedRowModel().rows.length}`,
                  1: `${C.getFilteredRowModel().rows.length}`,
                }),
              }),
              e.jsx('span', {
                className: 'sm:hidden',
                children: `${C.getFilteredSelectedRowModel().rows.length}/${C.getFilteredRowModel().rows.length}`,
              }),
            ],
          }),
          e.jsxs('div', {
            className:
              'flex items-center space-x-1 pr-2 text-xs font-bold text-text-primary sm:text-sm',
            children: [
              e.jsx('span', { className: 'hidden sm:inline', children: r('com_ui_page') }),
              e.jsx('span', { children: C.getState().pagination.pageIndex + 1 }),
              e.jsx('span', { children: '/' }),
              e.jsx('span', { children: C.getPageCount() }),
            ],
          }),
          e.jsx(D, {
            className: 'select-none',
            variant: 'outline',
            size: 'sm',
            onClick: () => C.previousPage(),
            disabled: !C.getCanPreviousPage(),
            children: r('com_ui_prev'),
          }),
          e.jsx(D, {
            className: 'select-none',
            variant: 'outline',
            size: 'sm',
            onClick: () => C.nextPage(),
            disabled: !C.getCanNextPage(),
            children: r('com_ui_next'),
          }),
        ],
      }),
    ],
  });
}
function Ie({ open: s, onOpenChange: a }) {
  const t = _(),
    { data: l = [] } = le({
      select: (e) =>
        e.map(
          (e) => (
            (e.context = e.context ?? U.unknown),
            (e.filterSource = e.source === W.firebase ? W.local : e.source),
            e
          ),
        ),
    });
  return e.jsx(ne, {
    open: s,
    onOpenChange: a,
    children: e.jsxs(re, {
      title: t('com_nav_my_files'),
      className: 'w-11/12 bg-background text-text-primary shadow-2xl',
      children: [
        e.jsx(oe, { children: e.jsx(ie, { children: t('com_nav_my_files') }) }),
        e.jsx(Ve, { columns: Le, data: l }),
      ],
    }),
  });
}
W.openai, W.local, W.local, W.local;
const $e = s.memo(function () {
  var a, t;
  const l = _(),
    { user: n, isAuthenticated: r, logout: o } = ce(),
    { data: g } = de(),
    v = me({ enabled: !!r && (null == (a = null == g ? void 0 : g.balance) ? void 0 : a.enabled) }),
    [j, f] = s.useState(!1),
    [w, N] = i(xe.showFiles),
    b = ue(n),
    k =
      (null == n ? void 0 : n.avatar) ||
      (null == n ? void 0 : n.name) ||
      (null == n ? void 0 : n.username) ||
      '';
  return e.jsxs(c, {
    children: [
      e.jsxs(d, {
        'aria-label': l('com_nav_account_settings'),
        'data-testid': 'nav-user',
        className:
          'mt-text-sm flex h-auto w-full items-center gap-2 rounded-xl p-2 text-sm transition-all duration-200 ease-in-out hover:bg-surface-hover',
        children: [
          e.jsx('div', {
            className: '-ml-0.9 -mt-0.8 h-8 w-8 flex-shrink-0',
            children: e.jsx('div', {
              className: 'relative flex',
              children:
                0 === k.length
                  ? e.jsx('div', {
                      style: {
                        backgroundColor: 'rgb(121, 137, 255)',
                        width: '32px',
                        height: '32px',
                        boxShadow: 'rgba(240, 246, 252, 0.1) 0px 0px 0px 1px',
                      },
                      className:
                        'relative flex items-center justify-center rounded-full p-1 text-text-primary',
                      'aria-hidden': 'true',
                      children: e.jsx(C, {}),
                    })
                  : e.jsx('img', {
                      className: 'rounded-full',
                      src: ((null == n ? void 0 : n.avatar) ?? '') || b,
                      alt: `${(null == n ? void 0 : n.name) || (null == n ? void 0 : n.username) || (null == n ? void 0 : n.email) || ''}'s avatar`,
                    }),
            }),
          }),
          e.jsx('div', {
            className:
              'mt-2 grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-text-primary',
            style: { marginTop: '0', marginLeft: '0' },
            children:
              (null == n ? void 0 : n.name) ??
              (null == n ? void 0 : n.username) ??
              l('com_nav_user'),
          }),
        ],
      }),
      e.jsxs(m, {
        className: 'popover-ui w-[235px]',
        style: { transformOrigin: 'bottom', marginRight: '0px', translate: '0px' },
        children: [
          e.jsx('div', {
            className: 'text-token-text-secondary ml-3 mr-2 py-2 text-sm',
            role: 'note',
            children: (null == n ? void 0 : n.email) ?? l('com_nav_user'),
          }),
          e.jsx(L, {}),
          !0 === (null == (t = null == g ? void 0 : g.balance) ? void 0 : t.enabled) &&
            null != v.data &&
            !isNaN(parseFloat(v.data)) &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsxs('div', {
                  className: 'text-token-text-secondary ml-3 mr-2 py-2 text-sm',
                  role: 'note',
                  children: [
                    l('com_nav_balance'),
                    ':',
                    ' ',
                    e.jsx('span', {
                      title: x(parseFloat(v.data)).format('0,0.00'),
                      children: x(parseFloat(v.data)).format('0.0a'),
                    }),
                  ],
                }),
                e.jsx(L, {}),
              ],
            }),
          e.jsxs(u, {
            value: '',
            onClick: () => N(!0),
            className: 'select-item text-sm',
            children: [
              e.jsx(h, { className: 'icon-md', 'aria-hidden': 'true' }),
              l('com_nav_my_files'),
            ],
          }),
          e.jsxs(u, {
            value: '',
            onClick: () => f(!0),
            className: 'select-item text-sm',
            children: [
              e.jsx(y, { className: 'icon-md', 'aria-hidden': 'true' }),
              l('com_nav_settings'),
            ],
          }),
          e.jsx(L, {}),
          e.jsxs(u, {
            'aria-selected': !0,
            onClick: () => o(),
            value: 'logout',
            className: 'select-item text-sm',
            children: [e.jsx(p, { className: 'icon-md' }), l('com_nav_log_out')],
          }),
        ],
      }),
      w && e.jsx(Ie, { open: w, onOpenChange: N }),
      j && e.jsx(De, { open: j, onOpenChange: f }),
    ],
  });
});
export { $e as default };
