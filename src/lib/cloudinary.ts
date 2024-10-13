import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
    cloud_name:process.env.cloudinary_cloudname,
    api_key:process.env.cloudinary_apikey,
    api_secret:process.env.cloudinary_apisecret
})

export default cloudinary