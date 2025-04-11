import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { NextRequest, NextResponse } from 'next/server';

const influxDB = new InfluxDB({
  url: process.env.INFLUXDB_URL || 'http://localhost:8086',
  token: process.env.INFLUXDB_TOKEN || '',
});

// Get the write API
const writeApi = influxDB.getWriteApi(
  process.env.INFLUXDB_ORG || '',
  process.env.INFLUXDB_BUCKET || 'web-vitals',
  'ms'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid web vital data' },
        { status: 400 }
      );
    }

    const point = new Point('web_vital')
      .floatField('value', body.value)
      .stringField('name', body.name)
      .stringField('id', body.id || '')
      .stringField('label', body.label || '')
      .stringField('navigationType', body.navigationType || '')
      .stringField('userAgent', request.headers.get('user-agent') || '')
      .stringField('referrer', request.headers.get('referer') || '')
      .stringField('url', request.headers.get('x-url') || '');

    await writeApi.writePoint(point);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending web vitals to InfluxDB:', error);
    return NextResponse.json(
      { error: 'Failed to send web vitals data' },
      { status: 500 }
    );
  }
}
