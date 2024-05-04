/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useLocalize } from '~/hooks';

const Header = () => {
  const localize = useLocalize();

  const domainLogos = {
    'gptchina.io': 'logo-china.png',
    'gptafrica.io': 'logo-africa.png',
    'gptglobal.io': 'logo-global.png',
    'gptiran.io': 'logo-iran.png',
    'gptitaly.io': 'logo-italy.png',
    'gptrussia.io': 'logo-russia.png',
    'gptusa.io': 'logo-usa.png',
    'novlisky.io': 'logo-novlisky.png',
  };

  const currentDomain = window.location.hostname;
  const logoImageFilename = domainLogos[currentDomain] || 'logo-novlisky.png';

  return (
    <header className="relative z-50 flex min-h-[70px] bg-white px-4 py-4 font-[sans-serif] tracking-wide shadow-lg sm:px-10">
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="max-lg:left-10 lg:absolute lg:left-2/4 lg:top-2/4 lg:-translate-x-1/2 lg:-translate-y-1/2"
        >
          <img src={`/assets/${logoImageFilename}`} alt="logo" className="w-36" />
        </Link>

        <div
          id="collapseMenu"
          className="max-lg:fixed max-lg:hidden max-lg:w-full max-lg:before:fixed max-lg:before:inset-0 max-lg:before:z-50 max-lg:before:bg-black max-lg:before:opacity-50 lg:!block"
        >
          <button
            id="toggleClose"
            className="fixed right-4 top-2 z-[100] rounded-full bg-white p-3 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>

          <ul className="z-50 max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:h-full max-lg:w-1/2 max-lg:min-w-[300px] max-lg:space-y-3 max-lg:overflow-auto max-lg:bg-white max-lg:p-6 max-lg:shadow-md lg:flex lg:gap-x-5">
            <li className="mb-6 hidden max-lg:block">
              <Link to="/">
                <img src={`/assets/${logoImageFilename}`} alt="logo" className="w-36" />
              </Link>
            </li>
            <li className="px-3 max-lg:border-b max-lg:py-3">
              <Link
                to="/"
                className="block text-[15px] font-semibold text-[#007bff] hover:text-[#007bff]"
              >
                Home
              </Link>
            </li>
          </ul>
        </div>

        <div className="ml-auto flex items-center space-x-6">
          {/* <button className="border-none text-[15px] font-semibold outline-none">
            <Link to="/login" className="text-[#007bff] hover:underline">
              Login
            </Link>
          </button>
          <Link
            to="/register"
            className="rounded-sm border-2 border-[#007bff] bg-[#007bff] px-4 py-2 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#007bff]"
          >
            Sign up
          </Link> */}

          <button id="toggleOpen" className="lg:hidden">
            <svg
              className="h-7 w-7"
              fill="#333"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
