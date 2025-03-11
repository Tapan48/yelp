import React from 'react'
import Header from '../components/header'

import Addrestaurant from '../components/addrestaurant'
import Restaurantlist from '../components/restaurantlist'

const Home = () => {
  return (
    <div>
      <Header/>
   <Addrestaurant />
   <Restaurantlist/>
    </div>
  )
}

export default Home
