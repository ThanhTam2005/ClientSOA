
import { Injectable, inject, signal } from '@angular/core';
import { StudentService } from './student';
import { TopicService } from './topic';

export interface Registration {
  maDangKy: string;
  mssv: string;
  tenSinhVien: string;
  maDeTai: string;
  tenDeTai: string;
  ngayDangKy: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private studentService = inject(StudentService);
  private topicService = inject(TopicService);

  private readonly registrationState =
    signal<Registration[]>([]);

  readonly registrations =
    this.registrationState.asReadonly();

  addRegistration(
    mssv: string,
    maDeTai: string
  ): boolean {

    const student = this.studentService.students()
      .find(s => s.id === mssv);

    const topic = this.topicService.topics()
      .find(t => t.maDeTai === maDeTai);

    if (!student || !topic) {
      return false;
    }

    // Chỉ cho phép đăng ký đề tài đang mở
    if (topic.trangThai !== 0) {
      return false;
    }

    // Kiểm tra sinh viên đã đăng ký chưa
    const exists = this.registrationState()
      .some(r => r.mssv === mssv);

    if (exists) {
      return false;
    }

    const nextId = Math.max(
      0,
      ...this.registrationState().map(r =>
        Number(r.maDangKy.replace('DK', '')) || 0
      )
    ) + 1;

    const registration: Registration = {
      maDangKy: 'DK' + String(nextId).padStart(3, '0'),
      mssv: student.id,
      tenSinhVien: student.name,
      maDeTai: topic.maDeTai,
      tenDeTai: topic.tenDeTai,
      ngayDangKy: new Date().toLocaleDateString('en-CA')
    };

    this.registrationState.update(list => [
      ...list,
      registration
    ]);

    // Cập nhật trạng thái đề tài
    this.topicService.updateStatus(maDeTai, 1);

    return true;
  }

  deleteRegistration(maDangKy: string): void {
    const registration = this.registrationState()
      .find(r => r.maDangKy === maDangKy);

    if (!registration) {
      return;
    }

    this.registrationState.update(list =>
      list.filter(r => r.maDangKy !== maDangKy)
    );

    // Mở lại đề tài nếu không còn đăng ký nào
    const stillRegistered = this.registrationState()
      .some(r => r.maDeTai === registration.maDeTai);

    if (!stillRegistered) {
      this.topicService.updateStatus(
        registration.maDeTai,
        0
      );
    }
  }
}
