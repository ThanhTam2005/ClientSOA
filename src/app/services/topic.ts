import { Injectable, signal, inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegistrationService } from './registration';

// Interface đại diện cho Topic hiển thị trên UI và nhận từ CSDL (TopicEntity)
export interface Topic {
  maDeTai: string;
  tenDeTai: string;
  moTa?: string;
  giangVienHuongDan: string;
  trangThai: number; // Chỉ đọc trạng thái từ CSDL
}

// Payload khi tạo mới đề tài (Khớp với CreateTopicDTO)
export interface CreateTopicDTO {
  maDeTai: string;
  tenDeTai: string;
  moTa?: string;
  giangVienHuongDan: string;
}

// Payload khi cập nhật thông tin đề tài (Khớp với UpdateTopicDTO)
export interface UpdateTopicDTO {
  tenDeTai?: string;
  moTa?: string;
  giangVienHuongDan?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private apiUrl = 'http://localhost:3000/api/topics';

  // Quản lý trạng thái danh sách đề tài bằng Angular Signal
  private readonly topicState = signal<Topic[]>([]);
  readonly topics = this.topicState.asReadonly();

  constructor() {
    this.loadTopics(); // Tự động gọi API lấy dữ liệu khi service được khởi tạo
  }

  // 1. Tải danh sách đề tài từ API Gateway
  loadTopics(): void {
    this.http.get<{ success: boolean; data: Topic[] }>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.topicState.set(res.data);
        }
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách đề tài từ API Gateway:', err);
      }
    });
  }

  // 2. Thêm đề tài mới (Tuân thủ CreateTopicDTO)
  addTopic(payload: CreateTopicDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadTopics(); // Tải lại danh sách sau khi thêm thành công
      })
    );
  }

  // 3. Cập nhật thông tin đề tài (Tuân thủ UpdateTopicDTO)
  updateTopic(maDeTai: string, payload: UpdateTopicDTO): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${maDeTai}`, payload).pipe(
      tap(() => {
        this.loadTopics(); // Tải lại danh sách sau khi cập nhật
        this.injector.get(RegistrationService).loadRegistrations(); // Tải lại danh sách đăng ký để cập nhật thông tin đề tài
      })
    );
  }

  // 4. Xóa đề tài
  deleteTopic(maDeTai: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${maDeTai}`).pipe(
      tap(() => {
        this.loadTopics(); // Tải lại danh sách sau khi xóa
        this.injector.get(RegistrationService).loadRegistrations(); // Tải lại danh sách đăng ký để cập nhật thông tin đề tài
      })
    );
  }
}