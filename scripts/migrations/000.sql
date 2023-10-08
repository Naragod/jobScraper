CREATE TABLE IF NOT EXISTS job_information(
    -- hash of job information properties
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    company TEXT NOT NULL,
    "location" TEXT NOT NULL,
    pay TEXT,
    "description" TEXT,
    workplace_type TEXT,
    commitment TEXT,
    external_link TEXT,
    extra JSON
);

CREATE TABLE IF NOT EXISTS job_requirements(
    -- hash of job job_requirements properties
    id TEXT PRIMARY KEY,
    tasks TEXT [] NOT NULL,
    education TEXT,
    experience TEXT,
    languages TEXT [],
    tech_experience TEXT []
);

CREATE TABLE IF NOT EXISTS jobs(
    id SERIAL PRIMARY KEY,
    job_board TEXT NOT NULL,
    job_information_id TEXT NOT NULL,
    job_requirements_id TEXT NOT NULL,
    FOREIGN KEY (job_information_id) REFERENCES job_information (id),
    FOREIGN KEY (job_requirements_id) REFERENCES job_requirements (id)
);

CREATE TABLE IF NOT EXISTS migrations(
    id SERIAL PRIMARY KEY,
    file_name TEXT NOT NULL UNIQUE,
    inserted_date DATE NOT NULL DEFAULT CURRENT_DATE
);