import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2, Plus, X, Building, MapPin, DollarSign, Ruler, FileText, BedDouble, Tag, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const AddProperty = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    // Removed error state as toast will handle error messages
    // const [error, setError] = useState('');

    // Redirect if not owner
    if (user && user.role !== 'OWNER' && user.role !== 'ADMIN') {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                <p>Only property owners can list properties.</p>
                <Button className="mt-4" onClick={() => navigate('/')}>Go Home</Button>
            </div>
        );
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        squareFeet: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: new Date().getFullYear(),
        type: 'APARTMENT',
        images: [''] // Start with one empty image field
    });

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
        setLoading(true);
        // setError(''); // Removed error state

        try {
            // Filter out empty image strings
            const cleanImages = formData.images.filter(img => img.trim() !== '');

            await axios.post('/properties', {
                ...formData,
                images: cleanImages,
                price: parseFloat(formData.price),
                squareFeet: parseFloat(formData.squareFeet),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                yearBuilt: parseInt(formData.yearBuilt)
            });

            toast.success('Property listed successfully!'); // Replaced alert with toast
            navigate('/my-properties'); // Changed navigation target
        } catch (err) {
            console.error("Failed to add property:", err);
            console.error("Error response:", err.response);
            console.error("Error data:", err.response?.data);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to list property. Please try again.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl"
            >
                <Card className="shadow-xl border-t-4 border-t-primary bg-white">
                    <CardHeader className="text-center border-b bg-gray-50/50 pb-8 pt-10">
                        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">List Your Property</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Fill in the details below to showcase your property to thousands of buyers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Removed error display block as toast handles errors */}
                            {/* {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-md font-medium border border-red-200 flex items-center justify-center">
                                    {error}
                                </div>
                            )} */}

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-base">Property Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Modern Luxury Villa in Downtown"
                                        className="h-12 text-base"
                                        required
                                        onChange={handleChange}
                                        value={formData.title}
                                    />
                                    <p className="text-xs text-muted-foreground">A catchy title attracts more views.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="text-base">Property Type</Label>
                                        <div className="relative">
                                            <select
                                                id="type"
                                                name="type"
                                                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                                                onChange={handleChange}
                                                value={formData.type}
                                            >
                                                <option value="APARTMENT">Apartment</option>
                                                <option value="VILLA">Villa</option>
                                                <option value="LAND">Land</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-base">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="City, Address"
                                            className="h-12"
                                            required
                                            onChange={handleChange}
                                            value={formData.location}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="text-base">Price ($)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                placeholder="250000"
                                                className="pl-7 h-12"
                                                min="1"
                                                required
                                                onChange={handleChange}
                                                value={formData.price}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="squareFeet" className="text-sm font-medium">Area (sq ft)</label>
                                        <Input
                                            id="squareFeet"
                                            name="squareFeet"
                                            type="number"
                                            placeholder="1200"
                                            className="h-12"
                                            min="1"
                                            required
                                            onChange={handleChange}
                                            value={formData.squareFeet}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
                                        <Input
                                            id="bedrooms"
                                            name="bedrooms"
                                            type="number"
                                            placeholder="3"
                                            className="h-12"
                                            min="0"
                                            required
                                            onChange={handleChange}
                                            value={formData.bedrooms}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</label>
                                        <Input
                                            id="bathrooms"
                                            name="bathrooms"
                                            type="number"
                                            placeholder="2"
                                            className="h-12"
                                            min="0"
                                            required
                                            onChange={handleChange}
                                            value={formData.bathrooms}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="yearBuilt" className="text-sm font-medium">Year Built</label>
                                        <Input
                                            id="yearBuilt"
                                            name="yearBuilt"
                                            type="number"
                                            placeholder="2022"
                                            className="h-12"
                                            min="1800"
                                            required
                                            onChange={handleChange}
                                            value={formData.yearBuilt}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-base">Description</Label>
                                    <Textarea // Changed to Textarea component
                                        id="description"
                                        name="description"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                        placeholder="Describe the key features, amenities, and neighborhood highlights..."
                                        required
                                        onChange={handleChange}
                                        value={formData.description}
                                    />
                                </div>

                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <Label className="text-base">Property Images</Label>
                                    <p className="text-sm text-muted-foreground mb-4">Add valid image URLs to showcase your property.</p>

                                    <div className="space-y-3">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <div className="relative flex-grow">
                                                    <Input
                                                        placeholder="https://example.com/image.jpg"
                                                        value={img}
                                                        className="h-10"
                                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                                    />
                                                </div>
                                                {formData.images.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                                        onClick={() => removeImageField(index)}
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Button type="button" variant="outline" size="sm" className="mt-2 w-full border-dashed" onClick={addImageField}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Another Image
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" size="lg" className="w-full h-12 text-base shadow-lg shadow-primary/20" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'List Property Now'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AddProperty;
