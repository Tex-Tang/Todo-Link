CREATE TABLE tasks (
	id varchar(27) NOT NULL PRIMARY KEY,
	title varchar(255) NOT NULL,
	session_id varchar(27) NOT NULL,
	completed_at timestamp NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL,
	FOREIGN KEY (session_id) REFERENCES sessions(id)
);