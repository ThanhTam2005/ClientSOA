import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegistrationService } from './registration';

// Interface dùng riêng cho Giao diện Frontend (UI Model)
export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
}

// Cấu trúc dữ liệu chuẩn từ Backend Entity (Bảng SINHVIEN)
export interface StudentEntity {
  mssv: string;
  hoTen: string;
  email: string;
  lop: string;
}

// Payload khi tạo mới sinh viên (CreateStudentDTO)
export interface CreateStudentDTO {
  mssv: string;
  hoTen: string;
  email: string;
  lop: string;
}

// Payload khi cập nhật thông tin sinh viên (UpdateStudentDTO)
export interface UpdateStudentDTO {
  hoTen: string;
  email: string;
  lop: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private registrationService = inject(RegistrationService);
  private apiUrl = 'http://localhost:3000/api/students';

  // Quản lý trạng thái danh sách sinh viên hiển thị trên UI bằng Angular Signal
  private readonly studentState = signal<Student[]>([]);
  readonly students = this.studentState.asReadonly();

  constructor() {
    this.loadStudents(); // Tự động gọi API lấy dữ liệu khi khởi chạy
  }

  // 1. Tải danh sách từ Backend và MAPPING sang tên trường của Frontend
  loadStudents(): void {
    this.http.get<{ success: boolean; data: StudentEntity[] }>(this.apiUrl).subscribe({
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

  // 2. Thêm sinh viên mới (Trả về Observable)
  addStudent(payload: CreateStudentDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadStudents(); // Tải lại danh sách sau khi thêm thành công
      })
    );
  }

  // 3. Cập nhật sinh viên (Trả về Observable)
  updateStudent(mssv: string, payload: UpdateStudentDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${mssv}`, payload).pipe(
      tap(() => {
        this.loadStudents();                           // Tải lại danh sách sinh viên
        this.registrationService.loadRegistrations();    // Tải lại danh sách đăng ký để cập nhật thông tin liên quan
      })
    );
  }

  // 4. Xóa sinh viên theo mã (Trả về Observable)
  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadStudents();                           // Tải lại danh sách sinh viên
        this.registrationService.loadRegistrations();    // Tải lại danh sách đăng ký
      })
    );
  }
}