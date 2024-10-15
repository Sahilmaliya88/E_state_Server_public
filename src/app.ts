import express,{Request,Response,NextFunction} from 'express'
import {createServer} from 'http';
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config({path: './.env',});
import { globalErrorhandler } from './utils/globalErrorhandlers.js'
import cookieparser from 'cookie-parser'
export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
import passport from 'passport';
import session from 'express-session'
import rootRouter from './routes/Router.js';
const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app)
app.use(express.json());
app.use(cookieparser())
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:' * ',credentials:true}));
app.use(session({
    secret:"nothing",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev')) 
// your routes here
app.use('/',rootRouter)

app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    globalErrorhandler(err,req,res,next)
});
server.listen(port, () => console.log('Server is working on Port:'+port+' in '+envMode+' Mode.'));
export default server