import { createSlice } from "@reduxjs/toolkit";

export type ThemeType = "dark" | "light";

export const publicSlice = createSlice({
  name: "public",
  initialState: {
    breads: [] as string[],
    selectedKeys: [] as string[], //menu
    openKeys: [] as string[], //menu
    theme: "light" as ThemeType, // 主题
    activeKey: undefined as undefined | string,
    isMaximize: false, // 是否最大化
    isFullscreen: false, // 是否全屏
    isCollapsed: false, // 是否折叠菜单
  },
  reducers: {
    setBreads: (state, action) => {
      state.breads = action.payload;
    },
    setSelectedKeys: (state, action) => {
      state.selectedKeys = action.payload;
    },
    setOpenKeys: (state, action) => {
      state.openKeys = action.payload;
    },
    setThemeValue: (state, action) => {
      state.theme = action.payload;
    },
    setActiveKey: (state, action) => {
      state.activeKey = action.payload;
    },
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload;
    },
    setMaximize: (state, action) => {
      state.isMaximize = action.payload;
    },
    setCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
  },
});

export const {
  setBreads,
  setSelectedKeys,
  setOpenKeys,
  setThemeValue,
  setMaximize,
  setActiveKey,
  setFullscreen,
  setCollapsed,
} = publicSlice.actions;
