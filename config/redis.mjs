import redis from 'redis'

let client = redis.client;

const connectRedis = async () => {
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

const getClient = async () => {
    return client;
}

export default connectRedis;
export { getClient };