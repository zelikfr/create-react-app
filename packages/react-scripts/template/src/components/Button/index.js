import React from 'react'
import styles from './styles.scss'

const Button = props => (
    <button {...props} className={styles.button} />
)

export default Button