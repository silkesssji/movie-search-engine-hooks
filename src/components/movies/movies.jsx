import React from 'react';
import styles from './movies.module.scss'
import { Card } from '../card/card';

export const Movies = ({
    movies
}) => {
    return (
        <div className={styles.cardWrapper}>
            {movies.length !== 0 && movies
                .map((movie, index) => {
                    const year = movie.release_date ? `(${movie.release_date.split('-')[0]})` : '';
                    const title = `${movie.title ? `${movie.title} ` : ''}${year}`
                    return (
                        <Card imageUrl={movie.poster_path} title={title} key={index} />
                    )
                }
                )}
        </div>
    )
}