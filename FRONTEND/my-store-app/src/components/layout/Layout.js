import React from "react";
import Nav from "../home/Nav";
// import Sidenav from "../layoutSidenav/Sidenav";
import SideNav from "./Sidenav";
import Footer from "./Footer";
import Header from "./Header";
import RouterS from "./RouterS";
import Search from "../home/Search";

function Layout(props) {
  if (props.headnavfoot) {
    return (
      <>
        <Header />
        <Nav />
        <Search /> 
        {props.children}
        <RouterS />
        <Footer />
      </>
    );
  } else if (props.sidebar) {
    return (
      <>
        <Header />
        <SideNav />
        <div style={{ marginLeft: "220px" }}>{props.children}</div>
        <RouterS />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <Nav />
        {props.children}
        <RouterS />
        <Footer />
      </>
    );
  }
}

export default Layout;

// import React from 'react';
// import Footer from '../Footer';
// import Header from '../Header';
// import Nav from '../home/Nav';

// const Layout = (props) => {
//     return (
//         <>
//             {props.headfoot ? (
//                 <>
//                     <Header />
//                     <div style={{ marginTop: '108px' }}>
//                         {props.children}
//                     </div>
//                     <Footer />
//                 </>
//             ) : (
//                 <>
//                     {props.children}
//                 </>

//             )
//             }
//         </>
//     );
// };

// export default Layout;
