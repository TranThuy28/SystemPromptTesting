// API Service để kết nối Frontend với Backend
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Utility method để handle API calls
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // System Prompt Tester API
    async testSystemPrompt(data) {
        return this.makeRequest('/system-prompt-tester', {
            method: 'POST',
            body: JSON.stringify({
                model: data.model,
                system_prompt: data.systemPrompt,
                user_message: data.userMessage,
                long_term_memory: data.longTermMemory || null
            })
        });
    }

    // Model Battle API
    async battleModels(data) {
        return this.makeRequest('/model-battle', {
            method: 'POST',
            body: JSON.stringify({
                model_a: {
                    model_name: data.modelA.modelName,
                    system_prompt: data.modelA.systemPrompt
                },
                model_b: {
                    model_name: data.modelB.modelName,
                    system_prompt: data.modelB.systemPrompt
                },
                user_message: data.userMessage,
                long_term_memory: data.longTermMemory || null
            })
        });
    }

    // Ground Truth Comparer API
    async compareGroundTruth(data) {
        return this.makeRequest('/ground-truth-comparer', {
            method: 'POST',
            body: JSON.stringify({
                ground_truth: data.groundTruth,
                prediction: data.prediction
            })
        });
    }

    // Health check
    async healthCheck() {
        return this.makeRequest('/health', {
            method: 'GET'
        });
    }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;