export async function onRequest(context) {
    // const url = new String(request.url);
    let {env} = context;
    let kv1 = env.kv1;
    let preferences = JSON.stringify({"displayDuration": 5000, "preferredTypes": ["alert", "info"]});
    kv1.put("preferences", preferences);
    const response = new Response(preferences, { status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
    response.headers.append('Set-Cookie', 'preferences=' + preferences);
    return response;
}

// export default {
//     async fetch() {
//         return new Response("hello", {status:200});
//         // return onRequest(request, env);
//     },
// };
