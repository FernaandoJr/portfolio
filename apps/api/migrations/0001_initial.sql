CREATE TABLE IF NOT EXISTS contributions (
  date  TEXT    PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_contributions_date ON contributions(date);

CREATE TABLE IF NOT EXISTS sync_log (
  id        INTEGER PRIMARY KEY CHECK (id = 1),
  synced_at TEXT NOT NULL
);
