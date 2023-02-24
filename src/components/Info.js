import React from 'react'
import { listInfors } from '../constants'

function Info() {
  return (
    <div className='w-full bg-[#fafafa] py-10'>
        <div className='max-w-[1200px] mx-auto my-10 '>
            <div className=' text-center mb-10'>
                <h1 className='text-2xl font-bold'>FRESH FROM OUR BLOG</h1>
                <p className='text-xs'>You are going to love this amazing shopify theme.</p>
            </div>
            <div className='flex flex-wrap px-1'>
            {listInfors.map((list,index)=>(
                <a  
                    key={list.id}
                    className={`w-1/3 px-2 group relative`}>
                    <div className='overflow-hidden'>
                        <div style={{backgroundImage: `url(${list.link})`}}
                            className={`group bg-cover pb-[40%] bg-no-repeat  group-hover:opacity-80 duration-500`}>
                        </div>
                    </div>
                    <div className='text-center mt-4'>
                        <div className='font-bold hover:text-[#f77575] duration-200'>{list.title}</div>
                        <div className='font-light text-sm'>{list.des}</div>
                    </div>
                </a>
            ))}
        </div>
        </div>
    </div>
    
  )
}

export default Info