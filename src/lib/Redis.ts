import {createClient} from 'redis'

const client = createClient({
    url:process.env.Redis_url
})
const redis = await client.connect()
process.on("exit",async function(){
    await client.disconnect()
})
export default redis