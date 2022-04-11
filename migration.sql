CREATE TABLE projects(
  id INTEGER AUTOINCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  orbit_info TEXT NOT NULL,
  auth_info TEXT NOT NULL,
  crust_info TEXT NOT NULL,
);
CREATE TABLE buckets(
  id INTEGER AUTOINCREMENT PRIMARY KEY,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id)
)