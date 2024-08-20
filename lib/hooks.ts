import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, RootState } from './redux/configureStore';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
