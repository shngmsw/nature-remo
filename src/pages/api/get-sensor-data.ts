import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, SensorData } from '../../lib/supabase';

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorData[] | ErrorResponse>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const { device_id, limit = '100', hours = '24' } = req.query;

    let query = supabase
      .from('sensor_data')
      .select('*')
      .order('created_at', { ascending: false });

    // デバイスIDでフィルタリング
    if (device_id && typeof device_id === 'string') {
      query = query.eq('device_id', device_id);
    }

    // 時間範囲でフィルタリング（デフォルト24時間）
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - parseInt(hours as string));
    query = query.gte('created_at', hoursAgo.toISOString());

    // 取得件数制限
    query = query.limit(parseInt(limit as string));

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      res.status(500).json({ message: `Failed to fetch data from Supabase: ${error.message}` });
      return;
    }

    res.status(200).json(data || []);

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
} 