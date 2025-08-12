import React, { useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

const GroundTruthComparer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResults(null);

        // Simulate API call
        setTimeout(() => {
            setResults({
                summary: "Prediction khá gần với Ground Truth về mặt nội dung, nhưng thiếu sự tự nhiên trong cách diễn đạt và không nắm bắt được sắc thái tình cảm của người dùng.",
                suggestions: [
                    "Cải thiện khả năng hiểu ngữ cảnh: Prediction cần nhận ra sự thất vọng của người dùng ở lượt thoại thứ hai.",
                    "Sử dụng ngôn ngữ tự nhiên hơn: Thay vì 'Tiến hành hủy đơn hàng', có thể dùng 'Được ạ, tôi sẽ tiến hành hủy đơn hàng ngay cho bạn'.",
                    "Thêm yếu tố đồng cảm: Thể hiện sự đồng cảm với vấn đề của khách hàng, ví dụ: 'Tôi rất tiếc khi nghe về sự cố này.'."
                ]
            });
            setIsLoading(false);
        }, 2000);
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
            <form onSubmit={handleSubmit}>
                <div className="two-column-layout">
                    <Card title="Ground Truth (Mẫu)">
                        <div className="form-group">
                            <label htmlFor="ground-truth">Dán lịch sử hội thoại mẫu vào đây</label>
                            <textarea
                                id="ground-truth"
                                className="form-textarea"
                                style={{ minHeight: '300px' }}
                                defaultValue={placeholderGroundTruth}
                            ></textarea>
                        </div>
                    </Card>
                    <Card title="Prediction (Kết quả từ Model)">
                        <div className="form-group">
                            <label htmlFor="prediction">Dán lịch sử hội thoại của model vào đây</label>
                            <textarea
                                id="prediction"
                                className="form-textarea"
                                style={{ minHeight: '300px' }}
                                defaultValue={placeholderPrediction}
                            ></textarea>
                        </div>
                    </Card>
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <><LoadingSpinner /> Đang so sánh...</> : 'So sánh và Đánh giá'}
                    </button>
                </div>
            </form>

            {isLoading && <div style={{textAlign: 'center', marginTop: '2rem'}}><p>LLM đang phân tích...</p></div>}

            {results && (
                <div className="results-section">
                    <Card title="Phân tích so sánh">
                        <h4 style={{marginTop: 0}}>Tóm tắt</h4>
                        <p>{results.summary}</p>
                        <h4>Gợi ý cải thiện cho Prediction:</h4>
                        <ul>
                            {results.suggestions.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default GroundTruthComparer;
