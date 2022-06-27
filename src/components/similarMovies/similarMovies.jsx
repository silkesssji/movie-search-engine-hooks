import styles from './similarMovies.module.scss'
import { Card } from '../card/card';
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export function SimilarMovies({
    movies
}) {
    return (
        <>
            <h2 className={styles.title}>
                Similar Movies
            </h2>
            <Carousel
                showThumbs={false}
                autoPlay={true}
                centerMode={true}
                infiniteLoop={true}
                interval={4000}
                centerSlidePercentage={22}
                selectedItem={3}
                emulateTouch={true}
                showIndicators={false}
                transitionTime={500}
                swipeScrollTolerance={1}
                width={1240}
                showStatus={false}
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
            </Carousel>

        </>
    )
}