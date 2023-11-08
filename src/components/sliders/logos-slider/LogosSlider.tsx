import React, { ReactNode, useEffect, useRef } from 'react';
import styles from './LogosSlider.module.scss';

function LogosSlider({ children, duration  }: { children: React.ReactNode[]; duration?: number; }) {
  const sliderContent = React.Children.toArray(children) as ReactNode[];

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;

    const keyframes = [
      { transform: 'translate3d(0, 0, 0)' },
      { transform: 'translate3d(-100%, 0, 0)' },
    ];

    const options = {
      duration: duration || 300000,
      iterations: Infinity,
      easing: 'linear',
    };

    if (slider) {
      const animation = slider.animate(keyframes, options);

      return () => {
        animation.cancel();
      };
    }
  }, [duration]);

  return (
    <div className={styles.card}>
      <div className={styles.logosSlider}>
        <div
          ref={sliderRef}
          className={styles.container}
        >
          {sliderContent.map((child, idx) => (
            <div key={idx}>{child}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogosSlider;
