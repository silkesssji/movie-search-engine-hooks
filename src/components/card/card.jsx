import React from 'react';
import styles from './card.module.scss'

export const Card = ({
    imageUrl,
    title,
}) => {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.card}>
                {imageUrl ? <img className={styles.cardPoster} src={
                    `https://image.tmdb.org/t/p/w780/${imageUrl}`} /> :
                    <div className={styles.posterNotFound}>No Image</div>}
            </div>
            <div className={styles.cardHeading}>
                <h2 className={styles.cardTitle}>
                    {title}
                </h2>
            </div>
        </div>
    )
}
