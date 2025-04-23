import { r as a, dQ as t, j as s } from './vendor.BwD-2nqP.js';
import { a as e, Z as r, _ as o, $ as i } from './index.NNROY4DI.js';
import './markdown_highlight.YFvJ8PVJ.js';
import './markdown_large.DH79QO1b.js';
import './locales.jmfv_Ou6.js';
import './radix-ui.DSTsapDl.js';
import './tanstack-vendor.Ch3frAMy.js';
import './framer-motion.SCV6xeNI.js';
import './headlessui.D8Bp046-.js';
const n = a.memo(() => {
  const a = e(),
    { isAuthenticated: n } = r(),
    { data: l } = o(),
    m = i({ enabled: !!n && (null == l ? void 0 : l.checkBalance) });
  if (!(null == l ? void 0 : l.checkBalance) || null == m.data || isNaN(parseFloat(m.data)))
    return null;
  const d = parseFloat(m.data),
    c = t(d).format('0.0a'),
    p = t(d).format('0,0.00');
  return s.jsxs('div', {
    className: 'mb-2 text-left text-sm text-text-secondary',
    children: [a('com_nav_balance'), ': ', s.jsx('span', { title: p, children: c })],
  });
});
export { n as default };
