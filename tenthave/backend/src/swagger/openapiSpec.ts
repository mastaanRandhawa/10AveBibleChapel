/**
 * OpenAPI 3.0 spec for Swagger UI (/api-docs).
 * Extend paths here as the API grows.
 */
export function buildOpenApiSpec(): Record<string, unknown> {
  return {
    openapi: "3.0.3",
    info: {
      title: "10th Ave Bible Chapel API",
      version: "1.0.0",
      description:
        "REST API for calendar, announcements, sermons, prayer requests, auth, and contact.",
    },
    servers: [
      { url: "/", description: "Current host" },
    ],
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Calendar" },
      { name: "Announcements" },
      { name: "Prayer requests" },
      { name: "Sermons" },
      { name: "Users" },
      { name: "Contact" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: { error: { type: "string" } },
        },
        UserPublic: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            role: { type: "string", enum: ["MEMBER", "ADMIN"] },
            isApproved: { type: "boolean" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            token: { type: "string" },
            user: { $ref: "#/components/schemas/UserPublic" },
          },
        },
      },
    },
    paths: {
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password", "name"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                    name: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Created",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
              },
            },
            "400": { description: "Validation / duplicate email" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
              },
            },
            "401": { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Current user",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/UserPublic" } },
              },
            },
            "401": { description: "Unauthorized" },
          },
        },
        patch: {
          tags: ["Auth"],
          summary: "Update profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Updated" },
            "401": { description: "Unauthorized" },
          },
        },
      },
      "/api/calendar": {
        get: {
          tags: ["Calendar"],
          summary: "List calendar events",
          responses: { "200": { description: "List of events" } },
        },
        post: {
          tags: ["Calendar"],
          summary: "Create event (admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            "201": { description: "Created" },
            "401": { description: "Unauthorized" },
            "403": { description: "Admin only" },
          },
        },
      },
      "/api/calendar/{id}": {
        get: {
          tags: ["Calendar"],
          summary: "Get event by id",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "Event" }, "404": { description: "Not found" } },
        },
        put: {
          tags: ["Calendar"],
          summary: "Update event (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "Updated" }, "403": { description: "Admin only" } },
        },
        delete: {
          tags: ["Calendar"],
          summary: "Delete event (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "204": { description: "Deleted" }, "403": { description: "Admin only" } },
        },
      },
      "/api/announcements": {
        get: {
          tags: ["Announcements"],
          summary: "List announcements",
          responses: { "200": { description: "OK" } },
        },
        post: {
          tags: ["Announcements"],
          summary: "Create announcement (admin)",
          security: [{ bearerAuth: [] }],
          responses: { "201": { description: "Created" }, "403": { description: "Admin only" } },
        },
      },
      "/api/announcements/{id}": {
        get: {
          tags: ["Announcements"],
          summary: "Get announcement",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
        },
        put: {
          tags: ["Announcements"],
          summary: "Update (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        delete: {
          tags: ["Announcements"],
          summary: "Delete (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "204": { description: "Deleted" } },
        },
      },
      "/api/prayer-requests": {
        get: {
          tags: ["Prayer requests"],
          summary: "List prayer requests (approved users / admin)",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
        },
        post: {
          tags: ["Prayer requests"],
          summary: "Submit prayer request (public)",
          responses: { "201": { description: "Created" } },
        },
      },
      "/api/prayer-requests/{id}": {
        get: {
          tags: ["Prayer requests"],
          summary: "Get one",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        put: {
          tags: ["Prayer requests"],
          summary: "Update (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        delete: {
          tags: ["Prayer requests"],
          summary: "Delete (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "204": { description: "Deleted" } },
        },
      },
      "/api/sermons": {
        get: {
          tags: ["Sermons"],
          summary: "List sermons",
          responses: { "200": { description: "OK" } },
        },
        post: {
          tags: ["Sermons"],
          summary: "Create sermon (admin)",
          security: [{ bearerAuth: [] }],
          responses: { "201": { description: "Created" } },
        },
      },
      "/api/sermons/{id}": {
        get: {
          tags: ["Sermons"],
          summary: "Get sermon",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        put: {
          tags: ["Sermons"],
          summary: "Update (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        delete: {
          tags: ["Sermons"],
          summary: "Delete (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "204": { description: "Deleted" } },
        },
      },
      "/api/sermons/series/{seriesName}": {
        get: {
          tags: ["Sermons"],
          summary: "Sermons by series",
          parameters: [
            { name: "seriesName", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "List users (admin)",
          security: [{ bearerAuth: [] }],
          responses: { "200": { description: "OK" }, "403": { description: "Admin only" } },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        put: {
          tags: ["Users"],
          summary: "Update user (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "OK" } },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "204": { description: "Deleted" } },
        },
      },
      "/api/users/{id}/approval": {
        patch: {
          tags: ["Users"],
          summary: "Set approval (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { isApproved: { type: "boolean" } },
                },
              },
            },
          },
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/contact": {
        post: {
          tags: ["Contact"],
          summary: "Send contact form",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "Sent" }, "400": { description: "Bad request" } },
        },
      },
    },
  };
}
