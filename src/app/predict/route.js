// export async function POST(req) {
//   try {
//     const body = await req.text(); // form data is sent as JSON string
//     const res = await fetch('http://localhost:5000/predict', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body,
//     });

//     if (!res.ok) {
//       return new Response(JSON.stringify({ error: 'Flask server error' }), { status: 500 });
//     }

//     const data = await res.json();

//     return new Response(JSON.stringify(data), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 200,
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

// src/app/api/predict/route.js
export async function GET() {
  try {
    const userId = "user_001"; // Replace later with session-based ID
    const res = await fetch(`http://127.0.0.1:5000/user-data/${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return new Response(JSON.stringify({
      name: "Ifra",
      goalProgress: data.goalProgress,
      goal: data.goal_type,
      saving: data.predicted_saving
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
