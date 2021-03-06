import cn from 'classnames';
import styles from "./checkbox.module.scss";

export function Checkbox({
    id,
    label,
    checked,
    value,
    onChange
}) {
    return (
        <label
            className={cn(styles.checkbox, {
                [styles.checkbox_all]: value === 'all',
                [styles.checkbox_checked]: checked
            })
            }>
            <input className={styles.input}
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                value={value}
            />
            <span className={styles.content} />
            {label}
        </label>
    )
}