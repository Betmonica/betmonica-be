import BetDto from './dtos/Bet.dto';
import MatchDto from './dtos/Match.dto';
import UserDto from './dtos/User.dto';

export interface MatchWithBets {
	bet: BetDto;
	match: MatchDto;
}

export interface PlaceBetResponse {
	bet: BetDto;
	match: MatchDto;
}

export interface TokenData {
	refreshToken?: string;
	accessToken: string;
	expiredIn: number;
}

export interface UserWithTokens {
	tokens: TokenData;
	user: UserDto;
}
