import psycopg2
import psycopg2.extras
from tqdm import tqdm as tqdm
from transformers import BertModel, BertTokenizer, BertConfig, BertModel
import torch


def insert_db(query):
    db_name = 'postgres'

    user = 'postgres'

    host = 'localhost'

    port = '6321'

    conn = psycopg2.connect(dbname=db_name, user=user, host=host, port=port)

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cursor.execute(query)

    conn.commit()

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

def get_embedding_from_list(input_text):
    print(input_text)
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

jobs = query_db('''SELECT id, job_information_id, job_requirements_id
                            FROM jobs 
                            WHERE id NOT IN (SELECT jobs_id FROM job_embeddings)
                            ''')

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained("bert-base-uncased")
for job in jobs:
    print('\n\n\n')
    print(job)
    job_information = query_db(f"SELECT title FROM job_information WHERE id = '{job['job_information_id']}' ")
    title = job_information[0]['title'].lower().split(' ')
    job_requirements = query_db(f"SELECT tasks FROM job_requirements WHERE id = '{job['job_requirements_id']}' ")
    print(job_requirements)
    tasks = list(map(lambda x: x.lower(), job_requirements[0]['tasks']))
    print(tasks)

    input_text = title
    title_vector = get_embedding_from_list(input_text).tolist()
    if (len(tasks) > 0):
        requirements_vector = get_embedding_from_list(tasks).tolist()
    else:
        requirements_vector = get_embedding_from_list(title).tolist()
    #total_vector = get_embedding_from_list([title, tasks])
    #input_text.extend(req['description']) 
    insert_query = f'''INSERT INTO job_embeddings(title_vector, requirements_vector, jobs_id)
                            VALUES('{title_vector}', '{requirements_vector}', {job['id']})'''
    
    insert_db(insert_query)

    