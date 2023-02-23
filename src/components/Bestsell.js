import React from 'react'
import {bestSell} from '../constants'

function Bestsell() {
  return (
    <div className='max-w-[1200px] mx-auto my-10 '>
      <div className=' text-center mb-10'>
          <h1 className='text-2xl font-bold'>BEST SELLING</h1>
          <p className='text-xs'>BEST SELLING ITEM OF THIS MONTH</p>
      </div>
      <div className='w-full flex justify-center items-center'>
        <button>
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        {bestSell.map((sell,index)=>(
            <a 
              key={sell.id} 
              className={`w-1/4 ${bestSell.length - 1 === index ? 'mr-0' : 'mr-4'}`}>
                <div
                  style={{backgroundImage: `url(${sell.link})`}}
                  className="showitem bg-contain bg-no-repeat pb-[130%] relative"
                >
                  <div
                  className='absolute rounded opacity-0 showitem-hover:opacity-100 bottom-[10%] left-1/3 h-[32px] w-[32px] bg-black text-white flex justify-center items-center'>
                    <i className="fa-regular fa-heart"></i>
                  </div>
                  
                </div>
                <div
                  className='text-center text-xs'>
                    <div>
                      {sell.title}
                    </div>
                    <div className='font-bold'>
                      {sell.cost}
                    </div>
                </div>
            </a>
            
        ))}
        <button>
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}

export default Bestsell