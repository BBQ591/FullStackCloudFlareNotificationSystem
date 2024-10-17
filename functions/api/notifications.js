export async function onRequest(context) {
    //startTime for timestamp
    const startTime = Date.now();


    let {request, env} = context;

    //defining my key value
    let kv1 = env.kv1;
    if (await kv1.get('notifications') == null) {
        await kv1.put('notifications', '[]');
    }

    if (request.method === "POST") {
        //saving new notifications from this POST request to return later
        let newNotifications = [];

        const requestBody = await request.json();
        try {
            let value = JSON.parse(await kv1.get('notifications'));

            //standarizing data structure of requestBody to be a list of notifications
            if (Array.isArray(requestBody) == false) {
                requestBody = [requestBody];
            }

            //validating and adding id/timestamp values to each notification
            for (let i = 0; i < requestBody.length; i++) {
                //error checking to make sure that every value in requestBody is valid
                if (requestBody[i]['type'] == null || requestBody[i]['content']['text'] == null || typeof requestBody[i]['read'] != "boolean") {
                    throw new Error("POST request data is wrong");
                }
                requestBody[i]["timestamp"] = Date.now()-startTime;
                requestBody[i]['id'] = crypto.randomUUID();
                value.push(requestBody[i]);
                newNotifications.push(requestBody[i]);
            }

            //updating kv1
            await kv1.put('notifications', JSON.stringify(value));
    
            return new Response(JSON.stringify(newNotifications), { status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }
        catch{
            //catches an error if POST request has something wrong with it
            return new Response("Invalid POST request", {status: 400, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }

    }
    //FETCH request
    else if (request.method == "GET") {
        try {
            return new Response(await kv1.get('notifications'), {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }
        catch {
            return new Response("Invalid FETCH request", {status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
        }
    }
    //DELETE request
    else if (request.method == "DELETE") {
        //reset kv1
        await kv1.put('notifications', '[]');
        return new Response(JSON.stringify({"message" : "Notifications deleted successfully!"}), {status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
    }

    //catches if the request method isnt any of the above
    return new Response("Not a valid command. Please do a POST, GET, or DELETE request", {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}})
}