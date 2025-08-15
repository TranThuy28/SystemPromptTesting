import React, { useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/apiService';

const SystemPromptTester = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        model: '',
        systemPrompt: '',
        userMessage: '',
        longTermMemory: ''
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
            const response = await apiService.testSystemPrompt({
                model: formData.model,
                systemPrompt: formData.systemPrompt,
                userMessage: formData.userMessage,
                longTermMemory: formData.longTermMemory
            });

            setResults(response);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gọi API');
            console.error('API Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">System Prompt Tester</h1>
            <p className="page-description">
                Đánh giá hiệu quả của system prompt bằng cách nhận phản hồi từ mô hình và một LLM đánh giá khác.
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

            <div className="two-column-layout">
                <Card title="Cấu hình">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="model">Chọn Model</label>
                            <select 
                                id="model" 
                                className="form-select"
                                value={formData.model}
                                onChange={(e) => handleInputChange('model', e.target.value)}
                            >
                                <option value="gpt-4o-mini">GPT-4o Mini</option>
                                <option value="gpt-4.1-nano">GPT 4.1 Nano</option>
                                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="system-prompt">System Prompt</label>
                            <textarea 
                                id="system-prompt" 
                                className="form-textarea" 
                                placeholder="Ví dụ: Bạn là một trợ lý ảo chuyên nghiệp, luôn trả lời một cách lịch sự và hữu ích."
                                value={formData.systemPrompt}
                                onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user-message">Message của người dùng</label>
                            <textarea 
                                id="user-message" 
                                className="form-textarea" 
                                placeholder="Ví dụ: Chào bạn, bạn là ai?"
                                value={formData.userMessage}
                                onChange={(e) => handleInputChange('userMessage', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="long-term-memory">Long-term Memory (Tùy chọn)</label>
                            <textarea 
                                id="long-term-memory" 
                                className="form-textarea" 
                                placeholder="Ví dụ: Tên người dùng là An."
                                value={formData.longTermMemory}
                                onChange={(e) => handleInputChange('longTermMemory', e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? <><LoadingSpinner /> Đang xử lý...</> : 'Tạo và Đánh giá'}
                        </button>
                    </form>
                </Card>

                <Card title="Kết quả">
                    {isLoading && <p>LLM đang suy nghĩ và đánh giá...</p>}
                    {results && (
                        <div className="results-section">
                            <h3 className="results-title">Phản hồi của Model</h3>
                            <div className="result-box" style={{
                                backgroundColor: 'var(--bg-secondary)', 
                                padding: '1rem', 
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                marginBottom: '1.5rem'
                            }}>
                                <p>{results.response}</p>
                            </div>

                            <h3 className="results-title" style={{ marginTop: '2rem' }}>Đánh giá từ LLM</h3>
                            <div>
                                {Object.entries(results.evaluation).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '1rem' }}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </strong>
                                        <span className="evaluation-badge" style={{ 
                                            backgroundColor: getScoreColor(value.score),
                                            color: 'white',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {value.score}
                                        </span>
                                        <p style={{ 
                                            margin: '0.5rem 0 0 0', 
                                            color: 'var(--light-text-color)', 
                                            fontStyle: 'italic' 
                                        }}>
                                            {value.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isLoading && !results && !error && (
                        <p>Nhập thông tin và nhấn nút để xem kết quả.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

// Helper function để chọn màu badge dựa trên điểm số
const getScoreColor = (score) => {
    switch (score) {
        case 5:
            return '#4CAF50'; // Green
        case 4:
            return '#2196F3'; // Blue
        case 3:
            return '#FF9800'; // Orange
        case 2:
            return '#4CAF50'; // Green
        case 1:
            return '#f44336'; // Red
        default:
            return '#9E9E9E'; // Gray
    }
};

export default SystemPromptTester;