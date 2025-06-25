import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type SensorEvent = {
  val: number;
  created_at: string;
};

type Device = {
  id: string;
  name: string;
  serial_number: string;
  mac_address: string;
  firmware_version: string;
  newest_events: {
    te?: SensorEvent;
    hu?: SensorEvent;
    il?: SensorEvent;
    mo?: SensorEvent;
  };
};

const Settings = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/devices');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch devices');
      }
      const data: Device[] = await res.json();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getSensorStatus = (device: Device) => {
    const sensors = [];
    if (device.newest_events?.te) sensors.push('🌡️ Temperature');
    if (device.newest_events?.hu) sensors.push('💧 Humidity');
    if (device.newest_events?.il) sensors.push('💡 Illuminance');
    if (device.newest_events?.mo) sensors.push('👤 Movement');
    return sensors.length > 0 ? sensors.join(', ') : 'No sensors detected';
  };

  return (
    <div>
      <Head>
        <title>Settings - Nature Remo Monitor</title>
        <meta name="description" content="Settings and device information for Nature Remo Monitor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333' }}>
              ⚙️ Settings
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Device information and application settings
            </p>
          </div>
          <Link href="/" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}>
            ← Back to Dashboard
          </Link>
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
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading device information...</p>
          </div>
        )}

        {/* Device Information */}
        {!isLoading && !error && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Connected Devices</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {devices.map((device) => (
                <div key={device.id} style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{device.name}</h3>
                      <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                        Device ID: {device.id}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        Connected
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <strong>Serial Number:</strong>
                      <p style={{ margin: '0.25rem 0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {device.serial_number}
                      </p>
                    </div>
                    <div>
                      <strong>MAC Address:</strong>
                      <p style={{ margin: '0.25rem 0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {device.mac_address}
                      </p>
                    </div>
                    <div>
                      <strong>Firmware Version:</strong>
                      <p style={{ margin: '0.25rem 0', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {device.firmware_version}
                      </p>
                    </div>
                    <div>
                      <strong>Available Sensors:</strong>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        {getSensorStatus(device)}
                      </p>
                    </div>
                  </div>

                  {/* Current Sensor Values */}
                  {(device.newest_events?.te || device.newest_events?.hu) && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Current Values:</h4>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {device.newest_events?.te && (
                          <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#fff3cd',
                            borderRadius: '4px',
                            border: '1px solid #ffeaa7'
                          }}>
                            🌡️ {device.newest_events.te.val}°C
                          </div>
                        )}
                        {device.newest_events?.hu && (
                          <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#d1ecf1',
                            borderRadius: '4px',
                            border: '1px solid #bee5eb'
                          }}>
                            💧 {device.newest_events.hu.val}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Settings */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Application Settings</h2>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Environment Configuration</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Make sure you have set up the following environment variables:
              </p>
              <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <div><strong>NATURE_REMO_ACCESS_TOKEN</strong> = your_access_token_here</div>
                <div><strong>NATURE_REMO_API_ENDPOINT</strong> = https://api.nature.global/1 (optional)</div>
                <div><strong>DATA_REFRESH_INTERVAL</strong> = 300000 (optional, 5 minutes)</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Data Refresh</h3>
              <p style={{ color: '#666', margin: '0' }}>
                The application automatically refreshes sensor data every 5 minutes. 
                You can manually refresh data from the dashboard.
              </p>
            </div>

            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Supported Sensors</h3>
              <ul style={{ color: '#666', margin: '0', paddingLeft: '1.5rem' }}>
                <li><strong>Temperature (te):</strong> Room temperature in Celsius</li>
                <li><strong>Humidity (hu):</strong> Room humidity percentage</li>
                <li><strong>Illuminance (il):</strong> Light level in lux</li>
                <li><strong>Movement (mo):</strong> Motion detection events</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Troubleshooting</h2>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Common Issues</h3>
              <ul style={{ color: '#666', margin: '0', paddingLeft: '1.5rem' }}>
                <li><strong>No devices found:</strong> Check your Nature Remo setup and ensure devices are connected</li>
                <li><strong>Authentication error:</strong> Verify your access token is correct and not expired</li>
                <li><strong>No sensor data:</strong> Ensure your Nature Remo device has temperature/humidity sensors</li>
                <li><strong>Network errors:</strong> Check your internet connection and Nature Remo API status</li>
              </ul>
            </div>

            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Getting Help</h3>
              <p style={{ color: '#666', margin: '0' }}>
                For more information, visit the{' '}
                <a href="https://developer.nature.global/" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                  Nature Remo API documentation
                </a>
                {' '}or check the project README for detailed setup instructions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings; 