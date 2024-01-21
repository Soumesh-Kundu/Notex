"use server";

import db from "@/lib/db";
import { hash } from "bcrypt";
import { sign as JWTsign, verify as JWTverify, JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { Resend } from "resend";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: string;
  }
}
type User = {
  name: string;
  email: string;
  password: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);
export async function register({
  name,
  email,
  password,
}: User): Promise<{ message: string; status: number }> {
  try {
    let user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return { message: "user already exists", status: 400 };
    }
    const hashPassword = await hash(password, 10);
    user = await db.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });
    console.log(user);
    return { message: "user created", status: 200 };
  } catch (error) {
    console.log(error);
    return { message: "user created", status: 500 };
  }
}

export async function forgetPassword({
  email,
}: {
  email: string;
}): Promise<{ message: string; status: number }> {
  try {
    let user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user.password) {
      return { message: "user doesn't exist", status: 401 };
    }
    const secret = user?.password + process.env.JWT_SECRET;
    const token = JWTsign(
      {
        id: user.id,
      },
      secret,
      { expiresIn: "15m" }
    );
    const link = `http://localhost:3000//reset-password/${user.id}/${token}`;
    const { data, error } = await resend.emails.send({
      from: "Password Reset <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset",
      html: `<a href="${link}">reset password</a>`,
    });
    if (error) {
      console.log(error);
      return { message: "link not sent", status: 400 };
    }
    return { message: "link sent", status: 200 };
  } catch (error) {
    console.log(error);
    return { message: "Internal server Error", status: 500 };
  }
}
export async function verifyUser({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<{ message: string; verified?: boolean; status?: number }> {
  try {
    let user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user || !user.password) {
      redirect("/login");
    }
    const secret = user?.password + process.env.JWT_SECRET;
    const parsedToken = JWTverify(token, secret) as { id: string };
    if (parsedToken?.id !== user.id) {
      redirect("/login");
    }
    return { message: "verified", verified: true };
  } catch (error) {
    // console.log(error);
    return { message: "Internal server Error", status: 500 };
  }
}

export async function resetPassword({
  id,
  token,
  password,
}: {
  id: string;
  token: string;
  password: string;
}) {
  try {
    let user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user || !user.password) {
      redirect("/login");
    }
    const secret = user?.password + process.env.JWT_SECRET;
    const parsedToken = JWTverify(token, secret) as { id: string };
    if (parsedToken?.id !== user.id) {
      redirect("/login");
    }
    const hashPassword = await hash(password, 10);
    await db.user.update({
      where: {
        id,
      },
      data: {
        password:hashPassword,
      },
    })
    return { message: "password updated", status: 200 }
  } catch (error) {
    console.log(error)
    return {message: "Internal server Error", status: 500}
  }
}
