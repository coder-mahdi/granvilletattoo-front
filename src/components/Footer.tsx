export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Granvill Tattoo</h3>
            <p>Professional tattoo artistry with passion and precision</p>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📍 123 Main Street, City</p>
            <p>📞 (555) 123-4567</p>
            <p>✉️ info@granvilletattoo.com</p>
          </div>
          
          <div className="footer-section">
            <h4>Hours</h4>
            <p>Mon - Fri: 10:00 AM - 8:00 PM</p>
            <p>Sat: 9:00 AM - 6:00 PM</p>
            <p>Sun: Closed</p>
          </div>
          
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Instagram">📷 Instagram</a>
              <a href="#" aria-label="Facebook">📘 Facebook</a>
              <a href="#" aria-label="Twitter">🐦 Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Granvill Tattoo. All rights reserved.</p>
          <p>Created by <a href="https://www.mahdiroozbahani.com" target="_blank" rel="noopener noreferrer">Mahdi Roozbahani</a></p>
        </div>
      </div>
    </footer>
  );
}