from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import huggingface_hub
import requests
from data_collection.aggregator import aggregate_data

# AI STUFF
ai_url = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
token = "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"

def llm(query): 
    parameters = {
      "max_new_tokens": 1000,
      "temperature": 0.09,
      "top_k": 50,
      "top_p": 0.95,
      "return_full_text": False
    }

    prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>You are a travel guide. You are provided with a diverse range of information of activities to do in a given location. Your job is to condense this information and pick events/activities for 
     a person to do based on their interests, which is also provided <|eot_id|><|start_header_id|>user<|end_header_id|> Here is the information of possible activites: ```{query}```.
      Provide precise and concise recommendations try to get between 5-10 recommendations and format your response in JSON format, having keys for activity name, description and the approximate price.<|eot_id|><|start_header_id|>assistant<|end_header_id|>"""
  
    headers = {
      'Authorization': f'Bearer {token}',
      'Content-Type': 'application/json'
  }
    
    payload = {
      "inputs": prompt,
      "parameters": parameters
  }
  
    response = requests.post(ai_url, headers=headers, json=payload)
    response_text = response.json()[0]['generated_text'].strip()

    return response_text


# API STUFF
app = FastAPI(title="Custom JSON Processor API")

#Allowed addresses
origins = [
    "http://localhost:3000",  # Frontend URL
    "http://127.0.0.1:3000",
    "*",  # Allow all origins (not recommended for production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessingInput(BaseModel):
    interest: str
    budget: float
    loc: str
    
class ProcessedResult(BaseModel):
    descs: list[list[str, float, str]]

# Initialize the app
@app.get("/")
async def root():
    return {"message": "Welcome to the Custom JSON Processor API"}
    

@app.post("/process", response_model=ProcessedResult)
async def process_data(input_data: ProcessingInput):
    try:
        print("works")
        
        processed_data = custom_process_data(input_data.interest, input_data.budget, input_data.loc)
        
        return ProcessedResult(
            descs = processed_data
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")


def custom_process_data(intrst: str, budg: float, loc: str ) :
    data = aggregate_data(loc, budg, intrst)
    print("works 2")
    print(llm(data))
    print("works 3")
    process_data = []
    return process_data


if __name__ == "__main__":
    uvicorn.run("comm:app", host="127.0.0.1", port=8000, reload=True)