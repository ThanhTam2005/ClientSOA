
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Registration,
  RegistrationService
} from '../../services/registration';

import { StudentService } from '../../services/student';
import { TopicService } from '../../services/topic';

@Component({
  selector: 'app-registrations',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrations.html',
  styleUrl: './registrations.css'
})
export class Registrations {

  private registrationService =
    inject(RegistrationService);

  private studentService = inject(StudentService);
  private topicService = inject(TopicService);

  searchText = '';
  showForm = false;

  form = {
    mssv: '',
    maDeTai: ''
  };

  // Lấy danh sách sinh viên từ StudentService
  get students() {
    return this.studentService.students().map(s => ({
      mssv: s.id,
      tenSinhVien: s.name
    }));
  }

  // Chỉ lấy đề tài đang mở
  get topics() {
    return this.topicService.topics()
      .filter(t => t.trangThai === 0);
  }

  get filteredRegistrations(): Registration[] {
    const keyword = this.searchText.toLowerCase().trim();

    return this.registrationService.registrations()
      .filter(r =>
        r.maDangKy.toLowerCase().includes(keyword) ||
        r.mssv.toLowerCase().includes(keyword) ||
        r.tenSinhVien.toLowerCase().includes(keyword) ||
        r.maDeTai.toLowerCase().includes(keyword) ||
        r.tenDeTai.toLowerCase().includes(keyword)
      );
  }

  openAddForm(): void {
    this.form = {
      mssv: '',
      maDeTai: ''
    };

    this.showForm = true;
  }

  saveRegistration(): void {
    if (!this.form.mssv || !this.form.maDeTai) {
      alert('Vui lòng chọn sinh viên và đề tài!');
      return;
    }

    const success =
      this.registrationService.addRegistration(
        this.form.mssv,
        this.form.maDeTai
      );

    if (!success) {
      alert(
        'Đăng ký không thành công! ' +
        'Kiểm tra sinh viên hoặc trạng thái đề tài.'
      );
      return;
    }

    this.showForm = false;
  }

  deleteRegistration(maDangKy: string): void {
    if (confirm('Bạn có chắc muốn hủy đăng ký này?')) {
      this.registrationService
        .deleteRegistration(maDangKy);
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}
