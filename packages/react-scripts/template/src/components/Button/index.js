import React from 'react'
import styles from './Button.module.scss'

const Button = props => (
  <button {...props} className={styles.button} />
)

export default Button
