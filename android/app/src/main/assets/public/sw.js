if (!self.define) {
  let s,
    n = {};
  const e = (e, l) => (
    (e = new URL(e + '.js', l).href),
    n[e] ||
      new Promise((n) => {
        if ('document' in self) {
          const s = document.createElement('script');
          (s.src = e), (s.onload = n), document.head.appendChild(s);
        } else (s = e), importScripts(e), n();
      }).then(() => {
        let s = n[e];
        if (!s) throw new Error(`Module ${e} didn’t register its module`);
        return s;
      })
  );
  self.define = (l, i) => {
    const o = s || ('document' in self ? document.currentScript.src : '') || location.href;
    if (n[o]) return;
    let r = {};
    const t = (s) => e(s, o),
      a = { module: { uri: o }, exports: r, require: t };
    n[o] = Promise.all(l.map((s) => a[s] || t(s))).then((s) => (i(...s), r));
  };
}
define(['./workbox-b23c3c24'], function (s) {
  'use strict';
  self.addEventListener('message', (s) => {
    s.data && 'SKIP_WAITING' === s.data.type && self.skipWaiting();
  }),
    s.precacheAndRoute(
      [
        { url: 'assets/android/mipmap-hdpi/ic_launcher.png', revision: null },
        { url: 'assets/android/mipmap-mdpi/ic_launcher.png', revision: null },
        { url: 'assets/android/mipmap-xhdpi/ic_launcher.png', revision: null },
        { url: 'assets/android/mipmap-xxhdpi/ic_launcher.png', revision: null },
        { url: 'assets/android/mipmap-xxxhdpi/ic_launcher.png', revision: null },
        { url: 'assets/anyscale.png', revision: null },
        { url: 'assets/apipie.png', revision: null },
        { url: 'assets/apple-touch-icon-180x180.png', revision: null },
        { url: 'assets/appstore.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/100.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/102.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/1024.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/114.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/120.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/128.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/144.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/152.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/16.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/167.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/172.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/180.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/196.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/20.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/216.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/256.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/29.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/32.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/40.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/48.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/50.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/512.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/55.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/57.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/58.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/60.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/64.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/66.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/72.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/76.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/80.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/87.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/88.png', revision: null },
        { url: 'assets/Assets.xcassets/AppIcon.appiconset/92.png', revision: null },
        { url: 'assets/bingai-jb.png', revision: null },
        { url: 'assets/bingai.png', revision: null },
        { url: 'assets/cohere.png', revision: null },
        { url: 'assets/favicon-africa-16x16.png', revision: null },
        { url: 'assets/favicon-africa-32x32.png', revision: null },
        { url: 'assets/favicon-china-16x16.png', revision: null },
        { url: 'assets/favicon-china-32x32.png', revision: null },
        { url: 'assets/favicon-global-16x16.png', revision: null },
        { url: 'assets/favicon-global-32x32.png', revision: null },
        { url: 'assets/favicon-iran-16x16.png', revision: null },
        { url: 'assets/favicon-iran-32x32.png', revision: null },
        { url: 'assets/favicon-italy-16x16.png', revision: null },
        { url: 'assets/favicon-italy-32x32.png', revision: null },
        { url: 'assets/favicon-novlisky-16x16.png', revision: null },
        { url: 'assets/favicon-novlisky-32x32.png', revision: null },
        { url: 'assets/favicon-russia-16x16.png', revision: null },
        { url: 'assets/favicon-russia-32x32.png', revision: null },
        { url: 'assets/favicon-usa-16x16.png', revision: null },
        { url: 'assets/favicon-usa-32x32.png', revision: null },
        { url: 'assets/fireworks.png', revision: null },
        { url: 'assets/google-palm.svg', revision: null },
        { url: 'assets/groq.png', revision: null },
        { url: 'assets/huggingface.svg', revision: null },
        { url: 'assets/logo-africa.png', revision: null },
        { url: 'assets/logo-china.png', revision: null },
        { url: 'assets/logo-global.png', revision: null },
        { url: 'assets/logo-iran.png', revision: null },
        { url: 'assets/logo-italy.png', revision: null },
        { url: 'assets/logo-novlisky-og.png', revision: null },
        { url: 'assets/logo-novlisky.png', revision: null },
        { url: 'assets/logo-russia.png', revision: null },
        { url: 'assets/logo-usa.png', revision: null },
        { url: 'assets/logo.svg', revision: null },
        { url: 'assets/maskable-icon.png', revision: null },
        { url: 'assets/mistral.png', revision: null },
        { url: 'assets/mlx.png', revision: null },
        { url: 'assets/ollama.png', revision: null },
        { url: 'assets/openrouter.png', revision: null },
        { url: 'assets/perplexity.png', revision: null },
        { url: 'assets/playstore.png', revision: null },
        { url: 'assets/shuttleai.png', revision: null },
        { url: 'assets/together.png', revision: null },
        { url: 'assets/web-browser.svg', revision: null },
        { url: 'assets/index-B8ws1t6k.js', revision: null },
        { url: 'assets/index-DCmo6PAL.css', revision: null },
        { url: 'assets/Inter-Bold-CytjP_7U.woff2', revision: null },
        { url: 'assets/Inter-BoldItalic-B0T-BnK6.woff2', revision: null },
        { url: 'assets/Inter-Italic-B_ozvy2G.woff2', revision: null },
        { url: 'assets/Inter-Regular-B0QUfDW0.woff2', revision: null },
        { url: 'assets/Inter-SemiBold-_JLwM7Yv.woff2', revision: null },
        { url: 'assets/Inter-SemiBoldItalic-C4gNvuGw.woff2', revision: null },
        { url: 'assets/markdown_highlight-DdZtPvay.js', revision: null },
        { url: 'assets/markdown_large-7HSoBTS5.js', revision: null },
        { url: 'assets/roboto-mono-latin-400-italic-B6BBQVPU.woff2', revision: null },
        { url: 'assets/roboto-mono-latin-400-normal-C_5wUCW5.woff2', revision: null },
        { url: 'assets/roboto-mono-latin-700-normal-DpzZ8rK9.woff2', revision: null },
        { url: 'assets/vendor-D4Rc_Tis.js', revision: null },
        { url: 'fonts/Inter-Bold.woff2', revision: '279e5a64038565325a5fda8f14a9b9ec' },
        { url: 'fonts/Inter-BoldItalic.woff2', revision: '33083aa00dfe1e31f0ff2fb645dc75be' },
        { url: 'fonts/Inter-Italic.woff2', revision: '8944f8c2a3dd2373bd6351e19e699d23' },
        { url: 'fonts/Inter-Regular.woff2', revision: '46a1550a4bbaccd13a8eb46a359a9f89' },
        { url: 'fonts/Inter-SemiBold.woff2', revision: '01fdc3828f4efe9208e2149531a8933d' },
        { url: 'fonts/Inter-SemiBoldItalic.woff2', revision: '6fc9977f6a237a65e6caf218c87d6e01' },
        {
          url: 'fonts/roboto-mono-latin-400-italic.woff2',
          revision: 'd42634a24b5c8560a89c7a779fe152fe',
        },
        {
          url: 'fonts/roboto-mono-latin-400-normal.woff2',
          revision: '32cb6e15327552c8968f500de2911299',
        },
        {
          url: 'fonts/roboto-mono-latin-700-normal.woff2',
          revision: '5900c2f9140f24ce86f85cb6a6bbffc8',
        },
        { url: 'index.html', revision: 'b04af5f3754ec3cd721b1d32cc5fcb75' },
        { url: 'registerSW.js', revision: '1872c500de691dce40960bb85481de07' },
        { url: 'manifest.webmanifest', revision: '22f0f5443e9f402663e450e026426947' },
      ],
      {},
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL('index.html')));
});
