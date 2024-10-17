export async function onRequest(context) {
    let {env} = context;
    let kv1 = env.kv1;

    //setting preferences
    let preferences = JSON.stringify({"displayDuration": 5000, "preferredTypes": ["alert", "info"]});
    kv1.put("preferences", preferences);
    const response = new Response(preferences, { status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});

    //setting cookies
    response.headers.append('Set-Cookie', 'preferences=' + preferences);
    return response;
}