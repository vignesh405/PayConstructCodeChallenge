kubectl apply -f mongo_service.yaml
export MONGO_IP=$(kubectl get svc mymongo -o jsonpath='{ $.spec.clusterIP }')
echo $MONGO_IP
sed "s/MONGO_IP/${MONGO_IP}/g" web-deployment.yaml >> web-service.yaml
kubectl apply -f web-service.yaml
rm -rf web-service.yaml
