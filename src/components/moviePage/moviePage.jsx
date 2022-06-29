import styles from "./moviePage.module.scss";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { api } from "../../lib/api";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { SimilarMovies } from "../similarMovies/similarMovies";

export const MoviePage = ({ }) => {
    const { id } = useParams();
    const [movie, setMovie] = useState({});
    const loading = useRef(true);
    const [poster, setPoster] = useState('')
    const [similarMovies, setSimilarMovies] = useState([])
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [id])
    useEffect(() => {
        const setMovieInfo = async () => {
            const result = await api.getMovieInformation(id);
            setMovie(result);
            loading.current = false;
        }
        setMovieInfo();
        const defineSimilarMovies = async () => {
            const result = await api.getSimilarMovies(id);
            setSimilarMovies(result.results)
        }
        defineSimilarMovies();
    })
    useEffect(() => {
        if (movie.poster_path && movie.poster_path.length) {
            setPoster(movie.poster_path);
        }
    }, [movie])

    if (loading.current) {
        return (
            <div></div>
        )
    } else {
        return (
            <div className={styles.main}
            >
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
                <div className={styles.wrapper}>

                    <div className={styles.info}>
                        {!loading.current && Boolean(poster.length) &&
                            <div className={styles.posterWrapper}>
                                <img
                                    className={styles.poster}
                                    src={`https://image.tmdb.org/t/p/original/${poster}`}
                                />
                            </div>
                        }
                        <div className={styles.text}>
                            <h2 className={styles.title}>
                                {movie.title}
                            </h2>
                            <p className={styles.description}>
                                {movie.overview}
                            </p>
                            {movie.tagline &&
                                <p className={styles.tagline}>
                                    `{movie.tagline}`
                                </p>
                            }
                            <div className={styles.moreInfo}>
                                <p className={styles.voteAverage}>
                                    {movie.vote_average}
                                </p>
                                <p className={styles.releaseDate}>
                                    {movie.release_date}
                                </p>
                                Genres:
                                <ul className={styles.genres}>

                                    {movie.genres.map((genre, index) => {
                                        return <li key={index}>
                                            {genre.name}
                                        </li>
                                    })}
                                </ul>
                                <a className={styles.homepage} href={movie.homepage}>
                                    {movie.homepage}
                                </a>
                            </div>
                        </div>
                    </div>


                </div>
                {similarMovies.length &&
                    <div className={styles.similarMovies}>
                        <SimilarMovies movies={similarMovies} />
                    </div>
                }
                <Footer />

            </div>
        )
    }
}