import styles from "./header.module.scss";
import { Link } from "react-router-dom";

export function Header({
    backgroundPath, changeRequest, type, value
}) {
    return (
        <header
            className={styles.header}
            style={{
                backgroundImage:
                    backgroundPath.length
                        ? `url(https://image.tmdb.org/t/p/original/${backgroundPath}`
                        : "none",
                transition: 'background-image 1s ease',
            }}
        >
            <Link to="/" className={styles.link}>
                <h1 className={styles.heading}>MOVIESEARCH</h1>
            </Link>
            {type !== 'moviePage' &&
                <form autoComplete="on">
                    <input
                        className={styles.input}
                        type="text"
                        id='searchInput'
                        name='title'
                        autoComplete="on"
                        placeholder='Search'
                        onChange={changeRequest}
                        defaultValue={value}
                    />
                </form>
            }

        </header>
    )
}