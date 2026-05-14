export enum Role {
    ADMIN = 'ADMIN',
    PASSENGER = 'PASSENGER',
    PILOT = 'PILOT'

}

export interface User {
    id?: number; 
    username: string; 
    email: string; 
    password?: string; 
    contactNumber?: number; 
    role: Role;
}
