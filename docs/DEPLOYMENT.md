# Deploiement

## Supabase

1. Creer un projet Supabase.
2. Copier l'URL PostgreSQL dans `DATABASE_URL`.
3. Activer Supabase Storage pour `uploaded_files`.
4. Executer `npm run prisma:migrate --workspace @drivecare/api`.

## AWS

1. RDS PostgreSQL pour la base.
2. ECS/Fargate ou App Runner pour `apps/api`.
3. S3 pour factures, photos et cartes grises.
4. CloudFront + WAF pour exposition publique.
5. Secrets Manager pour JWT, DB et fournisseurs OAuth/IA.

## Web

Next.js peut etre deploye sur Vercel, Amplify, ECS ou une image Node.

Variables minimales :

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`

## Mobile

Configurer EAS :

```bash
npm install -g eas-cli
cd apps/mobile
eas build --platform all
```

Firebase Cloud Messaging doit etre connecte via Expo Notifications pour les push Android/iOS.
