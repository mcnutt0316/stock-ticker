import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const {searchParams} = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';

    const apiKey = process.env.MARKET_STACK_API_KEY;

    if(!apiKey){
        return NextResponse.json({ error: 'API key not configured'}, { status: 500});
    }

    try{
        const response = await fetch(`http://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${symbol}&limit=1`)

  const data = await response.json();
    return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stock data' }, {status: 500})
    }
}