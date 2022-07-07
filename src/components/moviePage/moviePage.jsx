import styles from "./moviePage.module.scss";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { SimilarMovies } from "../similarMovies/similarMovies";
import { range } from "../../lib/range";

const skeletonArray = range(0, 19);

export const MoviePage = ({ }) => {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(true);
    const [poster, setPoster] = useState('');
    const [similarMovies, setSimilarMovies] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id])

    useEffect(() => {
        setLoading(true);
        const setMovieInfo = async () => {
            const result = await api.getMovieInformation(id);
            setMovie(result);
        }
        setMovieInfo();
        const defineSimilarMovies = async () => {
            const result = await api.getSimilarMovies(id);
            setSimilarMovies(result.results);
            setLoading(false);
        }
        defineSimilarMovies();
    }, [id])

    useEffect(() => {
        if (movie.poster_path && movie.poster_path.length) {
            setPoster(movie.poster_path);
        }
    }, [movie])

    return (
        <div className={styles.main}>
            <Header
                backgroundPath={poster}
                changeRequest={() => null}
                type='moviePage'
            />
            <main className={styles.wrapper}>
                <div className={styles.info}>
                    <div className={loading ? styles.loadPoster : styles.posterWrapper}>
                        {Boolean(!loading) && Boolean(poster.length) && <img
                            key={`https://image.tmdb.org/t/p/original/${poster}`}
                            className={styles.poster}
                            src={`https://image.tmdb.org/t/p/original/${poster}`}
                        />}
                    </div>
                    <div className={styles.text}>
                        <h2 className={loading ? styles.loadTitle : styles.title}>
                            {Boolean(!loading) && movie.title}
                        </h2>
                        <p className={loading ? styles.loadDescription : styles.description}>
                            {Boolean(!loading) && movie.overview}
                        </p>

                        <p className={loading ? styles.loadTagline : styles.tagline}>
                            {Boolean(!loading) && movie.tagline}
                        </p>
                        <div className={loading ? styles.loadMoreInfo : styles.moreInfo}>
                            <p className={styles.voteAverage}>
                                {Boolean(!loading) && movie.vote_average}
                            </p>
                            <p className={styles.releaseDate}>
                                {Boolean(!loading) && movie.release_date}
                            </p>
                            {Boolean(movie.genres) && Boolean(!loading) && (
                                <ul className={styles.genres}>
                                    {movie.genres.map((genre, index) => {
                                        return <li key={index}>
                                            {genre.name}
                                        </li>
                                    })}
                                </ul>
                            )}
                            {Boolean(!loading) && <a
                                className={styles.homepage}
                                href={movie.homepage}
                                target="_blank" rel="noopener noreferrer"
                            >
                                {movie.homepage}
                            </a>}
                        </div>
                    </div>
                </div>
            </main>
            <div className={styles.similarMovies}>
                <SimilarMovies
                    movies={Boolean(similarMovies.length) ? similarMovies : skeletonArray}
                    type={Boolean(similarMovies.length) ? 'movies' : 'skeleton'}
                />
            </div>
            <Footer />
        </div>
    )
}