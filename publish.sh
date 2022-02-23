rm index.zip
cd lambda
zip -X -r ../index.zip *
aws lambda update-function-code --function-name freemanDemoAskSkill --zip-file fileb://../index.zip