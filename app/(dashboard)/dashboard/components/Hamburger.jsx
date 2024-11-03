'use client'
import React, { useEffect } from 'react'

const Hamburger = ({handleButtonClick}) => {
//   useEffect(() => {
//     const element = document.getElementById("fixedElement");

//     const toggleBackgroundColor = () => {
//       const scrollPosition = window.scrollY;
//       if (scrollPosition > 0) {
//           element.classList.remove("bg-transparent");
//           element.classList.add("bg-white", "shadow-xl");
//       } else {
//           element.classList.remove("bg-white", "shadow-xl");
//           element.classList.add("bg-transparent");
        
//       }
//     };

//     toggleBackgroundColor();
    
//     const handleScroll = () => {
//       toggleBackgroundColor();
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

  return (
    <div id="fixedElement"
      className="md:ml-260 px-46 z-100 fixed top-0 right-0 left-0 flex justify-between items-center pt-16 pb-24">
      <div className="sidebar-button cursor-pointer" onClick={handleButtonClick}>
        <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Burger">
            <path id="Vector 148" d="M17.5 1.28125L1.5 1.28125" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            <path id="Vector 149" d="M17.5 7.28125L1.5 7.28125" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            <path id="Vector 150" d="M17.5 13.2812L1.5 13.2813" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </svg>

      </div>


      <input type="checkbox" id="darkmode-toggle" className="toggle-checkbox invisible" />
    </div>
  )
}

export default Hamburger