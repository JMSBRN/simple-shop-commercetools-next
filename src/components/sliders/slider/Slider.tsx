/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Slider.module.scss';

const Slider = ({
  children,
  isPointsRendered,
  intervalSeconds,
}: {
  children: React.ReactNode[];
  isPointsRendered?: boolean;
  intervalSeconds?: number;
}) => {
  const { sliderContainer, active, sliderPoints, point, sliderBtnsAndPoints } =
    styles;
    const childrenContent = Array.from(children);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((currentSlide + 1) % childrenContent.length);
  }, [currentSlide, childrenContent.length]);

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + childrenContent.length) % childrenContent.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, intervalSeconds || 3000);

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide, intervalSeconds, nextSlide]);

  return (
    <div className={sliderContainer}>
      {childrenContent.find((_, idx) => idx === currentSlide)}
      {isPointsRendered && (
        <div className={sliderBtnsAndPoints}>
          <button onClick={prevSlide}>{'<'}</button>
          <div className={sliderPoints}>
            {childrenContent.map((_, index) => (
              <div
                key={index}
                className={`${point} ${index === currentSlide ? active : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
          <button onClick={nextSlide}>{'>'}</button>
        </div>
      )}
    </div>
  );
};

export default Slider;
