// import React from 'react'
// import Header from './components/Header'
// import SectionComponent from './components/SectionComponent'
// import Footer from './components/Footer'
// import dashboard from './dashboard/page'
// import LoginPage from './(auth)/login/page'

// export default function Home() {
//   return (
//     <div >
//       {/* <Header />
//       <SectionComponent />
//       <Footer />
//       <LoginPage/> */}
//       <dashboard />
//     </div>
//   )
// }


// import React from 'react'
// import Header from './components/Header'
// import SectionComponent from './components/SectionComponent'
// export default function Home() {
//   return (
//     <div className="bg-white min-h-screen">
//       <Header />
//       <SectionComponent/>
//     </div>
//   );
// }

// import Header from './components/Header'
// export default function Home() {
//   return  <div>
//     <Header/>
//   </div>
// }

// import React from 'react'
// import Header from './components/Header'
// import SectionComponent from './components/SectionComponent'

// const page = () => {
//   return (
//     <div>
//       <Header/>
//       <SectionComponent/>
//     </div>
//   )
// }
// export default page


import { redirect } from "next/navigation";

export default function Home() {
    redirect("/dashboard");
}
