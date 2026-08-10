#!/usr/bin/env node
import dotenv from 'dotenv';
import GoogleGenAI from '@google/genai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY is not set in the environment or .env file.');
  console.error('Set GEMINI_API_KEY and re-run:');
  console.error('\n  PowerShell: $env:GEMINI_API_KEY="YOUR_KEY"; node scripts/list_gemini_models.mjs');
  console.error('  Unix: GEMINI_API_KEY=YOUR_KEY node scripts/list_gemini_models.mjs\n');
  process.exit(1);
}

const client = new GoogleGenAI({
  apiKey,
  vertexai: false,
  httpOptions: { baseUrl: 'https://generativelanguage.googleapis.com/' }
});

async function listModels() {
  try {
    const res = await client.models.list();
    const models = res?.models || res?.model || [];

    if (!models || models.length === 0) {
      console.log('No models returned. Full response:');
      console.log(JSON.stringify(res, null, 2));
      return;
    }

    console.log('Available Gemini models for this API key:');
    for (const m of models) {
      // common property is `name` like 'models/gemini-2.5-flash'
      const name = m?.name || m?.id || JSON.stringify(m);
      console.log('-', name);
    }
  } catch (err) {
    console.error('Failed to list models:');
    if (err?.response) console.error(JSON.stringify(err.response, null, 2));
    else console.error(err);
    process.exit(2);
  }
}

listModels();
