import React from 'react';
import { Link } from 'react-router-dom';
import { getDomainData } from '../../utils/domainUtils';

const Footer = () => {
  const domainData = getDomainData();

  return (
    <footer className="flex flex-col items-center justify-center space-y-8 pb-10">
      <div className="flex flex-col items-center space-y-3 text-gray-400 sm:flex-row sm:space-x-8 sm:space-y-0">
        <Link to="/privacy-policy" className="hover:text-blue-600">
          Privacy Policy
        </Link>
        <Link to="/terms-of-service" className="hover:text-blue-600">
          Terms of Service
        </Link>
      </div>
      <Link to="/">
        <img src={domainData.logoPath} alt={`${domainData.logoText} Logo`} className="h-8 w-8" />
      </Link>
    </footer>
  );
};

export default Footer;
