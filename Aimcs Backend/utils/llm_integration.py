import openai
from config import Config
import json

class LLMIntegration:
    @staticmethod
    def generate_text(prompt, model=None, temperature=None, max_tokens=None):
        try:
            response = openai.ChatCompletion.create(
                model=model or Config.AI_MODEL_NAME,
                messages=[{"role": "user", "content": prompt}],
                temperature=temperature or Config.AI_TEMPERATURE,
                max_tokens=max_tokens or Config.AI_MAX_TOKENS
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating text: {e}")
            return "I'm sorry, I encountered an error processing your request. Please try again later."

    @staticmethod
    def generate_structured_response(prompt):
        try:
            # Add instruction to return JSON
            json_prompt = f"{prompt}\n\nPlease return your response as a valid JSON object."
            
            response = openai.ChatCompletion.create(
                model=Config.AI_MODEL_NAME,
                messages=[{"role": "user", "content": json_prompt}],
                temperature=Config.AI_TEMPERATURE,
                response_format={ "type": "json_object" }
            )
            
            content = response.choices[0].message.content.strip()
            return json.loads(content)
        except Exception as e:
            print(f"Error generating structured response: {e}")
            return {}