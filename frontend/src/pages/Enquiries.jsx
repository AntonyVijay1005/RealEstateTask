import { useState, useEffect } from 'react';
import axios from '../api/axios';
import {
    MessageSquare,
    Calendar,
    User,
    Mail,
    Phone,
    Home,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    const fetchEnquiries = async () => {
        try {
            const endpoint = (user?.role === 'ADMIN') ? '/enquiries/owner' : '/enquiries/owner';
            // Note: For now, we'll fetch owner-specific enquiries. 
            // If ADMIN, might need a generic /enquiries endpoint if it exists.
            const response = await axios.get(endpoint);
            setEnquiries(response.data);
        } catch (err) {
            console.error("Error fetching enquiries:", err);
            toast.error("Failed to load enquiries.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchEnquiries();
        }
    }, [user]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`/enquiries/${id}/status?status=${newStatus}`);
            toast.success(`Enquiry marked as ${newStatus.toLowerCase()}`);
            fetchEnquiries(); // Refresh
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update status.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'CONTACTED': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Contacted</Badge>;
            case 'CLOSED': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Closed</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Property Enquiries</h1>
                    <p className="text-muted-foreground mt-1">Manage leads and inquiries from interested buyers.</p>
                </div>

                {enquiries.length === 0 ? (
                    <Card className="text-center py-20 border-dashed border-2">
                        <CardContent className="space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-gray-100 rounded-full">
                                    <MessageSquare className="h-10 w-10 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">No enquiries yet</h3>
                                <p className="text-muted-foreground">When buyers show interest in your properties, they'll appear here.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence mode="popLayout">
                            {enquiries.map((enquiry) => (
                                <motion.div
                                    key={enquiry.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-lg">{enquiry.userName}</CardTitle>
                                                    {getStatusBadge(enquiry.status)}
                                                </div>
                                                <CardDescription className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3" /> {enquiry.email}
                                                    {enquiry.phone && (
                                                        <>
                                                            <span className="text-gray-300">|</span>
                                                            <Phone className="h-3 w-3" /> {enquiry.phone}
                                                        </>
                                                    )}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(enquiry.createdAt).toLocaleDateString()}
                                                </div>
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <Home className="h-3 w-3" /> {enquiry.propertyTitle}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic border-l-4 border-primary/20">
                                                "{enquiry.message}"
                                            </div>

                                            <div className="mt-6 flex justify-end gap-2">
                                                {enquiry.status === 'PENDING' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={() => handleStatusUpdate(enquiry.id, 'CONTACTED')}
                                                    >
                                                        Mark as Contacted
                                                    </Button>
                                                )}
                                                {enquiry.status !== 'CLOSED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary hover:text-primary hover:bg-primary/5 gap-2"
                                                        onClick={() => handleStatusUpdate(enquiry.id, 'CLOSED')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" /> Close Enquiry
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Enquiries;
