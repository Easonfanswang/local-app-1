import ProductImportStateSlice from "./modules/productImportState";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    productImportState: ProductImportStateSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
