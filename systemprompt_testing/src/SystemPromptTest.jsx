import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const SystemPromptTest = () => {
  const [testConfig, setTestConfig] = useState({
    model: 'gpt-4.1-nano',
    systemPrompt: '',
    userMessage: '',
    longTermMemory: '',
    result: '',
    evaluation: null,
    loading: false
  });

  const models = [
    { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' }
  ];

  const simulateApiCall = (delay = 2000) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const simulateEvaluation = () => ({
    score: Math.floor(Math.random() * 40) + 60,
    consistency: Math.random() > 0.3,
    relevance: Math.random() > 0.2,
    clarity: Math.random() > 0.25,
    feedback: "Câu trả lời có tính nhất quán tốt, ngôn ngữ rõ ràng và phù hợp với context."
  });

  const handleSystemPromptTest = async () => {
    setTestConfig(prev => ({ ...prev, loading: true }));
    await simulateApiCall();
    
    const mockResponse = `Dựa trên system prompt và user message, đây là câu trả lời được tạo ra: "${testConfig.userMessage}" - Câu trả lời này được tạo với context từ long-term memory và tuân theo hướng dẫn trong system prompt.`;
    const evaluation = simulateEvaluation();
    
    setTestConfig(prev => ({
      ...prev,
      result: mockResponse,
      evaluation,
      loading: false
    }));
  };

  const ModelSelect = ({ value, onChange, options }) => (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );

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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">System Prompt Testing</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <ModelSelect
              value={testConfig.model}
              onChange={(e) => setTestConfig(prev => ({ ...prev, model: e.target.value }))}
              options={models}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <TextArea
              value={testConfig.systemPrompt}
              onChange={(e) => setTestConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
              placeholder="Nhập system prompt..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Message</label>
            <TextArea
              value={testConfig.userMessage}
              onChange={(e) => setTestConfig(prev => ({ ...prev, userMessage: e.target.value }))}
              placeholder="Nhập message từ user..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long-term Memory</label>
            <TextArea
              value={testConfig.longTermMemory}
              onChange={(e) => setTestConfig(prev => ({ ...prev, longTermMemory: e.target.value }))}
              placeholder="Nhập long-term memory context..."
              rows={2}
            />
          </div>
          
          <button
            onClick={handleSystemPromptTest}
            disabled={testConfig.loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {testConfig.loading ? <LoadingSpinner /> : (
              <>
                <MessageSquare size={20} />
                <span>Chạy Test</span>
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-4">
          {testConfig.result && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả từ Model</label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  {testConfig.result}
                </div>
              </div>
              
              {testConfig.evaluation && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-700">Score</div>
                      <div className="text-lg font-semibold text-green-800">{testConfig.evaluation.score}/100</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700">Nhất quán</div>
                      <div className="text-lg font-semibold text-blue-800">
                        {testConfig.evaluation.consistency ? '✓' : '✗'}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-700">Phù hợp</div>
                      <div className="text-lg font-semibold text-purple-800">
                        {testConfig.evaluation.relevance ? '✓' : '✗'}
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-700">Rõ ràng</div>
                      <div className="text-lg font-semibold text-orange-800">
                        {testConfig.evaluation.clarity ? '✓' : '✗'}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700 mb-1">Feedback:</div>
                    <div className="text-gray-800">{testConfig.evaluation.feedback}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemPromptTest;