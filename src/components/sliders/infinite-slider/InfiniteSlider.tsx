import React, { useCallback, useEffect, useState } from 'react';
import styles from './InfifniteSlider.module.scss';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

function InfiniteSlider() {
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
    const interval = setInterval(nextSlide, isFirstSlide ? 0 : 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isFirstSlide, nextSlide]);

  return (
    <div style={{ width: '500px' }}>
      {JSON.stringify(currentIndex)}
      <div className={styles.slider}>
        <div
          className={styles.carousel}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition,
          }}
        >
          {[...items, items[0]].map((item, index) => (
            <div key={index} className={styles.slide}>
              {item}
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button onClick={prevSlide} className={styles.controlButton}>
            Previous
          </button>
          <button
              onClick={() => moveToSlide(items.length)}
              className={`${styles.point} ${
                currentIndex === 4 ? styles.active : ''
              }`}
            ></button>
          {items.map((_, index) => (
            <button
              key={index}
              style={{ display: `${ index === 0 ? 'none': 'block' }` }}
              onClick={() => moveToSlide(index)}
              className={`${styles.point} ${
                currentIndex === index || 0 ? styles.active : ''
              }`}
            ></button>
          ))}
          <button onClick={nextSlide} className={styles.controlButton}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfiniteSlider;
