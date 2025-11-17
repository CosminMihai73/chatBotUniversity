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

function getJwtSecret() {
  const raw = import.meta.env.VITE_JWT_SECRET as string | undefined;
  if (!raw) return undefined;
  return raw.replace(/^['"]|['"]$/g, '').trim();
}

const JWT_SECRET = getJwtSecret();
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
      return { status: 'failed', error: 'Email și parola sunt obligatorii', code: 200 };
    }

    const [rows] = await db.query('SELECT id, username, email, password, idFacultate, idCicluStudii FROM users WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return { status: 'invalid', error: 'Email sau parola incorectă', code: 200 };
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 'invalid', error: 'Email sau parola incorectă', code: 200 };
    }

    if (!JWT_SECRET) {
      console.error('JWT secret is not configured (VITE_JWT_SECRET)');
      return { status: 'failed', error: 'Server configuration error', code: 500 };
    }

    const tokenPayload: any = { id: user.id, email: user.email };
    // include profile fields in token so hook can detect incomplete profiles
    tokenPayload.idFacultate = user.idFacultate ?? null;
    tokenPayload.idCicluStudii = user.idCicluStudii ?? null;

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const csrfToken = crypto.randomBytes(24).toString('hex');

    const cookies = [
      cookie.serialize('jwt', token, {
        httpOnly: true,
        path: '/',
        maxAge: JWT_EXPIRES_IN,
        sameSite: 'lax', 
      
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
      user: { id: user.id, username: user.username, idFacultate: user.idFacultate ?? null, idCicluStudii: user.idCicluStudii ?? null },
      cookies
    };
  }

  static async setStudentInfo(userId: number, data: { idFacultate: number | null; idCicluStudii: number | null }) {
    const { idFacultate, idCicluStudii } = data;

    await db.query('UPDATE users SET idFacultate = ?, idCicluStudii = ? WHERE id = ?', [idFacultate, idCicluStudii, userId]);

    const [rows] = await db.query('SELECT id, email, idFacultate, idCicluStudii FROM users WHERE id = ?', [userId]);
    const users = rows as any[];
    if (users.length === 0) return { status: 'failed', error: 'User not found', code: 404 };

    const user = users[0];

    if (!JWT_SECRET) {
      console.error('JWT secret is not configured (VITE_JWT_SECRET)');
      return { status: 'failed', error: 'Server configuration error', code: 500 };
    }

    const tokenPayload: any = { id: user.id, email: user.email, idFacultate: user.idFacultate ?? null, idCicluStudii: user.idCicluStudii ?? null };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const cookies = [
      cookie.serialize('jwt', token, {
        httpOnly: true,
        path: '/',
        maxAge: JWT_EXPIRES_IN,
        sameSite: 'lax'
      })
    ];

    return { status: 'success', message: 'Informații studiu actualizate', code: 200, cookies };
  }

  static async logoutUser() {
    // Clear the jwt and csrf cookies by setting them with maxAge=0
    const cookies = [
      cookie.serialize('jwt', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'lax'
      }),
      cookie.serialize('csrf', '', {
        path: '/',
        maxAge: 0,
        sameSite: 'lax'
      })
    ];

    return {
      status: 'success',
      message: 'Logout reușit',
      code: 200,
      cookies
    };
  }

}
