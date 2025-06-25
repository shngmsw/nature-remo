-- Nature Remo Sensor Data Table
CREATE TABLE sensor_data (
  id BIGSERIAL PRIMARY KEY,
  device_id TEXT NOT NULL,
  device_name TEXT NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  illuminance DECIMAL(10,2),
  movement INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_sensor_data_device_id ON sensor_data(device_id);
CREATE INDEX idx_sensor_data_created_at ON sensor_data(created_at);
CREATE INDEX idx_sensor_data_device_created ON sensor_data(device_id, created_at);

-- Row Level Security (RLS) - 必要に応じて有効化
-- ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;

-- データ保持期間の設定（例：30日間）
-- 注意：この設定はSupabaseのダッシュボードで設定することを推奨
-- または、定期的なクリーンアップジョブを作成

-- 統計情報を取得するためのビュー
CREATE OR REPLACE VIEW sensor_data_stats AS
SELECT 
  device_id,
  device_name,
  COUNT(*) as total_records,
  AVG(temperature) as avg_temperature,
  AVG(humidity) as avg_humidity,
  AVG(illuminance) as avg_illuminance,
  MAX(temperature) as max_temperature,
  MIN(temperature) as min_temperature,
  MAX(humidity) as max_humidity,
  MIN(humidity) as min_humidity,
  MAX(created_at) as latest_reading
FROM sensor_data
GROUP BY device_id, device_name; 