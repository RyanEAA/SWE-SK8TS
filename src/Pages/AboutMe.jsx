import {Link} from 'react-router-dom'
import '../css/AboutMe.css'
function AboutMe(props) {

  return (
    <div class="container mt-5">
        <h1 class="text-center mb-4">About Me</h1>

        <div class="card-and-profile-image">
            <div class="headshot-container">
                <img src={props.profileimage} class="profile-image" alt="Wilson Flores"/>
            </div>
            <div class="card-container">
                    <h2 class="card-title">{props.name}</h2>
                    <p class="card-text lead">
                        {props.text}
                    </p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Location:</strong> Austin, TX</li>
                        <li class="list-group-item"><strong>Skills:</strong> Python, SQL</li>
                        <li class="list-group-item"><strong>Interests:</strong> Software Development, AI/Machine Learning</li>
                    </ul>
                    <a href="https://github.com/Wilsonf8" class="btn btn-primary mt-3">My GitHub Page</a>
            </div>
        </div>


        <div class="two-intrest-image-container">
            <div class="col-md-6 mb-5 text-center">
                <img src={props.interest1image} 
                     class="interest-image" alt="Wilson fishing"/>
                <div class="card w-75 mx-auto mt-4">
                    <div class="card-body">
                        <h5 class="card-title">{props.interest1}</h5>
                        <p class="card-text">{props.interest1desc}</p>
                    </div>
                </div>            
            </div>
            <div class="col-md-6 mb-5 text-center">
                <img src='https://www.motortrend.com/uploads/sites/5/2018/07/2019-Mercedes-AMG-C-63-S-Coupe-front-three-quarter-in-motion-07.jpg'
                     class="interest-image" alt="Car"/>
                <div class="card w-75 mx-auto mt-4">
                    <div class="card-body">
                        <h5 class="card-title">{props.interest2}</h5>
                        <p class="card-text">{props.interest2desc}</p>
                    </div>
                </div>            
            </div>
        </div>

    </div>
  )
}

export default AboutMe