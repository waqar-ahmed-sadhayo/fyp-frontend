import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DISEASE_META } from "../diseaseConfig";
import logo from "../assets/logo.png";

// No social icons here on purpose — there's no real, actively-maintained
// social presence for this project to link to yet, and a row of icons
// pointing nowhere (or to placeholder accounts) would be more misleading
// than just omitting them.
export default function Footer() {
  const { user } = useAuth();
  const screeningTo = (key) => (user ? `/predict/${key}` : "/register");

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-col">
            <div className="footer-brand">
              <img src={logo} alt="Multi-Disease Detection System" />
            </div>
            <p>
              AI-powered preliminary screening for five conditions — heart
              disease, diabetes, breast cancer, kidney disease and liver
              disease. Built as an educational final year project.
            </p>
          </div>

          <div className="footer-col">
            <h5>Screenings</h5>
            <ul className="footer-links">
              {Object.entries(DISEASE_META).map(([key, meta]) => (
                <li key={key}><Link to={screeningTo(key)}>{meta.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <ul className="footer-links">
              <li><Link to="/education">Learn</Link></li>
              <li><Link to="/#how-it-works">How it works</Link></li>
              <li><Link to={user ? "/feedback" : "/register"}>Feedback</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Account</h5>
            <ul className="footer-links">
              <li><Link to={user ? "/dashboard" : "/register"}>Dashboard</Link></li>
              <li><Link to={user ? "/history" : "/login"}>History</Link></li>
              <li><Link to={user ? "/profile" : "/login"}>Profile</Link></li>
              {!user && <li><Link to="/login">Sign in</Link></li>}
            </ul>
          </div>
        </div>

        <div className="footer-disclaimer">
          <div className="footer-disclaimer-item">
            <h6>Medical disclaimer</h6>
            <p>
              Every result is a preliminary screening estimate from a machine
              learning model, not a diagnosis, and is not a substitute for
              professional medical advice. Always confirm any elevated result
              with a licensed clinician.
            </p>
          </div>
          <div className="footer-disclaimer-item">
            <h6>Data privacy</h6>
            <p>
              Your account and screening results are private to you.
              Passwords are hashed with bcrypt and sessions use short-lived
              JWTs — nothing is sold or shared with third parties.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Multi-Disease Detection System — Final Year Project</span>
          <span>Educational use only, not a certified medical device</span>
        </div>
      </div>
    </footer>
  );
}
