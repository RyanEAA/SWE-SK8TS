# SK8TS Marketplace
A modern dockerized marketplace

## How to Run React App
1. Install Docker on Personal Machine
- https://www.docker.com/get-started/


2. Clone Repo
- VS Code has an integrated git pull, simply select 'Clone Git Repository' in the Welcome menu, and paste: https://github.com/RyanEAA/SWE-SK8TS.git

OR: 

```bash
git clone https://github.com/RyanEAA/SWE-SK8TS.git
```

3. Open cloned directory in VS Code

4. Open terminal window in VS Code (Make sure it is in repo directory)

5. To bring Development Stack Up, enter in terminal:
```bash
docker compose -f docker-compose-dev.yml up 
```

6. Terminal will provide link to react app in broswer

7. React container will live update changes in your browser as you make them, no need to bring down stack every time a change is made

8. To bring down stack after done developing:
```bash
docker compose down
```

**FOR PROD**
