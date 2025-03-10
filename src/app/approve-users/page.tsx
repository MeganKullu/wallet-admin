'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/app/components/AuthGuard';
import Navigation from '@/app/components/Navigation';
import api, { admin } from '@/app/lib/api';
import toast from 'react-hot-toast';

interface PendingUser {
    id: number;
    name: string;
    email: string;
    registrationDate: string;
}

export default function ApproveUsers() {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await admin.getPendingUsers();
            console.log("pending users", response);

            if (response && Array.isArray(response.data)) {
                setPendingUsers(response.data);
            } else if (Array.isArray(response)) {
                setPendingUsers(response);
            } else {
                setPendingUsers([]);
            }
        } catch (error) {
            console.error("Error fetching pending users:", error);
            toast.error('Failed to fetch pending users');
            setPendingUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: number, userName: string) => {
        try {
            await admin.approveUser(userId);
            toast.success(`${userName} has been approved successfully!`);
            fetchPendingUsers();
        } catch (error) {
            toast.error('Failed to approve user');
        }
    };

    return (
        <AuthGuard requireAdmin>
            <div className="min-h-screen bg-gray-100">
                <Navigation />

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            // Loading skeleton
                                            Array.from({ length: 3 }).map((_, index) => (
                                                <tr key={`skeleton-${index}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : Array.isArray(pendingUsers) && pendingUsers.length > 0 ? (
                                            pendingUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button
                                                            onClick={() => handleApprove(user.id, user.name)}
                                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-200"
                                                        >
                                                            Approve
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                                    No pending approvals
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}