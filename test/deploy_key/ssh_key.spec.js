import { generate } from '../../lib/ssh_key';
import { expect } from 'chai';

describe('Generate SSH keys', () => {

    it('generate()', () => {
        return generate().then(ssh => {
            expect(ssh.private).to.exist;
            expect(ssh.public).to.exist;
        });
    });
});