import { r as e, j as s, Z as a } from './vendor.BwD-2nqP.js';
import { aq as t, ar as r, au as o } from './radix-ui.DSTsapDl.js';
import {
  q as i,
  d as l,
  S as n,
  u as c,
  a as d,
  s as m,
  c as u,
  B as x,
} from './index.NNROY4DI.js';
import { u as h } from './tanstack-vendor.Ch3frAMy.js';
import { T as f, Z as g, c as j, f as v } from './headlessui.D8Bp046-.js';
import './markdown_highlight.YFvJ8PVJ.js';
import './markdown_large.DH79QO1b.js';
import './locales.jmfv_Ou6.js';
import './framer-motion.SCV6xeNI.js';
const p = ({ tag: a, selected: o, handleSubmit: i, icon: l, ...c }) => {
    const [d, m] = e.useState(!1);
    return s.jsx(f, {
      'aria-label': a,
      className:
        'group flex w-full gap-2 rounded-lg p-2.5 text-sm text-text-primary transition-colors duration-200 focus:outline-none data-[focus]:bg-surface-hover data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary',
      ...c,
      as: 'button',
      onClick: async () => {
        'New Bookmark' !== a ? (m(!0), i(a), m(!1)) : i();
      },
      children: s.jsx('div', {
        className: 'flex grow items-center justify-between gap-2',
        children: s.jsxs('div', {
          className: 'flex items-center gap-2',
          children: [
            null != l
              ? l
              : d
                ? s.jsx(n, { className: 'size-4' })
                : o
                  ? s.jsx(t, { className: 'size-4' })
                  : s.jsx(r, { className: 'size-4' }),
            s.jsx('div', {
              style: { wordBreak: 'break-word', overflowWrap: 'anywhere' },
              children: a,
            }),
          ],
        }),
      }),
    });
  },
  k = ({ tags: e, handleSubmit: a, header: t }) => {
    const { bookmarks: r } = c();
    return s.jsxs(s.Fragment, {
      children: [
        t,
        r.length > 0 && s.jsx('div', { className: 'my-1.5 h-px', role: 'none' }),
        r.map((t, r) =>
          s.jsx(
            p,
            { tag: t.tag, selected: e.includes(t.tag), handleSubmit: a },
            `${t._id ?? t.tag}-${r}`,
          ),
        ),
      ],
    });
  },
  b = ({ conversation: a, tags: t = [], setTags: r }) => {
    const [i, l] = e.useState(),
      { bookmarks: n } = c(),
      m = d();
    e.useEffect(() => {
      i || l(a);
    }, [a, i]);
    const u = () => {
      r([]);
    };
    return 0 === n.length
      ? s.jsxs('div', {
          className: 'flex flex-col',
          children: [
            s.jsx(p, {
              tag: m('com_ui_clear_all'),
              'data-testid': 'bookmark-item-clear',
              handleSubmit: u,
              selected: !1,
              icon: s.jsx(o, { className: 'size-4' }),
            }),
            s.jsx(p, {
              tag: m('com_ui_no_bookmarks'),
              'data-testid': 'bookmark-item-no-bookmarks',
              handleSubmit: () => Promise.resolve(),
              selected: !1,
              icon: '🤔',
            }),
          ],
        })
      : s.jsx('div', {
          className: 'flex flex-col',
          children: s.jsx(k, {
            tags: t,
            handleSubmit: (e) => {
              if (void 0 === e) return;
              const s = ((e) => (t.some((s) => s === e) ? t.filter((s) => s !== e) : [...t, e]))(e);
              r(s);
            },
            header: s.jsx(p, {
              tag: m('com_ui_clear_all'),
              'data-testid': 'bookmark-item-clear',
              handleSubmit: u,
              selected: !1,
              icon: s.jsx(o, { className: 'size-4' }),
            }),
          }),
        });
  },
  w = ({ tags: e, setTags: o, isSmallScreen: n }) => {
    const c = d(),
      { data: f } = h([l.conversationTags], () => i.getConversationTags(), {
        refetchOnWindowFocus: !1,
        refetchOnReconnect: !1,
        refetchOnMount: !1,
        ...p,
      });
    var p;
    const k = a(m.conversationByIndex(0));
    return s.jsx(g, {
      as: 'div',
      className: 'group relative',
      children: ({ open: a }) =>
        s.jsxs(s.Fragment, {
          children: [
            s.jsxs(j, {
              className: u(
                'mt-text-sm flex h-10 w-full items-center gap-2 rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-surface-active-alt',
                a ? 'bg-surface-active-alt' : '',
                n ? 'h-12' : '',
              ),
              'data-testid': 'bookmark-menu',
              children: [
                s.jsx('div', {
                  className: 'h-7 w-7 flex-shrink-0',
                  children: s.jsx('div', {
                    className: 'relative flex h-full items-center justify-center text-text-primary',
                    children:
                      e.length > 0
                        ? s.jsx(t, { className: 'h-4 w-4', 'aria-hidden': 'true' })
                        : s.jsx(r, { className: 'h-4 w-4', 'aria-hidden': 'true' }),
                  }),
                }),
                s.jsx('div', {
                  className:
                    'grow overflow-hidden whitespace-nowrap text-left text-sm font-medium text-text-primary',
                  children: e.length > 0 ? e.join(', ') : c('com_ui_bookmarks'),
                }),
              ],
            }),
            s.jsx(v, {
              className:
                'absolute left-0 top-full z-[100] mt-1 w-full translate-y-0 overflow-hidden rounded-lg bg-surface-secondary p-1.5 shadow-lg outline-none',
              children:
                f &&
                k &&
                s.jsx(x.Provider, {
                  value: { bookmarks: f.filter((e) => e.count > 0) },
                  children: s.jsx(b, { conversation: k, tags: e, setTags: o }),
                }),
            }),
          ],
        }),
    });
  };
export { w as default };
