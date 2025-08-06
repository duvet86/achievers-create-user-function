export interface StudentForm {
  "FIRST NAME:": string;
  "LAST NAME:": string;
  "PREFERRED NAME (if different):": string;
  "DATE OF BIRTH:": string;
  "GENDER:": string;
  "MOBILE (if your child has their own phone number):": string;
  "EMAIL (if your child has their own email address):": string;
  "FULL ADDRESS:": string;
  "DIETARY REQUIREMENTS or ALLERGIES (if any):": string[];
  "IS ENGLISH THE MAIN LANGUAGE SPOKEN IN THE STUDENT'S HOUSEHOLD? ": string;
  "WHAT OTHER LANGUAGES ARE SPOKEN IN THE STUDENT'S HOUSEHOLD? ": string;
  "PARENT/GUARDIAN 1 - FULL NAME:": string;
  "PARENT/GUARDIAN 1 -  PREFERRED NAME (if different):": string;
  "PARENT/GUARDIAN 1 -  RELATIONSHIP WITH STUDENT:": string;
  "PARENT/GUARDIAN 1 -  MOBILE:": string;
  "PARENT/GUARDIAN 1 -  EMAIL:": string;
  "PARENT/GUARDIAN 1 -  FULL ADDRESS: ": string;
  "PARENT/GUARDIAN 2 - FULL NAME:": string;
  "PARENT/GUARDIAN 2 -  PREFERRED NAME (if different):": string;
  "PARENT/GUARDIAN 2 -  RELATIONSHIP WITH STUDENT:": string;
  "PARENT/GUARDIAN 2 -  MOBILE:": string;
  "PARENT/GUARDIAN 2 -  EMAIL:": string;
  "PARENT/GUARDIAN 2 -  FULL ADDRESS: ": string;
  "BEST PERSON TO CONTACT FOR REGULAR COMMUNICATION: ": string;
  'BEST PERSON TO CONTACT IN CASE OF EMERGENCY (if you select "Other", please provide their full name, relationship, phone, email and full address): ': string;
  "SCHOOL'S FULL NAME:": string;
  "YEAR LEVEL: ": string;
  "MAIN TEACHER'S NAME:": string;
  "MAIN TEACHER'S EMAIL:": string;
  "MATHS TEACHER'S NAME (if different from above):": string;
  "MATHS TEACHER'S EMAIL (if different from above):": string;
  "ENGLISH TEACHER'S NAME (if different from above):": string;
  "ENGLISH TEACHER'S EMAIL (if different from above):": string;
  "STUDENT'S FAVOURITE SCHOOL SUBJECTS: ": string;
  "STUDENT'S LEAST FAVOURITE SCHOOL SUBJECTS: ": string;
  "WHY IS THE STUDENT IN NEED OF SUPPORT: ": string;
  "IS THE STUDENT RECEIVING ANY OTHER TYPE OF ASSISTANCE TO THEIR EDUCATION?": string;
  "HAS THE STUDENT ATTENDED THE ACHIEVERS CLUB BEFORE? IF SO, WHEN? ": string;
  "Where did you hear about us?": string[];
  "Which Chapter would you like your child to attend? ": string;
  "The Achievers Club runs every Saturday during the school term, from 10:00 AM to 12:00 PM.\n\nIs your child able and willing to commit to attending each week?": string;
  "PLEASE READ THE STATEMENTS BELOW AND INDICATE YOUR AGREEMENT BY CHECKING EACH BOX: ": string[];
  "If this application is successful, I give permission for the Club—and its approved third parties, such as sponsors—to use and publish photographs of me and/or my child in print, digital, or online materials for the purpose of promoting the activities of the Club or its sponsors.\n(You may choose to decline permission. Doing so will not affect your application. If you have any concerns regarding the use of photographs, please let us know.)": string;
  "This form must be signed by a parent or guardian (over 18 years of age).\nPlease type your full name below as a digital signature. A hard copy will be provided for you to sign in person on your child’s first day at the Club.": "asdsad";
  "DATE: ": string;
}

export interface DBEOIStudent {
  firstName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  mobile?: string;
  email?: string;
  address: string;
  dietaryRequirements: string;
  isEnglishMainLanguage: boolean;
  otherLanguagesSpoken: string;
  bestPersonToContact: string;
  bestPersonToContactForEmergency: string;
  yearLevel: string;
  favouriteSchoolSubject: string;
  leastFavouriteSchoolSubject: string;
  supportReason: string;
  otherSupport: string;
  alreadyInAchievers: string;
  heardAboutUs: string;
  chapterId: number;
  weeklyCommitment: boolean;
  hasApprovedToPublishPhotos: boolean;
  schoolName: string;
}

export interface DBStudentGuardian {
  fullName: string;
  preferredName: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export interface DBStudentTeacher {
  fullName: string;
  email: string;
  schoolName: string;
}
