import styles from './error.module.scss'

export function Error({
    message, onClick
}) {
    return (
        <div className={styles.errorMessage}>
            {message}
            <button className={styles.refreshButton} onClick={onClick}>
                Retry
            </button>
        </div>
    )
}