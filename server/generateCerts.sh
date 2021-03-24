#!/bin/bash
mkdir certs
openssl req -newkey rsa:2048 -nodes -keyout certs/key.pem -x509 -days 365 -out certs/certificate.pem
openssl x509 -text -noout -in certs/certificate.pem
