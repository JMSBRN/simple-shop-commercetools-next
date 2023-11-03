import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import { SliderImage } from '../../../../public/data/dataInterfaces';
import styles from './Slider.module.scss';

const Slider = ({
  images,
  isPointsRendered,
  intervalSeconds,
  imageWidth,
  imageHeight
}: {
  images: SliderImage[];
  isPointsRendered?: boolean;
  intervalSeconds?: number;
  imageWidth?: number;
  imageHeight?: number;
}) => {
  const { sliderContainer, active, sliderPoints, point, sliderBtnsAndPoints } =
    styles;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((currentSlide + 1) % images.length);
  }, [currentSlide, images.length]);

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, intervalSeconds || 3000);

    return () => {
      clearInterval(interval);
    };
  }, [currentSlide, intervalSeconds, nextSlide]);

  return (
    <div className={sliderContainer}>
        <Image
          layout='fixed'
          width={imageWidth || 100}
          height={ imageHeight || 130}
          alt="slider image"
          src={images.find((_, idx) => idx === currentSlide)?.url!}
          loading="lazy"
        />
      {isPointsRendered && (
        <div className={sliderBtnsAndPoints}>
          <button onClick={prevSlide}>{'<'}</button>
          <div className={sliderPoints}>
            {images.map((_, index) => (
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
