import React, { createContext, useContext, useState, useEffect } from 'react'
import {  Props } from '../constants'


const Context = createContext({})

export const StateContext = ({ children }: Props) => {
  // get the map values from the constant then pass to thecontext

  // more parameters that might be needed globally can also be passed in here

  const [profilePortfolioForm, setProfilePortfolioForm] = useState({})
  const [searchedSkills, setSearchedSkills] = useState<string[]>([])
  const [searchedServices, setSearchedServices] = useState<string[]>([])
  const [templateNav, setTemplateNav] = useState<string>('Homepage')
  const [indexPortfolio, setIndexPortfolio] = useState<number>(0)
  const [showModal, setShowModal] = React.useState(false)
  // const [projectTemplate3, setProjectTemplate3] = useState({})
  const [SeeMoreproject3Preview, setSeeMoreproject3Preview] = useState<string[]>([])
  const [goToSeeMoreProject, setGoToSeeMoreProject] = useState(false)
  const [getId, setGetId] = useState('')
  return (
    <Context.Provider
      value={{
        
        profilePortfolioForm,
        templateNav,
        searchedSkills,
        indexPortfolio,
        searchedServices,
        showModal,
        // projectTemplate3,
        setTemplateNav,
        setIndexPortfolio,
        setSearchedSkills,
        setSearchedServices,
        setProfilePortfolioForm,
        setShowModal,
        // setProjectTemplate3,
        setSeeMoreproject3Preview,
        SeeMoreproject3Preview,
        setGoToSeeMoreProject,
        goToSeeMoreProject,
        setGetId,
        getId,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
