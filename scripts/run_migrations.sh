
PG_CONNECTION="postgresql://postgres@localhost:6321/postgres"
PG_TEST_CONNECTION="postgresql://postgres@localhost:6321/test"

# create test database
psql "${PG_CONNECTION}" -q -c "CREATE DATABASE test"

# run all migration on postgres database
for file in */migrations/*; do
    FILENAME=$(basename "${file}")
    psql "${PG_CONNECTION}" -f ./"${file}"
    psql "${PG_CONNECTION}" -q -c "INSERT INTO migrations (file_name) VALUES('$FILENAME')"
    echo "File: $FILENAME successfully migrated to: $PG_CONNECTION"
done

# run all migration on test database
for file in */migrations/*; do
    FILENAME=$(basename "${file}")
    psql "${PG_TEST_CONNECTION}" -f ./"${file}"
    psql "${PG_TEST_CONNECTION}" -q -c "INSERT INTO migrations (file_name) VALUES('$FILENAME')"
    echo "File: $FILENAME successfully migrated to: $PG_TEST_CONNECTION"
done