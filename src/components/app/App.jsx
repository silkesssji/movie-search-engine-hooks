import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams } from "react-router-dom";


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

const getQueryParams = (queryParams) => {
    const queryAdult = queryParams.get('adult');
    const queryPage = queryParams.get('page');
    const queryRequestValue = queryParams.get('request');
    return { queryAdult, queryPage, queryRequestValue }
}

export function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { queryAdult, queryPage, queryRequestValue } = getQueryParams(searchParams);

    const [movies, setMovies] = useState([]);

    const [filteredMovies, setFilteredMovies] = useState([]);

    const [page, setPage] = useState(
        queryPage ? Number(queryPage) : 1
    );
    const [backgroundPath, setBackdropPath] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [errors, setErrors] = useState({
        moviesFail: null,
        genresFail: null
    });
    const [loading, setLoading] = useState(true);
    const [choosedGenres, setChoosedGenres] = useState([]);
    const [requestValue, setRequestValue] = useState(
        Boolean(queryRequestValue) ? queryRequestValue : ''
    );
    const [adult, setAdult] = useState(
        queryAdult === 'true' ? true : false
    );
    const [genres, setGenres] = useState([]);
    const abort = useRef(null);


    useEffect(() => {
        (async () => {
            const fetchedGenres = fetchGenreNames();
            const backdrop = fetchRandomBackgroundUrl('day');
            await Promise.all([fetchedGenres, backdrop]);
            setBackdropPath(await backdrop);
            setGenres(await fetchedGenres);
        })();
        fetchMovies();
    }, [])

    useEffect(() => {
        setFilteredMovies(choosedGenres.length ? (
            movies.filter((movie) => movie.genre_ids.some(id => choosedGenres.map(genre => genre.id).includes(Number(id))))) : (
            movies))
    }, [movies])

    useEffect(() => {
        (async () => {
            if (genres.length) {
                setQueryGenres();
            }
        })();
    }, [genres])

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (genres.length) {
                updateHistoryQueryParams(page, requestValue, adult, choosedGenres);
            }
            await fetchMovies();
            setLoading(false);
        })()
    }, [page, requestValue, adult, choosedGenres])

    const getQueryGenres = () => {
        const queryGenres = searchParams.get('genresIds') ? searchParams.get('genresIds') : '';
        if (queryGenres.length) {
            return queryGenres.split(',');
        } else {
            return []
        }
    }

    const setQueryGenres = () => {
        const queryGenres = getQueryGenres();
        const numberedGenres = queryGenres.map(genre => Number(genre));
        if (queryGenres) {
            const checkedGenres = genres.filter((genre) => numberedGenres.includes(Number(genre.id)));
            setChoosedGenres(checkedGenres)
        } else {
            setChoosedGenres([...genres])
        }
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

    const updateHistoryQueryParams = (page, requestValue, adult, choosedGenres) => {
        const genresIds = choosedGenres.map((genre) => genre.id);
        const paramsObj = new URLSearchParams({
            page,
            adult,
            genresIds
        });
        if (requestValue !== '') {
            paramsObj.append('request', requestValue);
        }
        setSearchParams(paramsObj);
    }

    const fetchGenreNames = async () => {
        try {
            const json = await api.getGenres();
            const fetchedGenres = json.genres;
            setErrors({ ...errors, genresFail: null });
            return fetchedGenres;
        } catch (e) {
            setErrors({ ...errors, genresFail: e.message })
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

            setErrors({ ...errors, moviesFail: null })
        } catch (e) {
            if (e.message !== 'The user aborted a request.') {
                setErrors({ ...errors, moviesFail: e.message })
                setMovies([]);
            }
        }
        abort.current = null;
    }

    const handleRequestChange = useCallback(
        debounce((e) => {
            if (e.target.value.replace(/\s/g, '')) {
                setPage(1);
                setRequestValue(e.target.value);
            } else {
                setRequestValue('');
            }
        }, 300), []
    )

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
            const numberedGenre = Number(checkboxValue);
            const numberedChoosedGenres = choosedGenres.map(genre => genre.id)
            if (numberedChoosedGenres.includes(numberedGenre)) {
                setChoosedGenres(choosedGenres.filter((genre) => genre.id !== numberedGenre));
            } else {
                setChoosedGenres([...choosedGenres, ...genres.filter((genre) => genre.id === numberedGenre)]);
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

    const filterOption = () => {

    }

    const content = useMemo(() => {
        if (loading) {
            return <Skeleton />
        }
        if (filteredMovies.length) {
            return <div className={styles.cardWrapper}>
                <Movies
                    movies={filteredMovies} />
            </div>
        }
        if (!errors.moviesFail) {
            return <div className={styles.moviesNotFound}>
                Ничего не найдено
            </div>
        }
    }, [filteredMovies, loading, errors]);

    const areAllGenresChecked = (allGenres, choosedGenres) => {
        return allGenres.every((genre) => choosedGenres.includes(genre))
    }

    return (
        <>
            <Header
                backgroundPath={backgroundPath}
                changeRequest={handleRequestChange}
                value={requestValue}
            />
            <main className={styles.main}>
                <div className={styles.appWrapper}>
                    <div className={styles.filtersWrapper}>
                        {!errors.genresFail && !genres.length &&
                            <div className={styles.loadFilters} />
                        }
                        {genres.length && !errors.genresFail &&
                            <Filters
                                adult={adult}
                                onChange={handleCheckboxChange}
                                existingGenres={genres}
                                choosedGenres={choosedGenres}
                                allChecked={areAllGenresChecked(genres, choosedGenres)}
                            />
                        }
                        {errors.genresFail && !loading && (
                            <Error
                                message={'Filters error'}
                                onClick={() => window.location.reload()}
                            />
                        )}
                    </div>
                    <div className={styles.movieWrapper}>
                        {loading && !errors.moviesFail && !Boolean(totalPages) && <div className={styles.loadPagination} />}
                        {!errors.moviesFail && Boolean(totalPages) && (
                            <Pagination
                                totalPages={totalPages}
                                page={page}
                                changePage={handlePageChange}
                            />
                        )}
                        {errors.moviesFail && !loading && (
                            <Error
                                message={errors.moviesFail}
                                onClick={fetchMovies}
                            />
                        )}
                        {content}
                        {loading && !errors.moviesFail && !Boolean(totalPages) && <div className={styles.loadPagination} />}
                        {!errors.moviesFail && Boolean(totalPages) && (
                            <Pagination
                                totalPages={totalPages}
                                page={page}
                                changePage={handlePageChange}
                            />
                        )}
                    </div>
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
