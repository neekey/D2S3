import generateSSH from 'generate-ssh';

function generate() {
    return new Promise((resolve, reject) => {
        generateSSH.generate({}, (err, ssh) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(ssh);
            }
        });
    });
}

export {
    generate
};
