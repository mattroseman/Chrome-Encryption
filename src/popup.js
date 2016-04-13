$(document).ready(function() {
    console.log("popup.js started");
    openpgp.initWorker({path: "openpgp_es5/openpgp.worker.min.js"});
    openpgp.config.aead_protect = true;
    console.log("openpgp loaded");

    var key = generate_keys("matt", "mroseman95@gmail.com", "2048", "p@ssw0rd");
    var pubkey = key.publicKeyArmored;
    var privkey = key.privateKeyArmored;

    console.log("openpgp keys created");
    console.log("public key:\n" + pubkey);
    console.log("private key:\n" + privkey);

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
            encrypted = ciphertext;
        });

        console.log("Encrypted Message:" + encrypted);

        $('#plaintext-msg').val(encrypted);
    });
});

function generate_keys(user, email, bits, pass) {
    var temp_key;

    var options = {
        userIds: [{name: user, email: email}],
        numBits: bits,
        passphrase: pass
    };

    openpgp.generateKey(options).then(function(new_key) {
        temp_key = new_key;
    });

    return temp_key;
}
