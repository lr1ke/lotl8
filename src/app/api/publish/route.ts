import { NextResponse, NextRequest } from 'next/server';    
import Bundlr from "@bundlr-network/client";
 

const BNDLR_KEY = process.env.BNDLR_KEY;
export async function POST(req: NextRequest) {
    const data = await req.json()
    const bundlr = new Bundlr("http://node1.bundlr.network", "solana", BNDLR_KEY)
    await bundlr.ready()
  
    const tx = await bundlr.upload(data, {
      tags: [{ name: 'Content-Type', value: 'application/json' }],
    })
  
    return NextResponse.json({ txId: `https://arweave.net/${tx.id}` })
  }