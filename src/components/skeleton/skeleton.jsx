import React from 'react';
import { range } from '../../lib/range';
import styles from './skeleton.module.scss'

const skeletonArray = range(0, 20);

export const Skeleton = () => {
    return (
        <div className={styles.cardWrapper}>
            {skeletonArray.map((index) => {
                return (
                    <div key={index} className={styles.cardContainer}>
                        <div className={styles.card} />
                        <div className={styles.cardHeading} />
                    </div>
                )
            })}
        </div>
    )
}
