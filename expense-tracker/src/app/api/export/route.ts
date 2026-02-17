// API Route: POST /api/export
// Accepts export format and filters, returns a downloadable file

import { NextRequest, NextResponse } from 'next/server';
import { exportExpenses, ExportFormat } from '@/lib/exporters';

const MIME_TYPES: Record<ExportFormat, string> = {
  csv:  'text/csv',
  pdf:  'application/pdf',
  json: 'application/json',
};

export async function POST(req: NextRequest) {
  // TODO: add authentication check

  const body = await req.json();
  const format: ExportFormat = body.format ?? 'csv';

  const blob = await exportExpenses({ format, ...body });
  const buffer = Buffer.from(await blob.arrayBuffer());

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': MIME_TYPES[format],
      'Content-Disposition': `attachment; filename="expenses.${format}"`,
    },
  });
}
