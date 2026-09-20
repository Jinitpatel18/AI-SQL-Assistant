import axiosInstance from './axiosInstance';
import type { QueryResponse } from '../types';

export const askQuestionApi = (question: string): Promise<{ data: QueryResponse }> => {
    return axiosInstance.post('/query/ask', { question });
};