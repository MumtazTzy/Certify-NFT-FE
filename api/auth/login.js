// api/auth/login.js - Vercel/Netlify Serverless Function
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

// Database connection (using MongoDB as example)
const { MongoClient } = require('mongodb');

// Environment variables needed:
// JWT_SECRET, MONGODB_URI

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// Verify signature to ensure wallet ownership
function verifySignature(message, signature, address) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Main handler function
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, message, signature } = req.body;

  if (!address || !message || !signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verify the signature
    const isValidSignature = verifySignature(message, signature, address);
    
    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check message timestamp (prevent replay attacks)
    const messageLines = message.split('\n');
    const timestampLine = messageLines.find(line => line.startsWith('Timestamp:'));
    if (timestampLine) {
      const timestamp = parseInt(timestampLine.split(': ')[1]);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (now - timestamp > fiveMinutes) {
        return res.status(401).json({ error: 'Message expired' });
      }
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db('certify');
    const usersCollection = db.collection('users');

    // Check if user exists
    let user = await usersCollection.findOne({ 
      address: address.toLowerCase() 
    });

    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = {
        address: address.toLowerCase(),
        createdAt: new Date(),
        lastLogin: new Date(),
        profile: {
          name: '',
          email: '',
          bio: '',
          avatar: ''
        },
        certificates: []
      };

      await usersCollection.insertOne(user);
    } else {
      // Update last login
      await usersCollection.updateOne(
        { address: address.toLowerCase() },
        { $set: { lastLogin: new Date() } }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        address: address.toLowerCase(),
        isNewUser: isNewUser
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        address: user.address,
        profile: user.profile,
        createdAt: user.createdAt
      },
      isNewUser: isNewUser
    });

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Alternative implementation for different serverless platforms:

// For AWS Lambda
export const lambdaHandler = async (event, context) => {
  const req = {
    method: event.httpMethod,
    body: JSON.parse(event.body || '{}')
  };
  
  const res = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: '',
    status: (code) => ({ ...res, statusCode: code }),
    json: (data) => ({ ...res, body: JSON.stringify(data) }),
    setHeader: () => {} // Mock for compatibility
  };

  const result = await handler(req, res);
  
  return {
    statusCode: result.statusCode || res.statusCode,
    headers: res.headers,
    body: result.body || res.body
  };
};

// For Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const body = await req.json();
  
  // Implement the same logic as above
  // ... authentication logic ...
  
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});