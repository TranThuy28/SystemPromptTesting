import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const ConnectionTest = () => {
    const [status, setStatus] = useState('checking');
    const [message, setMessage] = useState('');

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        try {
            setStatus('checking');
            setMessage('Đang kiểm tra kết nối...');

            const response = await fetch('http://localhost:8000/health');
            if (response.ok) {
                const data = await response.json();
                setStatus('success');
                setMessage('✅ Kết nối backend thành công!');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            setStatus('error');
            setMessage(`❌ Lỗi kết nối: ${error.message}`);
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return '#f44336';
            default:
                return '#2196F3';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '10px 15px',
            borderRadius: '8px',
            backgroundColor: getStatusColor(),
            color: 'white',
            fontSize: '0.9rem',
            zIndex: 1000,
            minWidth: '200px',
            textAlign: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {status === 'checking' && (
                    <div style={{
                        width: '12px',
                        height: '12px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}
                <span>{message}</span>
                {status !== 'checking' && (
                    <button
                        onClick={testConnection}
                        style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        🔄
                    </button>
                )}
            </div>
            
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ConnectionTest;