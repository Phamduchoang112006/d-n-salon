import React, { createContext, useContext, useState } from 'react';
import {
  UserAccount,
  SchoolClass,
  Teacher,
  Student,
  Subject,
  Semester,
  TeachingAssignment,
  GradeRecord,
  StudentRemark,
  TimetableSlot,
} from './hocBaTypes';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_SEMESTERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_GRADES,
  INITIAL_REMARKS,
  INITIAL_TIMETABLE,
  computeDTB,
} from './mockData';

interface HocBaContextType {
  currentUser: UserAccount | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  switchRoleQuickly: (userId: string) => void;

  semesters: Semester[];
  activeSemester: Semester;
  setActiveSemesterId: (semId: string) => void;
  toggleSemesterLock: (semId: string) => void;
  updateSemesterDeadline: (semId: string, deadline: string) => void;

  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (cls: SchoolClass) => void;
  deleteClass: (id: string) => void;

  teachers: Teacher[];
  addTeacher: (t: Omit<Teacher, 'id'>) => void;
  updateTeacher: (t: Teacher) => void;
  deleteTeacher: (id: string) => void;

  students: Student[];
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;

  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (sub: Subject) => void;
  deleteSubject: (id: string) => void;

  users: UserAccount[];
  addUser: (u: Omit<UserAccount, 'id'>) => void;
  updateUser: (u: UserAccount) => void;
  deleteUser: (id: string) => void;

  assignments: TeachingAssignment[];
  assignTeacher: (a: Omit<TeachingAssignment, 'id'>) => void;
  deleteAssignment: (id: string) => void;

  grades: GradeRecord[];
  updateGradeRecord: (record: Partial<GradeRecord> & { studentId: string; subjectId: string; semesterId: string }) => void;

  remarks: StudentRemark[];
  updateStudentRemark: (rem: Omit<StudentRemark, 'id' | 'updatedAt'> & { id?: string }) => void;

  timetables: TimetableSlot[];

  // Helper stats
  getStudentGrades: (studentId: string, semesterId?: string) => GradeRecord[];
  getStudentGPA: (studentId: string, semesterId?: string) => number | undefined;
  getAcademicClassification: (gpa?: number) => 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' | 'Chưa xếp loại';
  getClassStatistics: (classId: string, semesterId?: string) => { total: number; gioit: number; kha: number; tb: number; yeu: number; gioitPct: number; khaPct: number; tbPct: number; yeuPct: number };
  getGradeLevelStatistics: (gradeNum: number, semesterId?: string) => { total: number; gioit: number; kha: number; tb: number; yeu: number; gioitPct: number; khaPct: number; tbPct: number; yeuPct: number };
}

const HocBaContext = createContext<HocBaContextType | undefined>(undefined);

