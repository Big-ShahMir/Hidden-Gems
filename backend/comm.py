from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
from data_collection.aggregator import aggregate_data

app = FastAPI(title="Custom JSON Processor API")

# Define the output model(s)
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
        # This is where your custom processing code would go
        # For now, we'll use a placeholder implementation
        processed_data = custom_process_data(input_data.interest, input_data.budget, input_data.loc)
        
        return ProcessedResult(
            desc = processed_data
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")


def custom_process_data(intrst: str, budg: float, loc: str ) :
    data = aggregate_data(loc)
    processed_result = []
       
    return processed_result


if __name__ == "__main__":
    uvicorn.run("comm:app", host="0.0.0.0", port=8000, reload=True)