export type ApiErrorBody = {
    detail?: string | Array<string | { msg?: string; message?: string }>;
};

export type MessageResponse = {
    message: string;
};
