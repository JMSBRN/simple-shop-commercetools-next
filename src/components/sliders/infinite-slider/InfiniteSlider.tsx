import React, { useCallback, useEffect, useState } from 'react';
import styles from './InfifniteSlider.module.scss';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

function InfiniteSlider({
  intervalMilSeconds,
  isButtonsExisted,
  isPountsExisted,
}: {
  intervalMilSeconds?: number;
  isButtonsExisted?: boolean;
  isPountsExisted?: boolean;
}) {
  const {
    sliderContainer,
    slider,
    carousel,
    slide,
    controls,
    controlButton,
    active,
    points,
    point,
  } = styles;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const isFirstSlide = currentIndex === 0;
  const transition = isHidden || isFirstSlide ? 'none' : 'transform 0.9s ease';

  const moveToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = useCallback(() => {
    setIsHidden(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (items.length + 1));
  }, []);

  const prevSlide = () => {
    switch (currentIndex) {
      case 4:
        setIsHidden(false);
        setCurrentIndex(3);
        break;
      case 1:
        setIsHidden(true);
        setCurrentIndex(4);
        break;
      case 2:
        setIsHidden(false);
        setCurrentIndex(1);
        break;
      case 3:
        setIsHidden(false);
        setCurrentIndex(2);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, isFirstSlide ? 0 : intervalMilSeconds || 3000);

    return () => {
      clearInterval(interval);
    };
  }, [intervalMilSeconds, isFirstSlide, nextSlide]);

  return (
    <div className={sliderContainer}>
      <div className={slider}>
        <div
          className={carousel}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition,
          }}
        >
          {[...items, items[0]].map((item, index) => (
            <div key={index} className={slide}>
              {item}
            </div>
          ))}
        </div>

        <div className={controls}>
          {isButtonsExisted && (
            <button onClick={prevSlide} className={controlButton}>
              Previous
            </button>
          )}
          <div className={points}>
            {isPountsExisted && (
              <>
                <button
                  onClick={() => moveToSlide(items.length)}
                  className={`${point} ${currentIndex === 4 ? active : ''}`}
                ></button>
                {items.map((_, index) => (
                  <button
                    key={index}
                    style={{ display: `${index === 0 ? 'none' : 'block'}` }}
                    onClick={() => moveToSlide(index)}
                    className={`${point} ${
                      currentIndex === index || 0 ? active : ''
                    }`}
                  ></button>
                ))}
              </>
            )}
          </div>
          {isButtonsExisted && (
            <button onClick={nextSlide} className={controlButton}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfiniteSlider;
