import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Menu, X, Home as HomeIcon, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
                            <motion.div whileHover={{ rotate: 10 }}>
                                <Building2 className="h-6 w-6" />
                            </motion.div>
                            <span>Rently & Co</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:gap-6">
                        <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link to="/properties" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                            Properties
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {user?.role === 'ADMIN' && (
                                    <Link to="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Admin</Link>
                                )}
                                {(user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                                    <>
                                        <Link to="/add-property" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">List Property</Link>
                                        <Link to="/my-properties" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                            {user?.role === 'ADMIN' ? 'Manage Listings' : 'My Properties'}
                                        </Link>
                                        <Link to="/enquiries" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Enquiries</Link>
                                    </>
                                )}

                                <div className="flex items-center gap-3 pl-4 border-l">
                                    <span className="text-sm font-medium text-foreground">{user?.firstName}</span>
                                    <Link to="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Profile</Link>
                                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button asChild>
                                        <Link to="/register">Get Started</Link>
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t overflow-hidden"
                    >
                        <div className="space-y-1 px-4 py-3 pb-3">
                            <Link to="/" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">Home</Link>
                            <Link to="/properties" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">Properties</Link>

                            {isAuthenticated ? (
                                <div className="pt-4 mt-2 border-t">
                                    {/* Mobile Role-Based Links */}
                                    {user?.role === 'ADMIN' && (
                                        <Link to="/admin" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    {(user?.role === 'OWNER' || user?.role === 'ADMIN') && (
                                        <>
                                            <Link to="/add-property" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
                                                List Property
                                            </Link>
                                            <Link to="/my-properties" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
                                                {user?.role === 'ADMIN' ? 'Manage Listings' : 'My Properties'}
                                            </Link>
                                            <Link to="/enquiries" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md">
                                                Enquiries
                                            </Link>
                                        </>
                                    )}

                                    <div className="flex items-center px-3 mb-3 mt-4">
                                        <span className="text-base font-medium">Hello, {user?.firstName}</span>
                                    </div>

                                    <Link to="/profile" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md mb-2">
                                        Profile
                                    </Link>

                                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="pt-4 mt-2 border-t grid gap-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link to="/login">Login</Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link to="/register">Get Started</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
