export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string;
  studentId?: string;
  phone?: string;
  email?: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "6A1", "7A1", "8A1", "9A1"
  grade: number; // 6, 7, 8, 9
  homeroomTeacherId: string;
  room: string;
  academicYear: string; // e.g. "2024-2025"
  studentCount?: number;
}

export interface Teacher {
  id: string;
  code: string; // e.g. "GV01"
  name: string;
  phone: string;
  email: string;
  mainSubjectId: string;
  gender: 'Nam' | 'Nữ';
  title?: string; // e.g. "Thạc sĩ Toán học", "Cử nhân Sư phạm"
}

export interface Student {
  id: string;
  code: string; // e.g. "HS6001"
  name: string;
  classId: string;
  dob: string; // e.g. "15/05/2012"
  gender: 'Nam' | 'Nữ';
  parentName: string;
  parentPhone: string;
  address: string;
  conduct: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
}

export interface Subject {
  id: string;
  code: string; // e.g. "TOAN", "VAN"
  name: string;
  lessonsPerWeek: number;
}

export interface Semester {
  id: string;
  name: string; // e.g. "Học kỳ I", "Học kỳ II"
  academicYear: string; // "2024-2025"
  isCurrent: boolean;
  entryDeadline: string; // e.g. "30/12/2024"
  isLocked: boolean;
}

export interface TeachingAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  semesterId: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  semesterId: string;
  tx1?: number; // Thường xuyên 1
  tx2?: number; // Thường xuyên 2
  tx3?: number; // Thường xuyên 3
  tx4?: number; // Thường xuyên 4
  gk?: number;  // Giữa kỳ
  ck?: number;  // Cuối kỳ
  dtb?: number; // Điểm trung bình môn
  teacherNote?: string;
  lastUpdated?: string;
}

export interface StudentRemark {
  id: string;
  studentId: string;
  semesterId: string;
  homeroomRemark: string; // Nhận xét của giáo viên chủ nhiệm
  strengths?: string; // Ưu điểm
  weaknesses?: string; // Hạn chế
  conduct: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
  updatedAt: string;
}

export interface TimetableSlot {
  id: string;
  classId: string;
  dayOfWeek: 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7';
  period: number; // Tiết 1, 2, 3, 4, 5
  session: 'Sáng' | 'Chiều';
  subjectId: string;
  teacherId: string;
  room: string;
}
