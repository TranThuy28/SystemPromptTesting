import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const ModelBattle = () => {
  const [battleConfig, setBattleConfig] = useState({
    model1: 'gpt-4.1-nano',
    model2: 'gpt-4o-mini',
    systemPrompt1: '',
    systemPrompt2: '',
    userMessage: '',
    longTermMemory1: '',
    longTermMemory2: '',
    result1: '',
    result2: '',
    battleResult: null,
    semanticSimilarity: null,
    rouge: null,
    bleu: null,
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

  const simulateBattleResult = () => {
    const outcomes = ['win', 'lose', 'draw'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    return {
      outcome: result,
      winner: result === 'win' ? 1 : result === 'lose' ? 2 : null,
      improvement: result === 'lose' ? "Model 1 nên cải thiện độ chi tiết và tính chính xác trong câu trả lời" : 
                   result === 'win' ? "Model 2 nên cải thiện tốc độ phản hồi và tính nhất quán" :
                   "Cả hai model đều có hiệu suất tương đương"
    };
  };

  const simulateMetrics = () => ({
    semantic: (Math.random() * 0.4 + 0.6).toFixed(3),
    rouge: (Math.random() * 0.3 + 0.5).toFixed(3),
    bleu: (Math.random() * 0.4 + 0.4).toFixed(3)
  });

  const handleModelBattle = async () => {
    setBattleConfig(prev => ({ ...prev, loading: true }));
    await simulateApiCall();
    
    const response1 = `[${battleConfig.model1}] Câu trả lời từ model 1: "${battleConfig.userMessage}" - Được xử lý với system prompt 1 và long-term memory tương ứng.`;
    const response2 = `[${battleConfig.model2}] Câu trả lời từ model 2: "${battleConfig.userMessage}" - Được xử lý với system prompt 2 và memory context khác.`;
    
    const battleResult = simulateBattleResult();
    const metrics = simulateMetrics();
    
    setBattleConfig(prev => ({
      ...prev,
      result1: response1,
      result2: response2,
      battleResult,
      semanticSimilarity: metrics.semantic,
      rouge: metrics.rouge,
      bleu: metrics.bleu,
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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Model Battle Arena</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Model 1 */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-blue-600 flex items-center">
            <span className="mr-2">🏆</span>
            Model 1
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <ModelSelect
              value={battleConfig.model1}
              onChange={(e) => setBattleConfig(prev => ({ ...prev, model1: e.target.value }))}
              options={models}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <TextArea
              value={battleConfig.systemPrompt1}
              onChange={(e) => setBattleConfig(prev => ({ ...prev, systemPrompt1: e.target.value }))}
              placeholder="System prompt cho model 1..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long-term Memory</label>
            <TextArea
              value={battleConfig.longTermMemory1}
              onChange={(e) => setBattleConfig(prev => ({ ...prev, longTermMemory1: e.target.value }))}
              placeholder="Long-term memory cho model 1..."
              rows={2}
            />
          </div>
          
          {battleConfig.result1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả Model 1</label>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                {battleConfig.result1}
              </div>
            </div>
          )}
        </div>
        
        {/* Model 2 */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-red-600 flex items-center">
            <span className="mr-2">🏆</span>
            Model 2
          </h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <ModelSelect
              value={battleConfig.model2}
              onChange={(e) => setBattleConfig(prev => ({ ...prev, model2: e.target.value }))}
              options={models}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <TextArea
              value={battleConfig.systemPrompt2}
              onChange={(e) => setBattleConfig(prev => ({ ...prev, systemPrompt2: e.target.value }))}
              placeholder="System prompt cho model 2..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long-term Memory</label>
            <TextArea
              value={battleConfig.longTermMemory2}
              onChange={(e) => setBattleConfig(prev => ({ ...prev, longTermMemory2: e.target.value }))}
              placeholder="Long-term memory cho model 2..."
              rows={2}
            />
          </div>
          
          {battleConfig.result2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kết quả Model 2</label>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                {battleConfig.result2}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Shared User Message */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">User Message (Chung cho cả 2 model)</label>
        <TextArea
          value={battleConfig.userMessage}
          onChange={(e) => setBattleConfig(prev => ({ ...prev, userMessage: e.target.value }))}
          placeholder="Nhập message từ user..."
          rows={3}
        />
      </div>
      
      <button
        onClick={handleModelBattle}
        disabled={battleConfig.loading}
        className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
      >
        {battleConfig.loading ? <LoadingSpinner /> : (
          <>
            <Zap size={20} />
            <span>Bắt đầu Battle</span>
          </>
        )}
      </button>
      
      {/* Battle Results */}
      {battleConfig.battleResult && (
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Kết quả Battle</h4>
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
              battleConfig.battleResult.outcome === 'win' ? 'bg-blue-100 text-blue-800' :
              battleConfig.battleResult.outcome === 'lose' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {battleConfig.battleResult.outcome === 'win' && '🏆 Model 1 Thắng'}
              {battleConfig.battleResult.outcome === 'lose' && '🏆 Model 2 Thắng'}
              {battleConfig.battleResult.outcome === 'draw' && '🤝 Hòa'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700 mb-1">Semantic Similarity</div>
              <div className="text-2xl font-bold text-green-800">{battleConfig.semanticSimilarity}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700 mb-1">ROUGE Score</div>
              <div className="text-2xl font-bold text-blue-800">{battleConfig.rouge}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">BLEU Score</div>
              <div className="text-2xl font-bold text-purple-800">{battleConfig.bleu}</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <span className="text-amber-500 mt-1 mr-2">⚠️</span>
              <div>
                <div className="font-semibold text-gray-800 mb-1">Đề xuất cải thiện:</div>
                <div className="text-gray-700">{battleConfig.battleResult.improvement}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelBattle;