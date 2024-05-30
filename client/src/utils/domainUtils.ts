interface DomainData {
  logoText: string;
  logoFilename: string;
  logoPath: string;
  trackingCode: string;
}

const domainData: Record<string, DomainData> = {
  'gptchina.io': {
    logoText: 'GPT China',
    logoFilename: 'logo-china.png',
    logoPath: '/assets/logo-china.png',
    trackingCode: 'G-2HYZSSFTSV',
  },
  'gptafrica.io': {
    logoText: 'GPT Africa',
    logoFilename: 'logo-africa.png',
    logoPath: '/assets/logo-africa.png',
    trackingCode: 'G-268NPHEPVM',
  },
  'gptglobal.io': {
    logoText: 'GPT Global',
    logoFilename: 'logo-global.png',
    logoPath: '/assets/logo-global.png',
    trackingCode: 'G-FRZD0ZXQHP',
  },
  'gptiran.io': {
    logoText: 'GPT Iran',
    logoFilename: 'logo-iran.png',
    logoPath: '/assets/logo-iran.png',
    trackingCode: 'G-0NGSJ9SP6Z',
  },
  'gptitaly.io': {
    logoText: 'GPT Italy',
    logoFilename: 'logo-italy.png',
    logoPath: '/assets/logo-italy.png',
    trackingCode: 'G-40QF6KBX1L',
  },
  'gptrussia.io': {
    logoText: 'GPT Russia',
    logoFilename: 'logo-russia.png',
    logoPath: '/assets/logo-russia.png',
    trackingCode: 'G-N5L46P3PCX',
  },
  'gptusa.io': {
    logoText: 'GPT USA',
    logoFilename: 'logo-usa.png',
    logoPath: '/assets/logo-usa.png',
    trackingCode: 'G-46JS78DD0K',
  },
};

const defaultData: DomainData = {
  logoText: 'Novlisky',
  logoFilename: 'logo-novlisky.png',
  logoPath: '/assets/logo-novlisky.png',
  trackingCode: 'G-XYDFX0BJEY',
};

export const getDomainData = (): DomainData => {
  const currentDomain = window.location.hostname;
  return domainData[currentDomain] || defaultData;
};
