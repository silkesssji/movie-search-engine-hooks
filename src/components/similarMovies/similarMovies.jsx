import styles from './similarMovies.module.scss'
import { Card } from '../card/card';
import { Link } from "react-router-dom";
import { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactSimplyCarousel from 'react-simply-carousel';

export function SimilarMovies({
    movies
}) {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    return (
        <>
            <h2 className={styles.title}>
                Similar Movies
            </h2>
            <ReactSimplyCarousel
                activeSlideIndex={activeSlideIndex}
                onRequestChange={setActiveSlideIndex}
                itemsToShow={1}
                itemsToScroll={1}
                responsiveProps={[
                    {
                        itemsToShow: 5,
                        itemsToScroll: 1,
                    },
                ]}
                speed={500}
                easing="ease"
                updateOnItemClick={true}
                forwardBtnProps={{
                    style: {
                        alignSelf: 'center',
                        background: 'black',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '20px',
                        height: 30,
                        lineHeight: 1,
                        textAlign: 'center',
                        width: 30,
                    },
                    children: <span>{`>`}</span>,
                }}
                backwardBtnProps={{
                    style: {
                        alignSelf: 'center',
                        background: 'black',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '20px',
                        height: 30,
                        lineHeight: 1,
                        textAlign: 'center',
                        width: 30,
                    },
                    children: <span>{`<`}</span>,
                }}
            >
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
                                <Card imageUrl={movie.poster_path} title={title} />
                            </Link>
                        )
                    }
                    )}
            </ReactSimplyCarousel>

        </>
    )
}