CREATE TABLE IF NOT EXISTS bespoke_requests (
 id TEXT PRIMARY KEY,
 request_key_hash TEXT UNIQUE NOT NULL,
 public_code TEXT NOT NULL UNIQUE,
 payload_json TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','triaged','quoted','closed')),
 source TEXT NOT NULL DEFAULT 'bespoke',
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bespoke_status ON bespoke_requests(status,created_at DESC);
CREATE TABLE IF NOT EXISTS public_rate_limits (
 ip_hash TEXT NOT NULL,
 action TEXT NOT NULL,
 window_start INTEGER NOT NULL,
 hits INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(ip_hash,action)
);
CREATE TABLE IF NOT EXISTS quote_audit (
 id TEXT PRIMARY KEY,
 quote_id TEXT,
 action TEXT NOT NULL,
 detail TEXT,
 created_at INTEGER NOT NULL
);
