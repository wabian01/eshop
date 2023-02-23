import React from 'react'
import {listPanels} from '../constants'

function Panel() {
  return (
    <div className='bg-black '>
        <ul className="list-none flex justify-center w-full mx-auto my-0 ml-5 h-[50px] items-center animate-wiggle whitespace-nowrap overflow-x-hidden">
            {listPanels.map((panel,index)=>(
                <li
                    key={panel.id}
                    className="text-white flex justify-center mr-10  text-[12px]"
                >
                    {panel.title}
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Panel