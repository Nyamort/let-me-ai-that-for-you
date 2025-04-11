'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {

    fetch('/api/report/web-vitals', {
      method: 'POST',
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        label: metric.label || '',
        navigationType: metric.navigationType || ''
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      console.error('Error sending web vitals to InfluxDB:', error)
    })
  })

  return null
}