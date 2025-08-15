from pydantic import BaseModel
from typing import Optional, Dict, Any, List

# System Prompt Tester Models
class SystemPromptTestRequest(BaseModel):
    model: str
    system_prompt: str
    user_message: str
    long_term_memory: Optional[str] = None

class EvaluationScore(BaseModel):
    score: int
    comment: str

class SystemPromptTestResponse(BaseModel):
    response: str
    evaluation: Dict[str, EvaluationScore]

# Model Battle Models  
class ModelConfig(BaseModel):
    model_name: str
    system_prompt: str

class ModelBattleRequest(BaseModel):
    model_a: ModelConfig
    model_b: ModelConfig
    user_message: str
    long_term_memory: Optional[str] = None

class BattleEvaluation(BaseModel):
    winner: str
    reason: str
    suggestion: str

class ModelBattleResponse(BaseModel):
    answerA: str
    answerB: str
    evaluation: BattleEvaluation
    metrics: Dict[str, str]

# Ground Truth Comparer Models
class GroundTruthCompareRequest(BaseModel):
    ground_truth: str
    prediction: str

class GroundTruthCompareResponse(BaseModel):
    summary: str
    suggestions: List[str]