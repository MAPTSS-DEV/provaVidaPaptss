import { Role } from './role';
export class User {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    access_token: string;
    token_type: string;
}