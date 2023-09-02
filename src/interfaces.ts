import BetDto from './dtos/Bet.dto';
import MatchDto from './dtos/Match.dto';

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
}

export interface UserWithTokens {
	tokens: TokenData;
}
