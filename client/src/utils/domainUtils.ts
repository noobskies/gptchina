interface DomainData {
  logoText: string;
  logoFilename: string;
  logoPath: string;
}

const domainData: Record<string, DomainData> = {
  'gptchina.io': {
    logoText: 'GPT China',
    logoFilename: 'logo-china.png',
    logoPath: '/assets/logo-china.png',
  },
  'gptafrica.io': {
    logoText: 'GPT Africa',
    logoFilename: 'logo-africa.png',
    logoPath: '/assets/logo-africa.png',
  },
  'gptglobal.io': {
    logoText: 'GPT Global',
    logoFilename: 'logo-global.png',
    logoPath: '/assets/logo-global.png',
  },
  'gptiran.io': {
    logoText: 'GPT Iran',
    logoFilename: 'logo-iran.png',
    logoPath: '/assets/logo-iran.png',
  },
  'gptitaly.io': {
    logoText: 'GPT Italy',
    logoFilename: 'logo-italy.png',
    logoPath: '/assets/logo-italy.png',
  },
  'gptrussia.io': {
    logoText: 'GPT Russia',
    logoFilename: 'logo-russia.png',
    logoPath: '/assets/logo-russia.png',
  },
  'gptusa.io': {
    logoText: 'GPT USA',
    logoFilename: 'logo-usa.png',
    logoPath: '/assets/logo-usa.png',
  },
};

const defaultData: DomainData = {
  logoText: 'Novlisky',
  logoFilename: 'logo-novlisky.png',
  logoPath: '/assets/logo-novlisky.png',
};

export const getDomainData = (): DomainData => {
  const currentDomain = window.location.hostname;
  return domainData[currentDomain] || defaultData;
};
