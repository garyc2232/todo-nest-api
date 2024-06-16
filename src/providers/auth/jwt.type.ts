export type JwtPayload = {
  userName: string;
  sub: number;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
