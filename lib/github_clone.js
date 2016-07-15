import NodeGit from 'nodegit';
import tmp from 'tmp';
import path from 'path';
import fsExtra from 'fs-extra';
import Promise from 'bluebird';

function getSpecificCommit({ repoUrl, commit, ssh, targetDir }){

    return new Promise((resolve, reject) => {
        if(ssh) {
            const randomPathPrefix = path.resolve('/tmp', String(Math.random()));
            const publicPath = randomPathPrefix + 'id_rsa.pub';
            const privatePath = randomPathPrefix + 'id_rsa';

            try {
                fsExtra.writeFileSync(publicPath, ssh.public);
                fsExtra.writeFileSync(privatePath, ssh.private);
            }
            catch(err){
                return reject(err);
            }

            const cloneOption = {
                callbacks: {
                    certificateCheck: function() { return 1; },
                    credentials(url, userName) {
                        return NodeGit.Cred.sshKeyNew(userName, publicPath, privatePath, ssh.passphrase || '');
                    }
                }
            };

            resolve({
                option: cloneOption,
                publicPath,
                privatePath
            });
        }
        else {
            resolve({});
        }
    }).then(prepare => {
        return NodeGit.Repository.init(targetDir, 0).then(repository => {
            return NodeGit.Remote.create(repository, 'origin', repoUrl).then(remote => {

                return repository.fetch(remote, prepare.option || {}).then(() => {
                    return repository.getCommit(commit).then(commitObject => {
                        return NodeGit.Reset.reset(repository, commitObject, NodeGit.Reset.TYPE.HARD, {}).then(function() {
                            return 'success';
                        });
                    });
                });
            });
        }).finally(() => {
            prepare.publicPath && fsExtra.unlink(prepare.publicPath);
            prepare.privatePath && fsExtra.unlink(prepare.privatePath);
        });
    });
}

export {
    getSpecificCommit
};
