import type { NextApiRequest, NextApiResponse } from 'next';

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

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Device[] | ErrorResponse>
) {
  const accessToken = process.env.NATURE_REMO_ACCESS_TOKEN;
  const apiEndpoint = process.env.NATURE_REMO_API_ENDPOINT || 'https://api.nature.global/1';

  if (!accessToken) {
    res.status(500).json({ message: 'Nature Remo access token is not set. Please set NATURE_REMO_ACCESS_TOKEN in your environment variables.' });
    return;
  }

  try {
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
      res.status(404).json({ message: 'No devices found. Please check your Nature Remo setup.' });
      return;
    }

    // 全デバイスのデータを返す
    res.status(200).json(devices);
  } catch (error) {
    console.error('Nature Remo API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
}
