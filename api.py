from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from transformers import pipeline, AutoTokenizer
from huggingface_hub import login
from typing import Optional
import io

# Authentification Hugging Face
login("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")

# Charger modèle et tokenizer
model_name = "mistralai/Mistral-7B-Instruct-v0.3"
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=False)
pipe = pipeline("text-generation", model=model_name, tokenizer=tokenizer, device=-1)

# Lancer FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Remplacez par l'origine de votre front-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    csv_data: Optional[str] = None

# Fonction pour générer la réponse
def generate_answer(mode, question, df):
    prompt = ""

    if (mode == "csv"):
        table_text = df.to_string(index=False)
        prompt = f"""You are a helpful AI assistant specialized in Data Analysis.

        Here is the table data:
        {table_text}

        Please answer the following question using the data provided if necessary. Provide only the final answer and nothing else.

        Question: {question}
        Réponse:"""
    else:
        prompt = f"""You are a helpful AI assistant specialized in Data Analysis.

        Provide only the final answer and nothing else.

        Question: {question}
        Réponse:"""

    inputs = tokenizer(prompt, return_tensors='pt')
    input_ids = inputs.input_ids
    attention_mask = inputs.attention_mask

    output_ids = pipe.model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_new_tokens=50,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.eos_token_id,
        num_return_sequences=1,
        do_sample=False
    )

    generated_text = tokenizer.decode(output_ids[0][input_ids.shape[-1]:], skip_special_tokens=True)
    response = generated_text.strip().split('\n')[0]

    return response

# Route principale
@app.post("/ask")
def ask_question(data: QuestionRequest):
    if data.csv_data:
        # Lire le CSV depuis la string
        df = pd.read_csv(io.StringIO(data.csv_data))

        answer = generate_answer("csv", data.question, df)
        return {"answer": answer}
    else:
        answer = generate_answer("", data.question, None)
        return {"answer": answer}


#                 ██╗
#                 ██║
# ███████╗ █████╗ ██║██████╗ ██╗   ██╗
# ██╔════╝██╔══██╗██║██╔══██╗╚██╗ ██╔╝
# ██████═╗███████║██║██████╔╝ ╚████╔╝
# ██╔════╝██╔══██║██║██╔══██╗   ██╔╝
# ██║     ██║  ██║██║██║  ██║   ██║
# ╚═╝     ██║  ██║╚═╝╚═╝  ╚═╝   ╚═╝
#         ╚═╝  ╚═╝

#                 
#                 ██╗
#                 ██║
# ███████╗        ██║██████╗ ██╗   ██╗
# ██╔════╝ █████╗ ██║██╔══██╗╚██╗ ██╔╝
# ██████═╗██╔══██╗██║██████╔╝ ╚████╔╝
# ██╔════╝███████║██║██╔══██╗   ██╔╝
# ██║     ██║  ██║╚═╝██║  ██║   ██║
# ╚═╝     ██║  ██║   ╚═╝  ╚═╝   ╚═╝
#         ██║  ██║
#         ╚═╝  ╚═╝