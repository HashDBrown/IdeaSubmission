-- users table where type can either be admin or user
-- username and password are required
-- username is unique
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(255) NOT NULL
);

-- submissions of jpg and png files. Includes email field and text field
-- email is required
-- text is optional
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    text TEXT,
    file_path VARCHAR(255) NOT NULL
);
