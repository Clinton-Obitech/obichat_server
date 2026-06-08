import supabase from "../../lib/supabase.js";
import { LoginBodyType, RegisterBodyType } from "../../types/auth.js";
import { hash, compare } from "bcrypt";

export const RegisterUser =
async (body: RegisterBodyType) =>
{
    const username = body.username.trim().toLowerCase();
    const email = body.email.trim().toLowerCase();
    const password = body.password.trim().toLowerCase();

    if (!username || !email || !password) {
        return {
            success: false,
            message: "missing input fields",
            status: 400
        }
    }

    const { data: existingUser, error: existingUserError } = await supabase
    .from("obichat_users")
    .select("*")
    .eq("username", username)
    .eq("email", email)
    .single()

    if (!existingUser || existingUserError) {

        const { data, error } = await supabase
        .from("obichat_users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

        if (error) throw error

        if (data) {
            return {
                success: false,
                message: "username already exists",
                status: 409
            }
        }

        const hashPassword = await hash(password, 10)

        const { data: user, error: userError } = await supabase
        .from("obichat_users")
        .insert({
            username: username,
            email: email,
            password: hashPassword
        })
        .select("id, role")
        .single();

        if (userError) throw userError

        return {
            success: true,
            message: "account registration success",
            user,
            status: 201
        }
    }

    return {
        success: false,
        message: "user already exists",
        status: 409
    }
}

export const LoginUser =
async (body: LoginBodyType) =>
{
    const username = body.username.trim().toLowerCase();
    const password = body.password.trim().toLowerCase();

    if (!username || !password) {
        return {
            success: false,
            message: "missing input fields",
            status: 400
        }
    }

    const { data: user, error: userError } = await supabase
    .from("obichat_users")
    .select("*")
    .eq("username", username)
    .single();


    if (!user || userError) {
        return {
            success: false,
            message: "user not found",
            status: 404
        }
    }

    const matchPassword = await compare(password, user.password)

    if (!matchPassword) {
        return {
            success: false,
            message: "incorrect password",
            status: 401
        }
    }

    return {
        success: true,
        message: "login success",
        user,
        status: 200
    }
}