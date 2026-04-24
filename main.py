from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mcp_router import MCPRouter
import uvicorn

app = FastAPI(title="Jupid AI Stock Analysis Backend")
router = MCPRouter()

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint for stock queries.
    Example: {"query": "Should I buy TSLA?"}
    """
    try:
        response_text = await router.route_request(request.query)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
