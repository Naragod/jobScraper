import psycopg2
import psycopg2.extras
from tqdm import tqdm as tqdm
from transformers import BertModel, BertTokenizer, BertConfig, BertModel
import torch


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

    job_information = query_db(f"SELECT title FROM job_information WHERE id = '{row['job_information_id']}' ")
    title = job_information[0]['title'].lower()
    job_requirements = query_db(f'SELECT tasks FROM job_requirements WHERE id = '{row['job_requirements_id']} ")
    tasks = job_requirements[0]['tasks'].lower()

    input_text = [title]
    title_vector = get_embedding_from_list(input_text)
    requirements_vector = get_embedding_from_list([tasks])
    total_vector = get_embedding_from_list([title, tasks])
    #input_text.extend(req['description']) 
    insert_query = f'''INSERT INTO job_embeddings(title_vector, requirements_vector, total_vector, jobs_id)
                            VALUES({title_vector}, {requirements_vector}, {total_vector}, {job['id']})'''
    
    print(insert_query)

    