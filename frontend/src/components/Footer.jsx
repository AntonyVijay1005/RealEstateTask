import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="p-2 bg-primary rounded-lg">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 italic">
                                Rently<span className="text-primary">&</span>Co
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your premium destination for luxury real estate and AI-powered property insights. Find your dream home with confidence.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/properties" className="text-muted-foreground hover:text-primary transition-colors">Browse Properties</Link>
                            </li>
                            <li>
                                <Link to="/add-property" className="text-muted-foreground hover:text-primary transition-colors">List Your Property</Link>
                            </li>
                            <li>
                                <Link to="/predict" className="text-muted-foreground hover:text-primary transition-colors"> Price Prediction</Link>
                            </li>
                            <li>
                                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin Dashboard</Link>
                            </li>
                        </ul>
                    </div>

                    {/* User Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Account</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">My Profile</Link>
                            </li>
                            <li>
                                <Link to="/my-properties" className="text-muted-foreground hover:text-primary transition-colors">My Listings</Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Join Community</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900 mb-0">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">123 Real Estate Ave, T nagar , Chennai</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">+91 9875896547</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-sm text-muted-foreground">admin@rently.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Rently & Co. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
