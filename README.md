# Serverless TODO

## Code organization
- Business Logic is separated from controller logic
- businesslogic -> src/businessLogic && src/dataLayer
- controllers -> src/lambda/http
- Request validation -> models/*

## JWT Verification via JWKS:
- JWT token from current is decoded and the property 'kid' is fetched.
- JWKS data gets fetched from endpoint for JWKS at Auth0 for the application
- data contains several certificates => fetch the certificate with the kid the same as the kid in the JWT of the user
- Surround certificate with some obligatory prefix and postfix and use it for verifying the token

## Misc
- Middleware middy is used to add CORS to the header
- Add distributed tracing via xray, had to workaround in code (DocumentClient not available for Capture) as well in serverless setup for missing permissions for role to add putTracingSegments on functions via using plugin for tracing 

