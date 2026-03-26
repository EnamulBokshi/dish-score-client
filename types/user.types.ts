import { UserRole } from "./enums";

export interface UserInfo{
    id: number;
    name: string;
    email: string;
    role: UserRole;
    
}