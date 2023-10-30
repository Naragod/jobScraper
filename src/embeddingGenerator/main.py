from fastapi import FastAPI, Request
import psycopg2
import psycopg2.extras

from transformers import BertModel, BertTokenizer
import torch

import json

app = FastAPI()


@app.get('/get-jobs')
async def get_relevant_jobs(resume_id: int):
    #Using resume ID as a job id for now
    print(resume_id)
    get_job_info = f'SELECT title_vector FROM job_embeddings WHERE jobs_id = {resume_id}'
    job_info = query_db(get_job_info)
    print(job_info[0].get('title_vector'))
    title_vector = job_info[0].get('title_vector')

    get_most_similar_job_ids = f'''SELECT jobs_id 
                                FROM job_embeddings
                                ORDER BY title_vector <-> '{str(title_vector)}' ASC
                                 LIMIT 20 '''
    
    most_similar_job_ids = query_db(get_most_similar_job_ids)
    ids_list = list(map(lambda x: x['jobs_id'], most_similar_job_ids))
    return ids_list 

@app.post('/get-embedding')
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

def query_db(query):
    db_name = 'postgres'

    user = 'postgres'

    host = 'localhost'

    port = '6321'

    conn = psycopg2.connect(dbname=db_name, user=user, host=host, port=port)

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cursor.execute(query)


    rows = cursor.fetchall()
    row_dict = [{k:v for k, v in record.items()} for record in rows]
    cursor.close()
    conn.close()
    return row_dict