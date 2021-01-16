#!/bin/sh
aws s3 cp build/public s3://$S3_BUCKET_NAME/$INSTANCE_REGION_ALIAS/ --recursive --cache-control "max-age=2592000,public" --acl "public-read" --exclude "*.gz" --exclude "*.br" --metadata origin=$INSTANCE_REGION
