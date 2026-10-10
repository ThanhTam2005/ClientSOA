import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Interface dùng riêng cho Giao diện Frontend (khớp với HTML/Component hiện tại)
export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
}

// Cấu trúc dữ liệu chuẩn từ Backend API (theo studentTypes.js)
interface BackendStudent {
  mssv: string;
  hoTen: string;
  email: string;
  lop: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/students';

  // Quản lý trạng thái danh sách sinh viên hiển thị trên UI
  private readonly studentState = signal<Student[]>([]);
  readonly students = this.studentState.asReadonly();

  constructor() {
    this.loadStudents(); // Tự động gọi API lấy dữ liệu khi khởi chạy
  }

  // 1. Tải danh sách từ Backend và MAPPING sang tên trường của Frontend
  loadStudents(): void {
    this.http.get<{ success: boolean; data: BackendStudent[] }>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          const mappedStudents: Student[] = res.data.map(item => ({
            id: item.mssv,
            name: item.hoTen,
            email: item.email,
            major: item.lop
          }));
          this.studentState.set(mappedStudents);
        }
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách sinh viên từ API Gateway:', err);
      }
    });
  }

  // 2. Thêm sinh viên (Mapping từ Frontend -> CreateStudentDTO của Backend)
  addStudent(student: Student): boolean {
    if (this.studentState().some(s => s.id === student.id)) {
      return false;
    }

    const payload = {
      mssv: student.id,
      hoTen: student.name,
      email: student.email,
      lop: student.major
    };

    this.http.post<any>(this.apiUrl, payload).subscribe({
      next: () => {
        this.loadStudents(); // Tải lại danh sách sau khi thêm thành công
      },
      error: (err) => {
        console.error('Lỗi khi thêm sinh viên:', err);
      }
    });

    return true;
  }

  // 3. Cập nhật sinh viên (Mapping từ Frontend -> UpdateStudentDTO của Backend)
  updateStudent(student: Student): void {
    const payload = {
      hoTen: student.name,
      email: student.email,
      lop: student.major
    };

    // Truyền mssv lên URL, payload gửi các trường hoTen, lop, email theo đúng UpdateStudentDTO
    this.http.put<any>(`${this.apiUrl}/${student.id}`, payload).subscribe({
      next: () => {
        this.loadStudents(); // Tải lại danh sách sau khi cập nhật
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật sinh viên:', err);
      }
    });
  }

  // 4. Xóa sinh viên theo mã (id tương ứng với mssv)
  deleteStudent(id: string): void {
    this.http.delete<any>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadStudents(); // Tải lại danh sách sau khi xóa
      },
      error: (err) => {
        console.error('Lỗi khi xóa sinh viên:', err);
      }
    });
  }
}