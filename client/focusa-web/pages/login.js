import Link from 'next/link';
import { useCallback, useState } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout';
import LoadingIndicator from '../components/LoadingIndicator';
import { authenticate } from '../hooks/authenticate';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const submitCheck = useCallback((e) => {
        e.preventDefault();
        authenticate(username, password)
        .then(() => Router.back());
    });

    return (
        <Layout>
            <form onSubmit={submitCheck}>
                <input type='text' placeholder='Username' onChange={setUsername} />
                <input type='password' placeholder='password' onChange={setPassword} />
                <button type='submit'>Login</button>
            </form>
        </Layout>
    );
}