import S3 from 's3';
import Promise from 'bluebird';

function createClient({accessKeyId, secretAccessKey, endpoint}, options = {}){
    options = {
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
    };

    return  S3.createClient({
        ...options,
        s3Options: {
            accessKeyId,
            secretAccessKey,
            endpoint,
            region: ""
        }
    });
}

// todo: consider to use this knox https://github.com/Automattic/knox to implement upload file list
function uploadDir({accessKeyId, secretAccessKey, endpoint, localDir, s3Bucket, s3Dir}, options) {
    const client = createClient(arguments[0], options);
    const uploadParams = {
        localDir: localDir,
        s3Params: {
            Bucket: s3Bucket,
            Prefix: s3Dir,
            ACL: 'public-read'
        }
    };

    return new Promise((resolve, reject) => {
        const uploader = client.uploadDir(uploadParams);
        const progress = [];
        uploader.on('error', reject);
        uploader.on('progress', () => {
            progress.push({
                amount: uploader.progressAmount,
                total: uploader.progressTotal
            });
        });
        uploader.on('end', () => {
            resolve(progress);
        });
    });
}

function deleteDir({accessKeyId, secretAccessKey, endpoint, s3Bucket, s3Dir}, options) {
    const client = createClient(arguments[0], options);
    const deleteParams = {
        Bucket: s3Bucket,
        Prefix: s3Dir
    };

    return new Promise((resolve, reject) => {
        const deleter = client.deleteDir(deleteParams);
        const progress = [];
        deleter.on('error', reject);
        deleter.on('progress', () => {
            progress.push({
                amount: deleter.progressAmount,
                total: deleter.progressTotal
            });
        });
        deleter.on('end', results => {
            resolve({
                results,
                progress
            });
        });
    });
}

export {
    uploadDir,
    deleteDir
}