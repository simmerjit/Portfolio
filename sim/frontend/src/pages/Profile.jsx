import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Tech from "../components/Tech"
import Projects from "../components/Projects"
import Contact from '../components/Contact'

const Profile = () => {
  return (
    <>
    <div className='overflow-x-hidden min-h-screen'> 
        <div className='fixed inset-0 -z-10 bg-black'>
            <div className="relative h-[200vh] w-full bg-black">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
              <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
            </div>
        </div>

        <div className='relative'>
          <Navbar/>
          <Hero/>
          <Tech/>
          <Projects/>
          <Contact/>
        </div>
    </div>
    </>
  )
}

export default Profile
