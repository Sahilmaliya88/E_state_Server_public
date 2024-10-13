import prisma from '../lib/database.js';
import redis from '../lib/Redis.js';
import { checkAsync } from '../lib/checkasync.js';
export const addAmenities = checkAsync(async (req, res) => {
    const data = req.body;
    const amenities = await prisma.amenities.createMany({
        data: data
    });
    res.status(200).json({
        message: "amenities added successfully"
    });
});
export const getAll = checkAsync(async (req, res) => {
    let amenities = await redis.get("amenities");
    if (!amenities) {
        amenities = await prisma.amenities.findMany();
        await redis.set("amenities", JSON.stringify(amenities));
        return res.status(200).json({
            amenities: amenities
        });
    }
    res.status(200).json({
        amenities: JSON.parse(amenities)
    });
});
