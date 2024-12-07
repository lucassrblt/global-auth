import mariadb from 'mariadb';
import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { sendResponse } from './responseHandler';


dotenv.config();
let pool: mariadb.Pool;


interface User {
    id: number;
    email: string;
    password: string;
    application: string;
}


const connectToDb = async () => {
    try {
        pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectionLimit: 5
        });
        console.log('Connected to database');
    }catch(err){
        console.log(err);
        throw err;
    }
}



export async function query(sqlStatement: string, params?: any[]): Promise<any[]> {
    console.log('Querying database');
    if (!pool) {
      await connectToDb();
    }
    const client = await pool.getConnection();
    try {
      const response = await client.query(sqlStatement, params);
      console.log('Query succeeded: ', response);
      return response;
    } catch (error) {
        console.log('Query failed: ', error);
      console.error('Query failed: ', error);
      throw error;
    } finally {
      client.release();
    }
  }


export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password, application } = req.body;
        console.log('email', email);
        console.log('password', password);
        console.log('application', application);
        const findUser = await query('SELECT * FROM users WHERE email = ? AND application = ?', [email, application]);

        if(findUser.length > 0){
            sendResponse(res, 409, 'User already exists');
        }

        const user: User[] = await query('INSERT INTO users (email, password, application) VALUES (?, ?, ?)', [email, password, application]);
        

        sendResponse(res, 201, user);
    }catch(err){
        sendResponse(res, 500, 'An error occurred');
    }
}






export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users: User[] = await query('SELECT * FROM users');
        console.log('users', users);

        if(users.length < 1){
            console.log('No users found');
            sendResponse(res, 200, 'No users found');
        }

        sendResponse(res, 200, users);

    }catch(err){
        sendResponse(res, 500, 'An error occurred');
    }
}