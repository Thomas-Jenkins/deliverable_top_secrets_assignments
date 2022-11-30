-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS topSecret;
DROP TABLE IF EXISTS users cascade;

CREATE TABLE topSecret (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL
);


INSERT INTO topSecret (
    title,
    description
)
VALUES 
('The Chair is Against the Wall', 'Declared when the cafeteria has run out of salsbury steak'),
('Birds are not real', 'After the year 2019 all birds have been replaced by government survellience drones');

