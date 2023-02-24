import React from 'react'
import { listCollections } from '../constants'

function Collection() {
  return (
    <div className='max-w-[1200px] mx-auto my-10'>
        <div className='flex flex-wrap px-1'>
            {listCollections.map((list,index)=>(
                <a  
                    key={list.id}
                    className={`w-1/2 px-2 group relative`}>
                    <div className='overflow-hidden'>
                        <div style={{backgroundImage: `url(${list.link})`}}
                            className={`group bg-cover pb-[68%] bg-no-repeat  group-hover:scale-110 duration-500`}>
                        </div>
                    </div>
                    <div
                        className='absolute bg-white p-[20px] w-[60%] right-0 left-1/2 bottom-[20px] translate-x-[-50%] text-center font-bold                            '
                    >
                        <div>
                            {list.title}
                        </div>
                        <button className='bg-black text-white py-2 px-6 font-light mt-5'>
                            {list.button}
                        </button>
                    </div>
                </a>
            ))}
        </div>
    </div>
  )
}

export default Collection