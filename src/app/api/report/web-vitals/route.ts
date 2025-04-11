import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import { NextRequest, NextResponse } from 'next/server';

// Check if InfluxDB is properly configured
const isInfluxDBConfigured = 
  process.env.INFLUXDB_URL && 
  process.env.INFLUXDB_TOKEN && 
  process.env.INFLUXDB_ORG && 
  process.env.INFLUXDB_BUCKET;

let influxDB: InfluxDB | null = null;
let writeApi: WriteApi | null = null;

if (isInfluxDBConfigured) {
  try {
    influxDB = new InfluxDB({
      url: process.env.INFLUXDB_URL || 'http://localhost:8086',
      token: process.env.INFLUXDB_TOKEN || '',
    });

    writeApi = influxDB.getWriteApi(
      process.env.INFLUXDB_ORG || '',
      process.env.INFLUXDB_BUCKET || 'web-vitals',
      'ms'
    );
  } catch (error) {
    console.error('Failed to initialize InfluxDB:', error);
    influxDB = null;
    writeApi = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid web vital data' },
        { status: 400 }
      );
    }

    const webVitalData = {
      name: body.name,
      value: body.value,
      id: body.id || '',
      label: body.label || '',
      navigationType: body.navigationType || '',
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || '',
      url: request.headers.get('x-url') || ''
    };

    if (influxDB && writeApi) {
      const point = new Point('web_vital')
        .floatField('value', webVitalData.value)
        .stringField('name', webVitalData.name)
        .stringField('id', webVitalData.id)
        .stringField('label', webVitalData.label)
        .stringField('navigationType', webVitalData.navigationType)
        .stringField('userAgent', webVitalData.userAgent)
        .stringField('referrer', webVitalData.referrer)
        .stringField('url', webVitalData.url);

      await writeApi.writePoint(point);
      console.info('Web vitals data sent to InfluxDB');
    } else {
      console.info('Web vitals data (InfluxDB not available):', webVitalData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing web vitals data:', error);
    return NextResponse.json(
      { error: 'Failed to send web vitals data' },
      { status: 500 }
    );
  }
}
