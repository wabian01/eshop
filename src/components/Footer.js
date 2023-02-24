import React from 'react'
import {logo,menu,close} from '../assets'

function Footer() {
  return (
    <div className='bg-[#fafafa] w-full'>
        <div className='max-w-[1200px] p-[20px] mx-auto'>
            <div className='flex justify-between flex-wrap '>
                <div className='p-[20px]'>
                    <div className='mb-4'>
                        <img src={logo} alt="logo eshop" className='h-[24px]'></img>    
                    </div>
                    <p className='mb-2'>55 Gallaxy Enque,<br/>2568 steet, 23568 NY</p>
                    <div>
                        <p className='mb-2'><b>Phone</b>:(440) 000 000 0000</p>
                        <p className='mb-2'><b>Email</b>:sales@yousite.com</p>
                    </div>
                    <div>
                        <i className="fa-brands fa-facebook-f p-2"></i>
                        <i className="fa-brands fa-twitter p-2"></i>
                        <i className="fa-brands fa-pinterest-p p-2"></i>
                        <i className="fa-brands fa-instagram p-2"></i>
                    </div>
                </div>
                <div className='p-[20px]'>
                    <div className='mb-4 font-bold'>
                        INFORMATION   
                    </div>
                    <div>
                            <ul>
                                <li>
                                    <a href="#"> About us</a>
                                </li>
                                <li>
                                    <a href="#">Contact Us</a>
                                </li>
                                <li>
                                    <a href="#">Career</a>
                                </li>
                                <li>
                                    <a href="#">My Account</a>
                                </li>
                                <li>
                                    <a href="#">Orders and Returns</a>
                                </li>
                            </ul>
                    </div>
                </div>
                <div className='p-[20px]'>
                    <div className='mb-4 font-bold'>
                        QUICK SHOP   
                    </div>
                    <div>
                            <ul>
                                <li>
                                    <a href="#"> Fashion</a>
                                </li>
                                <li>
                                    <a href="#">Men</a>
                                </li>
                                <li>
                                    <a href="#">Furniture</a>
                                </li>
                                <li>
                                    <a href="#">Home Decor</a>
                                </li>
                                <li>
                                    <a href="#">Shoes</a>
                                </li>
                            </ul>
                    </div>
                </div>
                <div className='p-[20px]'>
                    <div className='mb-4 font-bold'>
                        CUSTOMER SERVICES
                    </div>
                    <div>
                            <ul>
                                <li>
                                    <a href="#"> Help & FAQs</a>
                                </li>
                                <li>
                                    <a href="#">Returns Policy</a>
                                </li>
                                <li>
                                    <a href="#">Terms & Conditions</a>
                                </li>
                                <li>
                                    <a href="#">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="#">Support Center</a>
                                </li>
                            </ul>
                    </div>
                </div>
                <div className='p-[20px] max-w-[450px] w-1/5'>
                    <div className='mb-4 font-bold'>
                        NEWSLETTER
                    </div>
                    <div>
                        <p>Enter your email to receive daily news and get 20% off coupon for all items.</p>
                        <input placeholder='Email address' className='border-0	px-2 my-2'></input>
                        <button className='py-2 px-4 bg-black text-white'>Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer