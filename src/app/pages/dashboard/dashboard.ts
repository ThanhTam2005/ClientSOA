
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentService } from '../../services/student';
import { TopicService } from '../../services/topic';
import { RegistrationService } from '../../services/registration';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private studentService = inject(StudentService);
  private topicService = inject(TopicService);
  private registrationService = inject(RegistrationService);

  // Tổng số sinh viên
  get totalStudents(): number {
    return this.studentService.students().length;
  }

  // Tổng số đề tài
  get totalTopics(): number {
    return this.topicService.topics().length;
  }

  // Tổng số đăng ký
  get totalRegistrations(): number {
    return this.registrationService.registrations().length;
  }

  // Số đề tài đang mở đăng ký
  get openTopics(): number {
    return this.topicService.topics()
      .filter(topic => topic.trangThai === 0).length;
  }

  // Các đăng ký gần đây
  get recentRegistrations() {
    return [...this.registrationService.registrations()]
      .slice(-5)
      .reverse()
      .map(registration => ({
        student: registration.tenSinhVien,
        topic: registration.tenDeTai,
        status: 'Đã đăng ký'
      }));
  }
}
