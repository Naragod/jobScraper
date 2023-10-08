CREATE VIEW jobs_info_view AS
SELECT
    jobs.id,
    jobs.job_board,
    ji.title,
    ji.company,
    ji.location,
    ji.pay,
    ji.description,
    ji.link,
    jr.tasks
FROM
    jobs
    JOIN job_information ji ON ji.id = jobs.job_information_id
    JOIN job_requirements jr ON jr.id = jobs.job_requirements_id
ORDER BY
    jobs.id DESC;