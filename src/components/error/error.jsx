import React from "react";
import styles from './error.module.scss'

export const Error = ({
    message, onClick
}) => {
    return (
        <div className={styles.errorMessage}>
            {message}
            <button className={styles.refreshButton} onClick={onClick}>
                Retry
            </button>
        </div>
    )
}