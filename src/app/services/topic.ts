
import { Injectable, signal } from '@angular/core';

export interface Topic {
  maDeTai: string;
  tenDeTai: string;
  moTa: string;
  giangVienHuongDan: string;
  trangThai: number;
}

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private readonly topicState = signal<Topic[]>([
    {
      maDeTai: 'DT001',
      tenDeTai: 'Xây dựng hệ thống quản lý khóa luận',
      moTa: 'Phát triển hệ thống quản lý đề tài theo SOA',
      giangVienHuongDan: 'Nguyễn Văn A',
      trangThai: 0
    },
    {
      maDeTai: 'DT002',
      tenDeTai: 'Ứng dụng Microservices với Node.js',
      moTa: 'Nghiên cứu và triển khai Microservices',
      giangVienHuongDan: 'Trần Thị B',
      trangThai: 1
    },
    {
      maDeTai: 'DT003',
      tenDeTai: 'Ứng dụng quản lý sinh viên',
      moTa: 'Xây dựng ứng dụng quản lý sinh viên',
      giangVienHuongDan: 'Lê Văn C',
      trangThai: 2
    }
  ]);

  readonly topics = this.topicState.asReadonly();

  addTopic(topic: Topic): boolean {
    if (this.topicState().some(
      t => t.maDeTai === topic.maDeTai
    )) {
      return false;
    }

    this.topicState.update(list => [...list, topic]);
    return true;
  }

  updateTopic(topic: Topic): void {
    this.topicState.update(list =>
      list.map(t =>
        t.maDeTai === topic.maDeTai ? topic : t
      )
    );
  }

  deleteTopic(maDeTai: string): void {
    this.topicState.update(list =>
      list.filter(t => t.maDeTai !== maDeTai)
    );
  }

  updateStatus(maDeTai: string, trangThai: number): void {
    this.topicState.update(list =>
      list.map(t =>
        t.maDeTai === maDeTai
          ? { ...t, trangThai }
          : t
      )
    );
  }
}
