// App. jsx

import React, { useState, useEffect } from 'react'; 


import { Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar.jsx';
import Catelog from './Pages/Catelog.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import Footer from './Components/Footer.jsx';
import Home from './Pages/Home.jsx';
import ProductInfo from './Pages/ProductInfo.jsx';
import Cart from './Pages/Cart.jsx';
import RegistrationPage from './Pages/RegistrationPage.jsx';
import Contact from './Pages/Contact.jsx'
import LoginPage from './Pages/LoginPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import AboutMe from './Pages/AboutMe.jsx';
import ChatBot from "react-chatbotify";
import OrderDashboard from './Pages/OrderDashboard.jsx';
import { flow, settings, styles } from "./Components/Chatbot/chatbotConfig.js";
import OllieChatBot from './Components/Chatbot/OllieChatBot.jsx';
import UserManagement from './Pages/UserManagement.jsx';
import ProductManagement from './Pages/ProductManagement.jsx';



function App() {

  return (
    <>
    <OllieChatBot />
      <NavBar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/Shop' element={<Catelog/>}/>
          <Route path='/Contact' element={<Contact/>}/> 
          <Route path='/AboutUs' element={<AboutUs />}/>
          <Route path='/Cart' element={<Cart/>}/>
          <Route path='/ProductInfo/:id' element={<ProductInfo/>}/>
          <Route path='/Registration' element={<RegistrationPage />}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/OrderDashboard" element={<OrderDashboard />} />
          <Route path='AboutUs/wilson' element={<AboutMe 
            location='Austin, TX'
            skills='Python, SQL'
            interests='Software Development, AI/Machine Learning'
            github='https://github.com/Wilsonf8'
            webimage='https://www.motortrend.com/uploads/sites/5/2018/07/2019-Mercedes-AMG-C-63-S-Coupe-front-three-quarter-in-motion-07.jpg'
            interest1image='/Images/wilson-fish.png' 
            profileimage='/Images/wilson.jpeg' 
            name='Wilson Flores' 
            text="Hi, I'm a junior studying computer science at St. Edward's University. My intrests in computer science includes Software devolopment and Machine Learning. In this class, I hope to improve my frontend development skills."
            interest1desc="I enjoy bass fishing on my jon boat"
            interest1='Fishing'
            interest2desc="I have always enjoyed learning about cars"
            interest2='Cars'
            />}/>
          <Route path='AboutUs/ryan' element={<AboutMe 
            location='Austin, TX'
            skills='Python, JS, SQL, AI'
            interests='AI, Video Games'
            github='https://github.com/RyanEAA'
            linkedin="https://www.linkedin.com/in/ryan-aparicio-547586220/"
            webimage='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgPOjfOFnNZ3wKKpcza6PG_PEPgslvkrvXew&s'
            interest1image='/Images/ryan_interest.jpeg' 
            profileimage='/Images/ryan.jpeg' 
            name='Ryan Aparicio' 
            text="I'm a CS Major at St. Ed's that loves data. Not only am I a First-Gen student, I am the VP of the AI Club, and the Treasurer of the First Gen Scholars. In my free time I skate, do some 3D modeling, and play video games. I hope to learn about frameworks in this class."
            interest1desc="This is the classic 3D modeled donut. It represents the beginning of every modeler's journey."
            interest2desc="This is the classic 3D modeled donut. It represents the beginning of every modeler's journey."

            />}/>
          <Route path='AboutUs/eli' element={<AboutMe 
            location='Austin, TX'
            skills='Web Application Development, Database Management'
            interests='Computer Hardware, Datacenter Management'
            github='https://github.com/eligulley1'
            webimage='https://cdn.theatlantic.com/thumbor/a6EwtLDytq2ywOXRkaAXnVnhgNM=/547x0:1953x1406/1080x1080/media/img/mt/2021/08/AP21134273144946/original.jpg'
            interest1image='/Images/eli-interest.webp' 
            profileimage='/Images/eli.jpg' 
            name='Eli Gulley' 
            text="I am an undergraduate Computer Science student working to get my Bachelor's in Science at St. Edward's University in Austin, Texas. I have experience in Web Development, Mobile Programming, Database Management, and Computer Hardware. However, I have not had any experience managing any full-stack applications, such as the one we will be developing for this project. Over the course of the project, I hope to gain more database experiecne, develop a more confident knowledge base in frontent development, as well as project management. I am also looking forward to the experience I will gain in server management, as deploying full-stack applications on a remote server is something I am unfamiliar with. Overall, I am looking forward to the ways this projcet will both hone my existing skills, as well as allow me to learn and understand new tools and applications."
            interest1desc="I've always had fun tinkering and working with electronics or other projects, and building or working on personal computers seems to be the best way to fulfill this for me."
            interest1='Computer Hardware'
            interest2desc="Skateboarding is something that I make time for almost daily, as a sort of meditation. Cruising around campus is incredibly relaxing for me."
            interest2='Skateboarding'

            />}/>
          <Route path='AboutUs/william' element={<AboutMe 
            location='Austin, TX'
            skills='Programming, math, music, and problem solving'
            interests='Skateboarding, art, music, and more...'
            github='https://github.com/willburgessiii'
            webimage='https://source.boomplaymusic.com/group10/M00/03/23/040f13159c864fe19577f9e8acf2589c_464_464.webp'
            interest1image='/Images/willInterest.jpg' 
            profileimage='/Images/william.jpeg' 
            name='William Burgess' 
            text="I'm a student at St. Edward's university studying computer science! I aspire to be a software developer who specializes in audio software. I love creating music with digital audio workstations. I have experienve with Python, Java, JS, and am learning C and various frameworks. Through this project I aim to sharpen my in-industry software development skills."
            interest1desc="A glimpse into my passion of skateboarding"
            interest1='Skateboarding'
            interest2desc="Art created by Will Burgess for Will Burgess' single 'Parameters'"
            interest2='Art'

            />}/>
            

          <Route path='AboutUs/john' element={<AboutMe 
            location='Software Development, Music'
            skills='Object Oriented Programming, Problem Solving'
            interests='Software Development, Music'
            github='https://github.com/JVMull'
            webimage='https://irepo.primecp.com/2024/10/591060/1727794855_187593_Large600_ID-5698221.jpg?v=5698221'
            interest1image='/Images/piano.png' 
            profileimage='/Images/john.jpeg' 
            name='John Vazquez' 
            text="I'm a Senior Computer Science student at St. Edward's University. I am interested in learning more about the field of computer science and the tech field. I am experienced in multiple programming languages and with the agile methodology. I hope to learn more about the development process and documentation through the course of this project."
            interest1desc="I have always loved playing instruments and I'm currently learning to play the piano"
            interest1='Piano'
            interest2desc="I have done crochet projects in the past and enjoy doing it occasionally"
            interest2='Crochet'

            />}/>
          <Route path='*' element={<div>404 - Page Not Found</div>} />
          <Route path='/UserManagement' element={<UserManagement />} />
          <Route path='/ProductManagement' element={<ProductManagement />} />
        </Routes>
        <Footer />
      {/* </CartObjectProvider> */}
    </>
  );
}

export default App

