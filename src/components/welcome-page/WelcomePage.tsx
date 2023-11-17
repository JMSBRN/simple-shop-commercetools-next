import LogosSlider from '../sliders/logos-slider/LogosSlider';
import React from 'react';
import Slider from '../sliders/slider/Slider';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
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
          <div key={index} style={{ textAlign: 'center', margin: '70px' }}>
            <div className={sliderTitle}>
              {filterObjectAndReturnValue(slider.name, locale!)}
            </div>
            <div className={sliderWrapperStyle}>
              <Slider
                images={slider.images}
                intervalSeconds={9000 + index * 3000}
                imageWidth={350}
                imageHeight={500}
              />
            </div>
          </div>
        ))}
      </div>
      <LogosSlider>
        {[
          ...logoBrandsData['brands-logo'],
          ...logoBrandsData['brands-logo'],
        ].map((el, idx) => (
          <div className={logoContainer} key={idx}>
            {el.name}
          </div>
        ))}
      </LogosSlider>
    </div>
  );
}

export default WelcomePage;
