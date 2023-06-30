import {authorizedApi} from "../hooks/withAxiosIntercepted";
import {UserResponse} from "./UserResponse";

export class UserApi {
    static getUser = async () =>
        await authorizedApi.get<UserResponse>("http://localhost:8080/api/user");
}