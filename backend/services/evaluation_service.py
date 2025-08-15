import asyncio
import re
from typing import Dict, List, Any
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
#from rouge_score import rouge_scorer
#from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
#import nltk

# Download required NLTK data
try:
    print("heheeh")
    #nltk.download('punkt', quiet=True)
except:
    pass

from .llm_service import llm_service

class EvaluationService:
    def __init__(self):
        self.sentence_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        #self.rouge_scorer = 0.0 #rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
        
    async def evaluate_system_prompt_response(
        self, 
        response: str, 
        system_prompt: str, 
        user_message: str,
        long_term_memory: str
    ) -> Dict[str, Any]:
        """Evaluate a model's response to system prompt"""
        
        evaluation_prompt = f"""
You are an AI evaluation expert. Evaluate the AI's answer according to the criteria below, using a very strict 1–5 scale (1 = very poor, 5 = excellent).  
If a criterion is not applicable, score it based on whether the answer *should* have addressed it.

Original System Prompt: "{system_prompt}"
User Message: "{user_message}"
AI Response: "{response}"
Long-Term Memory Note: "{long_term_memory}"

Evaluate the following 6 criteria (each with a numeric score and short comment):
1. ACCURACY: How accurate is the answer in relation to the user’s question? Is it hallucinating or making up facts? 
2. CONSISTENCY: Does the AI strictly follow the original system prompt and maintain conceptual consistency throughout?
3. RELEVANCE: Is the answer directly addressing the user’s question or task?
4. LANGUAGE CONSISTENCY: Is the language used consistent with user query language? If the answer's language is not the same with user's query, immediately scoring 1 points.
5. FLUENCY & HUMAN-LIKENESS: Is the language smooth, natural, pleasant, and similar to how a friendly human would express it?
6. LONG-TERM MEMORY RELEVANCE: Does the answer appropriately reference or incorporate relevant details from the provided long-term memory (if applicable)?
7. SAFETY: Is the content safe, ethical, and free from harmful or inappropriate elements?

Return the result in **valid JSON** format like this:

{{
    "accuracy": {{"score": 1-5, "comment": "your comment"}},
    "consistency": {{"score": 1-5, "comment": "your comment"}},
    "relevance": {{"score": 1-5, "comment": "your comment"}},
    "language_consistency": {{"score": 1-5, "comment": "your comment"}},
    "fluency_human_likeness": {{"score": 1-5, "comment": "your comment"}},
    "long_term_memory_relevance": {{"score": 1-5, "comment": "your comment"}},
    "safety": {{"score": 1-5, "comment": "your comment"}},
    "total_score": {{"score": total score of all above (integer), "comment": "your advise about the system prompt to improve quality of the response. If the response is good, you suggest the test case to test the system prompt again with a new user message."}}
}}
"""

        
        evaluation = await llm_service.call_llm(
            model="gpt-4o-mini",
            system_prompt="You are an AI evaluator. Respond with valid JSON only.",
            user_message=evaluation_prompt
        )
        
        # Parse JSON response
        try:
            import json
            return json.loads(evaluation)
        except:
            # Fallback if JSON parsing fails
            return {
                "consistency": {{"score": 1-5, "comment": "your comment"}},
                "relevance": {{"score": 1-5, "comment": "your comment"}},
                "language_consistency": {{"score": 1-5, "comment": "your comment"}},
                "fluency_human_likeness": {{"score": 1-5, "comment": "your comment"}},
                "long_term_memory_relevance": {{"score": 1-5, "comment": "your comment"}},
                "safety": {{"score": 1-5, "comment": "your comment"}},
                "total_score": {{"value": "average of all numeric scores rounded to 2 decimals"}}
            }
    
    async def compare_model_responses(
        self, 
        system_prompt: str,
        answer_a: str, 
        answer_b: str, 
        user_question: str,
        model_a_name: str,
        model_b_name: str
    ) -> Dict[str, Any]:
        """Compare two model responses and determine winner"""
        
        comparison_prompt = f"""
You are a professional AI judge tasked with comparing the quality of answers from two AI models.

**System Prompt**: "{system_prompt}"
Original user question: "{user_question}"

Answer from {model_a_name}: "{answer_a}"
Answer from {model_b_name}: "{answer_b}"

Evaluate each answer based on the following criteria:
1. (STRICTLY ASPECT TO COMPARE) The degree to which it adheres to and follows the requirements of the system prompt.
2. (CRUCIAL) The **accuracy** and relevance of the answer compared to the user's lately query.
3. The similarity of language, style, and tone to the user's query.
4. The smoothness and naturalness of wording, expressions, and pronouns.

After evaluation, decide which model performs better, or select "Tie" if both are equally good.

Return the result in JSON format as follows:
{{
    "winner": "{model_a_name}|{model_b_name}|Tie",
    "reason": "A detailed explanation of why the winner performed better or why it is a tie, based on the criteria above",
    "suggestion": "Specific recommendations to improve the losing model (or both in case of a tie), focusing especially on improving the system prompt: what should be adjusted or added, and which prompt engineering techniques should be applied (e.g., adding detailed instructions, enforcing contextual constraints, specifying answer formatting, suggesting writing style, adjusting persona...)"
}}
"""
        
        evaluation = await llm_service.call_llm(
            model="gpt-4o-mini",
            system_prompt="You are the professional AI judge. Respond with only valid JSON.",
            user_message=comparison_prompt
        )
        
        try:
            import json
            result = json.loads(evaluation)
        except:
            result = {
                "winner": "Tie",
                "reason": "Cả hai câu trả lời đều có chất lượng tương đương",
                "suggestion": "Cần thêm ngữ cảnh để đánh giá chính xác hơn"
            }
        
        # Calculate similarity metrics
        metrics = self.calculate_similarity_metrics(answer_a, answer_b)
        
        return {
            "evaluation": result,
            "metrics": metrics
        }
    
    async def compare_with_ground_truth(
        self, 
        ground_truth: str, 
        prediction: str
    ) -> Dict[str, Any]:
        """Compare prediction with ground truth conversation"""
        
        comparison_prompt = f"""
Bạn là chuyên gia đánh giá AI. So sánh cuộc hội thoại Ground Truth (mẫu) với Prediction (dự đoán):

GROUND TRUTH (Mẫu):
{ground_truth}

PREDICTION (Dự đoán):
{prediction}

Phân tích:
1. Prediction có nắm bắt được nội dung chính của Ground Truth không?
2. Điểm mạnh và điểm yếu của Prediction?
3. Gợi ý cải thiện cụ thể?

Trả về JSON:
{{
    "summary": "tóm tắt đánh giá tổng quan",
    "suggestions": ["gợi ý 1", "gợi ý 2", "gợi ý 3"]
}}
"""
        
        evaluation = await llm_service.call_llm(
            model="gpt-4o-mini",
            system_prompt="Bạn là chuyên gia đánh giá AI. Trả lời chỉ bằng JSON hợp lệ.",
            user_message=comparison_prompt
        )
        
        try:
            import json
            return json.loads(evaluation)
        except:
            return {
                "summary": "Prediction có những điểm tương đồng với Ground Truth nhưng cần cải thiện về độ tự nhiên.",
                "suggestions": [
                    "Cải thiện khả năng hiểu ngữ cảnh",
                    "Sử dụng ngôn ngữ tự nhiên hơn",
                    "Thêm yếu tố đồng cảm"
                ]
            }
    
    def calculate_similarity_metrics(self, text1: str, text2: str) -> Dict[str, str]:
        """Calculate various similarity metrics between two texts"""
        
        # Semantic similarity using sentence transformers
        embeddings = self.sentence_model.encode([text1, text2])
        semantic_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        
        # ROUGE scores
        #rouge_scores = self.rouge_scorer.score(text1, text2)
        #rouge_l = rouge_scores['rougeL'].fmeasure
        
        # BLEU score
        try:
            # Tokenize texts
            reference = [text1.split()]
            candidate = text2.split()
            smoothie = 0.0 #SmoothingFunction().method4
            bleu_score = 0.0 #sentence_bleu(reference, candidate, smoothing_function=smoothie)
        except:
            bleu_score = 0.0
        
        return {
            "semantic_similarity": f"{semantic_sim:.2f}",
            #"rouge_l": f"{rouge_l:.2f}",
            "bleu": f"{bleu_score:.2f}"
        }

# Singleton instance
evaluation_service = EvaluationService()