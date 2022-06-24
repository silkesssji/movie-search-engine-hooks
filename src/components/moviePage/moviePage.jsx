import styles from "./moviePage.module.scss";
import { useParams, Link } from "react-router-dom";
import React from "react";

export const MoviePage = ({ }) => {
    let { id } = useParams();
    return (
        <div className={styles.wrapper}>
            Movie ID: {id}
            <Link to={`/${window.location.search}`}>
                Back
            </Link>
        </div>
    )
}