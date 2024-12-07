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
    }catch(err){
        console.log(err);
        throw err;
    }
}



export async function query(sqlStatement: string, params?: any[]): Promise<any[]> {
    if (!pool) {
      await connectToDb();
    }
    const client = await pool.getConnection();
    try {
      const response = await client.query(sqlStatement, params);
      console.log('Query succeeded: ', response);
      return response;
    } catch (error) {
      console.error('Query failed: ', error);
      throw error;
    } finally {
      client.release();
    }
  }






export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users: User[] = await query('SELECT * FROM users');

        if(users.length < 1){
            sendResponse(res, 200, 'No users found');
        }

        sendResponse(res, 200, 'Users found');

    }catch(err){
        sendResponse(res, 500, 'An error occurred');
    }
}