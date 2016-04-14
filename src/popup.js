$(document).ready(function() {

    var pubkey, privkey;

    console.log("popup.js started");
    openpgp.initWorker({path: "openpgp_es5/openpgp.worker.min.js"});
    console.log("Web Worker:" + openpgp.getWorker());
    openpgp.config.aead_protect = true;
    console.log("openpgp loaded");

    if (pubkey == null || privkey == null) {

        var options = {
            userIds: [{name: "matt", email: "mroseman95@gmail.com"}],
            numBits: "2048",
            passphrase: "p@ssw0rd"
        };

        openpgp.generateKey(options).then(function(key) {
            pubkey = key.publicKeyArmored;
            privkey = key.privateKeyArmored;
        });
    }

    $('#encrypt').click(function() {
        plaintext = $('#plaintext-msg').val(); // the plaintext to encrypt
        var bitString = Uint8Array.from(plaintext); // bit representation of plaintext 
        var encrypted;
        options = {
            data: bitString,
            publicKeys: openpgp.key.readArmored(pubkey).keys,
            armor: false
        };

        openpgp.encrypt(options).then(function(ciphertext) {
            //encrypted = ciphertext.message.write(); // retruned as uint8array
            encrypted = ciphertext.packets.write();

            console.log("Encrypted Message:" + encrypted);

            $('#plaintext-msg').val(encrypted);
        });

    });
});

function generate_keys(user, email, bits, pass) {
    var temp_key;

    var options = {
        userIds: [{name: user, email: email}],
        numBits: bits,
        passphrase: pass
    };

    // js will move past this and return nothing
    openpgp.generateKey(options).then(function(new_key) {
        temp_key = new_key;
    });

    // show loading symbol until the keys are generated

    return temp_key;
}
