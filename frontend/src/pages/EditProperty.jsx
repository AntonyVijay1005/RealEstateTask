import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2, Plus, X, ArrowLeft, Save } from 'lucide-react'; // Added Save icon
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast'; // Added toast import

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false); // Renamed from submitting to submitLoading for clarity
    const [error, setError] = useState(''); // This state will be replaced by toast

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        squareFeet: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: '',
        type: 'APARTMENT',
        images: ['']
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`/properties/${id}`);
                const data = response.data;

                // Authorize: Only owner or admin
                if (user && user.id !== data.ownerId && user.role !== 'ADMIN') {
                    navigate('/properties');
                    toast.error("You are not authorized to edit this property."); // Use toast for authorization error
                    return;
                }

                setFormData({
                    ...data,
                    price: data.price.toString(),
                    squareFeet: data.squareFeet.toString(),
                    bedrooms: data.bedrooms?.toString() || '',
                    bathrooms: data.bathrooms?.toString() || '',
                    yearBuilt: data.yearBuilt?.toString() || '',
                    images: data.images.length > 0 ? data.images : ['']
                });
            } catch (err) {
                toast.error('Failed to load property details.'); // Use toast for fetch error
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true); // Use submitLoading
        setError(''); // Clear previous error, though toast will handle new ones

        try {
            const cleanImages = formData.images.filter(img => img.trim() !== '');
            await axios.put(`/properties/${id}`, {
                ...formData,
                images: cleanImages,
                price: parseFloat(formData.price),
                squareFeet: parseFloat(formData.squareFeet),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                yearBuilt: parseInt(formData.yearBuilt)
            });
            toast.success('Property updated successfully!'); // Use toast for success
            navigate(`/properties/${id}`); // Navigate to the property details page
        } catch (err) {
            console.error('Error updating property:', err); // Log error for debugging
            toast.error(err.response?.data?.message || 'Failed to update property. Please check your data.'); // Use toast for error
        } finally {
            setSubmitLoading(false); // Use submitLoading
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8" /></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
                <div className="mb-6 flex items-center gap-2">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                        <ArrowLeft size={16} /> Back
                    </Button>
                </div>
                <Card className="shadow-xl border-t-4 border-t-primary">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">Edit Property</CardTitle>
                        <CardDescription>Update your listing details below.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* {error && <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>} Removed error display, toast handles it */}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input name="title" value={formData.title} onChange={handleChange} required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Property Type</Label>
                                        <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={formData.type} onChange={handleChange}>
                                            <option value="APARTMENT">Apartment</option>
                                            <option value="VILLA">Villa</option>
                                            <option value="LAND">Land</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input name="location" value={formData.location} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Price ($)</Label>
                                        <Input type="number" name="price" min="1" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Area (sq ft)</Label>
                                        <Input type="number" name="squareFeet" min="1" value={formData.squareFeet} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Bedrooms</Label>
                                        <Input type="number" name="bedrooms" min="0" value={formData.bedrooms} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bathrooms</Label>
                                        <Input type="number" name="bathrooms" min="0" value={formData.bathrooms} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Year Built</Label>
                                        <Input type="number" name="yearBuilt" min="1800" value={formData.yearBuilt} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea name="description" className="min-h-[120px]" value={formData.description} onChange={handleChange} required /> {/* Changed to Textarea component */}
                                </div>

                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <Label>Image URLs</Label>
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <Input value={img} onChange={(e) => handleImageChange(index, e.target.value)} />
                                            {formData.images.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeImageField(index)}><X size={16} /></Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addImageField} className="w-full">Add Image</Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={submitLoading}>
                                {submitLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                Update Property
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default EditProperty;
