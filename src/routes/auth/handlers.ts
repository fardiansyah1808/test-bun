import { NotFoundError, Context, ParseError } from "elysia";
import db from "../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWTPayloadSpec } from "@elysiajs/jwt";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

interface DecodedToken extends JWTPayloadSpec {
  userId: string;
}

export async function signUp({ body }: { body: any }) {
  const { name, username, email, password } = body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  try {
    const emailExists = await db.user.findUnique({
      where: { email },
    });

    const usernameExists = await db.user.findUnique({
      where: { username },
    });

    if (emailExists || usernameExists) {
      throw new ParseError("Email or username already exists");
    }

    const newUser = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    // ctx.set.status
    return new Response(`User ${newUser.name} created successfully`, {
      status: 201,
      headers: {
        "Content-Type": "text/html; charset=utf8",
      },
    });
  } catch (error) {
    // ctx.set.status = 400;
    throw error;
  }
}

export async function signIn({ body }: { body: any }) {
  const { email, password } = body;

  // Find user by email
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      //   ctx.set.status = 404;
      throw new NotFoundError(`User with email ${email} not found`);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      //   ctx.set.status = 401;
      throw new ParseError(`Invalid password`);
    }

    if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
      throw new NotFoundError("JWT secret not found");
    }

    // Create JWT
    const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Save refresh token in the database
    await db.session.create({
      data: {
        userId: user.id,
        userName: user.username,
        accessToken,
        refreshToken,
      },
    });

    // ctx.set.status = 200;
    return new Response(JSON.stringify({ accessToken, refreshToken }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // ctx.set.status = 400;
    throw error;
  }
}

export async function refresh(ctx: Context, next: () => Promise<void>) {
  const refreshToken = ctx.headers["x-refresh-token"] as string;

  if (!refreshToken) {
    return new Response("Refresh token is required", {
      status: 400,
      headers: {
        "Content-Type": "text/html; charset=utf8",
      },
    });
  }

  if (!JWT_REFRESH_SECRET) {
    return new Response("JWT_REFRESH_SECRET tidak diatur", {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf8",
      },
    });
  }

  if (!JWT_ACCESS_SECRET) {
    return new Response("JWT_ACCESS_SECRET tidak diatur", {
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf8",
      },
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as DecodedToken;
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      JWT_ACCESS_SECRET,
      {
        expiresIn: "1h",
      }
    );
    ctx.set.headers = {
      "x-access-token": newAccessToken,
    };
    await next();
  } catch (err) {
    return new Response("Invalid refresh token", {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf8",
      },
    });
  }
}
