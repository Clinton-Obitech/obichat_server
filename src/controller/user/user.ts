import { Request, Response } from "express"
import { Chat, Search, User, Users } from "../../lib/user.js"

export const UserController = 
async (req: Request, res: Response) => 
{
    try {

        if (!req.user) {
            return res.status(401)
        }

        const user = await User(req.user?.id)

        return res.status(200).json(user)

    } catch (err) {
        console.error(err)
        return res.status(500)
    }
}

type SearchParams = {
    username: string;
}

export const SearchController = 
async (req: Request<SearchParams>, res: Response) => 
{
    try {

        if (!req.user) {
            return res.status(401)
        }

        const user = await Search(req.params?.username)

        return res.status(200).json(user)

    } catch (err) {
        console.error(err)
        return res.status(500)
    }
}

export const UsersController = 
async (req: Request, res: Response) => 
{
    try {

        if (!req.user) {
            return res.status(401)
        }

        const users = await Users(req.user?.id)

        return res.status(200).json(users)

    } catch (err) {
        console.error(err)
        return res.status(500)
    }
}

type Params = {
    id: string;
}

export const ChatController = 
async (req: Request<Params>, res: Response) => 
{
    try {

        if (!req.user) {
            return res.status(401)
        }

        const chat = await Chat(req.user?.id, req.params?.id)

        return res.status(200).json(chat)

    } catch (err) {
        console.error(err)
        return res.status(500)
    }
}