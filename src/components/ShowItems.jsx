import React from 'react'

const ShowItems = ({ title, items }) => {
  return (
    <div className='w-full'>
        <h4 className='text-center border-bottom'>{title}</h4>
        <div className='flex flex-col lg:flex-row gap-2 py-4 px-5 flex-wrap'>
            {items.map((item, index) => {
                return (
                    <p key={index * 55} className='flex flex-col p-2 text-center border'>{item}</p>
                )
            })}
        </div>
    </div>
  )
}

export default ShowItems