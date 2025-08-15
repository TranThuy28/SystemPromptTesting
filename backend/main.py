from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
# Import routers
from routers import system_prompt_tester, model_battle, ground_truth_comparer

# Create FastAPI app
app = FastAPI(
    title="LLM Prompt Testing API",
    description="API for testing and comparing language model prompts",
    version="1.0.0"
)

# CORS Middleware - Important for frontend connection
origins = [
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite development server
    "http://127.0.0.1:5173",
    # Add your production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers with API prefix
app.include_router(
    system_prompt_tester.router,
    prefix="/api",
    tags=["System Prompt Testing"]
)

app.include_router(
    model_battle.router,
    prefix="/api", 
    tags=["Model Battle"]
)

app.include_router(
    ground_truth_comparer.router,
    prefix="/api",
    tags=["Ground Truth Comparison"]
)

# Health check endpoint
@app.get("/")
async def read_root():
    return {
        "message": "LLM Prompt Testing API is running!",
        "version": "1.0.0",
        "endpoints": {
            "system_prompt_test": "/api/system-prompt-tester",
            "model_battle": "/api/model-battle", 
            "ground_truth_compare": "/api/ground-truth-comparer"
        }
    }

# Health check for API
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working correctly"}

# Error handling
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": f"Internal server error: {str(exc)}"}
    )

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "localhost")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )