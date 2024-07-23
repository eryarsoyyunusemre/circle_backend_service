export interface JwtPayload {
  uuid: string;
  username: string;
  name: string;
  lastname: string;
  status: string;
  role: number;
  user_challenge_id: string;
  user_token: string;
  user_wallet_id: string;
  user_wallet_address: string;
}
