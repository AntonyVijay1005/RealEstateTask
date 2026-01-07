import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Users, Building, MessagesSquare, Shield, Loader2, UserCog, Mail, Phone, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        totalEnquiries: 0,
        ownerCount: 0,
        buyerCount: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                toast.error("Failed to load platform statistics.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load user list.");
            } finally {
                setUsersLoading(false);
            }
        };

        if (isAuthenticated && user?.role === 'ADMIN') {
            fetchStats();
            fetchUsers();
        }
    }, [isAuthenticated, user]);

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await axios.patch(`/admin/users/${userId}/role?role=${newRole}`);
            toast.success(`User role updated to ${newRole}`);
            // Refresh users list
            const response = await axios.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update user role.");
        }
    };

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    const statCards = [
        { title: "Total Users", value: stats.totalUsers, icon: <Users size={24} />, color: "bg-blue-500" },
        { title: "Active Listings", value: stats.totalProperties, icon: <Building size={24} />, color: "bg-green-500" },
        { title: "Pending Enquiries", value: stats.totalEnquiries, icon: <MessagesSquare size={24} />, color: "bg-purple-500" },
        { title: "Owners / Buyers", value: `${stats.ownerCount} / ${stats.buyerCount}`, icon: <Shield size={24} />, color: "bg-orange-500" },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground mb-10">Platform overview and user management.</p>

                {/* Dynamic Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="flex items-stretch h-32">
                                    <div className={`w-24 ${stat.color} flex items-center justify-center text-white`}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex-grow p-6 flex flex-col justify-center">
                                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1 text-gray-900">
                                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : stat.value}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* User Management Section */}
                <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between py-6">
                        <div>
                            <CardTitle className="text-xl">User Management</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Manage platform users and their access levels.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                            Refresh List
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {usersLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-muted-foreground">Loading users information...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="py-20 text-center">
                                <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                                <h3 className="text-lg font-semibold">No users found</h3>
                                <p className="text-muted-foreground">There are no registered users on the platform yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="font-bold">User</TableHead>
                                            <TableHead className="font-bold">Contact</TableHead>
                                            <TableHead className="font-bold">Role</TableHead>
                                            <TableHead className="font-bold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {u.firstName[0]}{u.lastName[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{u.firstName} {u.lastName}</div>
                                                            <div className="text-xs text-muted-foreground">ID: #{u.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm gap-2">
                                                            <Mail size={14} className="text-muted-foreground" />
                                                            {u.email}
                                                        </div>
                                                        <div className="flex items-center text-sm gap-2">
                                                            <Phone size={14} className="text-muted-foreground" />
                                                            {u.phoneNumber || 'No phone'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={u.role === 'ADMIN' ? 'destructive' : 'secondary'} className="uppercase tracking-wider text-[10px] py-0.5">
                                                        {u.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <select
                                                            className="text-xs border rounded p-1 bg-white outline-none focus:ring-1 focus:ring-primary"
                                                            value={u.role}
                                                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                                            disabled={u.id === user.id}
                                                        >
                                                            <option value="BUYER">BUYER</option>
                                                            <option value="OWNER">OWNER</option>
                                                            <option value="ADMIN">ADMIN</option>
                                                        </select>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" disabled={u.id === user.id}>
                                                            <Trash2 size={16} />
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
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
