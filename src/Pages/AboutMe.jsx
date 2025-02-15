import {Link} from 'react-router-dom'
import '../css/AboutMe.css'
function AboutMe(props) {

  return (
    <div className="container mt-5">
        <h1 className="about-me-text">About Me</h1>

        <div class="card-and-profile-image">
            <div className="headshot-container">
                <img src={props.profileimage} class="profile-image" alt="Wilson Flores"/>
            </div>
            <div className="card-container">
                    <h2 className="card-title">{props.name}</h2>
                    <p class="card-text lead">
                        {props.text}
                    </p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Location:</strong> {props.location}</li>
                        <li class="list-group-item"><strong>Skills:</strong> {props.skills}</li>
                        <li class="list-group-item"><strong>Interests:</strong> {props.interests}</li>
                    </ul>
                    <a href={props.github} className="github-button">My GitHub Page</a>
            </div>
        </div>


        <div class="two-intrest-image-container">
            <div class="col-md-6 mb-5 text-center">
                <img src={props.interest1image} 
                     class="interest-image" alt="Wilson fishing"/>
                <div class="card w-75 mx-auto mt-4">
                    <div class="interest-card">
                        <h5 class="card-title">{props.interest1}</h5>
                        <p class="intrests-desc">{props.interest1desc}</p>
                    </div>
                </div>            
            </div>
            <div class="col-md-6 mb-5 text-center">
                <img src={props.webimage}
                     class="interest-image" alt="Web Image"/>
                <div class="card w-75 mx-auto mt-4">
                    <div class="interest-card">
                        <h5 class="card-title">{props.interest2}</h5>
                        <p class="interests-desc">{props.interest2desc}</p>
                    </div>
                </div>            
            </div>
        </div>

    </div>
  )
}

export default AboutMe