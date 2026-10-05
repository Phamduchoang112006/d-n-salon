import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useHocBa } from '../HocBaContext';
import { GradeRecord, Student } from '../hocBaTypes';

export const TeacherScreens: React.FC = () => {
  const {
    currentUser,
    teachers,
    classes,
    students,
    subjects,
    activeSemester,
    assignments,
    grades,
    remarks,
    updateGradeRecord,
    updateStudentRemark,
    getStudentGrades,
  } = useHocBa();

  // Identify teacher info
  const currentTeacher = teachers.find(t => t.id === currentUser?.teacherId) || teachers[0];

  // Find assignments for this teacher
  const teacherAssignments = assignments.filter(
    a => a.teacherId === currentTeacher?.id && a.semesterId === activeSemester.id
  );

  // Default to first assigned class/subject or fallback
  const [selectedClassId, setSelectedClassId] = useState<string>(
    teacherAssignments[0]?.classId || classes[0]?.id || ''
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    teacherAssignments[0]?.subjectId || currentTeacher?.mainSubjectId || subjects[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'grades' | 'remarks'>('grades');

  // Draft Grade States for editing
  const [editingGradeMap, setEditingGradeMap] = useState<{
    [studentId: string]: {
      tx1?: string;
      tx2?: string;
      tx3?: string;
      tx4?: string;
      gk?: string;
      ck?: string;
      teacherNote?: string;
    };
  }>({});

  // Draft Remark States for editing
  const [editingRemarkMap, setEditingRemarkMap] = useState<{
    [studentId: string]: {
      homeroomRemark: string;
      strengths: string;
      weaknesses: string;
      conduct: 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';
    };
  }>({});

  const isLocked = activeSemester.isLocked;

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const classStudents = students.filter(s => s.classId === currentClass?.id);

  // Initialize draft input values for a student
  const getDraftGrade = (st: Student) => {
    if (editingGradeMap[st.id]) return editingGradeMap[st.id];

    const existingGrade = grades.find(
      g => g.studentId === st.id && g.subjectId === selectedSubjectId && g.semesterId === activeSemester.id
    );

    return {
      tx1: existingGrade?.tx1 !== undefined ? String(existingGrade.tx1) : '',
      tx2: existingGrade?.tx2 !== undefined ? String(existingGrade.tx2) : '',
      tx3: existingGrade?.tx3 !== undefined ? String(existingGrade.tx3) : '',
      tx4: existingGrade?.tx4 !== undefined ? String(existingGrade.tx4) : '',
      gk: existingGrade?.gk !== undefined ? String(existingGrade.gk) : '',
      ck: existingGrade?.ck !== undefined ? String(existingGrade.ck) : '',
      teacherNote: existingGrade?.teacherNote || '',
    };
  };

  const handleGradeInputChange = (studentId: string, field: string, value: string) => {
    const currentDraft = getDraftGrade({ id: studentId } as Student);
    setEditingGradeMap(prev => ({
      ...prev,
      [studentId]: {
        ...currentDraft,
        [field]: value,
      },
    }));
  };

  const handleSaveGrade = (st: Student) => {
    if (isLocked) {
      Alert.alert('Cảnh báo', 'Thời hạn nhập điểm cho học kỳ này đã bị khóa!');
      return;
    }

    const draft = getDraftGrade(st);
    const parseNum = (val?: string) => {
      if (!val || val.trim() === '') return undefined;
      const n = parseFloat(val);
      return isNaN(n) ? undefined : n;
    };

    updateGradeRecord({
      studentId: st.id,
      subjectId: selectedSubjectId,
      semesterId: activeSemester.id,
      tx1: parseNum(draft.tx1),
      tx2: parseNum(draft.tx2),
      tx3: parseNum(draft.tx3),
      tx4: parseNum(draft.tx4),
      gk: parseNum(draft.gk),
      ck: parseNum(draft.ck),
      teacherNote: draft.teacherNote,
    });

    Alert.alert('Thành công', `Đã lưu điểm cho học sinh ${st.name}`);
  };

  // Remark Handlers
  const getDraftRemark = (st: Student) => {
    if (editingRemarkMap[st.id]) return editingRemarkMap[st.id];

    const existingRem = remarks.find(r => r.studentId === st.id && r.semesterId === activeSemester.id);
    return {
      homeroomRemark: existingRem?.homeroomRemark || '',
      strengths: existingRem?.strengths || '',
      weaknesses: existingRem?.weaknesses || '',
      conduct: existingRem?.conduct || st.conduct || 'Tốt',
    };
  };

  const handleRemarkInputChange = (studentId: string, field: string, value: any) => {
    const currentDraft = getDraftRemark({ id: studentId } as Student);
    setEditingRemarkMap(prev => ({
      ...prev,
      [studentId]: {
        ...currentDraft,
        [field]: value,
      },
    }));
  };

  const handleSaveRemark = (st: Student) => {
    const draft = getDraftRemark(st);
    updateStudentRemark({
      studentId: st.id,
      semesterId: activeSemester.id,
      homeroomRemark: draft.homeroomRemark,
      strengths: draft.strengths,
      weaknesses: draft.weaknesses,
      conduct: draft.conduct,
    });

    Alert.alert('Thành công', `Đã lưu nhận xét cho học sinh ${st.name}`);
  };

  return (
    <View style={styles.container}>
      {/* Teacher Profile Banner */}
      <View style={styles.profileBanner}>
        <View style={styles.teacherAvatar}>
          <Text style={{ fontSize: 26 }}>👩‍🏫</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.teacherNameText}>{currentTeacher?.name}</Text>
          <Text style={styles.teacherSubText}>Mã GV: {currentTeacher?.code} | Chuyên môn: {subjects.find(s => s.id === currentTeacher?.mainSubjectId)?.name}</Text>
          <Text style={styles.teacherSubText}>Học kỳ: <Text style={{ fontWeight: '700', color: '#0284c7' }}>{activeSemester.name} ({activeSemester.academicYear})</Text></Text>
        </View>
      </View>

      {/* Lock Notification Banner */}
      {isLocked && (
        <View style={styles.lockBanner}>
          <Text style={styles.lockBannerText}>🔒 HẠN NHẬP ĐIỂM ĐÃ BỊ KHÓA BỞI BAN GIÁM HIỆU. Bạn chỉ có thể xem điểm.</Text>
        </View>
      )}

      {/* Mode Switch Tabs */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'grades' && styles.tabBtnActive]}
          onPress={() => setActiveTab('grades')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'grades' && styles.tabBtnTextActive]}>📝 Nhập & Sửa Điểm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'remarks' && styles.tabBtnActive]}
          onPress={() => setActiveTab('remarks')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'remarks' && styles.tabBtnTextActive]}>💬 Ghi Nhận Xét Học Sinh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Class & Subject Selector */}
        <View style={styles.selectorCard}>
          <Text style={styles.selectorLabel}>Chọn Lớp học:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
            {classes.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, selectedClassId === c.id && styles.chipActive]}
                onPress={() => setSelectedClassId(c.id)}
              >
                <Text style={[styles.chipText, selectedClassId === c.id && styles.chipTextActive]}>Lớp {c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {activeTab === 'grades' && (
            <>
              <Text style={[styles.selectorLabel, { marginTop: 8 }]}>Chọn Môn giảng dạy:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
                {subjects.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.chip, selectedSubjectId === s.id && styles.chipActive]}
                    onPress={() => setSelectedSubjectId(s.id)}
                  >
                    <Text style={[styles.chipText, selectedSubjectId === s.id && styles.chipTextActive]}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {activeTab === 'grades' ? (
          <View>
            <Text style={styles.sectionHeaderTitle}>
              Danh Sách Học Sinh Lớp {currentClass?.name} - Môn {currentSubject?.name}
            </Text>
            <Text style={styles.sectionHeaderSubtitle}>
              Công thức: ĐTB = (TX_trung_bình + GK * 2 + CK * 3) / 6
            </Text>

            {classStudents.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Chưa có học sinh trong lớp này.</Text>
              </View>
            ) : (
              classStudents.map(st => {
                const draft = getDraftGrade(st);
                const existingGrade = grades.find(
                  g => g.studentId === st.id && g.subjectId === selectedSubjectId && g.semesterId === activeSemester.id
                );

                return (
                  <View key={st.id} style={styles.gradeEntryCard}>
                    <View style={styles.gradeCardHeader}>
                      <View>
                        <Text style={styles.stName}>{st.name}</Text>
                        <Text style={styles.stCode}>Mã HS: {st.code}</Text>
                      </View>

                      <View style={styles.dtbBox}>
                        <Text style={styles.dtbTitle}>ĐTB môn</Text>
                        <Text style={styles.dtbVal}>
                          {existingGrade?.dtb !== undefined ? existingGrade.dtb.toFixed(1) : 'N/A'}
                        </Text>
                      </View>
                    </View>

                    {/* Scores Inputs Grid */}
                    <Text style={styles.inputGridTitle}>Điểm Thường Xuyên (TX1, TX2, TX3, TX4):</Text>
                    <View style={styles.inputsRow}>
                      <View style={styles.scoreInputWrapper}>
                        <Text style={styles.scoreInputLabel}>TX 1</Text>
                        <TextInput
                          style={styles.scoreInput}
                          keyboardType="numeric"
                          value={draft.tx1}
                          onChangeText={txt => handleGradeInputChange(st.id, 'tx1', txt)}
                          editable={!isLocked}
                          placeholder="0-10"
                        />
                      </View>

                      <View style={styles.scoreInputWrapper}>
                        <Text style={styles.scoreInputLabel}>TX 2</Text>
                        <TextInput
                          style={styles.scoreInput}
                          keyboardType="numeric"
                          value={draft.tx2}
                          onChangeText={txt => handleGradeInputChange(st.id, 'tx2', txt)}
                          editable={!isLocked}
                          placeholder="0-10"
                        />
                      </View>

                      <View style={styles.scoreInputWrapper}>
                        <Text style={styles.scoreInputLabel}>TX 3</Text>
                        <TextInput
                          style={styles.scoreInput}
                          keyboardType="numeric"
                          value={draft.tx3}
                          onChangeText={txt => handleGradeInputChange(st.id, 'tx3', txt)}
                          editable={!isLocked}
                          placeholder="0-10"
                        />
                      </View>

                      <View style={styles.scoreInputWrapper}>
                        <Text style={styles.scoreInputLabel}>TX 4</Text>
                        <TextInput
                          style={styles.scoreInput}
                          keyboardType="numeric"
                          value={draft.tx4}
                          onChangeText={txt => handleGradeInputChange(st.id, 'tx4', txt)}
                          editable={!isLocked}
                          placeholder="0-10"
                        />
                      </View>
                    </View>

                    <Text style={styles.inputGridTitle}>Điểm Định Kỳ (Giữa kỳ & Cuối kỳ):</Text>
                    <View style={styles.inputsRow}>
                      <View style={styles.scoreInputWrapperBig}>
                        <Text style={styles.scoreInputLabel}>Giữa Kỳ (GK)</Text>
                        <TextInput
                          style={[styles.scoreInput, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}
                          keyboardType="numeric"
                          value={draft.gk}
                          onChangeText={txt => handleGradeInputChange(st.id, 'gk', txt)}
                          editable={!isLocked}
                          placeholder="0-10"
                        />
                      </View>

                      <View style={styles.scoreInputWrapperBig}>
                        <Text style={styles.scoreInputLabel}>Cuối Kỳ (CK)</Text>
                        <TextInput
                          style={[styles.scoreInput, { backgroundColor: '#dbeafe', borderColor: '#3b82f6' }]}
                          keyboardType="numeric"
                          value={draft.ck}
                          onChangeText={txt => handleGradeInputChange(st.id, 'ck', txt)}
                          editable={!isLocked}
                          placeholder="0-10"
                        />
                      </View>
                    </View>

                    <Text style={styles.inputGridTitle}>Ghi chú môn học:</Text>
                    <TextInput
                      style={styles.noteInput}
                      value={draft.teacherNote}
                      onChangeText={txt => handleGradeInputChange(st.id, 'teacherNote', txt)}
                      editable={!isLocked}
                      placeholder="Nhập ghi chú cho môn học này..."
                      placeholderTextColor="#94a3b8"
                    />

                    {!isLocked && (
                      <TouchableOpacity style={styles.saveGradeBtn} onPress={() => handleSaveGrade(st)} activeOpacity={0.8}>
                        <Text style={styles.saveGradeBtnText}>💾 Lưu Điểm Học Sinh</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
          </View>
        ) : (
          /* Remarks Tab */
          <View>
            <Text style={styles.sectionHeaderTitle}>💬 Ghi Nhận Xét Cho Học Sinh Lớp {currentClass?.name}</Text>
            <Text style={styles.sectionHeaderSubtitle}>Đánh giá thái độ, ưu/nhược điểm và phẩm chất học sinh</Text>

            {classStudents.map(st => {
              const draft = getDraftRemark(st);
              return (
                <View key={st.id} style={styles.gradeEntryCard}>
                  <Text style={styles.stName}>{st.name} <Text style={styles.stCode}>({st.code})</Text></Text>

                  <Text style={styles.inputGridTitle}>Nhận xét của Giáo viên Chủ Nhiệm:</Text>
                  <TextInput
                    style={[styles.noteInput, { height: 70 }]}
                    multiline
                    value={draft.homeroomRemark}
                    onChangeText={txt => handleRemarkInputChange(st.id, 'homeroomRemark', txt)}
                    placeholder="Ghi nhận xét chung về tình hình học tập và rèn luyện..."
                    placeholderTextColor="#94a3b8"
                  />

                  <Text style={styles.inputGridTitle}>Ưu điểm nổi bật:</Text>
                  <TextInput
                    style={styles.noteInput}
                    value={draft.strengths}
                    onChangeText={txt => handleRemarkInputChange(st.id, 'strengths', txt)}
                    placeholder="Ưu điểm về năng lực, phẩm chất..."
                    placeholderTextColor="#94a3b8"
                  />

                  <Text style={styles.inputGridTitle}>Hạn chế cần khắc phục:</Text>
                  <TextInput
                    style={styles.noteInput}
                    value={draft.weaknesses}
                    onChangeText={txt => handleRemarkInputChange(st.id, 'weaknesses', txt)}
                    placeholder="Hạn chế cần hoàn thiện..."
                    placeholderTextColor="#94a3b8"
                  />

                  <Text style={styles.inputGridTitle}>Đánh giá Hạnh kiểm:</Text>
                  <View style={styles.conductSelectorRow}>
                    {(['Tốt', 'Khá', 'Trung bình', 'Yếu'] as const).map(c => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.conductChip, draft.conduct === c && styles.conductChipActive]}
                        onPress={() => handleRemarkInputChange(st.id, 'conduct', c)}
                      >
                        <Text style={[styles.conductChipText, draft.conduct === c && styles.conductChipTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.saveGradeBtn} onPress={() => handleSaveRemark(st)} activeOpacity={0.8}>
                    <Text style={styles.saveGradeBtnText}>💾 Lưu Nhận Xét Học Sinh</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  teacherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teacherNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  teacherSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  lockBanner: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fca5a5',
  },
  lockBannerText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
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
    borderBottomColor: '#047857',
    backgroundColor: '#f0fdf4',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  selectorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  chipScrollView: {
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: '#047857',
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
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  emptyBox: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  gradeEntryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  gradeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
    marginBottom: 10,
  },
  stName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  stCode: {
    fontSize: 12,
    color: '#0284c7',
    fontWeight: '600',
  },
  dtbBox: {
    alignItems: 'flex-end',
  },
  dtbTitle: {
    fontSize: 10,
    color: '#64748b',
  },
  dtbVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#047857',
  },
  inputGridTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
    marginBottom: 6,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  scoreInputWrapper: {
    width: '22%',
    alignItems: 'center',
  },
  scoreInputWrapperBig: {
    width: '48%',
    alignItems: 'center',
  },
  scoreInputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  scoreInput: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    textAlign: 'center',
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  noteInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0f172a',
    marginBottom: 8,
  },
  saveGradeBtn: {
    backgroundColor: '#047857',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  saveGradeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  conductSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  conductChip: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 2,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  conductChipActive: {
    backgroundColor: '#047857',
  },
  conductChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  conductChipTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
