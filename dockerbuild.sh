cd C:/Users/miky9/OneDrive/Desktop/Progetti Angular/frontend
docker build -t musicdraft-frontend:latest .
docker tag musicdraft-frontend:latest ziomike97/musicdraft-frontend:latest
docker push ziomike97/musicdraft-frontend:latest
