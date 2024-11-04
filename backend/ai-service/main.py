
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


@app.post('/stream')
async def stream(request: Request) -> Dict[str, str]:
    
    """
    Returns a response stream from the language model.

    Request Body:
    >>> {
    >>>     "query": User query.
    >>>     "question": The coding question that the user is currently doing.
    >>> }
    """
    request_dict = await request.body()
    request_dict = json.loads(request_dict)
    query = request_dict.get("query")
    question = request_dict.get("question")

    if not (query and question):
        raise HTTPException(
            status_code=400,
            detail="Query and question must be provided in body.",
        )
    print("Received a query:", query)

    return StreamingResponse(get_response(prompt_formatter(query, question)), media_type="text/event-stream")


def get_response(query):
    response = requests.post("http://ollama:11434/api/generate", json={
                             "model": "llama3.2", "prompt": query, "stream": True}, stream=True)

    for chunk in response.iter_content(None, decode_unicode=True):
        if chunk:
            chunk_str = chunk.decode().split("\"response\":\"")[1].split("\",\"done\"")[0]
            formatted_chunk = "data:" + chunk_str.replace(" ", "/s")
            yield formatted_chunk


def prompt_formatter(query, question) -> str:
    base_prompt = """Please answer the query.
                    Please keep your answer as short as possible.
                    Your name is Raesa.
                    Answer regularly, unless explictly asked about the question.
                    Question Title: {title}
                    User query: {query}
                    Answer:"""

    base_prompt = base_prompt.format(query=query, title=question['title'])

    return base_prompt


if __name__ == "__main__":
    # Warm up the model
    requests.post("http://ollama:11434/api/generate", json={"model": "llama3.2", "prompt": "hi"})
    print("AI Service successfully initalized!")
    uvicorn.run(app, host="0.0.0.0", port=9680)
