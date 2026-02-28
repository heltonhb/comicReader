import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { VOLUMES } from '../volumes';
import Book from './Book';

const BookWrapper = () => {
    const { volumeId } = useParams();
    const navigate = useNavigate();

    const volume = VOLUMES.find(v => v.id === volumeId);

    if (!volume) {
        return <Navigate to="/" replace />;
    }

    return (
        <Book
            key={volume.id}
            volume={volume}
            onBack={() => navigate('/')}
        />
    );
};

export default BookWrapper;
