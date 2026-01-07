import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Search, MapPin, BedDouble, Ruler, Tag } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Pencil } from 'lucide-react';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [minSqFt, setMinSqFt] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const { user } = useSelector((state) => state.auth);

    // Debounced search effect
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Build query params
                const params = new URLSearchParams();

                // Add filters to query params
                if (searchTerm) params.append('location', searchTerm);
                if (typeFilter !== 'ALL') params.append('type', typeFilter);
                if (minSqFt) params.append('minPrice', '0'); // Using minPrice as placeholder

                // Use search endpoint if any filters are active, otherwise get all
                const endpoint = params.toString()
                    ? `/properties/search?${params.toString()}`
                    : '/properties';

                const response = await axios.get(endpoint);
                let result = response.data;

                // Client-side filters for features not supported by backend
                if (minSqFt) {
                    result = result.filter(property => property.squareFeet >= parseInt(minSqFt));
                }

                // Client-side sorting
                if (sortBy === 'price-low') {
                    result.sort((a, b) => a.price - b.price);
                } else if (sortBy === 'price-high') {
                    result.sort((a, b) => b.price - a.price);
                } else if (sortBy === 'sqft-high') {
                    result.sort((a, b) => b.squareFeet - a.squareFeet);
                }

                setProperties(result);
                setFilteredProperties(result);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce: wait 300ms after user stops typing
        const timeoutId = setTimeout(() => {
            fetchProperties();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, typeFilter, minSqFt, sortBy]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Browse Properties</h1>
                        <p className="text-muted-foreground mt-1">Find your perfect place from our exclusive listings.</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-8 overflow-hidden shadow-md">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search Location</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="City or Neighborhood"
                                        className="pl-9 h-11"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Property Type</label>
                                <select
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="APARTMENT">Apartment</option>
                                    <option value="VILLA">Villa</option>
                                    <option value="LAND">Land</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Min Sq Ft</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 1000"
                                    className="h-11"
                                    value={minSqFt}
                                    onChange={(e) => setMinSqFt(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sort By</label>
                                <select
                                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="sqft-high">Size: Largest First</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Listings Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    >
                        {filteredProperties.map((property) => (
                            <motion.div key={property.id} variants={item}>
                                <PropertyCard property={property} user={user} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-semibold">No properties found</h3>
                        <p className="text-muted-foreground">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PropertyCard = ({ property, user }) => {
    // Default image if none provided
    const image = property.images && property.images.length > 0
        ? property.images[0]
        : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

    return (
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                    }}
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-primary uppercase">
                    {property.type}
                </div>
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1" title={property.title}>
                        {property.title}
                    </CardTitle>
                    <span className="text-lg font-bold text-primary whitespace-nowrap">
                        ${property.price?.toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{property.location}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {property.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {property.squareFeet && (
                        <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded">
                            <Ruler className="h-4 w-4 text-gray-500" />
                            <span>{property.squareFeet} sq ft</span>
                        </div>
                    )}
                    {property.bedrooms && (
                        <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded">
                            <BedDouble className="h-4 w-4 text-gray-500" />
                            <span>{property.bedrooms} Bed</span>
                        </div>
                    )}
                    {property.yearBuilt && (
                        <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span>Built {property.yearBuilt}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4 border-t bg-gray-50/30 flex gap-2">
                <Button asChild className="flex-grow">
                    <Link to={`/properties/${property.id}`}>View Details</Link>
                </Button>
                {user?.role === 'ADMIN' && (
                    <Button variant="outline" size="icon" asChild title="Edit Property">
                        <Link to={`/edit-property/${property.id}`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default Properties;
