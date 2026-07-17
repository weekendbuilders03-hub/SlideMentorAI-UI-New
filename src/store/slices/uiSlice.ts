import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  pricingModalOpen: boolean;
  checkoutModalOpen: boolean;
  activeNav: string;
  userMenuOpen: boolean;
}

const initialState: UiState = {
  pricingModalOpen: false,
  checkoutModalOpen: false,
  activeNav: 'home',
  userMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openPricingModal: (state) => {
      state.pricingModalOpen = true;
    },
    closePricingModal: (state) => {
      state.pricingModalOpen = false;
    },
    openCheckoutModal: (state) => {
      state.checkoutModalOpen = true;
      state.pricingModalOpen = false;
    },
    closeCheckoutModal: (state) => {
      state.checkoutModalOpen = false;
    },
    setActiveNav: (state, action: { payload: string }) => {
      state.activeNav = action.payload;
    },
    toggleUserMenu: (state) => {
      state.userMenuOpen = !state.userMenuOpen;
    },
    closeUserMenu: (state) => {
      state.userMenuOpen = false;
    },
  },
});

export const {
  openPricingModal,
  closePricingModal,
  openCheckoutModal,
  closeCheckoutModal,
  setActiveNav,
  toggleUserMenu,
  closeUserMenu,
} = uiSlice.actions;

export default uiSlice.reducer;
