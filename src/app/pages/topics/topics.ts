
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Topic, TopicService } from '../../services/topic';

@Component({
  selector: 'app-topics',
  imports: [CommonModule, FormsModule],
  templateUrl: './topics.html',
  styleUrl: './topics.css'
})
export class Topics {

  private topicService = inject(TopicService);

  searchText = '';
  statusFilter = -1;
  showForm = false;
  isEditing = false;

  topicForm: Topic = this.emptyTopic();

  private emptyTopic(): Topic {
    return {
      maDeTai: '',
      tenDeTai: '',
      moTa: '',
      giangVienHuongDan: '',
      trangThai: 0
    };
  }

  get filteredTopics(): Topic[] {
    const keyword = this.searchText.toLowerCase().trim();

    return this.topicService.topics().filter(topic => {
      const matchesSearch =
        topic.maDeTai.toLowerCase().includes(keyword) ||
        topic.tenDeTai.toLowerCase().includes(keyword);

      const matchesStatus =
        this.statusFilter === -1 ||
        topic.trangThai === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusName(status: number): string {
    switch (status) {
      case 0: return 'Mở đăng ký';
      case 1: return 'Đã đăng ký';
      case 2: return 'Đã đóng';
      default: return 'Không xác định';
    }
  }

  openAddForm(): void {
    this.topicForm = this.emptyTopic();
    this.isEditing = false;
    this.showForm = true;
  }

  editTopic(topic: Topic): void {
    this.topicForm = { ...topic };
    this.isEditing = true;
    this.showForm = true;
  }

  saveTopic(): void {
    const topic: Topic = {
      maDeTai: this.topicForm.maDeTai.trim(),
      tenDeTai: this.topicForm.tenDeTai.trim(),
      moTa: this.topicForm.moTa.trim(),
      giangVienHuongDan:
        this.topicForm.giangVienHuongDan.trim(),
      trangThai: Number(this.topicForm.trangThai)
    };

    if (
      !topic.maDeTai ||
      !topic.tenDeTai ||
      !topic.giangVienHuongDan
    ) {
      alert('Vui lòng nhập các trường bắt buộc!');
      return;
    }

    if (this.isEditing) {
      this.topicService.updateTopic(topic);
    } else {
      const success = this.topicService.addTopic(topic);

      if (!success) {
        alert('Mã đề tài đã tồn tại!');
        return;
      }
    }

    this.showForm = false;
  }

  deleteTopic(maDeTai: string): void {
    if (confirm('Bạn có chắc muốn xóa đề tài này?')) {
      this.topicService.deleteTopic(maDeTai);
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}
