import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiClient} from '../client/apiClient'; // Adjust the import path as necessary

export const useAuth = () => {
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiClient.get('/me');
                setUserEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user info:', error);
                router.push('/login');
            }
        };

        fetchUserData();
    }, [router]);

    const logout = async () => {
        try {
            await apiClient.post('/logout');
            setUserEmail('');
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return { userEmail, logout };
};