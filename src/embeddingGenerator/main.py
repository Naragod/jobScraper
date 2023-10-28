from fastapi import FastAPI, Request

from transformers import BertModel, BertTokenizer
import torch

import json

app = FastAPI()


@app.post('/')
async def get_embedding(req: Request):
    body = json.loads(await req.body())
    if ("title" in body.keys()):
        title_vector = get_embedding_from_list([body['title']]).tolist()
    else:
        title_vector = None
    if ('listed_items' in body.keys()):
        items_vector = get_embedding_from_list(body['listed_items']).tolist()
    else:
        items_vector = None
    return {"title_vector": title_vector, "items_vector": items_vector}

def get_embedding_from_list(input_text):
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained("bert-base-uncased")
    encoded_dict = tokenizer.encode_plus(
                        input_text,                      # Sentence to split into tokens
                        add_special_tokens = True, # Add special token '[CLS]' and '[SEP]'
                        max_length = 64,           # Pad & truncate all sentences.
                        padding='max_length',
                        truncation=True,
                        return_attention_mask = True,   # Construct attention masks.
                        return_tensors = 'pt',     # Return pytorch tensors.
                   )

    # adding the encoded sentence to the list.    
    input_ids = encoded_dict['input_ids']

    # attention mask (to differentiate padding from non-padding).
    attention_masks = encoded_dict['attention_mask']

    model_output =  model(input_ids, attention_mask=attention_masks)['last_hidden_state']
    return torch.mean(model_output, 1)[0]