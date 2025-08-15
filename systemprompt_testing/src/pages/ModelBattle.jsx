import React, { useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/apiService';

const ModelBattle = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        userMessage: '',
        longTermMemory: '',
        modelA: {
            modelName: '',
            systemPrompt: ''
        },
        modelB: {
            modelName: '',
            systemPrompt: ''
        }
    });

    const handleInputChange = (field, value, model = null) => {
        if (model) {
            setFormData(prev => ({
                ...prev,
                [model]: {
                    ...prev[model],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            const response = await apiService.battleModels(formData);
            setResults(response);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi gọi API');
            console.error('API Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderModelInputs = (modelId) => {
        const modelKey = modelId === 'A' ? 'modelA' : 'modelB';
        const modelData = formData[modelKey];

        return (
            <Card title={`Model ${modelId}`}>
                <div className="form-group">
                    <label htmlFor={`model-${modelId}`}>Chọn Model</label>
                    <select 
                        id={`model-${modelId}`} 
                        className="form-select"
                        value={modelData.modelName}
                        onChange={(e) => handleInputChange('modelName', e.target.value, modelKey)}
                    >
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4.1-nano">GPT 4.1 Nano</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="llama-3-8b">Llama 3 8B</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor={`system-prompt-${modelId}`}>System Prompt</label>
                    <textarea 
                        id={`system-prompt-${modelId}`} 
                        className="form-textarea" 
                        placeholder={`System prompt cho Model ${modelId}`}
                        value={modelData.systemPrompt}
                        onChange={(e) => handleInputChange('systemPrompt', e.target.value, modelKey)}
                        required
                    />
                </div>
            </Card>
        );
    };

    return (
        <div>
            <h1 className="page-title">Model Battle</h1>
            <p className="page-description">
                Cho hai model đối đầu với cùng một yêu cầu và để một LLM thứ ba quyết định người chiến thắng.
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
                <Card title="Yêu cầu chung">
                    <div className="form-group">
                        <label htmlFor="user-message">Message của người dùng</label>
                        <textarea 
                            id="user-message" 
                            className="form-textarea" 
                            placeholder="Ví dụ: Đề xuất một phương pháp để giải quyết bài toán dự báo chuỗi thời gian."
                            value={formData.userMessage}
                            onChange={(e) => handleInputChange('userMessage', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="long-term-memory">Long-term Memory (Chung cho cả hai)</label>
                        <textarea 
                            id="long-term-memory" 
                            className="form-textarea" 
                            placeholder="Thông tin nền dùng chung..."
                            value={formData.longTermMemory}
                            onChange={(e) => handleInputChange('longTermMemory', e.target.value)}
                        />
                    </div>
                </Card>
                
                <div className="two-column-layout" style={{marginTop: '2rem'}}>
                    {renderModelInputs('A')}
                    {renderModelInputs('B')}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isLoading} 
                        style={{padding: '1rem 2.5rem', fontSize: '1.2rem'}}
                    >
                        {isLoading ? <><LoadingSpinner /> Đang chiến đấu...</> : 'Bắt đầu đối đầu!'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <p>Các model đang suy nghĩ và so sánh...</p>
                </div>
            )}

            {results && (
                <div className="results-section">
                    <h2 className="results-title">Kết quả đối đầu</h2>
                    <div className="two-column-layout">
                        <Card title={`Phản hồi của ${formData.modelA.modelName}`}>
                            <div style={{
                                backgroundColor: 'var(--bg-secondary)',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <p>{results.answerA}</p>
                            </div>
                        </Card>
                        <Card title={`Phản hồi của ${formData.modelB.modelName}`}>
                            <div style={{
                                backgroundColor: 'var(--bg-secondary)',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <p>{results.answerB}</p>
                            </div>
                        </Card>
                    </div>

                    <div style={{marginTop: '2rem'}}>
                        <Card title="Phân tích & Đánh giá">
                            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                                <h4 style={{margin: 0}}>Người chiến thắng</h4>
                                <span className="evaluation-badge" style={{
                                    backgroundColor: getWinnerColor(results.evaluation.winner),
                                    color: 'white',
                                    fontSize: '1.2rem', 
                                    padding: '0.8rem 1.8rem',
                                    borderRadius: '8px',
                                    display: 'inline-block',
                                    marginTop: '0.5rem'
                                }}>
                                    🏆 {results.evaluation.winner}
                                </span>
                            </div>
                            <p><strong>Lý do:</strong> {results.evaluation.reason}</p>
                            <p><strong>Gợi ý cải thiện:</strong> {results.evaluation.suggestion}</p>
                            
                            <hr style={{
                                border: 'none', 
                                borderTop: '1px solid var(--border-color)', 
                                margin: '2rem 0'
                            }} />
                            
                            <h4>Chỉ số so sánh</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginTop: '1rem'
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    textAlign: 'center'
                                }}>
                                    <strong>Semantic Similarity</strong>
                                    <div style={{fontSize: '1.5rem', color: 'var(--primary-color)'}}>
                                        {results.metrics.semantic_similarity}
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    textAlign: 'center'
                                }}>
                                    <strong>ROUGE-L</strong>
                                    <div style={{fontSize: '1.5rem', color: 'var(--primary-color)'}}>
                                        {results.metrics.rouge_l}
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    textAlign: 'center'
                                }}>
                                    <strong>BLEU Score</strong>
                                    <div style={{fontSize: '1.5rem', color: 'var(--primary-color)'}}>
                                        {results.metrics.bleu}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function để chọn màu winner
const getWinnerColor = (winner) => {
    if (winner.includes('Model A') || winner.includes('gpt-4o-mini')) {
        return '#4CAF50'; // Green
    } else if (winner.includes('Model B') || winner.includes('gpt-4.1-nano')) {
        return '#2196F3'; // Blue
    } else if (winner.toLowerCase().includes('Tie')) {
        return '#FF9800'; // Orange
    }
    return '#9C27B0'; // Purple (default)
};

export default ModelBattle;