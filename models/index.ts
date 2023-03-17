export type BooleanAnswer = "Yes" | "No";
export type Chapter = "Girraween" | "Armadale";
export type Roles = "Mentor" | "Mentee" | "Member" | "Unknown";
export type Attendance = "Weekly" | "Fortnightly" | "Other";

export interface SpeadsheetUser {
  "First Name": string;
  "Last Name": string;
  "Email address": string;
  "Additional email addresses (for intranet access)": string;
  Mobile: number;
  "Residential Address": string;
  "Date of Birth": string;
  "Over the age of 18 years?": BooleanAnswer;
  "Approval to publish Potographs?": BooleanAnswer;
  "Approved by MRC?": BooleanAnswer;
  Chapter: Chapter;
  "Role(s)": Roles[];
  "Committee Member": BooleanAnswer;
  "Current Member": BooleanAnswer;
  "Induction Date": string;
  "Active Mentor": BooleanAnswer;
  Attendance: Attendance;
  Mentee: string;
  "Mentee Year Level": string;
  "Police Check Renewal Date": string;
  "WWC Check Renewal Date": string;
  "Volunteer Agreement Complete": BooleanAnswer;
  "Board Member": BooleanAnswer;
  "Emergency Contact Name": string;
  "Emergency Contact Number": number;
  "Emergency Contact Address": string;
  "Emergency Contact Relationship": string;
}

export interface DBUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  additionalEmail: string;
  mobile: string;
  address: string;
  dateOfBirth: Date;
  isOver18: boolean;
  isPublishPhotoApproved: boolean;
  isApprovedByMRC: boolean;
  isCommiteeMemeber: boolean;
  isCurrentMemeber: boolean;
  inductionDate: Date;
  isActiveMentor: boolean;
  attendance: string | null;
  vaccinationStatus: string | null;
  policeCheckRenewalDate: Date;
  WWCCheckRenewalDate: Date;
  WWCCheckNumber: string;
  isVolunteerAgreementComplete: boolean;
  isBoardMemeber: boolean;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactAddress: string;
  emergencyContactRelationship: string;
  occupation: string | null;
  boardTermExpiryDate: Date | null;
  directorIdentificationNumber: string | null;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
