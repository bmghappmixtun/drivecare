# API REST

Base URL locale : `http://localhost:4000`

Toutes les routes protegees utilisent :

```http
Authorization: Bearer <accessToken>
```

## Auth

### POST `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "Nadia",
  "locale": "fr"
}
```

### POST `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### POST `/auth/refresh`

```json
{
  "refreshToken": "..."
}
```

## Vehicles

- `GET /vehicles`
- `POST /vehicles`
- `GET /vehicles/:id`
- `PUT /vehicles/:id`
- `DELETE /vehicles/:id`
- `POST /vehicles/:id/mileage`

Payload creation :

```json
{
  "brand": "Peugeot",
  "model": "3008",
  "year": 2022,
  "licensePlate": "123 TU 456",
  "vin": "VF3...",
  "currentMileage": 42000,
  "fuelType": "diesel",
  "transmission": "automatic"
}
```

## Maintenance

- `POST /maintenance`
- `GET /maintenance/history`
- `GET /maintenance/stats`

Payload :

```json
{
  "vehicleId": "vehicle-id",
  "category": "oil_change",
  "performedAt": "2026-05-18T10:00:00.000Z",
  "mileage": 52000,
  "cost": 120,
  "garageName": "Garage Central",
  "notes": "Huile 5W30",
  "partsReplaced": ["filtre huile"]
}
```

## Rappels

- `GET /reminders`
- `PATCH /reminders/:id/done`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`

## Upload

`POST /files` en `multipart/form-data` :

- `file`
- `type`
- `vehicleId`
- `maintenanceRecordId`

## IA

### POST `/ai/assistant`

```json
{
  "vehicleId": "vehicle-id",
  "prompt": "J'entends un bruit metallique au freinage"
}
```

## Admin

Routes reservees aux utilisateurs `ADMIN` :

- `GET /admin/dashboard`
- `GET /admin/users`
