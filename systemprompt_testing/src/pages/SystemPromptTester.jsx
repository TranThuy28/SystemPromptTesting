import React, { useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const SystemPromptTester = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);

        // Mô phỏng gọi API
        setTimeout(() => {
            setResults({
                response: "Chào bạn, tôi là một mô hình ngôn ngữ lớn được đào tạo bởi Google. Tôi có thể giúp gì cho bạn hôm nay? Tôi nhận thấy bạn đang muốn kiểm tra khả năng của tôi trong việc duy trì một giọng văn chuyên nghiệp và hữu ích. Tôi sẽ cố gắng hết sức để đáp ứng yêu cầu của bạn.",
                evaluation: {
                    consistency: { score: 'Tốt', comment: 'Ngôn ngữ nhất quán, duy trì giọng điệu chuyên nghiệp và thân thiện xuyên suốt câu trả lời.' },
                    relevance: { score: 'Xuất sắc', comment: 'Câu trả lời trực tiếp và liên quan đến vai trò được xác định trong system prompt.' },
                    tone: { score: 'Tốt', comment: 'Giọng điệu phù hợp, thể hiện sự hữu ích và chuyên nghiệp.' },
                    safety: { score: 'An toàn', comment: 'Không chứa nội dung gây hại hoặc không phù hợp.' }
                }
            });
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div>
            <h1 className="page-title">System Prompt Tester</h1>
            <p className="page-description">
                Đánh giá hiệu quả của system prompt bằng cách nhận phản hồi từ mô hình và một LLM đánh giá khác.
            </p>
            <div className="two-column-layout">
                <Card title="Cấu hình">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="model">Chọn Model</label>
                            <select id="model" className="form-select">
                                <option value="gemini-4.1-nano">Gemini 4.1 Nano</option>
                                <option value="gpt-4o-mini">GPT-4o Mini</option>
                                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="system-prompt">System Prompt</label>
                            <textarea id="system-prompt" className="form-textarea" placeholder="Ví dụ: Bạn là một trợ lý ảo chuyên nghiệp, luôn trả lời một cách lịch sự và hữu ích."></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="user-message">Message của người dùng</label>
                            <textarea id="user-message" className="form-textarea" placeholder="Ví dụ: Chào bạn, bạn là ai?"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="long-term-memory">Long-term Memory (Tùy chọn)</label>
                            <textarea id="long-term-memory" className="form-textarea" placeholder="Ví dụ: Tên người dùng là An."></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? <><LoadingSpinner /> Đang xử lý...</> : 'Tạo và Đánh giá'}
                        </button>
                    </form>
                </Card>

                <Card title="Kết quả">
                    {isLoading && <p>Đang chờ kết quả...</p>}
                    {results && (
                        <div className="results-section">
                            <h3 className="results-title">Phản hồi của Model</h3>
                            <div className="result-box">
                                <p>{results.response}</p>
                            </div>

                            <h3 className="results-title" style={{ marginTop: '2rem' }}>Đánh giá từ LLM</h3>
                            <div>
                                {Object.entries(results.evaluation).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '1rem' }}>
                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}: </strong>
                                        <span className="evaluation-badge" style={{ backgroundColor: 'var(--success-color)' }}>{value.score}</span>
                                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--light-text-color)' }}><em>{value.comment}</em></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isLoading && !results && <p>Nhập thông tin và nhấn nút để xem kết quả.</p>}
                </Card>
            </div>
        </div>
    );
};

export default SystemPromptTester;
