-- Business data lives ONLY in this private D1 database, never in public Git.
CREATE TABLE IF NOT EXISTS staff_sessions (
  token_hash TEXT PRIMARY KEY,
  csrf_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON staff_sessions(expires_at);

CREATE TABLE IF NOT EXISTS auth_attempts (
  ip_key TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL DEFAULT '',
  draft_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  latest_version INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_quotes_updated ON quotes(updated_at DESC);

CREATE TABLE IF NOT EXISTS quote_versions (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id),
  version_no INTEGER NOT NULL,
  public_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(quote_id, version_no)
);
CREATE INDEX IF NOT EXISTS idx_versions_quote ON quote_versions(quote_id, version_no DESC);

CREATE TABLE IF NOT EXISTS share_links (
  token_hash TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id),
  version_id TEXT NOT NULL REFERENCES quote_versions(id),
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_shares_quote ON share_links(quote_id, revoked_at);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id),
  version_id TEXT NOT NULL REFERENCES quote_versions(id),
  section_key TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','reviewed','resolved'))
);
CREATE INDEX IF NOT EXISTS idx_feedback_quote ON feedback(quote_id, created_at DESC);
