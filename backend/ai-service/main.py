
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
import uvicorn
import json
from typing import Dict
from transformers import pipeline


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "ai-service is running!"}


@app.get('/stream')
async def stream(query: str) -> Dict[str, str]:
    if (query == ''):
        print("Query not provided. Returning status code 400.")
        raise HTTPException(
            status_code=400,
            detail="query must be provided in body!",
        )
    print("Received a query:", query)
    return StreamingResponse(get_response(prompt_formatter(query)), media_type="text/event-stream")


def get_response(query):
    response = requests.post("http://ollama:11434/api/generate", json={
                             "model": "llama3.2", "prompt": query, "stream": True}, stream=True)

    for chunk in response.iter_content(None, decode_unicode=True):
        if chunk:
            chunk_str = chunk.decode().split("\"response\":\"")[
                1].split("\",\"done\"")[0]
            formatted_chunk = "data:" + \
                chunk_str.replace(" ", "/s")
            yield formatted_chunk


def prompt_formatter(query) -> str:
    base_prompt = """Please answer the query.
                    Please keep your answer as short as possible.
                    Your name is Raesa.
                    User query: {query}
                    Answer:"""

    base_prompt = base_prompt.format(query=query)

    return base_prompt


if __name__ == "__main__":
    requests.post("http://ollama:11434/api/generate",
                  json={"model": "llama3.2", "prompt": "", "stream": True}, stream=True)
    print("AI Service successfully initalized!")
    uvicorn.run(app, host="0.0.0.0", port=9680)
