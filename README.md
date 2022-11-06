```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout my-site.key -out my-site.crt -config my-site.conf -passin pass:YourStrongPassword
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout my-site.key -out my-site.crt -config my-site.conf -passin pass:YourStrongPassword
```