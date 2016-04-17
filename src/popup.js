$(document).ready(function() {

    var pubkey, privkey;
    var asym_key;

    console.log("popup.js started");
    openpgp.initWorker({path: "openpgp_es5/openpgp.worker.min.js"});
    console.log("Web Worker:" + openpgp.getWorker());
    openpgp.config.aead_protect = true;
    console.log("openpgp loaded");

    // if the key hasn't been genreated yet
    if (pubkey == null || privkey == null) {
        generate_asym_keys("matt", "p@ssw0rd").then(function(key) {
            asym_key = key;
            pubkey = key.publicKeyArmored;
        });

        var key = generate_sym_key();
    }

    $('#encrypt').click(function() {
        plaintext = $('#plaintext-msg').val(); // the plaintext to encrypt

        var ciphertext = encrypt_sym_message(plaintext, key);

        console.log("symmetric encryption: " + btoa(unescape(encodeURIComponent(ciphertext))));

        var decrypted = decrypt_sym_message(ciphertext, key);

        console.log("symmetric decrypted: " + decrypted);

        var encrypted;

        encrypt_asym_message(plaintext, pubkey).then(function(ciphertext) {
            encrypted = ciphertext.message.packets.write();
            console.log("asymmetric encryption: " + btoa(unescape(encodeURIComponent(ciphertext.message.packets.write()))));
            
            asym_key.key.decrypt("p@ssw0rd");

            decrypt_asym_message(encrypted, asym_key).then(function(plaintext) {
                console.log("plaintext decrypted: " + plaintext);
            });
        });


    });
});
