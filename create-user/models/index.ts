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

export type Frequency = "Every week" | "Twice a month";

export type YesNoAnswer = "Yes" | "No";

export interface UserForm {
  "FIRST NAME:": string; // user
  "LAST NAME:": string; // user
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
  "Where did you hear about us?": HearAboutUs[]; // user form
  "Why would you like to become a Mentor or Volunteer?": string; // user form
  "We operate out of two locations, where would you prefer to mentor or volunteer?": Location; // user form
  "Our homework club runs from 10:00 AM to 12:00 PM every Saturday during school term-time. How often do you think you will be able to attend? ": Frequency[]; // user form
  "REFEREE 1 - First Name:": string; // user form
  "REFEREE 1 - Surname:": string; // user form
  "REFEREE 1 - Mobile:": string; // user form
  "REFEREE 1 - Email:": string; // user form
  "REFEREE 1 - When is the best time to contact referee 1?": string; // user form
  "REFEREE 1 - How they know you:": string; // user form
  "REFEREE 2 - First Name:": string; // user form
  "REFEREE 2 - Surname:": string; // user form
  "REFEREE 2 - Mobile:": string; // user form
  "REFEREE 2 - Email:": string; // user form
  "REFEREE 2 - When is the best time to contact referee 2?": string; // user form
  "REFEREE 2 - How they know you:": string; // user form
  "I am over 18 years of age:": YesNoAnswer; // user
  "To the best of my knowledge all details I have provided on this form are true and correct. I understand that submission of this form does not guarantee me a volunteer role at the Achievers Club WA:": YesNoAnswer[];
}

export interface UserEOIForm {
  bestTimeToContact: string;
  occupation: string;
  volunteerExperience: string;
  interestedInRole: string;
  mentoringLevel: string;
  hearAboutUs: string;
  mentorOrVolunteer: string;
  preferredLocation: string;
  preferredFrequency: string;
  isOver18: boolean;
  referee1FirstName: string;
  referee1Surname: string;
  referee1Mobile: string;
  referee1Email: string;
  referee1BestTimeToContact: string;
  referee1Relationship: string;
  referee2FirstName: string;
  referee2Surname: string;
  referee2Mobile: string;
  referee2Email: string;
  referee2BestTimeToContact: string;
  referee2Relationship: string;
}
