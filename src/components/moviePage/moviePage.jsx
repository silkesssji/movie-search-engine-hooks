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
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
            setSimilarMovies(result.results)
        }
        defineSimilarMovies();
        setLoading(false);
    }, [id])

    useEffect(() => {
        if (movie.poster_path && movie.poster_path.length) {
            setPoster(movie.poster_path);
        }
    }, [movie])

    return (
        <div className={styles.main}>
            <div className={styles.bgWrapper}>
                <div className={styles.background} style={{
                    backgroundImage: poster.length
                        ? `url(https://image.tmdb.org/t/p/w780/${poster}`
                        : 'none'
                }} />
            </div>
            <Header
                backgroundPath={poster}
                changeRequest={() => null}
                type='moviePage'
            />
            <main className={styles.wrapper}>
                <div className={styles.info}>
                    <div className={loading ? styles.loadPoster : styles.posterWrapper}>
                        {!loading && Boolean(poster.length) && <img
                            key={`https://image.tmdb.org/t/p/original/${poster}`}
                            className={styles.poster}
                            src={`https://image.tmdb.org/t/p/original/${poster}`}
                        />}
                    </div>
                    <div className={styles.text}>
                        <h2 className={loading ? styles.loadTitle : styles.title}>
                            {movie.title}
                        </h2>
                        <p className={loading ? styles.loadDescription : styles.description}>
                            {movie.overview}
                        </p>

                        <p className={loading ? styles.loadTagline : styles.tagline}>
                            {movie.tagline}
                        </p>
                        <div className={loading ? styles.loadMoreInfo : styles.moreInfo}>
                            <p className={styles.voteAverage}>
                                {movie.vote_average}
                            </p>
                            <p className={styles.releaseDate}>
                                {movie.release_date}
                            </p>
                            {Boolean(movie.genres) && (
                                <ul className={styles.genres}>
                                    {movie.genres.map((genre, index) => {
                                        return <li key={index}>
                                            {genre.name}
                                        </li>
                                    })}
                                </ul>
                            )}
                            <a
                                className={styles.homepage}
                                href={movie.homepage}
                                target="_blank" rel="noopener noreferrer"
                            >
                                {movie.homepage}
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <div className={styles.similarMovies}>
                <SimilarMovies
                    movies={similarMovies.length ? similarMovies : skeletonArray}
                    type={similarMovies.length ? 'movies' : 'skeleton'}
                />
            </div>
            <Footer />
        </div>
    )
}