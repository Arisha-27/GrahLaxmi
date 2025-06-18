export async function POST(req) {
  try {
    const body = await req.text(); // form data is sent as JSON string
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Flask server error' }), { status: 500 });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
