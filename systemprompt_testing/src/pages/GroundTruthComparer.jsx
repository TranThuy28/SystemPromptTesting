import React, { useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/apiService';

const GroundTruthComparer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        groundTruth: '',
        prediction: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            const response = await apiService.compareGroundTruth(formData);
            setResults(response);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gọi API');
            console.error('API Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const placeholderGroundTruth = `User: Tôi muốn kiểm tra đơn hàng #123.
Assistant: Chào bạn, đơn hàng #123 của bạn đang trên đường vận chuyển và dự kiến giao vào ngày mai.
User: Lại ngày mai à? Các bạn đã hứa giao hôm nay. Hủy đơn hàng cho tôi.
Assistant: Tôi rất tiếc về sự chậm trễ này. Tôi hiểu sự thất vọng của bạn. Tôi đã tiến hành hủy đơn hàng #123 và hoàn tiền cho bạn.`;

    const placeholderPrediction = `User: Tôi muốn kiểm tra đơn hàng #123.
Assistant: Đơn hàng #123 sẽ được giao vào ngày mai.
User: Lại ngày mai à? Các bạn đã hứa giao hôm nay. Hủy đơn hàng cho tôi.
Assistant: Yêu cầu đã được ghi nhận. Tiến hành hủy đơn hàng #123.`;

    return (
        <div>
            <h1 className="page-title">Ground Truth Comparer</h1>
            <p className="page-description">
                So sánh lịch sử hội thoại do model tạo ra với một kịch bản mẫu (ground truth) để tìm điểm cải thiện.
            </p>

            {error && (
                <div style={{
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                }}>
                    <strong>Lỗi:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="two-column-layout">
                    <Card title="Ground Truth (Mẫu)">
                        <div className="form-group">
                            <label htmlFor="ground-truth">Dán lịch sử hội thoại mẫu vào đây</label>
                            <textarea
                                id="ground-truth"
                                className="form-textarea"
                                style={{ minHeight: '300px' }}
                                placeholder={placeholderGroundTruth}
                                value={formData.groundTruth}
                                onChange={(e) => handleInputChange('groundTruth', e.target.value)}
                                required
                            />
                        </div>
                    </Card>
                    <Card title="Prediction (Kết quả từ Model)">
                        <div className="form-group">
                            <label htmlFor="prediction">Dán lịch sử hội thoại của model vào đây</label>
                            <textarea
                                id="prediction"
                                className="form-textarea"
                                style={{ minHeight: '300px' }}
                                placeholder={placeholderPrediction}
                                value={formData.prediction}
                                onChange={(e) => handleInputChange('prediction', e.target.value)}
                                required
                            />
                        </div>
                    </Card>
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <><LoadingSpinner /> Đang so sánh...</> : 'So sánh và Đánh giá'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <p>LLM đang phân tích chi tiết...</p>
                </div>
            )}

            {results && (
                <div className="results-section">
                    <Card title="Phân tích so sánh">
                        <div style={{
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '2rem'
                        }}>
                            <h4 style={{marginTop: 0, color: 'var(--primary-color)'}}>📊 Tóm tắt Đánh giá</h4>
                            <p style={{lineHeight: '1.6', margin: 0}}>{results.summary}</p>
                        </div>

                        <h4 style={{color: 'var(--primary-color)'}}>💡 Gợi ý cải thiện cho Prediction:</h4>
                        <div style={{marginTop: '1rem'}}>
                            {results.suggestions.map((item, index) => (
                                <div key={index} style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: '4px solid var(--primary-color)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.8rem'
                                    }}>
                                        <span style={{
                                            backgroundColor: 'var(--primary-color)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                            marginTop: '2px'
                                        }}>
                                            {index + 1}
                                        </span>
                                        <p style={{margin: 0, lineHeight: '1.5'}}>{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <h5 style={{margin: '0 0 1rem 0'}}>📋 Xuất kết quả</h5>
                            <button 
                                onClick={() => copyToClipboard(results)}
                                className="btn"
                                style={{
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    marginRight: '1rem'
                                }}
                            >
                                📄 Copy kết quả
                            </button>
                            <button 
                                onClick={() => downloadResults(results)}
                                className="btn"
                                style={{
                                    backgroundColor: 'var(--success-color)',
                                    color: 'white'
                                }}
                            >
                                💾 Tải xuống
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

// Helper functions
const copyToClipboard = (results) => {
    const text = `PHÂN TÍCH SO SÁNH GROUND TRUTH\n\nTóm tắt:\n${results.summary}\n\nGợi ý cải thiện:\n${results.suggestions.map((item, index) => `${index + 1}. ${item}`).join('\n')}`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Đã copy kết quả vào clipboard!');
    }).catch(err => {
        console.error('Lỗi copy:', err);
    });
};

const downloadResults = (results) => {
    const content = `PHÂN TÍCH SO SÁNH GROUND TRUTH
Generated: ${new Date().toLocaleString('vi-VN')}

TÓM TẮT:
${results.summary}

GỢI Ý CẢI THIỆN:
${results.suggestions.map((item, index) => `${index + 1}. ${item}`).join('\n\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ground-truth-analysis-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default GroundTruthComparer;