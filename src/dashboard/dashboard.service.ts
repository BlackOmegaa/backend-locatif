import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';

const prisma = new PrismaClient();

@Injectable()
export class DashboardService {
    async getDashboardStats(userId: number) {
        const now = dayjs();
        const currentMonth = now.month() + 1;
        const currentYear = now.year();

        const locatairesActifs = await prisma.locataire.count({
            where: { userId, actif: true },
        });

        const bauxEnCours = await prisma.bail.count({
            where: {
                userId,
                actif: true,
                dateDebut: { lte: now.toDate() },
                dateFin: { gte: now.toDate() },
            },
        });

        const loyersEncaissesCeMois = await prisma.paiementLoyer.findMany({
            where: {
                locataire: { userId },
                mois: currentMonth,
                annee: currentYear,
                statut: 'payé',
            },
        });

        const totalLoyersEncaisses = loyersEncaissesCeMois.reduce((acc, p) => acc + p.montant, 0);

        // Variation fictive pour l'exemple
        const variation = Math.floor(Math.random() * 20) - 5;

        const loyersAttenteCeMois = await prisma.paiementLoyer.findMany({
            where: {
                locataire: { userId },
                mois: currentMonth,
                annee: currentYear,
                statut: { in: ['en cours', 'en retard'] },
            },
        });

        const totalLoyersAttente = loyersAttenteCeMois.reduce((acc, p) => acc + p.montant, 0);

        const loyersMensuels: number[] = [];
        for (let m = 1; m <= 12; m++) {
            const paiements = await prisma.paiementLoyer.findMany({
                where: {
                    locataire: { userId },
                    annee: currentYear,
                    mois: m,
                    statut: 'payé',
                },
            });
            const total = paiements.reduce((acc, p) => acc + p.montant, 0);
            loyersMensuels.push(total);
        }

        const paiements = await prisma.paiementLoyer.findMany({
            where: {
                locataire: { userId },
                mois: currentMonth,
                annee: currentYear,
            },
            include: {
                locataire: true,
                bail: {
                    include: { bien: true },
                },
            },
        });

        const paiementsFormatted = paiements.map(p => ({
            locataire: `${p.locataire.prenom} ${p.locataire.nom}`,
            avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${p.locataire.prenom}`,
            email: p.locataire.email,
            logement: p.bail.bien.adresse,
            periode: `${dayjs().format('MMMM YYYY')} (${dayjs(p.createdAt).format('D MMM')})`,
            montant: p.montant,
            quittance: p.statut === 'payé' ? 'Prête' : 'En cours',
            etat: p.statut.charAt(0).toUpperCase() + p.statut.slice(1),
        }));


        return {
            locatairesActifs,
            bauxEnCours,
            loyersEncaissesCeMois: {
                total: totalLoyersEncaisses,
                variation,
            },
            loyersEnAttenteCeMois: totalLoyersAttente,
            loyersMensuels,
            paiements: paiementsFormatted,
        };
    }
}
