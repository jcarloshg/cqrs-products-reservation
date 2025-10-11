FROM postgres:16.12

ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=pattern_criteria_db

# Copy migration scripts to be executed automatically on container startup
COPY migrations/2025-10-11/*.sql /docker-entrypoint-initdb.d/

EXPOSE 5432