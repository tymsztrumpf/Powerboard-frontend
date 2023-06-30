import axios from "axios";
import {SignInRequest} from "./SignInRequest";
import {SignInResponse} from "./SignInResponse";
import {SignUpRequest} from "./SignUpRequest";
export class AuthApi {
    static signUp = async (request: SignUpRequest) =>
        await axios.post("http://localhost:8080/api/v1/auth/register", request);
    static signIn = async (request: SignInRequest) =>
        await axios.post<SignInResponse>("http://localhost:8080/api/v1/auth/authenticate", request);
}