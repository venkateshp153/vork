// src/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from '../redux/types/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (userDataRes: any) => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;