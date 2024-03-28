import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
const Layout=({children,isLogin}) => {
    
    return (
        <div>
            <Navbar isLogin/>
            {children}
            <Footer />
        </div>
    )
}

export default Layout
