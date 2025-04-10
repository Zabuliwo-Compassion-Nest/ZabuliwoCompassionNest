$(function () {
    // Apply validation to contactForm, volunteerForm, and newsletterForm
    $("#contactForm input, #contactForm textarea, #volunteerForm input, #volunteerForm textarea, #newsletterForm input").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // Determine which form is being submitted and target its success div
            var successDivId = $form.attr('id') === 'newsletterForm' ? '#newsletter-success' : '#success';
            $(successDivId).html("<div class='alert alert-danger'>");
            $(successDivId + ' > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button>");
            $(successDivId + ' > .alert-danger').append("<strong>Please fill out all required fields correctly.</strong>");
            $(successDivId + ' > .alert-danger').append('</div>');
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // Prevent default form submission

            // Determine which form is being submitted
            var formId = $form.attr('id');
            var successDivId = formId === 'newsletterForm' ? '#newsletter-success' : '#success';
            var submitButtonId = formId === 'newsletterForm' ? '#submitNewsletterButton' : (formId === 'volunteerForm' ? '#submitVolunteerButton' : '#sendMessageButton');

            // Collect form data based on the form
            var data = {};
            if (formId === 'contactForm') {
                data.name = $("input#name", $form).val();
                data.email = $("input#email", $form).val();
                data.subject = $("input#subject", $form).val();
                data.message = $("textarea#message", $form).val();
            } else if (formId === 'volunteerForm') {
                data.name = $("input#name", $form).val();
                data.email = $("input#email", $form).val();
                data.message = $("textarea#message", $form).val();
                data.subject = "Volunteer Application"; // Default subject for volunteer form
            } else if (formId === 'newsletterForm') {
                data.email = $("input#newsletter-email", $form).val();
                data.subject = "Newsletter Subscription"; // Default subject for newsletter form
                data.message = "User subscribed to the newsletter.";
            }

            var $this = $(submitButtonId);
            $this.prop("disabled", true); // Disable the submit button during submission

            // Send data to contact.php via AJAX
            $.ajax({
                url: "contact.php",
                type: "POST",
                data: data,
                dataType: "json", // Expect JSON response
                cache: false,
                success: function (response) {
                    $(successDivId).html("<div class='alert alert-success'>");
                    $(successDivId + ' > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button>");
                    $(successDivId + ' > .alert-success').append("<strong>" + response.message + "</strong>");
                    $(successDivId + ' > .alert-success').append('</div>');
                    $form.trigger("reset");
                },
                error: function (xhr) {
                    var errorMessage = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "Sorry, it seems that our mail server is not responding. Please try again later!";
                    $(successDivId).html("<div class='alert alert-danger'>");
                    $(successDivId + ' > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button>");
                    $(successDivId + ' > .alert-danger').append($("<strong>").text(errorMessage));
                    $(successDivId + ' > .alert-danger').append('</div>');
                    $form.trigger("reset");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false);
                    }, 1000);
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$('#name, #newsletter-email').focus(function () {
    // Clear the success/error message when focusing on the name or email field
    var successDivId = $(this).closest('form').attr('id') === 'newsletterForm' ? '#newsletter-success' : '#success';
    $(successDivId).html('');
});