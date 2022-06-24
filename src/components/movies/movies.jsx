import styles from './movies.module.scss'
import { Card } from '../card/card';
import { Route, Routes, Link } from "react-router-dom";

export function Movies({
    movies
}) {
    return (
        <>
            <div className={styles.cardWrapper}>
                {movies.length !== 0 && movies
                    .map((movie, index) => {
                        const year = movie.release_date ? `(${movie.release_date.split('-')[0]})` : '';
                        const title = `${movie.title ? `${movie.title} ` : ''}${year}`
                        return (
                            <Link
                                to={`/card/${movie.id}`}
                                key={index}
                            // replace
                            >
                                <Card imageUrl={movie.poster_path} title={title} />
                            </Link>
                        )
                    }
                    )}
            </div>
        </>
    )
}