Get it running:

```bash
docker build -t simple-node-server .
docker run -it -p 80:80 simple-node-server
```

Then open [http://localhost:80](http://localhost:80) to see your app.


## To push to ECR

First make an ECR repository:

```bash
aws ecr create-repository --repository-name simple-node-server
```

Login to ECR:

First get your account ID:

```bash
aws sts get-caller-identity --query Account --output text
```

Then login. Assuming you're using the `us-west-2` region:

```bash
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com
```

Then build, tag, and push the image:

```bash
docker build -t simple-node-server .
docker image tag simple-node-server:latest $ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/simple-node-server:latest
docker image push $ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/simple-node-server:latest
```