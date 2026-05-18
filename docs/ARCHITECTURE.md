# Architecture DriveCare

## Monorepo

- `apps/api` : API REST Express modulaire, Prisma, auth JWT, validation Zod.
- `apps/web` : Next.js responsive avec design system CSS, PWA manifest et composants reutilisables.
- `apps/mobile` : Expo React Native, navigation mobile Android/iOS, notifications push preparees.
- `packages/shared` : configuration produit, types metier, i18n, regles de planification.
- `infra/docker` : PostgreSQL et API containerisee.

## Backend

L'API separe les modules par domaine :

- `auth` : inscription, connexion, refresh token.
- `vehicles` : CRUD vehicules et historique kilometrique.
- `maintenance` : historique, depenses, generation automatique de rappels.
- `reminders` : prochaines echeances avec urgence kilometrique/date.
- `notifications` : in-app aujourd'hui, extension FCM/email demain.
- `files` : upload en memoire avec cle de stockage, pret pour Supabase/AWS S3.
- `ai` : facade assistant IA, remplacable par un fournisseur LLM.
- `admin` : dashboard et gestion utilisateurs avec role ADMIN.

## Donnees

Prisma modelise les tables demandees :

- `users`
- `vehicles`
- `maintenance_records`
- `reminders`
- `expenses`
- `notifications`
- `uploaded_files`
- `garages`
- `ai_requests`

Les index principaux couvrent `userId`, dates, statuts, vehicules, VIN et recherches admin.

## Securite

- Hash bcrypt cout 12.
- JWT access et refresh secrets separes.
- Refresh tokens stockes hashes et revocables.
- Validation Zod sur les payloads.
- Helmet, CORS, rate limiting.
- Isolation stricte par `userId` sur les modules utilisateur.
- Admin protege par role.

## Extensions prevues

- OAuth Google/Apple via module `auth`.
- FCM dans `notifications`.
- S3/Supabase Storage dans `files`.
- Abonnement premium avec tables `subscriptions` et `plans`.
- OBD2 Bluetooth cote mobile avec un module dedie.
- Fleet SaaS via organisations, teams et RBAC etendu.
