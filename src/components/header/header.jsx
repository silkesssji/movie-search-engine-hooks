import React from 'react';
import styles from "./header.module.scss";

export const Header = ({
    backgroundPath, changeRequest
}) => {
    return (
        <header
            className={styles.header}
            style={{
                background:
                    backgroundPath.length
                        ? `url(https://image.tmdb.org/t/p/original/${backgroundPath}`
                        : "gray",
                transition: 'background-image 1s ease',
            }}
        >
            <h1 className={styles.heading}>MOVIESEARCH</h1>
            <form autoComplete="on">
                <input
                    className={styles.input}
                    type="search"
                    id='searchInput'
                    name='title'
                    autoComplete="on"
                    placeholder='Search'
                    onChange={changeRequest}
                />
            </form>
        </header>
    )
}