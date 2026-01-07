import { useNavigate } from 'react-router-dom';
import { Search, Home as HomeIcon, TrendingUp, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";

const Home = () => {
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60 z-10" />
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Modern Home"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 container px-4 md:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-6 max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                            Rently & Co
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Find Your Dream Property <br className="hidden sm:inline" />
                            <span className="text-blue-400">With Real Insights.</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="mx-auto max-w-[700px] text-lg text-slate-300 md:text-xl">
                            Smart listings with price prediction analysis. We help you make the right investment at the right time.
                        </motion.p>

                        <motion.div variants={fadeIn} className="mx-auto max-w-2xl bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl mt-8">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        className="pl-10 h-12 bg-white/95 border-0 text-slate-900 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                                        placeholder="Search by city, neighborhood, or address..."
                                    />
                                </div>
                                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
                                    Search Now
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 mb-4">Why Choose Rently?</h2>
                        <p className="text-lg text-slate-600">We don't just list properties; we provide the data you need to make smart decisions.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid gap-8 md:grid-cols-3"
                    >
                        <FeatureCard
                            icon={<HomeIcon className="h-10 w-10 text-blue-600" />}
                            title="Premium Listings"
                            description="Access thousands of verified commercial and residential properties with detailed insights."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="h-10 w-10 text-emerald-600" />}
                            title=" Price Prediction"
                            description="Historical data models predict future property values, helping you invest smarter."
                        />
                        <FeatureCard
                            icon={<UserCheck className="h-10 w-10 text-purple-600" />}
                            title="Direct Connections"
                            description="Connect directly with verified owners. No hidden fees or middleman commissions."
                        />
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white border-t">
                <div className="container px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row items-center justify-between gap-12 bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 space-y-4 max-w-xl">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to list your property?</h2>
                            <p className="text-lg text-slate-300">Join thousands of owners who trust Rently & Co to find the perfect buyers.</p>
                        </div>
                        <div className="relative z-10">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-semibold group" onClick={() => navigate('/register')}>
                                    Create Free Account
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div variants={cardVariants}>
            <Card className="border-0 shadow-lg bg-white relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 h-full">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default Home;
