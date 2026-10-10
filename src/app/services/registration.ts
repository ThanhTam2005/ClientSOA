import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TopicService } from './topic';

// Khớp với RegistrationEntity (Bảng DANGKY)[cite: 22]
export interface Registration {
  maDangKy: string;
  mssv: string;
  tenSinhVien: string;
  maDeTai: string;
  tenDeTai: string;
  ngayDangKy: string;
}

// Khớp với CreateRegistrationDTO (Payload tạo mới)[cite: 22]
export interface CreateRegistrationDTO {
  mssv: string;
  maDeTai: string;
}

// Khớp với UpdateRegistrationDTO (Payload cập nhật)[cite: 22]
export interface UpdateRegistrationDTO {
  mssv?: string;
  maDeTai?: string;
  tenSinhVien?: string;
  tenDeTai?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private http = inject(HttpClient);
  private topicService = inject(TopicService);
  private apiUrl = 'http://localhost:3000/api/registrations';

  // Quản lý trạng thái danh sách đăng ký bằng Angular Signal
  private readonly registrationState = signal<Registration[]>([]);
  readonly registrations = this.registrationState.asReadonly();

  constructor() {
    this.loadRegistrations(); // Tự động tải danh sách khi khởi tạo
  }

  // 1. Tải danh sách đăng ký từ API Gateway
  loadRegistrations(): void {
    this.http.get<{ success: boolean; data: Registration[] }>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.registrationState.set(res.data);
        }
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách đăng ký từ API Gateway:', err);
      }
    });
  }

  // 2. Gửi yêu cầu đăng ký mới (Tuân thủ CreateRegistrationDTO)[cite: 22]
  addRegistration(payload: CreateRegistrationDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadRegistrations(); // Tải lại danh sách sau khi thêm thành công
        this.topicService.loadTopics(); // Tải lại danh sách đề tài để cập nhật số lượng đăng ký
      })
    );
  }

  // 3. Cập nhật thông tin đăng ký (Tuân thủ UpdateRegistrationDTO)[cite: 22]
  updateRegistration(maDangKy: string, payload: UpdateRegistrationDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${maDangKy}`, payload).pipe(
      tap(() => {
        this.loadRegistrations(); // Tải lại danh sách sau khi cập nhật
        this.topicService.loadTopics(); // Tải lại danh sách đề tài để cập nhật số lượng đăng ký
      })
    );
  }

  // 4. Hủy / Xóa đăng ký
  deleteRegistration(maDangKy: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${maDangKy}`).pipe(
      tap(() => {
        this.loadRegistrations(); // Tải lại danh sách sau khi xóa
        this.topicService.loadTopics(); // Tải lại danh sách đề tài để cập nhật số lượng đăng ký
      })
    );
  }
}