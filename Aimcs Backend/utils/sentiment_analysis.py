from transformers import pipeline
from config import Config

class SentimentAnalyzer:
    _analyzer = None
    
    @classmethod
    def get_analyzer(cls):
        if cls._analyzer is None:
            cls._analyzer = pipeline("sentiment-analysis", device=0)  # Use GPU if available
        return cls._analyzer
    
    @staticmethod
    def analyze(text):
        try:
            analyzer = SentimentAnalyzer.get_analyzer()
            result = analyzer(text)[0]
            
            return {
                'label': result['label'].lower(),
                'score': result['score']
            }
        except Exception as e:
            print(f"Error analyzing sentiment: {e}")
            return {
                'label': 'neutral',
                'score': 0.5
            }