import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import Link from 'next/link';
import { SensorData } from '../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type SensorEvent = {
  val: number;
  created_at: string;
};

type Device = {
  id: string;
  name: string;
  newest_events: {
    te?: SensorEvent; // temperature
    hu?: SensorEvent; // humidity
    il?: SensorEvent; // illuminance
    mo?: SensorEvent; // movement
  };
};

type ChartData = {
  labels: Date[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
};

const Home = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('24');
  const [temperatureData, setTemperatureData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: '温度 (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });
  const [humidityData, setHumidityData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: '湿度 (%)',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/get-sensor-data?limit=100&hours=${selectedPeriod}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      }
      const data: SensorData[] = await res.json();
      // デバイスごとにグループ化
      const grouped = data.reduce<Record<string, SensorData[]>>((acc, cur) => {
        if (!acc[cur.device_id]) acc[cur.device_id] = [];
        acc[cur.device_id].push(cur);
        return acc;
      }, {});
      // デバイスリストを作成
      const deviceList = Object.keys(grouped).map((id: string) => ({
        id,
        name: grouped[id][0].device_name,
        newest_events: {
          te: grouped[id][0].temperature !== undefined && grouped[id][0].created_at ? { val: grouped[id][0].temperature, created_at: grouped[id][0].created_at as string } : undefined,
          hu: grouped[id][0].humidity !== undefined && grouped[id][0].created_at ? { val: grouped[id][0].humidity, created_at: grouped[id][0].created_at as string } : undefined,
          il: grouped[id][0].illuminance !== undefined && grouped[id][0].created_at ? { val: grouped[id][0].illuminance, created_at: grouped[id][0].created_at as string } : undefined,
          mo: grouped[id][0].movement !== undefined && grouped[id][0].created_at ? { val: grouped[id][0].movement, created_at: grouped[id][0].created_at as string } : undefined,
        }
      }));
      setDevices(deviceList);
      if (deviceList.length > 0 && !selectedDevice) {
        setSelectedDevice(deviceList[0].id);
      }
      if (selectedDevice) {
        const device = deviceList.find((d: Device) => d.id === selectedDevice);
        if (device) {
          // グラフ用データをSupabaseの履歴から生成
          const tempHistory = grouped[selectedDevice].map((d: SensorData) => ({ x: d.created_at, y: d.temperature })).filter((d) => d.x && d.y !== undefined);
          const humHistory = grouped[selectedDevice].map((d: SensorData) => ({ x: d.created_at, y: d.humidity })).filter((d) => d.x && d.y !== undefined);
          setTemperatureData({
            labels: tempHistory.map((d) => new Date(d.x as string)),
            datasets: [{
              label: '温度 (°C)',
              data: tempHistory.map((d) => d.y as number),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }],
          });
          setHumidityData({
            labels: humHistory.map((d) => new Date(d.x as string)),
            datasets: [{
              label: '湿度 (%)',
              data: humHistory.map((d) => d.y as number),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            }],
          });
        }
      }
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5分ごとに更新
    return () => clearInterval(interval);
  }, [selectedDevice, selectedPeriod]);

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    // Reset chart data when switching devices
    setTemperatureData({
      labels: [],
      datasets: [
        {
          label: '温度 (°C)',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
    setHumidityData({
      labels: [],
      datasets: [
        {
          label: '湿度 (%)',
          data: [],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    });
  };

  const getPeriodText = (hours: string) => {
    const hoursNum = parseInt(hours);
    if (hoursNum >= 24) {
      const days = hoursNum / 24;
      return days === 1 ? '過去24時間' : `過去${days}日間`;
    }
    return `過去${hours}時間`;
  };

  const selectedDeviceData = devices.find(d => d.id === selectedDevice);

  return (
    <div>
      <Head>
        <title>Nature Remo Monitor</title>
        <meta name="description" content="Nature Remo Temperature and Humidity Monitor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
            🌡️ Nature Remo モニター
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            リアルタイム温度・湿度監視システム
          </p>
          <Link href="/settings" style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s'
          }}>
            ⚙️ 設定
          </Link>
        </div>

        {/* Device Selection */}
        {devices.length > 1 && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <label htmlFor="device-select" style={{ marginRight: '1rem', fontWeight: 'bold' }}>
              デバイス選択:
            </label>
            <select
              id="device-select"
              value={selectedDevice}
              onChange={(e) => handleDeviceChange(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                minWidth: '200px'
              }}
            >
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Period Selection */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <label htmlFor="period-select" style={{ marginRight: '1rem', fontWeight: 'bold' }}>
            表示期間:
          </label>
          <select
            id="period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            <option value="1">過去1時間</option>
            <option value="6">過去6時間</option>
            <option value="12">過去12時間</option>
            <option value="24">過去24時間</option>
            <option value="48">過去48時間</option>
            <option value="168">過去7日間</option>
            <option value="720">過去30日間</option>
          </select>
        </div>

        {/* Status Information */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div>
            <strong>最終更新:</strong> {lastUpdated || '未更新'}
          </div>
          <div>
            <button
              onClick={fetchData}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? '読み込み中...' : '更新'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '4px', 
            marginBottom: '2rem',
            border: '1px solid #f5c6cb'
          }}>
            <strong>エラー:</strong> {error}
          </div>
        )}

        {/* Current Values Display */}
        {selectedDeviceData && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {selectedDeviceData.newest_events?.te && (
              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: '#fff3cd', 
                borderRadius: '8px',
                border: '1px solid #ffeaa7',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>🌡️ 温度</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>
                  {selectedDeviceData.newest_events.te.val}°C
                </div>
              </div>
            )}
            {selectedDeviceData.newest_events?.hu && (
              <div style={{ 
                padding: '1.5rem', 
                backgroundColor: '#d1ecf1', 
                borderRadius: '8px',
                border: '1px solid #bee5eb',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0c5460' }}>💧 湿度</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0c5460' }}>
                  {selectedDeviceData.newest_events.hu.val}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts */}
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Temperature Chart */}
          {temperatureData.datasets[0].data.length > 0 && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef'
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>温度履歴</h2>
              <Line
                data={temperatureData}
                options={{
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'minute',
                        tooltipFormat: 'PPpp',
                      },
                      title: {
                        display: true,
                        text: '時間',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: '温度 (°C)',
                      },
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: `温度履歴 (${getPeriodText(selectedPeriod)})`,
                    },
                  },
                }}
              />
            </div>
          )}

          {/* Humidity Chart */}
          {humidityData.datasets[0].data.length > 0 && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef'
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>湿度履歴</h2>
              <Line
                data={humidityData}
                options={{
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'minute',
                        tooltipFormat: 'PPpp',
                      },
                      title: {
                        display: true,
                        text: '時間',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: '湿度 (%)',
                      },
                      min: 0,
                      max: 100,
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: `湿度履歴 (${getPeriodText(selectedPeriod)})`,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* No Data Message */}
        {!isLoading && !error && (!selectedDeviceData?.newest_events?.te && !selectedDeviceData?.newest_events?.hu) && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>センサーデータがありません</h3>
            <p style={{ color: '#6c757d' }}>
              選択されたデバイスに温度・湿度センサーがないか、最近のデータが利用できません。
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
