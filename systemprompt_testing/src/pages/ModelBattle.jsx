import React, { useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const ModelBattle = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);

        // Mô phỏng gọi API
        setTimeout(() => {
            setResults({
                answerA: "Để giải quyết vấn đề này, chúng ta nên tiếp cận một cách có hệ thống, bắt đầu bằng việc phân tích dữ liệu đầu vào và sau đó xây dựng một mô hình dự báo tuần tự.",
                answerB: "Cách tốt nhất là áp dụng phương pháp học sâu. Cụ thể, một mạng LSTM (Long Short-Term Memory) sẽ là lựa chọn tối ưu để nắm bắt các phụ thuộc thời gian trong dữ liệu của bạn.",
                evaluation: {
                    winner: 'Model B',
                    reason: 'Model B đưa ra một giải pháp cụ thể và kỹ thuật hơn (LSTM), phù hợp hơn với các bài toán dữ liệu tuần tự. Model A chỉ đưa ra một cách tiếp cận chung chung.',
                    suggestion: 'Để Model A cải thiện, nó cần đề xuất một kỹ thuật hoặc thuật toán cụ thể thay vì chỉ nói về một "hệ thống" chung chung.',
                },
                metrics: {
                    semantic_similarity: '0.78',
                    rouge_l: '0.65',
                    bleu: '0.59'
                }
            });
            setIsLoading(false);
        }, 2500);
    };

    const renderModelInputs = (modelId) => (
        <Card title={`Model ${modelId}`}>
            <div className="form-group">
                <label htmlFor={`model-${modelId}`}>Chọn Model</label>
                <select id={`model-${modelId}`} className="form-select" defaultValue={modelId === 'A' ? 'gemini-4.1-nano' : 'gpt-4o-mini'}>
                    <option value="gemini-4.1-nano">Gemini 4.1 Nano</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="llama-3-8b">Llama 3 8B</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor={`system-prompt-${modelId}`}>System Prompt</label>
                <textarea id={`system-prompt-${modelId}`} className="form-textarea" placeholder={`System prompt cho Model ${modelId}`}></textarea>
            </div>
        </Card>
    );

    return (
        <div>
            <h1 className="page-title">Model Battle</h1>
            <p className="page-description">
                Cho hai model đối đầu với cùng một yêu cầu và để một LLM thứ ba quyết định người chiến thắng.
            </p>
            <form onSubmit={handleSubmit}>
                <Card title="Yêu cầu chung">
                    <div className="form-group">
                        <label htmlFor="user-message">Message của người dùng</label>
                        <textarea id="user-message" className="form-textarea" placeholder="Ví dụ: Đề xuất một phương pháp để giải quyết bài toán dự báo chuỗi thời gian."></textarea>
                    </div>
                     <div className="form-group">
                        <label htmlFor="long-term-memory">Long-term Memory (Chung cho cả hai)</label>
                        <textarea id="long-term-memory" className="form-textarea" placeholder="Thông tin nền dùng chung..."></textarea>
                    </div>
                </Card>
                
                <div className="two-column-layout" style={{marginTop: '2rem'}}>
                    {renderModelInputs('A')}
                    {renderModelInputs('B')}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{padding: '1rem 2.5rem', fontSize: '1.2rem'}}>
                        {isLoading ? <><LoadingSpinner /> Đang chiến đấu...</> : 'Bắt đầu đối đầu!'}
                    </button>
                </div>
            </form>

            {isLoading && <div style={{textAlign: 'center', marginTop: '2rem'}}><p>Các model đang suy nghĩ...</p></div>}

            {results && (
                <div className="results-section">
                    <h2 className="results-title">Kết quả đối đầu</h2>
                    <div className="two-column-layout">
                        <Card title="Phản hồi của Model A">
                            <p>{results.answerA}</p>
                        </Card>
                        <Card title="Phản hồi của Model B">
                            <p>{results.answerB}</p>
                        </Card>
                    </div>

                    <div style={{marginTop: '2rem'}}>
                        <Card title="Phân tích & Đánh giá">
                             <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                                <h4 style={{margin: 0}}>Người chiến thắng</h4>
                                <span className="evaluation-badge" style={{backgroundColor: 'var(--success-color)', fontSize: '1.2rem', padding: '0.8rem 1.8rem'}}>
                                    {results.evaluation.winner}
                                </span>
                             </div>
                             <p><strong>Lý do:</strong> {results.evaluation.reason}</p>
                             <p><strong>Gợi ý cho bên thua:</strong> {results.evaluation.suggestion}</p>
                             <hr style={{border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0'}} />
                             <h4>Chỉ số so sánh</h4>
                             <ul>
                                <li><strong>Semantic Similarity:</strong> {results.metrics.semantic_similarity}</li>
                                <li><strong>ROUGE-L:</strong> {results.metrics.rouge_l}</li>
                                <li><strong>BLEU Score:</strong> {results.metrics.bleu}</li>
                             </ul>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelBattle;
