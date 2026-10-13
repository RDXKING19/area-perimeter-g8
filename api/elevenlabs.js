/**
 * Vercel Serverless Function: ElevenLabs Audio TTS Proxy
 * Handles POST /api/elevenlabs requests securely using ELEVENLABS_API_KEY
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY environment variable not configured' });
  }

  const { text, voiceId, modelId, voice_settings } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'Missing text in request body' });
  }

  const targetVoice = voiceId || 'Xb7hH8MSUJpSbSDYk0k2';
  const targetModel = modelId || 'eleven_multilingual_v2';

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: targetModel,
          voice_settings: voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!upstream.ok) {
      const errText = await upstream.text();
      return res.status(upstream.status).send(errText);
    }

    const audioBuffer = await upstream.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
