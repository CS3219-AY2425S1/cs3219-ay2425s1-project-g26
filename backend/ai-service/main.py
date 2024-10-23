
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
    return {"message": "ai-service is running!"}

@app.post("/")
async def upload(request: Request) -> Dict[str, str]:
    """
    Request Body:
    >>> {
    >>>     "query": The query that the user typed into the prompt.
    >>> }
    """
    request_dict = await request.body()
    request_dict = json.loads(request_dict)
    query_str = request_dict.get("query")
    if not (query_str):
        print("Query not provided. Returning status code 400.")
        raise HTTPException(
            status_code=400,
            detail="query must be provided in body!",
        )
    print("Received a query:", query_str)
    llm_response = ask(prompt_formatter(query_str))
    print("Language Model Response:\n", llm_response.split("\n")[0],"...")
    #Status 200 is returned
    return {"message": llm_response}
    

def prompt_formatter(query) -> str:    
    base_prompt = """Please answer the query.
                    Make sure your answers are as explanatory as possible.
                    Try to keep your answer in less than 200 words.
                    Your name is RAESA. You can refer to your name when answering the question.
                    Do not provide any form of code or pseduo-code unless specifically requested.
                    User query: {query}
                    Answer:"""

    base_prompt = base_prompt.format(query=query)

    return base_prompt


def ask(query):
    messages = [
        {"role": "user", "content": query},
    ]
    prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    outputs = pipe(prompt, max_new_tokens=None, do_sample=True, temperature=0.5, top_k=50, top_p=0.95)
    return outputs[0]["generated_text"].split("<|assistant|>\n")[1]


if __name__ == "__main__":
    pipe = pipeline("text-generation", model="TinyLlama-1.1B-Chat-v1.0", torch_dtype=torch.bfloat16, device_map="auto")
    print("Language model successfully initalized!")
    uvicorn.run(app, host="0.0.0.0", port=9680)

