import React from 'react';
import styles from "./pagination.module.scss";
import cn from 'classnames';
import { generatePagination } from '../../lib/generatePagintaion';

export const Pagination = ({
    totalPages,
    page,
    changePage,
}) => {
    if (totalPages === 0) {
        return null;
    }

    return (
        <div className={styles.pagination}>
            <button
                type='button'
                disabled={page === 1}
                className={cn(styles.button, { [styles.disabled]: page === 1 })}
                onClick={() => changePage(page - 1)}
            >
                {'<'}
            </button>
            {generatePagination(page, totalPages, 9)
                .map((paginator, index) => paginator.type === "page" ? (
                    <button
                        key={index}
                        type="buton"
                        value={paginator.value}
                        className={cn(styles.button, {
                            [styles.current]: paginator.value === page
                        })}
                        onClick={() => changePage(paginator.value)}
                    >
                        {paginator.value}
                    </button>
                ) : (
                    <div key={index} className={styles.dots}>...</div>
                )
                )}
            <button
                type='button'
                disabled={totalPages === page}
                className={cn(
                    styles.button, { [styles.disabled]: page === totalPages }
                )}
                onClick={() => changePage(page + 1)}
            >
                {'>'}
            </button>
        </div>
    )
}
