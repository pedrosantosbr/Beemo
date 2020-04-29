export const PUSH_MESSAGE = 'PUSH_MESSAGE';

export const pushMessage = (message, dialogId) => ({ type: PUSH_MESSAGE, message, dialogId })