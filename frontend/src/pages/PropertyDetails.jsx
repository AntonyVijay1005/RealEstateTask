import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import axios from '../api/axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    MapPin,
    BedDouble,
    Ruler,
    Tag,
    ArrowLeft,
    Loader2,
    Share2,
    Heart,
    TrendingUp,
    Calendar,
    Building,
    MessageSquare,
    CheckCircle2,
    Info,
    ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast'; // Import toast

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Add useNavigate hook
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [prediction, setPrediction] = useState(null);
    const [predLoading, setPredLoading] = useState(false);
    const [predError, setPredError] = useState(null);
    const [selectedYears, setSelectedYears] = useState(5);

    // New states for enquiry form
    const [enquirySubmitting, setEnquirySubmitting] = useState(false);
    const [enquiryMessage, setEnquiryMessage] = useState(''); // State for the message input
    const [enquiryName, setEnquiryName] = useState('');
    const [enquiryEmail, setEnquiryEmail] = useState('');
    const [enquiryPhone, setEnquiryPhone] = useState('');

    // Placeholder for authentication status (replace with actual auth context/hook)
    const { isAuthenticated, user } = useSelector((state) => state.auth); // Use actual auth state

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`/properties/${id}`);
                setProperty(response.data);

                // Fetch prediction separately to track its own state
                setPredLoading(true);
                try {
                    const predResponse = await axios.get(`/predict/${id}?years=${selectedYears}`);
                    setPrediction(predResponse.data);
                } catch (predErr) {
                    console.error("Error fetching prediction:", predErr);
                    setPredError("Unable to load price forecast.");
                } finally {
                    setPredLoading(false);
                }

            } catch (err) {
                console.error("Error fetching property details:", err);
                setError("Failed to load property details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id, selectedYears]);

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please login to send enquiries.");
            navigate('/login');
            return;
        }
        setEnquirySubmitting(true);
        try {
            await axios.post('/enquiries', {
                propertyId: id,
                name: enquiryName,
                email: enquiryEmail,
                phone: enquiryPhone,
                message: enquiryMessage
            });
            toast.success("Enquiry sent successfully! The owner will contact you soon.");
            // Clear form fields
            setEnquiryName('');
            setEnquiryEmail('');
            setEnquiryPhone('');
            setEnquiryMessage('');
        } catch (err) {
            console.error('Error sending enquiry:', err);
            toast.error(err.response?.data?.message || "Failed to send enquiry. Please try again.");
        } finally {
            setEnquirySubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Property Not Found</h2>
                <p className="text-muted-foreground">{error || "The property you are looking for does not exist."}</p>
                <Button asChild>
                    <Link to="/properties">Back to Properties</Link>
                </Button>
            </div>
        );
    }

    // Default image if none provided
    const mainImage = property.images && property.images.length > 0
        ? property.images[0]
        : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header Image */}
            <div className="w-full h-[50vh] relative bg-gray-200">
                <img
                    src={mainImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-8 pb-8 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="/properties" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <Badge variant="secondary" className="mb-3 text-sm font-semibold tracking-wide uppercase bg-primary text-primary-foreground border-none">
                                    {property.type}
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{property.title}</h1>
                                <div className="flex items-center text-lg text-white/90">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    {property.location}
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    ${property.price?.toLocaleString()}
                                </div>
                                <div className="text-white/80 mt-1">
                                    {property.squareFeet ? `${property.squareFeet} sq ft` : 'Area not specified'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="shadow-lg border-none">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">About this property</h2>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" className="rounded-full">
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                            {user?.role === 'ADMIN' && (
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" asChild className="gap-2">
                                                        <Link to={`/edit-property/${id}`}>
                                                            <Pencil className="h-4 w-4" /> Edit
                                                        </Link>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                                                <BedDouble size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Bedrooms</p>
                                                <p className="font-bold text-gray-900">{property.bedrooms || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                                                <Tag size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Bathrooms</p>
                                                <p className="font-bold text-gray-900">{property.bathrooms || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Year Built</p>
                                                <p className="font-bold text-gray-900">{property.yearBuilt || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                                                <Ruler size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Area</p>
                                                <p className="font-bold text-gray-900">{property.squareFeet ? `${property.squareFeet} sq ft` : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose max-w-none text-gray-600 leading-relaxed mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                                        <p className="whitespace-pre-line">{property.description}</p>
                                    </div>


                                    {/* AI Price Prediction Section */}
                                    <div className="mt-8 border-t pt-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <TrendingUp className="h-5 w-5 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-bold">AI Price Forecast</h3>
                                            </div>

                                            {/* Year Input */}
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm font-medium text-muted-foreground">Forecast Period:</label>
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="50"
                                                        value={selectedYears}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value);
                                                            if (value >= 1 && value <= 50) {
                                                                setSelectedYears(value);
                                                            }
                                                        }}
                                                        className="flex h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring text-center"
                                                    />
                                                    <span className="text-sm text-muted-foreground">{selectedYears === 1 ? 'Year' : 'Years'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {predLoading ? (
                                            <div className="h-64 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
                                                <span className="text-muted-foreground">Calculating market trends...</span>
                                            </div>
                                        ) : predError ? (
                                            <div className="h-32 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-500">
                                                <p>{predError}</p>
                                            </div>
                                        ) : prediction ? (
                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                                        <div>
                                                            <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Current Market Estimate</p>
                                                            <div className="text-3xl font-bold mb-4">${prediction.estimatedPrice?.toLocaleString()}</div>

                                                            <div className="space-y-3">
                                                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                                                    <span className="text-gray-400">{selectedYears}-Year Growth Forecast</span>
                                                                    <span className="font-semibold text-emerald-400">+{prediction.annualAppreciationRate ? ((Math.pow(1 + prediction.annualAppreciationRate / 100, selectedYears) - 1) * 100).toFixed(1) : '0.0'}%</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                                                    <span className="text-gray-400">Annual Growth Rate</span>
                                                                    <span className="font-semibold text-emerald-400">{prediction.annualAppreciationRate?.toFixed(1)}%</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                                                    <span className="text-gray-400">Market Trend</span>
                                                                    <span className="font-semibold text-emerald-400 flex items-center">
                                                                        <TrendingUp className="h-3 w-3 mr-1" /> {prediction.marketTrend}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-400">Confidence Score</span>
                                                                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                                                                        {prediction.confidenceLevel}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8">
                                                            <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Estimated Value in {selectedYears} {selectedYears === 1 ? 'Year' : 'Years'}</p>
                                                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                                                                ${prediction.projectedPrice5Years?.toLocaleString()}
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                *Based on historical {property.location?.split(',')[0]} market data ({prediction.annualAppreciationRate?.toFixed(1)}% annual appreciation). Past performance does not guarantee future results.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Historical Trend Graph */}
                                                <div className="bg-white border rounded-xl p-6 h-[350px]">
                                                    <h4 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider flex items-center">
                                                        <TrendingUp className="h-4 w-4 mr-2" />
                                                        Quarterly Price Trend (Market Rates)
                                                    </h4>
                                                    <div className="h-full pb-8">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={prediction.historicalTrends}>
                                                                <defs>
                                                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                                    </linearGradient>
                                                                </defs>
                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                                <XAxis
                                                                    dataKey="quarter"
                                                                    axisLine={false}
                                                                    tickLine={false}
                                                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                                                    dy={10}
                                                                />
                                                                <YAxis
                                                                    hide
                                                                    domain={['auto', 'auto']}
                                                                />
                                                                <Tooltip
                                                                    contentStyle={{
                                                                        borderRadius: '12px',
                                                                        border: 'none',
                                                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                                        padding: '12px'
                                                                    }}
                                                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                                                                />
                                                                <Area
                                                                    type="monotone"
                                                                    dataKey="price"
                                                                    stroke="#3b82f6"
                                                                    strokeWidth={3}
                                                                    fillOpacity={1}
                                                                    fill="url(#colorPrice)"
                                                                    animationDuration={1500}
                                                                />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-6"
                    >
                        <Card className="shadow-lg border-none sticky top-24">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Interested?</h3>
                                <p className="text-muted-foreground mb-6 text-sm">
                                    Contact the owner directly to schedule a viewing or request more information.
                                </p>

                                <form className="space-y-4" onSubmit={handleEnquirySubmit}>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Your Name *</label>
                                        <input
                                            name="name"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            placeholder="John Doe"
                                            value={enquiryName}
                                            onChange={(e) => setEnquiryName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email *</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            placeholder="john@example.com"
                                            value={enquiryEmail}
                                            onChange={(e) => setEnquiryEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            placeholder="+1 234 567 8900"
                                            value={enquiryPhone}
                                            onChange={(e) => setEnquiryPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message *</label>
                                        <textarea
                                            name="message"
                                            required
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            placeholder="I am interested in this property..."
                                            value={enquiryMessage}
                                            onChange={(e) => setEnquiryMessage(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={enquirySubmitting}>
                                        {enquirySubmitting ? (
                                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                                        ) : (
                                            "Send Enquiry"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
