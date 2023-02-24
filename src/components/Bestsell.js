import React, { useState } from 'react'
import {bestSell} from '../constants'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button onClick={onClick}
      className="absolute top-1/2 md:right-0 xl:right-[-40px] z-10">
      <i className="fa-solid fa-chevron-right"></i>
    </button>
  );
}
function SamplePrevArrow (props) {
  const { className, style, onClick } = props;
  return (
    <button onClick={onClick}
      className="absolute top-1/2 xl:left-[-40px] lg:left-0 z-10">
      <i className="fa-solid fa-chevron-left"></i>
    </button>
  );
}
function Bestsell() {
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow:<SamplePrevArrow />,
    nextArrow: <SampleNextArrow />
  };
  return (
    <div className='max-w-[1200px] mx-auto my-10 '>
      <div className=' text-center mb-10'>
          <h1 className='text-2xl font-bold'>BEST SELLING</h1>
          <p className='text-xs'>BEST SELLING ITEM OF THIS MONTH</p>
      </div>
      <div>
        <Slider {...settings}>
          {bestSell.map((sell,index)=>(
                  <a 
                    key={sell.id} 
                    className='p-4'>
                      <div
                        style={{backgroundImage: `url(${sell.link})`}}
                        className="group bg-contain bg-no-repeat pb-[130%] relative overflow-hidden"
                      >
                        <div
                        className='duration-500 absolute rounded group-hover:bottom-[10%] bottom-[-10%] left-1/3 h-[32px] w-[32px] bg-black text-white flex justify-center items-center'>
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
        </Slider>
      </div>
    </div>
  )
}

export default Bestsell