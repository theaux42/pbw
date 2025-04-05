import { NextResponse } from 'next/server';
import { XummSdk } from 'xumm-sdk';
import xrpl from 'xrpl';

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination, amount, callbackUrl } = body;

    // Validate required parameters
    if (!destination || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: destination and amount are required' },
        { status: 400 }
      );
    }

    // Initialize Xumm SDK with environment variables
    const xumm = new XummSdk(
      process.env.XUMM_API_KEY,
      process.env.XUMM_API_SECRET
    );

    // Prepare the transaction
    const txJson = {
      TransactionType: 'Payment',
      Destination: destination,
      Amount: (parseFloat(amount) * 1_000_000).toString(), // Convert to drops (XRP * 1,000,000)
    };

    // Create the payload with callback URL for front-end notification
    const payload = await xumm.payload.create({
      txjson: txJson,
      options: {
        submit: true,
        expire: 300, // 5 minutes expiration
        return_url: {
          app: callbackUrl || null,
          web: callbackUrl || null
        }
      }
    });

    // Return the payload details to the frontend
    return NextResponse.json({
      success: true,
      payload: {
        uuid: payload.uuid,
        next: {
          always: payload.next.always,
          no_push_msg_received: payload.next.no_push_msg_received
        },
        qrcode: payload.refs.qr_png,
        link: payload.next.always
      }
    });

  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// Endpoint to check transaction status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');
    
    if (!uuid) {
      return NextResponse.json(
        { error: 'Missing payload UUID' },
        { status: 400 }
      );
    }

    const xumm = new XummSdk(
      process.env.XUMM_API_KEY,
      process.env.XUMM_API_SECRET
    );

    // Get payload status
    const payloadStatus = await xumm.payload.get(uuid);
    
    if (payloadStatus.meta.expired) {
      return NextResponse.json({ status: 'expired' });
    }
    
    if (payloadStatus.meta.resolved) {
      return NextResponse.json({
        status: 'resolved',
        signed: payloadStatus.meta.signed,
        txid: payloadStatus.response.txid || null,
        transactionUrl: payloadStatus.response.txid 
          ? `https://testnet.xrpl.org/transactions/${payloadStatus.response.txid}`
          : null
      });
    }
    
    // Transaction is still pending
    return NextResponse.json({ status: 'pending' });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}