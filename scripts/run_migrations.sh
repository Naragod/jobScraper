
PG_CONNECTION="postgresql://postgres@localhost:6321/postgres"

for file in */migrations/*; do
    FILENAME=$(basename "${file}")
    psql "${PG_CONNECTION}" -f ./"${file}"
    psql "${PG_CONNECTION}" -q -c "INSERT INTO migrations (file_name) VALUES('$FILENAME')"
    echo "File: $FILENAME successfully migrated"
done