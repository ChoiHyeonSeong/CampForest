import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isBoardWriteModal: boolean;
  isAnyModalOpen: boolean;
  isLoading: boolean;
};

const Modal: ModalState = {
  isBoardWriteModal: false,
  isAnyModalOpen: false,
  isLoading: false
};

const modalSlice = createSlice({
  name: 'modalStore',
  initialState: Modal,
  reducers: {
    setIsBoardWriteModal: (state, action: PayloadAction<boolean>) => {
      state.isBoardWriteModal = action.payload;
      state.isAnyModalOpen = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  }
});

export const { setIsBoardWriteModal, setIsLoading } = modalSlice.actions
export default modalSlice.reducer;

