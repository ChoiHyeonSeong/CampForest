import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isBoardWriteModal: boolean;
  isAnyModalOpen: boolean;
};

const Modal: ModalState = {
  isBoardWriteModal: false,
  isAnyModalOpen: false,
};

const modalSlice = createSlice({
  name: 'modalStore',
  initialState: Modal,
  reducers: {
    setIsBoardWriteModal: (state, action: PayloadAction<boolean>) => {
      console.log(action.payload)
      state.isBoardWriteModal = action.payload;
      state.isAnyModalOpen = action.payload;
    }
  }
});

export const { setIsBoardWriteModal } = modalSlice.actions
export default modalSlice.reducer;

