import axiosInstance from './axiosInstance';
import type { HistoryItem } from '../types';

export const getHistoryApi = (): Promise<{ data: HistoryItem[] }> => {
    return axiosInstance.get('/history');
};