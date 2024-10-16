import {Router} from 'express'
const rootRouter= Router()
import OauthRouter from '../routes/Oauth.js';
import locationRouter from '../routes/locationRoute.js';
import propertyRoute from '../routes/propertyRoute.js';
import amenitiesRoute from '../routes/amenitiesRoute.js';
import requestRouter from '../routes/requestRoutes.js';
import { authRouter } from './authRoute.js';
import chatboxroute from './chatroomroute.js';
import articleRouter from './articleRoute.js';
import reviewRoute from './reviewRoutes.js';
rootRouter.use('/auth',authRouter)
rootRouter.use('/Oauth',OauthRouter)
rootRouter.use('/location',locationRouter)
rootRouter.use('/property',propertyRoute)
rootRouter.use('/amenities',amenitiesRoute)
rootRouter.use('/request',requestRouter)
rootRouter.use('/chatrooms',chatboxroute)
rootRouter.use('/article',articleRouter)
rootRouter.use('/reviews').use(reviewRoute)
export default rootRouter
