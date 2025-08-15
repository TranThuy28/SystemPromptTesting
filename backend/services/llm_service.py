import os
import asyncio
from typing import List, Dict, Any, Optional
import openai
import google.generativeai as genai
import anthropic
from dotenv import load_dotenv
from loguru import logger
import traceback
load_dotenv()

class LLMService:
    def __init__(self):
        # Initialize clients
        self.openai_client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        #genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        #self.anthropic_client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
    async def call_llm(
        self, 
        model: str, 
        system_prompt: Optional[str] = None, 
        user_message: str = "",
        long_term_memory: Optional[str] = None
    ) -> str:
        """Call different LLM providers based on model name"""
        
        # Prepare context
        context = ""
        if long_term_memory:
            context += f"Long-term memory: {long_term_memory}\n\n"
        
        full_user_message = context + user_message
        
        try:
            if model.startswith("gpt-"):
                return await self._call_openai(model, system_prompt, full_user_message)
            elif model.startswith("gemini-"):
                return await self._call_gemini(model, system_prompt, full_user_message)
            elif model.startswith("claude-"):
                return await self._call_anthropic(model, system_prompt, full_user_message)
            else:
                raise ValueError(f"Unsupported model: {model}")
                
        except Exception as e:
            return f"Error calling {model}: {str(e)}"
    
    async def _call_openai(self, model: str, system_prompt: Optional[str], user_message: str) -> str:
        """Call OpenAI API"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_message})
        
        # Map model names
        model_map = {
            "gpt-4o-mini": "gpt-4o-mini",
            "gpt-4.1-nano": "gpt-4.1-nano",
            "gpt-3.5-turbo": "gpt-3.5-turbo"
        }
        logger.info(f"Calling OpenAI model: {model_map.get(model, 'gpt-4o-mini')}")
        response = await self.openai_client.chat.completions.create(
            model=model_map.get(model, "gpt-4o-mini"),
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    
    async def _call_gemini(self, model: str, system_prompt: Optional[str], user_message: str) -> str:
        """Call Google Gemini API"""
        # Map model names
        model_map = {
            "gemini-4.1-nano": "gemini-1.5-flash",
            "gemini-pro": "gemini-pro"
        }
        
        gemini_model = genai.GenerativeModel(model_map.get(model, "gemini-1.5-flash"))
        
        # Combine system prompt and user message for Gemini
        prompt = ""
        if system_prompt:
            prompt += f"System: {system_prompt}\n\nUser: {user_message}"
        else:
            prompt = user_message
        
        response = await asyncio.to_thread(gemini_model.generate_content, prompt)
        return response.text
    
    async def _call_anthropic(self, model: str, system_prompt: Optional[str], user_message: str) -> str:
        """Call Anthropic Claude API"""
        # Map model names
        model_map = {
            "claude-3-sonnet": "claude-3-sonnet-20240229",
            "claude-3-haiku": "claude-3-haiku-20240307"
        }
        
        response = await self.anthropic_client.messages.create(
            model=model_map.get(model, "claude-3-haiku-20240307"),
            max_tokens=1000,
            system=system_prompt if system_prompt else "",
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        
        return response.content[0].text

# Singleton instance
llm_service = LLMService()