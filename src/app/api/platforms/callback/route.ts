import { NextRequest, NextResponse } from 'next/server';
import { PlatformConnector } from '@/lib/platform-connector';

const platformConnector = new PlatformConnector();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const platform = searchParams.get('platform');

    if (!code || !platform) {
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_parameters', request.url)
      );
    }

    // Exchange code for access token
    const tokenData = await platformConnector.exchangeCodeForToken(platform, code);
    
    // Fetch platform metrics
    const metrics = await platformConnector.fetchPlatformMetrics(
      platform, 
      tokenData.access_token
    );

    // In a real app, you would save this to your database
    // For now, we'll redirect back to dashboard with success
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('connected', platform);
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('error', 'connection_failed');
    
    return NextResponse.redirect(redirectUrl);
  }
}
