import { TypeAnimation } from 'react-type-animation';
import { useLocalize } from '~/hooks';

interface WelcomeContentProps {
  logoText: string;
}

const WelcomeContent = ({ logoText }: WelcomeContentProps) => {
  const localize = useLocalize();

  return (
    <div className="z-10 text-left">
      <div className="z-10 text-left">
        <TypeAnimation
          sequence={[`${localize('home_welcome_to')} ${logoText}`, 1000]}
          speed={50}
          repeat={Infinity}
          cursor={true}
          className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        />
      </div>
      <p className="mb-4 text-base text-white sm:text-lg">{localize('home_intro_text_1')}</p>
      <p className="mb-4 text-base text-white sm:text-lg">{localize('home_intro_text_2')}</p>
      <ul className="mb-4 text-base text-white sm:text-lg">
        <li className="mb-3 sm:mb-0">{localize('home_feature_1')}</li>
        <li className="mb-3 sm:mb-0">{localize('home_feature_2')}</li>
        <li className="mb-3 sm:mb-0">{localize('home_feature_3')}</li>
        <li className="mb-3 sm:mb-0">{localize('home_feature_4')}</li>
        <li className="mb-3 sm:mb-0">{localize('home_feature_5')}</li>
        <li>{localize('home_feature_6')}</li>
      </ul>
    </div>
  );
};

export default WelcomeContent;
