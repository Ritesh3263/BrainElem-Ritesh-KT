## Prerequisites

Create namespace with: `kubectl create namespace translator`


Load middleware from translator namespaces by editing ingress. To do that, use k9s, find daemonset(:ds) with name traefik-ingress-controller and edit(e) by setting:

```
- --providers.kubernetesCRD.namespaces=translator
```

# Running

`skaffold -p local dev -d localhost:32000 --tail=false`
