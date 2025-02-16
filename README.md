# SK8TS Marketplace
A modern dockerized marketplace

## How to Run App
1. Install Docker on machine
- https://www.docker.com/get-started/

2. Git Clone repo
```bash
https://github.com/RyanEAA/SWE-SK8TS.git
```

3. Move into the directory of the repo
```bash
cd SWE-SK8TS
```

4. Build Docker Image
```bash
docker build -t nginx-react-image:latest .
```

5.  Build Docker Container
**FOR DEV/LOCAL MACHINE** 
```bash
docker run -p 8080:80 --name nginx-react-container nginx-react-image:latest
```

**FOR PROD**
```bash
docker run -p 80:80 --name nginx-react-container nginx-react-image:latest
```

6. Check App
**RUNNING LOCAL**
Open Docker and click on the port it's running on
check port http://localhost:8080/

**RUNNING ON SERVER**
check server IP