import React, { useState, useEffect, useRef } from 'react';

import styles from "./app.module.scss";
import { Pagination } from '../pagination/pagination';
import { Movies } from '../movies/movies';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Skeleton } from '../skeleton/skeleton';
import { Filters } from '../filters/filters';
import { debounce } from '../../lib/debounce';
import { api } from '../../lib/api';
import { getRandomInteger } from '../../lib/getRandomInteger';
import { Error } from '../error/error';


export function App({ initialQueryParams }) {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [backgroundPath, setBackdropPath] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [errors, setErrors] = useState({
        moviesFail: null,
        genresFail: null
    }
    );
    const [loading, setLoading] = useState(true);
    const [choosedGenres, setChoosedGenres] = useState([]);
    const [requestValue, setRequestValue] = useState('');
    const [adult, setAdult] = useState(false);
    const [genres, setGenres] = useState([]);
    const [mounting, setMounting] = useState(true);
    const abort = useRef(null);

    useEffect(() => {
        mountingInitialConditions();
    }, [])

    useEffect(() => {
        setLoading(true);
        if (!mounting) {
            updateHistoryQueryParams(page, requestValue, adult);
            if ((requestValue !== undefined)) {
                fetchMovies();
            }
        }
        setMounting(false);
    }, [page, requestValue, adult])

    const mountingInitialConditions = async () => {
        const fetchedGenres = await fetchGenreNames();
        setGenres(fetchedGenres);
        setChoosedGenres(fetchedGenres);
        settingQueryParameters();
        setBackdropPath(await fetchRandomBackgroundUrl('day'));
    }

    const fetchRandomBackgroundUrl = async (timeType) => {
        try {
            const backgroundFetch = await api.trends(timeType, 1);
            const backgroundPath = backgroundFetch.results[getRandomInteger(0, 19)].backdrop_path;
            return backgroundPath;
        } catch {
            return ''
        }
    }

    const settingQueryParameters = () => {
        const { queryAdult, queryPage, queryRequestValue } = getQueryParams(initialQueryParams);
        if (queryAdult === 'true') {
            setAdult(true);
        }
        if (queryPage) {
            setPage(Number(queryPage));
        }
        if (queryRequestValue) {
            setRequestValue(queryRequestValue);
        }
    }

    const getQueryParams = (queryParams) => {
        const queryAdult = queryParams.get('adult');
        const queryPage = queryParams.get('page');
        const queryRequestValue = queryParams.get('request');
        return { queryAdult, queryPage, queryRequestValue }
    }

    const updateHistoryQueryParams = (page, requestValue, adult) => {
        if (history.pushState) {
            const paramsObj = new URLSearchParams({
                page,
                adult,
            });
            if (requestValue !== '') {
                paramsObj.append('request', requestValue);
            }
            window.history.pushState('', '', `?${paramsObj}`);
        }
    }

    const fetchGenreNames = async () => {
        try {
            const json = await api.getGenres();
            const fetchedGenres = json.genres;
            const genresNames = fetchedGenres.map((genre) => genre.name);
            errors.genresFail = null
            return genresNames;
        } catch (e) {
            errors.genresFail = e.message;
        }
    }

    const fetchMovies = async () => {
        if (abort.current) {
            abort.current.abort();
        }
        abort.current = new AbortController();
        try {
            const fetchedMovies = requestValue
                ? await api.search(
                    requestValue,
                    page,
                    adult,
                    abort.current.signal
                )
                : await api.trends(
                    'day',
                    page,
                    abort.current.signal
                );
            setTotalPages(fetchedMovies.total_pages);
            setMovies(fetchedMovies.results);
            errors.moviesFail = null;
        } catch (e) {
            errors.moviesFail = e.message;
        }
        abort.current = null;
        setLoading(false);
    }

    const handleRequestChange = debounce((e) => {
        if (e.target.value.replace(/\s/g, '')) {
            setPage(1);
            setRequestValue(e.target.value);
        } else {
            setRequestValue('');
        }
    }, 300)

    const handlePageChange = (page) => {
        setPage(page);
    }

    const handleCheckboxChange = (e) => {
        const checkboxValue = e.target.value;
        if (checkboxValue === "adult") {
            setAdult(!adult);
        } else if (checkboxValue === "all") {
            chooseAllGenresOption();
        } else {
            if (choosedGenres.includes(checkboxValue)) {
                setChoosedGenres(choosedGenres.filter((genre) => genre !== checkboxValue));
            } else {
                setChoosedGenres([...choosedGenres, checkboxValue]);
            }
        }
        setPage(1);
    }

    const chooseAllGenresOption = () => {
        const allGenresChecked = areAllGenresChecked(genres, choosedGenres);
        if (allGenresChecked) {
            setChoosedGenres([]);
        } else {
            setChoosedGenres(genres)
        }
    }

    const defineMoviesContent = () => {
        if (loading) {
            return <Skeleton />
        }
        if (movies.length) {
            return <Movies movies={movies} />
        }
        if (!errors.moviesFail) {
            return <div className={styles.moviesNotFound}>
                Ничего не найдено
            </div>
        }
    }

    const areAllGenresChecked = (allGenres, choosedGenres) => {
        return allGenres.every((genre) => choosedGenres.includes(genre))
    }

    return (
        <>
            <Header
                backgroundPath={backgroundPath}
                changeRequest={handleRequestChange}
            />
            <main className={styles.main}>
                <div className={styles.filtersWrapper}>
                    {genres && errors.genresFail === null &&
                        <Filters
                            adult={adult}
                            onChange={handleCheckboxChange}
                            existingGenres={genres}
                            choosedGenres={choosedGenres}
                            allChecked={areAllGenresChecked(genres, choosedGenres)}
                        />
                    }
                    {errors.genresFail !== null && !loading && (
                        <Error
                            message={'Filters error'}
                            onClick={() => window.location.reload()}
                        />
                    )}
                </div>
                <div className={styles.wrapper}>
                    {errors.moviesFail === null && (
                        <Pagination
                            totalPages={totalPages}
                            page={page}
                            changePage={handlePageChange}
                        />
                    )}

                    {errors.moviesFail !== null && !loading && (
                        <Error
                            message={errors.moviesFail}
                            onClick={fetchMovies}
                        />
                    )}

                    {defineMoviesContent()}

                    {errors.moviesFail === null && (
                        <Pagination
                            totalPages={totalPages}
                            page={page}
                            changePage={handlePageChange}
                        />
                    )}
                </div>
                <div className={styles.bgwrapper}>
                    <div
                        className={styles.bg}
                        style={{
                            background: backgroundPath.length
                                ? `url(https://image.tmdb.org/t/p/original/${backgroundPath}`
                                : 'grey'
                        }}
                    />
                </div>
            </main>
            <Footer />
        </>
    )
}
