import prisma from '../lib/database.js';
import { checkAsync } from '../lib/checkasync.js';
export const addProperty = checkAsync(async (req, res, next) => {
    const { title, user_id, location, photos, coverphoto, coverphotoid, listingtype, type, price, currency, amenities, summary, description, area, bed, bath, parkinglots } = req.body;
    const property = await prisma.property.create({ data: {
            title: title,
            summary: summary,
            description: description,
            coverphoto: coverphoto,
            coverphotoId: coverphotoid,
            Listring_type: listingtype,
            property_type: type,
            price: price,
            currency: currency,
            parking_lots: parkinglots,
            area: area,
            bedrooms: bed,
            bathrooms: bath,
            amenities: [1, 2, 3, 4],
            user_id: user_id
        } });
    let loc;
    let gallary;
    if (property) {
        loc = await prisma.location.create({ data: { ...location, property_id: property.id } });
        const prop_photos = photos.map((ele) => {
            return { ...ele, property_id: property.id };
        });
        gallary = await prisma.photos.createMany({ data: prop_photos });
    }
    res.status(201).json({
        status: "success",
        property: { ...property, photos: gallary, location: loc }
    });
});
