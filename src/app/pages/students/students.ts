
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Student,
  StudentService
} from '../../services/student';

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
      student.email.toLowerCase().includes(keyword)
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
    const student: Student = {
      id: this.studentForm.id.trim(),
      name: this.studentForm.name.trim(),
      email: this.studentForm.email.trim(),
      major: this.studentForm.major.trim()
    };

    if (
      !student.id ||
      !student.name ||
      !student.email ||
      !student.major
    ) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (this.isEditing) {
      this.studentService.updateStudent(student);
    } else {
      const success = this.studentService.addStudent(student);

      if (!success) {
        alert('Mã sinh viên đã tồn tại!');
        return;
      }
    }

    this.showForm = false;
  }

  deleteStudent(id: string): void {
    if (confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      this.studentService.deleteStudent(id);
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}
