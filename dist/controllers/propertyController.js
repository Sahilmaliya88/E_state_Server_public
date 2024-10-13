import redis from '../lib/Redis.js';
import prisma from '../lib/database.js';
import { checkAsync } from '../lib/checkasync.js';
import AppError from '../utils/AppError.js';
import cloudinary from '../lib/cloudinary.js';
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
            amenities: amenities,
            user_id: user_id
        } });
    let loc;
    let gallary;
    if (property) {
        loc = await prisma.location.create({ data: {
                addressline: location.addressline,
                city: location.city,
                country: location.country,
                lag: Number.parseFloat(location.lag),
                lat: Number.parseFloat(location.lat),
                property_id: property.id
            } });
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
export const getProperty = checkAsync(async (req, res, next) => {
    let property = await redis.get(`prop-${req.params.id}`);
    if (!property) {
        property = await prisma.property.findFirst({ where: { id: Number.parseInt(req.params.id) }, include: { location: true, photos: true } });
        const amenities = await prisma.amenities.findMany({
            where: {
                id: {
                    in: property.amenities
                }
            }
        });
        await redis.set(`prop-${req.params.id}`, JSON.stringify({ ...property, amenities: [...amenities] }));
        await redis.expire(`prop-${req.params.id}`, 60 * 60);
        return res.status(200).json({
            status: "success",
            property: { ...property, amenities: [...amenities] }
        });
    }
    return res.status(200).json({
        status: "success",
        property: JSON.parse(property)
    });
});
//return query obj of only allowed fields
const allowedQuery = (queryObj, ...args) => {
    const resObj = {};
    for (let ele in queryObj) {
        if (args.find((field) => field === ele)) {
            resObj[ele] = queryObj[ele];
        }
    }
    return resObj;
};
export const getProperties = checkAsync(async (req, res, next) => {
    const query = allowedQuery(req.query, "page", "limit");
    console.log(query);
    const page = Number.parseInt(query.page) - 1 || 0;
    const limit = query.limit ? Number.parseInt(query.limit) : 6;
    const skip = page * limit;
    let properties;
    //if user define perticular page then check in redis
    if (req.query.page) {
        properties = await redis.get(`page:page-${page}`);
    }
    //if current page is not cached or user didn't request with pagination
    if (!properties || !req.query.page) {
        properties = await prisma.property.findMany({ select: {
                id: true,
                coverphoto: true,
                title: true,
                price: true,
                currency: true,
                bedrooms: true,
                area: true,
                bathrooms: true,
                location: {
                    select: {
                        city: true
                    }
                }
            },
            skip: skip,
            take: limit,
            orderBy: {
                id: "desc"
            }
        });
        //if user request with pagination then cache 
        if (req.query.page) {
            await redis.set(`page:page-${page}`, JSON.stringify(properties));
            await redis.expire(`page:page-${page}`, 60 * 60);
        }
        //prisma data response
        return res.status(200).json({
            status: "success",
            properties: properties
        });
    }
    //redis data response
    res.status(200).json({
        status: "success",
        properties: JSON.parse(properties)
    });
});
//separate filtering
export const fileterProperty = checkAsync(async (req, res, next) => {
    const query = req.query;
    const page = Number.parseInt(query.page) || 0;
    const limit = query.limit ? Number.parseInt(query.limit) : 6;
    const skip = page * limit;
    const searchString = query.keyword;
    const location = query.city || "";
    const lowestprice = Number.parseInt(query.low) || 0;
    const highest_price = Number.parseInt(query.high) || 100000000;
    const type = query.types?.split(',') || ["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "AGRICULTURAL", "RECREATIONAL", "MIXED_USE"];
    const properties = await prisma.property.findMany({ where: {
            AND: [
                { OR: [
                        {
                            title: { contains: searchString, mode: "insensitive" }
                        }, {
                            summary: { contains: searchString, mode: "insensitive" }
                        }
                    ] }, { location: {
                        city: {
                            contains: location, mode: "insensitive"
                        }
                    } },
                {
                    price: {
                        gte: lowestprice,
                        lte: highest_price
                    }
                },
                {
                    property_type: {
                        in: type,
                    }
                }
            ]
        },
        select: {
            id: true,
            coverphoto: true,
            title: true,
            price: true,
            currency: true,
            bedrooms: true,
            area: true,
            bathrooms: true,
            location: {
                select: {
                    city: true
                }
            }
        },
        skip: skip,
        take: limit,
        orderBy: {
            id: "desc"
        }
    });
    res.status(200).json({
        status: "success",
        properties: properties
    });
});
export const delPropertis = checkAsync(async (req, res, next) => {
    const user = req.user.id;
    const id = req.params.id;
    //find property for the photos to delete from the cloud for free up storage
    const property = await prisma.property.findFirst({ where: {
            AND: [
                {
                    id: Number.parseInt(id)
                },
                {
                    user_id: user
                }
            ]
        }, include: { photos: {
                select: {
                    photoId: true
                }
            } } });
    //make sure that only owner can delete this property
    if (!property) {
        return next(new AppError("you have not any rights to delete this property", 401));
    }
    //delete property for the redis cache and also delete pagination caches
    await redis.del(`prop-${property?.id}`);
    const keys = await redis.keys('page:*');
    await redis.unlink(keys);
    //delet photos from the cloudinary 
    await cloudinary.uploader.destroy(property.coverphotoId);
    const photos = property.photos.map((ele) => ele.photoId);
    await cloudinary.api.delete_all_resources(photos);
    //delete property from the db
    await prisma.property.delete({ where: { id: property.id } });
    //response
    res.status(200).json({
        status: "successfully deleted"
    });
});
const checkField_In_Card = (dataobj) => {
    const core_fields = ["title", "coverphoto", "price", "currency", "bedrooms", "bathrooms", "area"];
    for (let ele in dataobj) {
        if (core_fields.find((f) => f === ele)) {
            return true;
        }
    }
    return false;
};
export const editproperty = checkAsync(async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;
    const property = await prisma.property.update({
        where: { id: Number.parseInt(id) }, data: { ...data }
    });
    await redis.del(`prop-${property.id}`);
    if (checkField_In_Card(data)) {
        const keys = await redis.keys('page:*');
        await redis.unlink(keys);
    }
    return res.status(200).json({
        message: "successfully updated"
    });
});
