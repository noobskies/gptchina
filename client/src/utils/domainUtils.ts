interface DomainData {
  logoText: string;
  logoFilename: string;
  logoPath: string;
  logoDarkPath: string;
  logoLightPath: string;
  trackingCode: string;
  smallLogoPath: string;
}

const domainData: Record<string, DomainData> = {
  'gptchina.io': {
    logoText: 'GPT China',
    logoFilename: 'logo-china.png',
    logoPath: '/assets/logo-china.png',
    logoDarkPath: '/assets/logo-china.png',
    logoLightPath: '/assets/logo-china.png',
    trackingCode: 'G-2HYZSSFTSV',
    smallLogoPath: '/assets/logo-china.png',
  },
  'gptafrica.io': {
    logoText: 'GPT Africa',
    logoFilename: 'logo-africa.png',
    logoPath: '/assets/logo-africa.png',
    logoDarkPath: '/assets/logo-africa.png',
    logoLightPath: '/assets/logo-africa.png',
    trackingCode: 'G-268NPHEPVM',
    smallLogoPath: '/assets/logo-africa.png',
  },
  'novlisky.io': {
    logoText: 'Novlisky',
    logoFilename: 'logo-novlisky.png',
    logoPath: '/assets/logo-novlisky.png',
    logoDarkPath: '/assets/logo-novlisky-white.png',
    logoLightPath: '/assets/logo-novlisky.png',
    trackingCode: 'G-XYDFX0BJEY',
    smallLogoPath: '/assets/logo-novlisky-small.png',
  },
};

const defaultData: DomainData = {
  logoText: 'Novlisky',
  logoFilename: 'logo-novlisky.png',
  logoPath: '/assets/logo-novlisky.png',
  logoDarkPath: '/assets/logo-novlisky-white.png',
  logoLightPath: '/assets/logo-novlisky.png',
  trackingCode: 'G-XYDFX0BJEY',
  smallLogoPath: '/assets/logo-novlisky-small.png',
};

export const getDomainData = (): DomainData => {
  const currentDomain = window.location.hostname;
  return domainData[currentDomain] || defaultData;
};
