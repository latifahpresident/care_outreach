### To get started 

```bash
npm install
```

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgres://username:password@localhost:5432/care_outreach
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=care_outreach

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379

NODE_ENV=development
```

### Run docker

```bash
docker-compose up -d
```

### Create the database

```bash
docker exec -it postgres_local psql -U postgres -c "CREATE DATABASE care_outreach;"

### Generate initial migration

```bash
npm run migration:generate -- src/database/migrations/InitSchema

# Run migrations
npm run migration:run
```

### Start the app

```bash
npm run start:dev
