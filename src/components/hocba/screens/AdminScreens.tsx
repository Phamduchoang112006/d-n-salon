import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useHocBa } from '../HocBaContext';
import { SchoolClass, Teacher, Student, Subject, UserAccount } from '../hocBaTypes';

type AdminTab = 'results' | 'assignments' | 'stats' | 'system';

export const AdminScreens: React.FC = () => {
  const {
    classes,
    teachers,
    students,
    subjects,
    users,
    semesters,
    activeSemester,
    setActiveSemesterId,
    assignments,
    assignTeacher,
    deleteAssignment,
    getStudentGrades,
    getStudentGPA,
    getAcademicClassification,
    getClassStatistics,
    getGradeLevelStatistics,
    toggleSemesterLock,
    updateSemesterDeadline,
    addClass,
    deleteClass,
    addTeacher,
    deleteTeacher,
    addStudent,
    deleteStudent,
    addSubject,
    deleteSubject,
    addUser,
    deleteUser,
  } = useHocBa();

  const [activeTab, setActiveTab] = useState<AdminTab>('results');

  // Filter States
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statsViewMode, setStatsViewMode] = useState<'class' | 'grade'>('class');

  // Form Modal States for System Management
  const [modalType, setModalType] = useState<'class' | 'teacher' | 'student' | 'subject' | 'user' | 'assignment' | null>(null);

  // New Entity Form Data
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('6');
  const [newClassTeacherId, setNewClassTeacherId] = useState(teachers[0]?.id || '');

  const [newTeacherCode, setNewTeacherCode] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherSubId, setNewTeacherSubId] = useState(subjects[0]?.id || '');

  const [newStudentCode, setNewStudentCode] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClassId, setNewStudentClassId] = useState(classes[0]?.id || '');

  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');

  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'teacher' | 'student'>('teacher');

  const [assignTeacherId, setAssignTeacherId] = useState(teachers[0]?.id || '');
  const [assignSubjectId, setAssignSubjectId] = useState(subjects[0]?.id || '');
  const [assignClassId, setAssignClassId] = useState(classes[0]?.id || '');

  // Add Handlers
  const handleAddClass = () => {
    if (!newClassName) return;
    addClass({
      name: newClassName,
      grade: parseInt(newClassGrade) || 6,
      homeroomTeacherId: newClassTeacherId,
      room: 'P.101',
      academicYear: '2024-2025',
    });
    setNewClassName('');
    setModalType(null);
  };

  const handleAddTeacher = () => {
    if (!newTeacherName || !newTeacherCode) return;
    addTeacher({
      code: newTeacherCode,
      name: newTeacherName,
      phone: newTeacherPhone || '0900000000',
      email: `${newTeacherCode.toLowerCase()}@thcsminhkhai.edu.vn`,
      mainSubjectId: newTeacherSubId,
      gender: 'Nam',
      title: 'Giáo viên',
    });
    setNewTeacherCode('');
    setNewTeacherName('');
    setModalType(null);
  };

  const handleAddStudent = () => {
    if (!newStudentName || !newStudentCode) return;
    addStudent({
      code: newStudentCode,
      name: newStudentName,
      classId: newStudentClassId,
      dob: '01/01/2013',
      gender: 'Nam',
      parentName: 'Phụ huynh ' + newStudentName,
      parentPhone: '0912345678',
      address: 'Phường Minh Khai',
      conduct: 'Tốt',
    });
    setNewStudentCode('');
    setNewStudentName('');
    setModalType(null);
  };

  const handleAddSubject = () => {
    if (!newSubjectName || !newSubjectCode) return;
    addSubject({
      code: newSubjectCode,
      name: newSubjectName,
      lessonsPerWeek: 2,
    });
    setNewSubjectCode('');
    setNewSubjectName('');
    setModalType(null);
  };

  const handleAddUser = () => {
    if (!newUserUsername || !newUserName) return;
    addUser({
      username: newUserUsername,
      password: newUserPassword,
      name: newUserName,
      role: newUserRole,
    });
    setNewUserUsername('');
    setNewUserName('');
    setModalType(null);
  };

  const handleAssignTeacher = () => {
    if (!assignTeacherId || !assignSubjectId || !assignClassId) return;
    assignTeacher({
      teacherId: assignTeacherId,
      subjectId: assignSubjectId,
      classId: assignClassId,
      semesterId: activeSemester.id,
    });
    setModalType(null);
  };

  // Render SubTab Content
  const renderResultsTab = () => {
    const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
    const filteredStudents = students
      .filter(s => s.classId === (selectedClass?.id || selectedClassId))
      .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <View style={styles.subTabContainer}>
        {/* Class Filter Bar */}
        <Text style={styles.sectionHeaderTitle}>🔍 Kết Quả Học Tập Học Sinh</Text>
        <Text style={styles.sectionHeaderSubtitle}>Học kỳ: {activeSemester.name} ({activeSemester.academicYear})</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScrollView}>
          {classes.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, selectedClassId === c.id && styles.chipActive]}
              onPress={() => setSelectedClassId(c.id)}
            >
              <Text style={[styles.chipText, selectedClassId === c.id && styles.chipTextActive]}>
                Lớp {c.name} ({c.grade} khối)
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          style={styles.searchInput}
          placeholder="🔎 Tìm học sinh theo tên hoặc mã HS..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Student Table/Cards */}
        {filteredStudents.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có học sinh nào trong lớp này.</Text>
          </View>
        ) : (
          filteredStudents.map(st => {
            const gpa = getStudentGPA(st.id, activeSemester.id);
            const classification = getAcademicClassification(gpa);
            const stGrades = getStudentGrades(st.id, activeSemester.id);

            return (
              <View key={st.id} style={styles.studentCard}>
                <View style={styles.studentCardHeader}>
                  <View>
                    <Text style={styles.studentNameText}>{st.name} <Text style={styles.studentCodeText}>({st.code})</Text></Text>
                    <Text style={styles.studentSubInfo}>Lớp: {selectedClass?.name} | Hạnh kiểm: <Text style={{fontWeight: '700', color: '#047857'}}>{st.conduct}</Text></Text>
                  </View>

                  <View style={styles.gpaBadge}>
                    <Text style={styles.gpaLabel}>ĐTB Chung</Text>
                    <Text style={styles.gpaVal}>{gpa !== undefined ? gpa.toFixed(1) : 'N/A'}</Text>
                    <View style={[
                      styles.rankTag,
                      classification === 'Giỏi' ? { backgroundColor: '#dcfce7' } :
                      classification === 'Khá' ? { backgroundColor: '#dbeafe' } :
                      classification === 'Trung bình' ? { backgroundColor: '#fef3c7' } : { backgroundColor: '#fee2e2' }
                    ]}>
                      <Text style={[
                        styles.rankTagText,
                        classification === 'Giỏi' ? { color: '#15803d' } :
                        classification === 'Khá' ? { color: '#1d4ed8' } :
                        classification === 'Trung bình' ? { color: '#b45309' } : { color: '#b91c1c' }
                      ]}>{classification}</Text>
                    </View>
                  </View>
                </View>

                {/* Grade breakdown for student */}
                <View style={styles.gradeGrid}>
                  <Text style={styles.gradeGridTitle}>Điểm các môn học:</Text>
                  {subjects.map(sub => {
                    const gr = stGrades.find(g => g.subjectId === sub.id);
                    return (
                      <View key={sub.id} style={styles.gradeRow}>
                        <Text style={styles.subjectNameText}>{sub.name}:</Text>
                        <View style={styles.scoresInline}>
                          <Text style={styles.scoreDetailText}>TX: {[gr?.tx1, gr?.tx2, gr?.tx3, gr?.tx4].filter(x => x !== undefined).join(', ') || '-'}</Text>
                          <Text style={styles.scoreDetailText}>GK: {gr?.gk ?? '-'}</Text>
                          <Text style={styles.scoreDetailText}>CK: {gr?.ck ?? '-'}</Text>
                          <Text style={styles.dtbScoreText}>ĐTB: {gr?.dtb !== undefined ? gr.dtb.toFixed(1) : '-'}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderAssignmentsTab = () => {
    return (
      <View style={styles.subTabContainer}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.sectionHeaderTitle}>👨‍🏫 Phân Công Giảng Dạy</Text>
            <Text style={styles.sectionHeaderSubtitle}>Giao Giáo viên phụ trách Môn học cho từng Lớp</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalType('assignment')}>
            <Text style={styles.addBtnText}>+ Phân công mới</Text>
          </TouchableOpacity>
        </View>

        {assignments.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Chưa có phân công giảng dạy nào.</Text>
          </View>
        ) : (
          assignments.map(a => {
            const t = teachers.find(item => item.id === a.teacherId);
            const sub = subjects.find(item => item.id === a.subjectId);
            const cls = classes.find(item => item.id === a.classId);

            return (
              <View key={a.id} style={styles.assignCard}>
                <View style={styles.assignIconBox}>
                  <Text style={{ fontSize: 22 }}>📘</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.assignSubjectName}>{sub?.name} ({sub?.code})</Text>
                  <Text style={styles.assignDetails}>
                    Lớp: <Text style={{ fontWeight: '700', color: '#0284c7' }}>{cls?.name}</Text> | Giáo viên: <Text style={{ fontWeight: '700', color: '#1e293b' }}>{t?.name}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteIconButton}
                  onPress={() => deleteAssignment(a.id)}
                >
                  <Text style={{ color: '#ef4444', fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderStatsTab = () => {
    return (
      <View style={styles.subTabContainer}>
        <Text style={styles.sectionHeaderTitle}>📊 Thống Kê Học Lực Học Sinh</Text>
        <Text style={styles.sectionHeaderSubtitle}>Học kỳ: {activeSemester.name} ({activeSemester.academicYear})</Text>

        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, statsViewMode === 'class' && styles.toggleBtnActive]}
            onPress={() => setStatsViewMode('class')}
          >
            <Text style={[styles.toggleBtnText, statsViewMode === 'class' && styles.toggleBtnTextActive]}>Theo Lớp học</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, statsViewMode === 'grade' && styles.toggleBtnActive]}
            onPress={() => setStatsViewMode('grade')}
          >
            <Text style={[styles.toggleBtnText, statsViewMode === 'grade' && styles.toggleBtnTextActive]}>Theo Khối học (6,7,8,9)</Text>
          </TouchableOpacity>
        </View>

        {statsViewMode === 'class' ? (
          classes.map(c => {
            const stat = getClassStatistics(c.id, activeSemester.id);
            return (
              <View key={c.id} style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <Text style={styles.statTitle}>Lớp {c.name}</Text>
                  <Text style={styles.statTotal}>Sĩ số: {stat.total} học sinh</Text>
                </View>

                {stat.total === 0 ? (
                  <Text style={styles.emptyText}>Chưa có dữ liệu học sinh</Text>
                ) : (
                  <View style={styles.barSection}>
                    {/* Progress bars for Gioi, Kha, TB, Yeu */}
                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>🥇 Giỏi: {stat.gioit} HS ({stat.gioitPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.gioitPct}%`, backgroundColor: '#10b981' }]} />
                      </View>
                    </View>

                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>🥈 Khá: {stat.kha} HS ({stat.khaPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.khaPct}%`, backgroundColor: '#3b82f6' }]} />
                      </View>
                    </View>

                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>📙 Trung bình: {stat.tb} HS ({stat.tbPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.tbPct}%`, backgroundColor: '#f59e0b' }]} />
                      </View>
                    </View>

                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>🔻 Yếu: {stat.yeu} HS ({stat.yeuPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.yeuPct}%`, backgroundColor: '#ef4444' }]} />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          [6, 7, 8, 9].map(gradeNum => {
            const stat = getGradeLevelStatistics(gradeNum, activeSemester.id);
            return (
              <View key={gradeNum} style={styles.statCard}>
                <View style={styles.statCardHeader}>
                  <Text style={styles.statTitle}>Khối {gradeNum}</Text>
                  <Text style={styles.statTotal}>Tổng số: {stat.total} học sinh</Text>
                </View>

                {stat.total === 0 ? (
                  <Text style={styles.emptyText}>Chưa có dữ liệu học sinh trong khối</Text>
                ) : (
                  <View style={styles.barSection}>
                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>🥇 Giỏi: {stat.gioit} HS ({stat.gioitPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.gioitPct}%`, backgroundColor: '#10b981' }]} />
                      </View>
                    </View>

                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>🥈 Khá: {stat.kha} HS ({stat.khaPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.khaPct}%`, backgroundColor: '#3b82f6' }]} />
                      </View>
                    </View>

                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>📙 Trung bình: {stat.tb} HS ({stat.tbPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.tbPct}%`, backgroundColor: '#f59e0b' }]} />
                      </View>
                    </View>

                    <View style={styles.statRowItem}>
                      <Text style={styles.statLabel}>🔻 Yếu: {stat.yeu} HS ({stat.yeuPct}%)</Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: `${stat.yeuPct}%`, backgroundColor: '#ef4444' }]} />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    );
  };

  const renderSystemTab = () => {
    return (
      <View style={styles.subTabContainer}>
        <Text style={styles.sectionHeaderTitle}>⚙️ Quản Lý Hệ Thống</Text>
        <Text style={styles.sectionHeaderSubtitle}>Điều khiển thời hạn nhập điểm, Quản lý danh mục người dùng, lớp, môn...</Text>

        {/* Grade Lock Settings Box */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>🔒 Khóa / Mở Thời Hạn Nhập Điểm</Text>
          {semesters.map(s => (
            <View key={s.id} style={styles.lockRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.semesterNameText}>{s.name} ({s.academicYear})</Text>
                <Text style={styles.deadlineText}>Hạn nhập điểm: {s.entryDeadline}</Text>
              </View>

              <TouchableOpacity
                style={[styles.lockToggleBtn, s.isLocked ? styles.lockBtnLocked : styles.lockBtnUnlocked]}
                onPress={() => toggleSemesterLock(s.id)}
              >
                <Text style={styles.lockToggleBtnText}>
                  {s.isLocked ? '🔒 ĐANG KHÓA (Bấm để Mở)' : '🔓 ĐANG MỞ (Bấm để Khóa)'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Management Quick Buttons */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>📂 Quản Lý Danh Mục</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.catBtn} onPress={() => setModalType('class')}>
              <Text style={styles.catIcon}>🏫</Text>
              <Text style={styles.catText}>Lớp học ({classes.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.catBtn} onPress={() => setModalType('teacher')}>
              <Text style={styles.catIcon}>👩‍🏫</Text>
              <Text style={styles.catText}>Giáo viên ({teachers.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.catBtn} onPress={() => setModalType('student')}>
              <Text style={styles.catIcon}>🎓</Text>
              <Text style={styles.catText}>Học sinh ({students.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.catBtn} onPress={() => setModalType('subject')}>
              <Text style={styles.catIcon}>📚</Text>
              <Text style={styles.catText}>Môn học ({subjects.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.catBtn} onPress={() => setModalType('user')}>
              <Text style={styles.catIcon}>👤</Text>
              <Text style={styles.catText}>Tài khoản ({users.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Admin Top Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'results' && styles.navBtnActive]}
          onPress={() => setActiveTab('results')}
        >
          <Text style={[styles.navBtnText, activeTab === 'results' && styles.navBtnTextActive]}>📋 Kết quả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'assignments' && styles.navBtnActive]}
          onPress={() => setActiveTab('assignments')}
        >
          <Text style={[styles.navBtnText, activeTab === 'assignments' && styles.navBtnTextActive]}>👨‍🏫 Phân công</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'stats' && styles.navBtnActive]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.navBtnText, activeTab === 'stats' && styles.navBtnTextActive]}>📊 Thống kê</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'system' && styles.navBtnActive]}
          onPress={() => setActiveTab('system')}
        >
          <Text style={[styles.navBtnText, activeTab === 'system' && styles.navBtnTextActive]}>⚙️ Quản lý</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'results' && renderResultsTab()}
        {activeTab === 'assignments' && renderAssignmentsTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'system' && renderSystemTab()}
      </ScrollView>

      {/* Dynamic Creation Modals */}
      <Modal visible={modalType !== null} transparent animationType="slide" onRequestClose={() => setModalType(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'class' ? 'Quản lý Lớp học' :
                 modalType === 'teacher' ? 'Quản lý Giáo viên' :
                 modalType === 'student' ? 'Quản lý Học sinh' :
                 modalType === 'subject' ? 'Quản lý Môn học' :
                 modalType === 'user' ? 'Quản lý Tài khoản' : 'Thêm Phân công mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalType(null)}>
                <Text style={styles.closeBtnText}>✖</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {modalType === 'class' && (
                <View>
                  <Text style={styles.inputLabel}>Tên lớp học (ví dụ: 6A3):</Text>
                  <TextInput style={styles.modalInput} value={newClassName} onChangeText={setNewClassName} placeholder="Nhập tên lớp..." placeholderTextColor="#94a3b8" />
                  <Text style={styles.inputLabel}>Khối học (6, 7, 8, 9):</Text>
                  <TextInput style={styles.modalInput} value={newClassGrade} onChangeText={setNewClassGrade} keyboardType="numeric" placeholder="6" placeholderTextColor="#94a3b8" />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleAddClass}>
                    <Text style={styles.submitBtnText}>+ Thêm Lớp Mới</Text>
                  </TouchableOpacity>

                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Danh sách Lớp hiện có:</Text>
                  {classes.map(c => (
                    <View key={c.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>Lớp {c.name} (Khối {c.grade})</Text>
                      <TouchableOpacity onPress={() => deleteClass(c.id)}><Text style={{ color: '#ef4444' }}>Xóa</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {modalType === 'teacher' && (
                <View>
                  <Text style={styles.inputLabel}>Mã giáo viên (ví dụ: GV06):</Text>
                  <TextInput style={styles.modalInput} value={newTeacherCode} onChangeText={setNewTeacherCode} placeholder="GV06" placeholderTextColor="#94a3b8" />
                  <Text style={styles.inputLabel}>Họ và tên giáo viên:</Text>
                  <TextInput style={styles.modalInput} value={newTeacherName} onChangeText={setNewTeacherName} placeholder="Nguyễn Văn A" placeholderTextColor="#94a3b8" />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleAddTeacher}>
                    <Text style={styles.submitBtnText}>+ Thêm Giáo Viên Mới</Text>
                  </TouchableOpacity>

                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Danh sách Giáo viên:</Text>
                  {teachers.map(t => (
                    <View key={t.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{t.code} - {t.name}</Text>
                      <TouchableOpacity onPress={() => deleteTeacher(t.id)}><Text style={{ color: '#ef4444' }}>Xóa</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {modalType === 'student' && (
                <View>
                  <Text style={styles.inputLabel}>Mã học sinh (ví dụ: HS6010):</Text>
                  <TextInput style={styles.modalInput} value={newStudentCode} onChangeText={setNewStudentCode} placeholder="HS6010" placeholderTextColor="#94a3b8" />
                  <Text style={styles.inputLabel}>Họ và tên học sinh:</Text>
                  <TextInput style={styles.modalInput} value={newStudentName} onChangeText={setNewStudentName} placeholder="Nguyễn Văn B" placeholderTextColor="#94a3b8" />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleAddStudent}>
                    <Text style={styles.submitBtnText}>+ Thêm Học Sinh Mới</Text>
                  </TouchableOpacity>

                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Danh sách Học sinh:</Text>
                  {students.map(s => (
                    <View key={s.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{s.code} - {s.name}</Text>
                      <TouchableOpacity onPress={() => deleteStudent(s.id)}><Text style={{ color: '#ef4444' }}>Xóa</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {modalType === 'subject' && (
                <View>
                  <Text style={styles.inputLabel}>Mã môn (ví dụ: SINH):</Text>
                  <TextInput style={styles.modalInput} value={newSubjectCode} onChangeText={setNewSubjectCode} placeholder="SINH" placeholderTextColor="#94a3b8" />
                  <Text style={styles.inputLabel}>Tên môn học:</Text>
                  <TextInput style={styles.modalInput} value={newSubjectName} onChangeText={setNewSubjectName} placeholder="Sinh học" placeholderTextColor="#94a3b8" />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubject}>
                    <Text style={styles.submitBtnText}>+ Thêm Môn Mới</Text>
                  </TouchableOpacity>

                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Danh sách Môn học:</Text>
                  {subjects.map(s => (
                    <View key={s.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{s.code} - {s.name}</Text>
                      <TouchableOpacity onPress={() => deleteSubject(s.id)}><Text style={{ color: '#ef4444' }}>Xóa</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {modalType === 'user' && (
                <View>
                  <Text style={styles.inputLabel}>Họ tên tài khoản:</Text>
                  <TextInput style={styles.modalInput} value={newUserName} onChangeText={setNewUserName} placeholder="Nguyễn Văn C" placeholderTextColor="#94a3b8" />
                  <Text style={styles.inputLabel}>Tên đăng nhập:</Text>
                  <TextInput style={styles.modalInput} value={newUserUsername} onChangeText={setNewUserUsername} placeholder="user123" placeholderTextColor="#94a3b8" />
                  <TouchableOpacity style={styles.submitBtn} onPress={handleAddUser}>
                    <Text style={styles.submitBtnText}>+ Thêm Tài Khoản Mới</Text>
                  </TouchableOpacity>

                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Danh sách Tài khoản:</Text>
                  {users.map(u => (
                    <View key={u.id} style={styles.listItem}>
                      <Text style={styles.listItemText}>{u.name} ({u.username}) - {u.role}</Text>
                      <TouchableOpacity onPress={() => deleteUser(u.id)}><Text style={{ color: '#ef4444' }}>Xóa</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {modalType === 'assignment' && (
                <View>
                  <Text style={styles.inputLabel}>Chọn Giáo viên:</Text>
                  <ScrollView horizontal style={styles.chipScrollView}>
                    {teachers.map(t => (
                      <TouchableOpacity key={t.id} style={[styles.chip, assignTeacherId === t.id && styles.chipActive]} onPress={() => setAssignTeacherId(t.id)}>
                        <Text style={[styles.chipText, assignTeacherId === t.id && styles.chipTextActive]}>{t.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.inputLabel}>Chọn Môn học:</Text>
                  <ScrollView horizontal style={styles.chipScrollView}>
                    {subjects.map(sub => (
                      <TouchableOpacity key={sub.id} style={[styles.chip, assignSubjectId === sub.id && styles.chipActive]} onPress={() => setAssignSubjectId(sub.id)}>
                        <Text style={[styles.chipText, assignSubjectId === sub.id && styles.chipTextActive]}>{sub.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.inputLabel}>Chọn Lớp học:</Text>
                  <ScrollView horizontal style={styles.chipScrollView}>
                    {classes.map(c => (
                      <TouchableOpacity key={c.id} style={[styles.chip, assignClassId === c.id && styles.chipActive]} onPress={() => setAssignClassId(c.id)}>
                        <Text style={[styles.chipText, assignClassId === c.id && styles.chipTextActive]}>Lớp {c.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity style={[styles.submitBtn, { marginTop: 16 }]} onPress={handleAssignTeacher}>
                    <Text style={styles.submitBtnText}>XÁC NHẬN PHÂN CÔNG</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  navBtnActive: {
    borderBottomColor: '#0284c7',
    backgroundColor: '#f0f9ff',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  navBtnTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  subTabContainer: {},
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  chipScrollView: {
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#0284c7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 14,
  },
  emptyBox: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  studentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  studentNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  studentCodeText: {
    fontSize: 13,
    color: '#0284c7',
    fontWeight: '600',
  },
  studentSubInfo: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  gpaBadge: {
    alignItems: 'flex-end',
  },
  gpaLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  gpaVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284c7',
  },
  rankTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  rankTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  gradeGrid: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
  },
  gradeGridTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  subjectNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    width: 100,
  },
  scoresInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreDetailText: {
    fontSize: 11,
    color: '#64748b',
    marginRight: 10,
  },
  dtbScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369a1',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  assignCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  assignIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  assignSubjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  assignDetails: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  deleteIconButton: {
    padding: 8,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleBtnTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  statTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  barSection: {
    marginTop: 4,
  },
  statRowItem: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  lockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  semesterNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  deadlineText: {
    fontSize: 11,
    color: '#64748b',
  },
  lockToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lockBtnLocked: {
    backgroundColor: '#fee2e2',
  },
  lockBtnUnlocked: {
    backgroundColor: '#dcfce7',
  },
  lockToggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catBtn: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  catIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtnText: {
    fontSize: 18,
    color: '#64748b',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  submitBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listItemText: {
    fontSize: 12,
    color: '#334155',
  },
});
