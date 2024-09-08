import { print_modal } from './types';

export const openModal = (orderURL) => {
    return {
        type: print_modal.OPEN_PRINT_MODAL,
        payload: orderURL
    }
};

export const closeModal = () => {
    return {
        type: print_modal.CLOSE_PRINT_MODAL
    }
};