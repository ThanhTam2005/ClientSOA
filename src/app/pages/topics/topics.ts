
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Topic, TopicService, CreateTopicDTO, UpdateTopicDTO } from '../../services/topic';

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

  topicForm = this.emptyTopicForm();

  private emptyTopicForm() {
    return {
      maDeTai: '',
      tenDeTai: '',
      moTa: '',
      giangVienHuongDan: ''
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
    this.topicForm = this.emptyTopicForm();
    this.isEditing = false;
    this.showForm = true;
  }

  editTopic(topic: Topic): void {
    this.topicForm = {
      maDeTai: topic.maDeTai,
      tenDeTai: topic.tenDeTai,
      moTa: topic.moTa || '',
      giangVienHuongDan: topic.giangVienHuongDan
    };
    this.isEditing = true;
    this.showForm = true;
  }

  saveTopic(): void {
    const payload = {
      maDeTai: this.topicForm.maDeTai.trim(),
      tenDeTai: this.topicForm.tenDeTai.trim(),
      moTa: this.topicForm.moTa?.trim(),
      giangVienHuongDan: this.topicForm.giangVienHuongDan.trim()
    };

    if (
      !payload.maDeTai ||
      !payload.tenDeTai ||
      !payload.giangVienHuongDan
    ) {
      alert('Vui lòng nhập các trường bắt buộc!');
      return;
    }

    if (this.isEditing) {
      const updateData: UpdateTopicDTO = {
        tenDeTai: payload.tenDeTai,
        moTa: payload.moTa,
        giangVienHuongDan: payload.giangVienHuongDan
      };
      this.topicService.updateTopic(payload.maDeTai, updateData).subscribe({
        next: () => {
          this.showForm = false;
        },
        error: (err) => {
          alert('Có lỗi xảy ra khi cập nhật đề tài:' + (err.error?.message || err.message));
        }
      });
    } else {
      const createData: CreateTopicDTO = {
        maDeTai: payload.maDeTai,
        tenDeTai: payload.tenDeTai,
        moTa: payload.moTa,
        giangVienHuongDan: payload.giangVienHuongDan
      };

      this.topicService.addTopic(createData).subscribe({
        next: () => {
          this.showForm = false;
        },
        error: (err) => {
          alert('Có lỗi xảy ra khi thêm đề tài:' + (err.error?.message || err.message));
        }
      });
    }
  }

  deleteTopic(maDeTai: string): void {
    if (confirm('Bạn có chắc muốn xóa đề tài này?')) {
      this.topicService.deleteTopic(maDeTai).subscribe({
        error: (err) => {
          alert('Có lỗi xảy ra khi xóa đề tài:' + (err.error?.message || err.message));
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
  }
}
