import axios from "axios";
import {SignInRequest} from "./SignInRequest";
import {SignInResponse} from "./SignInResponse";
export class AuthApi {
    static signIn = async (request: SignInRequest) =>
        await axios.post<SignInResponse>("auth/authenticate", request);
}