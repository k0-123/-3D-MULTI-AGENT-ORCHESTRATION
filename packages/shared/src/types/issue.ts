export interface Issue {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked' | 'reviewing';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  reason?: string;
}
