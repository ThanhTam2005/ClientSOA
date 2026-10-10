import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Registration,
  RegistrationService
} from '../../services/registration';

import { StudentService } from '../../services/student';
import { TopicService, Topic } from '../../services/topic';

@Component({
  selector: 'app-registrations',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrations.html',
  styleUrl: './registrations.css'
})
export class Registrations {

  private registrationService = inject(RegistrationService);
  private studentService = inject(StudentService);
  private topicService = inject(TopicService);

  searchText = '';
  showForm = false;
  isEditing = false;
  currentMaDangKy = '';

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

  // Chỉ lấy đề tài đang mở (trangThai === 0)
  get availableTopics(): Topic[] {
    const allTopics = this.topicService.topics();
    if (!this.isEditing){
      return allTopics.filter(t => t.trangThai === 0);
    } else {
      return allTopics.filter(t => t.trangThai === 0 || t.maDeTai === this.form.maDeTai);
    }
  }

  get filteredRegistrations(): Registration[] {
    const keyword = this.searchText.toLowerCase().trim();

    return this.registrationService.registrations()
      .filter(r =>
        r.maDangKy.toLowerCase().includes(keyword) ||
        r.mssv.toLowerCase().includes(keyword) ||
        (r.tenSinhVien && r.tenSinhVien.toLowerCase().includes(keyword)) ||
        r.maDeTai.toLowerCase().includes(keyword) ||
        (r.tenDeTai && r.tenDeTai.toLowerCase().includes(keyword))
      );
  }

  openAddForm(): void {
    this.isEditing = false;
    this.currentMaDangKy = '';
    this.form = {
      mssv: '',
      maDeTai: ''
    };

    this.showForm = true;
  }

  editRegistration(item: Registration): void {
    this.isEditing = true;
    this.currentMaDangKy = item.maDangKy;
    this.form = {
      mssv: item.mssv,
      maDeTai: item.maDeTai
    };
    this.showForm = true;
  }

  saveRegistration(): void {
    if (!this.form.mssv || !this.form.maDeTai) {
      alert('Vui lòng chọn sinh viên và đề tài!');
      return;
    }

    if(this.isEditing) {
      this.registrationService.updateRegistration(this.currentMaDangKy, {
        mssv: this.form.mssv,
        maDeTai: this.form.maDeTai
      } as any).subscribe({
        next: () => {
          this.showForm = false;
        },
        error: (err) => {
          alert('Cập nhật đăng ký không thành công! ' + (err.error?.message || err.message));
        }
      });
    } else {
      this.registrationService.addRegistration({
        mssv: this.form.mssv,
        maDeTai: this.form.maDeTai
      }).subscribe({
        next: () => {
          this.showForm = false;
        },
        error: (err) => {
          alert('Đăng ký không thành công! ' + (err.error?.message || err.message));
        }
      });
    }
  }

  deleteRegistration(maDangKy: string): void {
    if (confirm('Bạn có chắc muốn hủy đăng ký này?')) {
      this.registrationService.deleteRegistration(maDangKy).subscribe({
        error: (err) => {
          alert('Lỗi khi hủy đăng ký: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}