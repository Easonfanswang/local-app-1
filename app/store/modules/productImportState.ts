import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductImportStateRowType {
  id: string;
  loading: boolean;
  shopifyUrl: string;
}

interface ProductImportStateType {
  rows: ProductImportStateRowType[];
}

const initialState: ProductImportStateType = {
  rows: [],
};

const ProductImportStateSlice = createSlice({
  name: "productImportState",
  initialState,
  reducers: {
    // 更新现有数据
    updateData: (
      state,
      action: PayloadAction<{
        id: string;
        loading: boolean;
        shopifyUrl?: string;
      }>,
    ) => {
      const index = state.rows.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        // 更新现有记录
        state.rows[index] = {
          ...state.rows[index],
          loading: action.payload.loading,
          ...(action.payload.shopifyUrl && {
            shopifyUrl: action.payload.shopifyUrl,
          }),
        };
      }
    },

    // 添加新数据
    addData: (state, action: PayloadAction<ProductImportStateRowType>) => {
      // 检查是否已存在
      if (!state.rows.some((item) => item.id === action.payload.id)) {
        state.rows.push(action.payload);
      }
    },

    // 可选：批量添加数据
    addBulkData: (
      state,
      action: PayloadAction<ProductImportStateRowType[]>,
    ) => {
      action.payload.forEach((newItem) => {
        if (!state.rows.some((item) => item.id === newItem.id)) {
          state.rows.push(newItem);
        }
      });
    },
  },
});

export const { updateData, addData, addBulkData } =
  ProductImportStateSlice.actions;

const reducer = ProductImportStateSlice.reducer;
export default reducer;
