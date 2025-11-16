import db from '$lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as cookie from 'cookie';

interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;
const JWT_EXPIRES_IN = 3600;

export class UserController {
  static async createUser(data: CreateUserData) {
    const { username, email, password } = data;

    if (!username || !email || !password) {
      return { status: 'failed', error: 'Toate câmpurile sunt obligatorii', code: 400 };
    }

    const [existingUsers] = await db.query(
      'SELECT email, username FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if ((existingUsers as any).length > 0) {
      return { status: 'duplicate', message: 'Există deja un cont cu acest email sau username', code: 200 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    return {
      status: 'success',
      message: 'Utilizator creat cu succes!',
      userId: (result as any).insertId,
      code: 201
    };
  }

  static async loginUser(data: LoginUserData) {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 'failed', error: 'Email și parola sunt obligatorii', code: 400 };
    }

    const [rows] = await db.query('SELECT id, username, email, password FROM users WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return { status: 'failed', error: 'Email sau parola incorectă', code: 401 };
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 'failed', error: 'Email sau parola incorectă', code: 401 };
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const csrfToken = crypto.randomBytes(24).toString('hex');

    const cookies = [
      cookie.serialize('jwt', token, {
        httpOnly: true,
        path: '/',
        maxAge: JWT_EXPIRES_IN,
        sameSite: 'lax', // ⚡ important pe localhost
        // secure: true // NU pune secure pe localhost
      }),
      cookie.serialize('csrf', csrfToken, {
        path: '/',
        maxAge: JWT_EXPIRES_IN,
        sameSite: 'lax'
      })
    ];

    return {
      status: 'success',
      message: 'Login reușit',
      code: 200,
      user: { id: user.id, username: user.username },
      cookies
    };
  }

}
