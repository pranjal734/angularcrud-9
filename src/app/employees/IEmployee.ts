import { ISkill } from './ISkill';

export interface IEmployee {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: number;
    contactPreference: string;
    skills: ISkill[];

}
