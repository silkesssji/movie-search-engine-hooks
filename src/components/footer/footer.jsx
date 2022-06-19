import React from 'react';
import styles from "./footer.module.scss";
import logo from '../../img/logo.svg';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.wrapper}>
                <a
                    className={styles.link}
                    href='https://www.themoviedb.org/'
                >
                    <img src={logo} alt="logo" width='200px' />
                </a>
                <a
                    className={styles.link}
                    href='https://github.com/silkesssji'
                >
                    Silkessji GitHub
                </a>
                <a
                    className={styles.link}
                    href='https://github.com/silkesssji/movie-search-engine'
                >
                    Repository
                </a>
                <a
                    className={styles.link}
                    href='https://www.themoviedb.org/'
                >
                    MovieDB
                </a>
            </div>
        </footer>
    )
}