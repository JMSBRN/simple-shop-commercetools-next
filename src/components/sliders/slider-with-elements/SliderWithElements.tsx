import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './SliderWithElements.module.scss';

function SliderWithElements({
  children,
  isPointsExisted,
  isButtonsExisted,
}: {
  children: React.ReactNode;
  isPointsExisted?: boolean;
  isButtonsExisted?: boolean;
}) {
  const {
    sliderWrapper,
    sliderContainer,
    sliderStyles,
    containerStyles,
    slide,
    points,
    active,
  } = styles;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderContent = React.Children.toArray(children) as ReactNode[];

  const totalSlides = sliderContent.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${-currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <div className={sliderWrapper}>
      {isButtonsExisted && <button onClick={prevSlide}>{'<'}</button>}
      <div className={sliderContainer}>
        <div className={sliderStyles}>
          <div ref={sliderRef} className={containerStyles}>
            {sliderContent.map((child, idx) => (
              <div key={idx} className={slide}>
                {child}
              </div>
            ))}
          </div>
        </div>
        {isPointsExisted && (
          <div className={points}>
            {sliderContent.map((_, idx) => (
              <span
                key={idx}
                className={idx === currentIndex ? active : ''}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="btns">
        {isButtonsExisted && <button onClick={nextSlide}>{'>'}</button>}
      </div>
    </div>
  );
}

export default SliderWithElements;
