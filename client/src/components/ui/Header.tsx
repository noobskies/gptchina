import React from 'react';
import { Link } from 'react-router-dom';
import { getDomainData } from '../../utils/domainUtils';

const Header = () => {
  const domainData = getDomainData();

  return (
    <header className="sticky top-0 z-10 bg-white/40 px-5 py-4 backdrop-blur-lg lg:bg-transparent lg:px-10 lg:backdrop-blur-none">
      <nav className="mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={domainData.smallLogoPath}
              alt={`${domainData.logoText} Logo`}
              className="h-8 w-8"
            />
            <span className="text-xl font-semibold">{domainData.logoText}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
