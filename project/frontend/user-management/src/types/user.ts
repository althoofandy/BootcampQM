export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  created: string;
}

export interface UserState {
  users: UserData[];
  loading: boolean;
  error: string | null;
  selectedUser: UserData | null;
  editUser: UserData | null;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
}

export const selectUser = (user: UserData | null) => {
  return { type: "SELECT_USER", payload: user };
};
