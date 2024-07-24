import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isBoardWriteModal: boolean;
};

const Modal: ModalState = {
  isBoardWriteModal: false,
};

const modalSlice = createSlice({
  name: 'modalStore',
  initialState: Modal,
  reducers: {
    setIsBoardWriteModal: (state, action: PayloadAction<boolean>) => {
      console.log(action.payload)
      state.isBoardWriteModal = action.payload;
    }
  }
});

export const { setIsBoardWriteModal } = modalSlice.actions
export default modalSlice.reducer;

