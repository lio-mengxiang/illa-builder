import { Middleware } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "@/store"

export const reduxUndoRedo: Middleware<AppDispatch, RootState, AppDispatch> =
  (store) => (next) => (action) => {
    return next(action)
  }
