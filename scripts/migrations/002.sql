CREATE TABLE IF NOT EXISTS job_embeddings (
    id SERIAL PRIMARY KEY,
    tltle_vector vector(768),
    requirements_vector vector(768),
    total_vector vector(768),
    jobs_id int NOT NULL,
    FOREIGN KEY (jobs_id) REFERENCES jobs(id)
)
