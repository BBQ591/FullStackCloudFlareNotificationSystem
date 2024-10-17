//startTime for timestamp
const startTime = Date.now();

export async function onRequest(context) {
    let {request, env} = context;

    //defining my key value
    let kv1 = env.kv1;
    if (await kv1.get('notifications') == null) {
        await kv1.put('notifications', '[]');
    }

    if (request.method === "POST") {

        try {
            //notifications from this request
            let newNotifications = await request.json();

            //previous notifications
            let kv1Notifications = JSON.parse(await kv1.get('notifications'));

            //standarizing data structure of newNotifications to be a list of notifications
            if (Array.isArray(newNotifications) == false) {
                newNotifications = [newNotifications];
            }

            //validating and adding id/timestamp values to each notification
            for (let i = 0; i < newNotifications.length; i++) {
                //error checking to make sure that every value in newNotifications is valid
                if (newNotifications[i]['type'] == null || newNotifications[i]['content']['text'] == null || typeof newNotifications[i]['read'] != "boolean") {
                    throw new Error("POST request data is wrong");
                }
                newNotifications[i]["timestamp"] = Date.now()-startTime;
                newNotifications[i]['id'] = crypto.randomUUID();
                kv1Notifications.push(newNotifications[i]);
            }

            //updating kv1
            await kv1.put('notifications', JSON.stringify(kv1Notifications));
    
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