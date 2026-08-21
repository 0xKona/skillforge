# SkillForge REST API Schema

Base URL: `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}`

## Authentication

All endpoints require a valid Cognito JWT token in the `Authorization` header:

```
Authorization: Bearer <id_token>
```

The API uses a Cognito User Pool Authorizer. The `sub` claim from the JWT is used as the owner identifier for all data access control.

---

## Common Response Formats

### Success Response

```json
{
    "id": "uuid",
    "field": "value",
    ...
}
```

### List Response

```json
{
    "items": [...],
    "nextToken": "pagination-token-or-null"
}
```

### Error Response

```json
{
    "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request — invalid or missing input |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — authenticated but not the resource owner |
| 404 | Not Found — resource does not exist |
| 405 | Method Not Allowed |
| 500 | Internal Server Error |

---

## CV Endpoints

### `POST /cv`

Create a new CV.

**Request Body:**

```json
{
    "title": "My Professional CV",
    "description": "Software engineering CV for 2025",
    "version": 1,
    "cvContent": "{\"sections\": [...]}"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Display name for the CV |
| `description` | string | ❌ | Optional description |
| `version` | integer | ✅ | Version number (for optimistic locking) |
| `cvContent` | string (JSON) | ❌ | JSON-encoded sections and configuration |

**Response:** `201 Created`

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Professional CV",
    "description": "Software engineering CV for 2025",
    "version": 1,
    "cvContent": "{\"sections\": [...]}",
    "owner": "cognito-sub-uuid",
    "createdAt": "2025-08-21T10:00:00Z",
    "updatedAt": "2025-08-21T10:00:00Z"
}
```

---

### `GET /cv`

List all CVs for the authenticated user. Results are ordered by most recently updated.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `nextToken` | string | — | Pagination token from a previous response |

**Response:** `200 OK`

```json
{
    "items": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "title": "My Professional CV",
            "description": "Software engineering CV for 2025",
            "version": 1,
            "cvContent": "{\"sections\": [...]}",
            "owner": "cognito-sub-uuid",
            "createdAt": "2025-08-21T10:00:00Z",
            "updatedAt": "2025-08-21T10:00:00Z"
        }
    ],
    "nextToken": null
}
```

---

### `GET /cv/{id}`

Retrieve a single CV by ID. Returns 403 if the CV belongs to another user.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The CV ID |

**Response:** `200 OK`

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Professional CV",
    "description": "Software engineering CV for 2025",
    "version": 1,
    "cvContent": "{\"sections\": [...]}",
    "owner": "cognito-sub-uuid",
    "createdAt": "2025-08-21T10:00:00Z",
    "updatedAt": "2025-08-21T10:00:00Z"
}
```

**Error Responses:**
- `404` — CV not found
- `403` — CV belongs to another user

---

### `PUT /cv/{id}`

Update an existing CV. Only fields provided in the body are updated. The `updatedAt` timestamp is set automatically.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The CV ID |

**Request Body:** (all fields optional)

