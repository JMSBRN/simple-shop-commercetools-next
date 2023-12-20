import React from 'react';
import styles from './Headlines.module.scss';

function Headlines({ headlines }: { headlines: string[] }) {
  return (
    <div className={styles.headlines}>
      {headlines.map((el, idx) => (
        <div key={idx}>{el}</div>
      ))}
    </div>
  );
}

export default Headlines;
