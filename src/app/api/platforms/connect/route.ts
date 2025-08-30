import { NextRequest, NextResponse } from 'next/server';
import { PlatformConnector } from '@/lib/platform-connector';

const platformConnector = new PlatformConnector();

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json();

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      );
    }

    const authUrl = platformConnector.getAuthUrl(platform);
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Platform connection error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate platform connection' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const platforms = platformConnector.getAllPlatforms();
    return NextResponse.json({ platforms });
  } catch (error) {
    console.error('Failed to fetch platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}
