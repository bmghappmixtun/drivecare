# DriveCare

DriveCare est un monorepo TypeScript pour une application moderne de gestion d'entretien automobile : API REST, web app responsive/PWA, application mobile Android/iOS, schéma PostgreSQL/Prisma, Docker, CI et documentation.

Le nom produit est centralisé via `APP_CONFIG` dans `packages/shared/src/config.ts` pour pouvoir passer facilement à AutoCare, MyGarage, CarMaint ou Garage+.

## Stack

- API : Node.js, Express, Prisma, PostgreSQL, JWT, Zod, Vitest
- Web : Next.js App Router, React, responsive design, PWA manifest
- Mobile : Expo React Native, React Navigation, TypeScript
- Shared : types, constantes métier, règles d'entretien, i18n
- DevOps : Docker Compose, GitHub Actions

## Démarrage local

```bash
npm install
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d db
npm run prisma:migrate --workspace @drivecare/api
npm run dev:api
```

Dans d'autres terminaux :

```bash
npm run dev:web
npm run dev:mobile
```

URLs par défaut :

- API : `http://localhost:4000/health`
- Web : `http://localhost:3000`
- Prisma Studio : `npm run prisma:studio --workspace @drivecare/api`

## Modules livrés

- Auth email/password avec JWT access + refresh, bcrypt, rôles utilisateur/admin
- Gestion véhicules, kilométrage, entretiens, rappels, dépenses, fichiers, notifications
- Planification intelligente par date et kilométrage
- Assistant IA prêt à brancher pour symptômes, coûts et recommandations
- Admin API pour utilisateurs, statistiques et logs applicatifs
- Web dashboard, véhicules, historique, notifications, profil et admin
- Mobile dashboard, véhicules, entretien, notifications et paramètres

## Commandes utiles

```bash
npm run build
npm run test
npm run lint
npm run docker:api --workspace @drivecare/api
```

## Déploiement

1. Provisionner PostgreSQL sur Supabase ou AWS RDS.
2. Configurer les variables `.env`.
3. Exécuter les migrations Prisma.
4. Déployer `apps/api` en container.
5. Déployer `apps/web` sur Vercel, AWS Amplify ou container Next.js.
6. Publier `apps/mobile` via EAS Build.

## Sécurité

Le projet inclut validation Zod, Helmet, CORS restrictif, rate limiting, hash bcrypt, JWT séparés, rôles, pagination, isolation par `userId`, et structure prête pour stockage cloud sécurisé.
