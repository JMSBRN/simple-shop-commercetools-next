import React, { ReactNode, useEffect, useState } from 'react';

interface SliderChild {
  children: React.ReactNode;
}

interface SliderProps {
  slideWidth?: number;
  children: React.ReactNode[] | React.ReactElement<SliderChild>[];
}

const SliderNonStop: React.FC<SliderProps> = ({ children, slideWidth  }) => {
  const [position, setPosition] = useState(0);
  const [cycle, setCycle] = useState(0);
  const sliderContent = React.Children.toArray(children) as ReactNode[];
  const slideLoclalWidth = slideWidth || 100;
  const animationDuration = 5000;

  useEffect(() => {
    const totalWidth = sliderContent.length * slideLoclalWidth;
    const interval = setInterval(() => {
      setPosition((prevPosition) => {
        const nextPosition = prevPosition - 1;

        if (nextPosition <= -totalWidth) {
          setCycle((prevCycle) => prevCycle + 1);
          return 0;
        }

        return nextPosition;
      });
    }, animationDuration / slideLoclalWidth);

    return () => clearInterval(interval);
  }, [children, cycle, slideLoclalWidth, sliderContent.length]);

  const sliderMainWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    position: 'relative'
  };
  const sliderContainerStyle: React.CSSProperties = {
    width: '50%',
    height: 'auto',
    position: 'relative' as 'relative',
    overflow: 'hidden',
  };
  
  const sliderContentStyle: React.CSSProperties = {
    display: 'flex',
    width: 'auto',
    height: 'auto',
    transform: `translateX(${position}px)`,
  };

  return (
    <div style={sliderMainWrapperStyle}>
      <div style={sliderContainerStyle}>
        <div style={sliderContentStyle}>
          {[...sliderContent, ...(cycle % 2 === 0 ? sliderContent : [])].map(
            (child, index) => (
              <div key={index}  style={{ flex: '0 0 auto', width: `${slideLoclalWidth}px` }}>
                {child}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderNonStop;
