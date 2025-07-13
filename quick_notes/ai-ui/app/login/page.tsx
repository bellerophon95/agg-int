'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback,  useState } from 'react';
import { apiClient } from '../home/client/apiClient';// This import is not used in the code, but it can be useful for navigation after login

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [didLoginFail, setLoginFailed] = useState(false); // This state can be used to handle login failure if needed
    const router = useRouter(); // This hook can be used to navigate after login if needed

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        await apiClient.post('/login', { email, password }, { withCredentials: true });
        router.push('/home');
        setLoginFailed(false)
        } catch (error) {
            console.error('Login failed:', error);
            setLoginFailed(true); // Set login failed state if needed
        }
    }, [email, password, router]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ width: '300px', textAlign: 'center' }}>
                <div style={{ marginBottom: '1.4rem', fontSize: '24px', fontWeight: 'bold' }}>
                    <h1>Login to Quick Notes</h1>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', border: '1px solid black' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', border: '1px solid black' }}
                    />
                </div>
                {didLoginFail && (
                    <div style={{ color: 'red', marginBottom: '1rem' }}>
                        Login failed. Please check your credentials.
                    </div>
                )}
                <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;