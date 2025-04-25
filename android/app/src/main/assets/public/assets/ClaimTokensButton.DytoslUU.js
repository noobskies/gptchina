import { r as e, j as t, dU as a } from './vendor.BwD-2nqP.js';
import { d as s, a3 as i, a as r, $ as n, o } from './index.NNROY4DI.js';
import { u as l, b as m, a as c } from './tanstack-vendor.Ch3frAMy.js';
import './markdown_highlight.YFvJ8PVJ.js';
import './markdown_large.DH79QO1b.js';
import './locales.jmfv_Ou6.js';
import './radix-ui.DSTsapDl.js';
import './framer-motion.SCV6xeNI.js';
import './headlessui.D8Bp046-.js';
const u = ({ amount: a, onComplete: s }) => (
    e.useEffect(() => {
      const e = setTimeout(() => {
        s();
      }, 2e3);
      return () => clearTimeout(e);
    }, [s]),
    t.jsxs('div', { className: 'token-gain-animation', children: ['+', a] })
  ),
  f = () => {
    const [f, d] = e.useState(null),
      [h, j] = e.useState(!0),
      [p, v] = e.useState(null),
      [g, x] = e.useState(!1),
      [_, b] = e.useState(0),
      k = e.useRef(null),
      C = r(),
      {
        data: T,
        refetch: w,
        isError: E,
        isLoading: S,
      } = (($ = { onError: () => j(!0), staleTime: 6e4 }),
      l({
        queryKey: [s.claimStatus],
        queryFn: () => i.get('/api/tokens/claim'),
        onError: () => (
          console.error('Error fetching claim status, defaulting to claimable'), { canClaim: !0 }
        ),
        retry: 1,
        refetchOnWindowFocus: !1,
        refetchOnMount: !0,
        staleTime: 3e4,
        ...($ || {}),
      }));
    var $;
    const y = c(),
      { refetch: N } = n(),
      { mutate: M, isLoading: D } = ((e) => m(() => i.post('/api/tokens/claim'), { ...(e || {}) }))(
        {
          onSuccess: (e) => {
            b(2e4),
              x(!0),
              j(!1),
              v(new Date(e.nextClaimTime)),
              w(),
              N(),
              y.invalidateQueries([s.balance]);
          },
        },
      );
    e.useEffect(() => {
      T
        ? (j(T.canClaim), !T.canClaim && T.nextClaimTime && v(new Date(T.nextClaimTime)))
        : E && (j(!0), v(null));
    }, [T, E]),
      e.useEffect(() => {
        if (!p || h) return void d(null);
        const e = () => {
          const e = new Date(),
            t = p.getTime() - e.getTime();
          if (t <= 0) return j(!0), void d(null);
          const a = Math.floor(t / 36e5),
            s = Math.floor((t % 36e5) / 6e4),
            i = Math.floor((t % 6e4) / 1e3);
          d(`${a}h ${s}m ${i}s`);
        };
        e();
        const t = setInterval(e, 1e3);
        return () => clearInterval(t);
      }, [p, h]);
    return t.jsxs('div', {
      className: 'relative',
      children: [
        g &&
          t.jsx(u, {
            amount: _,
            onComplete: () => {
              x(!1);
            },
          }),
        t.jsxs(o, {
          ref: k,
          variant: h ? 'submit' : 'outline',
          className: `mb-2 flex w-full items-center justify-center ${h ? 'bg-blue-600 hover:bg-blue-700' : ''} relative`,
          onClick: () => {
            M();
          },
          disabled: (!h && !E) || D || S,
          children: [
            h && t.jsx('div', { className: 'pulsating-circle' }),
            t.jsx(a, { className: 'mr-2 h-4 w-4' }),
            h
              ? C('com_ui_claim_tokens')
              : f
                ? `${C('com_ui_claim_in')} ${f}`
                : C('com_ui_claim_tokens'),
          ],
        }),
      ],
    });
  };
export { f as default };
