 
import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import App from './App';
import VolumeSelector from './components/VolumeSelector';
import AdminRoute from './components/AdminRoute';

const BookWrapper = lazy(() => import('./components/BookWrapper'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// Component for full screen loading fallback
const BookLoader = () => (
    <div className="w-full h-[100dvh] bg-background flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/10" />
            <div className="absolute w-16 h-16 rounded-full border-t-2 border-[#D4AF37] animate-spin" />
        </div>
        <p className="mt-20 text-[#D4AF37] tracking-widest text-sm uppercase">Carregando Biblioteca...</p>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <VolumeSelector />,
            },
            {
                path: '/read/:volumeId',
                element: (
                    <Suspense fallback={<BookLoader />}>
                        <BookWrapper />
                    </Suspense>
                ),
            },
            {
                element: <AdminRoute />,
                children: [
                    {
                        path: '/admin',
                        element: (
                            <Suspense fallback={<BookLoader />}>
                                <AdminPanel />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
]);
