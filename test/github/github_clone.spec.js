import { getSpecificCommit } from '../../lib/github_clone';
import { generate } from '../../lib/ssh_key';
import { addDeployKey, getDeployKeys, deleteDeployKey } from '../../lib/deploy_key';
import {
    access_token as accessToken,
    user
} from '../token.json';
import {
    repo,
    commit,
    privateRepo,
    privateCommit
} from './repo.json';
import { assert } from 'chai';
import fsExtra from 'fs-extra';
import path from 'path';


describe('Clone specific commit', () => {

    let targetDir = null;

    beforeEach(() => {
        targetDir = path.resolve('/tmp/', String(Math.random()));
    });

    afterEach(() => {
        fsExtra.removeSync(targetDir);
    });

    it('getSpecificCommit()', () => {

        const repoUrl = `https://github.com/${user}/${repo}.git`;
        return getSpecificCommit({
            repoUrl,
            commit,
            targetDir
        }).then(result => {
            assert.equal(result, 'success');
        });
    });

    it('getSpecificCommit() with ssh', () => {

        // create a new sshkey
        return generate().then(ssh => {
            return addDeployKey(accessToken, user, privateRepo, ssh.public, 'test').then(newDeployKey => {
                // add deploy key first
                const repoUrl = `git@github.com:${user}/${privateRepo}.git`;
                const commit = privateCommit;
                return getSpecificCommit({
                    repoUrl,
                    commit,
                    targetDir,
                    ssh: ssh
                }).then(result => {
                    assert.equal(result, 'success');
                    // delete all keys
                    return getDeployKeys(accessToken, user, privateRepo).then(keys => {
                        return keys.map(key => {
                            return deleteDeployKey(accessToken, user, privateRepo, key.id);
                        });
                    });
                });
            });
        });

    });
});