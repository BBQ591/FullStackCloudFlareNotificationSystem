export async function onRequest(context) {
    let {request, env} = context;
    if (request.method == "POST") {
        const requestBody = await request.json();
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
            const {value} = await reader.read();
            return new Response(JSON.stringify({"category": JSON.parse(decoder.decode(value, {stream: true}).slice(6)).response.toLowerCase()}), {status: 200});
    }

}