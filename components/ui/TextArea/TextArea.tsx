import cn from 'classnames'
import s from './TextArea.module.css'
import React, { InputHTMLAttributes } from 'react'

export interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  onChange?: (...args: any[]) => any
  rows?: number
}

const TextArea: React.FC<Props> = (props) => {
  const { className, children, onChange, ...rest } = props

  const rootClassName = cn(s.root, {}, className)

  const handleOnChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value)
    }
    return null
  }

  return (
    <label>
      <textarea
        className={rootClassName}
        onChange={handleOnChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        rows={4}
        {...rest}
      />
    </label>
  )
}

export default TextArea
