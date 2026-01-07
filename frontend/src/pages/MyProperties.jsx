import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { Building, Plus, Pencil, Trash2, Loader2, Search, MapPin, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null); // ID of property being deleted
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.auth);

    const fetchMyProperties = async () => {
        try {
            const endpoint = (user?.role === 'ADMIN') ? '/properties' : '/properties/my';
            const response = await axios.get(endpoint);
            setProperties(response.data);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError("Failed to load properties.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(id);
        try {
            await axios.delete(`/properties/${id}`);
            // Remove from local state immediately
            setProperties(properties.filter(p => p.id !== id));
            toast.success('Property deleted successfully');
        } catch (error) {
            console.error("Error deleting property:", error);
            toast.error('Failed to delete property. Please try again.');
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {user?.role === 'ADMIN' ? 'Manage All Listings' : 'My Properties'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {user?.role === 'ADMIN' ? 'Review and manage all property listings on the platform.' : 'Manage your active property listings.'}
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/add-property">
                            <Plus className="mr-2 h-4 w-4" /> Add New Property
                        </Link>
                    </Button>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive p-4 rounded-md font-medium">
                        {error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Listings ({properties.length})</CardTitle>
                        <CardDescription>
                            View and manage the properties you have published to the marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {properties.length === 0 ? (
                            <div className="text-center py-10 border rounded-lg bg-gray-50/50 border-dashed">
                                <h3 className="text-lg font-medium text-gray-900">No properties listed yet</h3>
                                <p className="text-muted-foreground mt-1 mb-4">Start your journey by adding your first property.</p>
                                <Button variant="outline" asChild>
                                    <Link to="/add-property">Add Property</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Image</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Price</TableHead>
                                            {user?.role === 'ADMIN' && <TableHead>Owner</TableHead>}
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {properties.map((property) => (
                                            <TableRow key={property.id}>
                                                <TableCell>
                                                    <div className="h-10 w-16 overflow-hidden rounded bg-gray-100 relative">
                                                        <img
                                                            src={property.images && property.images.length > 0 ? property.images[0] : ""}
                                                            alt={property.title}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <Link to={`/properties/${property.id}`} className="hover:underline hover:text-primary">
                                                        {property.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="uppercase text-xs">
                                                        {property.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-muted-foreground text-sm">
                                                        <MapPin className="mr-1 h-3 w-3" />
                                                        {property.location}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    ${property.price?.toLocaleString()}
                                                </TableCell>
                                                {user?.role === 'ADMIN' && (
                                                    <TableCell className="text-sm">
                                                        {property.ownerName || 'Unknown'}
                                                    </TableCell>
                                                )}
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" asChild>
                                                            <Link to={`/edit-property/${property.id}`}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(property.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MyProperties;
