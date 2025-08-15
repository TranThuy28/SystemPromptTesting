from fastapi import APIRouter, HTTPException
from models.schema import GroundTruthCompareRequest, GroundTruthCompareResponse
from services.evaluation_service import evaluation_service

router = APIRouter()

@router.post("/ground-truth-comparer", response_model=GroundTruthCompareResponse)
async def compare_with_ground_truth(request: GroundTruthCompareRequest):
    """
    Compare a model's prediction with ground truth conversation and provide improvement suggestions
    """
    try:
        # Compare prediction with ground truth
        comparison_result = await evaluation_service.compare_with_ground_truth(
            ground_truth=request.ground_truth,
            prediction=request.prediction
        )
        
        return GroundTruthCompareResponse(
            summary=comparison_result["summary"],
            suggestions=comparison_result["suggestions"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing with ground truth: {str(e)}")