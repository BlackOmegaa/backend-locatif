import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PowensService {
    private readonly apiUrl = 'https://gloomies-sandbox.biapi.pro/2.0/';

    constructor(private readonly prisma: PrismaService, private readonly http: HttpService) { }

    async createAuthTokenForUser(userId: number) {
        try {
            const res = await axios.post(`${this.apiUrl}/auth/init`, {
                client_id: process.env.POWENS_CLIENT_ID,
                client_secret: process.env.POWENS_CLIENT_SECRET,
            });

            const authToken = res.data.auth_token;

            if (!authToken) throw new Error("auth_token manquant");

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    powensAuthToken: authToken,
                },
            });

            return authToken;
        } catch (err) {
            console.error('Erreur Powens createAuthTokenForUser:', err?.response?.data || err);
            throw new InternalServerErrorException('Erreur lors de l’initialisation Powens');
        }
    }


    async generateTemporaryCode(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.powensAuthToken) throw new Error('Token Powens non trouvé');

        try {
            const callbackUrl = encodeURIComponent('http://localhost:4200/bank-success');
            const res = await axios.get(`${this.apiUrl}/auth/token/code?callback_url=${callbackUrl}`, {
                headers: { Authorization: `Bearer ${user.powensAuthToken}` },
            });
            return res.data.code;
        } catch (err) {
            console.error('Erreur Powens code temporaire:', err?.response?.data || err);
            throw new InternalServerErrorException('Erreur lors de la génération du code temporaire Powens');
        }
    }

    async storeConnectionId(userId: number, connectionId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { powensConnectionId: connectionId },
        });
    }

    async getUserAccounts(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.powensAuthToken) throw new Error('Token Powens manquant pour cet utilisateur');

        const response = await axios.get(`${this.apiUrl}/users/me/accounts`, {
            headers: {
                Authorization: `Bearer ${user.powensAuthToken}`,
            },
        });

        return response.data.accounts;
    }

    async synchronizeConnection(userId: number): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.powensAuthToken || !user?.powensConnectionId) {
            throw new Error("Accès impossible, token ou connection manquant");
        }

        try {
            const resp = await axios.put(
                `${this.apiUrl}/users/me/connections/${user.powensConnectionId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.powensAuthToken}`,
                    },
                }
            );
            return resp.data;
        } catch (err) {
            console.error("Erreur sync Powens :", err.response?.data || err);
            throw new InternalServerErrorException("Synchronisation échouée");
        }
    }



}
