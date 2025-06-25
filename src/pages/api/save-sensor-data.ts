import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, SensorData, Device } from '../../lib/supabase';

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message: string } | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const accessToken = process.env.NATURE_REMO_ACCESS_TOKEN;
  const apiEndpoint = process.env.NATURE_REMO_API_ENDPOINT || 'https://api.nature.global/1';

  if (!accessToken) {
    res.status(500).json({ message: 'Nature Remo access token is not set' });
    return;
  }

  try {
    // Nature Remo APIからデータを取得
    const response = await fetch(`${apiEndpoint}/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch data from Nature Remo API: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const devices: Device[] = await response.json();
    
    if (devices.length === 0) {
      res.status(404).json({ message: 'No devices found' });
      return;
    }

    // 各デバイスのデータをSupabaseに保存
    const sensorDataToInsert: SensorData[] = devices.map(device => ({
      device_id: device.id,
      device_name: device.name,
      temperature: device.newest_events.te?.val,
      humidity: device.newest_events.hu?.val,
      illuminance: device.newest_events.il?.val,
      movement: device.newest_events.mo?.val,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('sensor_data')
      .insert(sensorDataToInsert)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      res.status(500).json({ message: `Failed to save data to Supabase: ${error.message}` });
      return;
    }

    res.status(200).json({ 
      success: true, 
      message: `Successfully saved data for ${devices.length} device(s)` 
    });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
} 