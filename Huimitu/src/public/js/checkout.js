var stripe = Stripe('pk_test_51LFYa0Hwma8KeAihhqPDJk8BKKvixj8A1D1U9UpdcaoIfUwQolWRn2ihPRbXvlpRu6gchPV10TOAT6LHTh5QAKKP00jzZjzfNr');

var $form = $('#checkout-form');

var elements = stripe.elements();

var cardElement = elements.create('card', {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: 'Helvetica Neue',
        fontSize: '15px',
  
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    }
});

cardElement.mount('#card-element');

$form.submit(function(event) {
    $('#charge-error').addClass('d-none');
    $form.find('button').prop('disabled', true);

    var options = {
        name: $('#fullName').val(),
        address_line1: $('#address').val(),
        address_city: $('#city').val(),
        address_state: $('#state').val(),
        address_zip: $('#zipCode').val(),
        address_country: $('#country').val(),
    };

    stripe.createToken(cardElement, options).then(stripeResponseHandler);
    return false;
});

function stripeResponseHandler(response) {
    if(response.token) { // Token was created!

        // Get the token ID:
        var token = response.token.id;
        
        // Insert token into form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

    } else if(response.error) { // PROBLEM

        //Show error msg on form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('d-none');
        $form.find('button').prop('disabled', false);   // Re-enable submission

    }    
};