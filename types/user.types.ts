import { UserRole } from "./enums";

export interface UserInfo{
    id: string | number;
    name: string;
    email: string;
    role: UserRole;
    
}