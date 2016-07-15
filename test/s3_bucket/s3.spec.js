import { uploadDir, deleteDir } from '../../lib/s3_uploader';
import { assert } from 'chai';
import path from 'path';
import { accessKeyId, secretAccessKey, endpoint, bucket } from './s3.json';

const localDir = path.resolve(__dirname, 'upload_dir');
const s3Dir = 'test';

describe('Upload files to S3', () => {

    afterEach(() => {
        return deleteDir({
            accessKeyId,
            secretAccessKey,
            endpoint,
            s3Bucket: bucket,
            s3Dir
        });
    });

    it('uploadDir()', () => {
        return uploadDir({
            accessKeyId,
            secretAccessKey,
            endpoint,
            s3Bucket: bucket,
            localDir,
            s3Dir
        }).then(progress => {
            assert.isArray(progress);
        });
    });
});