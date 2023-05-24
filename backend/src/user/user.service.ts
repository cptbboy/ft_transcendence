import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma';

@Injectable()
export class Users {

	/**
	 * if user does not exist yet, creates database entries in users and stats tables
	 * @param name username and intra_name to register
	 */
	async createNewUser(name: string, photo: string) {
		if (await prisma.users.findUnique( {where: {intra_name: name}} ) != null)
			return;
		const newUsersEntry = await prisma.users.create( {
			data: {
				username:			name,
				intra_name:			name,
				profile_picture:	photo,
			}
		})
		const newStatsEntry = await prisma.stats.create( {
			data: {}
		})
		console.log('user created: ', name);
	}

	/*	========== GETTER ==========	*/

	async getUser(intra: string) {
		return prisma.users.findUnique( { where: { intra_name: intra } });
	}

	async getUsers() {
		const Users = await prisma.users.findMany({
			orderBy: {
				rank: 'desc',
			},
		});

		return Users;
	}

	async getUsername(id: number): Promise<string> {
		const usersEntry = await prisma.users.findUnique( {where: {id: id}} );
		return usersEntry.username;
	}

	async getUsernameByIntra(intra_name: string): Promise<string> {
		const usersEntry = await prisma.users.findUnique( {where: {intra_name: intra_name}} );
		return usersEntry.username;
	}

	async getAvatarByIntra(intra_name: string): Promise<string> {
		const usersEntry = await prisma.users.findUnique( {where: {intra_name: intra_name}} );
		return usersEntry.profile_picture;
	}

	async getIntraName(id: number): Promise<string> {
		const usersEntry = await prisma.users.findUnique( {where: {id: id}} );
		return usersEntry.intra_name;
	}

	async getId(intra_name: string): Promise<number> {
		const usersEntry = await prisma.users.findUnique( {where: {intra_name: intra_name}} );
		return usersEntry.id;
	}
	
	async get2FASecret(intra: string): Promise<string> {
		const user = await prisma.users.findFirst({
			where: { intra_name: intra },
			select: { twoFactorSecret: true },
		});
		return user.twoFactorSecret;
	}

	async getTFA(intra_name: string): Promise<boolean> {
		const usersEntry = await prisma.users.findUnique( {where: {intra_name: intra_name}} );
		return usersEntry.tfa_enabled;
	}

	async getScore(intra_name: string): Promise<number> {
		const id = await this.getId(intra_name);
		const statsEntry = await prisma.stats.findUnique( {where: {id: id}} );
		return statsEntry.score;
	}

	async getPaddleStats(intra: string) {
		const user = await prisma.users.findUnique({
			where: {
				intra_name: intra,
			},
		});
		
		const userStats = await prisma.games.aggregate({
		where: {
			intra: user.intra_name,
		},
		_sum: {
			paddle_hits_m: true,
			paddle_hits_e: true,
			enemy_score: true,
		},
		});
	
		return {
			paddle_hits_m: userStats._sum.paddle_hits_m,
			paddle_hits_e: userStats._sum.paddle_hits_e,
			paddle_miss: userStats._sum.enemy_score,
		};
	}

	/*	========== SETTER ==========	*/

	async setUsername(intra: string, new_username: string) {
		if (new_username.length < 2)
			return ("1");
		const existingUser = await prisma.users.findFirst({
		  where: {
			AND: [
			  { intra_name: { not: { equals: intra } } },
			  { username: { equals: new_username, mode: 'insensitive' } },
			],
		  },
		});
		if (existingUser) {
			return ("2");
		}

		const updateUser = await prisma.users.update({
		  where: { intra_name: intra },
		  data: { username: new_username },
		});

		return (new_username);
	  }

	async setAvatar(intra: string, picture: string) {
		const updateUser = await prisma.users.update({
			where: {intra_name: intra},
			data:  {profile_picture: picture},
		});
	}

	async set2FASecret(intra: string, secret: string) {
		return await prisma.users.update({
			where: { intra_name: intra },
			data: { twoFactorSecret: secret },
		});
	}

	async setTFA(intra: string, state: boolean) {
		return await prisma.users.update({
			where: { intra_name: intra },
			data: { tfa_enabled: state },
		});
	}

	async setTenComp(intra: string) {
		return await prisma.users.update({
			where: { intra_name: intra },
			data: { ten_comp: true }
		});
	}

	async setTopThree(intra: string) {
		return await prisma.users.update({
			where: { intra_name: intra },
			data: { top_three: true }
		});
	}

	async setHackerman(intra: string) {
		return await prisma.users.update({
			where: { intra_name: intra },
			data: { hackerman: true }
		});
	}


}