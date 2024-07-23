// Loader.js
import React from 'react';
import { Oval } from 'react-loader-spinner';
import styles from "./LightLoader.module.scss";

const LightLoader = () => {
  return (
    <div className={styles.container}>
      <Oval
        height={80}
        width={80}
        color="#6c01cc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#8600ff"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default LightLoader;
