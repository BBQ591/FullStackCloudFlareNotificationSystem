const startTime = Date.now();
export async function onRequest(context) {
    // const url = new String(request.url);
    let {request, env} = context;
    let kv1 = env.kv1;
    if (await kv1.get('notifications') == null) {
        await kv1.put('notifications', '[]');
    }
    let newNotis = [];
    if (request.method === "POST") {
        const requestBody = await request.json();
        try {
            let value = JSON.parse(await kv1.get('notifications'));
            if (Array.isArray(requestBody) == false) {
                if (requestBody['type'] == null || requestBody['content']['text'] == null || typeof requestBody['read'] != "boolean") {
                    throw new Error();
                }
                requestBody['timestamp'] = Date.now()-startTime;
                requestBody['id'] = crypto.randomUUID();
                value.push(requestBody);

                newNotis.push(requestBody);
            } else {
                for (let i = 0; i < requestBody.length; i++) {
                    if (requestBody[i]['type'] == null || requestBody[i]['content']['text'] == null || typeof requestBody[i]['read'] != "boolean") {
                        throw new Error("This is wrong");
                    }
                    // value.push(JSON.parse(JSON.stringify(requestBody[i])));
                    requestBody[i]["timestamp"] = Date.now()-startTime;
                    requestBody[i]['id'] = crypto.randomUUID();
                    value.push(requestBody[i]);

                    newNotis.push(requestBody[i]);
                }
            }
    
            await kv1.put('notifications', JSON.stringify(value));
    
            return new Response(JSON.stringify(newNotis), { status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }
        catch{
            return new Response("Invalid Post", {status: 400, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }

    }
    if (request.method == "GET") {
        try {
            return new Response(await kv1.get('notifications'), {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }
        catch {
            return new Response("Invalid get", {status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }
    }
    if (request.method == "DELETE") {
        await kv1.put('notifications', '[]');
        return new Response(JSON.stringify({"message" : "Notifications deleted successfully!"}), {status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
    }
    return new Response("Not a valid command", {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}})
}

// export default {
//     async fetch() {
//         return new Response("hello", {status:200});
//         // return onRequest(request, env);
//     },
// };
