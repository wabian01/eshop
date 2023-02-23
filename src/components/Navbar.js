import React from 'react'
import {useState} from 'react'
import {logo,menu,close} from '../assets'
import {navLinks} from '../constants'

function Navbar(props) {
    const [toggle, setToggle] = useState(false)
    return (
        <div className="w-full flex items-center m-0 my-0 mx-auto max-w-[1400px] px-[15px] py-0 h-[50px]" >
             <div className="lg:hidden flex  justify-start items-center flex-1">
                <div>
                    <img 
                        src={toggle ? close : menu} 
                        alt="menu"
                        className="w-[28px] h-[28px] object-contain	"
                        onClick={()=>setToggle((prev)=>!prev)}
                    />
                </div>
                
                <div className={`${toggle ? 'flex' : 'hidden'}  w-3/4 h-full absolute top-10 left-0 w-[270px] shadow-md bg-white`}>
                    <ul className="list-none flex flex-1 flex-col  ml-5">
                        {navLinks.map((nav,index)=>(
                            <li
                                key={nav.id}
                                className={`font-poppins font-normal cursor-pointer test-[16px] ${navLinks.length - 1 === index ? 'mb-0' : 'mb-5'} border-b w-full`}
                            >
                                <a href={`#${nav.id}`}>{nav.title}</a>  

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <a href="" className="text-black size-14 max-w-[170px] min-w-[100px] flex-1">
                <img src={logo}  alt="Alone" className="w-[70px] h-[32px] "/>
            </a>  
            <ul className="list-none lg:flex hidden justify-center">
                {navLinks.map((nav,index)=>(
                    <li
                        key={nav.id}
                        className={`font-poppins hover:text-[#f77575] font-normal cursor-pointer test-[16px] ${navLinks.length - 1 === index ? 'mr-0' : 'mr-10'}`}
                    >
                        <a href={`#${nav.id}`}>{nav.title}</a>  

                    </li>
                ))}
            </ul>
            <div className="flex justify-end text-black flex-1 ">
                <a href="" className="px-[9px] py-0">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </a>
                <a href="" className="px-[9px] py-0">
                    <i className="fa-solid fa-gear"></i>
                </a>
                <a href="" className="px-[9px] py-0">
                    <i className="fa-regular fa-heart"></i>
                </a>
                <a href="" className="px-[9px] py-0">
                    <i className="fa-solid fa-bag-shopping"></i>
                </a>
            </div>

           
        </div>

        
    )
}

export default Navbar

