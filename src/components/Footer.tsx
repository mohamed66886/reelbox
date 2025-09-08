import { Film, Facebook, Instagram, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-hero border-t border-gray-800 mt-auto text-xs md:text-sm">
      <div className="container mx-auto px-2 py-6 md:px-4 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-3 md:mb-4">
              <Film className="h-5 w-5 md:h-6 md:w-6 text-cinema-blue" />
              <span className="text-base md:text-lg font-display font-bold text-white">
                Reelbox
              </span>
            </Link>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xs md:max-w-md">
              Discover and explore thousands of movies with detailed information, 
              ratings, and reviews. Your ultimate movie companion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cinema-blue transition-colors text-xs md:text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-cinema-blue transition-colors text-xs md:text-sm">
                  Search Movies
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-cinema-blue transition-colors text-xs md:text-sm">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-sm md:text-base">Follow Us</h3>
            <div className="flex space-x-2 md:space-x-3">
              <a
                href="https://www.facebook.com/mohamed.rashad.595528"
                className="text-gray-400 hover:text-cinema-blue transition-colors"
                aria-label="Facebook"
                target="_blank" rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="https://www.instagram.com/m7md_rsh3d"
                className="text-gray-400 hover:text-cinema-blue transition-colors"
                aria-label="Instagram"
                target="_blank" rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohamed-abdou-rashad-898348335"
                className="text-gray-400 hover:text-cinema-blue transition-colors"
                aria-label="LinkedIn"
                target="_blank" rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="https://wa.me/201062097359"
                className="text-gray-400 hover:text-cinema-blue transition-colors"
                aria-label="WhatsApp"
                target="_blank" rel="noopener noreferrer"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-xs md:text-sm">
            © 2025 Mohamed Rashad. All rights reserved.
          </div>
          <div className="flex space-x-4 md:space-x-6 mt-3 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs md:text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs md:text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
