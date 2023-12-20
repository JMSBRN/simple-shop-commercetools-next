import LogosSlider from '../sliders/logos-slider/LogosSlider';
import React from 'react';
import Slider from '../sliders/slider/Slider';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getNameAtIndex } from '@/commercetools/utils/utilsApp';
import logoBrandsData from '../../../public/data/brands-logo.json';
import sliderData from '../../../public/data/data.json';
import styles from './WelcomePage.module.scss';
import { useRouter } from 'next/router';

function WelcomePage() {
  const {
    welcomePageContainer,
    slidersContainer,
    sliderWrapperStyle,
    sliderTitle,
    logoContainer,
  } = styles;
  const { locale } = useRouter();

  return (
    <div className={welcomePageContainer}>
      <div className={slidersContainer}>
        {sliderData['slider-images'].map((slider, index) => (
          <div key={index}>
            <div className={sliderTitle}>
              {filterObjectAndReturnValue(slider.name, locale!)}
            </div>
            <div className={sliderWrapperStyle}>
              <Slider intervalSeconds={9000 + index * 3000}>
                {slider.images.map((el, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={el.url}
                    alt="image for slider"
                    width="100%"
                    height="100%"
                  />
                ))}
              </Slider>
            </div>
          </div>
        ))}
      </div>
      <LogosSlider duration={55000000}>
        {Array.from({ length: 10000 }).map((el, idx) => (
          <div className={logoContainer} key={idx}>
            {getNameAtIndex(idx, logoBrandsData['brands-logo'])}
          </div>
        ))}
      </LogosSlider>
    </div>
  );
}

export default WelcomePage;
