import React, { ReactNode } from 'react'
import style from "@/styles/Loading.module.css"

interface ILoadingProps {
  mark?: ReactNode | string
}

export default function Loading(props: ILoadingProps) {
  const { mark } = props;
  return (
    <div className='flex flex-col items-center'>
      <div className={style.loading}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      { mark ? <span className='my-3 text-2xl font-nasalization'>{mark}</span> : null }
    </div>
  )
}
