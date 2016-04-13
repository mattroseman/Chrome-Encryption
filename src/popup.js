$(document).ready(function() {
    openpgp.initWorker({path: "openpgp_es5/openpgp.worker.min.js"});
    openpgp.config.aead_protect = true;

    $('.encrypt').click(function() {
        plaintext = $('plaintext-msg').val(); // the plaintext to encrypt
        console.log(plaintext);
        var encrypted;
        options = {
            data: plaintext
        };
        openpgp.encrypt(options).then(function(ciphertext) {
            encrypted = ciphertext.data;
        });

        console.log(encrypted);

        $('plaintext-msg').val(encrypted);
    });
});
