export async function onRequest(context) {
    let {request, env} = context;

    //ai can only do POST request
    if (request.method == "POST") {
        const question = await request.json();

        //ask AI question
        const stream = await env.llama3.run("@cf/meta/llama-3-8b-instruct", {
            stream: true,
            messages: [
                { role: "user", content: "Lets say that we have the sections finance, weather, health, technology. What does this phrase belong to:"+ question['text'] +"Please respond with the word only. no phrases"},
            ],
        });

        //reading and returning AI's response
        const decoder = new TextDecoder();
        const reader = stream.getReader();
        const {value} = await reader.read();
        return new Response(JSON.stringify({"category": JSON.parse(decoder.decode(value, {stream: true}).slice(6)).response.toLowerCase()}), {status: 200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
    }

    //if its not a post request, then it should return that any other request is invalid
    return new Response("INVALID REQUEST FOR AI", {status:200, headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'office', 'Content-Type': 'application/json'}});
}