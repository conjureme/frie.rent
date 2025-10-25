import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const LANYARD_USER_ID = '860733331532808213';
const CACHE_DURATION = 30000;

let cachedData: any = null;
let lastFetchTime = 0;

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const now = Date.now();

  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...cachedData,
        cached: true,
        cacheAge: now - lastFetchTime,
      }),
    };
  }

  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`
    );

    if (!response.ok) {
      throw new Error(`lanyard API returned ${response.status}`);
    }

    const data = await response.json();

    cachedData = data;
    lastFetchTime = now;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...data,
        cached: false,
        cacheAge: 0,
      }),
    };
  } catch (error) {
    console.error('error fetching lanyard data:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'failed to fetch discord status',
      }),
    };
  }
};
