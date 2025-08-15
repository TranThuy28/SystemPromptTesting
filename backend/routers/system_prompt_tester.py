from fastapi import APIRouter, HTTPException
from models.schema import SystemPromptTestRequest, SystemPromptTestResponse
from services.llm_service import llm_service
from services.evaluation_service import evaluation_service
import asyncio

router = APIRouter()

@router.post("/system-prompt-tester", response_model=SystemPromptTestResponse)
async def test_system_prompt(request: SystemPromptTestRequest):
    """
    Test a system prompt by generating a response and evaluating it
    """
    try:
        # Step 1: Generate response from the selected model
        model_response = await llm_service.call_llm(
            model=request.model,
            system_prompt=request.system_prompt,
            user_message=request.user_message,
            long_term_memory=request.long_term_memory
        )
        
        # Step 2: Evaluate the response
        evaluation_result = await evaluation_service.evaluate_system_prompt_response(
            response=model_response,
            system_prompt=request.system_prompt,
            user_message=request.user_message, 
            long_term_memory=request.long_term_memory
        )
        
        return SystemPromptTestResponse(
            response=model_response,
            evaluation=evaluation_result
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")