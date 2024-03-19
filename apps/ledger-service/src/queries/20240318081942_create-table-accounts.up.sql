CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  PRIMARY KEY (id)
);
