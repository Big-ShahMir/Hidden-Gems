from transformers import pipeline
from transformers import AutoTokenizer
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests
from data_collection.aggregator import aggregate_data
import json
import re
import requests
import os
# from dotenv import load_dotenv
from urllib.parse import quote  
import random
from typing import Union


# load_dotenv() 

# AI STUFF
MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"
HF_TOKEN = os.getenv("HF_TOKEN") 
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, token=HF_TOKEN)

budget = 0
location = ""
interest = ""


MAX_INPUT_TOKENS = 6000  # Keep a safe limit to avoid hitting 8192

# Hugging Face Inference API call function
def llm(query): 
    parameters = {
        "max_new_tokens": 1000,
        "temperature": 0.09,
        "top_k": 50,
        "top_p": 0.95,
        "return_full_text": False
    }

    if isinstance(query, dict):
        query = json.dumps(query, indent=2)

    tokenized = tokenizer(query, truncation=True, max_length=MAX_INPUT_TOKENS, return_tensors="pt")
    trimmed_query = tokenizer.decode(tokenized["input_ids"][0], skip_special_tokens=True)


    prompt = f"""
    You are a travel guide. You are provided with a diverse range of information of activities to do in a given location.
    Your job is to condense this information and pick events/activities for a person to do based on their interests, which is also provided.
    Here is the information of possible activities: ```{trimmed_query}```. User have the preferences of interest:{interest} at location:{location} and a budget of ${budget}. 
    Provide precise and concise recommendations (between 5-10) and format your response in only one array which contains JSON elements for each activity formatted with keys: "activity_name", "description", and "approximate_price".
    """

    headers = {
        'Authorization': f'Bearer {HF_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "inputs": prompt,
        "parameters": parameters
    }
    
    print("works 3")
    response = requests.post(f"https://api-inference.huggingface.co/models/{MODEL_ID}", headers=headers, json=payload)
    print("works 4")
    print(response)
    response_json = response.json()
    print("works 5")
    print("Hugging Face API Response:", response_json)

    if isinstance(response_json, list) and len(response_json) > 0 and isinstance(response_json[0], dict) and 'generated_text' in response_json[0]:
        return response_json[0]['generated_text'].strip()
    else:
        raise Exception("Invalid response from AI model")



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
    descs: List[Dict[str, Union[str,int]]]  # Now correctly represents JSON structure

# Initialize the app
@app.get("/")
async def root():
    return {"message": "Welcome to the Custom JSON Processor API"}
    

@app.post("/process", response_model=ProcessedResult)
async def process_data(input_data: ProcessingInput):
    try:
        global budget, location, interest
        print("works")
        print(input_data.interest, input_data.budget, input_data.loc)
        
        budget = input_data.budget
        location = input_data.loc
        interest = input_data.interest

        processed_data = custom_process_data(input_data.interest, input_data.budget, input_data.loc)
        
        return ProcessedResult(
            descs = processed_data
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")


def custom_process_data(intrst: str, budg: float, loc: str ) :
    data = aggregate_data(loc, budg, intrst)
    llm_response = llm(data)
    print("Raw LLM Response:", llm_response)

    try:
        # Extract JSON using regex (if LLM added extra text)
        json_match = re.search(r"\[.*\]", llm_response, re.DOTALL)

        if json_match:
            extracted_json = json_match.group(0)
            parsed_response = json.loads(extracted_json)  # Convert to Python list

            # Ensure valid structure
            valid_activities = [
                item for item in parsed_response
                if isinstance(item, dict) and 
                   all(key in item for key in ["activity_name", "description", "approximate_price"])
            ]
        else:
            print("No valid JSON found in LLM response")
            valid_activities = []

    except json.JSONDecodeError:
        print("Error: LLM response is not valid JSON")
        valid_activities = []

    print("Filtered Activities:", valid_activities)
    return valid_activities

PIX_API_KEY = os.getenv("PIX_API_KEY")

class ImagePrompt(BaseModel):
    prompt: str

@app.post("/image")
def image_endpoint(input: ImagePrompt):

    print("Prompt:", input.prompt)

    response = requests.get(f"https://pixabay.com/api/?key={PIX_API_KEY}&q={quote(input.prompt[:100])}&image_type=photo")

    print("Pixabay API Response:", response)

    if response.status_code == 200:
        data = response.json()
        if "hits" in data and len(data["hits"]) > 0:
            random_index = random.randint(0, len(data["hits"]) - 1)

            image_url = data["hits"][random_index].get("largeImageURL") or data["hits"][random_index].get("webformatURL")
            return {"imageURL": image_url}  # Return only the first image URL
        else:
            return {"error": "No images found."}
    else:
        return {"error": "Failed to fetch images."}

if __name__ == "__main__":
    uvicorn.run("comm:app", host="127.0.0.1", port=8000, reload=True)