export const HocBaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USERS[0]); // Default to Admin
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [semesters, setSemesters] = useState<Semester[]>(INITIAL_SEMESTERS);
  const [activeSemesterId, setActiveSemesterIdState] = useState<string>('sem1');
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [assignments, setAssignments] = useState<TeachingAssignment[]>(INITIAL_ASSIGNMENTS);
  const [grades, setGrades] = useState<GradeRecord[]>(INITIAL_GRADES);
  const [remarks, setRemarks] = useState<StudentRemark[]>(INITIAL_REMARKS);
  const [timetables, setTimetables] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const activeSemester = semesters.find(s => s.id === activeSemesterId) || semesters[0];

  const login = (username: string, password?: string): boolean => {
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (user) {
      if (!password || user.password === password) {
        setCurrentUser(user);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRoleQuickly = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const setActiveSemesterId = (semId: string) => {
    setActiveSemesterIdState(semId);
  };

  const toggleSemesterLock = (semId: string) => {
    setSemesters(prev =>
      prev.map(s => (s.id === semId ? { ...s, isLocked: !s.isLocked } : s))
    );
  };

  const updateSemesterDeadline = (semId: string, deadline: string) => {
    setSemesters(prev =>
      prev.map(s => (s.id === semId ? { ...s, entryDeadline: deadline } : s))
    );
  };

  // CRUD Classes
  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newCls: SchoolClass = { ...cls, id: `class_${Date.now()}` };
    setClasses(prev => [...prev, newCls]);
  };
  const updateClass = (cls: SchoolClass) => {
    setClasses(prev => prev.map(c => (c.id === cls.id ? cls : c)));
  };
  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // CRUD Teachers
  const addTeacher = (t: Omit<Teacher, 'id'>) => {
    const newT: Teacher = { ...t, id: `gv_${Date.now()}` };
    setTeachers(prev => [...prev, newT]);
  };
  const updateTeacher = (t: Teacher) => {
    setTeachers(prev => prev.map(item => (item.id === t.id ? t : item)));
  };
  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(item => item.id !== id));
  };

  // CRUD Students
  const addStudent = (s: Omit<Student, 'id'>) => {
    const newS: Student = { ...s, id: `hs_${Date.now()}` };
    setStudents(prev => [...prev, newS]);
  };
  const updateStudent = (s: Student) => {
    setStudents(prev => prev.map(item => (item.id === s.id ? s : item)));
  };
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(item => item.id !== id));
  };

  // CRUD Subjects
  const addSubject = (sub: Omit<Subject, 'id'>) => {
    const newSub: Subject = { ...sub, id: `sub_${Date.now()}` };
    setSubjects(prev => [...prev, newSub]);
  };
  const updateSubject = (sub: Subject) => {
    setSubjects(prev => prev.map(item => (item.id === sub.id ? sub : item)));
  };
  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(item => item.id !== id));
  };

  // CRUD Users
  const addUser = (u: Omit<UserAccount, 'id'>) => {
    const newU: UserAccount = { ...u, id: `u_${Date.now()}` };
    setUsers(prev => [...prev, newU]);
  };
  const updateUser = (u: UserAccount) => {
    setUsers(prev => prev.map(item => (item.id === u.id ? u : item)));
  };
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(item => item.id !== id));
  };

  // Teaching Assignments
  const assignTeacher = (a: Omit<TeachingAssignment, 'id'>) => {
    const newA: TeachingAssignment = { ...a, id: `ta_${Date.now()}` };
    setAssignments(prev => [...prev, newA]);
  };
  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(item => item.id !== id));
  };

  // Grades Update
  const updateGradeRecord = (record: Partial<GradeRecord> & { studentId: string; subjectId: string; semesterId: string }) => {
    setGrades(prev => {
      const existingIndex = prev.findIndex(
        g => g.studentId === record.studentId && g.subjectId === record.subjectId && g.semesterId === record.semesterId
      );

      const todayStr = new Date().toLocaleDateString('vi-VN');

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updated: GradeRecord = {
          ...existing,
          ...record,
          lastUpdated: todayStr,
        };
        // Re-compute DTB
        updated.dtb = computeDTB(updated.tx1, updated.tx2, updated.tx3, updated.tx4, updated.gk, updated.ck);

        const newGrades = [...prev];
        newGrades[existingIndex] = updated;
        return newGrades;
      } else {
        const newRecord: GradeRecord = {
          id: `g_${Date.now()}`,
          studentId: record.studentId,
          subjectId: record.subjectId,
          semesterId: record.semesterId,
          tx1: record.tx1,
          tx2: record.tx2,
          tx3: record.tx3,
          tx4: record.tx4,
          gk: record.gk,
          ck: record.ck,
          teacherNote: record.teacherNote,
          lastUpdated: todayStr,
        };
        newRecord.dtb = computeDTB(newRecord.tx1, newRecord.tx2, newRecord.tx3, newRecord.tx4, newRecord.gk, newRecord.ck);
        return [...prev, newRecord];
      }
    });
  };

  // Remarks Update
  const updateStudentRemark = (rem: Omit<StudentRemark, 'id' | 'updatedAt'> & { id?: string }) => {
    const todayStr = new Date().toLocaleDateString('vi-VN');
    setRemarks(prev => {
      const existingIndex = prev.findIndex(
        r => r.studentId === rem.studentId && r.semesterId === rem.semesterId
      );
      if (existingIndex >= 0) {
        const newRemarks = [...prev];
        newRemarks[existingIndex] = {
          ...newRemarks[existingIndex],
          ...rem,
          updatedAt: todayStr,
        };
        return newRemarks;
      } else {
        const newRem: StudentRemark = {
          id: rem.id || `rem_${Date.now()}`,
          studentId: rem.studentId,
          semesterId: rem.semesterId,
          homeroomRemark: rem.homeroomRemark,
          strengths: rem.strengths,
          weaknesses: rem.weaknesses,
          conduct: rem.conduct,
          updatedAt: todayStr,
        };
        return [...prev, newRem];
      }
    });
  };

  // Helper getters
  const getStudentGrades = (studentId: string, semesterId = activeSemesterId): GradeRecord[] => {
    return grades.filter(g => g.studentId === studentId && g.semesterId === semesterId);
  };

  const getStudentGPA = (studentId: string, semesterId = activeSemesterId): number | undefined => {
    const studentGrades = getStudentGrades(studentId, semesterId);
    const validDtbs = studentGrades.map(g => g.dtb).filter((d): d is number => d !== undefined && !isNaN(d));
    if (validDtbs.length === 0) return undefined;
    const avg = validDtbs.reduce((a, b) => a + b, 0) / validDtbs.length;
    return Math.round(avg * 10) / 10;
  };

  const getAcademicClassification = (gpa?: number): 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' | 'Chưa xếp loại' => {
    if (gpa === undefined) return 'Chưa xếp loại';
    if (gpa >= 8.0) return 'Giỏi';
    if (gpa >= 6.5) return 'Khá';
    if (gpa >= 5.0) return 'Trung bình';
    return 'Yếu';
  };

  const getClassStatistics = (classId: string, semesterId = activeSemesterId) => {
    const classStudents = students.filter(s => s.classId === classId);
    const total = classStudents.length;
    if (total === 0) return { total: 0, gioit: 0, kha: 0, tb: 0, yeu: 0, gioitPct: 0, khaPct: 0, tbPct: 0, yeuPct: 0 };

    let gioit = 0, kha = 0, tb = 0, yeu = 0;

    classStudents.forEach(st => {
      const gpa = getStudentGPA(st.id, semesterId);
      const rank = getAcademicClassification(gpa);
      if (rank === 'Giỏi') gioit++;
      else if (rank === 'Khá') kha++;
      else if (rank === 'Trung bình') tb++;
      else if (rank === 'Yếu') yeu++;
    });

    return {
      total,
      gioit,
      kha,
      tb,
      yeu,
      gioitPct: Math.round((gioit / total) * 100),
      khaPct: Math.round((kha / total) * 100),
      tbPct: Math.round((tb / total) * 100),
      yeuPct: Math.round((yeu / total) * 100),
    };
  };

  const getGradeLevelStatistics = (gradeNum: number, semesterId = activeSemesterId) => {
    const gradeClasses = classes.filter(c => c.grade === gradeNum).map(c => c.id);
    const gradeStudents = students.filter(s => gradeClasses.includes(s.classId));
    const total = gradeStudents.length;
    if (total === 0) return { total: 0, gioit: 0, kha: 0, tb: 0, yeu: 0, gioitPct: 0, khaPct: 0, tbPct: 0, yeuPct: 0 };

    let gioit = 0, kha = 0, tb = 0, yeu = 0;

    gradeStudents.forEach(st => {
      const gpa = getStudentGPA(st.id, semesterId);
      const rank = getAcademicClassification(gpa);
      if (rank === 'Giỏi') gioit++;
      else if (rank === 'Khá') kha++;
      else if (rank === 'Trung bình') tb++;
      else if (rank === 'Yếu') yeu++;
    });

    return {
      total,
      gioit,
      kha,
      tb,
      yeu,
      gioitPct: Math.round((gioit / total) * 100),
      khaPct: Math.round((kha / total) * 100),
      tbPct: Math.round((tb / total) * 100),
      yeuPct: Math.round((yeu / total) * 100),
    };
  };

  return (
    <HocBaContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRoleQuickly,

        semesters,
        activeSemester,
        setActiveSemesterId,
        toggleSemesterLock,
        updateSemesterDeadline,

        classes,
        addClass,
        updateClass,
        deleteClass,

        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,

        students,
        addStudent,
        updateStudent,
        deleteStudent,

        subjects,
        addSubject,
        updateSubject,
        deleteSubject,

        users,
        addUser,
        updateUser,
        deleteUser,

        assignments,
        assignTeacher,
        deleteAssignment,

        grades,
        updateGradeRecord,

        remarks,
        updateStudentRemark,

        timetables,

        getStudentGrades,
        getStudentGPA,
        getAcademicClassification,
        getClassStatistics,
        getGradeLevelStatistics,
      }}
    >
      {children}
    </HocBaContext.Provider>
  );
};

export const useHocBa = () => {
  const context = useContext(HocBaContext);
  if (!context) {
    throw new Error('useHocBa must be used within a HocBaProvider');
  }
  return context;
};
