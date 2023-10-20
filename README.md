## Description

Online tool for learning process management. The system consists of several parts such as Learning Management System (LMS), Student information system(SIS) and Personal Development module. It's based on cognitive profiling and analysis of training needs managed by an AI.





## Setup

The platform can by run with one of the following tools:
- Kubernetes (K8s) (recommended for Linux)
- Docker Compose (recommended for Windows)

To run the full project locally it's recommended to have at least 8GB of RAM and 8 CPUs.

#### Steps 

After you clone this repository, login to the image registry: `docker login gitlab.elia.academy:5050` using your GitLab credentials.

Then follow the steps:

<details><summary>Steps for Kubernetes</summary>

##### Install:

* [MicroK8s](https://microk8s.io/) - Kubernetes(K8s)
* [Docker](https://www.docker.com/) - Containers runtime(executes and manages container images)
* [kubectl](https://kubernetes.io/docs/tasks/tools/) - Low-level command line to manage environments
* [Skaffold [v1.39.4]](https://skaffold.dev/) - Tool to handle the workflow for building, pushing and deploying
* [Kustomize](https://kustomize.io/) - Tool way to customize application(template-free) 
* [k9s](https://github.com/derailed/k9s) - Interface to manage environments

##### Then:

In commands below replace `ENV` with one of the following: [local,local-dev-evvo,stage-evvo,prod-evvo,dev,test,stage,prod]

In commands below replace `SKAFFOLD_PROFILE` with one of the following: [local,dev,local-dev-evvo,stage-evvo,prod-evvo,test,stage,prod-ch,prod-fr]


To prepere `MicroK8s`:

```bash
# Start MicroK8s
microk8s start;

# Confugure kubectl
microk8s.kubectl config view --raw > $HOME/.kube/config # Configure local kubectl to connect to Microk8s

# Create namespace
microk8s kubectl create namespace ENV;

# Enable community packages, on fresh installs only the core repository is enabled by default
microk8s enable community;

# Enable dns and traefik packages
microk8s enable dns traefik;

# Install Traefik Resource Definitions: - https://doc.traefik.io/traefik/providers/kubernetes-crd/
kubectl apply -f https://raw.githubusercontent.com/traefik/traefik/v2.8/docs/content/reference/dynamic-configuration/kubernetes-crd-definition-v1.yml

# Start local `registry` only for local development
microk8s enable registry:size=40Gi;

```

Then you need to expose the ingress on ports 80 and 443(optional) and load middlewares from other namespaces by editing ingress. To do that, use `k9s`, find `daemonset`(`:ds`) with name `traefik-ingress-controller` and edit(`e`) by setting:

```yaml
- --providers.kubernetesCRD.namespaces=ENV # To enable CRD eg. for middlewares(comma-seperated: dev,prod-fr etc.)

# NEW
# microk8s enable metallb:95.217.166.161-95.217.166.161 
# OLD ###############################################
- --entrypoints.web.address=:80 # Replace default 8080
- # only for HTTPS, ignore otherwise
- --entrypoints.websecure.address=:443

```

For `local` environment adjust `etc/hosts` by adding:

```
127.0.0.1	elia.lc
127.0.0.1	proxy.elia.lc
127.0.0.1	database-interface.elia.lc
127.0.0.1	search-engine-interface.elia.lc
```

Then use those paths in your browser to access the services.

</details>


<details><summary> Steps for Docker Compose </summary>

##### Install:

* [Docker](https://www.docker.com/).
* [Docker Compose](https://docs.docker.com/compose/install/)

</details>




## Development

<details><summary>Frontend</summary>

#### Translations

We are using https://www.i18next.com/

At the beggining we used a single `locales/<LANG>/translation.json` file for each language.

Now we are trying to get rid of those files and replace them with smaller modules for each part of the system For example:

- mySpace-myResults.json
- mySpace-virtualCoach.json
- ........

There is also a special file `common.json` wchich containes all the translations which are common and shared accros other views.

In order to use modularized tranlstionons use array with list of modules:

```js
// Use
const { t } = useTranslation(['mySpace-myResults', 'common']);
```

Then in side code always use name of the module and the uppercase key, for example:

```json
t("mySpace-myResults:PROCESSING RESULTS TRY AGAIN")
// ...
t("common:POWERED BY BRAINELEM")
```

The modules with translations must be exactly the same for all languages, so when making any change in: `EN/mySpace-myResults.json`. 
Please do the same for: `FR/mySpace-myResults.json` and `PL/mySpace-myResults.json`

If you were not provided with translations, and you are working on the file which has already been covered with translations use module name + uppercase:

`t("mySpace-myResults:HERE_NEW_TRANSLATION")`

This way it will be easy to spot this missing translation on the website. 
	
There are also special scripts for exporting and importing those modules into Exel files to make it easy to translate and import back or to add new languages.

##### Variables in translation

If you have some variables in your translations please use `{{foo}}` notation, example:

```js
t("sentinel-MyTeams-Results:{{selected}} OUT OF {{available}} USERS SELECTED", {selected: selec_num, available: ava_num})}
```

##### Translation for EDU

To implement alternative trnalsation for EDU, use `F_t` function. This will automatically add `EDU_` prefix for translation whenever using `EDU` pltform. Inside file with translations there must be both version of translations for example:
- MY_USERS: "My users"
- EDU_MY_USERS: "My students" 


</details>



<details><summary>Database</summary>

To use database interface(`Mongo Express`) go to:
- `localhost:8081` - for `docker-compose`` environment
- `http://database-interface.elia.lc` for K8S environment 

To see database structure you can also use:

- Models described at the bottom of Swagger documentation(see `API Documentation` below)
- Database graph after login as `root` user with password `Testing123!`

</details>

<details><summary>Backend documentation</summary>

#### Roles/Authorization/Permissions


Authorization in the system is based on [JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519) using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.

At first the goal was to follow `OAuth 2.0`, so the permissions int the system were based on `scopes` following the `<resource>:<action>:<id>` syntax.

After some time, we switched to static-role authorization, in which each user is assigned with one or more static roles (eg. trainer, librarian, etc). With this approach, we authorize users based on those static  roles.For example, only `librarian` role is able to accept/reject content in the Library, etc.

[Document](https://gitlab.elia.academy/root/elia/-/blob/dev/documentation/roles.md) with the list of all users' static  roles available in the system.

Additionally for some static roles eg. `Assistant`, we needed a way  to reduce some of the actions assigned by default to this role. That's why we added a property `permissions.<role_name>.disallowed.[action_name]` for each user, which allowed us to control actions for specific users.

Since 2023, platform has been divided into modules with associated permissions by `EVVO` team. Those permissions are now assigned to the users through dynamic roles(roleMaster). The new static role `Other` was introduced just to indicate that user is using dynamic roleMaster/permissions.

#### API Documentation 

To see automatically generated `Swagger/OpenAPI` API documentation use [development environment](https://dev.elia.academy/docs) or [evvo development environment](https://dev.evvo.elia.academy/docs). To enter it locally use `/docs`

If you want to enable such documentation on your local environment adjust conditions in `backend/server.js` to run `generate_swagger_documentation` function.

By default all routes will be added automatically by [express-oas-generator](https://github.com/mpashkovskiy/express-oas-generator)

When you want to add additional information to some actions its possible by adding simple comment above the function due to [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc):

```js
/**
 * @openapi
 * /api/v1/hello:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 */
app.get('/api/v1/hello', (req, res) => {
  res.send('Hello World!');
});
```

[Here](https://github.com/Surnet/swagger-jsdoc/tree/v6/docs) you can documentation and examples for v6 of this package.

For more details about parameters use official [Swagger documentation](https://swagger.io/docs/specification/describing-parameters/)

</details>




## Demo verison

To see demo version of the platform you can use one of the development environments (see `Environments` below).

For basic-authorization before entering the page use:
`root` username and `dev-password-placeholder` as password.

Password for all demo users is: `Testing123!`

<details><summary> List of demo usesrs </summary>

##### General 

- root
- ecomanager
- networkmanager
- cloudmanager `(not fully implemented)`

##### School Module

- modulemanager
- architect
- student1
- trainer1
- classmanager1
- librarian
- parent1
- inspector1

##### Training Module

- tmodulemanager
- trainingmanager1
- ttrainee1
- ttrainer1
- tlibrarian
- coordinator1
- partner1 (business client)

##### Cognitive Module(Sentinel)

- cmodulemanager

</details>

## Environments

#### BrainCore APP

Platform including modifications from EVVO team. It's being actively developed since 2023

- Development - `local.dev.evvo.elia.academy`
  - [Platform](https://local.dev.evvo.elia.academy)
  - [Database interface](https://local.dev.evvo.database-interface.elia.academy)
  - [Search-engine interface](https://local.dev.evvo.search-engine-interface.elia.academy)(disabled)
- Stage - `stage.braincore.app`
  - [Platform](https://stage.braincore.app)
  - [Database interface](https://stage.database-interface.braincore.app)
  - [Search-engine interface](https://stage.search-engine-interface.braincore.app)(disabled)
- Demo - `demo.brainelem.com`, `results.brainelem.com` - Used only to provide PDF reports for people who took part in callibration 
  - [Platform](https://demo.brainelem.com/)
  - [Database interface](https://demo.database-interface.brainelem.com/db/elia/users)
  - [Search-engine interface](https://demo.search-engine-interface.brainelem.com)(disabled)
- Production - `marketing.braincore.app`, `nemesis.braincore.app` etc.
  - [Platform](https://marketing.braincore.app/)
  - [Database interface](https://database-interface.braincore.app)
  - [Search-engine interface](https://demo.search-engine-interface.braincore.app)(disabled)
  
#### ELiA Academy
 
Platform without modifications from EVVO team. It was developed since 2021 until 2023.

- Development - `dev.elia.academy`
  - [Platform](https://dev.elia.academy)
  - [Database interface](https://database-interface.dev.elia.academy)
  - [Search-engine interface](https://search-engine-interface.dev.elia.academy)(disabled)
- Stage - `stage.elia.academy`
  - [Platform](https://stage.elia.academy)
  - [Database interface](https://stage.database-interface.elia.academy)
  - [Search-engine interface](https://stage.search-engine-interface.elia.academy)(disabled)
- Production CH - `ch.elia.academy`
  - [Platform](https://ch.elia.academy)
  - [Database interface](https://ch.database-interface.elia.academy)
  - [Search-engine interface](https://ch.search-engine-interface.elia.academy)(disabled)
- Production FR - `fr.elia.academy`
  - [Platform](https://fr.elia.academy)
  - [Database interface](https://fr.database-interface.elia.academy)
  - [Search-engine interface](https://fr.search-engine-interface.elia.academy)(disabled)

## Tests

Tests must be run against unmodified initial database.  

To run the tests go to `Usefull commands->Testing`

<details><summary> Backend </summary>

- Tests are based on [Jest](https://github.com/facebook/jest)  test runner and [supertest](https://github.com/visionmedia/supertest)(high-level abstraction layer)
- [Here](https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/) you can find simple examples for creating new tests.
- The tests are stored in `services/backend/tests`.
- You can see the examples of tests such as `content.test.js` and `user.test.js`.
- When changes are pushed to the repository those tests are run automatically

</details>
<details><summary> Frontend </summary>

- Test are based on [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)(provides virtual DOM) and  [Jest](https://github.com/facebook/jest)  test runner.
- [Here](https://create-react-app.dev/docs/running-tests/) you can find simple examples for creating new tests.
- The tests are stored in `services/frontend/src/<Component_name>.tst.js`.
- I only created test for main component inside `services/frontend/src/App.test.js` to make sure it's not crashing. 
- When changes are pushed to the repository those tests are run automatically

</details>




## Troubleshooting - common problems

<details><summary>General</summary>


<details><summary>Missing images and files for opportunities</summary>

Make sure that you have downoladed mentioned files from the cloud and inseted them in:
- `backend/public/content/images/cognitive`
- `backend/public/content/files/cognitive `

</details>

<details><summary> Emails are not sent - message-broker not working </summary>

Make sure there is enough disk space on your machine.

Running `sudo docker system prune -fa` may solve the problem.

</details>


<details><summary> Error when creating mapping for [...]</summary>

You must first remove the old mapping for `ElasticSearch`.

Can be done by running `sudo docker-compose exec task-executor curl -X DELETE search-engine:9200/contents` and restarting the `backend` service.

For `Kubernetes` just remove the volume eg. `sudo rm -r /mnt/data/local/search-engine` and then restart `search-engine` and `backend` service. 

</details>
</details>

<details><summary> Kubernetes</summary>

<details><summary>Images are not rebuilt after changes</summary>

If images are not rebuilt after changes, make sure your local registry has proper size, you can increase it by running:

```
microk8s disable registry;
microk8s enable registry:size=100Gi`
```

</details>

<details><summary>Starting application - Error checking cache</summary>

To solve problem change the access rights to shown files or remove them.
</details>

<details><summary> Starting application - Error when creating "STDIN": namespaces "ENV" not found</summary>

Just create missing namespace:

```bash
kubectl create namespace ENV;
```
</details>


<details><summary> Starting application  on server - Unable to connect to Kubernetes: getting client config for Kubernetes client </summary>

When seeing this error:

```
Unable to connect to Kubernetes: getting client config for Kubernetes client: error creating REST client config in-cluster: unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT must be defined
```

```bash
sudo snap unalias kubectl
sudo snap install kubectl --classic
```
</details>


<details><summary> Starting application on server - The connection to the server XXXXXXXXX was refused </summary>

When seeing this error:

`The connection to the server localhost:8080 was refused - did you specify the right host or port?`

To solve

```bash
microk8s kubectl config view --raw > $HOME/.kube/config
kubectl create namespace ENV;
```

OR

```
sudo microk8s.refresh-certs --cert ca.crt
sudo microk8s.refresh-certs --cert server.crt
```

</details>

<details><summary> Error: container container-name] is waiting to start: [image with missing tag] can't be pulled </summary>

It may happen when using `MicroK8s` for local development. The image we created is known to Docker. However, Kubernetes is not aware of the newly built image. This is because your local Docker daemon is not part of the MicroK8s Kubernetes cluster. We can export the built image from the local Docker daemon and “inject” it into the MicroK8s image cache like this:

```bash
docker save mynginx > myimage.tar
microk8s ctr image import myimage.tar
```

https://microk8s.io/docs/registry-private

</details>

<details><summary> Elasticsearch error: cluster_block_exception [FORBIDDEN/12/index read-only / allow delete (api)], flood stage disk watermark exceeded </summary>

When inside pod do `df -h` to see if there is at least 5% free disk space for ElasticSearch.

</details>
</details>


<details><summary> Docker Compose</summary>
<details><summary>Realtime changes are not affected on running container</summary>

If using `Docker Desktop` inside `Docker Desktop->Settings->General` disable `WSL 2 base engine` and rebuild the containers

</details>

<details><summary>FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory</summary>

If using `Docker Desktop` inside `Docker Desktop->Settings->Resources` adjust CPU and memory dedicated for the application. It's best to use 8GB of memeory and at least 4 CPUs. 



</details>

<details><summary>error during connect: this error may indicate that the docker daemon is not running: Get [....] open //./pipe/docker_engine: The system cannot find the file specified.</summary>

Make sure you are running command as administrator.

</details>
</details>





## Usefull commands

#### Kubernetes


<details><summary>Running</summary>

For loacal environment use:
```
skaffold -p local run -d localhost:32000
```

Otherwise replace `SKAFFOLD_PROFILE` and use:

```
skaffold -p SKAFFOLD_PROFILE run -d gitlab.elia.academy:5050/root/elia/SKAFFOLD_PROFILE
```

To stop/clean `skaffold -p SKAFFOLD_PROFILE delete;`


- `Frontend`: elia.lc
- `Backend`: http://elia.lc/api (docs: http://elia.lc/docs)
- `Search-engine interface:` search-engine-interface.elia.lc
- `Database interface`: database-interface.elia.lc
- `Proxy interface`: http://proxy.elia.lc (see `Treafik dashboard setup`)


</details>

<details><summary>Maintenance</summary>


By default while deploying new changes the services should have no downtime.
In order to do some changes on the server, it's possible to display maintenance page by running:

```bash
# Do it inside `.maintenance` directory
skaffold -p SKAFFOLD_PROFILE run -d gitlab.elia.academy:5050/root/elia/maintenance
```

To disable maintainence page run:

```bash
## Do it inside `.maintenance` directory
skaffold -p SKAFFOLD_PROFILE delete
```

</details>


<details><summary>Monitoring</summary>


#### Logs

```bash
k9s
```

Press `Shift`+`:` and write:
- **pods** - eg. to see logs of container, pick one `pod` with `Enter` and then presss `l` to see logs. Use numbers `1-5` to change the time limit
- **services** - eg. to see on which port the `pod` is being exposed
- **deployments** / **daemonsets** - eg. to find internal `IP` of the pod
 

##### Prometheus and Grafana 

- https://ch.grafana.elia.academy/login
- https://ch.prometheus.elia.academy/

1. Enable `Prometheus` and `Grafana` plugins:

```bash
microk8s enable prometheus
```

2. Load middlewares from monitoring namespace by editing ingress. To do that, use `k9s`, find `daemonset`(`:ds`) with name `traefik-ingress-controller` and edit(`e`) by adding `monitoring` namespace:

`--providers.kubernetesCRD.namespaces=monitoring,<your_other_namespaces>`

3. Copy and adjust secret:

```bash
cp .monitoring/k8s/local/main-secret.yaml .monitoring/k8s/SKAFFOLD_PROFILE
```

4. Go to `.monitoring` and run `skaffold -p SKAFFOLD_PROFILE run`


</details>


<details><summary>Database</summary>

To remove all data in database and search-engine just run:

```bash
sudo rm -r /mnt/data/local/database;
sudo rm -r /mnt/data/local/search-engine;
```

And then restart the `database`, `backend`, `search-engine` services.


<details><summary>Backups</summary>

Replace `ENV` can be on of the following: [local, dev,stage,prod]

#### Create backup

```bash
kubectl -n ENV exec $(kubectl -n ENV get pods | grep database | grep -v interface | awk "{print \$1}") -- mongodump -d elia -u elia -p Testing123! -o backups;
```

Copy backup from container into local machine:

```bash
kubectl cp ENV/$(kubectl -n ENV get pods | grep database | grep -v interface | awk "{print \$1}"):backups backups
```

#### Restore backup

Copy files from local machine into container

```bash
kubectl cp backups ENV/$(kubectl -n ENV get pods | grep database | grep -v interface | awk "{print \$1}"):backups
```

Import/restore backup:

```bash
kubectl -n ENV exec $(kubectl -n ENV get pods | grep database | grep -v interface | awk "{print \$1}") -- mongorestore -d elia -u elia -p Testing123! backups/elia
```


</details>

</details>



<details><summary>Testing</summary>

<details><summary>Backend</summary>

Run all tests: 
```
kubectl -n local exec $(kubectl -n local get pods | grep backend | awk "{print \$1}") -- npm test -- --runInBand --detectOpenHandles --forceExit
```

Run tests wit `foo` name:

```bash
kubectl -n local exec $(kubectl -n local get pods | grep backend | awk "{print \$1}") -- npm test -- foo
```

</details>

<details><summary>Frontend</summary>

```bash
kubectl -n local exec $(kubectl -n local get pods | grep frontend | awk "{print \$1}") -- npm test -- --watchAll=false
```

To update snapshots:

```bash
kubectl -n local exec $(kubectl -n local get pods | grep frontend | awk "{print \$1}") -- npm run update-snapshot
```

Other usefull commands:

```bash
npm test -t test_name
```

</details>


</details>



<details><summary>Deployment</summary>

<details><summary>Generate deployment token</summary>

First generat your username/password in `Project->Settings->Repoistory->Deployment Tokens`
Then use it to clone repo and configure registry.


</details>

<details><summary>Adjust secrets</summary>

For non-local profiles - you must copy and adjust secrets:

```
cp .secrets/k8s/local/main-secret.yaml .secrets/k8s/SKAFFOLD_PROFILE
cp .secrets/k8s/local/basic-auth-secret.yaml .secrets/k8s/SKAFFOLD_PROFILE
```

</details>

<details><summary>Container rigistry setup</summary>

If you are not using local registry(`microk8s enable registry`), you must [connect to remote private rigistry](https://microk8s.io/docs/registry-private) by running `docker login gitlab.elia.academy:5050;`. Then adjust  `/var/snap/microk8s/current/args/containerd-template.toml` by adding:

```toml
# 'plugins."io.containerd.grpc.v1.cri".registry' contains config related to the registry
[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "${SNAP_DATA}/args/certs.d"
  [plugins."io.containerd.grpc.v1.cri".registry.configs."gitlab.elia.academy:5050".auth]
    auth = "here_put_the_value_from ~/.docker/config.json"
```

Run `microk8s stop; microk8s start` to apply the changes.

</details>

<details><summary>Certificates setup</summary>

This is only for deployed environment which require `HTTPS`. Intall:

* [helm](https://helm.sh/docs/intro/install/) - Package manager for K8s
* [cert-manager](https://cert-manager.io/docs/installation/helm/)

Then go to services/proxy/certificates and run

```bash
kubectl apply -f cluster-issuer.yaml # Only once on server
kubectl apply -f your-certificates.yaml
```
</details>

<details><summary>External services</summary>

External services[Optional]:
* https://gitlab.elia.academy/root/elia-algorithms
* https://gitlab.elia.academy/root/elia-blockchain
</details>

<details><summary>Ingress for external projects</summary>

When adding ingresses for externall projects, eg. mail server `mailu`, please remmember about:

```yaml
kubernetes.io/ingress.class: traefik
traefik.ingress.kubernetes.io/router.tls: "true"
```
</details>

<details><summary>Treafik dashboard setup [optional] </summary>

For local development just go to `localhost:8080`

For deployments you must edit `daemonset` with name `traefik-ingress-controller` and set:

```yaml
--api.insecure=true
--api.dashboard=true
```

Edit `traefik-ingress-service` and add:

```yaml
  ports:
  - name: admin
    port: 8080
    protocol: TCP
    targetPort: 8080
  - name: web
    port: 80
    protocol: TCP
    targetPort: 80
  - name: websecure
    port: 443
    protocol: TCP
    targetPort: 443
```

And then create a new ingress for dashboard, eg for stage.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: elia-poxy-ingress
  namespace: traefik
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  rules:
    - host: proxy.stage.elia.academy
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: traefik-web-ui
                port: 
                  number: 8080
  tls:
    - hosts:
      - proxy.stage.elia.academy
      secretName: elia-dev-certificates

```
</details>

</details>





#### Docker Compose

<details><summary> Running </summary>


**All the commands below should be run in the main project directory, if needed run them as administrator**

To start the project(it will build the containers if missing)

```bash
docker-compose up -d
```

- `Frontend`: http://localhost
- `Backend`: http://localhost/api (docs: http://localhost/docs)
- `Search-engine interface: `http://localhost:5601
- `Database interface`: http://localhost:8081
- `Proxy interface`: http://localhost:8090


Most of the changes inside applications code will be reflected automatically so you only need to pull the changes from the repository. 

In case of any changes in `Dockerfile`, packages or environment you have to rebuild and restart the image eg.:

```
docker-compose build frontend;
docker-compose up -d frontend
```


To stop all the services:

```bash
docker-compose down
```


To stop single service:

```bash
docker-compose stop frontend
```

To stop all the services and remove the volumes(database):

```bash
docker-compose down -v
```
</details>





<details><summary>Monitoring</summary>



```bash
docker-compose logs;
docker-compose logs backend;
```

</details>


<details><summary> Development </summary>

To get inside the container with a `bash` session you can start the stack with:

```console
docker-compose exec backend bash
docker-compose exec frontend bash
```

</details>

<details><summary>Database</summary>

<details><summary> Database removal </summary>


```bash
docker-compose down -v
```

</details>


<details><summary> Database Migrations</summary>

#### Single command

Example of removing `tips` for all users that already has at least one tip:

```bash
docker exec -i $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}") mongo -u elia -p Testing123! --eval 'db.users.update({tips: { $exists: true, $not: {$size: 0} } },{$set:{"tips": []}}, {multi: true});' elia
```

#### Multiple commands

Prepare a file `script.js` on the host machine with all your commands, and do:

```bash
docker cp ./script.js $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}"):/
docker exec -it $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}") bash;
mongo elia -u elia -p Testing123! < script.js
```

</details>

<details><summary> Database Backups</summary>


#### Create

Create backup

```bash
docker exec $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}") mongodump -d elia -u elia -p Testing123! -o backups
```

Copy backup from container into local machine:

```bash
docker cp $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}"):/backups .
```
#### Restore

Copy files from local machine into container

```bash
docker cp ./backups $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}"):/
```

(on Microsoft Windows: better to manually copy Database Container ID with ```docker ps```)

Import/restore backup:

```bash
docker exec $(docker ps | grep elia/database | grep -v interface  | awk "{print \$1}") mongorestore -d elia -u elia -p Testing123! backups/elia
```

</details>

</details>


<details><summary> Testing </summary>

<details><summary> Running backend tests  </summary>

```bash
docker-compose exec backend npm test -- --runInBand --detectOpenHandles --forceExit
```

To run only test with matching name:
```
docker-compose exec backend npm test -- name 
```

</details>

<details><summary> Running frontend tests  </summary>

```bash
docker-compose exec frontend npm test
```

To update snapshots:

```bash
docker-compose exec frontend npm run update-snapshot
```

Other usefull commands that can be used in `package.json`:

```bash
react-scripts test -t test_name
```


</details>

</details>


#### General

<details><summary> How to download latest backup</summary>

```bash
scp adrian@159.69.151.17:/home/adrian/backups/backups/elia-ch-database/$(ssh adrian@159.69.151.17 'ls -t /home/adrian/backups/backups/elia-ch-database | head -1') ./
```
</details>

<details><summary> Update base images in private registry</summary>
```bash
# Download base image
docker pull node:18.16.0-alpine3.17
# Find id
docker image ls
# Tag image
docker image tag 6f44d13dd258 gitlab.elia.academy:5050/root/elia/node:18.16.0-alpine3.17
# Push image
docker image push gitlab.elia.academy:5050/root/elia/node:18.16.0-alpine3.17
```

</details>

