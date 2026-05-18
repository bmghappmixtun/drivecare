# Deploiement cloud gratuit pour tester

Cette configuration evite les problemes locaux en utilisant :

- Vercel pour `apps/web`
- Render pour `apps/api`
- Supabase pour PostgreSQL et Storage
- Firebase plus tard pour les notifications push
- Expo Go pour tester le mobile

## 1. Mettre le projet sur GitHub

Creer un depot GitHub puis envoyer ce dossier. Vercel et Render pourront lire le meme depot.

## 2. Supabase

1. Creer un projet Supabase.
2. Ouvrir `Project Settings > Database > Connection string`.
3. Copier :
   - `DATABASE_URL` : pooler transaction/session pour l'application.
   - `DIRECT_URL` : connexion directe pour les migrations Prisma.
4. Garder le mot de passe secret.

Les docs Supabase/Prisma recommandent d'utiliser les connection strings Supabase adaptees a Prisma, notamment pooled pour l'application et directe pour les migrations.

## 3. Render API

1. Dans Render, choisir `Blueprint`.
2. Selectionner le depot GitHub.
3. Render lit `render.yaml`.
4. Renseigner les variables :
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `WEB_ORIGIN=https://ton-app.vercel.app`
5. Apres creation, ouvrir l'URL `/health`.

## 4. Migrations Prisma

Pour appliquer la base :

```bash
npm install --workspace @drivecare/api --include-workspace-root
npm run prisma:generate --workspace @drivecare/api
npm run prisma:migrate --workspace @drivecare/api
```

Si tu veux eviter localement, on peut aussi ajouter un job Render dedie aux migrations.

## 5. Vercel Web

1. Importer le meme depot GitHub dans Vercel.
2. Framework : Next.js.
3. Root directory : laisser la racine du monorepo.
4. Vercel utilise `vercel.json`.
5. Ajouter la variable :
   - `NEXT_PUBLIC_API_URL=https://ton-api.onrender.com`

## 6. Mobile

Pour tester sans build cloud :

```bash
npm run dev:mobile
```

Puis scanner le QR code avec Expo Go. Pour cloud build, utiliser Expo EAS plus tard.
