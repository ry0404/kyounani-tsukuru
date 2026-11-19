CREATE TABLE IF NOT EXISTS daily_clicks (
  day TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, recipe_id)
);
CREATE INDEX IF NOT EXISTS idx_daily_clicks_day_clicks
ON daily_clicks(day, clicks DESC);