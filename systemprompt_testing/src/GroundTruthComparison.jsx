import React, { useState } from 'react';
import { Target } from 'lucide-react';

const GroundTruthComparison = () => {
  const [comparisonConfig, setComparisonConfig] = useState({
    groundTruthHistory: '',
    predictionHistory: '',
    evaluation: null,
    recommendations: '',
    loading: false
  });

  const simulateApiCall = (delay = 2000) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const handleGroundTruthComparison = async () => {
    setComparisonConfig(prev => ({ ...prev, loading: true }));
    await simulateApiCall();
    
    const evaluation = {
      similarity: (Math.random() * 0.4 + 0.6).toFixed(3),
      contextMatch: Math.random() > 0.3,
      responseQuality: Math.floor(Math.random() * 30) + 70
    };
    
    const recommendations = "Để prediction gần ground truth hơn:\n1. Cải thiện context understanding\n2. Tăng độ chi tiết trong câu trả lời\n3. Đảm bảo tính nhất quán trong tone và style\n4. Sử dụng thêm thông tin từ conversation history";
    
    setComparisonConfig(prev => ({
      ...prev,
      evaluation,
      recommendations,
      loading: false
    }));
  };

  const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
    />
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span>Đang xử lý...</span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Ground Truth vs Prediction Comparison</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ground Truth Conversation History</label>
            <TextArea
              value={comparisonConfig.groundTruthHistory}
              onChange={(e) => setComparisonConfig(prev => ({ ...prev, groundTruthHistory: e.target.value }))}
              placeholder="User: Xin chào
Assistant: Xin chào! Tôi có thể giúp gì cho bạn?
User: Bạn có thể giải thích về AI không?
Assistant: AI hay Trí tuệ Nhân tạo là..."
              rows={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model Prediction History</label>
            <TextArea
              value={comparisonConfig.predictionHistory}
              onChange={(e) => setComparisonConfig(prev => ({ ...prev, predictionHistory: e.target.value }))}
              placeholder="User: Xin chào
Assistant: Chào bạn! Tôi sẵn sàng hỗ trợ bạn.
User: Bạn có thể giải thích về AI không?
Assistant: AI là công nghệ mô phỏng trí tuệ con người..."
              rows={8}
            />
          </div>
          
          <button
            onClick={handleGroundTruthComparison}
            disabled={comparisonConfig.loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {comparisonConfig.loading ? <LoadingSpinner /> : (
              <>
                <Target size={20} />
                <span>So sánh với Ground Truth</span>
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-4">
          {comparisonConfig.evaluation && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Kết quả đánh giá</label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 mb-1">Similarity Score</div>
                    <div className="text-2xl font-bold text-green-800">{comparisonConfig.evaluation.similarity}</div>
                    <div className="text-sm text-green-600 mt-1">Độ tương đồng tổng thể</div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 mb-1">Context Match</div>
                    <div className="text-2xl font-bold text-blue-800">
                      {comparisonConfig.evaluation.contextMatch ? '✓' : '✗'}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">Phù hợp về context</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-700 mb-1">Response Quality</div>
                    <div className="text-2xl font-bold text-purple-800">
                      {comparisonConfig.evaluation.responseQuality}/100
                    </div>
                    <div className="text-sm text-purple-600 mt-1">Chất lượng phản hồi</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đề xuất cải thiện</label>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start">
                    <span className="text-amber-600 mt-1 mr-2 flex-shrink-0">⚠️</span>
                    <div className="whitespace-pre-line text-amber-800">{comparisonConfig.recommendations}</div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {!comparisonConfig.evaluation && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Target size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Nhập conversation histories và nhấn "So sánh" để xem kết quả</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundTruthComparison;