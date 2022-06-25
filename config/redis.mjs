import redis from 'redis'

let client = null;

const getClient= async () => {
    if(client)
    return client;
    client = redis.createClient();
    client.on('connect', function () {
        console.log('Connected!');
    }
    );
    client.on('error', (err) => console.log('Redis Client Error', err));
    try {
        
        await client.connect();
    } catch (err) {
        console.log(err);
    }
    return client;
}

export default getClient;