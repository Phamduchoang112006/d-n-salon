import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useHocBa } from '../HocBaContext';
import { Student } from '../hocBaTypes';

export const StudentParentScreens: React.FC = () => {
  const {
    currentUser,
    students,
    classes,
    teachers,
    subjects,
    activeSemester,
    semesters,
    setActiveSemesterId,
    timetables,
    grades,
    remarks,
    getStudentGrades,
    getStudentGPA,
    getAcademicClassification,
  } = useHocBa();

  // Find target student
  const currentStudent: Student =
    students.find(s => s.id === currentUser?.studentId) || students[0];

  const currentClass = classes.find(c => c.id === currentStudent.classId) || classes[0];
  const homeroomTeacher = teachers.find(t => t.id === currentClass?.homeroomTeacherId);

  const [activeTab, setActiveTab] = useState<'hocba' | 'timetable'>('hocba');
  const [selectedDay, setSelectedDay] = useState<'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7'>('Thứ 2');

  const studentGrades = getStudentGrades(currentStudent.id, activeSemester.id);
  const gpa = getStudentGPA(currentStudent.id, activeSemester.id);
  const rank = getAcademicClassification(gpa);
  const studentRemark = remarks.find(r => r.studentId === currentStudent.id && r.semesterId === activeSemester.id);

  // Timetable for current student's class
  const classTimetable = timetables.filter(
    t => t.classId === currentStudent.classId && t.dayOfWeek === selectedDay
  ).sort((a, b) => a.period - b.period);

  const daysList: ('Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7')[] = [
    'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
  ];

  return (
    <View style={styles.container}>
      {/* Student Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <Text style={{ fontSize: 32 }}>🎓</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentNameText}>{currentStudent.name}</Text>
          <Text style={styles.studentSubText}>Mã HS: <Text style={{ fontWeight: '700', color: '#0284c7' }}>{currentStudent.code}</Text> | Lớp: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{currentClass.name}</Text></Text>
          <Text style={styles.studentSubText}>GVCN: {homeroomTeacher?.name || 'Cô Phạm Thị Mai'}</Text>
          <Text style={styles.studentSubText}>Phụ huynh: {currentStudent.parentName} ({currentStudent.parentPhone})</Text>
        </View>
      </View>

      {/* Main Tabs Header */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'hocba' && styles.tabBtnActive]}
          onPress={() => setActiveTab('hocba')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'hocba' && styles.tabBtnTextActive]}>📜 Sổ Học Bạ Điện Tử</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'timetable' && styles.tabBtnActive]}
          onPress={() => setActiveTab('timetable')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'timetable' && styles.tabBtnTextActive]}>📅 Thời Khóa Biểu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'hocba' ? (
          <View>
            {/* Semester Selector Chips */}
            <View style={styles.chipRow}>
              <Text style={styles.chipLabel}>Chọn học kỳ:</Text>
              {semesters.map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.chip, activeSemester.id === s.id && styles.chipActive]}
                  onPress={() => setActiveSemesterId(s.id)}
                >
                  <Text style={[styles.chipText, activeSemester.id === s.id && styles.chipTextActive]}>{s.name} ({s.academicYear})</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* GPA & Rank Overview Box */}
            <View style={styles.overviewBox}>
              <View style={styles.overviewHeader}>
                <Text style={styles.overviewTitle}>🏆 TỔNG HỢP HỌC LỰC & HẠNH KIỂM</Text>
                <Text style={styles.overviewSemester}>{activeSemester.name} - {activeSemester.academicYear}</Text>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>ĐTB TẤT CẢ MÔN</Text>
                  <Text style={styles.metricValue}>{gpa !== undefined ? gpa.toFixed(1) : 'N/A'}</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>XẾP LOẠI HỌC LỰC</Text>
                  <View style={[
                    styles.rankBadge,
                    rank === 'Giỏi' ? { backgroundColor: '#dcfce7' } :
                    rank === 'Khá' ? { backgroundColor: '#dbeafe' } :
                    rank === 'Trung bình' ? { backgroundColor: '#fef3c7' } : { backgroundColor: '#fee2e2' }
                  ]}>
                    <Text style={[
                      styles.rankBadgeText,
                      rank === 'Giỏi' ? { color: '#15803d' } :
                      rank === 'Khá' ? { color: '#1d4ed8' } :
                      rank === 'Trung bình' ? { color: '#b45309' } : { color: '#b91c1c' }
                    ]}>{rank}</Text>
                  </View>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>HẠNH KIỂM</Text>
                  <View style={[styles.rankBadge, { backgroundColor: '#e0e7ff' }]}>
                    <Text style={[styles.rankBadgeText, { color: '#4338ca' }]}>
                      {studentRemark?.conduct || currentStudent.conduct || 'Tốt'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Detailed Grade Records Table */}
            <Text style={styles.sectionTitle}>📚 Bảng Điểm Các Môn Học Chi Tiết</Text>
            <View style={styles.gradeCardContainer}>
              {subjects.map(sub => {
                const gr = studentGrades.find(g => g.subjectId === sub.id);
                const teacherObj = teachers.find(t => t.mainSubjectId === sub.id);

                return (
                  <View key={sub.id} style={styles.gradeSubjectCard}>
                    <View style={styles.gradeSubjectHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subjectTitleText}>{sub.name} <Text style={{ fontSize: 11, color: '#64748b' }}>({sub.code})</Text></Text>
                        <Text style={styles.teacherNameText}>GV: {teacherObj?.name || 'Giáo viên bộ môn'}</Text>
                      </View>

                      <View style={styles.subjectDtbBadge}>
                        <Text style={styles.subjectDtbLabel}>ĐTB Môn</Text>
                        <Text style={styles.subjectDtbVal}>{gr?.dtb !== undefined ? gr.dtb.toFixed(1) : '-'}</Text>
                      </View>
                    </View>

                    {/* Breakdown Scores */}
                    <View style={styles.scoresGrid}>
                      <View style={styles.scorePill}>
                        <Text style={styles.scorePillLabel}>TX 1</Text>
                        <Text style={styles.scorePillVal}>{gr?.tx1 ?? '-'}</Text>
                      </View>

                      <View style={styles.scorePill}>
                        <Text style={styles.scorePillLabel}>TX 2</Text>
                        <Text style={styles.scorePillVal}>{gr?.tx2 ?? '-'}</Text>
                      </View>

                      <View style={styles.scorePill}>
                        <Text style={styles.scorePillLabel}>TX 3</Text>
                        <Text style={styles.scorePillVal}>{gr?.tx3 ?? '-'}</Text>
                      </View>

                      <View style={styles.scorePill}>
                        <Text style={styles.scorePillLabel}>TX 4</Text>
                        <Text style={styles.scorePillVal}>{gr?.tx4 ?? '-'}</Text>
                      </View>

                      <View style={[styles.scorePill, { backgroundColor: '#fef3c7' }]}>
                        <Text style={[styles.scorePillLabel, { color: '#b45309' }]}>Giữa kỳ</Text>
                        <Text style={[styles.scorePillVal, { color: '#b45309' }]}>{gr?.gk ?? '-'}</Text>
                      </View>

                      <View style={[styles.scorePill, { backgroundColor: '#dbeafe' }]}>
                        <Text style={[styles.scorePillLabel, { color: '#1d4ed8' }]}>Cuối kỳ</Text>
                        <Text style={[styles.scorePillVal, { color: '#1d4ed8' }]}>{gr?.ck ?? '-'}</Text>
                      </View>
                    </View>

                    {gr?.teacherNote ? (
                      <View style={styles.teacherNoteBox}>
                        <Text style={styles.teacherNoteText}>💬 Nhận xét: "{gr.teacherNote}"</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>

            {/* Homeroom Remark Section */}
            <Text style={styles.sectionTitle}>💬 Nhận Xét Của Giáo Viên Chủ Nhiệm</Text>
            <View style={styles.remarkCard}>
              {studentRemark ? (
                <View>
                  <Text style={styles.remarkQuote}>"{studentRemark.homeroomRemark}"</Text>

                  {studentRemark.strengths ? (
                    <View style={styles.remarkItemRow}>
                      <Text style={styles.remarkItemLabel}>🌟 Ưu điểm nổi bật:</Text>
                      <Text style={styles.remarkItemText}>{studentRemark.strengths}</Text>
                    </View>
                  ) : null}

                  {studentRemark.weaknesses ? (
                    <View style={styles.remarkItemRow}>
                      <Text style={styles.remarkItemLabel}>🌱 Hạn chế cần cố gắng:</Text>
                      <Text style={styles.remarkItemText}>{studentRemark.weaknesses}</Text>
                    </View>
                  ) : null}

                  <View style={styles.remarkFooter}>
                    <Text style={styles.remarkFooterText}>Cập nhật ngày: {studentRemark.updatedAt}</Text>
                    <Text style={styles.signatureText}>GVCN: {homeroomTeacher?.name}</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>Chưa có nhận xét của GVCN cho học kỳ này.</Text>
              )}
            </View>
          </View>
        ) : (
          /* Timetable Tab */
          <View>
            <Text style={styles.sectionTitle}>📅 Thời Khóa Biểu Học Tập - Lớp {currentClass.name}</Text>

            {/* Day Selector Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {daysList.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[styles.chip, selectedDay === day && styles.chipActive]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.chipText, selectedDay === day && styles.chipTextActive]}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {classTimetable.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Không có tiết học nào vào {selectedDay}.</Text>
              </View>
            ) : (
              classTimetable.map(slot => {
                const sub = subjects.find(s => s.id === slot.subjectId);
                const teacherObj = teachers.find(t => t.id === slot.teacherId);

                return (
                  <View key={slot.id} style={styles.timetableCard}>
                    <View style={styles.periodBadge}>
                      <Text style={styles.periodNumText}>Tiết {slot.period}</Text>
                      <Text style={styles.sessionText}>{slot.session}</Text>
                    </View>

                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <Text style={styles.timetableSubjectName}>{sub?.name}</Text>
                      <Text style={styles.timetableSubDetails}>
                        Môn: <Text style={{ fontWeight: '700', color: '#0284c7' }}>{sub?.code}</Text> | Phòng: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{slot.room}</Text>
                      </Text>
                      <Text style={styles.timetableTeacherText}>👨‍🏫 GV: {teacherObj?.name}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  studentSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#0284c7',
    backgroundColor: '#f0f9ff',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginRight: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#0284c7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  overviewBox: {
    backgroundColor: '#0369a1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#0369a1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  overviewHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 8,
  },
  overviewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  overviewSemester: {
    fontSize: 12,
    color: '#e0f2fe',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#bae6fd',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rankBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  gradeCardContainer: {
    marginBottom: 14,
  },
  gradeSubjectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  gradeSubjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
    marginBottom: 8,
  },
  subjectTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  teacherNameText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  subjectDtbBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  subjectDtbLabel: {
    fontSize: 9,
    color: '#0369a1',
    fontWeight: '700',
  },
  subjectDtbVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0284c7',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scorePill: {
    width: '15%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 4,
  },
  scorePillLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
  },
  scorePillVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  teacherNoteBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0284c7',
  },
  teacherNoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#334155',
  },
  remarkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  remarkQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1e293b',
    lineHeight: 20,
    marginBottom: 10,
  },
  remarkItemRow: {
    marginTop: 6,
  },
  remarkItemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369a1',
  },
  remarkItemText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  remarkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  remarkFooterText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  signatureText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  timetableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  periodBadge: {
    width: 60,
    height: 50,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNumText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  sessionText: {
    color: '#e0f2fe',
    fontSize: 10,
    fontWeight: '600',
  },
  timetableSubjectName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  timetableSubDetails: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  timetableTeacherText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginTop: 2,
  },
  emptyBox: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
