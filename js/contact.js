/* ============================================================
   VERTEX ACADEMY — contact.js
   Client-side validation for the enquiry form. No backend: on
   successful validation we show a confirmation message and
   build an optional WhatsApp deep link. Nothing here claims the
   enquiry was saved to a database.
   ============================================================ */
(function () {
  "use strict";

  /* Replace with the institute's real WhatsApp business number,
     in international format without symbols, e.g. 919876543210 */
  var WHATSAPP_NUMBER = "919999999999";

  function showError(field, message) {
    field.classList.add("invalid");
    var msg = field.querySelector(".error-msg");
    if (msg) msg.textContent = message;
  }
  function clearError(field) {
    field.classList.remove("invalid");
  }

  function validate(form) {
    var valid = true;

    var name = form.querySelector("#f-name");
    var nameField = name.closest(".form-field");
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(nameField, "Please enter your full name.");
      valid = false;
    } else clearError(nameField);

    var phone = form.querySelector("#f-phone");
    var phoneField = phone.closest(".form-field");
    var phoneDigits = phone.value.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      showError(phoneField, "Please enter a valid 10-digit phone number.");
      valid = false;
    } else clearError(phoneField);

    var cls = form.querySelector("#f-class");
    var clsField = cls.closest(".form-field");
    if (!cls.value) {
      showError(clsField, "Please select a class or exam.");
      valid = false;
    } else clearError(clsField);

    var course = form.querySelector("#f-course");
    var courseField = course.closest(".form-field");
    if (!course.value) {
      showError(courseField, "Please select a course.");
      valid = false;
    } else clearError(courseField);

    var message = form.querySelector("#f-message");
    var messageField = message.closest(".form-field");
    if (message.value.trim().length > 500) {
      showError(messageField, "Message is too long — please keep it under 500 characters.");
      valid = false;
    } else clearError(messageField);

    return valid;
  }

  function buildWhatsAppLink(data) {
    var text =
      "New admission enquiry\n" +
      "Name: " + data.name + "\n" +
      "Phone: " + data.phone + "\n" +
      "Class/Exam: " + data.cls + "\n" +
      "Course: " + data.course +
      (data.message ? "\nMessage: " + data.message : "");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-enquiry-form]");
    if (!form) return;
    var success = document.querySelector("[data-form-success]");
    var whatsappLink = document.querySelector("[data-whatsapp-followup]");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;

      var data = {
        name: form.querySelector("#f-name").value.trim(),
        phone: form.querySelector("#f-phone").value.trim(),
        cls: form.querySelector("#f-class").value,
        course: form.querySelector("#f-course").value,
        message: form.querySelector("#f-message").value.trim()
      };

      if (success) {
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus({ preventScroll: false });
      }
      if (whatsappLink) {
        whatsappLink.href = buildWhatsAppLink(data);
        whatsappLink.style.display = "inline-flex";
      }
      form.reset();
    });
  });
})();
