import React from 'react'

function Shipper() {
  return (
    <div className='bg-black w-full text-white'>
        <div className='max-w-[1200px] p-[20px] mx-auto'>
            <div className='flex justify-between flex-wrap'>
                <div className='flex justify-center items-center p-[20px]'>
                    <i className="fa-solid fa-truck-arrow-right text-[40px] pr-2"></i>
                    <div>
                        <div className='font-bold'>FREE SHIPPING & RETURN</div>
                        <div className='text-xs	'>Free shipping on all US orders</div>
                    </div>
                </div>
                <div className='flex justify-center items-center p-[20px]'>
                    <i className="fa-solid fa-money-check-dollar text-[40px] pr-2"></i>
                    <div>
                        <div className='font-bold'>MONEY GAURNTEE</div>
                        <div className='text-xs	'>30 days money back guarantee</div>
                    </div>
                </div>
                <div className='flex justify-center items-center p-[20px]'>
                    <i className="fa-solid fa-phone-volume text-[40px] pr-2"></i>
                    <div>
                        <div className='font-bold'>ONLINE SUPPORT</div>
                        <div className='text-xs	'>We support online 24/7 on day</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Shipper