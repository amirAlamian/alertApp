- first Generate the certificates(only needed once)

  `docker-compose -f create-certs.yml run --rm create_certs`

- start configured elastic node

  `docker-compose up -d`

- for set optional passwords use this command by exec inside container
  
  `bin/elasticsearch-setup-passwords   interactive --batch --url https://elasticsearch:9200`

  https://www.elastic.co/guide/en/elastic-stack-get-started/7.x/get-started-docker.html