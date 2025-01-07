import React from 'react';
import { Link } from 'react-router-dom';
import { getDomainData } from '../../utils/domainUtils';

const Footer = () => {
  const domainData = getDomainData();

  return (
    <footer className="flex flex-col items-center justify-center space-y-8 pb-10">
      <div className="flex flex-col items-center space-y-3 text-gray-400 dark:text-gray-500 sm:flex-row sm:space-x-8 sm:space-y-0">
        <Link
          to="/privacy-policy"
          className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms-of-service"
          className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          Terms of Service
        </Link>
      </div>
      <Link to="/">
        <img
          src={domainData.smallLogoPath}
          alt={`${domainData.logoText} Logo`}
          className="h-8 w-8"
        />
      </Link>
    </footer>
  );
};

export default Footer;
