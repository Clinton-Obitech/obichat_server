import supabase from "./supabase.js";

export const User = async (userId: string) =>
{
    const { data, error } = await supabase
    .from("obichat_users")
    .select("id, username")
    .eq("id", userId)
    .single()

    if (error) throw error

    return data
}

export const Users = async (userId: string) =>
{
    const { data, error } = await supabase
    .from("obichat_private_messages")
    .select("receiver_id, receiver_username")
    .eq("sender_id", userId)

    if (error) throw error

    return data
}

export const Search = async (username: string) =>
{
    const { data, error } = await supabase
    .from("obichat_users")
    .select("id, username")
    .eq("username", username)
    .single();

    if (error) throw error

    return data
}

export const Chat = async (senderId: string, selectedUser: string) => {
    const { data, error } = await supabase
    .from("obichat_private_messages")
    .select("*")
    .or(`and(sender_id.eq.${senderId},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${senderId})`)
    .order("created_at", {ascending:true});

    if (error) return console.error(error)

    return data;
}