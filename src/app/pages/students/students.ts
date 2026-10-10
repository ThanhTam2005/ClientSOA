
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student, StudentService, CreateStudentDTO, UpdateStudentDTO } from '../../services/student';

@Component({
  selector: 'app-students',
  imports: [CommonModule, FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students {

  private studentService = inject(StudentService);

  searchText = '';
  showForm = false;
  isEditing = false;

  studentForm: Student = this.emptyStudent();

  private emptyStudent(): Student {
    return {
      id: '',
      name: '',
      email: '',
      major: ''
    };
  }

  get filteredStudents(): Student[] {
    const keyword = this.searchText.toLowerCase().trim();

    return this.studentService.students().filter(student =>
      student.id.toLowerCase().includes(keyword) ||
      student.name.toLowerCase().includes(keyword) ||
      student.email.toLowerCase().includes(keyword) ||
      student.major.toLowerCase().includes(keyword)
    );
  }

  openAddForm(): void {
    this.studentForm = this.emptyStudent();
    this.isEditing = false;
    this.showForm = true;
  }

  editStudent(student: Student): void {
    this.studentForm = { ...student };
    this.isEditing = true;
    this.showForm = true;
  }

  saveStudent(): void {
    const payload: Student = {
      id: this.studentForm.id.trim(),
      name: this.studentForm.name.trim(),
      email: this.studentForm.email.trim(),
      major: this.studentForm.major.trim()
    };

    if (
      !payload.id ||
      !payload.name ||
      !payload.email ||
      !payload.major
    ) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.isEditing) {
      const updateData: UpdateStudentDTO = {
        hoTen: payload.name,
        email: payload.email,
        lop: payload.major
      };
      this.studentService.updateStudent(payload.id, updateData).subscribe({
        next: () => {
          this.showForm = false;
        },
        error: (err) => {
          alert('Có lỗi xảy ra khi cập nhật sinh viên.');
        }
      });
    } else {
      const createData: CreateStudentDTO = {
        mssv: payload.id,
        hoTen: payload.name,
        email: payload.email,
        lop: payload.major
      };
      this.studentService.addStudent(createData).subscribe({
        next: () => {
          this.showForm = false;
        },
        error: (err) => {
          alert('Có lỗi xảy ra khi thêm sinh viên.');
        }
      });
    }
  }

  deleteStudent(id: string): void {
    if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      this.studentService.deleteStudent(id).subscribe({
        error: (err) => {
          alert('Có lỗi xảy ra khi xóa sinh viên.');
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}