```json
{
    "title": "Updated CV Title",
    "description": "New description",
    "version": 2,
    "cvContent": "{\"sections\": [...]}"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ❌ | New title |
| `description` | string | ❌ | New description |
| `version` | integer | ❌ | New version number |
| `cvContent` | string (JSON) | ❌ | New sections configuration |

**Response:** `200 OK` — Returns the full updated CV object.

**Error Responses:**
- `403` — CV not found or belongs to another user

---

### `DELETE /cv/{id}`

Delete a CV. Only the owner can delete their CV.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The CV ID |

**Response:** `200 OK` — Returns the deleted CV object.

**Error Responses:**
- `403` — CV not found or belongs to another user

---

## Ingot Endpoints

### `POST /ingot`

Create a new Ingot.

**Request Body:**

```json
{
    "name": "University of Manchester",
    "type": "ingot_education",
    "content": "{\"fields\": {...}, \"billets\": [...]}"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | User-friendly name for the ingot |
| `type` | string | ✅ | Ingot type identifier (see below) |
| `content` | string (JSON) | ❌ | JSON-encoded fields and billets |

**Valid Ingot Types:**
- `ingot_education`
- `ingot_experience`
- `ingot_project`
- `ingot_skill`
- `ingot_certification`
- `ingot_personal_info`
- `ingot_personal_statement`
- `ingot_hobby`
- `ingot_reference`

**Response:** `201 Created`

```json
{
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "University of Manchester",
    "type": "ingot_education",
    "content": "{\"fields\": {...}, \"billets\": [...]}",
    "owner": "cognito-sub-uuid",
    "createdAt": "2025-08-21T10:00:00Z",
    "updatedAt": "2025-08-21T10:00:00Z"
}
```

---

### `GET /ingot`

List all Ingots for the authenticated user. Supports optional type filtering.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | — | Filter by ingot type (e.g., `ingot_education`) |
| `nextToken` | string | — | Pagination token from a previous response |
| `fields` | string | — | Comma-separated list of fields to return (e.g., `id,name,type,updatedAt`). Omit for all fields. |

**Response:** `200 OK`

```json
{
    "items": [
        {
            "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
            "name": "University of Manchester",
            "type": "ingot_education",
            "content": "{\"fields\": {...}, \"billets\": [...]}",
            "owner": "cognito-sub-uuid",
            "createdAt": "2025-08-21T10:00:00Z",
            "updatedAt": "2025-08-21T10:00:00Z"
        }
    ],
    "nextToken": null
}
```

**Notes:**
- Without `type` parameter: returns all ingots, ordered by most recently updated (uses `by-owner` GSI)
- With `type` parameter: returns only ingots of that type (uses `by-owner-type` GSI)
- With `fields` parameter: each item in the response only contains the specified fields (useful for lightweight list views like the Anvil interface)

---

### `GET /ingot/{id}`

Retrieve a single Ingot by ID.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The Ingot ID |

**Response:** `200 OK`

```json
{
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "name": "University of Manchester",
    "type": "ingot_education",
    "content": "{\"fields\": {...}, \"billets\": [...]}",
    "owner": "cognito-sub-uuid",
    "createdAt": "2025-08-21T10:00:00Z",
    "updatedAt": "2025-08-21T10:00:00Z"
}
```

**Error Responses:**
- `404` — Ingot not found
- `403` — Ingot belongs to another user

---

### `PUT /ingot/{id}`

Update an existing Ingot. Only fields provided in the body are updated.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The Ingot ID |

**Request Body:** (all fields optional)

```json
{
    "name": "Updated Ingot Name",
    "type": "ingot_experience",
    "content": "{\"fields\": {...}, \"billets\": [...]}"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ❌ | New name |
| `type` | string | ❌ | New type |
| `content` | string (JSON) | ❌ | New content |

**Response:** `200 OK` — Returns the full updated Ingot object.

**Error Responses:**
- `403` — Ingot not found or belongs to another user

---

### `DELETE /ingot/{id}`

Delete an Ingot. Only the owner can delete their ingot.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The Ingot ID |

**Response:** `200 OK` — Returns the deleted Ingot object.

**Error Responses:**
- `403` — Ingot not found or belongs to another user

---

## Data Models

### CV

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Auto-generated unique identifier |
| `title` | string | Display name |
| `description` | string | Optional description |
| `version` | integer | Version number for optimistic locking |
| `cvContent` | JSON string | Serialised sections array (see CvContent below) |
| `owner` | string | Cognito user sub (injected server-side) |
| `createdAt` | ISO 8601 | Auto-set on creation |
| `updatedAt` | ISO 8601 | Auto-set on every update |

### CvContent (within `cvContent` JSON string)

```json
{
    "sections": [
        {
            "sectionType": "ingot_education",
            "ingotIds": ["id1", "id2"],
            "billetIds": ["billet1", "billet2"],
            "sortBilletsBy": "date_desc",
            "customTitle": "Education",
            "isVisible": true
        }
    ]
}
```

### Ingot

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Auto-generated unique identifier |
| `name` | string | User-friendly name |
| `type` | string | Ingot type (e.g., `ingot_education`) |
| `content` | JSON string | Serialised fields and billets (see IngotContent below) |
| `owner` | string | Cognito user sub (injected server-side) |
| `createdAt` | ISO 8601 | Auto-set on creation |
| `updatedAt` | ISO 8601 | Auto-set on every update |

### IngotContent (within `content` JSON string)

```json
{
    "fields": {
        "schoolName": {
            "mandatory": true,
            "value": "University of Manchester",
            "inputType": "text"
        }
    },
    "billetFormat": "education",
    "billets": [
        {
            "id": "billet-uuid",
            "type": "education",
            "fields": {
                "grade": { "mandatory": false, "value": "First Class", "inputType": "text" }
            }
        }
    ]
}
```

---

## Security

- **Authentication:** Cognito User Pool JWT (ID token)
- **Authorisation:** Owner-based — users can only access their own resources
- **Encryption at rest (prod):** DynamoDB and S3 encrypted with Customer Managed KMS Key
- **Encryption in transit:** TLS 1.2+ (enforced by API Gateway)
- **CORS:** Enabled for all origins (configurable per stage)

---

## Rate Limits

API Gateway default throttling applies:
- 10,000 requests per second (burst)
- 5,000 requests per second (steady state)

Individual Lambda concurrency is unreserved (AWS account default).
