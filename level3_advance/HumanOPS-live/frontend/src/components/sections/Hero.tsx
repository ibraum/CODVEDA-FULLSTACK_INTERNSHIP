import React from 'react'

const Hero = () => {
  return (
    <>
      <div className="w-full h-screen bg-[url('/src/assets/hero-bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="max-w-[700px] w-full h-full mx-auto flex items-center justify-center">
          <div className="font-inter text-8xl font-bold text-white mt-10">HumanOps-Live</div>
        </div>
      </div>
    </>
  )
}

export default Hero