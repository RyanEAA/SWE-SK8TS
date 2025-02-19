# SK8TS Marketplace
A modern dockerized marketplace

## How to Run React App
1. Install Docker on Personal Machine (Docker Desktop is best, it's easy and comes with Docker Compose)
- https://www.docker.com/get-started/


2. Clone Repo
- VS Code has an integrated git pull, simply select 'Clone Git Repository' in the Welcome menu, and paste: https://github.com/RyanEAA/SWE-SK8TS.git

OR (in terminal with desired directory open): 

```bash
git clone https://github.com/RyanEAA/SWE-SK8TS.git
```

3. Open cloned directory in VS Code

4. Open terminal window in VS Code (Make sure it is in repo directory)

5. To bring Development Stack Up, enter in terminal:
```bash
docker compose -f docker-compose-dev.yml up 
```

6. Terminal will provide link to react app in broswer (should be http://localhost:3000)

7. React container will live update changes in your browser as you make them, no need to bring down stack every time a change is made

8. To bring down stack after done developing:
```bash
ctrl+C in terminal
```

**FOR PROD**

Refer to 'Steps for Updating Server' in Workflow doc [here](https://docs.google.com/document/d/1IojwFd1zUnN7TnXTdWqdtCXtd6bfBKNjaWSX3H5igA0/edit?tab=t.0#heading=h.z0azt38yo1a7
)


