import React from 'react';
import { Link } from 'react-router-dom';
import { Apple, Download } from 'lucide-react';

const GetApp = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/40 px-5 py-4 backdrop-blur-lg lg:bg-transparent lg:px-10 lg:backdrop-blur-none">
        <nav className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="assets/logo-novlisky-small.png" alt="Novlisky Logo" className="h-8 w-8" />
              <span className="text-xl font-semibold">Novlisky</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto mt-28 w-full max-w-4xl px-5">
        <div className="space-y-28">
          {/* Hero Section */}
          <section>
            <div className="flex flex-col items-center space-y-8 text-center">
              <h1 className="text-4xl font-medium sm:text-6xl">Get Novlisky on Mobile</h1>
              <p className="max-w-sm text-xl text-gray-500">
                Your premium AI chat experience, now in your pocket. Access multiple AI models, code
                interpretation, and multimodal features on the go.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://apps.apple.com/app/6670143059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-blue-600"
                >
                  <Apple size={24} />
                  <span>App Store</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=twa.novlisky.io&hl=en_US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-blue-600"
                >
                  <Download size={24} />
                  <span>Google Play</span>
                </a>
              </div>
            </div>
            <div className="mt-20 sm:mx-auto sm:w-96">
              <img
                src="assets/app-preview.png"
                alt="Novlisky App Preview"
                className="h-full w-full drop-shadow-2xl"
              />
            </div>
          </section>

          {/* Discovery Section */}
          <section>
            <div className="mx-auto max-w-sm space-y-8 text-center">
              <h2 className="text-4xl font-medium sm:text-6xl">Limitless AI Power</h2>
              <p className="text-lg text-gray-500">
                Access multiple AI models including GPT-4, Claude, and Gemini. Seamlessly switch
                between providers while maintaining your conversation flow.
              </p>
            </div>
          </section>

          {/* Second App Screenshot */}
          <section>
            <div className="sm:mx-auto sm:w-96">
              <img
                src="assets/app-preview-2.png"
                alt="Novlisky App Features"
                className="h-full w-full drop-shadow-2xl"
              />
            </div>
          </section>

          {/* Features Grid */}
          <section>
            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  title: 'Multiple AI Models',
                  description:
                    'Switch seamlessly between GPT-4, Claude, Gemini, and more. Choose the perfect AI for every conversation.',
                  icon: (
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Multimodal Chat',
                  description:
                    'Chat with images using GPT-4 Vision, Claude 3, and Gemini. Analyze and discuss visual content naturally.',
                  icon: (
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
                {
                  title: 'Smart Context',
                  description:
                    'Edit, branch, and organize your chats. Fork conversations to explore different paths while maintaining context.',
                  icon: (
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div key={index} className="space-y-6">
                  <div>{feature.icon}</div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-medium">{feature.title}</h3>
                    <p className="text-lg text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="border-b border-gray-200"></div>

          {/* About Section */}
          <section>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="max-w-md space-y-8">
                <h2 className="text-4xl font-medium sm:text-6xl">About Novlisky</h2>
                <div className="space-y-4 text-lg text-gray-500">
                  <p>
                    Experience the most advanced AI platform on mobile. Switch seamlessly between
                    multiple AI models including GPT-4, Claude, and Gemini - all in one place.
                  </p>
                  <p>
                    With features like multimodal chat, code interpretation, and voice interaction,
                    Novlisky brings desktop-grade AI capabilities to your mobile device.
                  </p>
                  <p>
                    Join our community of power users who rely on Novlisky for everything from
                    creative writing to technical problem-solving, now available wherever you go.
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://apps.apple.com/app/your-app-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    <Apple size={24} />
                    <span>App Store</span>
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=twa.novlisky.io&hl=en_US"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 rounded-lg bg-gray-900 px-3 py-2 text-white hover:bg-blue-600"
                  >
                    <Download size={24} />
                    <span>Google Play</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src="assets/app-preview-3.png"
                  alt="Novlisky App Interface"
                  className="h-full w-full drop-shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col items-center justify-center space-y-8 pb-10">
            <div className="flex flex-col items-center space-y-3 text-gray-400 sm:flex-row sm:space-x-8 sm:space-y-0">
              <Link to="/privacy-policy" target="_blank" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" target="_blank" className="hover:text-blue-600">
                Terms of Service
              </Link>
            </div>
            <Link to="/">
              <img src="assets/logo-novlisky-small.png" alt="Novlisky Logo" className="h-8 w-8" />
            </Link>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default GetApp;
