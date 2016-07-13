import GitHubApi from 'github';

function getDeployKeys(accessToken, user, repo) {
    const github = new GitHubApi({
        Promise: Promise,
        //followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
        timeout: 5000
    });

    github.authenticate({
        type: 'oauth',
        token: accessToken
    });

    return github.repos.getKeys({
        repo: repo,
        user: user
    });
}

function addDeployKey(accessToken, user, repo, sshKey, sshKeyTitle) {
    const github = new GitHubApi({
        Promise: Promise,
        //followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
        timeout: 5000
    });

    github.authenticate({
        type: 'oauth',
        token: accessToken
    });

    return github.repos.createKey({
        repo: repo,
        user: user,
        title: sshKeyTitle,
        key: sshKey,
        read_only: true
    });
}

function deleteDeployKey(accessToken, user, repo, keyId) {
    const github = new GitHubApi({
        Promise: Promise,
        //followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
        timeout: 5000
    });

    github.authenticate({
        type: 'oauth',
        token: accessToken
    });

    return github.repos.deleteKey({
        repo: repo,
        user: user,
        id: keyId,
    });
}

export {
    addDeployKey,
    deleteDeployKey,
    getDeployKeys
};
