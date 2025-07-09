import type { RowDataPacket } from "mysql2/promise";
import type { YesNoAnswer } from "./common";

export type State =
  | "Western Australia"
  | "Victoria"
  | "New South Wales"
  | "South Australia"
  | "Queensland"
  | "Northern Territory"
  | "ACT"
  | "Other / International";

export type Role =
  | "Mentoring"
  | "Fundraising"
  | "Administrative assistance"
  | "Chapter coordinator";

export type MentoringLevel =
  | "Primary School level"
  | "Years 7-9"
  | "Years 10-12"
  | "No preference"
  | "Not applicable";

export type HearAboutUs =
  | "Word of mouth"
  | "Volunteering WA"
  | "Seek"
  | "UWA"
  | "Curtin";

export type Location = "Girrawheen" | "Armadale" | "Other";

export type Frequency = "Weekly" | "Fortnightly" | string;

export interface UserForm {
  "FIRST NAME:": string; // user
  "LAST NAME:": string; // user
  "PREFERRED NAME (if different):": string; // user
  "MOBILE:": string; // user
  "EMAIL:": string; // azure
  "When is the best time to contact you?": string; // user form
  "ADDRESS - STREET:": string; // user
  "ADDRESS - SUBURB:": string; // user
  "ADDRESS - STATE:": State; // user
  "ADDRESS - POSTCODE:": string; // user
  "Current occupation:": string; // user form
  "Relevant work/volunteer experience (if any):": string; // user form
  "What role(s) would you be interested in?": Role[]; // user form
  "What level(s) would you be comfortable mentoring at?": MentoringLevel[]; // user form
  "If you have indicated that you are comfortable mentoring a student at year 10 or above, what subjects are you most comfortable concentrating on?": string[];
  "Where did you hear about us?": HearAboutUs[]; // user form
  "Why would you like to become a Mentor or Volunteer?": string; // user form
  "Have you volunteered with us before? If so, when?": string;
  "LinkedIn profile link (if you have one):": string;
  "We operate out of the following locations, where would you prefer to mentor or volunteer?": Location; // user form
  "Our homework club runs from 10:00 AM to 12:00 PM every Saturday during school term-time. How often are you able to attend? ": Frequency[]; // user form
  "REFEREE 1 - First Name:": string; // user form
  "REFEREE 1 - Surname:": string; // user form
  "REFEREE 1 - Mobile:": string; // user form
  "REFEREE 1 - Email:": string; // user form
  "REFEREE 1 - When is the best time to contact referee 1?": string; // user form
  "REFEREE 1 - How do they know you?": string; // user form
  "REFEREE 2 - First Name:": string; // user form
  "REFEREE 2 - Surname:": string; // user form
  "REFEREE 2 - Mobile:": string; // user form
  "REFEREE 2 - Email:": string; // user form
  "REFEREE 2 - When is the best time to contact referee 2?": string; // user form
  "REFEREE 2 - How do they know you?": string; // user form
  "I am over 18 years of age:": YesNoAnswer; // user
  "To the best of my knowledge all details I have provided on this form are true and correct. I understand that submission of this form does not guarantee me a volunteer role at the Achievers Club WA:": YesNoAnswer[];
  "TELL US ABOUT YOU:": string | undefined;
}

export interface DBUser {
  azureADId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  preferredName: string | null;
  mobile: string;
  addressStreet: string;
  addressSuburb: string;
  addressState: string;
  addressPostcode: string;
  additionalEmail: string | null;
  dateOfBirth: Date | null;
  emergencyContactName: string | null;
  emergencyContactNumber: string | null;
  emergencyContactAddress: string | null;
  emergencyContactRelationship: string | null;
  chapterId: string;
  frequencyInDays: number | null;
}

export interface DBEoIProfile {
  bestTimeToContact: string;
  occupation: string;
  volunteerExperience: string;
  role: string;
  mentoringLevel: string;
  heardAboutUs: string;
  preferredFrequency: string;
  preferredSubject: string;
  isOver18: boolean;
  comment: string;
  aboutMe: string | null;
  linkedInProfile: string | null;
  wasMentor: string;
  mentorId: number;
}

export interface DBReference {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  bestTimeToContact: string;
  relationship: string;
  generalComment: string | null;
  outcomeComment: string | null;
  hasKnowApplicantForAYear: boolean | null;
  isRelated: boolean | null;
  isMentorRecommended: boolean | null;
  calledBy: string | null;
  calledOndate: Date | null;
  mentorId: number;
}

export interface DBChapter extends RowDataPacket {
  id: string;
  name: string;
}
