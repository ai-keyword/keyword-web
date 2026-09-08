export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    username: string;
    token: string;
};

export type SignupRequest = {
    name: string;
    username: string;
    email: string;
    password: string;
};

export type EmailRequest = {
    email: string;
};

export type VerifyCodeRequest = {
    email: string;
    code: string;
};
