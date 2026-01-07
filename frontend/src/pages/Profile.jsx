import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Loader2, User, Key, Phone, Mail, Lock, Save, KeyRound } from 'lucide-react';
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import { updateCredentials } from '../redux/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/users/me');
                setUser(response.data);
                setProfileData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNumber: response.data.phoneNumber || ''
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error('Failed to load profile data.');
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        try {
            const response = await axios.put('/users/me', profileData);
            dispatch(updateCredentials({
                user: { ...user, ...response.data },
                token: localStorage.getItem('token')
            }));
            setUser(prevUser => ({ ...prevUser, ...response.data })); // Update local user state
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        setPasswordLoading(true);
        try {
            await axios.post('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Change password error:", error);
            toast.error(error.response?.data?.message || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!user) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={48} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Mail size={16} /> {user.email}
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" /> Profile Settings
                            </CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input name="firstName" value={profileData.firstName} onChange={handleProfileChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input name="lastName" value={profileData.lastName} onChange={handleProfileChange} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} className="pl-9" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11" disabled={profileLoading}>
                                    {profileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Update Profile
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" /> Security
                            </CardTitle>
                            <CardDescription>Change your account password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Password</label>
                                    <Input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Password</label>
                                    <Input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirm New Password</label>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11" disabled={passwordLoading}>
                                    {passwordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                                    Change Password
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
