# GraphQL Authentication API with NestJS

This project is a GraphQL-based API developed with NestJS that provides user authentication and authorization functionality. It includes layers from the API layer to the database, and it uses PostgreSQL as the database engine. The authentication is based on JSON Web Tokens (JWT).

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (Make sure you have a running PostgreSQL instance)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/abhiNodeDev/nest_task
    cd nest_task
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

### Configuration

Update the **config.ts** file with the variables and then run the project

### Running the Application

```bash
pnpm start
```

The GraphQL API will be available at http://localhost:3000/graphql.

### Testing

```bash
pnpm test
```

## Project Structure

The project follows the Onion / Hexagonal architecture with separate layers:

- **src/app:** Contains the application layer (controllers, resolvers, services).
- **src/domain:** Contains the domain layer (DTOs, input types, services).
- **src/infrastructure:** Contains the infrastructure layer (database models).

## Technologies Used

- NestJS
- PostgreSQL
- GraphQL
- TypeORM
- Jest
