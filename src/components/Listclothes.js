import React from 'react'
import {listClothes} from '../constants'


function Listclothes() {
  return (
    <div className='w-full flex jutify-center p-5'>
        {listClothes.map((list,index)=>(
          <a
            key={list.id}
            className={`w-1/3 ${listClothes.length - 1 === index ? 'mr-0' : 'mr-4'}`}
            href=""
          >
            {/* <div 
            style={{backgroundImage: `url(${list.link})`}}
            className={` bg-contain bg-no-repeat pb-[125%] `}>

            </div> */}
            <div
              className='overflow-hidden'
            >
              <img src={list.link} className={`object-cover w-full hover:scale-110`}></img>
            </div>
            
            <h3
              className='text-center'
            >
              {list.title}
            </h3>
          </a>
        ))}
        
    </div>
  )
}

export default Listclothes