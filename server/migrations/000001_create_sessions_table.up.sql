CREATE TABLE "sessions" (
	id varchar(27) NOT NULL PRIMARY KEY,
	title varchar(255) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);