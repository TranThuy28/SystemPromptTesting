import React, { useState } from 'react';
import { MessageSquare, Zap, Target, Send, ArrowRight, Trophy, AlertCircle, Sparkles, Brain, GitCompare } from 'lucide-react';

const LLMEvaluationTool = () => {
  const [activeTab, setActiveTab] = useState('test');
  
  // Tab 1: System Prompt Testing
  const [testConfig, setTestConfig] = useState({
    model: 'gpt-4.1-nano',
    systemPrompt: '',
    userMessage: '',
    longTermMemory: '',
    result: '',
    evaluation: null,
    loading: false
  });

  // Tab 2: Model Battle
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

  // Tab 3: Ground Truth Comparison
  const [comparisonConfig, setComparisonConfig] = useState({
    groundTruthHistory: '',
    predictionHistory: '',
    evaluation: null,
    recommendations: '',
    loading: false
  });

  const models = [
    { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano', color: 'from-green-400 to-green-600' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', color: 'from-blue-400 to-blue-600' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku', color: 'from-purple-400 to-purple-600' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', color: 'from-indigo-400 to-indigo-600' },
    { value: 'gemini-pro', label: 'Gemini Pro', color: 'from-orange-400 to-orange-600' }
  ];

  // Simulated API calls
  const simulateApiCall = (delay = 2000) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  const simulateEvaluation = () => ({
    score: Math.floor(Math.random() * 40) + 60,
    consistency: Math.random() > 0.3,
    relevance: Math.random() > 0.2,
    clarity: Math.random() > 0.25,
    creativity: Math.random() > 0.4,
    accuracy: Math.random() > 0.35,
    feedback: "Câu trả lời thể hiện tính nhất quán cao, ngôn ngữ rõ ràng và phù hợp với context được cung cấp. Có thể cải thiện thêm về độ sáng tạo trong cách diễn đạt."
  });

  const simulateBattleResult = () => {
    const outcomes = ['win', 'lose', 'draw'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    return {
      outcome: result,
      winner: result === 'win' ? 1 : result === 'lose' ? 2 : null,
      improvement: result === 'lose' ? 
        "Model 1 nên cải thiện độ chi tiết và tính chính xác trong câu trả lời, đồng thời tăng cường khả năng hiểu context" : 
        result === 'win' ? 
        "Model 2 nên cải thiện tốc độ phản hồi, tính nhất quán và độ phù hợp với yêu cầu người dùng" :
        "Cả hai model đều có hiệu suất tương đương, có thể tối ưu thêm về tốc độ xử lý"
    };
  };

  const simulateMetrics = () => ({
    semantic: (Math.random() * 0.4 + 0.6).toFixed(3),
    rouge: (Math.random() * 0.3 + 0.5).toFixed(3),
    bleu: (Math.random() * 0.4 + 0.4).toFixed(3)
  });

  // Tab 1: System Prompt Testing Handler
  const handleSystemPromptTest = async () => {
    if (!testConfig.systemPrompt.trim() || !testConfig.userMessage.trim()) {
      alert('Vui lòng nhập đầy đủ System Prompt và User Message');
      return;
    }

    setTestConfig(prev => ({ ...prev, loading: true }));
    await simulateApiCall();
    
    const mockResponse = `Dựa trên system prompt: "${testConfig.systemPrompt.substring(0, 50)}..." và user message: "${testConfig.userMessage}", tôi sẽ trả lời một cách chi tiết và phù hợp. ${testConfig.longTermMemory ? 'Dựa vào thông tin long-term memory được cung cấp, ' : ''}đây là phản hồi được tối ưu hóa theo hướng dẫn trong system prompt.`;
    
    const evaluation = simulateEvaluation();
    
    setTestConfig(prev => ({
      ...prev,
      result: mockResponse,
      evaluation,
      loading: false
    }));
  };

  // Tab 2: Model Battle Handler
  const handleModelBattle = async () => {
    if (!battleConfig.userMessage.trim()) {
      alert('Vui lòng nhập User Message');
      return;
    }

    setBattleConfig(prev => ({ ...prev, loading: true }));
    await simulateApiCall(3000);
    
    const response1 = `[${battleConfig.model1}] Phản hồi từ model 1 cho câu hỏi: "${battleConfig.userMessage}". Được xử lý với system prompt và long-term memory riêng biệt. Model này tập trung vào độ chính xác và tính logic trong câu trả lời.`;
    const response2 = `[${battleConfig.model2}] Phản hồi từ model 2 cho câu hỏi: "${battleConfig.userMessage}". Sử dụng approach khác với context và memory khác nhau. Model này chú trọng tính sáng tạo và khả năng diễn đạt.`;
    
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

  // Tab 3: Ground Truth Comparison Handler
  const handleGroundTruthComparison = async () => {
    if (!comparisonConfig.groundTruthHistory.trim() || !comparisonConfig.predictionHistory.trim()) {
      alert('Vui lòng nhập đầy đủ cả Ground Truth và Prediction History');
      return;
    }

    setComparisonConfig(prev => ({ ...prev, loading: true }));
    await simulateApiCall(2500);
    
    const evaluation = {
      similarity: (Math.random() * 0.4 + 0.6).toFixed(3),
      contextMatch: Math.random() > 0.3,
      responseQuality: Math.floor(Math.random() * 30) + 70,
      coherence: Math.floor(Math.random() * 25) + 75,
      factuality: Math.floor(Math.random() * 20) + 80
    };
    
    const recommendations = `Phân tích chi tiết để cải thiện prediction:

🎯 **Điểm mạnh hiện tại:**
• Độ tương đồng semantic đạt ${evaluation.similarity}
• Context matching: ${evaluation.contextMatch ? 'Tốt' : 'Cần cải thiện'}
• Chất lượng response: ${evaluation.responseQuality}/100

📈 **Khuyến nghị cải thiện:**
1. **Context Understanding**: Tăng cường khả năng hiểu ngữ cảnh sâu hơn
2. **Response Consistency**: Đảm bảo tính nhất quán trong tone và style
3. **Detail Level**: Cân bằng độ chi tiết phù hợp với từng loại câu hỏi
4. **Memory Utilization**: Tối ưu việc sử dụng conversation history
5. **Factual Accuracy**: Kiểm tra và xác minh thông tin trước khi phản hồi`;
    
    setComparisonConfig(prev => ({
      ...prev,
      evaluation,
      recommendations,
      loading: false
    }));
  };

  // Enhanced UI Components
  const TabButton = ({ id, icon: Icon, label, isActive, onClick, gradient }) => (
    <button
      onClick={onClick}
      className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? `bg-gradient-to-r ${gradient} text-white shadow-xl shadow-blue-500/25` 
          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 hover:shadow-lg border border-gray-200/50'
      }`}
    >
      <Icon size={22} className={`${isActive ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform duration-300`} />
      <span className="font-medium">{label}</span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      )}
    </button>
  );

  const ModernInput = ({ label, value, onChange, placeholder, type = "text", rows, icon: Icon, gradient = "from-blue-500 to-purple-600" }) => (
    <div className="group">
      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
        {Icon && <Icon size={16} className={`text-transparent bg-gradient-to-r ${gradient} bg-clip-text`} />}
        <span>{label}</span>
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none transition-all duration-300 hover:shadow-md focus:shadow-xl text-gray-800 placeholder-gray-400"
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-xl text-gray-800 cursor-pointer"
        >
          {placeholder}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-xl text-gray-800 placeholder-gray-400"
        />
      )}
    </div>
  );

  const ActionButton = ({ onClick, loading, children, gradient = "from-blue-600 to-purple-600", disabled = false }) => (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`group relative w-full bg-gradient-to-r ${gradient} text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center justify-center space-x-3">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
            <span>Đang xử lý...</span>
          </>
        ) : (
          children
        )}
      </div>
    </button>
  );

  const ResultCard = ({ title, children, gradient = "from-gray-50 to-white" }) => (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100/50 hover:shadow-2xl transition-all duration-300`}>
      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Sparkles className="mr-2 text-amber-500" size={20} />
        {title}
      </h4>
      {children}
    </div>
  );

  const MetricCard = ({ label, value, icon: Icon, color, description }) => (
    <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`${color} group-hover:scale-110 transition-transform duration-300`} size={24} />
        <div className={`text-2xl font-bold bg-gradient-to-r ${color.replace('text-', 'from-').replace('-500', '-500 to-').replace('-500 to-', '-500 to-').concat('-600')} bg-clip-text text-transparent`}>
          {value}
        </div>
      </div>
      <div className="text-sm font-semibold text-gray-700 mb-1">{label}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );

  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 mb-4"></div>
        <div className="text-gray-700 font-medium">AI đang phân tích...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <Brain className="text-blue-600 animate-pulse" size={24} />
            <span className="text-sm font-semibold text-gray-700">AI-Powered Evaluation</span>
          </div>
          <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text mb-4">
            LLM Evaluation Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nền tảng đánh giá và so sánh hiệu suất Large Language Models với công nghệ AI tiên tiến
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <TabButton
            id="test"
            icon={MessageSquare}
            label="System Prompt Test"
            isActive={activeTab === 'test'}
            onClick={() => setActiveTab('test')}
            gradient="from-blue-600 to-cyan-600"
          />
          <TabButton
            id="battle"
            icon={Zap}
            label="Model Battle Arena"
            isActive={activeTab === 'battle'}
            onClick={() => setActiveTab('battle')}
            gradient="from-purple-600 to-pink-600"
          />
          <TabButton
            id="comparison"
            icon={GitCompare}
            label="Ground Truth Analysis"
            isActive={activeTab === 'comparison'}
            onClick={() => setActiveTab('comparison')}
            gradient="from-emerald-600 to-teal-600"
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {/* Tab 1: System Prompt Testing */}
          {activeTab === 'test' && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <Brain className="mr-3 text-blue-600" size={28} />
                    Cấu hình Test
                  </h3>
                  
                  <div className="space-y-6">
                    <ModernInput
                      label="Model AI"
                      value={testConfig.model}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, model: e.target.value }))}
                      type="select"
                      icon={Sparkles}
                      placeholder={models.map(model => (
                        <option key={model.value} value={model.value}>{model.label}</option>
                      ))}
                    />
                    
                    <ModernInput
                      label="System Prompt"
                      value={testConfig.systemPrompt}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                      placeholder="Nhập system prompt để định hướng hành vi của AI..."
                      type="textarea"
                      rows={4}
                      icon={MessageSquare}
                    />
                    
                    <ModernInput
                      label="User Message"
                      value={testConfig.userMessage}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, userMessage: e.target.value }))}
                      placeholder="Nhập câu hỏi hoặc yêu cầu từ người dùng..."
                      type="textarea"
                      rows={3}
                      icon={Send}
                    />
                    
                    <ModernInput
                      label="Long-term Memory (Optional)"
                      value={testConfig.longTermMemory}
                      onChange={(e) => setTestConfig(prev => ({ ...prev, longTermMemory: e.target.value }))}
                      placeholder="Thông tin bối cảnh hoặc lịch sử hội thoại..."
                      type="textarea"
                      rows={3}
                      icon={Brain}
                    />
                    
                    <ActionButton
                      onClick={handleSystemPromptTest}
                      loading={testConfig.loading}
                      gradient="from-blue-600 to-purple-600"
                    >
                      <MessageSquare size={20} />
                      <span>Bắt đầu phân tích</span>
                      <ArrowRight size={20} />
                    </ActionButton>
                  </div>
                </div>
              </div>
              
              <div className="xl:col-span-3 space-y-6">
                {testConfig.result && (
                  <>
                    <ResultCard title="Kết quả từ AI Model" gradient="from-blue-50 to-indigo-50">
                      <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100 mb-4">
                        <div className="text-gray-800 leading-relaxed">{testConfig.result}</div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${models.find(m => m.value === testConfig.model)?.color} mr-2`}></div>
                        Model: {models.find(m => m.value === testConfig.model)?.label}
                      </div>
                    </ResultCard>
                    
                    {testConfig.evaluation && (
                      <ResultCard title="Đánh giá chất lượng" gradient="from-emerald-50 to-teal-50">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          <MetricCard
                            label="Điểm tổng"
                            value={`${testConfig.evaluation.score}/100`}
                            icon={Trophy}
                            color="text-amber-500"
                            description="Đánh giá tổng thể"
                          />
                          <MetricCard
                            label="Nhất quán"
                            value={testConfig.evaluation.consistency ? '✓' : '✗'}
                            icon={Brain}
                            color={testConfig.evaluation.consistency ? "text-green-500" : "text-red-500"}
                            description="Tính logic"
                          />
                          <MetricCard
                            label="Phù hợp"
                            value={testConfig.evaluation.relevance ? '✓' : '✗'}
                            icon={Target}
                            color={testConfig.evaluation.relevance ? "text-blue-500" : "text-red-500"}
                            description="Đúng chủ đề"
                          />
                          <MetricCard
                            label="Rõ ràng"
                            value={testConfig.evaluation.clarity ? '✓' : '✗'}
                            icon={Sparkles}
                            color={testConfig.evaluation.clarity ? "text-purple-500" : "text-red-500"}
                            description="Dễ hiểu"
                          />
                          <MetricCard
                            label="Sáng tạo"
                            value={testConfig.evaluation.creativity ? '✓' : '✗'}
                            icon={Sparkles}
                            color={testConfig.evaluation.creativity ? "text-pink-500" : "text-red-500"}
                            description="Độc đáo"
                          />
                          <MetricCard
                            label="Chính xác"
                            value={testConfig.evaluation.accuracy ? '✓' : '✗'}
                            icon={Target}
                            color={testConfig.evaluation.accuracy ? "text-indigo-500" : "text-red-500"}
                            description="Đúng sự thật"
                          />
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                          <div className="flex items-start">
                            <AlertCircle className="text-amber-600 mt-1 mr-3 flex-shrink-0" size={20} />
                            <div>
                              <div className="font-semibold text-amber-800 mb-1">Phản hồi chi tiết:</div>
                              <div className="text-amber-700 text-sm leading-relaxed">{testConfig.evaluation.feedback}</div>
                            </div>
                          </div>
                        </div>
                      </ResultCard>
                    )}
                  </>
                )}
                
                {testConfig.loading && <LoadingOverlay />}
                
                {!testConfig.result && !testConfig.loading && (
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/50">
                    <MessageSquare className="mx-auto mb-4 text-gray-400" size={64} />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">Sẵn sàng để phân tích</h4>
                    <p className="text-gray-500">Điền thông tin bên trái và nhấn "Bắt đầu phân tích" để xem kết quả</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Model Battle */}
          {activeTab === 'battle' && (
            <div className="space-y-8">
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50">
                <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center">
                  <Zap className="mr-3 text-purple-600" size={32} />
                  Model Battle Arena
                  <Trophy className="ml-3 text-amber-500" size={32} />
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Model 1 */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200/50">
                    <h4 className="text-xl font-bold text-blue-700 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      Model Champion
                    </h4>
                    
                    <div className="space-y-4">
                      <ModernInput
                        label="Model"
                        value={battleConfig.model1}
                        onChange={(e) => setBattleConfig(prev => ({ ...prev, model1: e.target.value }))}
                        type="select"
                        placeholder={models.map(model => (
                          <option key={model.value} value={model.value}>{model.label}</option>
                        ))}
                        gradient="from-blue-500 to-blue-600"
                      />
                      
                      <ModernInput
                        label="System Prompt"
                        value={battleConfig.systemPrompt1}
                        onChange={(e) => setBattleConfig(prev => ({ ...prev, systemPrompt1: e.target.value }))}
                        placeholder="System prompt cho model 1..."
                        type="textarea"
                        rows={3}
                        gradient="from-blue-500 to-blue-600"
                      />
                      
                      <ModernInput
                        label="Long-term Memory"
                        value={battleConfig.longTermMemory1}
                        onChange={(e) => setBattleConfig(prev => ({ ...prev, longTermMemory1: e.target.value }))}
                        placeholder="Memory context cho model 1..."
                        type="textarea"
                        rows={2}
                        gradient="from-blue-500 to-blue-600"
                      />
                    </div>

                    {battleConfig.result1 && (
                      <div className="mt-4 p-4 bg-blue-100/50 rounded-xl border border-blue-200">
                        <div className="text-blue-900 text-sm leading-relaxed">{battleConfig.result1}</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Model 2 */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200/50">
                    <h4 className="text-xl font-bold text-red-700 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      Model Challenger
                    </h4>
                    
                    <div className="space-y-4">
                      <ModernInput
                        label="Model"
                        value={battleConfig.model2}
                        onChange={(e) => setBattleConfig(prev => ({ ...prev, model2: e.target.value }))}
                        type="select"
                        placeholder={models.map(model => (
                          <option key={model.value} value={model.value}>{model.label}</option>
                        ))}
                        gradient="from-red-500 to-red-600"
                      />
                      
                      <ModernInput
                        label="System Prompt"
                        value={battleConfig.systemPrompt2}
                        onChange={(e) => setBattleConfig(prev => ({ ...prev, systemPrompt2: e.target.value }))}
                        placeholder="System prompt cho model 2..."
                        type="textarea"
                        rows={3}
                        gradient="from-red-500 to-red-600"
                      />
                      
                      <ModernInput
                        label="Long-term Memory"
                        value={battleConfig.longTermMemory2}
                        onChange={(e) => setBattleConfig(prev => ({ ...prev, longTermMemory2: e.target.value }))}
                        placeholder="Memory context cho model 2..."
                        type="textarea"
                        rows={2}
                        gradient="from-red-500 to-red-600"
                      />
                    </div>

                    {battleConfig.result2 && (
                      <div className="mt-4 p-4 bg-red-100/50 rounded-xl border border-red-200">
                        <div className="text-red-900 text-sm leading-relaxed">{battleConfig.result2}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shared User Message */}
                <div className="mb-8">
                  <ModernInput
                    label="User Message (Chung cho cả 2 model)"
                    value={battleConfig.userMessage}
                    onChange={(e) => setBattleConfig(prev => ({ ...prev, userMessage: e.target.value }))}
                    placeholder="Nhập câu hỏi để so sánh giữa 2 model..."
                    type="textarea"
                    rows={3}
                    icon={Send}
                    gradient="from-purple-500 to-pink-600"
                  />
                </div>
                
                <ActionButton
                  onClick={handleModelBattle}
                  loading={battleConfig.loading}
                  gradient="from-purple-600 to-pink-600"
                >
                  <Zap size={24} />
                  <span>Bắt đầu Battle</span>
                  <Trophy size={24} />
                </ActionButton>
                
                {/* Battle Results */}
                {battleConfig.battleResult && (
                  <div className="mt-8 space-y-6">
                    <div className="text-center">
                      <h4 className="text-3xl font-bold mb-6">🏆 Kết quả Battle</h4>
                      <div className={`inline-flex items-center px-8 py-4 rounded-2xl text-xl font-bold shadow-xl ${
                        battleConfig.battleResult.outcome === 'win' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                        battleConfig.battleResult.outcome === 'lose' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                        'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      }`}>
                        {battleConfig.battleResult.outcome === 'win' && '🎉 Model 1 Champion!'}
                        {battleConfig.battleResult.outcome === 'lose' && '🔥 Model 2 Victory!'}
                        {battleConfig.battleResult.outcome === 'draw' && '⚖️ Epic Draw!'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <MetricCard
                        label="Semantic Similarity"
                        value={battleConfig.semanticSimilarity}
                        icon={Brain}
                        color="text-emerald-500"
                        description="Độ tương đồng ngữ nghĩa"
                      />
                      <MetricCard
                        label="ROUGE Score"
                        value={battleConfig.rouge}
                        icon={Target}
                        color="text-blue-500"
                        description="Overlap n-gram quality"
                      />
                      <MetricCard
                        label="BLEU Score"
                        value={battleConfig.bleu}
                        icon={Sparkles}
                        color="text-purple-500"
                        description="Translation quality metric"
                      />
                    </div>
                    
                    <ResultCard title="Phân tích và đề xuất" gradient="from-amber-50 to-orange-50">
                      <div className="flex items-start">
                        <AlertCircle className="text-amber-600 mt-1 mr-4 flex-shrink-0" size={24} />
                        <div>
                          <div className="font-bold text-amber-800 mb-2 text-lg">💡 Insight & Improvement:</div>
                          <div className="text-amber-700 leading-relaxed">{battleConfig.battleResult.improvement}</div>
                        </div>
                      </div>
                    </ResultCard>
                  </div>
                )}
                
                {battleConfig.loading && <LoadingOverlay />}
              </div>
            </div>
          )}

          {/* Tab 3: Ground Truth Comparison */}
          {activeTab === 'comparison' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <GitCompare className="mr-3 text-emerald-600" size={28} />
                    Input Data
                  </h3>
                  
                  <div className="space-y-6">
                    <ModernInput
                      label="Ground Truth Conversation"
                      value={comparisonConfig.groundTruthHistory}
                      onChange={(e) => setComparisonConfig(prev => ({ ...prev, groundTruthHistory: e.target.value }))}
                      placeholder="User: Xin chào
Assistant: Xin chào! Tôi có thể giúp gì cho bạn?
User: Bạn có thể giải thích về AI không?
Assistant: AI hay Trí tuệ Nhân tạo là..."
                      type="textarea"
                      rows={10}
                      icon={Target}
                      gradient="from-emerald-500 to-teal-600"
                    />
                    
                    <ModernInput
                      label="Model Prediction"
                      value={comparisonConfig.predictionHistory}
                      onChange={(e) => setComparisonConfig(prev => ({ ...prev, predictionHistory: e.target.value }))}
                      placeholder="User: Xin chào
Assistant: Chào bạn! Tôi sẵn sàng hỗ trợ bạn.
User: Bạn có thể giải thích về AI không?
Assistant: AI là công nghệ mô phỏng trí tuệ con người..."
                      type="textarea"
                      rows={10}
                      icon={Brain}
                      gradient="from-blue-500 to-indigo-600"
                    />
                    
                    <ActionButton
                      onClick={handleGroundTruthComparison}
                      loading={comparisonConfig.loading}
                      gradient="from-emerald-600 to-teal-600"
                    >
                      <GitCompare size={20} />
                      <span>Phân tích so sánh</span>
                      <ArrowRight size={20} />
                    </ActionButton>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {comparisonConfig.evaluation && (
                  <>
                    <ResultCard title="Kết quả phân tích" gradient="from-emerald-50 to-teal-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <MetricCard
                          label="Similarity Score"
                          value={comparisonConfig.evaluation.similarity}
                          icon={Target}
                          color="text-emerald-500"
                          description="Độ tương đồng tổng thể"
                        />
                        <MetricCard
                          label="Context Match"
                          value={comparisonConfig.evaluation.contextMatch ? '✓' : '✗'}
                          icon={Brain}
                          color={comparisonConfig.evaluation.contextMatch ? "text-green-500" : "text-red-500"}
                          description="Phù hợp context"
                        />
                        <MetricCard
                          label="Response Quality"
                          value={`${comparisonConfig.evaluation.responseQuality}/100`}
                          icon={Sparkles}
                          color="text-purple-500"
                          description="Chất lượng phản hồi"
                        />
                        <MetricCard
                          label="Coherence"
                          value={`${comparisonConfig.evaluation.coherence}/100`}
                          icon={MessageSquare}
                          color="text-blue-500"
                          description="Tính mạch lạc"
                        />
                      </div>
                    </ResultCard>
                    
                    <ResultCard title="Khuyến nghị cải thiện" gradient="from-amber-50 to-yellow-50">
                      <div className="bg-white/70 p-6 rounded-xl border border-amber-200">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {comparisonConfig.recommendations}
                        </div>
                      </div>
                    </ResultCard>
                  </>
                )}
                
                {comparisonConfig.loading && <LoadingOverlay />}
                
                {!comparisonConfig.evaluation && !comparisonConfig.loading && (
                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/50">
                    <GitCompare className="mx-auto mb-4 text-gray-400" size={64} />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">Chờ dữ liệu phân tích</h4>
                    <p className="text-gray-500">Nhập cả Ground Truth và Prediction để bắt đầu so sánh</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LLMEvaluationTool;