from fastapi import APIRouter, HTTPException
from models.schema import ModelBattleRequest, ModelBattleResponse
from services.llm_service import llm_service
from services.evaluation_service import evaluation_service
import asyncio
from loguru import logger
router = APIRouter()

@router.post("/model-battle", response_model=ModelBattleResponse)
async def battle_models(request: ModelBattleRequest):
    """
    Battle two models against each other and evaluate the winner
    """
    logger.info(f"Starting model battle between {request.model_a.model_name} and {request.model_b.model_name}")
    try:
        # Step 1: Generate responses from both models concurrently
        tasks = [
            llm_service.call_llm(
                model=request.model_a.model_name,
                system_prompt=request.model_a.system_prompt,
                user_message=request.user_message,
                long_term_memory=request.long_term_memory
            ),
            llm_service.call_llm(
                model=request.model_b.model_name,
                system_prompt=request.model_b.system_prompt,
                user_message=request.user_message,
                long_term_memory=request.long_term_memory
            )
        ]
        
        answer_a, answer_b = await asyncio.gather(*tasks)
        
        # Step 2: Compare the responses
        comparison_result = await evaluation_service.compare_model_responses(
            system_prompt=request.model_a.system_prompt,
            answer_a=answer_a,
            answer_b=answer_b,
            user_question=request.user_message,
            model_a_name=request.model_a.model_name,
            model_b_name=request.model_b.model_name
        )
        
        return ModelBattleResponse(
            answerA=answer_a,
            answerB=answer_b,
            evaluation=comparison_result["evaluation"],
            metrics=comparison_result["metrics"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing model battle: {str(e)}")