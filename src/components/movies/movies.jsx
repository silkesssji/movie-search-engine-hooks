import styles from './movies.module.scss'
import { Card } from '../card/card';
import { Link } from "react-router-dom";


export function Movies({
    movies, genres
}) {
    return (
        <>
            {movies.length !== 0 && movies
                .map((movie, index) => {
                    const year = movie.release_date ? `(${movie.release_date.split('-')[0]})` : '';
                    const title = `${movie.title ? `${movie.title} ` : ''}${year}`
                    return (
                        <Link
                            to={`/card/${movie.id}`}
                            key={index}
                            className={styles.link}
                        >
                            <Card imageUrl={movie.poster_path} title={title} id={movie.id} />
                        </Link>
                    )
                }
                )}
        </>
    )
}