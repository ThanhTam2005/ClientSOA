
import { Injectable, signal } from '@angular/core';

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly studentState = signal<Student[]>([
    {
      id: 'SV001',
      name: 'Nguyễn Văn An',
      email: 'an@example.com',
      major: 'Công nghệ thông tin'
    },
    {
      id: 'SV002',
      name: 'Trần Thị Bình',
      email: 'binh@example.com',
      major: 'Kỹ thuật phần mềm'
    },
    {
      id: 'SV003',
      name: 'Lê Minh Châu',
      email: 'chau@example.com',
      major: 'Hệ thống thông tin'
    }
  ]);

  // Cho phép các Component đọc dữ liệu
  readonly students = this.studentState.asReadonly();

  // Thêm sinh viên
  addStudent(student: Student): boolean {
    if (this.studentState().some(s => s.id === student.id)) {
      return false;
    }

    this.studentState.update(list => [...list, student]);
    return true;
  }

  // Cập nhật sinh viên
  updateStudent(student: Student): void {
    this.studentState.update(list =>
      list.map(s => s.id === student.id ? student : s)
    );
  }

  // Xóa sinh viên
  deleteStudent(id: string): void {
    this.studentState.update(list =>
      list.filter(s => s.id !== id)
    );
  }
}
