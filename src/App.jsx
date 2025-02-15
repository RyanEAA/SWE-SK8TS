import React, { useState, useEffect } from 'react'; 
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar.jsx'
import ProductBox from './Components/ProductBox.jsx'
import Catelog from './Pages/Catelog.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import Footer from './Components/Footer.jsx';
import AboutMe from './Pages/AboutMe.jsx'
import Home from './Pages/Home.jsx'
import ProductInfo from './Pages/ProductInfo.jsx'
import Cart from './Pages/Cart.jsx'
import { PRODUCTS } from './Products.js';


// import './App.css'
// import { CartObjectProvider } from './Components/CartObject.jsx';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]); // Store fetched products

  // Fetch products from API
  useEffect(() => {
    fetch('http://167.71.25.102:3636/products/')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.product_id === product.product_id);
    if (exist){
      setCartItems(cartItems.map((x) =>
        x.product_id === product.product_id ? { ...exist, qty: exist.qty + 1 } : x));
    }
    else{
      setCartItems([...cartItems, {...product, qty:1}])
    }
  }
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.product_id === product.product_id);
    if (exist.qty == 1) {
      setCartItems(cartItems.filter((x) => x.product_id !== product.product_id));
    } 
    else{
      setCartItems(cartItems.map((x) => x.product_id === product.product_id ? { ...exist, qty: exist.qty - 1 } : x));
    }
  }

  return (
    <>
      {/* <CartObjectProvider> */}
      <NavBar cartItems={cartItems} />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/Shop' element={<Catelog onAdd={onAdd}/>}/>
          <Route path='/Contact'/>
          <Route path='/AboutUs' element={<AboutUs />}/>
          <Route path='/Cart' element={<Cart cartItems={cartItems} onAdd={onAdd} onRemove={onRemove}/>}/>
          <Route path='/ProductInfo/:id' element={<ProductInfo onAdd={onAdd}/>}/>

          <Route path='AboutUs/wilson' element={<AboutMe 
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
            interest1image='/Images/ryan_interest.jpeg' 
            profileimage='/Images/ryan.jpeg' 
            name='Ryan Aparicio' 
            text="CS Major at St. Ed's that loves data. Not only am I a First-Gen student, I am the VP of the AI Club, and the Treasurer of the First Gen Scholars. In my free time I skate, do some 3D modeling, and play video games. I hope to learn about frameworks in this class."
            interest1desc="This is the classic 3D modeled donut. It represents the beginning of every modeler's journey."
            interest2desc="This is the classic 3D modeled donut. It represents the beginning of every modeler's journey."

            />}/>
          <Route path='AboutUs/eli' element={<AboutMe 
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
        </Routes>
        <Footer />
      {/* </CartObjectProvider> */}
    </>
  )
}

export default App
