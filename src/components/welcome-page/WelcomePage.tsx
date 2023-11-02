import React from 'react';
import Slider from '../sliders/slider/Slider';
import sliderData from '../../../public/data/data.json';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const { slidersContainer, sliderWrapperStyle, sliderTitle } = styles;

  return (
    <div>
      <div className={slidersContainer}>
        {sliderData['slider-images'].map((slider, index) => (
          <div key={index} style={{ textAlign: 'center', margin: '70px' }}>
            <div className={sliderTitle}>{slider.name} Brands </div>
            <div className={sliderWrapperStyle}>
              <Slider
                images={slider.images}
                intervalSeconds={9000 + (index * 3000)}
                imageWidth={350}
                imageHeight={500}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WelcomePage;
