const Hero = () => {
  return (
    <>
      <div className="w-full h-screen bg-[url('/src/assets/hero-bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="max-w-[900px] w-full h-full mx-auto flex flex-col items-center justify-end pb-30 gap-5">
          <div className="dm-sans-medium md:text-8xl text-4xl font-bold mt-50 text-center text-transparent bg-clip-text bg-[linear-gradient(-150deg,white,white,#7a7a7a)]">
            Operational people management for modern teams
          </div>
          <div className="md:text-xl text-lg dm-sans-medium text-white text-center">HumanOps Live connects people, skills, and operations in one intelligent system.</div>
          <div className="mt-4">
            <button className="dm-sans-medium md:text-xl text-sm text-black bg-white md:px-10 px-5 md:py-4 py-2 rounded-full hover:shadow-md hover:shadow-white/40 duration-300 cursor-pointer">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
