
from fastapi import FastAPI, HTTPException, Request
import uvicorn
import torch
import json
from typing import Dict
import torch
from transformers import pipeline



app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/")
async def upload(request: Request) -> Dict[str, str]:
    """
    Uploads PDF & chunks them into sentences
    Request Body:
    >>> {
    >>>     "query": The query that the user typed into the prompt.
    >>> }
    """
    request_dict = await request.body()
    request_dict = json.loads(request_dict)
    query_str = request_dict.get("query")
    print("Received a query:", query_str)
    if not (query_str):
        print("Query not provided")
        raise HTTPException(
            status_code=400,
            detail="query must be provided in body!",
        )
    print(request_dict)
    llm_response = ask(query_str)
    print("Responding to frontend!")
    #Status 200 is returned
    return {"message": llm_response}
    

def prompt_formatter(query) -> str:
    """
    Augments query with text-based context from context_items.
    """

    
    base_prompt = """Please answer the query.
                    Don't return the thinking, only return the answer.
                    Make sure your answers are as explanatory as possible.
                    User query: {query}
                    Answer:"""

    # Update base prompt with context items and query   
    base_prompt = base_prompt.format(query=query)

    # Create prompt template for instruction-tuned model
    dialogue_template = [
        {"role": "user",
        "content": base_prompt}
    ]

    # Apply the chat template
    prompt = pipe.tokenizer.apply_chat_template(dialogue_template, tokenize=False, add_generation_prompt=True)

    return prompt


def ask(query):
    messages = [
        {"role": "user", "content": query},
    ]
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=256, do_sample=True, temperature=0.5, top_k=50, top_p=0.95)
    return outputs[0]["generated_text"].split("<|assistant|>")[1]


if __name__ == "__main__":
    pipe = pipeline("text-generation", model="TinyLlama-1.1B-Chat-v1.0", torch_dtype=torch.bfloat16, device_map="auto")
    print("Language model successfully initalized!")
    uvicorn.run(app, host="0.0.0.0", port=9680)

