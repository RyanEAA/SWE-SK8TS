import { Link } from 'react-router-dom';
import '../css/NewAboutMe.css';

function NewAboutMe(props) {
  return (
    <main className="individual-page">
      <h1 className="about-me-text">About Me</h1>

      {/* this is where the profile picture and the about me info is at */}
      <div className="profile-container">
        {/* profile pic and social media */}
        <div className="polaroid">
          <img src={props.profileimage} alt="Profile" />

          {/* social media parts inside polaroid */}
          <div className="social-media">
            <a className="github-button" href={props.github}>
              Github
            </a>

            <a
              className="linkedin-button"
              href="https://www.linkedin.com/in/ryan-aparicio-547586220/"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">I'm {props.name}</h2>
          <p className="card-text">{props.text}</p>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Location:</strong> {props.location}
            </li>
            <li className="list-group-item">
              <strong>Skills:</strong> {props.skills}
            </li>
            <li className="list-group-item">
              <strong>Interests:</strong> {props.interests}
            </li>
          </ul>
        </div>
      </div>

      {/* this is where photos are going to be shown OUTSIDE of the profile container*/}
      <div className="image-gallery">
        <div className="polaroid">
          <img className="interest-image" src={props.interest1image} alt="Interest 1" />
          <p>{props.interest1desc}</p>
        </div>

        <div className="polaroid">
          <img className="interest-image" src={props.webimage} alt="Interest 2" />
          <p>{props.interest2desc}</p>
        </div>

      </div>

      <div className="back-to-home">
        <Link to="/" className="back-to-home-text">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NewAboutMe;