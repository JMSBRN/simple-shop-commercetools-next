import React from 'react';
import styles from './ButtonWithLoader.module.scss';

function ButtonWithLoader({
  text,
  onClick,
  isLoading,
}: {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
}) {
  const { buttonStyle, buttonStyleWithLoader } = styles;

  return (
    <button
      data-testid="button-with-loader"
      className={isLoading ? buttonStyleWithLoader : buttonStyle}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
}

export default ButtonWithLoader;
