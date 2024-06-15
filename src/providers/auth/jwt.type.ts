export type JwtPayload = {
  userName: string;
  sub: number;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
