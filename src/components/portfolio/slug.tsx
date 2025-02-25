import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/stateContext';
import image404 from '../../assets/404.svg'


import { Oval } from 'react-loading-icons';
import { getUsersPortfolioFormDetailsSlug } from '../../api/portfolioAPI';
import Minimal from './templates/minimal';

function Slug() {
  const [isLoading, setIsLoading] = useState(true);
  const { profilePortfolioForm,setProfilePortfolioForm }: any = useStateContext()
  const getPorfolioData = async (title:string) => {
    try {
      const portfolioForm=await getUsersPortfolioFormDetailsSlug(title);
   
    await setProfilePortfolioForm(portfolioForm);
    setIsLoading(false);
    } catch (error) {
      console.log(error, 'nav error')
    }
  }
  useEffect(() => {
    console.log(window.location.pathname.slice(1));
    getPorfolioData(window.location.pathname.slice(1));
  }, [])
  

  return (
    <div className='w-full h-full'>{isLoading?<div className='h-screen flex justify-center items-center'><Oval stroke="#fff" width={24} height={24} /> </div>:!isLoading&&profilePortfolioForm==null?<div className='h-screen flex justify-center items-center'> <img src={image404} alt='404 image' width={400} /></div>:<Minimal
    aboutMe={profilePortfolioForm?.aboutMe}
    skills={profilePortfolioForm?.skills}
    tools={profilePortfolioForm?.tools}
    projects={profilePortfolioForm?.projects}
    contact={profilePortfolioForm?.contact}
    resume={profilePortfolioForm?.resume}
    websiteTitle={profilePortfolioForm?.websiteTitle}
    fullName={profilePortfolioForm?.fullName}
    yearsOfExperience={profilePortfolioForm?.yearsOfExperience}
    ></Minimal>}</div>
  )
}


export default Slug