import { addDeployKey, getDeployKeys, deleteDeployKey } from '../../lib/deploy_key';
import { generate } from '../../lib/ssh_key';
import { assert } from 'chai';
import { access_token as accessToken, user, repo } from '../token.json';

describe('Deploy keys', () => {

    afterEach(() => {
        return getDeployKeys(accessToken, user, repo).then(keys => {
            return keys.map(key => {
                return deleteDeployKey(accessToken, user, repo, key.id);
            });
        });
    });

    it('addDeployKey()', () => {

        return getDeployKeys(accessToken, user, repo).then(keys => {
            const originalKeyLength = keys.length;
            const sshKeyTitle = 'ssh_key_' + Math.random();

            return generate().then(ssh => {
                return addDeployKey(accessToken, user, repo, ssh.public, sshKeyTitle).then(newKey => {
                    assert.isNumber(newKey.id, 'new key has a id');

                    // key in github seems will get rid of the last part of user@xxxx
                    assert.equal(newKey.key, ssh.public.split(/\s/).reduce((combo, item, index) => {
                        if(index == 0){
                            return combo + item + ' ';
                        }
                        else if(index == 2){
                            return combo;
                        }
                        else {
                            return combo + item;
                        }
                    }, ''), 'the key will be equal to what is given');

                    return getDeployKeys(accessToken, user, repo).then(currentKeys => {
                        assert.equal(currentKeys.length, originalKeyLength + 1, 'the amount of keys should be increased');

                        return deleteDeployKey(accessToken, user, repo, newKey.id).then(() => {
                            return getDeployKeys(accessToken, user, repo).then(finalKeys => {
                                assert.equal(finalKeys.length, originalKeyLength);
                                finalKeys.forEach(key => {
                                    assert.notEqual(key.id, newKey.id);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});