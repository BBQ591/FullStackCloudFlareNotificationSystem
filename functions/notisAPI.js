const startTime = Date.now();
export async function onRequest(request) {
    const kv1 = {};
    if (kv1.notifications == null) {
        kv1.notifications = [];
    }
    let newNotis = [];
    const url = new String(request.url);
    if (request.method === "POST") {
        const requestBody = await request.json();
        if (url.includes('notifications') == true) {
            try {
                let value = JSON.parse(kv1[notifications]);
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
        
                kv1.notifications.push(value);
        
                return new Response(JSON.stringify(newNotis), { status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
            }
            catch{
                return new Response("Invalid Post", {status: 400, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
            }
        } else if (url.includes('ai') == true) {
            const stream = await env.llama3.run("@cf/meta/llama-3-8b-instruct", {
                stream: true,
                // max_tokens: 512,
                messages: [
                  { role: "user", content: "Lets say that we have the sections finance, weather, health, technology. What does this phrase belong to:"+ requestBody['text'] +"Please respond with the word only. no phrases"},
                ],
              });
            //   console.log(stream);
              const decoder = new TextDecoder();
              const reader = stream.getReader();
              const {done, value} = await reader.read();
              return new Response(JSON.stringify({"category": JSON.parse(decoder.decode(value, {stream: true}).slice(6)).response.toLowerCase()}), {status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }

    }
    if (request.method == "GET") {
        if (url.includes('notifications') == true) {
            return new Response(JSON.stringify(kv1.notifications), {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'}});

        }
        else if (url.includes('preferences')) {
            let preferences = JSON.stringify({"displayDuration": 5000, "preferredTypes": ["alert", "info"]});
            const response = new Response(preferences, { status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'}});
            response.headers.append('Set-Cookie', 'preferences=' + preferences);
            return response;
        }
    }
    if (request.method == "DELETE") {
        kv1.notifications.put([]);
        return new Response(JSON.stringify({"message" : "Notifications deleted successfully!"}), {status: 200});
    }
    return new Response("Not a valid command", {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'}})
}

export default {
    async fetch(request) {
        return onRequest(request);
    },
};
