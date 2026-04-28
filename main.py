from dotenv import load_dotenv
load_dotenv()

import os, json, re, logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import AsyncOpenAI
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== CONFIG ====================
OPENROUTER_API_KEY = os.getenv("QWEN_API_KEY")
if not OPENROUTER_API_KEY:
    raise EnvironmentError("QWEN_API_KEY environment variable is required in .env")

client = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)
MODEL_NAME = "qwen/qwen-plus"
router = APIRouter()

# ==================== CONSTANTS ====================
MAX_RESPONSE_TOKENS = 800
MAX_CORRECTION_TOKENS = 400
MAX_EXPLANATION_TOKENS = 200

# ==================== SERVICES ====================
# (Keep all your service functions as they are - improve_prompt, generate_response, etc.)
# ... [All your existing service functions remain unchanged] ...

# --- Prompt Engine ---
async def improve_prompt(user_prompt: str) -> str:
    response = await client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "Refine the following user prompt to be clearer, more specific, and less ambiguous. Return only the improved prompt in 1-2 sentences."},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=150,
        temperature=0.1
    )
    return response.choices[0].message.content.strip()

# --- AI Service ---
async def generate_response(prompt: str) -> str:
    response = await client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "Provide a concise, evidence-based response. Keep it under 400 words. Use clear paragraphs, avoid excessive citations."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=MAX_RESPONSE_TOKENS,
        temperature=0.7
    )
    return _truncate_if_needed(response.choices[0].message.content.strip(), MAX_RESPONSE_TOKENS)

# --- Bias Evaluator ---
async def evaluate_bias(prompt: str) -> dict:
    system_prompt = (
        "Analyze this USER PROMPT for bias, stereotypes, or harmful framing. "
        "Return ONLY valid JSON: {\"bias_score\": 0-10, \"explanation\": \"<100 words\"}. "
        "Be concise. No markdown."
    )
    raw = await _call_llm(system_prompt, f"Prompt: {prompt}", MAX_EXPLANATION_TOKENS)
    return _parse_json_response(raw, default={"bias_score": 0, "explanation": "Evaluation failed."})

# --- Reasoning Engine ---
async def generate_reasoning(prompt: str, bias_score: int, bias_explanation: str) -> str:
    system_prompt = (
        "Explain WHY this prompt received its bias score in under 100 words. "
        "Mention specific phrases if problematic. Return only the reasoning text."
    )
    user_prompt = f"Prompt: {prompt}\nScore: {bias_score}/10\nIssue: {bias_explanation}"
    return await _call_llm(system_prompt, user_prompt, MAX_EXPLANATION_TOKENS)

# --- Correction Engine ---
async def add_context_if_biased(original_prompt: str, original_response: str, bias_explanation: str) -> str:
    system_prompt = (
        f"The user's prompt contained bias: {bias_explanation}. "
        "Prepend ONE concise sentence acknowledging this gently. Then include the original response. "
        "Keep the note under 25 words. Return only the modified response."
    )
    user_prompt = f"Prompt: {original_prompt}\nResponse: {original_response[:500]}..."
    corrected = await _call_llm(system_prompt, user_prompt, MAX_CORRECTION_TOKENS)
    return _truncate_if_needed(corrected, MAX_RESPONSE_TOKENS)

# --- Helper Functions ---
async def _call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 300) -> str:
    res = await client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        max_tokens=max_tokens,
        temperature=0.0
    )
    return res.choices[0].message.content.strip()

def _parse_json_response(text: str, default: dict) -> dict:
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return default

def _truncate_if_needed(text: str, max_tokens: int) -> str:
    max_chars = max_tokens * 4
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    last_period = truncated.rfind('.')
    if last_period > max_chars * 0.8:
        return truncated[:last_period + 1] + "…"
    return truncated + "…"

# ==================== API ENDPOINT ====================
class AnalyzeRequest(BaseModel):
    prompt: str

@router.post("/api/analyze")
async def analyze_endpoint(req: AnalyzeRequest):
    try:
        original_prompt = req.prompt

        bias_result = await evaluate_bias(original_prompt)
        bias_score = int(bias_result.get("bias_score", 0))
        bias_explanation = bias_result.get("explanation", "")

        reasoning = await generate_reasoning(original_prompt, bias_score, bias_explanation)

        improved_prompt = await improve_prompt(original_prompt)
        original_response = await generate_response(improved_prompt)

        final_response = original_response
        if bias_score > 5:
            final_response = await add_context_if_biased(
                original_prompt, original_response, bias_explanation
            )

        return {
            "originalPrompt": original_prompt,
            "improvedPrompt": improved_prompt,
            "originalResponse": original_response,
            "finalResponse": final_response,
            "bias": {
                "bias_score": bias_score,
                "explanation": bias_explanation
            },
            "reasoning": reasoning
        }
    except Exception as e:
        logger.error(f"Pipeline error: {type(e).__name__} - {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Pipeline execution failed: {str(e)}")

# ==================== FASTAPI APP ====================
app = FastAPI(title="AI Bias Monitoring System", version="1.0.0")

# CORS Middleware - Must be BEFORE mounting static files
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                    # Change to specific domains later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# ====================== SERVE REACT FRONTEND ======================
dist_path = "frontend/dist"
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="frontend")
    print("✅ React frontend mounted successfully at /")
else:
    print("⚠️ frontend/dist not found - running in API-only mode")
