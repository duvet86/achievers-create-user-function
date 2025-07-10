import type { ResultSetHeader } from "mysql2/promise";
import type {
  StudentForm,
  DBEOIStudent,
  DBStudentGuardian,
  DBStudentTeacher,
  DBChapter,
} from "../../models";

import { getConnectionAsync } from "../dbContext";

export async function createEOIStudentAsync(
  studentForm: StudentForm,
): Promise<number> {
  const connection = await getConnectionAsync();

  try {
    await connection.beginTransaction();

    const [chapters] = await connection.query<DBChapter[]>(
      "SELECT * FROM Chapter",
    );

    const selectedChapter = studentForm[
      "Which Chapter would you like your child to attend? "
    ]
      .trim()
      .toLowerCase();

    const preferredChapter = chapters.find(
      (c) => c.name.trim().toLowerCase() === selectedChapter,
    );

    const dbStudent: DBEOIStudent = {
      firstName: studentForm["FIRST NAME:"],
      lastName: studentForm["LAST NAME:"],
      preferredName: studentForm["PREFERRED NAME (if different):"],
      dateOfBirth: studentForm["DATE OF BIRTH:"],
      gender: studentForm["GENDER:"],
      mobile: studentForm["MOBILE (if your child has their own phone number):"],
      email: studentForm["EMAIL (if your child has their own email address):"],
      address: studentForm["FULL ADDRESS:"],
      dietaryRequirements:
        studentForm["DIETARY REQUIREMENTS or ALLERGIES (if any):"].join(),
      isEnglishMainLanguage:
        studentForm[
          "IS ENGLISH THE MAIN LANGUAGE SPOKEN IN THE STUDENT'S HOUSEHOLD? "
        ] === "Yes",
      otherLanguagesSpoken:
        studentForm[
          "WHAT OTHER LANGUAGES ARE SPOKEN IN THE STUDENT'S HOUSEHOLD? "
        ],
      bestPersonToContact:
        studentForm["BEST PERSON TO CONTACT FOR REGULAR COMMUNICATION: "],
      bestPersonToContactForEmergency:
        studentForm[
          'BEST PERSON TO CONTACT IN CASE OF EMERGENCY (if you select "Other", please provide their full name, relationship, phone, email and full address): '
        ],
      yearLevel: studentForm["YEAR LEVEL: "],
      favouriteSchoolSubject:
        studentForm["STUDENT'S FAVOURITE SCHOOL SUBJECTS: "],
      leastFavouriteSchoolSubject:
        studentForm["STUDENT'S LEAST FAVOURITE SCHOOL SUBJECTS: "],
      supportReason: studentForm["WHY IS THE STUDENT IN NEED OF SUPPORT: "],
      otherSupport:
        studentForm[
          "IS THE STUDENT RECEIVING ANY OTHER TYPE OF ASSISTANCE TO THEIR EDUCATION?"
        ],
      alreadyInAchievers:
        studentForm[
          "HAS THE STUDENT ATTENDED THE ACHIEVERS CLUB BEFORE? IF SO, WHEN? "
        ],
      heardAboutUs: studentForm["Where did you hear about us?"].join(),
      chapterId: preferredChapter
        ? Number(preferredChapter.id)
        : Number(chapters[0].id),
      weeklyCommitment:
        studentForm[
          "The Achievers Club runs every Saturday during the school term, from 10:00 AM to 12:00 PM.\n\nIs your child able and willing to commit to attending each week?"
        ] === "Yes",
      hasApprovedToPublishPhotos:
        studentForm[
          "If this application is successful, I give permission for the Club—and its approved third parties, such as sponsors—to use and publish photographs of me and/or my child in print, digital, or online materials for the purpose of promoting the activities of the Club or its sponsors.\n(You may choose to decline permission. Doing so will not affect your application. If you have any concerns regarding the use of photographs, please let us know.)"
        ] === "Yes",
      schoolName: studentForm["SCHOOL'S FULL NAME:"],
    };

    const [resultSetHeader] = await connection.query<ResultSetHeader>(
      `INSERT INTO EoiStudentProfile (
        firstName,
        lastName,
        preferredName,
        dateOfBirth,
        gender,
        mobile,
        email,
        address,
        dietaryRequirements,
        isEnglishMainLanguage,
        otherLanguagesSpoken,
        bestPersonToContact,
        bestPersonToContactForEmergency,
        yearLevel,
        favouriteSchoolSubject,
        leastFavouriteSchoolSubject,
        supportReason,
        otherSupport,
        alreadyInAchievers,
        heardAboutUs,
        chapterId,
        weeklyCommitment,
        hasApprovedToPublishPhotos,
        schoolName,
        createdAt,
        updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        dbStudent.firstName,
        dbStudent.lastName,
        dbStudent.preferredName,
        dbStudent.dateOfBirth,
        dbStudent.gender,
        dbStudent.mobile,
        dbStudent.email,
        dbStudent.address,
        dbStudent.dietaryRequirements,
        dbStudent.isEnglishMainLanguage,
        dbStudent.otherLanguagesSpoken,
        dbStudent.bestPersonToContact,
        dbStudent.bestPersonToContactForEmergency,
        dbStudent.yearLevel,
        dbStudent.favouriteSchoolSubject,
        dbStudent.leastFavouriteSchoolSubject,
        dbStudent.supportReason,
        dbStudent.otherSupport,
        dbStudent.alreadyInAchievers,
        dbStudent.heardAboutUs,
        dbStudent.chapterId,
        dbStudent.weeklyCommitment,
        dbStudent.hasApprovedToPublishPhotos,
        dbStudent.schoolName,
        new Date(),
        new Date(),
      ],
    );

    const dbStudentGuardian1: DBStudentGuardian = {
      fullName: studentForm["PARENT/GUARDIAN 1 - FULL NAME:"],
      preferredName:
        studentForm["PARENT/GUARDIAN 1 - PREFERRED NAME (if different):"],
      relationship:
        studentForm["PARENT/GUARDIAN 1 - RELATIONSHIP WITH STUDENT:"],
      phone: studentForm["PARENT/GUARDIAN 1 - MOBILE:"],
      email: studentForm["PARENT/GUARDIAN 1 - EMAIL:"],
      address: studentForm["PARENT/GUARDIAN 1 - FULL ADDRESS: "],
    };

    const dbStudentGuardian2: DBStudentGuardian = {
      fullName: studentForm["PARENT/GUARDIAN 2 - FULL NAME:"],
      preferredName:
        studentForm["PARENT/GUARDIAN 2 - PREFERRED NAME (if different):"],
      relationship:
        studentForm["PARENT/GUARDIAN 2 - RELATIONSHIP WITH STUDENT:"],
      phone: studentForm["PARENT/GUARDIAN 2 - MOBILE:"],
      email: studentForm["PARENT/GUARDIAN 2 - EMAIL:"],
      address: studentForm["PARENT/GUARDIAN 2 - FULL ADDRESS: "],
    };

    await connection.query<ResultSetHeader>(
      `INSERT INTO StudentGuardian (
        fullName,
        preferredName,
        relationship,
        phone,
        email,
        address,
        createdAt,
        updatedAt,
        eoiStudentProfileId)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        dbStudentGuardian1.fullName,
        dbStudentGuardian1.preferredName,
        dbStudentGuardian1.relationship,
        dbStudentGuardian1.phone,
        dbStudentGuardian1.email,
        dbStudentGuardian1.address,
        new Date(),
        new Date(),
        resultSetHeader.insertId,
      ],
    );

    await connection.query<ResultSetHeader>(
      `INSERT INTO StudentGuardian (
        fullName,
        preferredName,
        relationship,
        phone,
        email,
        address,
        createdAt,
        updatedAt,
        eoiStudentProfileId)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        dbStudentGuardian2.fullName,
        dbStudentGuardian2.preferredName,
        dbStudentGuardian2.relationship,
        dbStudentGuardian2.phone,
        dbStudentGuardian2.email,
        dbStudentGuardian2.address,
        new Date(),
        new Date(),
        resultSetHeader.insertId,
      ],
    );

    const dbStudentTeacher: DBStudentTeacher = {
      fullName: studentForm["MAIN TEACHER'S NAME:"],
      email: studentForm["MAIN TEACHER'S EMAIL:"],
      schoolName: studentForm["SCHOOL'S FULL NAME:"],
    };

    await connection.query<ResultSetHeader>(
      `INSERT INTO StudentTeacher (
        fullName,
        email,
        schoolName,
        subject,
        createdAt,
        updatedAt,
        eoiStudentProfileId)
      VALUES (?,?,?,?,?,?,?)`,
      [
        dbStudentTeacher.fullName,
        dbStudentTeacher.email,
        dbStudentTeacher.schoolName,
        null,
        new Date(),
        new Date(),
        resultSetHeader.insertId,
      ],
    );

    if (studentForm["MATHS TEACHER'S NAME (if different from above):"]) {
      const dbStudentTeacherMath: DBStudentTeacher = {
        fullName:
          studentForm["MATHS TEACHER'S NAME (if different from above):"],
        email: studentForm["MATHS TEACHER'S EMAIL (if different from above):"],
        schoolName: studentForm["SCHOOL'S FULL NAME:"],
      };

      await connection.query<ResultSetHeader>(
        `INSERT INTO StudentTeacher (
          fullName,
          email,
          schoolName,
          subject,
          createdAt,
          updatedAt,
          eoiStudentProfileId)
        VALUES (?,?,?,?,?,?,?)`,
        [
          dbStudentTeacherMath.fullName,
          dbStudentTeacherMath.email,
          dbStudentTeacherMath.schoolName,
          "MATH",
          new Date(),
          new Date(),
          resultSetHeader.insertId,
        ],
      );
    }

    if (studentForm["ENGLISH TEACHER'S NAME (if different from above):"]) {
      const dbStudentTeacherEnglish: DBStudentTeacher = {
        fullName:
          studentForm["ENGLISH TEACHER'S NAME (if different from above):"],
        email:
          studentForm["ENGLISH TEACHER'S EMAIL (if different from above):"],
        schoolName: studentForm["SCHOOL'S FULL NAME:"],
      };

      await connection.query<ResultSetHeader>(
        `INSERT INTO StudentTeacher (
          fullName,
          email,
          schoolName,
          subject,
          createdAt,
          updatedAt,
          eoiStudentProfileId)
        VALUES (?,?,?,?,?,?,?)`,
        [
          dbStudentTeacherEnglish.fullName,
          dbStudentTeacherEnglish.email,
          dbStudentTeacherEnglish.schoolName,
          "ENGLISH",
          new Date(),
          new Date(),
          resultSetHeader.insertId,
        ],
      );
    }

    await connection.commit();

    await connection.end();

    return resultSetHeader.insertId;
  } catch (e) {
    await connection.rollback();

    throw e;
  } finally {
    connection.destroy();
  }
}
