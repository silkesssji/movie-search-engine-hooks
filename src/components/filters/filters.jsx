import React from 'react';
import styles from './filters.module.scss';
import { Checkbox } from '../checkbox/checkbox';

export const Filters = ({
    adult,
    onChange,
    existingGenres,
    choosedGenres,
    allChecked,
}) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>
                Adult
            </h2>
            <Checkbox id='checkboxFilterPanel1'
                label="Adult"
                checked={adult}
                value="adult"
                onChange={onChange}
            />
            <h2 className={styles.heading}>
                Genres
            </h2>
            <Checkbox id='checkboxAllFilters'
                label='All Genres'
                checked={allChecked}
                value='all'
                onChange={onChange}
            />
            {existingGenres && existingGenres.map((genre, index) =>
                <Checkbox id={`checkbox${index}`}
                    key={index}
                    label={genre}
                    checked={choosedGenres.includes(genre)}
                    value={genre}
                    onChange={onChange}
                />
            )}
        </div>
    )
}