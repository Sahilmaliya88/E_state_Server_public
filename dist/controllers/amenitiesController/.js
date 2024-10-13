import prisma from '../lib/database.js';
import redis from '../lib/Redis.js';
import { checkAsync } from '../lib/checkasync.js';
const addAmenities = checkAsync(async (req, res) => {
    const data = req.body;
    const amenities = await prisma.amenities.createMany({
        data: data
    });
    await redis.set("amenities", JSON.stringify(amenities));
});
const getAll = checkAsync(async (req, res) => {
    let amenities = await redis.get("amenities");
    if (!amenities) {
        amenities = await prisma.amenities.findMany();
        await redis.set("amenities", JSON.stringify(amenities));
        return res.status(200).json({
            addAmenities: amenities
        });
    }
});
