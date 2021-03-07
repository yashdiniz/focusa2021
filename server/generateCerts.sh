#!/bin/bash
mkdir certs
openssl req -newkey rsa:2048 -nodes -keyout certs/key.pem -x509 -days 365 -out certs/certificate.pem
openssl x509 -text -noout -in certs/certificate.pem
openssl pkcs12 -inkey certs/key.pem -in certs/certificate.pem -export -out certs/certificate.p12 # gyroscope: subject to change
openssl pkcs12 -in certs/certificate.p12 -noout -info

