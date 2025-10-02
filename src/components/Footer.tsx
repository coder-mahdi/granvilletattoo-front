export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Granvill Tattoo</p>
          <p>All rights reserved</p>
          <p>Created by <a href="https://www.mahdiroozbahani.com">Mahdi Roozbahani</a></p>
        </div>
      </div>
    </footer>
  );
}