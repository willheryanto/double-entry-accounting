CREATE TABLE accounts (
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_accounts_name ON accounts (name);
CREATE INDEX idx_accounts_created ON accounts (created);

CREATE TABLE journals (
  id UUID DEFAULT uuid_generate_v4(),
  account_id UUID,
  amount DECIMAL(20, 2) NOT NULL,
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE INDEX idx_journals_account_id ON journals (account_id);
CREATE INDEX idx_journals_created ON journals (created);

CREATE VIEW balances AS
  SELECT
    a.id as account_id,
    a.name,
    COALESCE(SUM(j.amount), 0) AS balance
  FROM accounts a
  LEFT JOIN journals j ON a.id = j.account_id
  GROUP BY a.id;
